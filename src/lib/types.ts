export type ProcessStatus = 'running' | 'delayed' | 'optimized' | 'stopped';

export interface Process {
  id: string;
  name: string;
  cpu: number; // Percentage 0-100
  memory: number; // MB
  disk: number; // MB/s
  status: ProcessStatus;
  isSystem: boolean; // Whitelisted
  startTime: number; // Seconds after boot
}

export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: string;
}

export interface OptimizationRule {
  id: string;
  processName: string;
  action: 'delay' | 'optimize' | 'ignore';
  delaySeconds?: number;
}

export interface SystemState {
  bootTime: number; // Timestamp of boot
  elapsedSeconds: number;
  isBoostActive: boolean;
  cpuTotal: number;
  memoryTotal: number;
  diskTotal: number;
  processes: Process[];
  logs: SystemLog[];
  rules: OptimizationRule[];
  
  // Actions
  tick: () => void;
  optimizeProcess: (id: string) => void;
  delayProcess: (id: string, seconds: number) => void;
  killProcess: (id: string) => void;
  resetSimulation: () => void;
}
