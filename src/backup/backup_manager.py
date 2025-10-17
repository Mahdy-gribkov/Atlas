"""
Backup management system for the Travel AI Agent.
Provides automated database and configuration backups.
"""

import asyncio
import os
import shutil
import json
import gzip
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from pathlib import Path
import sqlite3

logger = logging.getLogger(__name__)

class BackupManager:
    """Manages automated backups of the Travel AI Agent."""
    
    def __init__(self, backup_dir: str = "backups"):
        self.backup_dir = Path(backup_dir)
        self.backup_dir.mkdir(exist_ok=True)
        
        # Backup retention settings
        self.max_backups = 30  # Keep last 30 backups
        self.backup_interval_hours = 24  # Daily backups
        
    async def create_full_backup(self) -> Dict[str, Any]:
        """Create a full system backup."""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_name = f"travel_agent_backup_{timestamp}"
            backup_path = self.backup_dir / backup_name
            backup_path.mkdir(exist_ok=True)
            
            backup_info = {
                'timestamp': timestamp,
                'backup_name': backup_name,
                'backup_path': str(backup_path),
                'components': []
            }
            
            # 1. Backup database
            db_backup = await self._backup_database(backup_path)
            if db_backup:
                backup_info['components'].append(db_backup)
            
            # 2. Backup configuration files
            config_backup = await self._backup_config(backup_path)
            if config_backup:
                backup_info['components'].append(config_backup)
            
            # 3. Backup logs
            logs_backup = await self._backup_logs(backup_path)
            if logs_backup:
                backup_info['components'].append(logs_backup)
            
            # 4. Create backup manifest
            manifest_path = backup_path / "backup_manifest.json"
            with open(manifest_path, 'w') as f:
                json.dump(backup_info, f, indent=2)
            
            # 5. Compress backup
            compressed_path = await self._compress_backup(backup_path)
            if compressed_path:
                # Remove uncompressed backup
                shutil.rmtree(backup_path)
                backup_info['compressed_path'] = str(compressed_path)
            
            # 6. Clean old backups
            await self._cleanup_old_backups()
            
            logger.info(f"Full backup created: {backup_name}")
            return backup_info
            
        except Exception as e:
            logger.error(f"Backup creation failed: {e}")
            return {'error': str(e)}
    
    async def _backup_database(self, backup_path: Path) -> Optional[Dict[str, Any]]:
        """Backup the SQLite database."""
        try:
            db_path = Path("data/travel_agent.db")
            if not db_path.exists():
                logger.warning("Database file not found, skipping database backup")
                return None
            
            # Create database backup directory
            db_backup_dir = backup_path / "database"
            db_backup_dir.mkdir(exist_ok=True)
            
            # Copy database file
            backup_db_path = db_backup_dir / "travel_agent.db"
            shutil.copy2(db_path, backup_db_path)
            
            # Get database info
            db_info = await self._get_database_info(db_path)
            
            return {
                'type': 'database',
                'source_path': str(db_path),
                'backup_path': str(backup_db_path),
                'size_bytes': backup_db_path.stat().st_size,
                'info': db_info
            }
            
        except Exception as e:
            logger.error(f"Database backup failed: {e}")
            return None
    
    async def _get_database_info(self, db_path: Path) -> Dict[str, Any]:
        """Get database information."""
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Get table information
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = [row[0] for row in cursor.fetchall()]
            
            # Get row counts
            table_counts = {}
            for table in tables:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                table_counts[table] = cursor.fetchone()[0]
            
            conn.close()
            
            return {
                'tables': tables,
                'table_counts': table_counts,
                'total_tables': len(tables)
            }
            
        except Exception as e:
            logger.error(f"Database info retrieval failed: {e}")
            return {'error': str(e)}
    
    async def _backup_config(self, backup_path: Path) -> Optional[Dict[str, Any]]:
        """Backup configuration files."""
        try:
            config_backup_dir = backup_path / "config"
            config_backup_dir.mkdir(exist_ok=True)
            
            config_files = [
                "production.env",
                "env.example",
                "requirements.txt",
                "docker-compose.yml",
                "docker-compose.dev.yml",
                "Dockerfile",
                "Dockerfile.dev"
            ]
            
            backed_up_files = []
            for config_file in config_files:
                if os.path.exists(config_file):
                    backup_file_path = config_backup_dir / config_file
                    shutil.copy2(config_file, backup_file_path)
                    backed_up_files.append({
                        'source': config_file,
                        'backup': str(backup_file_path),
                        'size': backup_file_path.stat().st_size
                    })
            
            return {
                'type': 'config',
                'files': backed_up_files,
                'total_files': len(backed_up_files)
            }
            
        except Exception as e:
            logger.error(f"Config backup failed: {e}")
            return None
    
    async def _backup_logs(self, backup_path: Path) -> Optional[Dict[str, Any]]:
        """Backup log files."""
        try:
            logs_backup_dir = backup_path / "logs"
            logs_backup_dir.mkdir(exist_ok=True)
            
            # Find log files
            log_files = []
            for root, dirs, files in os.walk("."):
                for file in files:
                    if file.endswith('.log'):
                        log_files.append(os.path.join(root, file))
            
            backed_up_logs = []
            for log_file in log_files:
                try:
                    backup_log_path = logs_backup_dir / os.path.basename(log_file)
                    shutil.copy2(log_file, backup_log_path)
                    backed_up_logs.append({
                        'source': log_file,
                        'backup': str(backup_log_path),
                        'size': backup_log_path.stat().st_size
                    })
                except Exception as e:
                    logger.warning(f"Failed to backup log file {log_file}: {e}")
            
            return {
                'type': 'logs',
                'files': backed_up_logs,
                'total_files': len(backed_up_logs)
            }
            
        except Exception as e:
            logger.error(f"Logs backup failed: {e}")
            return None
    
    async def _compress_backup(self, backup_path: Path) -> Optional[Path]:
        """Compress the backup directory."""
        try:
            compressed_path = Path(f"{backup_path}.tar.gz")
            
            # Create tar.gz archive
            import tarfile
            with tarfile.open(compressed_path, "w:gz") as tar:
                tar.add(backup_path, arcname=backup_path.name)
            
            return compressed_path
            
        except Exception as e:
            logger.error(f"Backup compression failed: {e}")
            return None
    
    async def _cleanup_old_backups(self):
        """Remove old backups to maintain retention policy."""
        try:
            # Get all backup files
            backup_files = []
            for file_path in self.backup_dir.glob("travel_agent_backup_*.tar.gz"):
                backup_files.append(file_path)
            
            # Sort by modification time (newest first)
            backup_files.sort(key=lambda x: x.stat().st_mtime, reverse=True)
            
            # Remove old backups
            if len(backup_files) > self.max_backups:
                for old_backup in backup_files[self.max_backups:]:
                    old_backup.unlink()
                    logger.info(f"Removed old backup: {old_backup.name}")
            
        except Exception as e:
            logger.error(f"Backup cleanup failed: {e}")
    
    async def restore_backup(self, backup_name: str) -> Dict[str, Any]:
        """Restore from a backup."""
        try:
            backup_path = self.backup_dir / f"{backup_name}.tar.gz"
            if not backup_path.exists():
                return {'error': f'Backup {backup_name} not found'}
            
            # Extract backup
            import tarfile
            extract_path = self.backup_dir / f"restore_{backup_name}"
            extract_path.mkdir(exist_ok=True)
            
            with tarfile.open(backup_path, "r:gz") as tar:
                tar.extractall(extract_path)
            
            # Read backup manifest
            manifest_path = extract_path / backup_name / "backup_manifest.json"
            if manifest_path.exists():
                with open(manifest_path, 'r') as f:
                    manifest = json.load(f)
                
                # Restore components
                restore_results = []
                for component in manifest.get('components', []):
                    if component['type'] == 'database':
                        result = await self._restore_database(extract_path / backup_name / "database")
                        restore_results.append(result)
                    elif component['type'] == 'config':
                        result = await self._restore_config(extract_path / backup_name / "config")
                        restore_results.append(result)
                
                # Clean up extracted files
                shutil.rmtree(extract_path)
                
                return {
                    'status': 'success',
                    'backup_name': backup_name,
                    'restored_components': restore_results
                }
            else:
                return {'error': 'Backup manifest not found'}
                
        except Exception as e:
            logger.error(f"Backup restore failed: {e}")
            return {'error': str(e)}
    
    async def _restore_database(self, db_backup_path: Path) -> Dict[str, Any]:
        """Restore database from backup."""
        try:
            backup_db_path = db_backup_path / "travel_agent.db"
            if not backup_db_path.exists():
                return {'error': 'Database backup file not found'}
            
            # Create backup of current database
            current_db_path = Path("data/travel_agent.db")
            if current_db_path.exists():
                backup_current_path = Path("data/travel_agent.db.backup")
                shutil.copy2(current_db_path, backup_current_path)
            
            # Restore database
            shutil.copy2(backup_db_path, current_db_path)
            
            return {
                'type': 'database',
                'status': 'restored',
                'backup_created': str(backup_current_path) if current_db_path.exists() else None
            }
            
        except Exception as e:
            return {'type': 'database', 'error': str(e)}
    
    async def _restore_config(self, config_backup_path: Path) -> Dict[str, Any]:
        """Restore configuration files from backup."""
        try:
            restored_files = []
            for config_file in config_backup_path.iterdir():
                if config_file.is_file():
                    # Create backup of current file
                    if os.path.exists(config_file.name):
                        shutil.copy2(config_file.name, f"{config_file.name}.backup")
                    
                    # Restore file
                    shutil.copy2(config_file, config_file.name)
                    restored_files.append(config_file.name)
            
            return {
                'type': 'config',
                'status': 'restored',
                'files': restored_files
            }
            
        except Exception as e:
            return {'type': 'config', 'error': str(e)}
    
    def list_backups(self) -> List[Dict[str, Any]]:
        """List available backups."""
        try:
            backups = []
            for backup_file in self.backup_dir.glob("travel_agent_backup_*.tar.gz"):
                stat = backup_file.stat()
                backups.append({
                    'name': backup_file.stem,
                    'size_mb': round(stat.st_size / (1024 * 1024), 2),
                    'created': datetime.fromtimestamp(stat.st_ctime).isoformat(),
                    'modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
                })
            
            # Sort by creation time (newest first)
            backups.sort(key=lambda x: x['created'], reverse=True)
            return backups
            
        except Exception as e:
            logger.error(f"Backup listing failed: {e}")
            return []
    
    async def schedule_automatic_backups(self):
        """Schedule automatic backups."""
        while True:
            try:
                # Wait for backup interval
                await asyncio.sleep(self.backup_interval_hours * 3600)
                
                # Create backup
                logger.info("Starting scheduled backup...")
                backup_result = await self.create_full_backup()
                
                if 'error' in backup_result:
                    logger.error(f"Scheduled backup failed: {backup_result['error']}")
                else:
                    logger.info(f"Scheduled backup completed: {backup_result['backup_name']}")
                    
            except Exception as e:
                logger.error(f"Scheduled backup error: {e}")
                # Wait a bit before retrying
                await asyncio.sleep(3600)  # 1 hour

# Global backup manager instance
backup_manager = BackupManager()
