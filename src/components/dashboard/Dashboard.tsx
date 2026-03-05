import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, HardDrive, Cpu, Zap, Shield } from 'lucide-react';
import { useSystemStore } from '../../lib/store';

export function Dashboard() {
  const { cpuTotal, memoryTotal, diskTotal, processes, optimizeProcess, delayProcess } = useSystemStore();
  const [data, setData] = useState<{ time: string; cpu: number; memory: number; disk: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            cpu: cpuTotal,
            memory: memoryTotal,
            disk: diskTotal,
          },
        ];
        return newData.slice(-20); // Keep last 20 points
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cpuTotal, memoryTotal, diskTotal]);

  const heavyProcesses = processes
    .filter((p) => p.cpu > 20 || p.disk > 50)
    .sort((a, b) => b.cpu - a.cpu)
    .slice(0, 3);

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">システム概要</h2>
          <p className="text-slate-500">リアルタイム監視と最適化</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Cpu className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500">CPU負荷</p>
                    <p className="text-xl font-bold">{cpuTotal}%</p>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <Activity className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500">メモリ</p>
                    <p className="text-xl font-bold">{Math.round(memoryTotal / 1024 * 10) / 10} GB</p>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <HardDrive className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500">ディスク I/O</p>
                    <p className="text-xl font-bold">{diskTotal} MB/s</p>
                </div>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg mb-6">リソース使用履歴</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" hide />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
                <Area type="monotone" dataKey="disk" stroke="#f97316" fillOpacity={0} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">高負荷プロセス</h3>
            <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-1 rounded-full">
              {heavyProcesses.length} 検知
            </span>
          </div>
          
          <div className="space-y-4">
            {heavyProcesses.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                    <Shield className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>システムは安定しています</p>
                </div>
            ) : (
                heavyProcesses.map((process) => (
                <div key={process.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-medium text-slate-900">{process.name}</h4>
                        <p className="text-xs text-slate-500">CPU: {process.cpu.toFixed(1)}% • Disk: {process.disk.toFixed(1)} MB/s</p>
                    </div>
                    {process.status === 'optimized' ? (
                        <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                            <Shield className="w-3 h-3" /> 最適化済み
                        </span>
                    ) : (
                        <span className="text-xs font-bold text-red-500">高負荷</span>
                    )}
                    </div>
                    
                    {process.status !== 'optimized' && (
                        <div className="flex gap-2 mt-3">
                        <button 
                            onClick={() => optimizeProcess(process.id)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 rounded font-medium transition-colors flex items-center justify-center gap-1"
                        >
                            <Zap className="w-3 h-3" /> 最適化
                        </button>
                        <button 
                            onClick={() => delayProcess(process.id, 60)}
                            className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs py-1.5 rounded font-medium transition-colors"
                        >
                            60秒遅延
                        </button>
                        </div>
                    )}
                </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
