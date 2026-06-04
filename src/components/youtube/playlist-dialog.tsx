'use client';

import { useState } from 'react';
import { useYouTubeStore } from '@/store/youtube-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  ListVideo,
  Lock,
  Globe,
  Link2,
  Trash2,
  Play,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { getVideoById } from '@/lib/youtube-data';

interface PlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoIdToSave?: string | null;
}

export default function PlaylistDialog({ open, onOpenChange, videoIdToSave }: PlaylistDialogProps) {
  const { playlists, createPlaylist, addToPlaylist, deletePlaylist, openPlaylist } = useYouTubeStore();
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [playlistVisibility, setPlaylistVisibility] = useState<'public' | 'unlisted' | 'private'>('private');
  const [expandedPlaylistId, setExpandedPlaylistId] = useState<string | null>(null);

  const handleCreatePlaylist = () => {
    if (!playlistName.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }
    const newPlaylist = createPlaylist(playlistName.trim(), playlistDescription.trim(), playlistVisibility);
    // If we're saving a video, add it to the newly created playlist
    if (videoIdToSave) {
      addToPlaylist(newPlaylist.id, videoIdToSave);
      toast.success(`Saved to "${playlistName.trim()}"`);
      onOpenChange(false);
      resetForm();
      return;
    }
    toast.success(`Playlist "${playlistName.trim()}" created`);
    resetForm();
  };

  const handleSaveToPlaylist = (playlistId: string) => {
    if (videoIdToSave) {
      const playlist = playlists.find((p) => p.id === playlistId);
      if (playlist?.videos.includes(videoIdToSave)) {
        toast.info('Video already in this playlist');
        return;
      }
      addToPlaylist(playlistId, videoIdToSave);
      toast.success(`Saved to "${playlist?.name}"`);
      onOpenChange(false);
    }
  };

  const handleDeletePlaylist = (e: React.MouseEvent, playlistId: string) => {
    e.stopPropagation();
    deletePlaylist(playlistId);
    toast.success('Playlist deleted');
  };

  const handleOpenPlaylist = (playlistId: string) => {
    openPlaylist(playlistId);
    onOpenChange(false);
  };

  const resetForm = () => {
    setPlaylistName('');
    setPlaylistDescription('');
    setPlaylistVisibility('private');
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return <Globe className="w-3.5 h-3.5" />;
      case 'unlisted': return <Link2 className="w-3.5 h-3.5" />;
      case 'private': return <Lock className="w-3.5 h-3.5" />;
      default: return <Lock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListVideo className="w-5 h-5" />
            {videoIdToSave ? 'Save to playlist' : 'Playlists'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={videoIdToSave ? 'myPlaylists' : 'create'} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="create" className="flex-1">
              <Plus className="w-4 h-4 mr-1.5" />
              Create Playlist
            </TabsTrigger>
            <TabsTrigger value="myPlaylists" className="flex-1">
              <ListVideo className="w-4 h-4 mr-1.5" />
              My Playlists
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white mb-1.5 block">
                  Name
                </label>
                <Input
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Enter playlist name"
                  className="dark:bg-[#272727] dark:border-gray-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white mb-1.5 block">
                  Description
                </label>
                <Textarea
                  value={playlistDescription}
                  onChange={(e) => setPlaylistDescription(e.target.value)}
                  placeholder="Add an optional description"
                  className="min-h-[80px] resize-none dark:bg-[#272727] dark:border-gray-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white mb-1.5 block">
                  Visibility
                </label>
                <Select
                  value={playlistVisibility}
                  onValueChange={(val) => setPlaylistVisibility(val as 'public' | 'unlisted' | 'private')}
                >
                  <SelectTrigger className="dark:bg-[#272727] dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">
                      <span className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5" /> Private
                      </span>
                    </SelectItem>
                    <SelectItem value="unlisted">
                      <span className="flex items-center gap-2">
                        <Link2 className="w-3.5 h-3.5" /> Unlisted
                      </span>
                    </SelectItem>
                    <SelectItem value="public">
                      <span className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5" /> Public
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleCreatePlaylist}
                disabled={!playlistName.trim()}
                className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="myPlaylists" className="mt-4">
            {playlists.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <ListVideo className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">No playlists yet</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Create a playlist to organize your videos
                </p>
              </div>
            ) : (
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {playlists.map((playlist) => {
                  const isExpanded = expandedPlaylistId === playlist.id;
                  return (
                    <div key={playlist.id}>
                      <div
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] cursor-pointer transition-colors"
                        onClick={() => {
                          if (videoIdToSave) {
                            handleSaveToPlaylist(playlist.id);
                          } else {
                            setExpandedPlaylistId(isExpanded ? null : playlist.id);
                          }
                        }}
                      >
                        {videoIdToSave && (
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                            playlist.videos.includes(videoIdToSave)
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-gray-400 dark:border-gray-500'
                          }`}>
                            {playlist.videos.includes(videoIdToSave) && (
                              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M5 12l5 5L20 7" />
                              </svg>
                            )}
                          </div>
                        )}
                        <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center shrink-0 overflow-hidden">
                          {playlist.videos.length > 0 ? (
                            <img
                              src={`https://img.youtube.com/vi/${playlist.videos[0]}/default.jpg`}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ListVideo className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {playlist.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            {getVisibilityIcon(playlist.visibility)}
                            <span>{playlist.videos.length} {playlist.videos.length === 1 ? 'video' : 'videos'}</span>
                          </div>
                        </div>
                        {!videoIdToSave && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenPlaylist(playlist.id);
                              }}
                              className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-colors"
                              aria-label="Open playlist"
                            >
                              <Play className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button
                              onClick={(e) => handleDeletePlaylist(e, playlist.id)}
                              className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                              aria-label="Delete playlist"
                            >
                              <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-red-600" />
                            </button>
                            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </div>
                        )}
                      </div>

                      {/* Expanded playlist videos */}
                      {isExpanded && !videoIdToSave && (
                        <div className="ml-8 mr-2 mb-2 space-y-1">
                          {playlist.videos.length === 0 ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400 py-2 pl-2">
                              No videos in this playlist
                            </p>
                          ) : (
                            playlist.videos.map((videoId) => {
                              const video = getVideoById(videoId);
                              if (!video) return null;
                              return (
                                <div
                                  key={videoId}
                                  className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 dark:hover:bg-[#1a1a1a] cursor-pointer"
                                  onClick={() => {
                                    const { openVideo } = useYouTubeStore.getState();
                                    openVideo(video);
                                  }}
                                >
                                  <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-16 h-9 object-cover rounded shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">
                                      {video.title}
                                    </p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                      {video.channelTitle}
                                    </p>
                                  </div>
                                </div>
                              );
                            })
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenPlaylist(playlist.id);
                            }}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Play all
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {videoIdToSave && (
                  <>
                    <Separator className="my-2" />
                    <button
                      onClick={() => {
                        // Switch to create tab
                        const createTab = document.querySelector('[data-value="create"]') as HTMLElement;
                        createTab?.click();
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] w-full text-left transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center shrink-0">
                        <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        Create new playlist
                      </span>
                    </button>
                  </>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
