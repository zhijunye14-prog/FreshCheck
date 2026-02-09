
import React, { useState, useEffect } from 'react';
import { FreshnessLevel, HistoryItem, AssessmentResult, FridgeItem, UserLocation, StorageZone } from './types';
import CameraCapture from './components/CameraCapture';
import AssessmentResultView from './components/AssessmentResultView';
import SearchMode from './components/SearchMode';
import HistoryView from './components/HistoryView';
import HomeView from './components/HomeView';
import FridgeView from './components/FridgeView';

type AppView = 'home' | 'camera' | 'search' | 'history' | 'result' | 'fridge';

/**
 * 修正后的 Logo：放大镜与白菜并排/错落排列，不再诡异重叠
 */
export const BrandLogo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const containerClasses = {
    sm: "w-12 h-10",
    md: "w-24 h-20",
    lg: "w-36 h-32"
  };
  const emojiSize = {
    sm: "text-2xl",
    md: "text-5xl",
    lg: "text-7xl"
  };

  return (
    <div className={`flex items-center justify-center ${containerClasses[size]}`}>
      <span className={emojiSize[size]}>🥬</span>
      <span className={`${emojiSize[size]} -ml-4 mt-2 drop-shadow-md`}>🔍</span>
    </div>
  );
};

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); 
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex flex-col items-center animate-in zoom-in-95 fade-in duration-1000">
        <BrandLogo size="lg" />
        <div className="text-center space-y-4 mt-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">FreshCheck</h1>
          <div className="flex flex-col items-center">
            <p className="text-slate-500 font-black tracking-[0.1em] text-sm">一拍即知 · 买菜不愁</p>
            <div className="mt-6 flex space-x-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-12 text-slate-200 text-[10px] font-black tracking-[0.4em] uppercase">AI Freshness Intelligence</div>
    </div>
  );
};

const TermsModal: React.FC<{ onAgree: () => void }> = ({ onAgree }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl border-b-8 border-slate-200 animate-in zoom-in-95 duration-300">
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-3xl">⚠️</span>
          <h2 className="text-xl font-black text-slate-800 italic uppercase tracking-wider">重要提示</h2>
        </div>
        
        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 mb-6 max-h-60 overflow-y-auto no-scrollbar">
          <p className="text-xs font-bold text-slate-600 leading-relaxed">
            本AI识别结果基于图像分析，仅供参考，不能替代您的最终判断。
            对于因依赖本结果而造成的任何损失，本软件不承担责任。
            请务必结合食品的气味、质地及保质期等信息审慎决策。
          </p>
        </div>

        <label className="flex items-start space-x-3 mb-8 cursor-pointer group">
          <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${checked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
            {checked && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>}
          </div>
          <input 
            type="checkbox" 
            className="hidden" 
            checked={checked} 
            onChange={() => setChecked(!checked)} 
          />
          <span className="text-[11px] font-black text-slate-500 leading-tight select-none">
            我已阅读并理解上述声明，愿意自行承担使用本软件所产生的风险。
          </span>
        </label>

        <button 
          onClick={checked ? onAgree : undefined}
          disabled={!checked}
          className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${checked ? 'bg-slate-800 text-white shadow-xl border-b-4 border-slate-950 active:translate-y-1 active:border-b-0' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
        >
          同意并开始使用
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [hasAgreed, setHasAgreed] = useState<boolean | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [lastResult, setLastResult] = useState<HistoryItem | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
  const [location, setLocation] = useState<UserLocation>({ latitude: 0, longitude: 0, region: 'unknown' });

  useEffect(() => {
    const savedHistory = localStorage.getItem('freshcheck_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedFridge = localStorage.getItem('freshcheck_fridge');
    if (savedFridge) setFridgeItems(JSON.parse(savedFridge));

    const agreed = localStorage.getItem('freshcheck_agreed');
    setHasAgreed(agreed === 'true');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const region = latitude > 33 ? 'north' : 'south';
        setLocation({ latitude, longitude, region });
      }, (err) => {
        console.warn("Location access denied", err);
      });
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem('freshcheck_agreed', 'true');
    setHasAgreed(true);
  };

  const saveToHistory = (result: AssessmentResult, imageUrl?: string) => {
    const newItem: HistoryItem = {
      ...result,
      id: Math.random().toString(36).substring(7),
      imageUrl
    };
    const updatedHistory = [newItem, ...history].slice(0, 20);
    setHistory(updatedHistory);
    localStorage.setItem('freshcheck_history', JSON.stringify(updatedHistory));
    setLastResult(newItem);
    setCurrentView('result');
  };

  const addToFridge = (item: { name: string, category: string, icon: string, reasoning?: string, cookingTips?: string, remainingDays: string }, config: { zone: StorageZone, quantity: number, unit: string }) => {
    const daysInt = parseInt(item.remainingDays.replace(/[^0-9]/g, '')) || 3;
    const newFridgeItem: FridgeItem = {
      id: Math.random().toString(36).substring(7),
      name: item.name,
      category: item.category,
      addedDate: Date.now(),
      expiryDate: Date.now() + (daysInt * 86400000),
      remainingDays: daysInt,
      icon: item.icon,
      quantity: config.quantity,
      unit: config.unit,
      zone: config.zone,
      cookingTips: item.cookingTips,
      storageAdvice: item.reasoning
    };
    
    const updatedFridge = [...fridgeItems, newFridgeItem];
    setFridgeItems(updatedFridge);
    localStorage.setItem('freshcheck_fridge', JSON.stringify(updatedFridge));
    setCurrentView('fridge');
  };

  const manualAddFridge = (config: { name: string, category: string, zone: StorageZone, quantity: number, unit: string, remainingDays: number, icon: string }) => {
    const newFridgeItem: FridgeItem = {
      id: Math.random().toString(36).substring(7),
      name: config.name,
      category: config.category,
      addedDate: Date.now(),
      expiryDate: Date.now() + (config.remainingDays * 86400000),
      remainingDays: config.remainingDays,
      icon: config.icon,
      quantity: config.quantity,
      unit: config.unit,
      zone: config.zone,
      cookingTips: "来自图鉴添加，请参考图鉴详情页做法。",
      storageAdvice: "手动从图鉴添加，请注意查看建议保存天数。"
    };
    const updatedFridge = [...fridgeItems, newFridgeItem];
    setFridgeItems(updatedFridge);
    localStorage.setItem('freshcheck_fridge', JSON.stringify(updatedFridge));
    setCurrentView('fridge');
  };

  const updateFridgeItem = (id: string, delta: number) => {
    const updated = fridgeItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0);
    setFridgeItems(updated);
    localStorage.setItem('freshcheck_fridge', JSON.stringify(updated));
  };

  const removeFromFridge = (id: string) => {
    const updated = fridgeItems.filter(i => i.id !== id);
    setFridgeItems(updated);
    localStorage.setItem('freshcheck_fridge', JSON.stringify(updated));
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={setCurrentView} location={location} fridgeItems={fridgeItems} />;
      case 'camera':
        return <CameraCapture onBack={() => setCurrentView('home')} onResult={saveToHistory} />;
      case 'search':
        return <SearchMode onBack={() => setCurrentView('home')} onManualAdd={manualAddFridge} />;
      case 'history':
        return <HistoryView onBack={() => setCurrentView('home')} items={history} onItemClick={(item) => { setLastResult(item); setCurrentView('result'); }} />;
      case 'fridge':
        return <FridgeView onBack={() => setCurrentView('home')} items={fridgeItems} onUpdate={updateFridgeItem} onRemove={removeFromFridge} onAdd={() => setCurrentView('search')} />;
      case 'result':
        return lastResult ? (
          <AssessmentResultView 
            result={lastResult} 
            onBack={() => setCurrentView('home')} 
            onAddToFridge={(config) => addToFridge({
              name: lastResult.ingredientName,
              category: lastResult.category,
              icon: lastResult.icon || (lastResult.category.includes('肉') ? '🥩' : (lastResult.category.includes('果') ? '🍎' : '🥬')),
              remainingDays: lastResult.remainingDays,
              reasoning: lastResult.reasoning,
              cookingTips: lastResult.cookingTips
            }, config)} 
          />
        ) : <HomeView onNavigate={setCurrentView} location={location} fridgeItems={fridgeItems} />;
      default:
        return <HomeView onNavigate={setCurrentView} location={location} fridgeItems={fridgeItems} />;
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-50 relative shadow-xl overflow-hidden flex flex-col">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      {!showSplash && hasAgreed === false && <TermsModal onAgree={handleAgree} />}
      
      <div className="flex-1 overflow-y-auto w-full">
        {renderView()}
      </div>
      
      {!showSplash && hasAgreed && currentView !== 'camera' && (
        <nav className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 flex justify-around items-center h-16 px-6 z-50">
          <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center transition-all ${currentView === 'home' ? 'text-slate-900 scale-110' : 'text-slate-300'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span className="text-[9px] mt-1 font-black tracking-widest uppercase text-slate-400">首页</span>
          </button>
          
          <button onClick={() => setCurrentView('fridge')} className={`flex flex-col items-center transition-all ${currentView === 'fridge' ? 'text-slate-900 scale-110' : 'text-slate-300'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            <span className="text-[9px] mt-1 font-black tracking-widest uppercase text-slate-400">冰箱</span>
          </button>

          <button onClick={() => setCurrentView('search')} className={`flex flex-col items-center transition-all ${currentView === 'search' ? 'text-slate-900 scale-110' : 'text-slate-300'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <span className="text-[9px] mt-1 font-black tracking-widest uppercase text-slate-400">图鉴</span>
          </button>

          <button onClick={() => setCurrentView('history')} className={`flex flex-col items-center transition-all ${currentView === 'history' ? 'text-slate-900 scale-110' : 'text-slate-300'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="text-[9px] mt-1 font-black tracking-widest uppercase text-slate-400">记录</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
