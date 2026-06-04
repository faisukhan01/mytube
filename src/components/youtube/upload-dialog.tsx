'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
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
import { Progress } from '@/components/ui/progress';
import { Upload, Film, Image as ImageIcon, ArrowLeft, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES = [
  'Autos & Vehicles',
  'Comedy',
  'Education',
  'Entertainment',
  'Film & Animation',
  'Gaming',
  'Howto & Style',
  'Music',
  'News & Politics',
  'People & Blogs',
  'Pets & Animals',
  'Science & Technology',
  'Sports',
  'Travel & Events',
];

const SIMULATED_FILENAME = 'my_video_2025.mp4';

function UploadDialogInner({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const [uploadState, setUploadState] = useState<'dropzone' | 'details'>('dropzone');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [category, setCategory] = useState('');

  const dropzoneRef = useRef<HTMLDivElement>(null);

  // Simulate upload progress
  const startUpload = useCallback(() => {
    setUploadState('details');
    setIsUploading(true);
    setUploadProgress(0);

    const totalDuration = 5000; // 5 seconds
    const interval = 50; // Update every 50ms
    const increment = 100 / (totalDuration / interval);

    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev + increment + (Math.random() * increment * 0.5);
        if (next >= 100) {
          clearInterval(timer);
          setIsUploading(false);
          setIsUploaded(true);
          setTitle(SIMULATED_FILENAME.replace('.mp4', '').replace(/_/g, ' '));
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const handleSelectFiles = () => {
    startUpload();
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    startUpload();
  }, [startUpload]);

  const handlePublish = () => {
    toast.success('Video published successfully!', {
      description: `"${title || SIMULATED_FILENAME}" is now live`,
    });
    onOpenChange(false);
  };

  return (
    <DialogContent className="sm:max-w-[640px] p-0 gap-0 overflow-hidden bg-white dark:bg-[#282828] border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {uploadState === 'details' && (
            <button
              onClick={() => setUploadState('dropzone')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Upload videos
          </h2>
        </div>
        <button
          onClick={() => onOpenChange(false)}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Content */}
      {uploadState === 'dropzone' ? (
        /* State 1: Drag & Drop */
        <div className="p-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center py-16 px-8 border-2 border-dashed rounded-xl transition-colors ${
              isDragOver
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1f1f1f]'
            }`}
          >
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-6">
              <Upload className="w-10 h-10 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-base text-gray-900 dark:text-white mb-2 font-medium">
              Drag and drop video files to upload
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Your videos will be private until you publish them.
            </p>
            <Button
              onClick={handleSelectFiles}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2.5 text-sm font-medium"
            >
              SELECT FILES
            </Button>
          </div>
        </div>
      ) : (
        /* State 2: Details */
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Upload Progress */}
            <div className="flex items-start gap-4">
              <div className="w-28 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
                {isUploaded ? (
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                ) : (
                  <Film className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {SIMULATED_FILENAME}
                </p>
                {isUploading ? (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Uploading...</span>
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {Math.round(uploadProgress)}%
                      </span>
                    </div>
                    <Progress value={uploadProgress} className="h-1.5 bg-gray-200 dark:bg-gray-700 [&>[data-slot=progress-indicator]]:bg-blue-600" />
                  </div>
                ) : isUploaded ? (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Upload complete
                  </p>
                ) : null}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a title that describes your video"
                className="bg-white dark:bg-[#1f1f1f] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                {title.length}/100
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell viewers about your video (type @ to mention a channel)"
                className="min-h-[120px] bg-white dark:bg-[#1f1f1f] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                maxLength={5000}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                {description.length}/5,000
              </p>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Thumbnail
              </label>
              <div className="flex items-start gap-4">
                <div className="w-36 h-20 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1f1f1f] flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                  <ImageIcon className="w-6 h-6 text-gray-400 dark:text-gray-500 mb-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Upload</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Upload a custom thumbnail or a still frame from your video will be used automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* Visibility & Category row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                  Visibility
                </label>
                <Select value={visibility} onValueChange={setVisibility}>
                  <SelectTrigger className="w-full bg-white dark:bg-[#1f1f1f] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#282828] border-gray-200 dark:border-gray-700">
                    <SelectItem value="private" className="text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-[#3f3f3f]">Private</SelectItem>
                    <SelectItem value="unlisted" className="text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-[#3f3f3f]">Unlisted</SelectItem>
                    <SelectItem value="public" className="text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-[#3f3f3f]">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                  Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full bg-white dark:bg-[#1f1f1f] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#282828] border-gray-200 dark:border-gray-700 max-h-[200px]">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-[#3f3f3f]">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Audience */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-900 dark:text-white font-medium mb-1">
                Is this video made for kids?
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Regardless of your location, you must tell us if your videos are made for kids.
              </p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="audience"
                    value="yes"
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Yes, it&apos;s made for kids</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="audience"
                    value="no"
                    defaultChecked
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">No, it&apos;s not made for kids</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1f1f1f]">
            <Button
              variant="ghost"
              onClick={() => setUploadState('dropzone')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isUploading || !title.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Publish
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </DialogContent>
  );
}

export default function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  // Use a key that increments each time the dialog opens to reset all internal state
  const [openCount, setOpenCount] = useState(0);
  
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (newOpen) {
      setOpenCount((c) => c + 1);
    }
    onOpenChange(newOpen);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <UploadDialogInner key={openCount} onOpenChange={onOpenChange} />
    </Dialog>
  );
}
