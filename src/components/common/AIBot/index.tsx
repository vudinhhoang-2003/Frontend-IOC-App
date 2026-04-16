import React, { useState, useEffect } from 'react';
import mascotNew from '../../../assets/mascot-quawaco.png';

const AIBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTtsOn, setIsTtsOn] = useState(false);
  const [toolMenuOpen, setToolMenuOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [catLabel, setCatLabel] = useState('Sản xuất');
  const [toolLabel, setToolLabel] = useState('Công cụ');

  useEffect(() => {
    const handleClickOutside = () => {
      if (toolMenuOpen || catMenuOpen) {
        setToolMenuOpen(false);
        setCatMenuOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [toolMenuOpen, catMenuOpen]);

  return (
    <div id="qwcChatbot" className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div 
          id="qwcChatWindow" 
          className="flex flex-col w-[400px] h-[550px] bg-[#071629] border border-[rgba(0,200,255,0.2)] rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] mb-4 overflow-visible origin-bottom-right animate-[chatPop_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center bg-[var(--bg-surface)] rounded-t-[16px]">
            <div className="font-semibold text-sm flex items-center gap-2 text-white">
              <div className="w-[26px] h-[26px] bg-[rgba(0,200,255,0.1)] rounded-full flex items-center justify-center p-[3px]">
                <img src={mascotNew} className="w-full h-full object-contain" alt="Quawaco mascot" />
              </div>
              Quawaco AI
            </div>
            <div className="flex items-center gap-1.5">
              {/* TTS Toggle */}
              <button 
                title="Bật/tắt đọc to phản hồi AI" 
                onClick={() => setIsTtsOn(!isTtsOn)}
                className={cn(
                  "border border-[rgba(255,255,255,0.1)] w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-[rgba(255,255,255,0.1)]",
                  isTtsOn ? "bg-[rgba(0,200,255,0.15)] text-[var(--cyan)]" : "bg-[rgba(255,255,255,0.05)] text-[var(--muted)]"
                )}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                </svg>
              </button>
              {/* Close */}
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[var(--text)] w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-[rgba(255,255,255,0.1)]"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div id="stickyChatMessages" className="flex-1 overflow-y-auto px-[14px] pt-[14px] custom-scrollbar">
            <div className="flex gap-2.5 mb-4 max-w-[85%]">
              <div className="w-7 h-7 min-w-[28px] bg-[rgba(0,200,255,0.1)] rounded-full flex items-center justify-center p-[4px] self-end shadow-[0_2px_10px_rgba(0,200,255,0.2)]">
                <img src={mascotNew} className="w-full h-full object-contain" alt="AI" />
              </div>
              <div className="bg-[#12233a] border border-[rgba(255,255,255,0.05)] text-white p-3 rounded-[14px] rounded-bl-[2px] text-[13.5px] leading-[1.5] shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
                Xin chào! Tôi là Quawaco AI. Nhập câu hỏi hoặc chọn gợi ý bên dưới.
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="bg-[#131d36] p-4 rounded-b-[16px] border-t border-[rgba(255,255,255,0.05)] relative">
            <div className="relative mb-3">
              <input 
                type="text" 
                placeholder="Hỏi Quawaco AI • • •"
                className="w-full bg-[rgba(0,0,0,0.25)] border border-[rgba(255,255,255,0.1)] rounded-[10px] text-white text-sm px-[14px] pr-[45px] py-3 outline-none caret-[var(--cyan)] transition-colors focus:border-[var(--cyan)]"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[var(--cyan)] text-white w-8 h-8 rounded-[8px] flex items-center justify-center cursor-pointer transition-colors hover:opacity-90">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                {/* Add Icon */}
                <button className="text-[var(--muted)] cursor-pointer hover:text-[var(--cyan)] transition-colors" title="Đính kèm">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>

                {/* Tool Menu */}
                <div className="relative">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setToolMenuOpen(!toolMenuOpen); setCatMenuOpen(false); }}
                    className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--muted)] px-1.5 py-0.5 rounded-md hover:bg-[rgba(255,255,255,0.05)] hover:text-white transition-all"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                    <span>{toolLabel}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {toolMenuOpen && (
                    <div className="absolute bottom-[calc(100%+10px)] left-[-20px] bg-[#1e293b] border border-[rgba(255,255,255,0.1)] rounded-lg p-1.5 min-w-[180px] shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-[100] animate-[chatPop_0.2s_ease]">
                      {['Tra cứu SCADA', 'Bản đồ GIS', 'Viết báo cáo', 'Quản trị RAG'].map(tool => (
                        <div 
                          key={tool}
                          onClick={() => { setToolLabel(tool); setToolMenuOpen(false); }}
                          className="px-3 py-2 text-[13px] text-white cursor-pointer rounded-md transition-colors hover:bg-[rgba(255,255,255,0.1)]"
                        >
                          {tool}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Category Menu */}
                <div className="relative">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCatMenuOpen(!catMenuOpen); setToolMenuOpen(false); }}
                    className="flex items-center gap-1 text-[13px] font-medium text-[var(--muted)] px-2 py-1 rounded-md hover:bg-[rgba(255,255,255,0.05)] hover:text-white transition-all"
                  >
                    <span>{catLabel}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {catMenuOpen && (
                    <div className="absolute bottom-[calc(100%+5px)] right-0 bg-[#1e293b] border border-[rgba(255,255,255,0.1)] rounded-lg p-1.5 min-w-[160px] shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-[100] animate-[chatPop_0.2s_ease]">
                      {['Sản xuất', 'Chất lượng nước', 'Mạng lưới', 'Kinh doanh'].map(cat => (
                        <div 
                          key={cat}
                          onClick={() => { setCatLabel(cat); setCatMenuOpen(false); }}
                          className="px-3 py-2 text-[13px] text-white cursor-pointer rounded-md transition-colors hover:bg-[rgba(255,255,255,0.1)]"
                        >
                          {cat}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mic */}
                <button className="text-[var(--muted)] cursor-pointer hover:text-[var(--cyan)] transition-colors" title="Voice chat">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                    <line x1="8" y1="22" x2="16" y2="22" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mascot Button */}
      <div 
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#0050cc] to-[#00c8ff] border-2 border-[rgba(255,255,255,0.2)] shadow-[0_6px_20px_rgba(0,150,255,0.4)] cursor-pointer flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="absolute inset-[-4px] rounded-full border-2 border-[var(--cyan)] z-[-1] blur-[6px] opacity-60 animate-[haloPulse_3s_infinite]" />
        <img 
          src={mascotNew} 
          alt="Quawaco AI" 
          className="w-12 h-12 object-contain pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]" 
        />
      </div>

      <style>{`
        @keyframes chatPop {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes haloPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.15); filter: blur(8px); }
        }
        @keyframes pd {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .5; transform: scale(.8); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 200, 255, .2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 200, 255, .4);
        }
      `}</style>
    </div>
  );
};

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default AIBot;
