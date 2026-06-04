// Real YouTube video data with actual video IDs for embeds and thumbnails

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  channelAvatar: string;
  channelId: string;
  channelInitial: string;
  channelColor: string;
  views: string;
  publishedAt: string;
  duration: string;
  description: string;
  category: string;
  likes?: string;
  subscribers?: string;
}

export interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  authorInitial: string;
  text: string;
  likes: number;
  timeAgo: string;
  replies?: Comment[];
}

const channelColors = [
  '#FF0000', '#FF4500', '#2196F3', '#4CAF50', '#FF9800',
  '#9C27B0', '#00BCD4', '#E91E63', '#3F51B5', '#009688',
  '#FF5722', '#607D8B', '#795548', '#673AB7', '#F44336',
  '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#03A9F4',
];

function getThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function getChannelColor(channelTitle: string): string {
  let hash = 0;
  for (let i = 0; i < channelTitle.length; i++) {
    hash = channelTitle.charCodeAt(i) + ((hash << 5) - hash);
  }
  return channelColors[Math.abs(hash) % channelColors.length];
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

function createVideo(
  id: string,
  title: string,
  channelTitle: string,
  views: string,
  publishedAt: string,
  duration: string,
  description: string,
  category: string,
  subscribers?: string,
): Video {
  return {
    id,
    title,
    thumbnail: getThumbnail(id),
    channelTitle,
    channelAvatar: '',
    channelId: channelTitle.toLowerCase().replace(/\s+/g, ''),
    channelInitial: getInitial(channelTitle),
    channelColor: getChannelColor(channelTitle),
    views,
    publishedAt,
    duration,
    description,
    category,
    likes: `${Math.floor(Math.random() * 900 + 100)}K`,
    subscribers: subscribers || `${Math.floor(Math.random() * 50 + 1)}M`,
  };
}

// Curated real YouTube videos organized by category
export const homeVideos: Video[] = [
  // Music
  createVideo('dQw4w9WgXcQ', 'Rick Astley - Never Gonna Give You Up (Official Music Video)', 'Rick Astley', '1.5B views', '15 years ago', '3:33', 'The official video for "Never Gonna Give You Up" by Rick Astley. "Never Gonna Give You Up" was a global smash on its release in July 1987.', 'Music', '7.2M'),
  createVideo('kJQP7kiw5Fk', 'Luis Fonsi - Despacito ft. Daddy Yankee', 'Luis Fonsi', '8.4B views', '7 years ago', '4:42', 'Despacito es una canción del cantante puertorriqueño Luis Fonsi', 'Music', '34M'),
  createVideo('9bZkp7q19f0', 'PSY - GANGNAM STYLE(강남스타일) M/V', 'officialpsy', '5B views', '12 years ago', '4:13', 'PSY - GANGNAM STYLE(강남스타일) M/V', 'Music', '15M'),
  createVideo('JGwWNGJdvx8', 'Ed Sheeran - Shape of You [Official Video]', 'Ed Sheeran', '6.2B views', '7 years ago', '4:24', 'The official music video for Ed Sheeran - Shape of You', 'Music', '55M'),
  createVideo('fJ9rUzIMcZQ', 'Queen – Bohemian Rhapsody (Official Video Remastered)', 'Queen Official', '1.7B views', '14 years ago', '6:07', 'Bohemian Rhapsody by Queen, remastered in 4K', 'Music', '18M'),
  createVideo('OPf0YbXqDm0', 'Mark Ronson - Uptown Funk (Official Video) ft. Bruno Mars', 'Mark Ronson', '5B views', '10 years ago', '4:31', 'Mark Ronson - Uptown Funk ft. Bruno Mars', 'Music', '3.5M'),

  // Tech & Programming
  createVideo('rfscVS0vtbw', 'Learn Python - Full Course for Beginners [Tutorial]', 'freeCodeCamp.org', '43M views', '6 years ago', '4:26:52', 'This course will give you a full introduction into all of the core concepts in Python.', 'Programming', '10M'),
  createVideo('PkZNo7MFNFg', 'Learn JavaScript - Full Course for Beginners', 'freeCodeCamp.org', '35M views', '6 years ago', '3:26:42', 'This is an introduction to JavaScript. Learn the fundamentals of JavaScript.', 'Programming', '10M'),
  createVideo('w7ejDZ8SWv8', 'React JS Crash Course 2024', 'Traversy Media', '3.2M views', '1 year ago', '1:48:47', 'In this crash course we will learn the fundamentals of React.js including the new features in React 19.', 'Programming', '2.3M'),
  createVideo('Tn6-PIqc4UM', 'React Course - Beginner\'s Tutorial for React JavaScript Library [2022]', 'Programming with Mosh', '4.8M views', '2 years ago', '11:25:06', 'React tutorial for beginners. Learn React from scratch.', 'Programming', '3.5M'),
  createVideo('HD13eq_Pmp8', 'Python Tutorial - Python Full Course for Beginners', 'Mosh', '19M views', '5 years ago', '1:00:01', 'Python tutorial for beginners - Learn Python in 1 hour.', 'Programming', '3.5M'),

  // Science & Education
  createVideo('QImCld9YubE', 'The Largest Black Hole in the Universe - Size Comparison', 'Kurzgesagt – In a Nutshell', '22M views', '3 years ago', '10:02', 'The largest black hole in the universe explained by Kurzgesagt.', 'Science', '22M'),
  createVideo('JtUAAXe_0VI', 'The Egg - A Short Story', 'Kurzgesagt – In a Nutshell', '40M views', '5 years ago', '7:42', 'A short story by Andy Weir, animated by Kurzgesagt.', 'Science', '22M'),
  createVideo('uD4izuDMUQA', 'Optimistic Nihilism', 'Kurzgesagt – In a Nutshell', '28M views', '6 years ago', '6:32', 'The philosophy of optimistic nihilism explained.', 'Science', '22M'),
  createVideo('8aGhZQkoFbQ', 'What Is The Earth Worth?', 'Kurzgesagt – In a Nutshell', '14M views', '2 years ago', '9:28', 'How much is the Earth worth in money?', 'Science', '22M'),

  // Gaming
  createVideo('2Vv-BfVoq4g', 'Minecraft Official Trailer', 'Minecraft', '42M views', '13 years ago', '2:16', 'The original Minecraft trailer that started it all.', 'Gaming', '12M'),
  createVideo('dPHPNgIihR0', 'Grand Theft Auto VI Trailer 1', 'Rockstar Games', '205M views', '1 year ago', '1:31', 'Grand Theft Auto VI — Trailer 1', 'Gaming', '16M'),
  createVideo('hFcLyDb6niA', 'Cuphead Official E3 Trailer', 'StudioMDHR', '10M views', '8 years ago', '1:44', 'Cuphead is a classic run and gun action game.', 'Gaming', '1.2M'),

  // Cooking & Food
  createVideo('Oo26nbHqIDg', 'Gordon Ramsay\'s Scrambled Eggs', 'Gordon Ramsay', '85M views', '12 years ago', '4:03', 'Gordon Ramsay demonstrates his famous scrambled eggs recipe.', 'Cooking', '23M'),
  createVideo('5-8glHb0MHc', 'Gordon Ramsay\'s Perfect Steak Guide', 'Gordon Ramsay', '34M views', '7 years ago', '5:36', 'Learn how to cook the perfect steak with Gordon Ramsay.', 'Cooking', '23M'),

  // News & Politics
  createVideo('9Auq9mYxFEE', 'Hiroshima: Dropping the Bomb', 'BBC', '18M views', '9 years ago', '5:49', 'Hear first-hand accounts from the air and ground, re-telling every memory from the day the world first witnessed the atomic bomb.', 'News', '15M'),

  // Sports
  createVideo('rvFHuvKIBd0', 'The Best Goals of the 2022 FIFA World Cup', 'FIFA', '42M views', '2 years ago', '10:14', 'Relive the best goals scored at the 2022 FIFA World Cup in Qatar.', 'Sports', '18M'),
  createVideo('M4CC-9MnXd4', 'Usain Bolt Wins Olympic Gold | London 2012', 'Olympics', '12M views', '11 years ago', '3:22', 'Usain Bolt wins the 100m final at the London 2012 Olympic Games.', 'Sports', '12M'),

  // Vlogs & Entertainment
  createVideo('jNQXAC9IVRw', 'Me at the zoo', 'jawed', '310M views', '19 years ago', '0:19', 'The first video on YouTube. Posted on April 23, 2005.', 'Entertainment', '2.1M'),
  createVideo('QH2-TGUlwu4', 'Nyan Cat [original]', 'Nyan Cat', '205M views', '13 years ago', '3:37', 'Nyan Cat original video.', 'Entertainment', '1.5M'),

  // Podcasts
  createVideo('9bqk6ZUsKyA', 'Joe Rogan Experience #1368 - Edward Norton', 'PowerfulJRE', '14M views', '5 years ago', '2:12:34', 'Edward Norton is an actor, filmmaker, and activist.', 'Podcasts', '17M'),

  // Live / Events
  createVideo('5qap5aO4i9A', 'lofi hip hop radio - beats to relax/study to', 'Lofi Girl', '1.2B views', 'Streamed 3 years ago', 'LIVE', 'lofi hip hop radio - beats to relax/study to', 'Live', '14M'),

  // Movies
  createVideo('d9MyW72ELq0', 'The Batman - Official Main Trailer', 'Warner Bros. Pictures', '50M views', '3 years ago', '2:36', 'The Batman - Only in Theaters March 4.', 'Movies', '8.5M'),

  // Fitness
  createVideo('UBMk30rjy0o', 'The 5-Minute Full-Body Workout', 'POPSUGAR Fitness', '12M views', '6 years ago', '5:01', 'No excuses! This 5-minute full-body workout hits every major muscle group.', 'Fitness', '4.5M'),

  // Comedy
  createVideo('dDi6YOsGyXw', 'Charlie Bit My Finger - Original!', 'HDCYT', '902M views', '17 years ago', '0:56', 'Charlie bit my finger! The original viral video.', 'Comedy', '1.8M'),

  // Travel
  createVideo('CHuCh66N2C4', '10 Best Places to Visit in Japan', 'touropia', '8.5M views', '4 years ago', '9:04', 'Japan is one of the most popular travel destinations in the world.', 'Travel', '2.3M'),

  // More music
  createVideo('hT_nvWreIhg', 'OneRepublic - Counting Stars', 'OneRepublic', '4.1B views', '11 years ago', '4:44', 'OneRepublic - Counting Stars (Official Music Video)', 'Music', '16M'),
  createVideo('60ItHLz5WEA', 'Alan Walker - Faded (Official Music Video)', 'Alan Walker', '3.7B views', '8 years ago', '3:33', 'Alan Walker - Faded (Official Music Video)', 'Music', '44M'),
  createVideo('pRpeEdMmmQ0', 'Shakira - Waka Waka (This Time for Africa)', 'Shakira', '3.8B views', '14 years ago', '3:31', 'Shakira - Waka Waka (This Time for Africa) (Official Video)', 'Music', '28M'),
  createVideo('lp-EO5I60KA', 'Eminem - Lose Yourself (Official Music Video)', 'Eminem', '1.2B views', '14 years ago', '5:26', 'Eminem - Lose Yourself (Official Music Video)', 'Music', '58M'),
  createVideo('YQHsXMglC9A', 'Adele - Hello (Official Music Video)', 'Adele', '3.2B views', '9 years ago', '6:07', 'Hello, it\'s me. Adele - Hello (Official Music Video)', 'Music', '36M'),
  createVideo('CevxZvSJLk8', 'Katy Perry - Roar (Official)', 'Katy Perry', '3.8B views', '11 years ago', '4:30', 'Katy Perry - Roar (Official)', 'Music', '45M'),
  createVideo('RgKAFK5djSk', 'Wiz Khalifa - See You Again ft. Charlie Puth', 'Wiz Khalifa', '6B views', '9 years ago', '3:58', 'Wiz Khalifa - See You Again ft. Charlie Puth (Furious 7)', 'Music', '29M'),
  createVideo('e-ORhEE9VVg', 'Taylor Swift - Blank Space', 'Taylor Swift', '3.2B views', '10 years ago', '4:33', 'Taylor Swift - Blank Space', 'Music', '56M'),
  createVideo('nfs8NYg7yQM', 'Post Malone - Congratulations ft. Quavo', 'Post Malone', '2.1B views', '7 years ago', '3:41', 'Post Malone - Congratulations ft. Quavo', 'Music', '30M'),
  createVideo('pt8VYOfr8To', 'Maroon 5 - Sugar', 'Maroon 5', '4.1B views', '9 years ago', '5:01', 'Maroon 5 - Sugar (Official Music Video)', 'Music', '37M'),

  // More tech
  createVideo('rZ41y93P2Qo', 'Google Gemini 2.0: Our new AI model for the agentic era', 'Google', '3.5M views', '4 months ago', '8:23', 'Introducing Gemini 2.0, our most capable AI model yet.', 'Programming', '16M'),
  createVideo('aircAruvnKk', 'How I Would Learn To Code (If I Could Start Over)', 'Nick White', '4.2M views', '4 years ago', '10:03', 'How I would learn to code if I could start over as a programmer.', 'Programming', '1.2M'),
  createVideo('jS4aFq5-91M', 'JavaScript Tutorial for Beginners - Full Course in 12 hours', 'freeCodeCamp.org', '12M views', '4 years ago', '12:03:55', 'Learn JavaScript from scratch with this comprehensive course.', 'Programming', '10M'),

  // More gaming
  createVideo('Bi0h4QGGr5k', 'Fortnite - Official Trailer', 'Epic Games', '18M views', '6 years ago', '2:00', 'Fortnite Battle Royale - Official Trailer', 'Gaming', '4.5M'),

  // Anime
  createVideo('byTxJFmFe7Q', 'Attack on Titan Final Season - Official Trailer 4', 'Crunchyroll', '6.2M views', '3 years ago', '1:33', 'Attack on Titan Final Season Part 2 - Official Trailer', 'Entertainment', '6M'),

  // Fashion
  createVideo('M5sPJU3zJ7Q', '10 Fashion Trends That Will Dominate 2024', 'Vogue', '2.8M views', '1 year ago', '12:15', 'From the runways to the streets, these are the fashion trends that will dominate 2024.', 'Fashion', '14M'),

  // Learning
  createVideo('8mAITcNt710', 'How to Study Effectively', 'Ali Abdaal', '8.5M views', '3 years ago', '10:22', 'How to study effectively using evidence-based techniques.', 'Learning', '5M'),
];

export const shortsVideos: Video[] = [
  createVideo('H3or3Bg0Quw', 'Wait for it... 😱', 'MrBeast', '450M views', '1 year ago', '0:15', 'MrBeast shorts', 'Entertainment', '230M'),
  createVideo('bP9sM7vD0oE', 'This trick will blow your mind 🤯', '5-Minute Crafts', '89M views', '2 years ago', '0:30', '5-Minute Crafts shorts', 'Entertainment', '80M'),
  createVideo('SXSfMJDE6sk', 'I can\'t believe this happened', 'Dude Perfect', '120M views', '1 year ago', '0:20', 'Dude Perfect shorts', 'Sports', '62M'),
  createVideo('zHeUgOqZ3ME', 'POV: When your mom calls you by your full name', 'Khaby Lame', '200M views', '1 year ago', '0:12', 'Khaby Lame shorts', 'Comedy', '82M'),
  createVideo('b92WIzFwJrM', 'Satisfying Art Process ✨', 'Art for Kids Hub', '55M views', '2 years ago', '0:25', 'Art for Kids Hub shorts', 'Art', '8M'),
  createVideo('FHJ3CMWnBxY', 'This cat is too smart 🐱', 'The Dodo', '78M views', '1 year ago', '0:18', 'The Dodo shorts', 'Pets', '12M'),
  createVideo('v-PH4M5JgCs', 'World Record Domino Chain Reaction!', 'Dude Perfect', '95M views', '1 year ago', '0:22', 'Dude Perfect shorts', 'Sports', '62M'),
  createVideo('gxNVgE_PqXQ', 'Would you try this? 😮', 'MrBeast', '320M views', '8 months ago', '0:16', 'MrBeast shorts', 'Entertainment', '230M'),
];

export function getVideoById(id: string): Video | undefined {
  return [...homeVideos, ...shortsVideos].find(v => v.id === id);
}

export function getVideosByCategory(category: string): Video[] {
  if (category === 'All') return homeVideos;
  return homeVideos.filter(v => v.category === category);
}

export function searchVideos(query: string): Video[] {
  const q = query.toLowerCase();
  return [...homeVideos, ...shortsVideos].filter(
    v =>
      v.title.toLowerCase().includes(q) ||
      v.channelTitle.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q)
  );
}

export function getRelatedVideos(videoId: string): Video[] {
  const video = getVideoById(videoId);
  if (!video) return homeVideos.slice(0, 12);
  
  const sameCategory = homeVideos.filter(
    v => v.category === video.category && v.id !== videoId
  );
  const others = homeVideos.filter(
    v => v.category !== video.category && v.id !== videoId
  );
  return [...sameCategory, ...others].slice(0, 15);
}

export function getCommentsForVideo(videoId: string): Comment[] {
  const video = getVideoById(videoId);
  const channelName = video?.channelTitle || 'Creator';

  const commentTemplates: Comment[] = [
    {
      id: `${videoId}-1`,
      author: 'TechEnthusiast42',
      authorAvatar: '',
      authorInitial: 'T',
      text: `This is genuinely one of the best videos I've ever watched on this topic. ${channelName} never disappoints! 🔥`,
      likes: 4523,
      timeAgo: '2 days ago',
      replies: [
        {
          id: `${videoId}-1-r1`,
          author: 'MusicLover99',
          authorAvatar: '',
          authorInitial: 'M',
          text: 'Totally agree! I\'ve watched this 5 times already 😂',
          likes: 234,
          timeAgo: '1 day ago',
        },
        {
          id: `${videoId}-1-r2`,
          author: 'RandomViewer',
          authorAvatar: '',
          authorInitial: 'R',
          text: 'Same here, absolutely incredible content!',
          likes: 89,
          timeAgo: '18 hours ago',
        },
      ],
    },
    {
      id: `${videoId}-2`,
      author: 'DigitalNomad',
      authorAvatar: '',
      authorInitial: 'D',
      text: 'I remember when this first came out. Still hits different even after all these years.',
      likes: 2891,
      timeAgo: '1 week ago',
      replies: [
        {
          id: `${videoId}-2-r1`,
          author: 'NostalgiaFan',
          authorAvatar: '',
          authorInitial: 'N',
          text: 'The nostalgia is real 🥺',
          likes: 156,
          timeAgo: '5 days ago',
        },
      ],
    },
    {
      id: `${videoId}-3`,
      author: 'CriticalThinker',
      authorAvatar: '',
      authorInitial: 'C',
      text: 'The production quality of this video is insane. Every detail is so well thought out.',
      likes: 1456,
      timeAgo: '3 days ago',
    },
    {
      id: `${videoId}-4`,
      author: 'CuriousCat',
      authorAvatar: '',
      authorInitial: 'C',
      text: 'Can someone explain the part at 2:34? I didn\'t quite get it. Great video overall though!',
      likes: 789,
      timeAgo: '5 days ago',
      replies: [
        {
          id: `${videoId}-4-r1`,
          author: 'HelperBot3000',
          authorAvatar: '',
          authorInitial: 'H',
          text: 'Basically, it\'s showing how the algorithm processes the input data. Think of it like a filter that sorts information by relevance.',
          likes: 342,
          timeAgo: '4 days ago',
        },
      ],
    },
    {
      id: `${videoId}-5`,
      author: 'SkepticalSam',
      authorAvatar: '',
      authorInitial: 'S',
      text: 'Interesting take, but I think there\'s more nuance to this than what\'s presented here. Still a great video though.',
      likes: 567,
      timeAgo: '1 week ago',
    },
    {
      id: `${videoId}-6`,
      author: 'EarlyBird',
      authorAvatar: '',
      authorInitial: 'E',
      text: 'First! 🎉 But seriously, this is amazing content. Subscribed!',
      likes: 234,
      timeAgo: '2 weeks ago',
    },
    {
      id: `${videoId}-7`,
      author: 'PhilosophyMajor',
      authorAvatar: '',
      authorInitial: 'P',
      text: 'This video raises some profound questions about our relationship with technology and media. Well done.',
      likes: 1023,
      timeAgo: '4 days ago',
    },
    {
      id: `${videoId}-8`,
      author: 'SarcasmKing',
      authorAvatar: '',
      authorInitial: 'S',
      text: 'Who else is watching this at 3 AM when they have work tomorrow? Just me? Okay... 😅',
      likes: 3456,
      timeAgo: '6 days ago',
      replies: [
        {
          id: `${videoId}-8-r1`,
          author: 'NightOwl',
          authorAvatar: '',
          authorInitial: 'N',
          text: 'Me too! The algorithm knows us too well 😂',
          likes: 567,
          timeAgo: '5 days ago',
        },
        {
          id: `${videoId}-8-r2`,
          author: 'EarlyRiser',
          authorAvatar: '',
          authorInitial: 'E',
          text: 'It\'s 3 AM for me too! YouTube rabbit hole is real',
          likes: 234,
          timeAgo: '5 days ago',
        },
      ],
    },
  ];

  return commentTemplates;
}

export const categories = [
  'All', 'Music', 'Gaming', 'Live', 'News', 'Podcasts', 'Programming',
  'Science', 'Cooking', 'Sports', 'Entertainment', 'Comedy', 'Movies',
  'Fashion', 'Fitness', 'Learning', 'Travel', 'Recently uploaded',
];
