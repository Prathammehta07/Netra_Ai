import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Volume2, Trash2, Bot, User, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
  id?: string;
  sender: 'user' | 'assistant';
  text: string;
}

export const AIAssistantPage: React.FC = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Hello! I am Netra AI Healthcare Assistant. How can I help you with general eye health or wellness information today?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "I have fever",
    "What are common symptoms of diabetes?",
    "How can I maintain eye health?",
    "What should I do if I suddenly have vision problems?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const res = await axios.post('/api/chat/message', {
        message: text,
        sessionId,
        language
      });

      if (res.data.success && res.data.reply) {
        setSessionId(res.data.sessionId);
        setMessages((prev) => [
          ...prev,
          { sender: 'assistant', text: res.data.reply.text }
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'I am unable to process your request right now. Please consult a medical professional if you have urgent symptoms.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: 'assistant',
        text: 'Chat cleared. How can I assist you with eye health and wellness?'
      }
    ]);
    setSessionId(null);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">Netra AI Healthcare Assistant</h1>
            <p className="text-xs text-slate-500">General wellness information • Non-diagnostic decision support</p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
          title="Clear Chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Chips */}
      <div className="flex flex-wrap gap-2 py-1">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSendMessage(prompt)}
            className="text-xs px-3 py-1.5 rounded-full bg-blue-50/80 hover:bg-blue-100 text-blue-700 font-medium transition border border-blue-100 flex items-center space-x-1"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-teal-500 text-white shadow-xs'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className="space-y-1 max-w-[80%]">
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-100/80 text-slate-800 rounded-tl-none border border-slate-200/60'
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === 'assistant' && (
                <button
                  onClick={() => handleSpeech(msg.text)}
                  className="text-[10px] text-slate-400 hover:text-blue-600 flex items-center space-x-1 px-1 pt-1"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Read aloud</span>
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
            <Bot className="w-4 h-4 animate-bounce text-teal-600" />
            <span>Assistant is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-md"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a health question (e.g. eye care tips, fever, symptoms)..."
          className="flex-1 text-xs px-4 py-2.5 outline-none bg-transparent"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 shadow-md shadow-blue-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
