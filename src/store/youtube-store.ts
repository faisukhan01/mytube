import { create } from 'zustand';
import { Video, Comment, shortsVideos, getShuffledShorts } from '@/lib/youtube-data';

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
  signIn: (email: string, password: string) => { success: boolean; error?: string };
  signUp: (name: string, email: string, password: string) => { success: boolean; error?: string };
}

// ── localStorage auth helpers ─────────────────────────────────────────────

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar: string;
  initials: string;
  color: string;
}

const AVATAR_COLORS = ['#7C3AED', '#2563EB', '#DC2626', '#059669', '#D97706', '#DB2777', '#0891B2'];

function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = Math.imul(31, h) + str.charCodeAt(i) | 0; }
  return btoa(String(h));
}

function getInitials(name: string): string {
  return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'U';
}

function loadAccounts(): StoredAccount[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('mytube_accounts') || '[]'); } catch { return []; }
}

function saveAccounts(accounts: StoredAccount[]) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem('mytube_accounts', JSON.stringify(accounts)); } catch {}
}

function loadSession(): UserData | null {
  if (typeof window === 'undefined') return null;
  try { const s = localStorage.getItem('mytube_session'); return s ? JSON.parse(s) : null; } catch { return null; }
}

function saveSession(user: UserData) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem('mytube_session', JSON.stringify(user)); } catch {}
}

function clearSessionStorage() {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem('mytube_session'); } catch {}
}

function loadUserData(userId: string) {
  if (typeof window === 'undefined') return { liked: [], watchlater: [], history: [] };
  try { return JSON.parse(localStorage.getItem(`mytube_ud_${userId}`) || '{}'); } catch { return {}; }
}

function trackEvent(name: string, email: string, action: string) {
  if (typeof window === 'undefined') return;
  const url = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL;
  if (!url) return;
  try {
    const endpoint = new URL(url);
    endpoint.searchParams.set('name', name);
    endpoint.searchParams.set('email', email);
    endpoint.searchParams.set('action', action);
    fetch(endpoint.toString(), { mode: 'no-cors' }).catch(() => {});
  } catch {}
}

function saveUserData(userId: string, liked: string[], watchlater: string[], history: string[]) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(`mytube_ud_${userId}`, JSON.stringify({ liked, watchlater, history })); } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────

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
  sidebarOpen: false,
  sidebarMini: true,
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
    const updated = state.likedVideos.includes(videoId)
      ? state.likedVideos.filter(id => id !== videoId)
      : [...state.likedVideos, videoId];
    set({ likedVideos: updated });
    if (state.user) saveUserData(state.user.id, updated, state.watchLater, state.watchHistory);
  },

  toggleWatchLater: (videoId) => {
    const state = get();
    const updated = state.watchLater.includes(videoId)
      ? state.watchLater.filter(id => id !== videoId)
      : [...state.watchLater, videoId];
    set({ watchLater: updated });
    if (state.user) saveUserData(state.user.id, state.likedVideos, updated, state.watchHistory);
  },

  addToHistory: (videoId) => {
    const state = get();
    if (state.historyPaused) return;
    const updated = [videoId, ...state.watchHistory.filter(id => id !== videoId)];
    set({ watchHistory: updated });
    if (state.user) saveUserData(state.user.id, state.likedVideos, state.watchLater, updated);
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
    // If no specific index, start from a random position for variety
    const shortIndex = index >= 0 ? index : Math.floor(Math.random() * shortsVideos.length);
    set({
      currentView: 'shorts',
      currentShortIndex: shortIndex,
    });
    const shortVideo = shortsVideos[shortIndex];
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
    clearSessionStorage();
    set({ user: null, likedVideos: [], watchLater: [], watchHistory: [] });
  },

  toggleAuthDialog: () => set((state) => ({ showAuthDialog: !state.showAuthDialog })),
  setShowAuthDialog: (show) => set({ showAuthDialog: show }),

  fetchUserData: async () => {
    const user = get().user;
    if (!user) return;
    const data = loadUserData(user.id);
    set({
      likedVideos: data.liked || [],
      watchLater: data.watchlater || [],
      watchHistory: data.history || [],
    });
  },

  checkSession: async () => {
    const user = loadSession();
    if (user) {
      set({ user });
      const data = loadUserData(user.id);
      set({
        likedVideos: data.liked || [],
        watchLater: data.watchlater || [],
        watchHistory: data.history || [],
      });
    }
    const playlists = loadPlaylistsFromStorage();
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

  signIn: (email, password) => {
    const accounts = loadAccounts();
    const account = accounts.find(a => a.email.toLowerCase() === email.toLowerCase().trim());
    if (!account) return { success: false, error: 'No account found with this email. Please sign up first.' };
    if (account.passwordHash !== simpleHash(password)) return { success: false, error: 'Incorrect password. Please try again.' };
    const userData: UserData = { id: account.id, name: account.name, email: account.email, avatar: account.avatar, initials: account.initials, color: account.color };
    saveSession(userData);
    set({ user: userData });
    const data = loadUserData(userData.id);
    set({ likedVideos: data.liked || [], watchLater: data.watchlater || [], watchHistory: data.history || [] });
    trackEvent(account.name, account.email, 'signin');
    return { success: true };
  },

  signUp: (name, email, password) => {
    const accounts = loadAccounts();
    if (accounts.find(a => a.email.toLowerCase() === email.toLowerCase().trim())) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const account: StoredAccount = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: simpleHash(password),
      avatar: '',
      initials: getInitials(name),
      color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    };
    saveAccounts([...accounts, account]);
    const userData: UserData = { id: account.id, name: account.name, email: account.email, avatar: account.avatar, initials: account.initials, color: account.color };
    saveSession(userData);
    set({ user: userData, likedVideos: [], watchLater: [], watchHistory: [] });
    trackEvent(account.name, account.email, 'signup');
    return { success: true };
  },
}));
