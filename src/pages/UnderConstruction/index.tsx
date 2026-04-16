import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UnderConstruction: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-in fade-in duration-700">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-cyan/20 blur-3xl rounded-full" />
        <Construction size={80} className="text-cyan relative animate-bounce-slow" />
      </div>
      
      <h1 className="text-3xl font-black text-text mb-4 uppercase tracking-tight">Tính năng đang phát triển</h1>
      <p className="text-muted max-w-md mx-auto mb-10 leading-relaxed">
        Phân hệ này đang trong quá trình xây dựng và hoàn thiện. Vui lòng quay lại sau để trải nghiệm đầy đủ các tính năng của IOC.
      </p>

      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-6 py-3 bg-surface border border-border/50 hover:border-cyan/50 hover:bg-cyan/5 rounded-xl transition-all font-bold text-text-2 shadow-lg"
      >
        <ArrowLeft size={20} />
        Quay lại trang trước
      </button>
    </div>
  );
};

export default UnderConstruction;
