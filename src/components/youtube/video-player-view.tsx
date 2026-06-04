'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import { getCommentsForVideo, getRelatedVideos } from '@/lib/youtube-data';
import VideoCard from './video-card';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  BookmarkPlus,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useState, useMemo } from 'react';

export default function VideoPlayerView() {
  const { currentVideo, goHome, toggleLike, toggleWatchLater, likedVideos, watchLater, openChannel } = useYouTubeStore();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [sortComments, setSortComments] = useState<'top' | 'newest'>('top');
  const [commentText, setCommentText] = useState('');

  const comments = useMemo(() => {
    if (!currentVideo) return [];
    return getCommentsForVideo(currentVideo.id);
  }, [currentVideo]);

  const relatedVideos = useMemo(() => {
    if (!currentVideo) return [];
    return getRelatedVideos(currentVideo.id);
  }, [currentVideo]);

  const isLiked = currentVideo ? likedVideos.includes(currentVideo.id) : false;
  const isWatchLater = currentVideo ? watchLater.includes(currentVideo.id) : false;

  if (!currentVideo) return null;

  const formatLikes = (likes: string) => {
    return likes;
  };

  const handleChannelClick = () => {
    if (currentVideo) {
      openChannel(currentVideo.channelTitle);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 max-w-[1800px] mx-auto">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Video player */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&rel=0`}
            title={currentVideo.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Video title */}
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mt-3 leading-7">
          {currentVideo.title}
        </h1>

        {/* Channel info and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
          {/* Channel info */}
          <div className="flex items-center gap-3">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0"
              style={{ backgroundColor: currentVideo.channelColor }}
              onClick={handleChannelClick}
              aria-label={`Go to ${currentVideo.channelTitle} channel`}
            >
              {currentVideo.channelInitial}
            </button>
            <div>
              <div className="flex items-center gap-1">
                <span
                  className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={handleChannelClick}
                >
                  {currentVideo.channelTitle}
                </span>
                <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{currentVideo.subscribers} subscribers</p>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <Button
                variant="default"
                className="rounded-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black text-sm font-medium px-4 h-9"
              >
                Subscribe
              </Button>
              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full" aria-label="Notifications">
                <Bell className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Like/Dislike */}
            <div className="flex items-center bg-gray-100 dark:bg-[#272727] rounded-full overflow-hidden">
              <button
                onClick={() => toggleLike(currentVideo.id)}
                className={`flex items-center gap-1.5 px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] transition-colors ${
                  isLiked ? 'text-blue-600' : 'text-gray-800 dark:text-gray-200'
                }`}
              >
                <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{formatLikes(currentVideo.likes || '0')}</span>
              </button>
              <Separator orientation="vertical" className="h-6 bg-gray-300 dark:bg-gray-600" />
              <button className="flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] transition-colors">
                <ThumbsDown className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              </button>
            </div>

            <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Share</span>
            </button>

            <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-colors">
              <Download className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Download</span>
            </button>

            <button
              onClick={() => toggleWatchLater(currentVideo.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-colors ${
                isWatchLater ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] text-gray-800 dark:text-gray-200'
              }`}
            >
              <BookmarkPlus className="w-5 h-5" />
              <span className="text-sm font-medium">Save</span>
            </button>

            <button className="p-2 bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-800 dark:text-gray-200" />
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 bg-gray-100 dark:bg-[#272727] rounded-xl p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
            <span>{currentVideo.views}</span>
            <span>{currentVideo.publishedAt}</span>
          </div>
          <div className={`mt-2 text-sm text-gray-800 dark:text-gray-300 whitespace-pre-line ${!showFullDescription ? 'line-clamp-3' : ''}`}>
            {currentVideo.description}
            {showFullDescription && (
              <>
                {'\n\n'}
                {currentVideo.channelTitle}
                {'\n'}
                {currentVideo.views} • {currentVideo.publishedAt}
                {'\n\n'}
                #{currentVideo.category.toLowerCase().replace(/\s+/g, '')} #{currentVideo.channelTitle.toLowerCase().replace(/\s+/g, '')}
              </>
            )}
          </div>
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="flex items-center gap-1 text-sm font-medium text-gray-800 dark:text-gray-300 mt-2 hover:text-gray-900 dark:hover:text-white"
          >
            {showFullDescription ? (
              <>Show less <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>Show more <ChevronDown className="w-4 h-4" /></>
            )}
          </button>
        </div>

        {/* Comments section */}
        <div className="mt-6">
          <div className="flex items-center gap-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {comments.length} Comments
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortComments('top')}
                className={`text-sm font-medium ${sortComments === 'top' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
              >
                Top
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => setSortComments('newest')}
                className={`text-sm font-medium ${sortComments === 'newest' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
              >
                Newest
              </button>
            </div>
          </div>

          {/* Add comment */}
          <div className="flex gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0">
              U
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full border-b border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white outline-none pb-1 text-sm bg-transparent dark:text-white dark:placeholder-gray-400"
              />
              {commentText && (
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCommentText('')}
                    className="dark:text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!commentText.trim()}
                  >
                    Comment
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Comments list */}
          <div className="space-y-5">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0"
                  style={{ backgroundColor: comment.authorInitial === 'T' ? '#2196F3' : comment.authorInitial === 'D' ? '#FF9800' : comment.authorInitial === 'C' ? '#4CAF50' : '#9C27B0' }}
                >
                  {comment.authorInitial}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-gray-900 dark:text-white">@{comment.author}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{comment.timeAgo}</span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-300 mt-0.5">{comment.text}</p>
                  <div className="flex items-center gap-4 mt-1.5">
                    <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-xs">{comment.likes}</span>
                    </button>
                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                    <button className="text-xs text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white">
                      Reply
                    </button>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 ml-0">
                      <button className="flex items-center gap-1 text-blue-700 dark:text-blue-400 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded-full -ml-2">
                        <ChevronDown className="w-4 h-4" />
                        {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                      </button>
                      <div className="mt-2 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-medium text-[10px] shrink-0"
                              style={{ backgroundColor: '#607D8B' }}
                            >
                              {reply.authorInitial}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[13px] font-medium text-gray-900 dark:text-white">@{reply.author}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{reply.timeAgo}</span>
                              </div>
                              <p className="text-sm text-gray-800 dark:text-gray-300 mt-0.5">{reply.text}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                  <span className="text-xs">{reply.likes}</span>
                                </button>
                                <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                  <ThumbsDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related videos sidebar */}
      <div className="lg:w-[400px] shrink-0">
        {/* Chips for related */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {['All', 'Related', 'Recently uploaded', 'Watched'].map((chip) => (
            <button
              key={chip}
              className="shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-[#272727] text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Related videos list */}
        <div className="space-y-2">
          {relatedVideos.map((video) => (
            <VideoCard key={video.id} video={video} layout="list" />
          ))}
        </div>
      </div>
    </div>
  );
}
