
import React, { useState } from 'react';
import { FridgeItem, StorageZone } from '../types';

interface FridgeViewProps {
  items: FridgeItem[];
  onBack: () => void;
  onUpdate: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}

const FridgeView: React.FC<FridgeViewProps> = ({ items, onBack, onUpdate, onRemove, onAdd }) => {
  const [activeZone, setActiveZone] = useState<StorageZone>('fridge');
  const [selectedItem, setSelectedItem] = useState<FridgeItem | null>(null);

  const filteredItems = items.filter(i => i.zone === activeZone);

  const formatStorageTime = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日${d.getHours()}点`;
  };

  const getDynamicStatus = (item: FridgeItem) => {
    const now = Date.now();
    const elapsed = now - item.addedDate;
    const total = item.expiryDate - item.addedDate;
    const elapsedDays = Math.floor(elapsed / 86400000);
    
    let status: '非常新鲜' | '一般' | '已变质' = '一般';
    let colorClass = 'bg-yellow-100 text-yellow-700 border-yellow-200';

    if (now >= item.expiryDate) {
      status = '已变质';
      colorClass = 'bg-red-100 text-red-700 border-red-200';
    } else if (elapsed < total * 0.4) {
      status = '非常新鲜';
      colorClass = 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }

    return { status, colorClass, elapsedDays: Math.max(0, elapsedDays) };
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col animate-in fade-in">
      <header className="bg-white p-6 pb-4 border-b-4 border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={onBack} className="mr-3 text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <h1 className="text-2xl font-black text-slate-800 italic uppercase">Inventory</h1>
          </div>
          <button onClick={onAdd} className="bg-emerald-400 p-2 rounded-xl text-white shadow-[0_4px_0_0_rgb(16,185,129)] active:translate-y-1 active:shadow-none transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>
        
        <div className="flex mt-6 space-x-4">
          <button 
            onClick={() => setActiveZone('fridge')}
            className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all border-b-4 ${activeZone === 'fridge' ? 'bg-sky-400 text-white border-sky-600' : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'}`}
          >
            ❄️ 冷藏
          </button>
          <button 
            onClick={() => setActiveZone('freezer')}
            className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all border-b-4 ${activeZone === 'freezer' ? 'bg-indigo-400 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'}`}
          >
            🧊 冷冻
          </button>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-y-auto bg-slate-100">
        <div className="grid grid-cols-2 gap-6 pb-12">
          {filteredItems.map(item => {
            const isCritical = (item.expiryDate - Date.now()) < 86400000;
            return (
              <div 
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`relative bg-white rounded-3xl p-4 border-b-8 border-slate-200 shadow-lg active:scale-95 transition-all flex flex-col items-center group ${isCritical ? 'ring-2 ring-orange-400' : ''}`}
              >
                <div className="text-4xl mb-2 drop-shadow-md transform group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xs font-black text-slate-800 text-center truncate w-full">{item.name}</h3>
                <div className="mt-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  <span className="text-[10px] font-black text-slate-500">{item.quantity}{item.unit}</span>
                </div>
                
                {isCritical && (
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-md animate-pulse">
                    新鲜度：临界
                  </div>
                )}
              </div>
            );
          })}
          
          {filteredItems.length === 0 && (
            <div className="col-span-2 py-20 text-center opacity-30 select-none">
              <p className="text-4xl mb-4">🧊</p>
              <p className="text-sm font-black">仓库为空</p>
            </div>
          )}
        </div>
      </div>

      {selectedItem && (() => {
        const { status, colorClass, elapsedDays } = getDynamicStatus(selectedItem);
        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end p-4 animate-in fade-in">
            <div className="bg-white w-full rounded-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom border-b-8 border-slate-200">
               <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                     <div className="text-6xl drop-shadow-sm">{selectedItem.icon}</div>
                     <div>
                        <h2 className="text-3xl font-black text-slate-800">{selectedItem.name}</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase">{selectedItem.category}</p>
                     </div>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="p-2 text-slate-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
               </div>

               <div className="bg-slate-50 rounded-3xl p-5 mb-6 space-y-3 border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">存入时间</span>
                    <span className="text-xs font-black text-slate-600">{formatStorageTime(selectedItem.addedDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">已存时长</span>
                    <span className="text-xs font-black text-slate-500">{elapsedDays} 天</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">当前状态</span>
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black border-2 ${colorClass}`}>
                      {status}
                    </span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-5 rounded-3xl border-b-4 border-slate-200">
                     <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">库存量</p>
                     <div className="flex items-center justify-between">
                        <button onClick={() => onUpdate(selectedItem.id, -1)} className="w-10 h-10 bg-white border border-slate-100 rounded-full shadow-sm flex items-center justify-center font-black active:scale-90">-</button>
                        <span className="text-xl font-black text-slate-800">{selectedItem.quantity} <small className="text-[10px] opacity-50">{selectedItem.unit}</small></span>
                        <button onClick={() => onUpdate(selectedItem.id, 1)} className="w-10 h-10 bg-white border border-slate-100 rounded-full shadow-sm flex items-center justify-center font-black active:scale-90">+</button>
                     </div>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-3xl border-b-4 border-slate-200">
                     <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">诊断结论</p>
                     <p className="text-[10px] text-slate-500 font-bold leading-tight line-clamp-3">{selectedItem.storageAdvice || '暂无诊断信息'}</p>
                  </div>
               </div>

               <button 
                 onClick={() => { onRemove(selectedItem.id); setSelectedItem(null); }}
                 className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-xs active:bg-slate-200 transition-all border-b-4 border-slate-200"
               >
                 移除纪录
               </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default FridgeView;
