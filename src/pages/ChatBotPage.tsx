import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, User, RotateCcw, AlertTriangle } from 'lucide-react';
import { BOT_RESPONSES, GENERAL_BOT_RESPONSES } from '../constants';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatBotPage({ user }: { user: any }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: '1',
        text: 'Halo! Aku Curhat Bot. Aku di sini untuk mendengarkan ceritamu. Apa yang sedang kamu rasakan hari ini?',
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Process bot response
    setTimeout(() => {
      const responseText = getBotResponse(inputText);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (input: string) => {
    const normalizedInput = input.toLowerCase();
    
    // Check keywords in BOT_RESPONSES
    for (const item of BOT_RESPONSES) {
      if (item.keywords.some(kw => normalizedInput.includes(kw.toLowerCase()))) {
        return item.response;
      }
    }

    // Default responses
    const randomIdx = Math.floor(Math.random() * GENERAL_BOT_RESPONSES.length);
    return GENERAL_BOT_RESPONSES[randomIdx];
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col"
    >
      <div className="bg-white p-6 rounded-t-3xl border border-slate-100 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
            <Bot size={28} />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-slate-800">Curhat Bot</h1>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Sentiasa Online</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="text-slate-600 hover:text-rose-600 transition-colors p-2 rounded-xl hover:bg-rose-50"
          title="Reset Percakapan"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-slate-50/50 p-6 space-y-6"
      >
        <div className="bg-amber-100/50 border border-amber-200/50 p-4 rounded-2xl flex items-start gap-3 mb-8">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-amber-800 leading-relaxed">
            Bot ini dirancang untuk memberikan dukungan awal. Jika kamu merasa terancam atau butuh bantuan mendalam, sangat disarankan untuk menemui Bapak/Ibu guru BK di sekolah.
          </p>
        </div>

        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-purple-100 text-purple-600'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`px-5 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-800 shadow-sm rounded-tl-none'}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-[9px] mt-1 opacity-50 ${msg.sender === 'user' ? 'text-white text-right' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-slate-100 px-5 py-3 rounded-2xl rounded-tl-none flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-b-3xl border border-slate-100 border-t-0 shadow-sm">
        <div className="flex gap-3">
          <input 
            id="bot-input"
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Bagaimana perasaanmu di sekolah hari ini?"
            className="flex-1 bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all text-slate-700"
          />
          <button 
            id="btn-send-bot"
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="bg-purple-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
