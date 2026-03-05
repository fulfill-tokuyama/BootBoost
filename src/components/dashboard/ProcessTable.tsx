import React from 'react';
import { useSystemStore } from '../../lib/store';
import { Play, Pause, Zap, Clock, AlertTriangle } from 'lucide-react';

export function ProcessList() {
  const { processes, optimizeProcess, delayProcess, killProcess } = useSystemStore();

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">実行中のプロセス</h2>
        <p className="text-slate-500">アプリケーションとバックグラウンドタスクの管理</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500 text-sm">プロセス名</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-sm">状態</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-sm">CPU</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-sm">メモリ</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-sm">ディスク I/O</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-sm text-right">アクション</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {processes.map((process) => (
              <tr key={process.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                      {process.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{process.name}</p>
                      {process.isSystem && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">システム</span>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${process.status === 'running' ? 'bg-green-100 text-green-800' : 
                      process.status === 'optimized' ? 'bg-blue-100 text-blue-800' :
                      process.status === 'delayed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {process.status === 'running' ? '実行中' :
                     process.status === 'optimized' ? '最適化済み' :
                     process.status === 'delayed' ? '遅延中' :
                     process.status === 'stopped' ? '停止' : process.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${process.cpu > 50 ? 'bg-red-500' : 'bg-blue-500'}`} 
                        style={{ width: `${Math.min(100, process.cpu)}%` }}
                      ></div>
                    </div>
                    {process.cpu.toFixed(1)}%
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-slate-600">
                  {process.memory} MB
                </td>
                <td className="px-6 py-4 font-mono text-sm text-slate-600">
                  {process.disk.toFixed(1)} MB/s
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {!process.isSystem && process.status !== 'stopped' && (
                      <>
                        <button 
                          onClick={() => optimizeProcess(process.id)}
                          title="優先度を最適化"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Zap className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => delayProcess(process.id, 60)}
                          title="起動を遅延"
                          className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => killProcess(process.id)}
                          title="プロセスを停止"
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
