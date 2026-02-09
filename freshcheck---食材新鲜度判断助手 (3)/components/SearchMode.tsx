
import React, { useState } from 'react';
import { INGREDIENT_DB, INGREDIENT_CATEGORIES } from '../constants';
import { IngredientInfo, StorageZone } from '../types';

interface SearchModeProps {
  onBack: () => void;
  onManualAdd?: (config: { name: string, category: string, zone: StorageZone, quantity: number, unit: string, remainingDays: number, icon: string }) => void;
}

const SearchMode: React.FC<SearchModeProps> = ({ onBack, onManualAdd }) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientInfo | null>(null);
  const [showAddModal, setShowAddModal] = useState<IngredientInfo | null>(null);
  
  const [zone, setZone] = useState<StorageZone>('fridge');
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState('份');
  const [days, setDays] = useState(3);

  const filtered = INGREDIENT_DB.filter(item => 
    (item.name.includes(query) || item.category.includes(query)) &&
    (!activeCategory || item.category === activeCategory)
  );

  const handleAddSubmit = () => {
    if (showAddModal && onManualAdd) {
      onManualAdd({
        name: showAddModal.name,
        category: showAddModal.category,
        zone,
        quantity: qty,
        unit,
        remainingDays: days,
        icon: showAddModal.icon
      });
      setShowAddModal(null);
    }
  };

  const getDiagnosticColor = (level: string) => {
    if (level === '非常新鲜') return 'border-emerald-500 bg-emerald-50 text-emerald-700';
    if (level === '一般') return 'border-yellow-400 bg-yellow-50 text-yellow-700';
    return 'border-red-400 bg-red-50 text-red-700';
  };

  /**
   * 智能生成诊断文字（纯状态描述）
   */
  const getDiagnosticAdvice = (level: string, ingredient: IngredientInfo) => {
    let method = '保存';
    if (ingredient.storageAdvice.includes('冷藏')) method = '冷藏';
    else if (ingredient.storageAdvice.includes('冷冻')) method = '冷冻';
    else if (ingredient.storageAdvice.includes('常温')) method = '常温';

    if (level === '非常新鲜') {
      return `当前处于最佳保鲜期 (预计可${method} ${ingredient.storageLife} 天)`;
    }
    if (level === '一般') {
      return `新鲜度已进入中期阶段`;
    }
    if (level === '已变质') {
      return '已失去保鲜价值，状态异常';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-in fade-in duration-300">
      <header className="sticky top-0 bg-white p-4 border-b border-slate-100 z-10 shadow-sm">
        <div className="flex items-center space-x-3 mb-3">
          <button onClick={onBack} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7 7-7"></path></svg>
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="搜索食材图鉴..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-2xl py-2.5 px-10 text-sm outline-none focus:ring-2 focus:ring-slate-800 focus:bg-white transition-all"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
          <button 
            onClick={() => setActiveCategory(null)}
            className={`px-5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all ${!activeCategory ? 'bg-slate-800 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
          >
            全部
          </button>
          {INGREDIENT_CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-slate-800 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!selectedIngredient ? (
          <div className="grid grid-cols-1 gap-3">
            {filtered.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-3xl flex items-center justify-between border border-slate-100 shadow-sm">
                <button onClick={() => setSelectedIngredient(item)} className="flex items-center space-x-4 flex-1 text-left">
                  <span className="text-3xl drop-shadow-sm">{item.icon}</span>
                  <div>
                    <h3 className="font-black text-slate-800 text-base">{item.name}</h3>
                    <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">{item.category}</p>
                  </div>
                </button>
                <button 
                  onClick={() => setShowAddModal(item)}
                  className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center active:scale-90 transition-transform shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-8 shadow-sm animate-in slide-in-from-right border border-slate-50">
             <button onClick={() => setSelectedIngredient(null)} className="mb-6 text-slate-400 text-xs font-black flex items-center">
               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg> 返回图鉴列表
             </button>
             <div className="flex items-center space-x-6 mb-8">
                <span className="text-7xl drop-shadow-md">{selectedIngredient.icon}</span>
                <div className="min-w-0">
                  <h1 className="text-3xl font-black text-slate-800">{selectedIngredient.name}</h1>
                  <span className="inline-block bg-slate-100 text-slate-500 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest mt-1">{selectedIngredient.category}</span>
                </div>
             </div>

             <div className="space-y-8">
                <section>
                  <h4 className="font-black text-slate-800 mb-3 flex items-center text-sm uppercase tracking-widest"><span className="mr-2">💡</span>状态判断特征</h4>
                  <ul className="space-y-2.5 pl-4">
                    {selectedIngredient.selectionTips.map((t, i) => (
                      <li key={i} className={`text-xs font-bold leading-relaxed text-slate-500 list-disc`}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h4 className="font-black text-slate-800 mb-4 flex items-center text-sm uppercase tracking-widest"><span className="mr-2">🔍</span>新鲜度诊断对照表</h4>
                  <div className="space-y-4">
                    {selectedIngredient.diagnostics.map((diag, idx) => (
                      <div key={idx} className={`p-5 rounded-[2rem] border ${getDiagnosticColor(diag.level)} shadow-sm`}>
                        <div className="flex items-baseline justify-between mb-3">
                           <p className="font-black text-xs uppercase tracking-widest">{diag.level}</p>
                           <p className="text-[10px] font-black opacity-60 ml-2 italic">
                              {getDiagnosticAdvice(diag.level, selectedIngredient)}
                           </p>
                        </div>
                        <div className="space-y-3">
                           <div className="flex items-start">
                              <span className="text-[10px] font-black opacity-50 mr-3 uppercase min-w-[30px] pt-0.5">眼看</span>
                              <p className="text-[11px] font-bold leading-relaxed">{diag.visual}</p>
                           </div>
                           <div className="flex items-start">
                              <span className="text-[10px] font-black opacity-50 mr-3 uppercase min-w-[30px] pt-0.5">手摸</span>
                              <p className="text-[11px] font-bold leading-relaxed">{diag.feel}</p>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                  <h4 className="font-black text-slate-800 text-xs mb-3 flex items-center uppercase tracking-widest"><span className="mr-2">🏠</span>建议储存环境</h4>
                  <p className="text-slate-700 text-xs leading-relaxed font-bold italic">{selectedIngredient.storageAdvice}</p>
                </section>

                <div className="bg-slate-50 p-6 rounded-[2.5rem] flex justify-between items-center border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">典型新鲜周期</span>
                  </div>
                  <span className="text-xl font-black text-slate-800">{selectedIngredient.storageLife} 天</span>
                </div>
             </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[100] flex items-end p-4 animate-in fade-in">
          <div className="bg-white w-full rounded-[3rem] p-8 shadow-2xl border-b-8 border-slate-200 animate-in slide-in-from-bottom">
            <h2 className="text-xl font-black text-slate-800 mb-6 italic flex items-center uppercase tracking-widest">
              添加纪录 <span className="ml-3 text-3xl">{showAddModal.icon}</span>
            </h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-400">储存区域</span>
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                  <button onClick={() => setZone('fridge')} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${zone === 'fridge' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400'}`}>冷藏</button>
                  <button onClick={() => setZone('freezer')} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${zone === 'freezer' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400'}`}>冷冻</button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-400">数量</span>
                <div className="flex items-center space-x-3">
                   <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-100">
                      <button onClick={() => setQty(Math.max(1, qty-1))} className="w-10 h-10 font-black text-slate-400">-</button>
                      <input type="number" value={qty} readOnly className="w-12 text-center bg-transparent text-sm font-black outline-none" />
                      <button onClick={() => setQty(qty+1)} className="w-10 h-10 font-black text-slate-400">+</button>
                   </div>
                   <select value={unit} onChange={e => setUnit(e.target.value)} className="bg-slate-50 border-none text-xs font-black rounded-2xl py-2 px-3 focus:ring-0">
                     <option value="份">份</option>
                     <option value="kg">kg</option>
                     <option value="个">个</option>
                   </select>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button onClick={() => setShowAddModal(null)} className="flex-1 py-4 text-slate-400 font-black text-sm">取消</button>
              <button 
                onClick={handleAddSubmit}
                className="flex-[2] bg-indigo-600 py-4 rounded-[2rem] text-white font-black text-sm shadow-xl border-b-4 border-indigo-800"
              >
                存入库存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchMode;
