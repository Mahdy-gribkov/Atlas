import { adminDb } from './admin';

export interface BackupData {
  collection: string;
  documents: any[];
  timestamp: Date;
  version: string;
}

export class FirestoreBackup {
  private db: any;
  private version: string = '1.0.0';

  constructor() {
    this.db = adminDb;
  }

  async createBackup(): Promise<BackupData[]> {
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

    for (const collectionName of collections) {
      try {
        console.log(`Backing up collection: ${collectionName}`);
        
        const snapshot = await this.db.collection(collectionName).get();
        const documents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        backupData.push({
          collection: collectionName,
          documents,
          timestamp: new Date(),
          version: this.version
        });

        console.log(`Backed up ${documents.length} documents from ${collectionName}`);
      } catch (error) {
        console.error(`Failed to backup collection ${collectionName}:`, error);
        throw error;
      }
    }

    return backupData;
  }

  async storeBackup(backupData: BackupData[]): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupId = `backup-${timestamp}`;
    
    // Store backup metadata
    await this.db.collection('backups').doc(backupId).set({
      id: backupId,
      timestamp: new Date(),
      version: this.version,
      collections: backupData.map(b => b.collection),
      totalDocuments: backupData.reduce((sum, b) => sum + b.documents.length, 0),
      status: 'completed'
    });

    // Store backup data
    for (const collectionBackup of backupData) {
      await this.db.collection('backupData').doc(`${backupId}-${collectionBackup.collection}`).set(collectionBackup);
    }

    console.log(`Backup stored with ID: ${backupId}`);
    return backupId;
  }

  async restoreBackup(backupId: string): Promise<void> {
    try {
      // Get backup metadata
      const backupDoc = await this.db.collection('backups').doc(backupId).get();
      if (!backupDoc.exists) {
        throw new Error(`Backup ${backupId} not found`);
      }

      const backup = backupDoc.data();
      console.log(`Restoring backup: ${backupId}`);

      // Restore each collection
      for (const collectionName of backup.collections) {
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
          }
          
          await batch.commit();
          console.log(`Restored ${backupData.documents.length} documents to ${collectionName}`);
        }
      }

      console.log(`Backup ${backupId} restored successfully`);
    } catch (error) {
      console.error(`Failed to restore backup ${backupId}:`, error);
      throw error;
    }
  }

  async listBackups(): Promise<any[]> {
    const snapshot = await this.db.collection('backups').orderBy('timestamp', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async deleteBackup(backupId: string): Promise<void> {
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
    } catch (error) {
      console.error(`Failed to delete backup ${backupId}:`, error);
      throw error;
    }
  }

  private async clearCollection(collectionName: string): Promise<void> {
    const snapshot = await this.db.collection(collectionName).get();
    const batch = this.db.batch();
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  }

  async scheduleBackup(cronExpression: string = '0 2 * * *'): Promise<void> {
    // This would integrate with a cron service or scheduler
    // For now, we'll just log the schedule
    console.log(`Backup scheduled with cron expression: ${cronExpression}`);
    
    // In a real implementation, you might:
    // 1. Use a cron library like node-cron
    // 2. Integrate with cloud scheduler services
    // 3. Use a job queue like Bull or Agenda
  }
}
