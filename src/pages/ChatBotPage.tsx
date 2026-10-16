import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, User, RotateCcw, AlertTriangle, Shield, MessageSquare, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BOT_RESPONSES, UNCLEAR_BOT_MESSAGE, QUICK_KEYWORD_CHIPS, BotTopic } from '../constants';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isUnclear?: boolean;
  matchedCategory?: string;
}

interface BotResult {
  text: string;
  isUnclear: boolean;
  matchedCategory?: string;
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
        text: 'Halo! Aku Curhat Bot, teman bicara virtualmu di SIMPHONY. Aku siap mendengarkan apa pun yang sedang kamu rasakan. Kamu bisa bercerita tentang perundungan (bullying), circle pertemanan, masalah di rumah, kendala belajar, atau masalah pribadimu.',
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

  const checkIsGibberishOrAsal = (raw: string): boolean => {
    const text = raw.trim();
    if (text.length === 0) return true;

    // Very short input that are not recognized greetings/slang
    if (text.length <= 2 && !['hi', 'ya', 'ok', 'yo', 'bk'].includes(text.toLowerCase())) {
      return true;
    }

    // Only numbers, punctuation, or symbols
    if (/^[\d\s\W_]+$/.test(text)) {
      return true;
    }

    // Repeated characters like "aaaaa", "zzzzz", ".....", "1111"
    if (/(.)\1{3,}/i.test(text)) {
      return true;
    }

    const lower = text.toLowerCase();

    // Keyboard mash substrings like "asdf", "qwerty", "zxcv", "ghjk"
    const mashes = ['asdf', 'qwerty', 'zxcv', 'hjkl', 'ghjk', 'yuio', 'dfgh', 'jkl;'];
    if (mashes.some(m => lower.includes(m)) && text.length <= 20) {
      return true;
    }

    // Words with >= 4 consonants and no vowels (e.g. "asdfgh", "qwrty")
    const words = lower.split(/\s+/).filter(Boolean);
    const vowelLessWords = words.filter(w => w.length >= 4 && !/[aiueoy]/i.test(w));
    if (vowelLessWords.length > 0 && vowelLessWords.length >= Math.ceil(words.length / 2)) {
      return true;
    }

    return false;
  };

  const getBotResponse = (input: string): BotResult => {
    // Check if input is gibberish or nonsense
    if (checkIsGibberishOrAsal(input)) {
      return {
        text: UNCLEAR_BOT_MESSAGE,
        isUnclear: true
      };
    }

    const normalizedInput = input.toLowerCase();

    // Check predefined keywords in BOT_RESPONSES
    for (const item of BOT_RESPONSES) {
      if (item.keywords.some(kw => normalizedInput.includes(kw.toLowerCase()))) {
        return {
          text: item.response,
          isUnclear: false,
          matchedCategory: item.category
        };
      }
    }

    // If no keyword matches, user wrote arbitrary unrecognized text
    return {
      text: UNCLEAR_BOT_MESSAGE,
      isUnclear: true
    };
  };

  const sendMessageWithText = (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const result = getBotResponse(textToSend);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: result.text,
        sender: 'bot',
        timestamp: new Date(),
        isUnclear: result.isUnclear,
        matchedCategory: result.matchedCategory
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSend = () => {
    sendMessageWithText(inputText);
  };

  // Helper to format bot text (bolding and bullet points)
  const renderFormattedText = (rawText: string) => {
    const paragraphs = rawText.split('\n\n');

    return (
      <div className="space-y-2.5">
        {paragraphs.map((p, idx) => {
          const lines = p.split('\n');
          return (
            <div key={idx} className="space-y-1">
              {lines.map((line, lIdx) => {
                const trimmed = line.trim();
                const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-');
                const content = isBullet ? trimmed.replace(/^[•\-]\s*/, '') : trimmed;

                // Simple regex to parse **bold**
                const parts = content.split(/(\*\*.*?\*\*)/g);

                return (
                  <div key={lIdx} className={isBullet ? "flex items-start gap-2 pl-1" : ""}>
                    {isBullet && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0 mt-1.5" />
                    )}
                    <span className="text-xs sm:text-sm leading-relaxed">
                      {parts.map((part, pIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return (
                            <strong key={pIdx} className="font-semibold text-stone-900">
                              {part.slice(2, -2)}
                            </strong>
                          );
                        }
                        return part;
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)] flex flex-col"
    >
      {/* Bot Header */}
      <div className="bg-white p-4 sm:p-6 rounded-t-3xl border border-stone-100 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner">
            <Bot size={24} className="sm:size-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-serif font-bold text-stone-800">Curhat Bot</h1>
              <span className="text-[10px] px-2 py-0.5 bg-purple-100/70 text-purple-700 font-bold rounded-full">SIMPHONY</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Online & Siap Mendengar</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/konsultasi"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-brand-primary bg-brand-sidebar hover:bg-brand-primary hover:text-white px-3.5 py-2 rounded-xl transition-all"
            title="Ke Menu Konsultasi Pribadi BK"
          >
            <Shield size={14} />
            <span>Konsultasi Pribadi BK</span>
          </Link>
          <button 
            onClick={() => setMessages([messages[0]])}
            className="text-stone-400 hover:text-rose-600 transition-colors p-2 rounded-xl hover:bg-rose-50"
            title="Reset Percakapan"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-stone-50/60 p-4 sm:p-6 space-y-5"
      >
        <div className="bg-amber-50/90 border border-amber-200/60 p-3.5 sm:p-4 rounded-2xl flex items-start gap-3 shadow-xs">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={17} />
          <p className="text-[11px] sm:text-xs text-amber-900 leading-relaxed font-medium">
            Curhat Bot siap memberikan respon awal untuk masalahmu. Jika tulisanmu belum dipahami atau memerlukan penanganan langsung, silakan gunakan kata kunci topik atau hubungi Guru BK di menu <strong>Konsultasi Pribadi</strong>.
          </p>
        </div>

        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2.5 sm:gap-3 max-w-[92%] sm:max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center shadow-xs ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-purple-100 text-purple-600'}`}>
                {msg.sender === 'user' ? <User size={15} /> : <Bot size={16} />}
              </div>

              <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 sm:px-5 py-3 rounded-2xl shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-brand-primary text-white rounded-tr-none' 
                    : msg.isUnclear
                      ? 'bg-white border-2 border-amber-200 text-stone-800 rounded-tl-none'
                      : 'bg-white border border-stone-100 text-stone-800 rounded-tl-none'
                }`}>
                  {msg.isUnclear && (
                    <div className="flex items-center gap-1.5 text-amber-700 font-bold text-[11px] uppercase tracking-wider mb-2 pb-1.5 border-b border-amber-100">
                      <HelpCircle size={14} />
                      <span>Pesan Belum Dipahami</span>
                    </div>
                  )}

                  {msg.sender === 'user' ? (
                    <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                  ) : (
                    renderFormattedText(msg.text)
                  )}

                  <p className={`text-[9px] mt-2 opacity-50 ${msg.sender === 'user' ? 'text-white text-right' : 'text-stone-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Unclear / Suggested Chips Section */}
                {msg.sender === 'bot' && msg.isUnclear && (
                  <motion.div 
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3.5 bg-white/90 border border-stone-200/80 rounded-2xl shadow-xs w-full max-w-md space-y-2.5"
                  >
                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                      Pilih Topik Kata Kunci Cepat:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_KEYWORD_CHIPS.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessageWithText(chip.keyword)}
                          className="text-[11px] font-medium px-2.5 py-1.5 bg-stone-100 hover:bg-brand-sidebar hover:text-brand-primary text-stone-700 rounded-xl transition-all border border-stone-200/50 flex items-center gap-1"
                        >
                          <span>{chip.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
                      <span className="text-[10px] text-stone-400 italic">Butuh bantuan langsung?</span>
                      <Link
                        to="/konsultasi"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-brand-primary hover:bg-brand-accent px-3 py-1.5 rounded-xl shadow-xs transition-colors"
                      >
                        <Shield size={13} />
                        <span>Ke Konsultasi Pribadi BK</span>
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  </motion.div>
                )}

                {/* For normal responses that matched a problem category, give a subtle BK route shortcut */}
                {msg.sender === 'bot' && !msg.isUnclear && msg.matchedCategory && msg.matchedCategory !== "Sapaan & Ramah Tamah" && (
                  <div className="mt-2 flex items-center gap-2">
                    <Link
                      to="/konsultasi"
                      className="text-[10px] font-bold text-brand-primary hover:text-brand-accent flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-lg border border-stone-200/50 shadow-xs"
                    >
                      <Shield size={12} />
                      <span>Ingin ditangani Guru BK? Buka Konsultasi Pribadi</span>
                      <ChevronRight size={11} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2.5 sm:gap-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-stone-100 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center shadow-xs">
                <span className="text-[11px] font-medium text-stone-400 mr-1">Curhat Bot sedang memproses...</span>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Keyword Chips bar above input */}
      <div className="bg-stone-50 border-t border-stone-100 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles size={12} className="text-purple-500" />
          <span>Topik:</span>
        </span>
        {QUICK_KEYWORD_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => sendMessageWithText(chip.keyword)}
            className="text-[10px] sm:text-[11px] font-medium px-2.5 py-1 bg-white hover:bg-purple-50 hover:text-purple-700 text-stone-600 rounded-lg border border-stone-200/60 shrink-0 transition-colors"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-white p-3 sm:p-5 rounded-b-3xl border border-stone-100 border-t-0 shadow-sm">
        <div className="flex gap-2 sm:gap-3">
          <input 
            id="bot-input"
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ketik apa yang sedang kamu rasakan (contoh: bullying, masalah teman, keluarga, nilai)..."
            className="flex-1 bg-stone-50 border border-stone-200/80 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all text-xs sm:text-sm text-stone-800 placeholder:text-stone-400"
          />
          <button 
            id="btn-send-bot"
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="bg-brand-primary hover:bg-brand-accent text-white px-4 sm:px-5 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all disabled:opacity-40 flex items-center justify-center shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
