import React from 'react';

export function Settings() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">設定</h2>
        <p className="text-slate-500">BootBoostの動作と監視閾値を設定します</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-lg mb-4">一般設定</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-slate-900">ブースト期間</label>
                <p className="text-sm text-slate-500">起動後、アクティブに監視する時間</p>
              </div>
              <select className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm">
                <option>3分</option>
                <option selected>5分</option>
                <option>10分</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-slate-900">Windowsと一緒に起動</label>
                <p className="text-sm text-slate-500">ログイン時に自動起動する</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-green-400"/>
                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer checked:bg-green-400"></label>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-lg mb-4">閾値設定</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">CPU高負荷閾値</label>
                <span className="text-sm font-bold text-blue-600">80%</span>
              </div>
              <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" min="50" max="100" defaultValue="80" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">ディスクI/O閾値</label>
                <span className="text-sm font-bold text-blue-600">90%</span>
              </div>
              <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" min="50" max="100" defaultValue="90" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            設定を保存
          </button>
        </div>
      </div>
    </div>
  );
}
