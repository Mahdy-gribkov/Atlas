import { adminDb } from '@/lib/firebase/admin';
import { User, UserPreferences } from '@/types';
import { createUserSchema, updateUserSchema } from '@/lib/validations/schemas';

export class UserService {
  private collection = adminDb?.collection('users');

  async createUser(userData: any): Promise<User> {
    const validatedData = createUserSchema.parse(userData);
    
    const user: User = {
      id: validatedData.email, // Using email as ID for simplicity
      email: validatedData.email,
      name: validatedData.name,
      role: validatedData.role,
      preferences: (validatedData.preferences || this.getDefaultPreferences()) as UserPreferences,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.collection.doc(user.id).set(user);
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const doc = await this.collection.doc(email).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as User;
  }

  async updateUser(id: string, updateData: any): Promise<User> {
    const validatedData = updateUserSchema.parse(updateData);
    
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser: User = {
      ...user,
      ...validatedData,
      updatedAt: new Date(),
    } as User;

    await this.collection.doc(id).update(validatedData);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit;
    
    const snapshot = await this.collection
      .offset(offset)
      .limit(limit)
      .get();

    const users = snapshot.docs.map((doc: any) => doc.data() as User);
    
    const totalSnapshot = await this.collection.get();
    const total = totalSnapshot.size;

    return { users, total };
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      language: 'en',
      timezone: 'UTC',
      currency: 'USD',
      travelStyle: {
        budget: 'mid-range',
        pace: 'moderate',
        accommodation: 'hotel',
        transportation: 'public',
        groupSize: 'solo',
      },
      interests: [],
      accessibility: {
        mobility: false,
        visual: false,
        hearing: false,
        cognitive: false,
        notes: '',
      },
      dietary: {
        restrictions: [],
        allergies: [],
        preferences: [],
      },
    };
  }
}
