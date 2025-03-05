export interface MessageProtocol {
  version: '1.0.0';
  event: 'message' | 'system' | 'error';
  payload: {
    id: string;
    timestamp: number;
    sender?: {
      id: string;
      name: string;
    };
    content: string;
    meta?: Record<string, any>;
  };
  code: number;
}

export type MessageEvent = 'message' | 'system' | 'heartbeat' | 'heartbeat_ack';
