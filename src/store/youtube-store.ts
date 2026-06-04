import { create } from 'zustand';
import { Video, Comment, shortsVideos } from '@/lib/youtube-data';

export type ViewMode = 'home' | 'player' | 'search' | 'shorts' | 'trending' | 'history' | 'liked' | 'watchlater' | 'subscriptions' | 'channel' | 'playlist';

// Helper function to update URL hash without triggering popstate
function updateHash(hash: string) {
  if (typeof window === 'undefined') return;
  if (window.location.hash !== hash) {
    window.history.pushState(null, '', hash);
  }
}

// Helper function to parse hash and return view info
export function parseHash(): { view: ViewMode; videoId?: string; shortIndex?: number; query?: string; channel?: string; playlistId?: string } {
  if (typeof window === 'undefined') return { view: 'home' };
  const hash = window.location.hash.slice(1); // Remove #
  if (!hash || hash === '/') return { view: 'home' };
  if (hash.startsWith('/watch')) {
    const params = new URLSearchParams(hash.split('?')[1]);
    return { view: 'player', videoId: params.get('v') || undefined };
  }
  if (hash.startsWith('/shorts/')) {
    const id = hash.slice(8);
    return { view: 'shorts', videoId: id };
  }
  if (hash.startsWith('/results')) {
    const params = new URLSearchParams(hash.split('?')[1]);
    return { view: 'search', query: params.get('search_query') || undefined };
  }
  if (hash.startsWith('/trending')) return { view: 'trending' };
  if (hash.startsWith('/channel/')) return { view: 'channel', channel: decodeURIComponent(hash.slice(9)) };
  if (hash.startsWith('/history')) return { view: 'history' };
  if (hash.startsWith('/liked')) return { view: 'liked' };
  if (hash.startsWith('/watchlater')) return { view: 'watchlater' };
  if (hash.startsWith('/subscriptions')) return { view: 'subscriptions' };
  if (hash.startsWith('/playlist')) {
    const params = new URLSearchParams(hash.split('?')[1]);
    return { view: 'playlist', playlistId: params.get('list') || undefined };
  }
  return { view: 'home' };
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  initials: string;
  color: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  visibility: 'public' | 'unlisted' | 'private';
  videos: string[];
  createdAt: string;
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
  playlists: Playlist[];
  selectedPlaylistId: string | null;
  showPlaylistDialog: boolean;
  watchProgress: Record<string, number>;
  videoQueue: Video[];
  showQueue: boolean;
  historyPaused: boolean;
  hiddenVideos: string[];

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
  closeMiniPlayer: () => void;
  expandMiniPlayer: () => void;

  // Playlist actions
  createPlaylist: (name: string, description: string, visibility: 'public' | 'unlisted' | 'private') => void;
  addToPlaylist: (playlistId: string, videoId: string) => void;
  removeFromPlaylist: (playlistId: string, videoId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  openPlaylist: (playlistId: string) => void;
  setShowPlaylistDialog: (show: boolean) => void;
  setWatchProgress: (videoId: string, progress: number) => void;

  // Queue actions
  addToQueue: (video: Video) => void;
  removeFromQueue: (videoId: string) => void;
  clearQueue: () => void;
  playNext: () => void;
  toggleQueue: () => void;

  // Hidden videos actions
  hideVideo: (videoId: string) => void;
  unhideVideo: (videoId: string) => void;

  // History actions
  removeFromHistory: (videoId: string) => void;
  clearHistory: () => void;
  toggleHistoryPaused: () => void;

  // Auth actions
  setUser: (user: UserData | null) => void;
  clearUser: () => void;
  toggleAuthDialog: () => void;
  setShowAuthDialog: (show: boolean) => void;
  fetchUserData: () => Promise<void>;
  checkSession: () => Promise<void>;
}

function loadPlaylistsFromStorage(): Playlist[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('yt-playlists');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function savePlaylistsToStorage(playlists: Playlist[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('yt-playlists', JSON.stringify(playlists));
  } catch {
    // Silent fail
  }
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
  playlists: [],
  selectedPlaylistId: null,
  showPlaylistDialog: false,
  watchProgress: {},
  videoQueue: [],
  showQueue: false,
  historyPaused: false,
  hiddenVideos: [],

  setCurrentView: (view) => {
    const state = get();
    // When navigating away from player and there's a current video, show mini player
    if (state.currentView === 'player' && view !== 'player' && state.currentVideo) {
      set({ currentView: view, miniPlayerVideo: state.currentVideo });
    } else {
      set({ currentView: view });
    }
    // Update URL hash based on view
    if (view === 'home') updateHash('#/');
    else if (view === 'shorts') updateHash('#/shorts');
    else if (view === 'trending') updateHash('#/trending');
    else if (view === 'history') updateHash('#/history');
    else if (view === 'liked') updateHash('#/liked');
    else if (view === 'watchlater') updateHash('#/watchlater');
    else if (view === 'subscriptions') updateHash('#/subscriptions');
  },
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

  closeMiniPlayer: () => set({ miniPlayerVideo: null }),

  expandMiniPlayer: () => {
    const state = get();
    if (state.miniPlayerVideo) {
      set({
        currentView: 'player',
        currentVideo: state.miniPlayerVideo,
        miniPlayerVideo: null,
      });
    }
  },

  openVideo: (video) => {
    set({
      currentView: 'player',
      currentVideo: video,
      miniPlayerVideo: null,
    });
    get().addToHistory(video.id);
    updateHash(`#/watch?v=${video.id}`);

    // Simulate watch progress after 3 seconds
    setTimeout(() => {
      const progress = Math.floor(Math.random() * 61) + 20; // 20-80%
      get().setWatchProgress(video.id, progress);
    }, 3000);
  },

  openShort: (index) => {
    set({
      currentView: 'shorts',
      currentShortIndex: index,
    });
    const shortVideo = shortsVideos[index];
    if (shortVideo) {
      updateHash(`#/shorts/${shortVideo.id}`);
    } else {
      updateHash('#/shorts');
    }
  },

  search: (query) => {
    set({ searchQuery: query, isSearching: true, currentView: 'search' });
    updateHash(`#/results?search_query=${encodeURIComponent(query)}`);
  },

  goHome: () => {
    const state = get();
    // If there's a current video playing, show mini player when going home
    if (state.currentView === 'player' && state.currentVideo) {
      set({
        currentView: 'home',
        currentVideo: null,
        searchQuery: '',
        searchResults: [],
        miniPlayerVideo: state.currentVideo,
      });
    } else {
      set({
        currentView: 'home',
        currentVideo: null,
        searchQuery: '',
        searchResults: [],
      });
    }
    updateHash('#/');
  },

  openChannel: (channelName) => {
    const state = get();
    if (state.currentView === 'player' && state.currentVideo) {
      set({ currentView: 'channel', selectedChannel: channelName, miniPlayerVideo: state.currentVideo });
    } else {
      set({ currentView: 'channel', selectedChannel: channelName });
    }
    updateHash(`#/channel/${encodeURIComponent(channelName)}`);
  },

  // Playlist actions
  createPlaylist: (name, description, visibility) => {
    const newPlaylist: Playlist = {
      id: `pl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      description,
      visibility,
      videos: [],
      createdAt: new Date().toISOString(),
    };
    set((s) => {
      const updated = [...s.playlists, newPlaylist];
      savePlaylistsToStorage(updated);
      return { playlists: updated };
    });
  },

  addToPlaylist: (playlistId, videoId) => {
    set((s) => {
      const updated = s.playlists.map((pl) => {
        if (pl.id === playlistId && !pl.videos.includes(videoId)) {
          return { ...pl, videos: [...pl.videos, videoId] };
        }
        return pl;
      });
      savePlaylistsToStorage(updated);
      return { playlists: updated };
    });
  },

  removeFromPlaylist: (playlistId, videoId) => {
    set((s) => {
      const updated = s.playlists.map((pl) => {
        if (pl.id === playlistId) {
          return { ...pl, videos: pl.videos.filter((v) => v !== videoId) };
        }
        return pl;
      });
      savePlaylistsToStorage(updated);
      return { playlists: updated };
    });
  },

  deletePlaylist: (playlistId) => {
    set((s) => {
      const updated = s.playlists.filter((pl) => pl.id !== playlistId);
      savePlaylistsToStorage(updated);
      return {
        playlists: updated,
        selectedPlaylistId: s.selectedPlaylistId === playlistId ? null : s.selectedPlaylistId,
      };
    });
  },

  openPlaylist: (playlistId) => {
    set({
      currentView: 'playlist',
      selectedPlaylistId: playlistId,
    });
    updateHash(`#/playlist?list=${playlistId}`);
  },

  setShowPlaylistDialog: (show) => set({ showPlaylistDialog: show }),

  setWatchProgress: (videoId, progress) => {
    set((s) => {
      const updated = { ...s.watchProgress, [videoId]: progress };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('yt-watch-progress', JSON.stringify(updated));
        } catch {
          // Silent fail
        }
      }
      return { watchProgress: updated };
    });
  },

  // Queue actions
  addToQueue: (video) => set((s) => {
    if (s.videoQueue.some((v) => v.id === video.id)) return s;
    return { videoQueue: [...s.videoQueue, video] };
  }),

  removeFromQueue: (videoId) => set((s) => ({
    videoQueue: s.videoQueue.filter((v) => v.id !== videoId),
  })),

  clearQueue: () => set({ videoQueue: [] }),

  playNext: () => {
    const state = get();
    if (state.videoQueue.length > 0) {
      const nextVideo = state.videoQueue[0];
      set({
        currentVideo: nextVideo,
        videoQueue: state.videoQueue.slice(1),
      });
      get().addToHistory(nextVideo.id);
      // Simulate watch progress
      setTimeout(() => {
        const progress = Math.floor(Math.random() * 61) + 20;
        get().setWatchProgress(nextVideo.id, progress);
      }, 3000);
    }
  },

  toggleQueue: () => set((s) => ({ showQueue: !s.showQueue })),

  // Hidden videos actions
  hideVideo: (videoId) => set((s) => ({ hiddenVideos: [...s.hiddenVideos, videoId] })),
  unhideVideo: (videoId) => set((s) => ({ hiddenVideos: s.hiddenVideos.filter((id) => id !== videoId) })),

  // History actions
  removeFromHistory: (videoId) => set((s) => ({
    watchHistory: s.watchHistory.filter((id) => id !== videoId),
  })),

  clearHistory: () => set({ watchHistory: [] }),

  toggleHistoryPaused: () => set((s) => ({ historyPaused: !s.historyPaused })),

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
    // Load playlists from localStorage regardless of auth
    const playlists = loadPlaylistsFromStorage();

    // Load watch progress from localStorage
    let watchProgress: Record<string, number> = {};
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('yt-watch-progress');
        watchProgress = stored ? JSON.parse(stored) : {};
      } catch {
        watchProgress = {};
      }
    }

    set({ playlists, watchProgress });
  },
}));
