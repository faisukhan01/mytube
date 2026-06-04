import { create } from 'zustand';
import { Video, Comment } from '@/lib/youtube-data';

export type ViewMode = 'home' | 'player' | 'search' | 'shorts' | 'trending' | 'history' | 'liked' | 'watchlater' | 'subscriptions' | 'channel';

export interface UserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  initials: string;
  color: string;
}

interface YouTubeState {
  currentView: ViewMode;
  currentVideo: Video | null;
  currentShortIndex: number;
  searchQuery: string;
  sidebarOpen: boolean;
  sidebarMini: boolean;
  selectedCategory: string;
  searchResults: Video[];
  comments: Comment[];
  likedVideos: string[];
  watchLater: string[];
  watchHistory: string[];
  isSearching: boolean;
  miniPlayerVideo: Video | null;
  selectedChannel: string;
  user: UserData | null;
  showAuthDialog: boolean;

  // Actions
  setCurrentView: (view: ViewMode) => void;
  setCurrentVideo: (video: Video | null) => void;
  setCurrentShortIndex: (index: number) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Video[]) => void;
  toggleSidebar: () => void;
  toggleSidebarMini: () => void;
  setSelectedCategory: (category: string) => void;
  setComments: (comments: Comment[]) => void;
  setIsSearching: (searching: boolean) => void;
  toggleLike: (videoId: string) => void;
  toggleWatchLater: (videoId: string) => void;
  addToHistory: (videoId: string) => void;
  setMiniPlayerVideo: (video: Video | null) => void;
  setSelectedChannel: (channel: string) => void;
  openVideo: (video: Video) => void;
  openShort: (index: number) => void;
  search: (query: string) => void;
  goHome: () => void;
  openChannel: (channelName: string) => void;

  // Auth actions
  setUser: (user: UserData | null) => void;
  clearUser: () => void;
  toggleAuthDialog: () => void;
  setShowAuthDialog: (show: boolean) => void;
  fetchUserData: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useYouTubeStore = create<YouTubeState>((set, get) => ({
  currentView: 'home',
  currentVideo: null,
  currentShortIndex: 0,
  searchQuery: '',
  sidebarOpen: true,
  sidebarMini: false,
  selectedCategory: 'All',
  searchResults: [],
  comments: [],
  likedVideos: [],
  watchLater: [],
  watchHistory: [],
  isSearching: false,
  miniPlayerVideo: null,
  selectedChannel: '',
  user: null,
  showAuthDialog: false,

  setCurrentView: (view) => set({ currentView: view }),
  setCurrentVideo: (video) => set({ currentVideo: video }),
  setCurrentShortIndex: (index) => set({ currentShortIndex: index }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleSidebarMini: () => set((state) => ({ sidebarMini: !state.sidebarMini, sidebarOpen: !state.sidebarMini ? false : state.sidebarOpen })),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setComments: (comments) => set({ comments }),
  setIsSearching: (searching) => set({ isSearching: searching }),

  toggleLike: (videoId) => {
    const state = get();
    const isLiked = state.likedVideos.includes(videoId);

    // Update local state immediately
    set((s) => ({
      likedVideos: s.likedVideos.includes(videoId)
        ? s.likedVideos.filter(id => id !== videoId)
        : [...s.likedVideos, videoId],
    }));

    // Persist to server if logged in
    if (state.user) {
      if (isLiked) {
        fetch('/api/user/videos', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId, type: 'liked' }),
        }).catch(() => {
          // Revert on error
          set((s) => ({
            likedVideos: s.likedVideos.includes(videoId)
              ? s.likedVideos
              : [...s.likedVideos, videoId],
          }));
        });
      } else {
        fetch('/api/user/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId, type: 'liked' }),
        }).catch(() => {
          // Revert on error
          set((s) => ({
            likedVideos: s.likedVideos.filter(id => id !== videoId),
          }));
        });
      }
    }
  },

  toggleWatchLater: (videoId) => {
    const state = get();
    const isInList = state.watchLater.includes(videoId);

    // Update local state immediately
    set((s) => ({
      watchLater: s.watchLater.includes(videoId)
        ? s.watchLater.filter(id => id !== videoId)
        : [...s.watchLater, videoId],
    }));

    // Persist to server if logged in
    if (state.user) {
      if (isInList) {
        fetch('/api/user/videos', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId, type: 'watchlater' }),
        }).catch(() => {
          set((s) => ({
            watchLater: s.watchLater.includes(videoId)
              ? s.watchLater
              : [...s.watchLater, videoId],
          }));
        });
      } else {
        fetch('/api/user/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId, type: 'watchlater' }),
        }).catch(() => {
          set((s) => ({
            watchLater: s.watchLater.filter(id => id !== videoId),
          }));
        });
      }
    }
  },

  addToHistory: (videoId) => {
    const state = get();

    // Update local state immediately
    set((s) => ({
      watchHistory: [videoId, ...s.watchHistory.filter(id => id !== videoId)],
    }));

    // Persist to server if logged in
    if (state.user) {
      fetch('/api/user/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, type: 'history' }),
      }).catch(() => {
        // Silent fail for history
      });
    }
  },

  setMiniPlayerVideo: (video) => set({ miniPlayerVideo: video }),
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),

  openVideo: (video) => {
    set({
      currentView: 'player',
      currentVideo: video,
    });
    get().addToHistory(video.id);
  },

  openShort: (index) => {
    set({
      currentView: 'shorts',
      currentShortIndex: index,
    });
  },

  search: (query) => {
    set({ searchQuery: query, isSearching: true, currentView: 'search' });
  },

  goHome: () => set({
    currentView: 'home',
    currentVideo: null,
    searchQuery: '',
    searchResults: [],
  }),

  openChannel: (channelName) => set({
    currentView: 'channel',
    selectedChannel: channelName,
  }),

  // Auth actions
  setUser: (user) => set({ user }),

  clearUser: async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
    } catch {
      // Silent fail
    }
    set({
      user: null,
      likedVideos: [],
      watchLater: [],
      watchHistory: [],
    });
  },

  toggleAuthDialog: () => set((state) => ({ showAuthDialog: !state.showAuthDialog })),
  setShowAuthDialog: (show) => set({ showAuthDialog: show }),

  fetchUserData: async () => {
    try {
      const res = await fetch('/api/user/videos');
      if (res.ok) {
        const data = await res.json();
        set({
          likedVideos: data.liked || [],
          watchLater: data.watchlater || [],
          watchHistory: data.history || [],
        });
      }
    } catch {
      // Silent fail
    }
  },

  checkSession: async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const user = await res.json();
        set({ user });
        await get().fetchUserData();
      }
    } catch {
      // Not authenticated, that's fine
    }
  },
}));
