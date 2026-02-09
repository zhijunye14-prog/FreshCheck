
import React, { useMemo, useState } from 'react';
import { UserLocation, FridgeItem } from '../types';
import { BrandLogo } from '../App';

interface HomeViewProps {
  onNavigate: (view: any) => void;
  location?: UserLocation;
  fridgeItems: FridgeItem[];
}

interface RecipeDetail {
  ingredients: string[];
  steps: string[];
}

const RECIPE_DETAILS: Record<string, RecipeDetail> = {
  "经典西红柿炒蛋": {
    ingredients: ["西红柿 2个", "鸡蛋 3个", "小葱 1根", "白糖 5g"],
    steps: ["西红柿洗净切块，鸡蛋打散备用", "热锅下油，倒入蛋液快速划散成块盛出", "留底油炒香葱段，下西红柿炒至出汁", "回锅鸡蛋，加入糖、盐翻炒均匀即可"]
  },
  "青椒肉丝": {
    ingredients: ["猪里脊 200g", "青椒 2个", "姜丝 适量", "生抽 1勺"],
    steps: ["肉丝加淀粉腌制", "青椒切丝，姜切丝", "大火滑散肉丝至变色盛出", "炒青椒至断生，回锅肉丝加盐调味即可"]
  },
  "酸辣土豆丝": {
    ingredients: ["土豆 1个", "干辣椒 2个", "香醋 1勺", "蒜末 适量"],
    steps: ["土豆切丝反复冲洗去淀粉", "热锅凉油下花椒炸香，捞出花椒", "下蒜末、干辣椒爆香，倒入土豆丝大火快炒", "加醋、盐，断生即出锅"]
  },
  "蛋炒饭": {
    ingredients: ["隔夜饭 1碗", "鸡蛋 2个", "葱花 适量"],
    steps: ["鸡蛋打散划熟盛出", "热油倒入米饭翻炒均匀", "加入鸡蛋碎、盐、生抽继续翻炒", "撒入葱花出锅"]
  },
  "番茄鸡蛋面": {
    ingredients: ["面条 1把", "西红柿 1个", "鸡蛋 1个"],
    steps: ["炒香西红柿至出汁，加水烧开", "水开下入面条", "打入鸡蛋液，放入青菜", "加盐调味即可"]
  },
  "蚝油生菜": {
    ingredients: ["生菜 1颗", "蚝油 2勺", "蒜末 3瓣"],
    steps: ["生菜烫熟铺在盘底", "炒香蒜末，加蚝油、生抽、水淀粉勾薄芡", "将芡汁淋在生菜上"]
  },
  "土豆焖饭": {
    ingredients: ["大米 1杯", "土豆 1个", "腊肠 1根"],
    steps: ["土豆、腊肠切小丁", "热油炒一下土豆和腊肠", "将炒好的料倒入洗净的大米中，加水", "开启煮饭模式"]
  }
};

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, location, fridgeItems }) => {
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  const expiringItems = useMemo(() => {
    return fridgeItems.filter(item => {
      const remainingMs = item.expiryDate - Date.now();
      return remainingMs > 0 && remainingMs <= 3 * 86400000;
    }).sort((a, b) => a.expiryDate - b.expiryDate);
  }, [fridgeItems]);

  const recipeRecommendation = useMemo(() => {
    if (fridgeItems.length === 0) return null;
    const names = fridgeItems.map(i => i.name);
    
    if (names.includes('西红柿') && names.includes('鸡蛋')) return { title: '经典西红柿炒蛋', desc: '根据库存食材，可浏览相关参考方案。' };
    if (names.includes('猪肉') && names.includes('青椒')) return { title: '青椒肉丝', desc: '食材匹配度较高，可供参考。' };
    if (names.includes('土豆')) return { title: '酸辣土豆丝', desc: '基于单一食材的常见处理参考。' };

    if (expiringItems.length > 0) {
      const name = expiringItems[0].name;
      const genericTitle = `关于${name}的常见做法`;
      return { 
        title: genericTitle, 
        desc: `检测到“${name}”已进入保鲜临界期。`,
        isDynamic: true,
        baseName: name
      };
    }
    return { title: '食材处理方案', desc: '根据当前库存，为您整理了以下参考。' };
  }, [fridgeItems, expiringItems]);

  const quickRecipes = ["蛋炒饭", "番茄鸡蛋面", "蚝油生菜", "土豆焖饭"];
  const [randomQuickRecipe] = useState(() => quickRecipes[Math.floor(Math.random() * quickRecipes.length)]);

  const toggleExpand = (title: string) => {
    setExpandedRecipe(expandedRecipe === title ? null : title);
  };

  const renderRecipeDetail = (title: string) => {
    const detail = RECIPE_DETAILS[title];
    if (!detail) return (
      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-[10px] font-bold opacity-80">💡 状态提示：请结合图鉴对照指南观察食材的新鲜度变化。</p>
      </div>
    );

    return (
      <div className="mt-4 pt-4 border-t border-white/20 animate-in fade-in slide-in-from-top duration-300">
        <div className="mb-3">
          <p className="text-[10px] font-black uppercase opacity-60 mb-1">参考清单</p>
          <div className="flex flex-wrap gap-2">
            {detail.ingredients.map((ing, idx) => (
              <span key={idx} className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px] font-bold">{ing}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase opacity-60 mb-1">流程参考</p>
          <ul className="space-y-2">
            {detail.steps.map((step, idx) => (
              <li key={idx} className="text-[10px] leading-relaxed font-bold flex">
                <span className="opacity-50 mr-2">{idx + 1}.</span> {step}
              </li>
            ))}
          </ul>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); setExpandedRecipe(null); }}
          className="mt-4 w-full py-2 bg-black/10 rounded-xl text-[10px] font-black hover:bg-black/20 transition-all"
        >
          收起
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 pb-24 space-y-6 animate-in fade-in duration-500 w-full overflow-hidden">
      <header className="py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3 min-w-0">
          <BrandLogo size="sm" />
          <div className="min-w-0">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight truncate leading-none">FreshCheck</h1>
            <p className="text-slate-400 text-[10px] font-bold mt-1.5 uppercase tracking-tight opacity-70">专业新鲜度判别工具</p>
          </div>
        </div>
        
        {location && location.region !== 'unknown' && (
          <div className="bg-white border border-slate-100 px-3 py-1.5 rounded-2xl flex items-center shadow-sm flex-shrink-0">
            <span className="text-[10px] font-black text-slate-500 mr-2 uppercase tracking-tighter">📍 {location.region === 'north' ? '北方气候' : '南方气候'}</span>
            <div className={`w-2 h-2 rounded-full ${location.region === 'north' ? 'bg-sky-400' : 'bg-orange-400'} animate-pulse`}></div>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={() => onNavigate('camera')}
          className="group relative overflow-hidden bg-slate-900 p-8 rounded-[2.5rem] text-white text-left transition-all active:scale-[0.98] shadow-2xl border-b-8 border-black"
        >
          <div className="relative z-10">
            <h2 className="text-2xl font-black italic tracking-wider">开始判别</h2>
            <p className="text-slate-400 text-xs mt-1 font-bold">获取 AI 食材新鲜度诊断报告</p>
          </div>
          <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-10 group-hover:scale-110 transition-transform">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"/><path d="M20 5h-3.17l-1.17-1.17c-.18-.18-.41-.26-.66-.26H9c-.25 0-.48.08-.66.26L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => onNavigate('fridge')} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 border-b-4 border-slate-200 text-left active:scale-95 transition-all">
            <h3 className="font-black text-slate-800 text-lg">冰箱库存</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1">当前存量: {fridgeItems.length}件</p>
          </button>
          <button onClick={() => onNavigate('search')} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 border-b-4 border-slate-200 text-left active:scale-95 transition-all">
            <h3 className="font-black text-slate-800 text-lg">诊断图鉴</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1">新鮮度判别指南</p>
          </button>
        </div>
      </div>

      <section className="bg-orange-50 p-6 rounded-[2.5rem] border border-orange-100 border-b-4 border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-orange-800 text-xs uppercase tracking-widest flex items-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            临期状态
          </h3>
          <span className="text-[10px] font-black text-orange-400 uppercase tracking-tighter">新鲜度临界</span>
        </div>
        
        {expiringItems.length > 0 ? (
          <div className="space-y-3">
            {expiringItems.slice(0, 3).map(item => (
              <div key={item.id} className="flex justify-between items-center bg-white/60 p-3 rounded-2xl shadow-sm">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs font-black text-slate-800">{item.name}</span>
                </div>
                <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                  新鲜度下降
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-orange-600 font-bold italic py-4 text-center opacity-60">库存食材状态良好</p>
        )}
      </section>

      <section className="bg-indigo-600 p-6 rounded-[2.5rem] text-white border-b-8 border-indigo-900 shadow-xl overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-2xl">📋</span>
            <h4 className="font-black italic tracking-widest">处理参考方案</h4>
          </div>
          
          {recipeRecommendation ? (
            <div 
              className="cursor-pointer"
              onClick={() => toggleExpand(recipeRecommendation.title)}
            >
              <h5 className="text-lg font-black">{recipeRecommendation.title}</h5>
              <p className="text-[11px] text-indigo-200 mt-2 font-bold leading-relaxed">{recipeRecommendation.desc}</p>
              
              {!expandedRecipe && (
                <button 
                  className="mt-4 bg-white text-indigo-600 px-5 py-2 rounded-full text-[10px] font-black active:scale-95 transition-all shadow-lg"
                >
                  查看方案参考
                </button>
              )}
              
              {expandedRecipe === recipeRecommendation.title && renderRecipeDetail(recipeRecommendation.title)}
            </div>
          ) : (
            <div>
              <p className="text-[11px] text-indigo-200 font-bold italic">目前无特定食材参考建议。</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
