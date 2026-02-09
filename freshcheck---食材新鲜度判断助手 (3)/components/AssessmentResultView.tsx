
import React, { useState } from 'react';
import { HistoryItem, FreshnessLevel, StorageZone } from '../types';

interface AssessmentResultViewProps {
  result: HistoryItem;
  onBack: () => void;
  onAddToFridge: (config: { zone: StorageZone, quantity: number, unit: string }) => void;
}

const AssessmentResultView: React.FC<AssessmentResultViewProps> = ({ result, onBack, onAddToFridge }) => {
  const [zone, setZone] = useState<StorageZone>(result.category === '肉类' || result.category === '水产' ? 'freezer' : 'fridge');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState(result.category === '肉类' || result.category === '根茎类' ? 'kg' : '份');
  const [isReported, setIsReported] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);

  const getStatusLightColor = (level: FreshnessLevel) => {
    switch (level) {
      case FreshnessLevel.FRESH: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case FreshnessLevel.AVERAGE: return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case FreshnessLevel.CRITICAL: return 'bg-orange-50 text-orange-700 border-orange-100';
      case FreshnessLevel.SPOILED: return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const handleReportError = () => {
    // 模拟记录错误
    const reports = JSON.parse(localStorage.getItem('freshcheck_reports') || '[]');
    reports.push({
      resultId: result.id,
      ingredientName: result.ingredientName,
      timestamp: Date.now(),
      feedback: 'AI判断失误'
    });
    localStorage.setItem('freshcheck_reports', JSON.stringify(reports));
    
    setIsReported(true);
    setShowReportConfirm(true);
    setTimeout(() => setShowReportConfirm(false), 3000);
  };

  return (
    <div className="pb-24 animate-in slide-in-from-bottom duration-500 bg-slate-50 w-full overflow-hidden min-h-screen">
      <div className="relative h-72 overflow-hidden shadow-inner">
        {result.imageUrl ? (
          <img src={result.imageUrl} alt="captured" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-black italic uppercase tracking-widest text-xs">NO IMAGE DATA</div>
        )}
        <button onClick={onBack} className="absolute top-6 left-6 p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white active:scale-90 transition-all shadow-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7 7-7"></path></svg>
        </button>
      </div>

      <div className="px-5 -mt-10 relative z-10">
        <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-slate-100 w-full overflow-hidden border-b-8 border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div className="min-w-0 pr-4">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest truncate">{result.category}</p>
              <h1 className="text-3xl font-black text-slate-800 truncate">{result.ingredientName}</h1>
            </div>
            <div className={`flex-shrink-0 px-4 py-2 rounded-2xl border ${getStatusLightColor(result.freshness)} font-black text-xs shadow-sm`}>
              {result.freshness}
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-[2.5rem] mb-8 space-y-6 border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">建议分区</span>
              <div className="flex bg-white p-1 rounded-2xl shadow-inner border border-slate-100">
                <button onClick={() => setZone('fridge')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${zone === 'fridge' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400'}`}>冷藏</button>
                <button onClick={() => setZone('freezer')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${zone === 'freezer' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400'}`}>冷冻</button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">数量录入</span>
              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-slate-400 font-bold">-</button>
                  <input type="number" readOnly value={quantity} className="w-10 text-center text-sm font-black border-none outline-none focus:ring-0" />
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-slate-400 font-bold">+</button>
                </div>
                <select value={unit} onChange={(e) => setUnit(e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-3 py-2 text-xs font-black focus:ring-0 outline-none shadow-sm">
                  <option value="份">份</option>
                  <option value="kg">kg</option>
                  <option value="个">个</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-5 mb-10">
             <div className="flex flex-row space-x-4 w-full">
                <div className="flex-[2] bg-emerald-50 p-5 rounded-[2.5rem] border border-emerald-100 flex flex-col justify-center items-center shadow-sm">
                  <p className="text-[10px] text-emerald-600 font-black uppercase mb-1">状态保持</p>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-black text-emerald-800">{result.remainingDays}</span>
                    <span className="text-[10px] font-black text-emerald-800">天</span>
                  </div>
                  <span className="text-[8px] font-bold text-emerald-400 mt-1">({zone === 'fridge' ? '冷藏' : '冷冻'})</span>
                </div>
                <div className="flex-[3] bg-indigo-50 p-5 rounded-[2.5rem] border border-indigo-100 shadow-sm flex flex-col justify-center">
                  <p className="text-[10px] text-indigo-600 font-black uppercase mb-2">食材特征</p>
                  <p className="text-xs font-bold text-indigo-800 leading-relaxed italic">
                    “{result.cookingTips}”
                  </p>
                </div>
             </div>
             
             <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                <p className="text-[10px] text-slate-400 font-black uppercase mb-3 flex items-center">
                   <span className="w-2 h-2 rounded-full bg-slate-300 mr-2"></span>
                   客观诊断报告
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-bold">
                  {result.reasoning}
                </p>
             </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => onAddToFridge({ zone, quantity, unit })}
              className="w-full bg-slate-800 py-5 rounded-[2rem] text-white font-black text-base shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center space-x-3 border-b-8 border-slate-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              <span className="tracking-widest uppercase italic">存入电子清单</span>
            </button>

            <button 
              onClick={handleReportError}
              disabled={isReported}
              className={`w-full py-4 rounded-[1.5rem] font-black text-xs uppercase transition-all flex items-center justify-center space-x-2 border-b-4 ${isReported ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-default' : 'bg-slate-100 text-slate-400 border-slate-200 active:translate-y-1 active:border-b-0'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              <span>{isReported ? '反馈已收到，正在优化模型' : '报告错误 (识别有误？)'}</span>
            </button>
          </div>
        </div>
      </div>

      {showReportConfirm && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom duration-300 shadow-2xl z-[100]">
          您的反馈已记录，感谢协助优化AI模型！
        </div>
      )}
    </div>
  );
};

export default AssessmentResultView;
