import { adminDb } from './admin';

export interface Migration {
  version: string;
  name: string;
  description: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

export class FirestoreMigration {
  private db: any;
  private migrations: Migration[] = [];

  constructor() {
    this.db = adminDb;
    this.registerMigrations();
  }

  private registerMigrations(): void {
    // Migration 1: Add conversationMemory to chatSessions
    this.migrations.push({
      version: '1.0.1',
      name: 'add_conversation_memory',
      description: 'Add conversationMemory field to chatSessions context',
      up: async () => {
        const chatSessions = await this.db.collection('chatSessions').get();
        const batch = this.db.batch();
        
        chatSessions.forEach((doc: any) => {
          const data = doc.data();
          if (!data.context?.conversationMemory) {
            batch.update(doc.ref, {
              'context.conversationMemory': [],
              'context.activeTools': data.context?.activeTools || [],
            });
          }
        });
        
        await batch.commit();
        console.log('Migration 1.0.1 completed: Added conversationMemory to chatSessions');
      },
      down: async () => {
        const chatSessions = await this.db.collection('chatSessions').get();
        const batch = this.db.batch();
        
        chatSessions.forEach((doc: any) => {
          batch.update(doc.ref, {
            'context.conversationMemory': null,
          });
        });
        
        await batch.commit();
        console.log('Migration 1.0.1 rolled back: Removed conversationMemory from chatSessions');
      }
    });

    // Migration 2: Add status field to itineraries
    this.migrations.push({
      version: '1.0.2',
      name: 'add_itinerary_status',
      description: 'Add status field to itineraries',
      up: async () => {
        const itineraries = await this.db.collection('itineraries').get();
        const batch = this.db.batch();
        
        itineraries.forEach((doc: any) => {
          const data = doc.data();
          if (!data.status) {
            batch.update(doc.ref, {
              status: 'draft',
            });
          }
        });
        
        await batch.commit();
        console.log('Migration 1.0.2 completed: Added status field to itineraries');
      },
      down: async () => {
        const itineraries = await this.db.collection('itineraries').get();
        const batch = this.db.batch();
        
        itineraries.forEach((doc: any) => {
          batch.update(doc.ref, {
            status: null,
          });
        });
        
        await batch.commit();
        console.log('Migration 1.0.2 rolled back: Removed status field from itineraries');
      }
    });

    // Migration 3: Add role field to users
    this.migrations.push({
      version: '1.0.3',
      name: 'add_user_role',
      description: 'Add role field to users',
      up: async () => {
        const users = await this.db.collection('users').get();
        const batch = this.db.batch();
        
        users.forEach((doc: any) => {
          const data = doc.data();
          if (!data.role) {
            batch.update(doc.ref, {
              role: 'user',
            });
          }
        });
        
        await batch.commit();
        console.log('Migration 1.0.3 completed: Added role field to users');
      },
      down: async () => {
        const users = await this.db.collection('users').get();
        const batch = this.db.batch();
        
        users.forEach((doc: any) => {
          batch.update(doc.ref, {
            role: null,
          });
        });
        
        await batch.commit();
        console.log('Migration 1.0.3 rolled back: Removed role field from users');
      }
    });
  }

  async getCurrentVersion(): Promise<string> {
    try {
      const versionDoc = await this.db.collection('migrations').doc('current').get();
      return versionDoc.exists ? versionDoc.data()?.version || '0.0.0' : '0.0.0';
    } catch (error) {
      console.error('Failed to get current migration version:', error);
      return '0.0.0';
    }
  }

  async setCurrentVersion(version: string): Promise<void> {
    await this.db.collection('migrations').doc('current').set({
      version,
      updatedAt: new Date(),
    });
  }

  async getPendingMigrations(): Promise<Migration[]> {
    const currentVersion = await this.getCurrentVersion();
    return this.migrations.filter(migration => 
      this.compareVersions(migration.version, currentVersion) > 0
    );
  }

  async migrate(): Promise<void> {
    const pendingMigrations = await this.getPendingMigrations();
    
    if (pendingMigrations.length === 0) {
      console.log('No pending migrations');
      return;
    }

    console.log(`Running ${pendingMigrations.length} pending migrations...`);

    for (const migration of pendingMigrations) {
      try {
        console.log(`Running migration ${migration.version}: ${migration.name}`);
        await migration.up();
        await this.setCurrentVersion(migration.version);
        console.log(`Migration ${migration.version} completed successfully`);
      } catch (error) {
        console.error(`Migration ${migration.version} failed:`, error);
        throw error;
      }
    }

    console.log('All migrations completed successfully');
  }

  async rollback(targetVersion: string): Promise<void> {
    const currentVersion = await this.getCurrentVersion();
    const migrationsToRollback = this.migrations
      .filter(migration => 
        this.compareVersions(migration.version, targetVersion) > 0 &&
        this.compareVersions(migration.version, currentVersion) <= 0
      )
      .reverse(); // Rollback in reverse order

    if (migrationsToRollback.length === 0) {
      console.log('No migrations to rollback');
      return;
    }

    console.log(`Rolling back ${migrationsToRollback.length} migrations to version ${targetVersion}...`);

    for (const migration of migrationsToRollback) {
      try {
        console.log(`Rolling back migration ${migration.version}: ${migration.name}`);
        await migration.down();
        await this.setCurrentVersion(migration.version);
        console.log(`Migration ${migration.version} rolled back successfully`);
      } catch (error) {
        console.error(`Rollback of migration ${migration.version} failed:`, error);
        throw error;
      }
    }

    console.log('All rollbacks completed successfully');
  }

  async getMigrationHistory(): Promise<any[]> {
    try {
      const snapshot = await this.db.collection('migrations').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Failed to get migration history:', error);
      return [];
    }
  }

  private compareVersions(version1: string, version2: string): number {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;
      
      if (v1Part > v2Part) return 1;
      if (v1Part < v2Part) return -1;
    }
    
    return 0;
  }

  async validateDataIntegrity(): Promise<boolean> {
    try {
      // Check if all users have required fields
      const users = await this.db.collection('users').get();
      for (const doc of users.docs) {
        const data = doc.data();
        if (!data.email || !data.name) {
          console.error(`User ${doc.id} missing required fields`);
          return false;
        }
      }

      // Check if all chatSessions have required fields
      const chatSessions = await this.db.collection('chatSessions').get();
      for (const doc of chatSessions.docs) {
        const data = doc.data();
        if (!data.userId || !data.messages) {
          console.error(`ChatSession ${doc.id} missing required fields`);
          return false;
        }
      }

      // Check if all itineraries have required fields
      const itineraries = await this.db.collection('itineraries').get();
      for (const doc of itineraries.docs) {
        const data = doc.data();
        if (!data.userId || !data.destination) {
          console.error(`Itinerary ${doc.id} missing required fields`);
          return false;
        }
      }

      console.log('Data integrity validation passed');
      return true;
    } catch (error) {
      console.error('Data integrity validation failed:', error);
      return false;
    }
  }
}
