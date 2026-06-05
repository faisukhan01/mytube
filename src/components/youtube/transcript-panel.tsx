'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { FileText, X } from 'lucide-react';

interface TranscriptEntry {
  time: string;
  seconds: number;
  text: string;
}

const generateTranscript = (videoId: string): TranscriptEntry[] => {
  const texts = [
    'Welcome back everyone, in this video...',
    'Let me show you what I mean by that',
    'Now this is where it gets really interesting',
    'Pay close attention to this part right here',
    'And that is exactly what makes this so special',
    'Let me break this down for you step by step',
    'This is the key insight that most people miss',
    'Now watch what happens when we do this',
    'This is absolutely incredible when you think about it',
    'And there you have it, that is the complete explanation',
    'So let\'s recap what we\'ve covered so far',
    'This next part is really going to blow your mind',
    'I want you to really focus on this detail',
    'This is what separates the pros from the beginners',
    'And that\'s how you achieve this result',
    'Let me show you one more thing before we wrap up',
    'This technique is game-changing',
    'The results speak for themselves',
    'I hope you found this helpful and informative',
    'Don\'t forget to like and subscribe for more',
  ];

  // Use videoId to create a deterministic but different set of entries
  const seed = videoId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const entries: TranscriptEntry[] = [];
  const count = 10 + (seed % 11); // 10-20 entries

  for (let i = 0; i < count; i++) {
    const seconds = i * 30;
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    entries.push({
      time: `${min}:${sec.toString().padStart(2, '0')}`,
      seconds,
      text: texts[i % texts.length],
    });
  }
  return entries;
};

interface TranscriptPanelProps {
  videoId: string;
  onSeek: (seconds: number) => void;
  onClose: () => void;
}

export default function TranscriptPanel({ videoId, onSeek, onClose }: TranscriptPanelProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const entryRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const transcript = useMemo(() => generateTranscript(videoId), [videoId]);

  // Simulate auto-highlight based on simulated playback progress
  useEffect(() => {
    const indexRef = { current: 0 };

    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % transcript.length;
      setActiveIndex(indexRef.current);
    }, 30000); // Every 30 seconds, advance to next transcript entry

    return () => clearInterval(interval);
  }, [transcript]);

  // Auto-scroll to active entry
  useEffect(() => {
    if (entryRefs.current[activeIndex] && transcriptRef.current) {
      entryRefs.current[activeIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  const handleEntryClick = (index: number) => {
    setActiveIndex(index);
    onSeek(transcript[index].seconds);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col" style={{ maxHeight: '500px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-[#272727] border-b border-gray-200 dark:border-gray-700 shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Transcript</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Transcript entries */}
      <div ref={transcriptRef} className="flex-1 overflow-y-auto p-2 bg-white dark:bg-[#0f0f0f]" style={{ minHeight: '200px' }}>
        {transcript.map((entry, index) => (
          <button
            key={index}
            ref={(el) => { entryRefs.current[index] = el; }}
            onClick={() => handleEntryClick(index)}
            className={`w-full flex items-start gap-3 px-2 py-1.5 rounded transition-colors text-left ${
              activeIndex === index
                ? 'bg-blue-50 dark:bg-blue-900/20'
                : 'hover:bg-gray-50 dark:hover:bg-[#272727]'
            }`}
          >
            <span className={`text-[12px] font-medium shrink-0 mt-0.5 ${
              activeIndex === index
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {entry.time}
            </span>
            <span className={`text-[13px] ${
              activeIndex === index
                ? 'text-gray-900 dark:text-white font-medium'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {entry.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
