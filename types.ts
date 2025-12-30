
export type RemoteAction = 
  | 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'SELECT' 
  | 'HOME' | 'BACK' | 'PLAY_PAUSE' | 'REWIND' | 'FAST_FORWARD'
  | 'VOLUME_UP' | 'VOLUME_DOWN' | 'MUTE' | 'POWER' | 'VOICE';

export interface EditorResponse {
  text: string;
  sentiment: 'positive' | 'neutral' | 'critical';
  sources?: Array<{ title: string; uri: string }>;
}

export interface ConnectionState {
  ip: string;
  isConnected: boolean;
  isConnecting: boolean;
}
