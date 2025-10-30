export interface ApiCall {
  id: string;
  method: string;
  url: string;
  status?: number;
  duration: number;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: string;
  responseBody?: string;
  timestamp: number;
  error?: string;
}

export type FilterKey = 'all' | 'success' | 'errors' | 'pending';
