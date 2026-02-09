
import React from 'react';
import { HistoryItem, FreshnessLevel } from '../types';

interface HistoryViewProps {
  items: HistoryItem[];
  onBack: () => void;
  onItemClick: (item: HistoryItem) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ items, onBack, onItemClick }) => {
  const getStatusColor = (level: FreshnessLevel) => {
    switch (level) {
      case FreshnessLevel.FRESH: return 'text-emerald-500';
      case FreshnessLevel.AVERAGE: return 'text-yellow-500';
      case FreshnessLevel.CRITICAL: return 'text-orange-500';
      case FreshnessLevel.SPOILED: return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24 animate-in fade-in duration-300">
      <header className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 text-slate-500 mr-2 hover:bg-slate-200 rounded-full transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7 7-7"></path></svg>
        </button>
        <h1 className="text-2xl font-bold text-slate-800">识别记录</h1>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <svg className="w-16 h-16 mb-4 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p>暂无识别记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <button 
              key={item.id} 
              onClick={() => onItemClick(item)}
              className="w-full bg-white p-4 rounded-2xl flex items-center space-x-4 border border-slate-100 shadow-sm active:scale-[0.98] transition-all text-left"
            >
              <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.ingredientName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">?</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 truncate">{item.ingredientName}</h3>
                <p className="text-xs text-slate-400">
                  {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`text-sm font-bold ${getStatusColor(item.freshness)}`}>
                  {item.freshness}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">预计剩 {item.remainingDays} 天</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <button 
          onClick={() => {
            if(confirm('确定清空所有历史记录吗？')) {
              localStorage.removeItem('freshcheck_history');
              window.location.reload();
            }
          }}
          className="w-full mt-12 py-3 text-slate-300 text-sm font-medium hover:text-red-400 transition-colors"
        >
          清空所有记录
        </button>
      )}
    </div>
  );
};

export default HistoryView;
