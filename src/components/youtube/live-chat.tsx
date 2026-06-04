'use client';

import { useState, useEffect, useRef } from 'react';
import { useYouTubeStore } from '@/store/youtube-store';
import { Send, ChevronDown, Users, MessageCircle } from 'lucide-react';

const chatUsers = [
  { name: 'MusicLover42', color: '#E91E63', initial: 'M' },
  { name: 'TechGuru', color: '#2196F3', initial: 'T' },
  { name: 'CoolCat99', color: '#4CAF50', initial: 'C' },
  { name: 'NightOwl', color: '#9C27B0', initial: 'N' },
  { name: 'SunshineKid', color: '#FF9800', initial: 'S' },
  { name: 'GamerPro', color: '#00BCD4', initial: 'G' },
  { name: 'FoodieChef', color: '#795548', initial: 'F' },
  { name: 'TravelBug', color: '#607D8B', initial: 'T' },
  { name: 'BookWorm', color: '#3F51B5', initial: 'B' },
  { name: 'ArtLover', color: '#E040FB', initial: 'A' },
];

const chatMessages = [
  'This is amazing! 🔥',
  'First time watching this, incredible!',
  'Who else is watching in 2025? 👋',
  'The quality is insane',
  'Best content on YouTube fr',
  'Can we appreciate how good this is',
  'Legends are watching this right now 😤',
  'This deserves way more views',
  'I keep coming back to this',
  'Absolutely phenomenal 🙌',
  'Wait for it... 🤯',
  'This changed my perspective',
  'The algorithm brought me here and I\'m not disappointed',
  'Anyone else at 3am? 😂',
  'This hits different at night',
  'POV: you can\'t stop watching',
  'The internet was made for this',
  'Masterpiece, plain and simple',
  'How is this so underrated',
  'I\'ve watched this 100 times and it still hits',
  'The vibes are immaculate ✨',
  'W content right here',
  'This is why I love YouTube',
  'Subscribed immediately after this',
  'Pure talent 💯',
];

export default function LiveChat() {
  const { user } = useYouTubeStore();
  const [messages, setMessages] = useState<Array<{id: string; user: typeof chatUsers[0]; text: string; time: string}>>([]);
  const [inputText, setInputText] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const viewerCountRef = useRef(Math.floor(Math.random() * 500 + 100));

  // Simulate incoming chat messages
  useEffect(() => {
    const addMessage = () => {
      const randomUser = chatUsers[Math.floor(Math.random() * chatUsers.length)];
      const randomText = chatMessages[Math.floor(Math.random() * chatMessages.length)];
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      setMessages(prev => {
        const newMsg = {
          id: `msg-${Date.now()}-${Math.random()}`,
          user: randomUser,
          text: randomText,
          time,
        };
        const updated = [...prev, newMsg];
        // Keep max 100 messages
        return updated.slice(-100);
      });
    };

    // Add initial messages
    for (let i = 0; i < 5; i++) {
      setTimeout(addMessage, i * 300);
    }

    // Add new messages periodically (1-4 seconds)
    const interval = setInterval(() => {
      addMessage();
    }, 1000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatRef.current && !isCollapsed) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isCollapsed]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      user: {
        name: user?.name || 'You',
        color: user?.color || '#7C3AED',
        initial: user?.initials?.charAt(0) || 'Y',
      },
      text: inputText.trim(),
      time,
    }]);
    setInputText('');
  };

  if (isCollapsed) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-[#272727] hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-colors"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Live chat</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500 rotate-180" />
        </button>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col" style={{ maxHeight: '500px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-[#272727] border-b border-gray-200 dark:border-gray-700 shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Live chat</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Users className="w-3 h-3" />
            <span>{viewerCountRef.current}</span>
          </div>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          >
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-2 space-y-1 bg-white dark:bg-[#0f0f0f]" style={{ minHeight: '200px' }}>
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-1.5 hover:bg-gray-50 dark:hover:bg-[#272727] px-1 py-0.5 rounded transition-colors">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5"
              style={{ backgroundColor: msg.user.color }}
            >
              {msg.user.initial}
            </div>
            <div className="min-w-0">
              <span className="text-[12px] font-medium mr-1.5" style={{ color: msg.user.color }}>{msg.user.name}</span>
              <span className="text-[12px] text-gray-800 dark:text-gray-300 break-words">{msg.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-[#0f0f0f] shrink-0">
        {user ? (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
              placeholder="Say something..."
              className="flex-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-[#272727] rounded-full outline-none focus:ring-1 focus:ring-blue-500 dark:text-white dark:placeholder-gray-400 transition-shadow"
              maxLength={200}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#272727] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
          </div>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">Sign in to chat</p>
        )}
      </div>
    </div>
  );
}
