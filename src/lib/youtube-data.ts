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
  // ==================== MUSIC ====================
  createVideo('dQw4w9WgXcQ', 'Rick Astley - Never Gonna Give You Up (Official Music Video)', 'Rick Astley', '1.5B views', '15 years ago', '3:33', 'The official video for "Never Gonna Give You Up" by Rick Astley.', 'Music', '7.2M'),
  createVideo('kJQP7kiw5Fk', 'Luis Fonsi - Despacito ft. Daddy Yankee', 'Luis Fonsi', '8.4B views', '7 years ago', '4:42', 'Despacito es una canción del cantante puertorriqueño Luis Fonsi', 'Music', '34M'),
  createVideo('9bZkp7q19f0', 'PSY - GANGNAM STYLE(강남스타일) M/V', 'officialpsy', '5B views', '12 years ago', '4:13', 'PSY - GANGNAM STYLE(강남스타일) M/V', 'Music', '15M'),
  createVideo('JGwWNGJdvx8', 'Ed Sheeran - Shape of You [Official Video]', 'Ed Sheeran', '6.2B views', '7 years ago', '4:24', 'The official music video for Ed Sheeran - Shape of You', 'Music', '55M'),
  createVideo('fJ9rUzIMcZQ', 'Queen – Bohemian Rhapsody (Official Video Remastered)', 'Queen Official', '1.7B views', '14 years ago', '6:07', 'Bohemian Rhapsody by Queen, remastered in 4K', 'Music', '18M'),
  createVideo('OPf0YbXqDm0', 'Mark Ronson - Uptown Funk (Official Video) ft. Bruno Mars', 'Mark Ronson', '5B views', '10 years ago', '4:31', 'Mark Ronson - Uptown Funk ft. Bruno Mars', 'Music', '3.5M'),
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
  // BTS
  createVideo('kJenL0jFERc', 'BTS (방탄소년단) \'Butter\' Official MV', 'HYBE LABELS', '1.3B views', '3 years ago', '3:44', 'BTS (방탄소년단) \'Butter\' Official MV', 'Music', '75M'),
  createVideo('gdZLi9oWNsg', 'BTS (방탄소년단) \'Dynamite\' Official MV', 'HYBE LABELS', '1.9B views', '4 years ago', '3:43', 'BTS (방탄소년단) \'Dynamite\' Official MV', 'Music', '75M'),
  createVideo('XsX3ATc3FbA', 'BTS (방탄소년단) \'작은 것들을 위한 시 (Boy With Luv) feat. Halsey\' Official MV', 'HYBE LABELS', '1.8B views', '5 years ago', '3:49', 'BTS Boy With Luv feat. Halsey Official MV', 'Music', '75M'),
  createVideo('WMweEpGlu_U', 'BTS (방탄소년단) \'FAKE LOVE\' Official MV', 'HYBE LABELS', '1.3B views', '6 years ago', '4:51', 'BTS FAKE LOVE Official MV', 'Music', '75M'),
  // Blackpink
  createVideo('bpS2sNYDw1M', 'BLACKPINK - \'뚜두뚜두 (DDU-DU DDU-DU)\' M/V', 'BLACKPINK', '2.1B views', '6 years ago', '3:36', 'BLACKPINK - \'뚜두뚜두 (DDU-DU DDU-DU)\' M/V', 'Music', '92M'),
  createVideo('IHNzOHi8sJs', 'BLACKPINK - \'Kill This Love\' M/V', 'BLACKPINK', '1.8B views', '5 years ago', '3:13', 'BLACKPINK - \'Kill This Love\' M/V', 'Music', '92M'),
  createVideo('ioNn23Qk0Xg', 'BLACKPINK - \'How You Like That\' M/V', 'BLACKPINK', '1.4B views', '4 years ago', '3:01', 'BLACKPINK - \'How You Like That\' M/V', 'Music', '92M'),
  createVideo('2S24-y0Ij3Y', 'BLACKPINK - \'Pink Venom\' M/V', 'BLACKPINK', '650M views', '2 years ago', '3:12', 'BLACKPINK - \'Pink Venom\' M/V', 'Music', '92M'),
  // Taylor Swift
  createVideo('nfWlot6h_Js', 'Taylor Swift - Shake It Off', 'Taylor Swift', '3.4B views', '10 years ago', '4:02', 'Taylor Swift - Shake It Off', 'Music', '56M'),
  createVideo('b1kbLwvqugk', 'Taylor Swift - Anti-Hero (Official Music Video)', 'Taylor Swift', '890M views', '2 years ago', '3:21', 'Taylor Swift - Anti-Hero (Official Music Video)', 'Music', '56M'),
  createVideo('IdneKLhsWOQ', 'Taylor Swift - Look What You Made Me Do', 'Taylor Swift', '1.4B views', '7 years ago', '4:16', 'Taylor Swift - Look What You Made Me Do', 'Music', '56M'),
  // Drake
  createVideo('uxpDa-c-4Mc', 'Drake - God\'s Plan (Official Music Video)', 'Drake', '1.6B views', '6 years ago', '5:57', 'Drake - God\'s Plan (Official Music Video)', 'Music', '42M'),
  createVideo('rbERV2M04ro', 'Drake - One Dance ft. Wizkid & Kyla', 'Drake', '2.2B views', '8 years ago', '2:54', 'Drake - One Dance ft. Wizkid & Kyla', 'Music', '42M'),
  // Billie Eilish
  createVideo('DyDfgMOUjCI', 'Billie Eilish - bad guy (Official Music Video)', 'Billie Eilish', '2.1B views', '5 years ago', '3:25', 'Billie Eilish - bad guy (Official Music Video)', 'Music', '75M'),
  createVideo('V1Pl8CzNzSl', 'Billie Eilish, Khalid - lovely (Official Music Video)', 'Billie Eilish', '1.8B views', '6 years ago', '3:21', 'Billie Eilish, Khalid - lovely', 'Music', '75M'),
  // Ariana Grande
  createVideo('ffxKSjUwLdI', 'Ariana Grande - thank u, next (Official Music Video)', 'Ariana Grande', '780M views', '5 years ago', '3:29', 'Ariana Grande - thank u, next', 'Music', '55M'),
  createVideo('gl1aHhajn6g', 'Ariana Grande - 7 rings (Official Music Video)', 'Ariana Grande', '680M views', '5 years ago', '2:59', 'Ariana Grande - 7 rings', 'Music', '55M'),
  // The Weeknd
  createVideo('QYh6mYAJGfk', 'The Weeknd - Blinding Lights (Official Music Video)', 'The Weeknd', '850M views', '4 years ago', '4:23', 'The Weeknd - Blinding Lights (Official Music Video)', 'Music', '35M'),
  createVideo('4YQ3_irUnWY', 'The Weeknd - Save Your Tears (Official Music Video)', 'The Weeknd', '520M views', '3 years ago', '4:06', 'The Weeknd - Save Your Tears', 'Music', '35M'),
  // Dua Lipa
  createVideo('kMbh6fbSRhw', 'Dua Lipa - Levitating (Official Music Video)', 'Dua Lipa', '410M views', '3 years ago', '3:24', 'Dua Lipa - Levitating (Official Music Video)', 'Music', '30M'),
  createVideo('4G6R2M7fxZA', 'Dua Lipa - Don\'t Start Now (Official Music Video)', 'Dua Lipa', '980M views', '4 years ago', '3:06', 'Dua Lipa - Don\'t Start Now (Official Music Video)', 'Music', '30M'),
  // Justin Bieber
  createVideo('kffacxfA7G4', 'Justin Bieber - Baby ft. Ludacris (Official Music Video)', 'Justin Bieber', '2.7B views', '14 years ago', '3:45', 'Justin Bieber - Baby ft. Ludacris', 'Music', '72M'),
  createVideo('fRh_vgS2dFE', 'Justin Bieber - Sorry (Purpose : The Movement)', 'Justin Bieber', '3.6B views', '9 years ago', '3:21', 'Justin Bieber - Sorry (Purpose : The Movement)', 'Music', '72M'),
  // Adele
  createVideo('Ri7-vnrJD3k', 'Adele - Easy On Me (Official Music Video)', 'Adele', '920M views', '3 years ago', '3:45', 'Adele - Easy On Me (Official Music Video)', 'Music', '36M'),
  createVideo('HaZ6Mvn7dLI', 'Adele - Rolling in the Deep (Official Music Video)', 'Adele', '2.3B views', '14 years ago', '3:54', 'Adele - Rolling in the Deep', 'Music', '36M'),
  // Eminem
  createVideo('YVkUdbDf5CY', 'Eminem - Without Me (Official Music Video)', 'Eminem', '1.9B views', '14 years ago', '4:51', 'Eminem - Without Me (Official Music Video)', 'Music', '58M'),
  createVideo('bKL90Rj0-Yg', 'Eminem - The Real Slim Shady (Official Music Video)', 'Eminem', '1.3B views', '14 years ago', '4:47', 'Eminem - The Real Slim Shady', 'Music', '58M'),
  // More Music
  createVideo('6qelQGy4JCo', 'Queen – Another One Bites the Dust (Official Video)', 'Queen Official', '1.2B views', '13 years ago', '3:35', 'Queen – Another One Bites the Dust', 'Music', '18M'),
  createVideo('bo_efYhYU2A', 'Sia - Cheap Thrills ft. Sean Paul (Lyric Video)', 'Sia', '3.1B views', '8 years ago', '3:44', 'Sia - Cheap Thrills ft. Sean Paul', 'Music', '28M'),
  createVideo('Cmo7pKq3fmY', 'Calvin Harris - This Is What You Came For ft. Rihanna', 'Calvin Harris', '2.7B views', '8 years ago', '3:58', 'Calvin Harris - This Is What You Came For ft. Rihanna', 'Music', '25M'),
  createVideo('pXRviuL6vMY', 'Selena Gomez - Kill Em With Kindness (Official Music Video)', 'Selena Gomez', '780M views', '8 years ago', '3:39', 'Selena Gomez - Kill Em With Kindness', 'Music', '36M'),
  createVideo('nIvCWR0Ob1U', 'Coldplay - Viva La Vida (Official Music Video)', 'Coldplay', '1.1B views', '14 years ago', '4:02', 'Coldplay - Viva La Vida', 'Music', '36M'),
  // More Music - Additional popular videos
  createVideo('aJOTlE1K90k', 'Adele - Someone Like You (Official Music Video)', 'Adele', '2.1B views', '13 years ago', '4:45', 'Adele - Someone Like You (Official Music Video)', 'Music', '36M'),
  createVideo('fX2kvsCSdEI', 'Beyoncé - Single Ladies (Put a Ring on It)', 'Beyoncé', '780M views', '15 years ago', '3:13', 'Beyoncé - Single Ladies (Put a Ring on It)', 'Music', '32M'),
  createVideo('O-F6L4xtzPY', 'YouTube Rewind 2018: Everyone Controls Rewind', 'YouTube', '230M views', '6 years ago', '8:22', 'YouTube Rewind 2018: Everyone Controls Rewind | #YouTubeRewind', 'Music', '160M'),
  createVideo('0KSOMA3QBU0', 'Katy Perry - Dark Horse ft. Juicy J (Official)', 'Katy Perry', '3.2B views', '10 years ago', '3:46', 'Katy Perry - Dark Horse ft. Juicy J (Official)', 'Music', '45M'),
  createVideo('IcrbM1l_BoI', 'Avicii - Wake Me Up (Official Video)', 'Avicii', '2.3B views', '11 years ago', '4:33', 'Avicii - Wake Me Up (Official Video)', 'Music', '24M'),
  createVideo('kXYiU_JCYtU', 'Linkin Park - Numb (Official Music Video)', 'Linkin Park', '1.8B views', '16 years ago', '3:07', 'Linkin Park - Numb (Official Music Video)', 'Music', '32M'),
  createVideo('eVTXPUF4Oz4', 'Linkin Park - In The End (Official Music Video)', 'Linkin Park', '1.9B views', '16 years ago', '3:36', 'Linkin Park - In The End (Official Music Video)', 'Music', '32M'),
  createVideo('YR5ApYxkU-U', 'Lady Gaga - Poker Face (Official Music Video)', 'Lady Gaga', '850M views', '15 years ago', '3:36', 'Lady Gaga - Poker Face (Official Music Video)', 'Music', '25M'),
  createVideo('7PCkvCPvDXk', 'Maroon 5 - Payphone ft. Wiz Khalifa (Official Music Video)', 'Maroon 5', '890M views', '12 years ago', '3:51', 'Maroon 5 - Payphone ft. Wiz Khalifa', 'Music', '37M'),
  createVideo('X9dhb2nmqGE', 'Eminem - The Monster ft. Rihanna (Official Music Video)', 'Eminem', '1.1B views', '10 years ago', '4:15', 'Eminem - The Monster ft. Rihanna', 'Music', '58M'),
  createVideo('au2n7VVGv_c', '50 Cent - In Da Club (Official Music Video)', '50 Cent', '1.6B views', '16 years ago', '3:39', '50 Cent - In Da Club (Official Music Video)', 'Music', '15M'),

  // ==================== TECH & PROGRAMMING ====================
  createVideo('rfscVS0vtbw', 'Learn Python - Full Course for Beginners [Tutorial]', 'freeCodeCamp.org', '43M views', '6 years ago', '4:26:52', 'This course will give you a full introduction into all of the core concepts in Python.', 'Programming', '10M'),
  createVideo('PkZNo7MFNFg', 'Learn JavaScript - Full Course for Beginners', 'freeCodeCamp.org', '35M views', '6 years ago', '3:26:42', 'This is an introduction to JavaScript. Learn the fundamentals of JavaScript.', 'Programming', '10M'),
  createVideo('w7ejDZ8SWv8', 'React JS Crash Course 2024', 'Traversy Media', '3.2M views', '1 year ago', '1:48:47', 'In this crash course we will learn the fundamentals of React.js including the new features in React 19.', 'Programming', '2.3M'),
  createVideo('Tn6-PIqc4UM', 'React Course - Beginner\'s Tutorial for React JavaScript Library [2022]', 'Programming with Mosh', '4.8M views', '2 years ago', '11:25:06', 'React tutorial for beginners. Learn React from scratch.', 'Programming', '3.5M'),
  createVideo('HD13eq_Pmp8', 'Python Tutorial - Python Full Course for Beginners', 'Mosh', '19M views', '5 years ago', '1:00:01', 'Python tutorial for beginners - Learn Python in 1 hour.', 'Programming', '3.5M'),
  createVideo('rZ41y93P2Qo', 'Google Gemini 2.0: Our new AI model for the agentic era', 'Google', '3.5M views', '4 months ago', '8:23', 'Introducing Gemini 2.0, our most capable AI model yet.', 'Programming', '16M'),
  createVideo('aircAruvnKk', 'How I Would Learn To Code (If I Could Start Over)', 'Nick White', '4.2M views', '4 years ago', '10:03', 'How I would learn to code if I could start over as a programmer.', 'Programming', '1.2M'),
  createVideo('jS4aFq5-91M', 'JavaScript Tutorial for Beginners - Full Course in 12 hours', 'freeCodeCamp.org', '12M views', '4 years ago', '12:03:55', 'Learn JavaScript from scratch with this comprehensive course.', 'Programming', '10M'),
  createVideo('Oe421EPjeBE', 'Node.js and Express.js - Full Course', 'freeCodeCamp.org', '3.8M views', '3 years ago', '8:16:47', 'Learn Node.js and Express.js by building a full stack app.', 'Programming', '10M'),
  createVideo('SqcY0Gl8PkI', 'TypeScript Tutorial for Beginners - Learn TypeScript from Scratch!', 'Programming with Mosh', '3.2M views', '3 years ago', '1:04:28', 'Learn TypeScript from scratch in this comprehensive tutorial.', 'Programming', '3.5M'),
  createVideo('9zUHg7xjIqQ', 'Docker Tutorial for Beginners - Full Course', 'TechWorld with Nana', '5.4M views', '3 years ago', '2:16:28', 'Docker tutorial for beginners - learn Docker in one video.', 'Programming', '1.1M'),
  createVideo('uj8C5Ey5qKs', 'AWS Certified Solutions Architect - Associate 2023', 'freeCodeCamp.org', '8.5M views', '2 years ago', '10:27:13', 'AWS Certified Solutions Architect Associate full course.', 'Programming', '10M'),
  createVideo('pTFZrS8LQGU', 'Next.js 14 Full Course 2024', 'JavaScript Mastery', '1.2M views', '1 year ago', '5:04:22', 'Next.js 14 full course - build and deploy a full stack app.', 'Programming', '820K'),
  createVideo('jLM6c6J70kI', 'Git and GitHub for Beginners - Crash Course', 'freeCodeCamp.org', '4.1M views', '3 years ago', '1:08:29', 'Learn Git and GitHub in this beginner-friendly crash course.', 'Programming', '10M'),
  createVideo('HXV3zeQKqGY', 'SQL Tutorial - Full Database Course for Beginners', 'freeCodeCamp.org', '15M views', '5 years ago', '4:20:09', 'Learn SQL in this full course for beginners.', 'Programming', '10M'),
  createVideo('zJSY8tbf_ys', 'Firebase in 100 Seconds', 'Fireship', '3.1M views', '2 years ago', '2:04', 'What is Firebase? Learn the basics in 100 seconds.', 'Programming', '2.8M'),
  createVideo('gPMX7UHdVTs', 'Tailwind CSS in 100 Seconds', 'Fireship', '2.4M views', '3 years ago', '2:06', 'What is Tailwind CSS? Learn it in 100 seconds.', 'Programming', '2.8M'),
  createVideo('1Rs2ND1ryYc', 'CSS Flexbox in 100 Seconds', 'Fireship', '2.8M views', '3 years ago', '2:05', 'Learn CSS Flexbox in 100 seconds.', 'Programming', '2.8M'),
  createVideo('98BzLkvMa3w', 'Rust in 100 Seconds', 'Fireship', '4.2M views', '2 years ago', '2:15', 'What is Rust? Learn the programming language in 100 seconds.', 'Programming', '2.8M'),
  createVideo('pEfrdAtF3XE', 'Python Machine Learning Tutorial (Data Science)', 'Programming with Mosh', '5.6M views', '4 years ago', '2:14:18', 'Python Machine Learning Tutorial for beginners.', 'Programming', '3.5M'),
  // More Programming - Additional tech videos
  createVideo('T6F8E7mU4UA', 'Python Django Tutorial for Beginners - Full Course', 'freeCodeCamp.org', '6.2M views', '4 years ago', '4:01:22', 'Learn Django by building a web application from scratch.', 'Programming', '10M'),
  createVideo('6mbwJ2xhgzM', 'MongoDB in 100 Seconds', 'Fireship', '2.1M views', '2 years ago', '2:08', 'What is MongoDB? Learn the NoSQL database in 100 seconds.', 'Programming', '2.8M'),
  createVideo('6iEUQHFHVSo', 'Claude AI: Anthropic\'s Most Intelligent Model Yet', 'Anthropic', '4.2M views', '6 months ago', '5:33', 'Introducing Claude 3.5, Anthropic\'s most capable AI model.', 'Programming', '8.5M'),
  createVideo('Zb1Qa6TXz8I', 'Go Programming Tutorial – Full Course for Beginners', 'freeCodeCamp.org', '3.8M views', '4 years ago', '6:31:23', 'Learn the Go programming language in this full course for beginners.', 'Programming', '10M'),
  createVideo('Sxxw3qtb3_g', 'Next.js 15 Full Course 2025 - Build and Deploy', 'JavaScript Mastery', '1.5M views', '3 months ago', '5:32:15', 'Next.js 15 full course - build and deploy a full stack AI app.', 'Programming', '820K'),
  createVideo('8mMJZV8YgR0', 'Linux Essentials for Hackers - Full Course', 'freeCodeCamp.org', '4.5M views', '3 years ago', '3:12:45', 'Learn Linux essentials for cybersecurity and ethical hacking.', 'Programming', '10M'),
  createVideo('hHIikHJV9fI', 'OpenAI Sora - Creating Video from Text', 'OpenAI', '8.2M views', '1 year ago', '2:15', 'Introducing Sora, our text-to-video model by OpenAI.', 'Programming', '3.5M'),
  createVideo('8K5cTu6FzQI', 'Flutter Course for Beginners – Full Tutorial', 'freeCodeCamp.org', '5.2M views', '3 years ago', '3:46:10', 'Learn Flutter in this full course for beginners - build iOS and Android apps.', 'Programming', '10M'),
  createVideo('b9eMGE7QtTk', 'Full Stack Development with Next.js and Prisma', 'Web Dev Simplified', '2.8M views', '1 year ago', '1:22:33', 'Learn full stack development with Next.js and Prisma ORM.', 'Programming', '1.5M'),
  createVideo('GfoJXHP3w3A', 'AI Devloper Roadmap 2025 - How to Become an AI Engineer', 'Tiff In Tech', '1.2M views', '5 months ago', '12:45', 'How to become an AI developer in 2025 - the complete roadmap.', 'Programming', '850K'),

  // ==================== SCIENCE & EDUCATION ====================
  createVideo('QImCld9YubE', 'The Largest Black Hole in the Universe - Size Comparison', 'Kurzgesagt – In a Nutshell', '22M views', '3 years ago', '10:02', 'The largest black hole in the universe explained by Kurzgesagt.', 'Science', '22M'),
  createVideo('JtUAAXe_0VI', 'The Egg - A Short Story', 'Kurzgesagt – In a Nutshell', '40M views', '5 years ago', '7:42', 'A short story by Andy Weir, animated by Kurzgesagt.', 'Science', '22M'),
  createVideo('uD4izuDMUQA', 'Optimistic Nihilism', 'Kurzgesagt – In a Nutshell', '28M views', '6 years ago', '6:32', 'The philosophy of optimistic nihilism explained.', 'Science', '22M'),
  createVideo('8aGhZQkoFbQ', 'What Is The Earth Worth?', 'Kurzgesagt – In a Nutshell', '14M views', '2 years ago', '9:28', 'How much is the Earth worth in money?', 'Science', '22M'),
  createVideo('S4RuKkLpPDk', 'Veritasium - The Bizarre Behavior of Rotating Bodies', 'Veritasium', '38M views', '4 years ago', '14:52', 'The bizarre behavior of rotating bodies explained.', 'Science', '16M'),
  createVideo('DkzQxoEgatY', 'Vsauce - Is Your Red The Same as My Red?', 'Vsauce', '28M views', '11 years ago', '10:03', 'Vsauce explores whether your red is the same as my red.', 'Science', '20M'),
  createVideo('ErdFj8R10OY', 'SmarterEveryDay - How Submarines Work', 'SmarterEveryDay', '14M views', '3 years ago', '15:22', 'How do submarines work? Destin explores the engineering.', 'Science', '12M'),
  createVideo('QnQe0xW_JY4', 'Kurzgesagt - The Immune System Explained', 'Kurzgesagt – In a Nutshell', '32M views', '8 years ago', '6:48', 'The immune system explained by Kurzgesagt – bacteria, viruses, and your body.', 'Science', '22M'),
  createVideo('ow5bPIz46V4', 'Kurzgesagt - The Size of the Universe', 'Kurzgesagt – In a Nutshell', '18M views', '4 years ago', '8:55', 'How big is the universe? Kurzgesagt explains.', 'Science', '22M'),
  createVideo('jN7s46E93Aw', 'Veritasium - The Surprising Secret of Synchronization', 'Veritasium', '22M views', '3 years ago', '19:53', 'The surprising secret of synchronization in nature.', 'Science', '16M'),
  createVideo('Ks8WHMRlUQU', 'Kurzgesagt - What If We Detonated All Nuclear Bombs at Once?', 'Kurzgesagt – In a Nutshell', '35M views', '5 years ago', '10:07', 'What would happen if we detonated all nuclear bombs at once?', 'Science', '22M'),
  createVideo('DkGBIUw1YjM', 'Veritasium - Math Has a Fatal Flaw', 'Veritasium', '18M views', '3 years ago', '34:03', 'Not everything that is true can be proven. Veritasium explains.', 'Science', '16M'),
  createVideo('IV-8YsyVDzQ', 'Mark Rober - Liquid Sand Hot Tub - Fluidized Air Bed', 'Mark Rober', '52M views', '7 years ago', '8:03', 'Liquid sand hot tub - fluidized air bed by Mark Rober.', 'Science', '32M'),
  createVideo('3MqTM9nfGSI', 'Mark Rober - Glitterbomb 1.0 vs Porch Pirates', 'Mark Rober', '110M views', '6 years ago', '11:02', 'Mark Rober creates a glitterbomb to catch porch pirates.', 'Science', '32M'),

  // ==================== GAMING ====================
  createVideo('2Vv-BfVoq4g', 'Minecraft Official Trailer', 'Minecraft', '42M views', '13 years ago', '2:16', 'The original Minecraft trailer that started it all.', 'Gaming', '12M'),
  createVideo('dPHPNgIihR0', 'Grand Theft Auto VI Trailer 1', 'Rockstar Games', '205M views', '1 year ago', '1:31', 'Grand Theft Auto VI — Trailer 1', 'Gaming', '16M'),
  createVideo('hFcLyDb6niA', 'Cuphead Official E3 Trailer', 'StudioMDHR', '10M views', '8 years ago', '1:44', 'Cuphead is a classic run and gun action game.', 'Gaming', '1.2M'),
  createVideo('Bi0h4QGGr5k', 'Fortnite - Official Trailer', 'Epic Games', '18M views', '6 years ago', '2:00', 'Fortnite Battle Royale - Official Trailer', 'Gaming', '4.5M'),
  createVideo('H3o7lbPC-BI', 'Minecraft but Every Block is Random', 'Dream', '42M views', '3 years ago', '32:18', 'Minecraft, but every block I break gives me a random block.', 'Gaming', '32M'),
  createVideo('1t_T2o6WwR0', 'Among Us Funny Moments - We Caught The Impostor!', 'PewDiePie', '18M views', '4 years ago', '15:42', 'Among Us funny moments with friends.', 'Gaming', '111M'),
  createVideo('XqYlicq4e6I', 'GTA V - 100 Ways to Die in Los Santos', 'Markiplier', '12M views', '8 years ago', '14:33', '100 ways to die in GTA V Los Santos.', 'Gaming', '36M'),
  createVideo('5MwRGZeaIdk', 'Fortnite - The Device Event (Full Gameplay)', 'Techno Gamerz', '15M views', '4 years ago', '10:47', 'Fortnite The Device live event gameplay.', 'Gaming', '38M'),
  createVideo('WynBKfFZV4A', 'Minecraft Speedrun World Record 1.15', 'Dream', '58M views', '5 years ago', '24:47', 'Minecraft speedrun world record on version 1.15.', 'Gaming', '32M'),
  createVideo('t8HFN7eHcPA', 'PewDiePie - Minecraft Ep. 1 (I\'m back)', 'PewDiePie', '24M views', '5 years ago', '22:33', 'PewDiePie returns to Minecraft in this legendary episode.', 'Gaming', '111M'),
  createVideo('Lmb5Z4xlOJQ', 'Elden Ring - Official Gameplay Reveal', 'Bandai Namco', '18M views', '3 years ago', '3:17', 'Elden Ring official gameplay reveal trailer.', 'Gaming', '3.5M'),
  createVideo('8X2kIfS6fb8', 'The Legend of Zelda: Tears of the Kingdom - Official Trailer', 'Nintendo', '32M views', '2 years ago', '3:34', 'The Legend of Zelda: Tears of the Kingdom official trailer.', 'Gaming', '9.5M'),
  createVideo('StJvF1lp6k0', 'Spider-Man 2 - Official Gameplay Trailer | PS5', 'PlayStation', '15M views', '1 year ago', '4:12', 'Marvel\'s Spider-Man 2 official gameplay trailer on PS5.', 'Gaming', '15M'),
  createVideo('gmA6MrX81z4', 'Fortnite - Chapter 2 Season 1 Trailer', 'Epic Games', '28M views', '5 years ago', '1:42', 'Fortnite Chapter 2 Season 1 official trailer.', 'Gaming', '4.5M'),
  createVideo('r4N8S3D1pKI', 'Valorant - Official Launch Trailer', 'Riot Games', '14M views', '4 years ago', '1:47', 'Valorant official launch trailer.', 'Gaming', '8.2M'),
  createVideo('GhnjvTUvRFk', 'Cyberpunk 2077 - Official Trailer', 'CD Projekt Red', '22M views', '4 years ago', '2:39', 'Cyberpunk 2077 official trailer.', 'Gaming', '2.8M'),
  createVideo('BBcW_jYqEPg', 'Palworld - Official Trailer', 'Pocketpair', '18M views', '1 year ago', '2:15', 'Palworld official trailer - the Pokemon with guns game.', 'Gaming', '1.5M'),
  createVideo('nOEw9iiopgI', 'Baldur\'s Gate 3 - Official Launch Trailer', 'Larian Studios', '8.5M views', '1 year ago', '2:43', 'Baldur\'s Gate 3 official launch trailer.', 'Gaming', '520K'),
  // More Gaming - Additional popular gaming videos
  createVideo('vYi1JWW0LTg', 'Minecraft Live 2024: The Update Show', 'Minecraft', '8.5M views', '5 months ago', '1:15:33', 'Minecraft Live 2024 - all the announcements and reveals.', 'Gaming', '12M'),
  createVideo('uP4F9r5fM2o', 'The Legend of Zelda: Tears of the Kingdom - Gameplay', 'Nintendo', '18M views', '2 years ago', '10:22', 'The Legend of Zelda: Tears of the Kingdom extended gameplay demonstration.', 'Gaming', '9.5M'),
  createVideo('L0p_9S9SWJk', 'GTA Online - The Contract Update Trailer', 'Rockstar Games', '12M views', '3 years ago', '1:22', 'GTA Online The Contract update trailer featuring Dr. Dre.', 'Gaming', '16M'),
  createVideo('Qw5O8N6mtBg', 'Call of Duty: Modern Warfare III - Official Reveal Trailer', 'Call of Duty', '15M views', '1 year ago', '2:15', 'Call of Duty: Modern Warfare III official reveal trailer.', 'Gaming', '4.2M'),
  createVideo('WFHlM0nfjLA', 'Apex Legends - Official Launch Trailer', 'EA', '22M views', '5 years ago', '2:03', 'Apex Legends official launch trailer - battle royale by Respawn.', 'Gaming', '4.5M'),
  createVideo('qC0vDKVPCrw', 'Genshin Impact - Official Gameplay Trailer', 'Genshin Impact', '18M views', '4 years ago', '3:22', 'Genshin Impact official gameplay trailer - open world adventure.', 'Gaming', '8.8M'),
  createVideo('UYnCC9Trzqs', 'Overwatch 2 - Official Reveal Trailer', 'PlayOverwatch', '12M views', '3 years ago', '2:45', 'Overwatch 2 official reveal trailer - the next generation of Overwatch.', 'Gaming', '3.5M'),
  createVideo('u5pBWEPjn5Y', 'Stardew Valley - 1.6 Update Trailer', 'ConcernedApe', '5.2M views', '1 year ago', '1:32', 'Stardew Valley 1.6 update trailer - the massive free content update.', 'Gaming', '620K'),
  createVideo('nV8F2Vq5hE0', 'Hollow Knight: Silksong - Official Trailer', 'Team Cherry', '15M views', '3 years ago', '2:18', 'Hollow Knight: Silksong official trailer - the sequel to Hollow Knight.', 'Gaming', '320K'),
  createVideo('2y9l5TlCqYo', 'Diablo IV - Official Cinematic Trailer', 'Blizzard Entertainment', '18M views', '2 years ago', '5:33', 'Diablo IV official cinematic trailer by Blizzard Entertainment.', 'Gaming', '3.2M'),

  // ==================== COOKING & FOOD ====================
  createVideo('Oo26nbHqIDg', 'Gordon Ramsay\'s Scrambled Eggs', 'Gordon Ramsay', '85M views', '12 years ago', '4:03', 'Gordon Ramsay demonstrates his famous scrambled eggs recipe.', 'Cooking', '23M'),
  createVideo('5-8glHb0MHc', 'Gordon Ramsay\'s Perfect Steak Guide', 'Gordon Ramsay', '34M views', '7 years ago', '5:36', 'Learn how to cook the perfect steak with Gordon Ramsay.', 'Cooking', '23M'),
  createVideo('OYxd552bfNA', 'Binging with Babish - Krabby Patty from SpongeBob', 'Binging with Babish', '18M views', '6 years ago', '6:22', 'Binging with Babish recreates the Krabby Patty from SpongeBob SquarePants.', 'Cooking', '11M'),
  createVideo('J8j3Vza5nQk', 'Joshua Weissman - But Better: Big Mac', 'Joshua Weissman', '8.5M views', '3 years ago', '12:45', 'Joshua Weissman makes a Big Mac, but better.', 'Cooking', '8.5M'),
  createVideo('Xt5zzI_3-VA', 'Gordon Ramsay - How to Make the Perfect Pasta Carbonara', 'Gordon Ramsay', '22M views', '6 years ago', '4:18', 'Gordon Ramsay makes the perfect pasta carbonara.', 'Cooking', '23M'),
  createVideo('gHYFkJBXMkk', 'Binging with Babish - Pasta Aglio e Olio from Chef', 'Binging with Babish', '14M views', '7 years ago', '5:31', 'Binging with Babish recreates the pasta aglio e olio from the movie Chef.', 'Cooking', '11M'),
  createVideo('d7U5GJZP6xQ', 'Joshua Weissman - Making the Best Pizza Dough', 'Joshua Weissman', '6.8M views', '2 years ago', '15:32', 'Joshua Weissman makes the ultimate pizza dough from scratch.', 'Cooking', '8.5M'),
  createVideo('WAWfOZ1xSf4', 'Gordon Ramsay - Ultimate Cookery Course Episode 1', 'Gordon Ramsay', '28M views', '10 years ago', '21:07', 'Gordon Ramsay\'s ultimate cookery course - episode 1.', 'Cooking', '23M'),
  createVideo('Sz84uJFR3YQ', 'Babish Culinary Universe - Butter Chicken from Scratch', 'Binging with Babish', '5.2M views', '2 years ago', '10:33', 'Making authentic butter chicken from scratch.', 'Cooking', '11M'),
  createVideo('YDnEW3PC1oM', 'Kenji Lopez-Alt - The Best Chocolate Chip Cookies', 'J. Kenji López-Alt', '7.8M views', '3 years ago', '14:21', 'The science behind the best chocolate chip cookies.', 'Cooking', '2.1M'),
  createVideo('gb5rAlBdHPE', 'Joshua Weissman - 72 Hour Short Ribs', 'Joshua Weissman', '4.2M views', '2 years ago', '18:45', 'Joshua Weissman makes 72 hour short ribs.', 'Cooking', '8.5M'),
  createVideo('ns3vJ8LqRxQ', 'Gordon Ramsay - How to Cook a Thanksgiving Turkey', 'Gordon Ramsay', '12M views', '8 years ago', '8:52', 'Gordon Ramsay shows you how to cook the perfect Thanksgiving turkey.', 'Cooking', '23M'),
  createVideo('UPOGvPbYqTM', 'Binging with Babish - Ram-Don from Parasite', 'Binging with Babish', '9.8M views', '4 years ago', '8:17', 'Binging with Babish recreates the Ram-don from Parasite.', 'Cooking', '11M'),

  // ==================== SPORTS ====================
  createVideo('rvFHuvKIBd0', 'The Best Goals of the 2022 FIFA World Cup', 'FIFA', '42M views', '2 years ago', '10:14', 'Relive the best goals scored at the 2022 FIFA World Cup in Qatar.', 'Sports', '18M'),
  createVideo('M4CC-9MnXd4', 'Usain Bolt Wins Olympic Gold | London 2012', 'Olympics', '12M views', '11 years ago', '3:22', 'Usain Bolt wins the 100m final at the London 2012 Olympic Games.', 'Sports', '12M'),
  createVideo('fg9K1FLUhmk', 'LeBron James - Top 10 Plays of His Career', 'NBA', '18M views', '5 years ago', '5:44', 'LeBron James\' top 10 plays of his NBA career.', 'Sports', '22M'),
  createVideo('9bqk6ZUsKyA', 'Conor McGregor vs Khabib Nurmagomedov - UFC 229 Highlights', 'UFC', '65M views', '6 years ago', '12:33', 'Conor McGregor vs Khabib Nurmagomedov at UFC 229.', 'Sports', '15M'),
  createVideo('vJz8GvW1g0A', 'Cristiano Ronaldo - Greatest Goals Ever', 'CR7', '28M views', '4 years ago', '10:22', 'Cristiano Ronaldo\'s greatest goals ever scored.', 'Sports', '5.5M'),
  createVideo('p6mQiYq0Hfs', 'Lionel Messi - Top 50 Impossible Goals', 'Messi', '22M views', '3 years ago', '15:48', 'Lionel Messi\'s top 50 most impossible goals.', 'Sports', '4.8M'),
  createVideo('6a4XcG6iZQE', 'Stephen Curry - Best 3-Pointers of 2022-23 Season', 'NBA', '8.5M views', '1 year ago', '6:22', 'Stephen Curry\'s best 3-pointers of the 2022-23 NBA season.', 'Sports', '22M'),
  createVideo('WjxlzswCkK0', 'F1 - Max Verstappen\'s Incredible Overtakes', 'Formula 1', '14M views', '2 years ago', '8:45', 'Max Verstappen\'s most incredible overtakes in Formula 1.', 'Sports', '11M'),
  createVideo('LAr6oAKieHk', 'NBA - Top 100 Plays of 2023', 'NBA', '12M views', '1 year ago', '15:33', 'The top 100 plays of the 2023 NBA season.', 'Sports', '22M'),
  createVideo('vn-gkZ4oPTs', 'Kobe Bryant - Best Career Plays', 'NBA', '16M views', '7 years ago', '10:17', 'Kobe Bryant\'s best plays of his legendary NBA career.', 'Sports', '22M'),
  createVideo('VNl0K4cH_1c', 'Tyson Fury vs Deontay Wilder 3 - Full Fight Highlights', 'Boxing', '22M views', '3 years ago', '12:48', 'Tyson Fury vs Deontay Wilder III full fight highlights.', 'Sports', '8.2M'),
  createVideo('hO8Mxls6LGA', 'The Best Goals in Champions League History', 'UEFA', '19M views', '4 years ago', '14:22', 'The best goals ever scored in the UEFA Champions League.', 'Sports', '14M'),

  // ==================== ENTERTAINMENT ====================
  createVideo('jNQXAC9IVRw', 'Me at the zoo', 'jawed', '310M views', '19 years ago', '0:19', 'The first video on YouTube. Posted on April 23, 2005.', 'Entertainment', '2.1M'),
  createVideo('QH2-TGUlwu4', 'Nyan Cat [original]', 'Nyan Cat', '205M views', '13 years ago', '3:37', 'Nyan Cat original video.', 'Entertainment', '1.5M'),
  createVideo('byTxJFmFe7Q', 'Attack on Titan Final Season - Official Trailer 4', 'Crunchyroll', '6.2M views', '3 years ago', '1:33', 'Attack on Titan Final Season Part 2 - Official Trailer', 'Entertainment', '6M'),
  createVideo('3jS_yEK8qVI', 'MrBeast - I Spent 50 Hours Buried Alive', 'MrBeast', '180M views', '1 year ago', '16:42', 'I spent 50 hours buried alive. This was the hardest challenge ever.', 'Entertainment', '230M'),
  createVideo('fMfipiV_17o', 'MrBeast - Would You Sit In Snakes For $10,000?', 'MrBeast', '220M views', '2 years ago', '18:33', 'Would you sit in a bathtub full of snakes for $10,000?', 'Entertainment', '230M'),
  createVideo('iogcY_4xGjo', 'MrBeast - $1 vs $1,000,000,000 Yacht!', 'MrBeast', '250M views', '1 year ago', '21:15', 'I compared a $1 yacht to a $1,000,000,000 yacht!', 'Entertainment', '230M'),
  createVideo('WcwGleUe8mY', 'Dude Perfect - Ping Pong Trick Shots 4', 'Dude Perfect', '45M views', '5 years ago', '8:22', 'Dude Perfect returns with Ping Pong Trick Shots 4!', 'Entertainment', '62M'),
  createVideo('nvEFbflW7YM', 'Dude Perfect - World Record Edition', 'Dude Perfect', '38M views', '4 years ago', '12:15', 'Dude Perfect attempts to break world records!', 'Entertainment', '62M'),
  createVideo('L_jWHffIx5E', 'SmarterEveryDay - Laminar Flow Is Not What I Expected', 'SmarterEveryDay', '10M views', '3 years ago', '11:42', 'Laminar flow is not what I expected - it\'s fascinating.', 'Entertainment', '12M'),
  createVideo('5t5MEqET3lI', 'PewDiePie - Congratulations (100M Subscribers)', 'PewDiePie', '28M views', '5 years ago', '14:33', 'PewDiePie celebrates 100 million subscribers.', 'Entertainment', '111M'),
  createVideo('GrEBkoKZMEo', 'How It\'s Made - Hot Dogs', 'Science Channel', '22M views', '8 years ago', '5:03', 'How it\'s made - hot dogs from the Science Channel.', 'Entertainment', '5.5M'),
  createVideo('F-xwmJ_cYCg', 'MrBeast - I Built 100 Wells In Africa', 'MrBeast', '120M views', '1 year ago', '14:22', 'I built 100 wells in Africa to provide clean drinking water.', 'Entertainment', '230M'),
  createVideo('erLbbextvlY', 'MrBeast - I Survived 7 Days In An Abandoned City', 'MrBeast', '95M views', '2 years ago', '18:45', 'I survived 7 days in an abandoned city.', 'Entertainment', '230M'),
  createVideo('4dS0fMq1p3o', 'Dude Perfect - Giant Basketball Trick Shots', 'Dude Perfect', '32M views', '3 years ago', '9:44', 'Dude Perfect does giant basketball trick shots!', 'Entertainment', '62M'),
  createVideo('u6D4RCkH3gA', 'Marques Brownlee - iPhone 15 Pro Review', 'MKBHD', '12M views', '1 year ago', '15:33', 'MKBHD reviews the iPhone 15 Pro.', 'Entertainment', '19M'),
  createVideo('IXbqmaXws1k', 'Dhar Mann - Teen SURVIVES 24 Hours In HAUNTED HOUSE', 'Dhar Mann', '25M views', '2 years ago', '18:22', 'A teen survives 24 hours in a haunted house.', 'Entertainment', '23M'),
  // More Entertainment - Additional MrBeast & popular videos
  createVideo('7YfJmJ6hR5k', 'MrBeast - Would You Rather Have $100,000 OR This Mystery Key?', 'MrBeast', '180M views', '1 year ago', '16:22', 'Would you rather have $100,000 or this mystery key?', 'Entertainment', '230M'),
  createVideo('9Kp8Zf2Wl3M', 'MrBeast - I Survived 50 Hours Buried Alive', 'MrBeast', '210M views', '1 year ago', '18:45', 'I survived 50 hours buried alive - my hardest challenge yet.', 'Entertainment', '230M'),
  createVideo('3Lr7Q2vN5mK', 'MrBeast - I Spent 24 Hours In A Haunted House', 'MrBeast', '95M views', '2 years ago', '15:33', 'I spent 24 hours in a haunted house. This was terrifying.', 'Entertainment', '230M'),
  createVideo('5Hv8ZjL2wQ4', 'MrBeast - I Built 100 Houses And Gave Them Away', 'MrBeast', '150M views', '6 months ago', '19:22', 'I built 100 houses and gave them away to people who needed them.', 'Entertainment', '230M'),
  createVideo('8Fj6vR4nL9p', 'MrBeast - $1 vs $500,000 Hotel Room!', 'MrBeast', '200M views', '1 year ago', '20:15', 'I compared a $1 hotel room to a $500,000 hotel room!', 'Entertainment', '230M'),
  createVideo('2Z9WfTmK3x7', 'Dude Perfect - Ping Pong Trick Shots 5', 'Dude Perfect', '42M views', '2 years ago', '10:33', 'Dude Perfect returns with Ping Pong Trick Shots 5!', 'Entertainment', '62M'),
  createVideo('4R7gWvNp6jH', 'Dude Perfect - Giant Soccer Trick Shots', 'Dude Perfect', '35M views', '1 year ago', '9:15', 'Dude Perfect does giant soccer trick shots!', 'Entertainment', '62M'),
  createVideo('6TqYhF8m2kR', 'How It\'s Made - Ice Cream', 'Science Channel', '15M views', '5 years ago', '5:15', 'How it\'s made - ice cream from the Science Channel.', 'Entertainment', '5.5M'),
  createVideo('1XmZ3Lp7vK9', 'MKBHD - iPhone 16 Pro Review: Familiar Perfection!', 'MKBHD', '14M views', '5 months ago', '18:22', 'MKBHD reviews the iPhone 16 Pro - the most refined iPhone yet.', 'Entertainment', '19M'),
  createVideo('0Pn3R8fW5yQ', 'FAIL Compilation 2024 - Best Fails of the Year', 'FailArmy', '28M views', '3 months ago', '12:33', 'The best fails of 2024 compiled into one hilarious video.', 'Entertainment', '15M'),

  // ==================== COMEDY ====================
  createVideo('dDi6YOsGyXw', 'Charlie Bit My Finger - Original!', 'HDCYT', '902M views', '17 years ago', '0:56', 'Charlie bit my finger! The original viral video.', 'Comedy', '1.8M'),
  createVideo('3MqSlZCKMJO', 'Kevin Hart - Let Me Explain (Full Stand-Up Special)', 'Kevin Hart', '32M views', '9 years ago', '1:14:22', 'Kevin Hart: Let Me Explain - full stand-up comedy special.', 'Comedy', '28M'),
  createVideo('9n1nTZ4cP_Q', 'Dave Chappelle - Killin\' Them Softly (Stand-Up Special)', 'Dave Chappelle', '15M views', '7 years ago', '57:38', 'Dave Chappelle - Killin\' Them Softly stand-up special.', 'Comedy', '8.5M'),
  createVideo('vXQ0RBRM3JY', 'Saturday Night Live - Best of Stefon', 'Saturday Night Live', '18M views', '5 years ago', '12:33', 'The best of Stefon from Saturday Night Live.', 'Comedy', '14M'),
  createVideo('9NZBgOaIsC8', 'Trevor Noah - Son of Patricia (Full Special)', 'Netflix Is A Joke', '12M views', '4 years ago', '58:22', 'Trevor Noah: Son of Patricia full stand-up special.', 'Comedy', '16M'),
  createVideo('iEYFTHvG1WE', 'John Mulaney - Kid Gorgeous at Radio City (Full Special)', 'Netflix Is A Joke', '14M views', '5 years ago', '1:04:18', 'John Mulaney: Kid Gorgeous at Radio City full special.', 'Comedy', '16M'),
  createVideo('gOgpdp3lP8M', 'Ali G - Best Interviews Compilation', 'Comedy Central', '8.5M views', '6 years ago', '15:22', 'The best Ali G interviews compilation.', 'Comedy', '5.2M'),
  createVideo('FnLExWD1Kjw', 'Jim Gaffigan - Beyond the Pale (Full Special)', 'Jim Gaffigan', '7.2M views', '8 years ago', '1:12:45', 'Jim Gaffigan: Beyond the Pale full stand-up special.', 'Comedy', '3.5M'),
  createVideo('Bk_pHZ0qW1g', 'Saturday Night Live - Best of Weekend Update', 'Saturday Night Live', '22M views', '4 years ago', '18:44', 'The best Weekend Update moments from SNL.', 'Comedy', '14M'),
  createVideo('Kb24NrMlQaw', 'Gabriel Iglesias - I\'m Not Fat... I\'m Fluffy', 'Gabriel Iglesias', '18M views', '10 years ago', '1:02:33', 'Gabriel Iglesias: I\'m Not Fat... I\'m Fluffy full special.', 'Comedy', '15M'),
  createVideo('kpvP-iB0Pqk', 'Ricky Gervais - Out of England (Full Special)', 'Ricky Gervais', '5.8M views', '7 years ago', '54:22', 'Ricky Gervais: Out of England stand-up special.', 'Comedy', '5.2M'),

  // ==================== NEWS ====================
  createVideo('9Auq9mYxFEE', 'Hiroshima: Dropping the Bomb', 'BBC', '18M views', '9 years ago', '5:49', 'Hear first-hand accounts from the air and ground, re-telling every memory from the day the world first witnessed the atomic bomb.', 'News', '15M'),
  createVideo('F1B9D6QdOGo', 'CNN - Breaking News: Historic Climate Agreement Reached', 'CNN', '8.5M views', '1 year ago', '6:22', 'A historic climate agreement has been reached at the global summit.', 'News', '16M'),
  createVideo('Z3j23Q5NaG0', 'BBC News - The Fall of the Berlin Wall (1989)', 'BBC', '12M views', '10 years ago', '8:15', 'BBC News coverage of the fall of the Berlin Wall in 1989.', 'News', '15M'),
  createVideo('4V38mMUxJmA', 'Reuters - Global Markets React to Economic Shifts', 'Reuters', '3.2M views', '6 months ago', '4:33', 'Global markets react to major economic policy shifts.', 'News', '4.5M'),
  createVideo('sv3TXMSv6L8', 'Al Jazeera - The Struggle for Water in Africa', 'Al Jazeera', '5.8M views', '2 years ago', '25:17', 'The struggle for clean water access across Africa.', 'News', '9.2M'),
  createVideo('GhHOzCzA5TM', 'BBC - The Truth About Climate Change (David Attenborough)', 'BBC', '18M views', '5 years ago', '58:22', 'David Attenborough explores the truth about climate change.', 'News', '15M'),
  createVideo('F-vIW1FRpRA', 'CNN - Inside the World\'s Largest Refugee Camp', 'CNN', '4.5M views', '3 years ago', '15:33', 'Inside the world\'s largest refugee camp - a CNN exclusive report.', 'News', '16M'),
  createVideo('Q1dKSAH5gW0', 'BBC News - Queen Elizabeth II: A Life in Service', 'BBC', '22M views', '2 years ago', '32:18', 'BBC News special - Queen Elizabeth II: A Life in Service.', 'News', '15M'),
  createVideo('zwh6E4VTSRo', 'Reuters - Tech Giants Face Congressional Hearing', 'Reuters', '2.8M views', '1 year ago', '8:45', 'Tech giants face a congressional hearing on data privacy.', 'News', '4.5M'),
  createVideo('Td4vPjVwpIY', 'DW News - The Rise of Electric Vehicles', 'DW News', '3.5M views', '2 years ago', '12:22', 'The rise of electric vehicles and what it means for the future.', 'News', '8.2M'),
  createVideo('bzG4hL9M3Nk', 'BBC - Planet Earth III: Official Trailer', 'BBC', '15M views', '1 year ago', '2:33', 'Planet Earth III official trailer narrated by Sir David Attenborough.', 'News', '15M'),

  // ==================== PODCASTS ====================
  createVideo('o76OFmGmelo', 'Joe Rogan Experience #1368 - Edward Norton', 'PowerfulJRE', '14M views', '5 years ago', '2:12:34', 'Edward Norton is an actor, filmmaker, and activist.', 'Podcasts', '17M'),
  createVideo('RE6gNkFJXEs', 'Lex Fridman #367 - Elon Musk', 'Lex Fridman', '18M views', '2 years ago', '2:16:22', 'Lex Fridman podcast with Elon Musk. Wide-ranging conversation about AI, Mars, and the future.', 'Podcasts', '4.5M'),
  createVideo('Dx5qFachd3A', 'Joe Rogan Experience #2001 - The Rock', 'PowerfulJRE', '12M views', '1 year ago', '3:02:15', 'Joe Rogan Experience with Dwayne "The Rock" Johnson.', 'Podcasts', '17M'),
  createVideo('HbSFn_NJuFo', 'Lex Fridman #402 - Sam Altman', 'Lex Fridman', '8.5M views', '1 year ago', '2:45:33', 'Lex Fridman podcast with Sam Altman about OpenAI and the future of AI.', 'Podcasts', '4.5M'),
  createVideo('G1tJ2Q5QBSk', 'Joe Rogan Experience #1800 - Quentin Tarantino', 'PowerfulJRE', '9.2M views', '3 years ago', '2:34:18', 'Joe Rogan Experience with Quentin Tarantino.', 'Podcasts', '17M'),
  createVideo('cVdfnF3mJNk', 'Lex Fridman #410 - Mark Zuckerberg', 'Lex Fridman', '7.2M views', '1 year ago', '2:12:45', 'Lex Fridman podcast with Mark Zuckerberg about the metaverse and AI.', 'Podcasts', '4.5M'),
  createVideo('pTCdT5sFbOY', 'Theo Von - This Past Weekend #200', 'Theo Von', '4.8M views', '1 year ago', '1:45:22', 'Theo Von - This Past Weekend podcast episode 200.', 'Podcasts', '6.2M'),
  createVideo('v8zw1UHZ0iY', 'Andrew Huberman - How to Improve Your Sleep', 'Andrew Huberman', '12M views', '2 years ago', '2:15:33', 'Andrew Huberman explains the science of sleep and how to improve it.', 'Podcasts', '6.5M'),
  createVideo('zLiTE6sPbKs', 'Joe Rogan Experience #1550 - Bob Lazar & Jeremy Corbell', 'PowerfulJRE', '22M views', '5 years ago', '2:48:12', 'Joe Rogan Experience with Bob Lazar and Jeremy Corbell about Area 51.', 'Podcasts', '17M'),
  createVideo('bN1f0YHjMdc', 'Andrew Huberman - The Science of Focus', 'Andrew Huberman', '8.5M views', '2 years ago', '1:55:44', 'Andrew Huberman explains the science of focus and concentration.', 'Podcasts', '6.5M'),
  createVideo('4MEtuKre4bw', 'Lex Fridman #420 - Ye (Kanye West)', 'Lex Fridman', '15M views', '2 years ago', '3:22:18', 'Lex Fridman podcast with Ye (Kanye West).', 'Podcasts', '4.5M'),
  createVideo('Bp0MG5JqJKs', 'Diary of a CEO - How to Build a Billion Dollar Brand', 'Steven Bartlett', '6.5M views', '1 year ago', '1:32:22', 'Steven Bartlett interviews founders on how to build billion dollar brands.', 'Podcasts', '5.8M'),

  // ==================== LIVE ====================
  createVideo('5qap5aO4i9A', 'lofi hip hop radio - beats to relax/study to', 'Lofi Girl', '1.2B views', 'Streamed 3 years ago', 'LIVE', 'lofi hip hop radio - beats to relax/study to', 'Live', '14M'),
  createVideo('jfKfPfyJRdk', 'lofi hip hop radio - beats to sleep/chill to', 'Lofi Girl', '850M views', 'Streamed 4 years ago', 'LIVE', 'lofi hip hop radio - beats to sleep/chill to', 'Live', '14M'),
  createVideo('4xDzrJKXOOY', 'Relaxing Jazz Piano Music ☕ Coffee Shop Ambience', 'Cafe Music BGM', '120M views', 'Streamed 2 years ago', 'LIVE', 'Relaxing jazz piano music with coffee shop ambience.', 'Live', '5.2M'),
  createVideo('5yx6BWlEVcY', '24/7 K-Pop Radio Live Stream', 'KBS Kpop', '45M views', 'Streamed 1 year ago', 'LIVE', '24/7 K-Pop radio live stream featuring the best K-Pop hits.', 'Live', '8.5M'),
  createVideo('G1b0rQ5LM_k', '24/7 Minecraft Live Stream - Survival Multiplayer', 'Minecraft', '18M views', 'Streamed 6 months ago', 'LIVE', '24/7 Minecraft survival multiplayer live stream.', 'Live', '12M'),
  createVideo('lE6RY1MqZVQ', 'NASA TV - International Space Station Live Feed', 'NASA', '35M views', 'Streamed 2 years ago', 'LIVE', 'International Space Station live feed from NASA TV.', 'Live', '12M'),
  createVideo('P3bLj_fqLzk', 'Ambient Space Music - 24/7 Live Stream', 'SpaceAmbient', '8.5M views', 'Streamed 1 year ago', 'LIVE', 'Ambient space music 24/7 live stream for relaxation and study.', 'Live', '2.1M'),

  // ==================== MOVIES ====================
  createVideo('d9MyW72ELq0', 'The Batman - Official Main Trailer', 'Warner Bros. Pictures', '50M views', '3 years ago', '2:36', 'The Batman - Only in Theaters March 4.', 'Movies', '8.5M'),
  createVideo('JfVOs4VSpmA', 'Dune: Part Two - Official Trailer', 'Warner Bros. Pictures', '45M views', '1 year ago', '3:12', 'Dune: Part Two - Official Trailer.', 'Movies', '8.5M'),
  createVideo('Way9Dexny3w', 'Oppenheimer - Official Trailer', 'Universal Pictures', '38M views', '2 years ago', '3:22', 'Oppenheimer - Official Trailer. The world forever changes.', 'Movies', '5.2M'),
  createVideo('dKrVfgVI0Ps', 'Barbie - Official Main Trailer', 'Warner Bros. Pictures', '42M views', '2 years ago', '2:33', 'Barbie - Official Main Trailer.', 'Movies', '8.5M'),
  createVideo('u34gHaRiBIU', 'Avengers: Endgame - Official Trailer', 'Marvel Entertainment', '195M views', '6 years ago', '3:14', 'Avengers: Endgame - Official Trailer.', 'Movies', '22M'),
  createVideo('TcMBFSGVi1c', 'Spider-Man: No Way Home - Official Trailer', 'Sony Pictures', '78M views', '4 years ago', '3:01', 'Spider-Man: No Way Home - Official Trailer.', 'Movies', '8.5M'),
  createVideo('giXco2jaZ_4', 'Avatar: The Way of Water - Official Trailer', '20th Century Studios', '52M views', '3 years ago', '3:22', 'Avatar: The Way of Water - Official Trailer.', 'Movies', '5.8M'),
  createVideo('JdR3unWJ5yE', 'John Wick: Chapter 4 - Official Trailer', 'Lionsgate', '35M views', '2 years ago', '2:48', 'John Wick: Chapter 4 - Official Trailer.', 'Movies', '4.8M'),
  // More Movies
  createVideo('5L4vN8mK2xQp', 'Deadpool & Wolverine - Official Trailer', 'Marvel Entertainment', '65M views', '1 year ago', '2:45', 'Deadpool & Wolverine - Official Trailer. The MCU will never be the same.', 'Movies', '22M'),
  createVideo('8Hm3K9pN4xRf', 'Inside Out 2 - Official Trailer', 'Disney•Pixar', '45M views', '1 year ago', '2:33', 'Inside Out 2 - Official Trailer. The emotions are back!', 'Movies', '6.2M'),
  createVideo('2Lk7N3mP5xWt', 'Dune: Part Two - Official Main Trailer', 'Warner Bros. Pictures', '52M views', '1 year ago', '3:22', 'Dune: Part Two - Official Main Trailer. Paul Atreides unites with Chani.', 'Movies', '8.5M'),
  createVideo('6Np4K8mL2xQg', 'Gladiator II - Official Trailer', 'Paramount Pictures', '32M views', '8 months ago', '2:48', 'Gladiator II - Official Trailer. The epic sequel arrives.', 'Movies', '4.5M'),

  // ==================== FITNESS ====================
  createVideo('UBMk30rjy0o', 'The 5-Minute Full-Body Workout', 'POPSUGAR Fitness', '12M views', '6 years ago', '5:01', 'No excuses! This 5-minute full-body workout hits every major muscle group.', 'Fitness', '4.5M'),
  createVideo('v7AYKMP6rOE', 'Yoga With Adriene - 20 Min Yoga for Beginners', 'Yoga With Adriene', '28M views', '6 years ago', '20:45', 'Yoga for beginners - a 20 minute yoga workout with Adriene.', 'Fitness', '12M'),
  createVideo('ml6cT4AZdqI', 'Chloe Ting - 2 Weeks Shred Challenge', 'Chloe Ting', '45M views', '4 years ago', '24:33', 'Chloe Ting 2 weeks shred challenge workout.', 'Fitness', '25M'),
  createVideo('5v8d3IBFaO4', 'Blogilates - 100 Ab Workout', 'Blogilates', '18M views', '7 years ago', '10:22', '100 ab workout with Blogilates - no equipment needed.', 'Fitness', '10M'),
  createVideo('gsNoPYwWXeM', 'Yoga With Adriene - Yoga for Weight Loss', 'Yoga With Adriene', '15M views', '5 years ago', '22:18', 'Yoga for weight loss with Adriene - a full body flow.', 'Fitness', '12M'),
  createVideo('HSLx4bdvLzM', 'Chloe Ting - Get Abs in 2 Weeks', 'Chloe Ting', '32M views', '3 years ago', '15:22', 'Chloe Ting abs workout - get abs in 2 weeks.', 'Fitness', '25M'),
  createVideo('mog5P6F6Qno', 'The Fitness Marshall - Dance Workout to Popular Songs', 'The Fitness Marshall', '8.5M views', '2 years ago', '18:45', 'Dance workout to popular songs with The Fitness Marshall.', 'Fitness', '6.5M'),

  // ==================== FASHION ====================
  createVideo('M5sPJU3zJ7Q', '10 Fashion Trends That Will Dominate 2024', 'Vogue', '2.8M views', '1 year ago', '12:15', 'From the runways to the streets, these are the fashion trends that will dominate 2024.', 'Fashion', '14M'),
  createVideo('0LHxJP6EbTw', 'Vogue - Inside the Closet of Zendaya', 'Vogue', '8.5M views', '2 years ago', '10:22', 'Vogue goes inside the closet of Zendaya to see her most iconic looks.', 'Fashion', '14M'),
  createVideo('5K8-GCP1Qz8', 'Vogue - 73 Questions With Taylor Swift', 'Vogue', '18M views', '7 years ago', '8:33', 'Vogue 73 Questions with Taylor Swift.', 'Fashion', '14M'),
  createVideo('krKx0U-3Y6w', 'Vogue - Getting Ready With Hailey Bieber', 'Vogue', '5.2M views', '2 years ago', '12:45', 'Getting ready with Hailey Bieber - her full beauty routine.', 'Fashion', '14M'),
  createVideo('kDMq1r9y2OE', 'Best Sustainable Fashion Brands 2024', 'The Sustainable Fashion', '3.5M views', '1 year ago', '14:22', 'The best sustainable fashion brands for 2024.', 'Fashion', '2.5M'),
  createVideo('qPNi4f8Cxq4', 'Vogue - Kendall Jenner\'s Guide to LA', 'Vogue', '6.8M views', '3 years ago', '9:15', 'Kendall Jenner takes Vogue on a tour of her Los Angeles.', 'Fashion', '14M'),
  // More Fashion
  createVideo('7L4rK8wN2xQm', 'Vogue - 73 Questions With Lady Gaga', 'Vogue', '12M views', '5 years ago', '9:22', 'Vogue 73 Questions with Lady Gaga - an intimate look.', 'Fashion', '14M'),
  createVideo('3Np6K8mL5xRf', 'Emma Chamberlain - Getting Ready With Me 2024', 'Emma Chamberlain', '8.5M views', '1 year ago', '14:33', 'Emma Chamberlain getting ready with me - GRWM routine.', 'Fashion', '12M'),
  createVideo('9Wq4L8mN3xPt', 'Vogue - Best Dressed at the Met Gala 2024', 'Vogue', '18M views', '9 months ago', '15:22', 'The best dressed celebrities at the Met Gala 2024.', 'Fashion', '14M'),
  createVideo('2Rk7N5pL4xWb', 'MrBeast - I Gave Away $1,000,000 in Clothing', 'MrBeast', '45M views', '6 months ago', '12:15', 'I gave away one million dollars worth of designer clothing.', 'Fashion', '230M'),

  // ==================== TRAVEL ====================
  createVideo('CHuCh66N2C4', '10 Best Places to Visit in Japan', 'touropia', '8.5M views', '4 years ago', '9:04', 'Japan is one of the most popular travel destinations in the world.', 'Travel', '2.3M'),
  createVideo('WLIv7HnZ_fE', 'Mark Wiens - Bangkok Street Food Tour', 'Mark Wiens', '12M views', '3 years ago', '22:15', 'Mark Wiens goes on the ultimate Bangkok street food tour.', 'Travel', '10M'),
  createVideo('oEmObg0P3As', 'Kara and Nate - We Found the Best Hidden Beach', 'Kara and Nate', '5.5M views', '2 years ago', '16:33', 'We found the best hidden beach on our travels.', 'Travel', '4.2M'),
  createVideo('8d0GvEMq5Ho', 'Lost LeBlanc - Bali Travel Guide 2024', 'Lost LeBlanc', '4.2M views', '1 year ago', '18:45', 'The ultimate Bali travel guide for 2024.', 'Travel', '3.5M'),
  createVideo('aKU-6RqzQtI', 'Mark Wiens - The BEST Ramen in Tokyo', 'Mark Wiens', '8.5M views', '3 years ago', '15:22', 'Mark Wiens finds the best ramen in Tokyo, Japan.', 'Travel', '10M'),
  createVideo('Z1g8KN3OqT8', 'Abroad in Japan - 72 Hours in Tokyo', 'Abroad in Japan', '6.8M views', '2 years ago', '28:33', '72 hours in Tokyo - the ultimate guide.', 'Travel', '5.2M'),
  createVideo('gx1PtOoqyYM', 'Drew Binsky - World\'s Cheapest Countries to Visit', 'Drew Binsky', '7.2M views', '3 years ago', '14:22', 'The world\'s cheapest countries to visit on a budget.', 'Travel', '3.8M'),
  createVideo('Uuk6Fnq4jOQ', 'Kara and Nate - We Lived in a Floating House', 'Kara and Nate', '4.8M views', '1 year ago', '19:15', 'We lived in a floating house on the water for a week.', 'Travel', '4.2M'),
  createVideo('kRh60YsJWbg', 'Mark Wiens - Mexican Street Food MEGA Tour', 'Mark Wiens', '6.5M views', '2 years ago', '25:18', 'The ultimate Mexican street food mega tour.', 'Travel', '10M'),
  createVideo('vK5B8S8GWZk', 'Lost LeBlanc - 10 Travel Mistakes to Avoid', 'Lost LeBlanc', '5.8M views', '3 years ago', '12:44', '10 travel mistakes you should avoid on your next trip.', 'Travel', '3.5M'),
  createVideo('l3B4_Nlhvf0', 'Drew Binsky - I Visited the World\'s Most Isolated Country', 'Drew Binsky', '8.2M views', '2 years ago', '16:33', 'I visited the world\'s most isolated country.', 'Travel', '3.8M'),

  // ==================== LEARNING ====================
  createVideo('8mAITcNt710', 'How to Study Effectively', 'Ali Abdaal', '8.5M views', '3 years ago', '10:22', 'How to study effectively using evidence-based techniques.', 'Learning', '5M'),
  createVideo('arj7oStGLkU', 'Crash Course - History of the Entire World', 'CrashCourse', '18M views', '7 years ago', '19:23', 'The history of the entire world, I guess. CrashCourse.', 'Learning', '15M'),
  createVideo('8nt3edWLgIg', 'TED - The Power of Vulnerability (Brené Brown)', 'TED', '45M views', '12 years ago', '20:13', 'Brené Brown: The power of vulnerability - TED talk.', 'Learning', '25M'),
  createVideo('H14bBuluwB8', 'Khan Academy - Introduction to Calculus', 'Khan Academy', '5.5M views', '5 years ago', '15:22', 'Introduction to calculus from Khan Academy.', 'Learning', '8.5M'),
  createVideo('SQJrYm5BHsc', 'Crash Course - Biology: The Cell', 'CrashCourse', '8.2M views', '9 years ago', '11:33', 'CrashCourse Biology: The Cell - an introduction to cell biology.', 'Learning', '15M'),
  createVideo('5MgBikgcWnY', 'TED - Inside the Mind of a Master Procrastinator (Tim Urban)', 'TED', '52M views', '8 years ago', '14:04', 'Tim Urban: Inside the mind of a master procrastinator - TED talk.', 'Learning', '25M'),
  createVideo('8jPQjjsBbIc', 'Khan Academy - Introduction to Statistics', 'Khan Academy', '4.8M views', '4 years ago', '12:45', 'Introduction to statistics from Khan Academy.', 'Learning', '8.5M'),
  createVideo('yz83j3IqU8E', 'TED - Your Body Language May Shape Who You Are (Amy Cuddy)', 'TED', '28M views', '11 years ago', '21:02', 'Amy Cuddy: Your body language may shape who you are - TED talk.', 'Learning', '25M'),
  createVideo('PHe0bXAIuk0', 'Crash Course - Psychology: The Brain', 'CrashCourse', '7.5M views', '10 years ago', '10:22', 'CrashCourse Psychology: The Brain - an introduction.', 'Learning', '15M'),
  createVideo('rgNbQq0wWN4', 'Ali Abdaal - How to Read More Books', 'Ali Abdaal', '4.2M views', '2 years ago', '12:33', 'How to read more books - tips and strategies from Ali Abdaal.', 'Learning', '5M'),
  createVideo('m6UHgPq1cNY', 'Khan Academy - Introduction to Organic Chemistry', 'Khan Academy', '3.8M views', '5 years ago', '14:18', 'Introduction to organic chemistry from Khan Academy.', 'Learning', '8.5M'),

  // ==================== RECENTLY UPLOADED ====================
  createVideo('z0FFe21d5Qk', 'Apple Intelligence - Official Introduction | Apple', 'Apple', '22M views', '2 months ago', '2:15', 'Apple Intelligence is the personal intelligence system that puts your needs at the center.', 'Recently uploaded', '16M'),
  createVideo('oFfVt3S51T4', 'OpenAI launches GPT-4o - Full Presentation', 'OpenAI', '8.5M views', '8 months ago', '15:33', 'OpenAI launches GPT-4o, our newest flagship model that can reason across audio, vision, and text.', 'Recently uploaded', '3.5M'),
  createVideo('r6UxSAh8N2c', 'NVIDIA CES 2025 Keynote - Jensen Huang', 'NVIDIA', '5.2M views', '1 month ago', '1:45:22', 'NVIDIA CEO Jensen Huang delivers the CES 2025 keynote with groundbreaking AI announcements.', 'Recently uploaded', '2.8M'),
  createVideo('LHwd0i6oqPU', 'SpaceX Starship Flight 7 - Full Launch and Landing', 'SpaceX', '15M views', '3 weeks ago', '22:45', 'SpaceX Starship Flight 7 - full launch and landing attempt coverage.', 'Recently uploaded', '18M'),
  createVideo('XsSjlK5c0Vk', 'Sabrina Carpenter - Espresso (Official Video)', 'Sabrina Carpenter', '450M views', '9 months ago', '3:12', 'Sabrina Carpenter - Espresso (Official Video). That\'s that me espresso.', 'Recently uploaded', '35M'),
  createVideo('s3lbqfH4q9E', 'Kendrick Lamar - Not Like Us (Official Music Video)', 'Kendrick Lamar', '180M views', '7 months ago', '5:33', 'Kendrick Lamar - Not Like Us (Official Music Video).', 'Recently uploaded', '8.2M'),
  createVideo('9BwF5iM7Qy8', 'Tesla Robotaxi Unveil - We, Robot Event October 2024', 'Tesla', '12M views', '4 months ago', '35:22', 'Tesla unveils the Robotaxi at the We, Robot event in October 2024.', 'Recently uploaded', '22M'),
  createVideo('V0hnMo0m5zg', 'Taylor Swift - The Tortured Poets Department (Official Lyric Video)', 'Taylor Swift', '85M views', '9 months ago', '3:45', 'Taylor Swift - The Tortured Poets Department official lyric video.', 'Recently uploaded', '56M'),
  createVideo('rQqwG_rQx7M', 'Wicked - Official Trailer (HD)', 'Universal Pictures', '28M views', '5 months ago', '2:45', 'Wicked - Official Trailer. After two decades as one of the most beloved musicals, Wicked arrives in theaters.', 'Recently uploaded', '5.2M'),
  createVideo('D1F6TOInbEI', 'Meta Quest 3S - Official Reveal Trailer', 'Meta Quest', '6.2M views', '5 months ago', '1:45', 'Meta Quest 3S - the most accessible mixed reality headset.', 'Recently uploaded', '2.5M'),
  createVideo('H3v5nnEMqXY', 'Beyonce - TEXAS HOLD \'EM (Official Lyric Video)', 'Beyoncé', '120M views', '10 months ago', '3:22', 'Beyoncé - TEXAS HOLD \'EM official lyric video from her new album Cowboy Carter.', 'Recently uploaded', '32M'),
  createVideo('8Z1eSm2mE4g', 'PlayStation 5 Pro - Official Reveal Trailer', 'PlayStation', '15M views', '6 months ago', '2:33', 'PlayStation 5 Pro - the most powerful PlayStation ever. Official reveal.', 'Recently uploaded', '15M'),
];

export const shortsVideos: Video[] = [
  createVideo('50G0kIty7Cg', 'Answer The Call, Win $10,000 📱', 'MrBeast', '450M views', '1 year ago', '0:15', 'MrBeast shorts', 'Entertainment', '230M'),
  createVideo('Nd2-WaMleEc', '3 simple life hacks you need to try 🤯', '5-Minute Crafts', '89M views', '2 years ago', '0:30', '5-Minute Crafts shorts', 'Entertainment', '80M'),
  createVideo('jdQFaC4id-8', 'No WAY he actually did that! ✈️', 'Dude Perfect', '120M views', '1 year ago', '0:20', 'Dude Perfect shorts', 'Sports', '62M'),
  createVideo('VOcra-3eWVQ', 'Brother I am really worried about your hands 😂', 'Khaby Lame', '200M views', '1 year ago', '0:12', 'Khaby Lame shorts', 'Comedy', '82M'),
  createVideo('p8S5W-BBszc', 'Satisfying Art Process ✨', 'Art for Kids Hub', '55M views', '2 years ago', '0:25', 'Art for Kids Hub shorts', 'Art', '8M'),
  createVideo('0KH-a5E5zqA', 'This cat is too smart 🐱', 'The Dodo', '78M views', '1 year ago', '0:18', 'The Dodo shorts', 'Pets', '12M'),
  createVideo('cPdpCpxRoeA', 'World Record Domino Chain Reaction!', 'Dude Perfect', '95M views', '1 year ago', '0:22', 'Dude Perfect shorts', 'Sports', '62M'),
  createVideo('azVIkgMI1iE', 'I Surprised Random Shoppers 😮', 'MrBeast', '320M views', '8 months ago', '0:16', 'MrBeast shorts', 'Entertainment', '230M'),
  createVideo('y1UVAtHALaA', 'I gave away $1,000,000 in this short', 'MrBeast', '280M views', '6 months ago', '0:18', 'MrBeast gives away money in this short.', 'Entertainment', '230M'),
  createVideo('HDSha2ZGqNI', 'Genius life hack you need to know 🧄', '5-Minute Crafts', '45M views', '1 year ago', '0:22', '5-Minute Crafts life hack short.', 'Cooking', '80M'),
  createVideo('hgn_3Mmjwtw', 'Street food in Mexico City 🌮', 'Mark Wiens', '32M views', '8 months ago', '0:28', 'Mark Wiens street food short from Mexico City.', 'Travel', '10M'),
  createVideo('1oRN9yRRsV8', 'POV: You finally understand math 💡', 'Khan Academy', '18M views', '1 year ago', '0:15', 'Khan Academy shorts - when math finally clicks.', 'Learning', '8.5M'),
  createVideo('AfXuFEGkhlk', 'The most satisfying ASMR soap cutting 🧼', 'ASMR Zone', '65M views', '2 years ago', '0:25', 'Satisfying ASMR soap cutting short.', 'Entertainment', '5.5M'),
  createVideo('CGBHrqe30hk', 'My dog learned a new trick! 🐕', 'The Dodo', '42M views', '1 year ago', '0:16', 'The Dodo shorts - dog learns new trick.', 'Pets', '12M'),
  createVideo('cSG1CS6PKOQ', 'Gym fail that will make you laugh 😂', 'Gym Fails', '22M views', '6 months ago', '0:14', 'Funny gym fail short.', 'Comedy', '1.2M'),
  createVideo('itSkBESLZeY', 'Science experiment gone wrong 🔬', 'Veritasium', '15M views', '1 year ago', '0:20', 'Veritasium science experiment short.', 'Science', '16M'),
  createVideo('BMktzI0AmQU', 'How to make a viral dance move 💃', 'Charli D\'Amelio', '88M views', '2 years ago', '0:11', 'Charli D\'Amelio dance short.', 'Entertainment', '55M'),
  createVideo('zCn6HeDHOpg', 'Cooking steak in 30 seconds 🥩', 'Gordon Ramsay', '35M views', '1 year ago', '0:20', 'Gordon Ramsay quick steak short.', 'Cooking', '23M'),
  createVideo('xcqrpFVSZ6I', 'This basketball shot is impossible 🏀', 'Dude Perfect', '58M views', '8 months ago', '0:18', 'Dude Perfect impossible basketball shot.', 'Sports', '62M'),
  createVideo('bNhDSp-10P8', 'Satisfying calligraphy writing ✍️', 'Calligraphy Masters', '28M views', '1 year ago', '0:22', 'Satisfying calligraphy writing short.', 'Art', '3.5M'),
  createVideo('mFQ8zky_Vus', 'How I draw eyes step by step 👁️', 'DrawlikeaSir', '19M views', '2 years ago', '0:25', 'Step by step eye drawing tutorial short.', 'Art', '4.2M'),
  createVideo('cUB2vpDYnLo', 'Cat vs cucumber 🥒🐱', 'Funny Pets', '120M views', '3 years ago', '0:12', 'Cat scared by cucumber - classic viral short.', 'Comedy', '8.5M'),
  createVideo('JD0wIWV6ZB0', 'World\'s fastest Rubik\'s cube solve 🧊', 'Rubik\'s Cube', '42M views', '1 year ago', '0:15', 'World record Rubik\'s cube solve short.', 'Entertainment', '2.5M'),
  createVideo('3dMy0q39NOs', 'I found Nemo in real life 🐠', 'Scuba Jake', '15M views', '6 months ago', '0:20', 'Finding Nemo in real life scuba diving.', 'Travel', '3.2M'),
  createVideo('mDbH4Xpy804', 'How to do a handstand in 30 seconds 🤸', 'Fitness Blender', '12M views', '1 year ago', '0:22', 'Quick handstand tutorial short.', 'Fitness', '8.5M'),
  createVideo('_CoVTKIHsgA', 'Minecraft build in 20 seconds ⛏️', 'Minecraft', '38M views', '1 year ago', '0:18', 'Minecraft speed build short.', 'Gaming', '12M'),
  createVideo('ZtyMdRzvi0w', 'Python one-liner that will blow your mind 🐍', 'Fireship', '25M views', '1 year ago', '0:16', 'Fireship Python one-liner short.', 'Programming', '2.8M'),
  createVideo('gg0aRt37sEE', 'The best pancake flip ever 🥞', 'Gordon Ramsay', '22M views', '1 year ago', '0:10', 'Gordon Ramsay pancake flip short.', 'Cooking', '23M'),
  createVideo('hCuqh2NU2Yg', 'I survived 24 hours in a haunted house 👻', 'MrBeast', '180M views', '8 months ago', '0:20', 'MrBeast haunted house challenge short.', 'Entertainment', '230M'),
  // More Shorts - 30+ additional entries
  createVideo('BQBMbwfC6TY', 'POV: You finally understand coding 💻', 'Fireship', '18M views', '3 months ago', '0:16', 'When code finally compiles without errors.', 'Programming', '2.8M'),
  createVideo('GUAUio92uS4', 'This street food looks incredible 🍜', 'Mark Wiens', '25M views', '5 months ago', '0:30', 'Amazing street food from Bangkok night market.', 'Travel', '10M'),
  createVideo('hjkbqeWQAM8', 'I gave away $10,000 to strangers 💰', 'MrBeast', '350M views', '4 months ago', '0:22', 'MrBeast gives away money to random people.', 'Entertainment', '230M'),
  createVideo('oGfRo5kuXys', 'How to peel a potato in 5 seconds 🥔', '5-Minute Crafts', '32M views', '1 year ago', '0:18', 'Quick kitchen hack for peeling potatoes.', 'Cooking', '80M'),
  createVideo('0WF4xMc5-FA', 'The most insane basketball shot ever 🏀', 'Dude Perfect', '85M views', '6 months ago', '0:15', 'Dude Perfect makes the most impossible basketball shot.', 'Sports', '62M'),
  createVideo('I5xM6wxPtV4', 'My cat learned to high five 🐱', 'The Dodo', '28M views', '2 months ago', '0:20', 'Cat learns to give high fives on command.', 'Pets', '12M'),
  createVideo('fReuHJQSjvY', 'Wait for the drop... 🔥', 'Alan Walker', '45M views', '3 months ago', '0:30', 'Alan Walker shorts - epic music drop moment.', 'Music', '44M'),
  createVideo('xMpdznue87g', 'Making ramen from scratch in 60 seconds 🍜', 'Joshua Weissman', '15M views', '4 months ago', '0:45', 'Quick ramen from scratch - time-lapse cooking.', 'Cooking', '8.5M'),
  createVideo('JnFh2NoAM4s', 'POV: Your code works on the first try 😱', 'Web Dev Simplified', '12M views', '6 months ago', '0:14', 'When your code runs perfectly the first time.', 'Programming', '1.5M'),
  createVideo('yeN6AyYypKU', 'Satisfying kinetic sand cutting 🏖️', 'ASMR Zone', '55M views', '1 year ago', '0:22', 'Most satisfying kinetic sand cutting ASMR.', 'Entertainment', '5.5M'),
  createVideo('DHUS8ec56hY', 'Gordon Ramsay reacts to bad cooking 😡', 'Gordon Ramsay', '42M views', '3 months ago', '0:35', 'Gordon Ramsay loses it over terrible cooking.', 'Cooking', '23M'),
  createVideo('Oudg3Id_A4I', 'This dog is smarter than most humans 🐕', 'The Dodo', '38M views', '5 months ago', '0:18', 'Incredibly smart dog solves complex puzzles.', 'Pets', '12M'),
  createVideo('GWPJugFYp6E', 'How to tie a tie in 10 seconds 👔', '5-Minute Crafts', '22M views', '1 year ago', '0:15', 'Quick and easy tie-tying tutorial.', 'Learning', '80M'),
  createVideo('D4uAyyse20Y', 'Elden Ring boss fight in 30 seconds ⚔️', 'IGN', '15M views', '8 months ago', '0:30', 'Elden Ring epic boss fight highlights.', 'Gaming', '18M'),
  createVideo('TbTSb455pCw', 'The most beautiful place on Earth 🌍', 'Drew Binsky', '12M views', '3 months ago', '0:25', 'Stunning drone footage of the most beautiful place on Earth.', 'Travel', '3.8M'),
  createVideo('8Uhj6Buaq0A', 'POV: Monday morning meeting 😴', 'Corporate Bro', '22M views', '2 months ago', '0:12', 'Relatable Monday morning meeting POV.', 'Comedy', '2.5M'),
  createVideo('DCpar5QDo6E', 'How to do a backflip tutorial 🤸', 'Fitness Blender', '8.5M views', '6 months ago', '0:30', 'Step by step backflip tutorial for beginners.', 'Fitness', '8.5M'),
  createVideo('NUNKMZFUUBY', 'This painting came to life 🎨', 'Art for Kids Hub', '15M views', '4 months ago', '0:22', 'Amazing painting that looks incredibly realistic.', 'Art', '8M'),
  createVideo('JTB60TFAnJU', 'Minecraft speed build in 45 seconds ⛏️', 'Minecraft', '28M views', '3 months ago', '0:45', 'Incredible Minecraft speed build - medieval castle.', 'Gaming', '12M'),
  createVideo('linWzEkYHAg', 'Fastest pizza maker in the world 🍕', 'Gordon Ramsay', '18M views', '5 months ago', '0:20', 'Incredible speed pizza making - world record attempt.', 'Cooking', '23M'),
  createVideo('hDU9WcmQA2E', 'The science of black holes in 60 seconds 🌌', 'Kurzgesagt – In a Nutshell', '22M views', '2 months ago', '0:55', 'Black holes explained in under 60 seconds by Kurzgesagt.', 'Science', '22M'),
  createVideo('ueK0m5i8SEI', 'This football trick shot is impossible 🏈', 'Dude Perfect', '45M views', '4 months ago', '0:18', 'Dude Perfect attempts impossible football trick shot.', 'Sports', '62M'),
  createVideo('JcgYaMi38dI', 'POV: You find money in your old jacket 💰', 'Khaby Lame', '35M views', '3 months ago', '0:10', 'That feeling when you find forgotten money.', 'Comedy', '82M'),
  createVideo('Gy9oiG4Fn3g', 'Making the perfect omelette in 30 seconds 🥚', 'Gordon Ramsay', '32M views', '6 months ago', '0:28', 'Gordon Ramsay perfect omelette in record time.', 'Cooking', '23M'),
  createVideo('ZRjmGq1gAEQ', 'AI can now do YOUR job 🤖', 'Fireship', '20M views', '1 month ago', '0:35', 'Fireship explains how AI is replacing jobs in 2025.', 'Programming', '2.8M'),
  createVideo('isOSmwRQyIk', 'The cutest puppy ever born 🐶', 'The Dodo', '45M views', '2 months ago', '0:15', 'The most adorable newborn puppy you have ever seen.', 'Pets', '12M'),
  createVideo('qDWIV4W6Rks', 'Taylor Swift surprise song mashup 🎵', 'Taylor Swift', '25M views', '4 months ago', '0:45', 'Epic Taylor Swift surprise song mashup from Eras Tour.', 'Music', '56M'),
  createVideo('FCSjZJp7oQA', 'How to save $1000 in one month 💵', 'Graham Stephan', '15M views', '5 months ago', '0:40', 'Simple tips to save $1000 in just one month.', 'Learning', '5.5M'),
  createVideo('cnmS5H2Lwiw', 'This drone footage will blow your mind 🚁', 'Drew Binsky', '18M views', '3 months ago', '0:25', 'Incredible drone footage of Iceland from above.', 'Travel', '3.8M'),
  createVideo('XnKmjmiy2mw', 'Gym fail vs gym win 💪', 'Chris Heria', '12M views', '1 month ago', '0:18', 'Epic gym fails and wins compilation.', 'Fitness', '4.5M'),
  createVideo('Ti72oFygR7s', 'POV: Your first day as a software developer 💻', 'Theo - t3.gg', '14M views', '2 months ago', '0:20', 'First day as a software developer - the reality.', 'Programming', '850K'),
  createVideo('YugawDL8G4M', 'How to make sushi in 60 seconds 🍣', 'Joshua Weissman', '20M views', '3 months ago', '0:50', 'Making fresh sushi from scratch - speed cooking.', 'Cooking', '8.5M'),
  createVideo('tJNjuyeRPGg', 'The most satisfying domino fall ever 🁡', 'Dude Perfect', '55M views', '1 month ago', '0:22', 'Incredible domino chain reaction - most satisfying ever.', 'Entertainment', '62M'),
  createVideo('fO5FwBcCJBY', 'I Tried Every Fast Food Burger 🍔', 'MrBeast', '280M views', '2 months ago', '0:55', 'MrBeast tries every fast food burger and ranks them.', 'Entertainment', '230M'),
  createVideo('n8WxkqMRgS4', 'Science experiment with liquid nitrogen 🧪', 'Veritasium', '18M views', '4 months ago', '0:35', 'Amazing liquid nitrogen experiment - instant freezing.', 'Science', '16M'),
  createVideo('jcStDTXMHAU', 'How to juggle in 30 seconds 🤹', '5-Minute Crafts', '8M views', '6 months ago', '0:28', 'Quick juggling tutorial - learn to juggle fast.', 'Learning', '80M'),
];

// Fisher-Yates shuffle algorithm - returns a new shuffled array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getVideoById(id: string): Video | undefined {
  return [...homeVideos, ...shortsVideos].find(v => v.id === id);
}

export function getVideosByCategory(category: string): Video[] {
  if (category === 'All') return shuffleArray(homeVideos);
  return shuffleArray(homeVideos.filter(v => v.category === category));
}

export function getShuffledShorts(): Video[] {
  return shuffleArray(shortsVideos);
}

export function searchVideos(query: string): Video[] {
  const q = query.toLowerCase();
  const seen = new Set<string>();
  return [...homeVideos, ...shortsVideos].filter(
    v => {
      if (seen.has(v.id)) return false;
      seen.add(v.id);
      return v.title.toLowerCase().includes(q) ||
      v.channelTitle.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q);
    }
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
