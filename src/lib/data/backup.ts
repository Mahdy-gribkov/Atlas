import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

export interface BackupData {
  collection: string;
  documents: any[];
  timestamp: Date;
  version: string;
  metadata: BackupMetadata;
}

export interface BackupMetadata {
  totalDocuments: number;
  totalSize: number;
  collections: string[];
  environment: string;
  backupType: 'full' | 'incremental';
  previousBackupId?: string;
}

export interface BackupResult {
  success: boolean;
  backupId: string;
  duration: number;
  totalDocuments: number;
  totalSize: number;
  error?: string;
}

export interface RestoreResult {
  success: boolean;
  restoredDocuments: number;
  duration: number;
  error?: string;
}

export class BackupManager {
  private static instance: BackupManager;
  private db: any;
  private version: string = '1.0.0';

  private constructor() {
    this.db = adminDb;
  }

  public static getInstance(): BackupManager {
    if (!BackupManager.instance) {
      BackupManager.instance = new BackupManager();
    }
    return BackupManager.instance;
  }

  /**
   * Create a full backup of all collections
   */
  async createFullBackup(): Promise<BackupResult> {
    const startTime = Date.now();
    const backupId = `backup-${Date.now()}`;
    
    try {
      console.log(`Starting full backup: ${backupId}`);
      
      const collections = [
        'users',
        'chatSessions', 
        'itineraries',
        'conversations',
        'priceAlerts',
        'expenses',
        'travelGuides',
        'migrations'
      ];

      const backupData: BackupData[] = [];
      let totalDocuments = 0;
      let totalSize = 0;

      for (const collectionName of collections) {
        try {
          console.log(`Backing up collection: ${collectionName}`);
          
          const snapshot = await this.db.collection(collectionName).get();
          const documents = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          const collectionSize = JSON.stringify(documents).length;
          totalDocuments += documents.length;
          totalSize += collectionSize;

          backupData.push({
            collection: collectionName,
            documents,
            timestamp: new Date(),
            version: this.version,
            metadata: {
              totalDocuments: documents.length,
              totalSize: collectionSize,
              collections: [collectionName],
              environment: process.env.NODE_ENV || 'development',
              backupType: 'full',
            }
          });

          console.log(`Backed up ${documents.length} documents from ${collectionName} (${collectionSize} bytes)`);
        } catch (error) {
          console.error(`Failed to backup collection ${collectionName}:`, error);
          throw error;
        }
      }

      // Store backup metadata
      const metadata: BackupMetadata = {
        totalDocuments,
        totalSize,
        collections,
        environment: process.env.NODE_ENV || 'development',
        backupType: 'full',
      };

      await this.storeBackupMetadata(backupId, metadata);

      // Store backup data
      for (const collectionBackup of backupData) {
        await this.storeBackupData(backupId, collectionBackup);
      }

      const duration = Date.now() - startTime;
      console.log(`Full backup ${backupId} completed in ${duration}ms`);

      return {
        success: true,
        backupId,
        duration,
        totalDocuments,
        totalSize,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      console.error(`Backup ${backupId} failed:`, error);
      
      return {
        success: false,
        backupId,
        duration,
        totalDocuments: 0,
        totalSize: 0,
        error: errorMessage,
      };
    }
  }

  /**
   * Create an incremental backup (only changed documents since last backup)
   */
  async createIncrementalBackup(lastBackupId: string): Promise<BackupResult> {
    const startTime = Date.now();
    const backupId = `backup-${Date.now()}`;
    
    try {
      console.log(`Starting incremental backup: ${backupId}`);
      
      // Get last backup timestamp
      const lastBackup = await this.getBackupMetadata(lastBackupId);
      if (!lastBackup) {
        throw new Error(`Last backup ${lastBackupId} not found`);
      }

      const lastBackupTime = lastBackup.timestamp;
      const collections = [
        'users',
        'chatSessions', 
        'itineraries',
        'conversations',
        'priceAlerts',
        'expenses',
        'travelGuides'
      ];

      const backupData: BackupData[] = [];
      let totalDocuments = 0;
      let totalSize = 0;

      for (const collectionName of collections) {
        try {
          console.log(`Backing up changed documents in collection: ${collectionName}`);
          
          // Query for documents modified since last backup
          const snapshot = await this.db.collection(collectionName)
            .where('updatedAt', '>', lastBackupTime)
            .get();
          
          const documents = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          if (documents.length > 0) {
            const collectionSize = JSON.stringify(documents).length;
            totalDocuments += documents.length;
            totalSize += collectionSize;

            backupData.push({
              collection: collectionName,
              documents,
              timestamp: new Date(),
              version: this.version,
              metadata: {
                totalDocuments: documents.length,
                totalSize: collectionSize,
                collections: [collectionName],
                environment: process.env.NODE_ENV || 'development',
                backupType: 'incremental',
                previousBackupId: lastBackupId,
              }
            });

            console.log(`Backed up ${documents.length} changed documents from ${collectionName}`);
          }
        } catch (error) {
          console.error(`Failed to backup collection ${collectionName}:`, error);
          throw error;
        }
      }

      // Store backup metadata
      const metadata: BackupMetadata = {
        totalDocuments,
        totalSize,
        collections,
        environment: process.env.NODE_ENV || 'development',
        backupType: 'incremental',
        previousBackupId: lastBackupId,
      };

      await this.storeBackupMetadata(backupId, metadata);

      // Store backup data
      for (const collectionBackup of backupData) {
        await this.storeBackupData(backupId, collectionBackup);
      }

      const duration = Date.now() - startTime;
      console.log(`Incremental backup ${backupId} completed in ${duration}ms`);

      return {
        success: true,
        backupId,
        duration,
        totalDocuments,
        totalSize,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      console.error(`Incremental backup ${backupId} failed:`, error);
      
      return {
        success: false,
        backupId,
        duration,
        totalDocuments: 0,
        totalSize: 0,
        error: errorMessage,
      };
    }
  }

  /**
   * Restore from a backup
   */
  async restoreBackup(backupId: string): Promise<RestoreResult> {
    const startTime = Date.now();
    
    try {
      console.log(`Starting restore from backup: ${backupId}`);
      
      // Get backup metadata
      const backupMetadata = await this.getBackupMetadata(backupId);
      if (!backupMetadata) {
        throw new Error(`Backup ${backupId} not found`);
      }

      console.log(`Restoring backup: ${backupId}`);
      let restoredDocuments = 0;

      // Restore each collection
      for (const collectionName of backupMetadata.collections) {
        const backupDataDoc = await this.db.collection('backupData').doc(`${backupId}-${collectionName}`).get();
        
        if (backupDataDoc.exists) {
          const backupData = backupDataDoc.data();
          
          // Clear existing collection (optional - be careful!)
          // await this.clearCollection(collectionName);
          
          // Restore documents
          const batch = this.db.batch();
          for (const doc of backupData.documents) {
            const docRef = this.db.collection(collectionName).doc(doc.id);
            batch.set(docRef, doc);
            restoredDocuments++;
          }
          
          await batch.commit();
          console.log(`Restored ${backupData.documents.length} documents to ${collectionName}`);
        }
      }

      const duration = Date.now() - startTime;
      console.log(`Backup ${backupId} restored successfully in ${duration}ms`);

      return {
        success: true,
        restoredDocuments,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      console.error(`Failed to restore backup ${backupId}:`, error);
      
      return {
        success: false,
        restoredDocuments: 0,
        duration,
        error: errorMessage,
      };
    }
  }

  /**
   * List all available backups
   */
  async listBackups(): Promise<any[]> {
    try {
      const snapshot = await this.db.collection('backups').orderBy('timestamp', 'desc').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  }

  /**
   * Delete a backup
   */
  async deleteBackup(backupId: string): Promise<boolean> {
    try {
      // Delete backup metadata
      await this.db.collection('backups').doc(backupId).delete();
      
      // Delete backup data
      const backupDataSnapshot = await this.db.collection('backupData')
        .where('__name__', '>=', `${backupId}-`)
        .where('__name__', '<', `${backupId}-z`)
        .get();

      const batch = this.db.batch();
      backupDataSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`Backup ${backupId} deleted successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to delete backup ${backupId}:`, error);
      return false;
    }
  }

  /**
   * Schedule automatic backups
   */
  async scheduleBackups(): Promise<void> {
    // This would integrate with a cron service or scheduler
    console.log('Backup scheduling configured');
    
    // In a real implementation, you might:
    // 1. Use a cron library like node-cron
    // 2. Integrate with cloud scheduler services
    // 3. Use a job queue like Bull or Agenda
  }

  /**
   * Store backup metadata
   */
  private async storeBackupMetadata(backupId: string, metadata: BackupMetadata): Promise<void> {
    await this.db.collection('backups').doc(backupId).set({
      id: backupId,
      timestamp: new Date(),
      version: this.version,
      ...metadata,
      status: 'completed'
    });
  }

  /**
   * Store backup data
   */
  private async storeBackupData(backupId: string, backupData: BackupData): Promise<void> {
    await this.db.collection('backupData').doc(`${backupId}-${backupData.collection}`).set(backupData);
  }

  /**
   * Get backup metadata
   */
  private async getBackupMetadata(backupId: string): Promise<any | null> {
    try {
      const doc = await this.db.collection('backups').doc(backupId).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error(`Failed to get backup metadata for ${backupId}:`, error);
      return null;
    }
  }

  /**
   * Clear a collection (use with caution!)
   */
  private async clearCollection(collectionName: string): Promise<void> {
    const snapshot = await this.db.collection(collectionName).get();
    const batch = this.db.batch();
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  }

  /**
   * Validate backup integrity
   */
  async validateBackup(backupId: string): Promise<boolean> {
    try {
      const backupMetadata = await this.getBackupMetadata(backupId);
      if (!backupMetadata) {
        return false;
      }

      // Check if all collection data exists
      for (const collectionName of backupMetadata.collections) {
        const backupDataDoc = await this.db.collection('backupData').doc(`${backupId}-${collectionName}`).get();
        if (!backupDataDoc.exists) {
          console.error(`Backup data missing for collection ${collectionName}`);
          return false;
        }
      }

      console.log(`Backup ${backupId} validation passed`);
      return true;
    } catch (error) {
      console.error(`Backup ${backupId} validation failed:`, error);
      return false;
    }
  }
}

// Global backup manager instance
export const backupManager = BackupManager.getInstance();
