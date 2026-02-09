
import React, { useRef, useState, useEffect } from 'react';
import { analyzeFreshness } from '../services/geminiService';
import { AssessmentResult } from '../types';

interface CameraCaptureProps {
  onBack: () => void;
  onResult: (result: AssessmentResult, imageUrl: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onBack, onResult }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access failed", err);
      setError("无法访问摄像头，请检查权限或使用手动上传。");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const takePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    
    const dataUrl = canvasRef.current.toDataURL('image/jpeg');
    processImage(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        processImage(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (dataUrl: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeFreshness(dataUrl);
      onResult(result, dataUrl);
    } catch (err) {
      setError("分析失败，请稍后重试。");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white z-10">
        <button onClick={onBack} className="p-2 bg-white/10 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <span className="font-black italic uppercase tracking-widest text-sm">Scan Mode</span>
        <div className="w-10"></div>
      </div>

      {/* Viewport */}
      <div className="flex-1 relative flex items-center justify-center bg-slate-900 overflow-hidden">
        {!isAnalyzing ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            {/* Overlay focus frame */}
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-emerald-400/50 rounded-[2rem] relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 -m-1 rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 -m-1 rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 -m-1 rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 -m-1 rounded-br-xl"></div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-white px-8 text-center animate-pulse">
            <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6 shadow-lg shadow-emerald-500/20"></div>
            <h3 className="text-xl font-black italic tracking-widest uppercase">Analyzing...</h3>
            <p className="mt-4 text-slate-400 text-xs font-bold leading-relaxed">正在通过深度神经网络分析食材纹理、色泽及新鲜度特征。</p>
          </div>
        )}

        {error && (
          <div className="absolute bottom-32 left-6 right-6 bg-red-500/90 text-white p-4 rounded-3xl text-center backdrop-blur font-black text-xs border-b-4 border-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black/90 backdrop-blur-xl p-8 flex items-center justify-around pb-12">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center text-white/50 hover:text-white transition-colors"
          disabled={isAnalyzing}
        >
          <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center mb-1 bg-white/5">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.587-1.587a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">相册</span>
        </button>

        <button 
          onClick={takePhoto}
          className="w-24 h-24 bg-white rounded-full flex items-center justify-center group active:scale-95 transition-all disabled:opacity-50 relative"
          disabled={isAnalyzing}
        >
          <div className="w-20 h-20 rounded-full border-[3px] border-slate-900 flex items-center justify-center">
             <div className="w-16 h-16 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/40 group-active:scale-90 transition-transform"></div>
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping pointer-events-none"></div>
        </button>

        <button 
          onClick={() => setShowTips(true)}
          className="flex flex-col items-center text-white/50 hover:text-white transition-colors"
          disabled={isAnalyzing}
        >
          <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center mb-1 bg-white/5">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">技巧</span>
        </button>
      </div>

      {/* Tips Modal */}
      {showTips && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-end p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full rounded-[3rem] p-8 shadow-2xl border-b-8 border-slate-200 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black italic text-slate-800 uppercase tracking-widest flex items-center">
                <span className="mr-3">💡</span> 拍照最佳实践
              </h2>
              <button onClick={() => setShowTips(false)} className="p-2 text-slate-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="space-y-4 mb-10">
              {[
                { emoji: '☀️', title: '光线充足', desc: '在明亮环境下拍摄，避免阴影遮盖食材特征。' },
                { emoji: '🎯', title: '对焦清晰', desc: '确保食材位于画面中心，等待对焦成功后再按快门。' },
                { emoji: '🪴', title: '背景简洁', desc: '尽量在纯色或简洁桌面上拍摄，减少背景杂物干扰。' },
                { emoji: '📏', title: '距离适中', desc: '让食材占据画面的 60-80%，不要离得太远或太近。' },
                { emoji: '🔍', title: '展示细节', desc: '尽量露出食材最具特征的部分（如叶片、切口或表皮）。' }
              ].map((tip, idx) => (
                <div key={idx} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-2xl mt-1">{tip.emoji}</span>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm mb-0.5">{tip.title}</h4>
                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowTips(false)}
              className="w-full bg-slate-800 py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest border-b-4 border-slate-950 active:translate-y-1 active:border-b-0 transition-all"
            >
              准备好了，开始拍照
            </button>
          </div>
        </div>
      )}

      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileUpload}
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
