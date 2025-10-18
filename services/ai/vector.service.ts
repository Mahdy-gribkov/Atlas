import { GeminiService } from './gemini.service';

export interface Document {
  id: string;
  content: string;
  metadata: {
    [key: string]: any;
  };
}

export interface SearchResult {
  id: string;
  content: string;
  metadata: Document['metadata'];
  score?: number;
}

export class VectorService {
  private geminiService: GeminiService;
  private indexName: string;
  private isInitialized: boolean = false;
  private documents: Map<string, Document> = new Map();
  private embeddings: Map<string, number[]> = new Map();

  constructor() {
    this.geminiService = new GeminiService();
    this.indexName = process.env.PINECONE_INDEX_NAME || 'travel-agent-embeddings';
  }

  async initializeIndex(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Initialize with sample data if no documents exist
      if (this.documents.size === 0) {
        await this.loadSampleData();
      }
      
      this.isInitialized = true;
      console.log(`Vector service initialized with ${this.documents.size} documents`);
    } catch (error) {
      console.error('Failed to initialize vector service:', error);
      throw error;
    }
  }

  async embedDocument(text: string): Promise<number[]> {
    try {
      // Use Gemini service to generate embeddings
      const embedding = await this.geminiService.generateEmbedding(text);
      return embedding;
    } catch (error) {
      console.error('Failed to generate embedding:', error);
      // Fallback to a simple hash-based embedding for development
      return this.generateFallbackEmbedding(text);
    }
  }

  private generateFallbackEmbedding(text: string): number[] {
    // Simple hash-based embedding for development
    const hash = this.simpleHash(text);
    const embedding = Array.from({ length: 768 }, (_, i) => {
      const seed = (hash + i) % 1000;
      return (Math.sin(seed) + 1) / 2; // Normalize to 0-1
    });
    return embedding;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  async upsertDocuments(documents: Document[]): Promise<void> {
    try {
      for (const doc of documents) {
        // Generate embedding for the document
        const embedding = await this.embedDocument(doc.content);
        
        // Store document and embedding
        this.documents.set(doc.id, doc);
        this.embeddings.set(doc.id, embedding);
      }
      
      console.log(`Successfully upserted ${documents.length} documents`);
    } catch (error) {
      console.error('Failed to upsert documents:', error);
      throw error;
    }
  }

  async queryDocuments(query: string, topK: number = 5): Promise<SearchResult[]> {
    try {
      await this.initializeIndex();
      
      // Generate embedding for the query
      const queryEmbedding = await this.embedDocument(query);
      
      // Calculate similarities and return top results
      const results = await this.calculateSimilarities(queryEmbedding, topK);
      
      return results.map(result => ({
        id: result.document.id,
        content: result.document.content,
        metadata: result.document.metadata,
        score: result.score
      }));
    } catch (error) {
      console.error('Failed to query documents:', error);
      return [];
    }
  }

  async searchByType(type: string, query: string, options: { topK?: number } = {}): Promise<SearchResult[]> {
    try {
      await this.initializeIndex();
      
      const queryEmbedding = await this.embedDocument(query);
      const topK = options.topK || 5;
      
      // Filter documents by type and calculate similarities
      const filteredDocs = Array.from(this.documents.values())
        .filter(doc => doc.metadata.type === type);
      
      const results = await this.calculateSimilarities(queryEmbedding, topK, filteredDocs);
      
      return results.map(result => ({
        id: result.document.id,
        content: result.document.content,
        metadata: result.document.metadata,
        score: result.score
      }));
    } catch (error) {
      console.error('Failed to search by type:', error);
      return [];
    }
  }

  async searchByLocation(location: string, options: { topK?: number } = {}): Promise<SearchResult[]> {
    try {
      await this.initializeIndex();
      
      const queryEmbedding = await this.embedDocument(location);
      const topK = options.topK || 5;
      
      // Filter documents by location and calculate similarities
      const filteredDocs = Array.from(this.documents.values())
        .filter(doc => 
          doc.metadata.location?.toLowerCase().includes(location.toLowerCase()) ||
          doc.metadata.tags?.some((tag: string) => tag.toLowerCase().includes(location.toLowerCase()))
        );
      
      const results = await this.calculateSimilarities(queryEmbedding, topK, filteredDocs);
      
      return results.map(result => ({
        id: result.document.id,
        content: result.document.content,
        metadata: result.document.metadata,
        score: result.score
      }));
    } catch (error) {
      console.error('Failed to search by location:', error);
      return [];
    }
  }

  async searchSimilar(query: string, options: { topK?: number; filter?: any } = {}): Promise<SearchResult[]> {
    try {
      await this.initializeIndex();
      
      const queryEmbedding = await this.embedDocument(query);
      const topK = options.topK || 5;
      
      // Apply filters if provided
      let filteredDocs = Array.from(this.documents.values());
      if (options.filter) {
        filteredDocs = filteredDocs.filter(doc => {
          return Object.entries(options.filter).every(([key, value]) => {
            return doc.metadata[key] === value;
          });
        });
      }
      
      const results = await this.calculateSimilarities(queryEmbedding, topK, filteredDocs);
      
      return results.map(result => ({
        id: result.document.id,
        content: result.document.content,
        metadata: result.document.metadata,
        score: result.score
      }));
    } catch (error) {
      console.error('Failed to search similar:', error);
      return [];
    }
  }

  private async calculateSimilarities(
    queryEmbedding: number[], 
    topK: number, 
    documents: Document[] = Array.from(this.documents.values())
  ): Promise<{ document: Document; score: number }[]> {
    const similarities: { document: Document; score: number }[] = [];
    
    for (const doc of documents) {
      const docEmbedding = this.embeddings.get(doc.id);
      if (!docEmbedding) continue;
      
      const similarity = this.cosineSimilarity(queryEmbedding, docEmbedding);
      similarities.push({ document: doc, score: similarity });
    }
    
    // Sort by similarity score (descending) and return top K
    return similarities
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length');
    }
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
      for (let i = 0; i < a.length; i++) {
        const aVal = a[i] || 0;
        const bVal = b[i] || 0;
        dotProduct += aVal * bVal;
        normA += aVal * aVal;
        normB += bVal * bVal;
      }
    
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    
    if (normA === 0 || normB === 0) {
      return 0;
    }
    
    return dotProduct / (normA * normB);
  }

  private async loadSampleData(): Promise<void> {
    const sampleDocuments: Document[] = [
      {
        id: 'tokyo_guide_1',
        content: `Tokyo Travel Guide - Tokyo, Japan's bustling capital, is a fascinating blend of traditional culture and cutting-edge technology. Top attractions include Senso-ji Temple, Tokyo Skytree, Meiji Shrine, Tsukiji Outer Market, and Shibuya Crossing. Best areas to stay are Shibuya, Shinjuku, Asakusa, and Ginza. Transportation includes JR Yamanote Line, Tokyo Metro, and Suica cards. Food recommendations include ramen at Ichiran, sushi at Tsukiji, and tempura at Tempura Kondo.`,
        metadata: {
          title: 'Complete Tokyo Travel Guide',
          type: 'guide',
          location: 'Tokyo, Japan',
          tags: ['tokyo', 'japan', 'travel-guide', 'attractions', 'food', 'transportation'],
          source: 'travel-expert',
          createdAt: new Date(),
        },
      },
      {
        id: 'paris_attractions_1',
        content: `Paris Top Attractions - Paris, the City of Light, offers countless attractions including the Eiffel Tower, Notre-Dame Cathedral, Arc de Triomphe, Sacré-Cœur, and Louvre Museum. Museums include Musée d'Orsay, Centre Pompidou, and Musée Rodin. Neighborhoods to explore are Marais, Saint-Germain-des-Prés, Montmartre, and Latin Quarter. Day trips include Versailles Palace, Giverny, and Chartres.`,
        metadata: {
          title: 'Paris Attractions and Activities Guide',
          type: 'guide',
          location: 'Paris, France',
          tags: ['paris', 'france', 'attractions', 'museums', 'landmarks', 'culture'],
          source: 'travel-expert',
          createdAt: new Date(),
        },
      },
      {
        id: 'sustainable_travel_tips',
        content: `Sustainable Travel Guide - Travel responsibly with eco-friendly practices. Choose direct flights, use public transportation, stay in eco-certified hotels, eat locally-sourced food, visit eco-friendly attractions, buy locally-made products, respect local customs, reduce waste, conserve water and energy, support local communities, and protect wildlife.`,
        metadata: {
          title: 'Sustainable Travel Guide',
          type: 'guide',
          location: 'Global',
          tags: ['sustainable-travel', 'eco-friendly', 'environment', 'responsible-travel', 'green-tourism'],
          source: 'sustainability-expert',
          createdAt: new Date(),
        },
      },
      {
        id: 'accessibility_travel_guide',
        content: `Accessible Travel Guide - Travel should be accessible to everyone. Research accessibility features, contact hotels and attractions in advance, check airline policies for mobility equipment, plan for extra time, use accessible transportation, stay in accessible accommodations, visit accessible attractions, bring necessary equipment, learn communication methods, and know your rights.`,
        metadata: {
          title: 'Accessible Travel Guide',
          type: 'guide',
          location: 'Global',
          tags: ['accessible-travel', 'disability', 'mobility', 'inclusive-travel', 'accessibility'],
          source: 'accessibility-expert',
          createdAt: new Date(),
        },
      },
    ];

    await this.upsertDocuments(sampleDocuments);
  }

  async getIndexStats(): Promise<{ totalVectors: number; dimension: number; indexFullness: number }> {
    return {
      totalVectors: this.documents.size,
      dimension: 768,
      indexFullness: this.documents.size / 10000, // Assuming max 10k documents
    };
  }
}