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
}

export class VectorService {
  private geminiService: GeminiService;
  private indexName: string;

  constructor() {
    this.geminiService = new GeminiService();
    this.indexName = process.env.PINECONE_INDEX_NAME || 'travel-agent-embeddings';
  }

  async initializeIndex(): Promise<void> {
    console.log('Vector service initialized (mock mode)');
  }

  async embedDocument(text: string): Promise<number[]> {
    // Mock embedding - return random vector
    return Array.from({ length: 768 }, () => Math.random());
  }

  async upsertDocuments(documents: Document[]): Promise<void> {
    console.log(`Mock: Upserted ${documents.length} documents`);
  }

  async queryDocuments(query: string, topK: number = 5): Promise<Document[]> {
    // Mock search results
    return [
      {
        id: '1',
        content: `Mock search result for: ${query}`,
        metadata: { type: 'mock', relevance: 0.9 }
      }
    ];
  }

  async searchByType(type: string, query: string, options: { topK?: number } = {}): Promise<SearchResult[]> {
    return [
      {
        id: '1',
        content: `Mock ${type} result for: ${query}`,
        metadata: { type, relevance: 0.9 }
      }
    ];
  }

  async searchByLocation(location: string, options: { topK?: number } = {}): Promise<SearchResult[]> {
    return [
      {
        id: '1',
        content: `Mock location result for: ${location}`,
        metadata: { location, relevance: 0.9 }
      }
    ];
  }

  async searchSimilar(query: string, options: { topK?: number; filter?: any } = {}): Promise<SearchResult[]> {
    return [
      {
        id: '1',
        content: `Mock similar result for: ${query}`,
        metadata: { relevance: 0.9, ...options.filter }
      }
    ];
  }
}