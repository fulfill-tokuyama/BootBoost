import React from 'react';
import { useSystemStore } from '../../lib/store';
import { Clock, Shield, AlertCircle } from 'lucide-react';

export function Rules() {
  const { rules } = useSystemStore();

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">最適化ルール</h2>
        <p className="text-slate-500">アプリケーションごとの動作設定</p>
      </header>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            遅延起動ルール
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            ここにリストされたアプリは起動時に自動的に遅延され、負荷を軽減します。
          </p>
          
          <div className="space-y-3">
            {rules.filter(r => r.action === 'delay').map(rule => (
              <div key={rule.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-medium text-slate-700">{rule.processName}</span>
                <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                  {rule.delaySeconds}秒 遅延
                </span>
              </div>
            ))}
            <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm font-medium hover:border-blue-300 hover:text-blue-500 transition-colors">
              + 新しい遅延ルールを追加
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            ホワイト/ブラックリスト
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            重要なシステムプロセス（ホワイトリスト）や、常に抑制するプロセス（ブラックリスト）を定義します。
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">ホワイトリスト（保護）</h4>
              <div className="flex flex-wrap gap-2">
                {['System', 'Registry', 'explorer.exe', 'Windows Defender'].map(p => (
                  <span key={p} className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" /> {p}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">ブラックリスト（常時抑制）</h4>
              <div className="flex flex-wrap gap-2">
                {['OneDrive.exe', 'Teams.exe'].map(p => (
                  <span key={p} className="text-xs bg-red-50 text-red-700 border border-red-100 px-2 py-1 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
