import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Process, SystemLog, SystemState, OptimizationRule } from './types';

const INITIAL_PROCESSES: Process[] = [
  { id: '1', name: 'System', cpu: 5, memory: 1500, disk: 2, status: 'running', isSystem: true, startTime: 0 },
  { id: '2', name: 'Registry', cpu: 2, memory: 200, disk: 50, status: 'running', isSystem: true, startTime: 0 },
  { id: '3', name: 'explorer.exe', cpu: 15, memory: 800, disk: 10, status: 'running', isSystem: true, startTime: 2 },
  { id: '4', name: 'OneDrive.exe', cpu: 35, memory: 450, disk: 120, status: 'running', isSystem: false, startTime: 5 },
  { id: '5', name: 'Teams.exe', cpu: 40, memory: 1200, disk: 80, status: 'running', isSystem: false, startTime: 8 },
  { id: '6', name: 'Slack.exe', cpu: 25, memory: 900, disk: 40, status: 'running', isSystem: false, startTime: 10 },
  { id: '7', name: 'Chrome.exe', cpu: 10, memory: 2500, disk: 5, status: 'running', isSystem: false, startTime: 15 },
  { id: '8', name: 'Spotify.exe', cpu: 5, memory: 300, disk: 0, status: 'running', isSystem: false, startTime: 12 },
  { id: '9', name: 'Windows Defender', cpu: 12, memory: 400, disk: 200, status: 'running', isSystem: true, startTime: 3 },
  { id: '10', name: 'SearchIndexer.exe', cpu: 20, memory: 150, disk: 150, status: 'running', isSystem: true, startTime: 20 },
];

const INITIAL_RULES: OptimizationRule[] = [
  { id: 'r1', processName: 'Teams.exe', action: 'delay', delaySeconds: 60 },
  { id: 'r2', processName: 'OneDrive.exe', action: 'optimize' },
];

export const useSystemStore = create<SystemState>((set, get) => ({
  bootTime: Date.now(),
  elapsedSeconds: 0,
  isBoostActive: true,
  cpuTotal: 0,
  memoryTotal: 0,
  diskTotal: 0,
  processes: JSON.parse(JSON.stringify(INITIAL_PROCESSES)),
  logs: [],
  rules: INITIAL_RULES,

  tick: () => {
    const { processes, elapsedSeconds, isBoostActive } = get();
    const newElapsed = elapsedSeconds + 1;

    // Simulate dynamic resource usage
    const updatedProcesses = processes.map((p) => {
      // Only run if started
      if (p.startTime > newElapsed && p.status !== 'delayed') return p;

      let cpuChange = (Math.random() - 0.5) * 10;
      let diskChange = (Math.random() - 0.5) * 20;
      
      // Heavy load simulation during first 60 seconds
      if (newElapsed < 60 && !p.isSystem && p.status === 'running') {
        cpuChange += 2;
        diskChange += 5;
      }

      // Optimization effect
      if (p.status === 'optimized') {
        cpuChange -= 5;
        diskChange -= 10;
      }

      // Bounds
      let newCpu = Math.max(0, Math.min(100, p.cpu + cpuChange));
      let newDisk = Math.max(0, p.disk + diskChange);

      // Specific behavior for heavy apps
      if (p.name === 'Teams.exe' && p.status === 'running' && newElapsed < 45) {
        newCpu = Math.max(newCpu, 40 + Math.random() * 20);
      }
      if (p.name === 'OneDrive.exe' && p.status === 'running' && newElapsed < 90) {
        newDisk = Math.max(newDisk, 100 + Math.random() * 50);
      }

      return { ...p, cpu: newCpu, disk: newDisk };
    });

    // Calculate totals
    const activeProcesses = updatedProcesses.filter(p => p.startTime <= newElapsed && p.status !== 'delayed' && p.status !== 'stopped');
    const totalCpu = Math.min(100, activeProcesses.reduce((acc, p) => acc + p.cpu, 0) / (activeProcesses.length > 0 ? 2 : 1)); // Normalize somewhat
    const totalMemory = activeProcesses.reduce((acc, p) => acc + p.memory, 0);
    const totalDisk = activeProcesses.reduce((acc, p) => acc + p.disk, 0);

    // Auto-optimize if boost is active and load is high
    if (isBoostActive && totalCpu > 80) {
       // Find heaviest non-system process
       const heavyProcess = activeProcesses
         .filter(p => !p.isSystem && p.status === 'running')
         .sort((a, b) => b.cpu - a.cpu)[0];
       
       if (heavyProcess) {
         get().optimizeProcess(heavyProcess.id);
       }
    }

    set({
      elapsedSeconds: newElapsed,
      processes: updatedProcesses,
      cpuTotal: Math.round(totalCpu),
      memoryTotal: Math.round(totalMemory),
      diskTotal: Math.round(totalDisk),
    });
  },

  optimizeProcess: (id) => {
    set((state) => {
      const process = state.processes.find((p) => p.id === id);
      if (!process) return state;

      const newLog: SystemLog = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        type: 'success',
        message: `${process.name} を最適化しました`,
        details: 'プロセスとI/Oの優先度を下げました。',
      };

      return {
        processes: state.processes.map((p) =>
          p.id === id ? { ...p, status: 'optimized', cpu: p.cpu * 0.5, disk: p.disk * 0.3 } : p
        ),
        logs: [newLog, ...state.logs],
      };
    });
  },

  delayProcess: (id, seconds) => {
    set((state) => {
      const process = state.processes.find((p) => p.id === id);
      if (!process) return state;

      const newLog: SystemLog = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        type: 'info',
        message: `${process.name} の起動を遅延させました`,
        details: `起動を ${seconds} 秒遅らせました。`,
      };

      return {
        processes: state.processes.map((p) =>
          p.id === id ? { ...p, status: 'delayed', startTime: state.elapsedSeconds + seconds } : p
        ),
        logs: [newLog, ...state.logs],
      };
    });
  },

  killProcess: (id) => {
    set((state) => {
      const process = state.processes.find((p) => p.id === id);
      if (!process) return state;

      const newLog: SystemLog = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        type: 'warning',
        message: `${process.name} を停止しました`,
        details: 'ユーザーが手動でプロセスを停止しました。',
      };

      return {
        processes: state.processes.map((p) =>
          p.id === id ? { ...p, status: 'stopped', cpu: 0, memory: 0, disk: 0 } : p
        ),
        logs: [newLog, ...state.logs],
      };
    });
  },

  resetSimulation: () => {
    set({
      bootTime: Date.now(),
      elapsedSeconds: 0,
      processes: JSON.parse(JSON.stringify(INITIAL_PROCESSES)),
      logs: [],
      cpuTotal: 0,
      memoryTotal: 0,
      diskTotal: 0,
    });
  },
}));
