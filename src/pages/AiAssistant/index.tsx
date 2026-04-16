import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Volume2,
  Mic,
  Paperclip,
  Send,
  Settings,
  Menu,
  Image as ImageIcon,
  BarChart2,
  FileSpreadsheet,
  FileText,
  Table,
  Play,
  Trash2,
  History,
  Activity,
  Map,
  FileEdit,
  Database,
  Filter
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  isVoice?: boolean;
  audioSrc?: string;
  file?: any;
}

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'ai',
      text: 'Xin chào! Tôi là **AI Trợ lý Quawaco IOC**. Tôi có thể giúp bạn tra cứu thông tin, quy trình vận hành, hoặc phân tích dữ liệu hệ thống.\n\nBạn có thể **nhập văn bản** hoặc nhấn biểu tượng Micro để **ra lệnh bằng giọng nói**. Bạn cần hỗ trợ gì?'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [activeFormat, setActiveFormat] = useState<string | null>(null);

  const [showTools, setShowTools] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const STT_PHRASES = [
    'Trạm Cẩm Phả đang có sự cố gì?',
    'Áp lực nước khu vực Hồng Gai hiện tại?',
    'Cho tôi biết tình trạng NRW hôm nay',
    'Sản lượng hôm nay là bao nhiêu?',
    'Thiết bị nào sắp đến hạn bảo dưỡng?',
    'Quy trình xử lý khi phát hiện vi sinh vượt chuẩn?',
  ];

  const OUTPUT_FORMATS = [
    { id: 'image', label: 'Ảnh', icon: ImageIcon, color: 'text-purple-400', border: 'border-purple-400/40', bgHover: 'hover:bg-purple-400/10', txt: 'ảnh hiện trường trạm cẩm phả sự cố' },
    { id: 'chart', label: 'Biểu đồ', icon: BarChart2, color: 'text-yellow-400', border: 'border-yellow-400/40', bgHover: 'hover:bg-yellow-400/10', txt: 'biểu đồ nrw sản lượng hệ thống' },
    { id: 'excel', label: 'Excel', icon: FileSpreadsheet, color: 'text-green-400', border: 'border-green-400/40', bgHover: 'hover:bg-green-400/10', txt: 'xuất excel danh sách thiết bị' },
    { id: 'pdf', label: 'PDF', icon: FileText, color: 'text-red-400', border: 'border-red-400/40', bgHover: 'hover:bg-red-400/10', txt: 'báo cáo kpi vận hành tháng' },
    { id: 'table', label: 'Bảng', icon: Table, color: 'text-cyan-400', border: 'border-cyan-400/40', bgHover: 'hover:bg-cyan-400/10', txt: 'bảng so sánh áp lực nrw toàn hệ thống' },
  ];

  const SUGGESTIONS = [
    'Quy trình xử lý khi phát hiện vi sinh vượt chuẩn?',
    'Tiêu chuẩn QCVN 01-1:2024/BYT về pH là bao nhiêu?',
    'Trạm Cẩm Phả đang có sự cố gì?',
    'NRW DMA Hồng Gai hiện là bao nhiêu?',
    'Danh sách thiết bị sắp đến hạn bảo dưỡng'
  ];

  const AI_RESPONSES: Record<string, string> = {
    'vi sinh': '**Quy trình xử lý khi phát hiện vi sinh vượt chuẩn:**\n\n1. **Thu mẫu xác nhận** – Lấy mẫu lặp tại điểm phát hiện và 2 điểm lân cận.\n2. **Tăng liều Clo** – Điều chỉnh NaOCl để đạt Clo dư 0.5 mg/L tại đầu cuối mạng.\n3. **Cô lập vùng ảnh hưởng** – Đóng van khoanh vùng, thông báo người dùng.\n\n✅ Tham khảo: QCVN 01-1:2024/BYT.',
    'ph': 'Theo **QCVN 01-1:2024/BYT**, tiêu chuẩn pH nước sạch:\n\n✅ **Giới hạn cho phép: 6.5 – 8.5**\n\nHiện tại hệ thống:\n- Hồng Gai: pH = 7.2\n- Bãi Cháy: pH = 7.0\n- Cẩm Phả: pH = 7.4',
    'cẩm phả': 'Theo dữ liệu hiện tại, **Nhà máy Cẩm Phả** đang có:\n\n🔴 **Sự cố SC-003** – Máy bơm #2 lỗi Motor Overload\n⚠️ **Cảnh báo** – Clo dư 0.61 mg/L vượt ngưỡng QCVN\n⚠️ **Trạm ST-03** – Áp lực tụt 1.4 bar\n\nĐề xuất: Phân công đội kỹ thuật kiểm tra ngay.',
    'nrw': '**NRW khu vực DMA Hồng Gai:**\n\n- Lưu lượng cấp vào: 2,480 m³/h\n- Tiêu thụ có hóa đơn: 2,050 m³/h\n- **Thất thoát: 430 m³/h (17.3%)** ⚠️\n\nNgưỡng cảnh báo: 15% | Ngưỡng nghiêm trọng: 20%',
    'mặc định': 'Tôi đang phân tích dữ liệu hệ thống. Câu hỏi của bạn chưa có trong cơ sở tri thức hiện tại. Vui lòng thử các câu hỏi gợi ý hoặc liên hệ quản trị viên.'
  };

  const handleSend = (text: string = inputVal, isVoice: boolean = false) => {
    if (!text.trim()) return;

    setInputVal('');
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      isVoice
    };

    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const q = text.toLowerCase();
      let responseText = AI_RESPONSES['mặc định'];

      for (const [k, v] of Object.entries(AI_RESPONSES)) {
        if (q.includes(k) && k !== 'mặc định') {
          responseText = v;
          break;
        }
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        text: responseText
      }]);
    }, 1500);
  };

  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      handleSend(STT_PHRASES[Math.floor(Math.random() * STT_PHRASES.length)], true);
    } else {
      setIsRecording(true);
      // Giả lập thu âm tự kết thúc sau 3 giây
      setTimeout(() => {
        setIsRecording(false);
        handleSend(STT_PHRASES[Math.floor(Math.random() * STT_PHRASES.length)], true);
      }, 3000);
    }
  };

  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-[color:var(--cyan)]">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="p-6 h-full flex flex-col overflow-hidden animate-fadeInScale">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div>
          <h1 className="text-[22px] font-bold text-[color:var(--text)]">AI Trợ lý Nội bộ</h1>
          <p className="text-[13px] text-[color:var(--muted)] mt-0.5">
            Tra cứu quy trình, dữ liệu vận hành và kiến thức chuyên ngành
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] border transition-colors ${ttsEnabled ? 'bg-[color:var(--cyan)]/10 border-[color:var(--cyan)]/30 text-[color:var(--cyan)]' : 'bg-[var(--bg-hover)] border-[var(--border)] text-[color:var(--muted)]'}`}
            onClick={() => setTtsEnabled(!ttsEnabled)}
          >
            <Volume2 size={14} /> TTS: {ttsEnabled ? 'Bật' : 'Tắt'}
          </button>
          <button className="btn btn-ghost btn-sm text-[color:var(--muted)] hover:text-[color:var(--cyan)]" onClick={() => setMessages([{ id: '1', role: 'ai', text: 'Lịch sử đã được xóa. Bạn cần tôi giúp gì?' }])}>
            <Trash2 size={14} className="mr-1" /> Xóa lịch sử
          </button>
          <button className="btn btn-outline btn-sm">
            <History size={14} className="mr-1" /> Quản lý lịch sử
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col bg-[var(--bg-hover)] border border-[color:var(--border)] rounded-2xl overflow-hidden shadow-2xl relative min-h-0">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar relative">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-[var(--bg-elevated)] border border-[var(--border)] text-[color:var(--muted)] shadow-sm' : 'bg-gradient-to-br from-[color:var(--blue-dark)] to-[color:var(--cyan)] text-white shadow-[0_4px_12px_rgba(0,102,255,0.3)]'}`}>
                {m.role === 'user' ? <User size={20} /> : <Bot size={22} />}
              </div>
              <div className={`max-w-[75%] px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed relative group ${m.role === 'user' ? 'bg-[color:var(--cyan)]/10 border border-[color:var(--cyan)]/20 text-[color:var(--text)] rounded-tr-sm' : 'bg-[var(--bg-elevated)] border border-[var(--border)] text-[color:var(--text-2)] rounded-tl-sm'}`}>
                {m.isVoice && (
                  <div className="flex items-center gap-2 mb-2 text-[11px] text-[color:var(--cyan)] font-semibold">
                    <Mic size={12} /> Tin nhắn giọng nói
                  </div>
                )}
                <div className="whitespace-pre-wrap">{formatText(m.text)}</div>

                {/* File Attachment mock if provided in message */}

                {/* Hover actions */}
                {m.role === 'ai' && (
                  <button className="absolute -bottom-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-card)] backdrop-blur border border-[var(--border)] rounded-lg p-1.5 text-[color:var(--muted)] hover:text-[color:var(--text)]" title="Đọc to">
                    <Volume2 size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4 flex-row animate-in fade-in slide-in-from-bottom-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[color:var(--blue-dark)] to-[color:var(--cyan)] flex items-center justify-center shrink-0 text-white shadow-lg">
                <Bot size={22} />
              </div>
              <div className="px-5 py-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] rounded-tl-sm flex items-center gap-2 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-[color:var(--cyan)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-[color:var(--cyan)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-[color:var(--cyan)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-[11px] text-[color:var(--muted)] ml-2">Đang phân tích...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion & Formats */}
        <div className="shrink-0 bg-[var(--bg-hover)] border-t border-[color:var(--border)] px-4 py-3 flex flex-col gap-3">

          {/* Format Bar */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            <span className="text-[10px] font-bold text-[color:var(--muted)] uppercase mr-2 shrink-0">Trả lời dạng:</span>
            {OUTPUT_FORMATS.map(f => {
              const Icon = f.icon;
              const isActive = activeFormat === f.id;
              return (
                <button
                  key={f.id}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all border shrink-0 ${isActive ? `${f.color} ${f.border} bg-[color:var(--bg-hover)]` : `text-[color:var(--muted)] border-[var(--border)] ${f.bgHover} hover:border-[var(--border)]`} `}
                  onClick={() => {
                    setActiveFormat(f.id);
                    setInputVal(f.txt);
                  }}
                >
                  <Icon size={12} className={isActive ? f.color : ''} /> {f.label}
                </button>
              );
            })}
          </div>

          {/* Suggestions */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                className="shrink-0 px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg text-[12px] text-[color:var(--muted)] hover:bg-[color:var(--cyan)]/10 hover:border-[color:var(--cyan)]/30 hover:text-[color:var(--cyan)] transition-all font-bold"
                onClick={() => handleSend(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Recording Banner */}
        {isRecording && (
          <div className="absolute bottom-[90px] left-0 right-0 py-3 bg-[var(--red)]/10 border-t border-[var(--red)]/20 backdrop-blur-md flex items-center justify-between px-6 z-10 animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1 bg-[var(--red)] rounded-full animate-bounce" style={{ height: `${Math.random() * 12 + 6}px`, animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
              <span className="text-[var(--red)] font-bold text-[13px] flex items-center gap-2">
                <Mic size={14} className="animate-pulse" /> Đang nghe... Hãy nói câu hỏi của bạn
              </span>
            </div>
            <button className="btn btn-outline btn-sm bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--red)]/50 hover:bg-[var(--red)]/20 text-[var(--red)]" onClick={handleToggleVoice}>
              Dừng
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="shrink-0 bg-[var(--bg-surface)] p-4 border-t border-[color:var(--border)]">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Hỏi Quawaco AI • • •"
              className="w-full bg-[var(--bg-base)] border border-[var(--border)] focus:border-[color:var(--cyan)] rounded-xl py-3 pl-4 pr-12 text-[14px] text-[color:var(--text)] outline-none transition-colors"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${inputVal ? 'bg-[color:var(--cyan)] text-[var(--bg-base)] hover:bg-[color:var(--cyan)]/80' : 'bg-[var(--bg-hover)] text-[color:var(--muted)] hover:bg-[var(--bg-elevated)]'}`}
              onClick={() => handleSend()}
            >
              <Send size={14} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 relative">
              <button className="text-[color:var(--muted)] hover:text-[color:var(--cyan)] transition-colors p-1 group relative">
                <Paperclip size={20} />
              </button>

              {/* Tools Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center gap-1.5 text-[color:var(--muted)] hover:text-[color:var(--text)] px-2 py-1 rounded transition-colors text-[13px] font-semibold"
                  onClick={() => setShowTools(!showTools)}
                >
                  <Settings size={14} /> {showTools ? 'Công cụ ▲' : 'Công cụ ▼'}
                </button>
                {showTools && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl shadow-2xl p-1.5 z-20 animate-in fade-in slide-in-from-bottom-2">
                    {[
                      { i: Activity, l: 'Tra cứu SCADA' },
                      { i: Map, l: 'Bản đồ GIS' },
                      { i: FileEdit, l: 'Viết báo cáo' },
                      { i: Database, l: 'Quản trị RAG' }
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-[color:var(--text)] hover:bg-[var(--bg-hover)] rounded-lg cursor-pointer" onClick={() => setShowTools(false)}>
                        <t.i size={14} className="text-[color:var(--muted)]" /> {t.l}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Category Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center gap-1.5 text-[color:var(--muted)] hover:text-[color:var(--text)] px-2 py-1 rounded transition-colors text-[13px] font-semibold"
                  onClick={() => setShowCategories(!showCategories)}
                >
                  <Filter size={14} /> {selectedCategory} ▼
                </button>
                {showCategories && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl shadow-2xl p-1.5 z-20 animate-in fade-in slide-in-from-bottom-2">
                    {['Tất cả', '💪 Sản xuất', '💧 Chất lượng', '🗺️ Mạng lưới', '💼 Kinh doanh'].map((c, i) => (
                      <div key={i} className="px-3 py-2 text-[13px] text-[color:var(--text)] hover:bg-[var(--bg-hover)] rounded-lg cursor-pointer" onClick={() => { setSelectedCategory(c); setShowCategories(false); }}>
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <span className="w-px h-5 bg-[var(--border)]"></span>

              <button
                className={`p-2 rounded-full transition-colors flex items-center justify-center border ${isRecording ? 'bg-[var(--red)]/20 text-[var(--red)] border-[var(--red)]/30 shadow-[0_0_15px_rgba(255,23,68,0.3)] animate-pulse' : 'bg-[var(--bg-card)] border-[var(--border)] text-[color:var(--muted)] hover:text-[color:var(--cyan)] hover:border-[color:var(--cyan)]/30'}`}
                onClick={handleToggleVoice}
              >
                <Mic size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AiAssistant;
