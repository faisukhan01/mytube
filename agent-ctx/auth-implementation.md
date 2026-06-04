# Task: YouTube Clone User Authentication Implementation

## Summary
Implemented full user authentication system with sign in/sign up, cookie-based sessions, and per-user data persistence for liked videos, watch later list, and watch history.

## Changes Made

### 1. Prisma Schema (`prisma/schema.prisma`)
- Replaced old `User` and `Post` models with new `User` model (id, name, email, password, avatar, initials, color, createdAt) and `UserVideo` model (id, userId, videoId, addedAt, type)
- `UserVideo.type` stores "liked", "watchlater", or "history" to distinguish the list
- Unique constraint on `[userId, videoId, type]` prevents duplicates
- Ran `bun run db:push` to sync schema

### 2. API Routes

#### `/api/auth/signup/route.ts` - POST
- Creates new user with hashed password (simple hash for demo)
- Generates initials and color from user name
- Sets `yt-user-id` cookie (30 days)
- Returns user data

#### `/api/auth/signin/route.ts` - POST
- Validates email/password credentials
- Sets `yt-user-id` cookie on success
- Returns user data

#### `/api/auth/me/route.ts` - GET
- Reads `yt-user-id` cookie to identify current user
- Returns user data or 401

#### `/api/auth/signout/route.ts` - POST
- Clears `yt-user-id` cookie

#### `/api/user/videos/route.ts` - GET/POST/DELETE
- GET: Returns user's liked/watchlater/history video IDs (all or filtered by type)
- POST: Adds video to a list (liked/watchlater/history)
- DELETE: Removes video from a list

### 3. Auth Dialog Component (`src/components/youtube/auth-dialog.tsx`)
- YouTube-styled dialog with two tabs: Sign In and Sign Up
- Sign In: email + password fields
- Sign Up: name + email + password fields
- Show/hide password toggle
- Error message display
- On success, updates store and closes dialog

### 4. Zustand Store Updates (`src/store/youtube-store.ts`)
- Added `user` state (`UserData | null`) and `showAuthDialog` boolean
- Added auth actions: `setUser`, `clearUser`, `toggleAuthDialog`, `setShowAuthDialog`, `fetchUserData`, `checkSession`
- `toggleLike`, `toggleWatchLater`, `addToHistory` now persist to API when user is logged in (optimistic local updates with API calls)
- `clearUser` calls signout API and resets all user data
- `checkSession` checks `/api/auth/me` on app load and restores session
- `fetchUserData` loads user's liked/watchlater/history from API after sign-in

### 5. Header Component Updates (`src/components/youtube/header.tsx`)
- When NOT logged in: clicking avatar opens auth dialog
- When logged in: shows user avatar with initials and a DropdownMenu with:
  - User info (name, handle)
  - Your channel
  - YouTube Studio
  - Switch account
  - Sign out
- AuthDialog component rendered inside header

### 6. Page Component Updates (`src/app/page.tsx`)
- Added `useEffect` to call `checkSession()` on mount to restore user session from cookie

### 7. Video Player View Updates (`src/components/youtube/video-player-view.tsx`)
- Comment section now shows logged-in user's avatar (initials + color)
- New comments use user's name and initials

### 8. Library Views Updates (`src/components/youtube/library-views.tsx`)
- HistoryView, LikedView, WatchLaterView now show sign-in prompt when not logged in
- Uses `allVideos` (combined homeVideos + shortsVideos) for better lookup
- Each view includes a "Sign in" button that opens the auth dialog

## Technical Notes
- ESLint passes with no errors
- All API routes use `import { db } from '@/lib/db'` for database access
- Cookie-based session with `next/headers` cookies()
- Simple hash function for password (demo only)
- Optimistic updates for like/watchlater/history with rollback on API failure
