import type { Meme } from "$lib/models/Meme";
import type { Profile, UserInfo } from "$lib/models/Profile";
import type { Event } from "$lib/models/Event"
import { writable } from "svelte/store";


let event1: Event = {
  id: "8f4e867bcf2c4a63944c2c04bbd28be3",
  pubkey: "vd97vAnBhKD7zGNDTjTgl5N0WKLcl92MO8Ob3T0w6IM",
  created_at: 1684312352,
  kind: 1,
  content: "Check out this cool video about Svelte! https://arweave.net/Ov0Xea2kWa5GS1DCEmeF0aoct8rbJwDmizmTo9bQrtY",
  tags: [
    [
      "imeta",
      "thumb https://arweave.net/Ov0Xea2kWa5GS1DCEmeF0aoct8rbJwDmizmTo9bQrtY",
      "url https://arweave.net/Ov0Xea2kWa5GS1DCEmeF0aoct8rbJwDmizmTo9bQrtY",
      "m image/gif"
    ],
  ]
}

let event2: Event = {
  id: "9f8e762bc2d4b859443e1a05bbd29cf4",
  pubkey: "vd97vAnBhKD7zGNDTjTgl5N0WKLcl92MO8Ob3T0w6IM",
  created_at: 1685312452,
  kind: 1,
  content: "A deep dive into web development trends. https://arweave.net/Ive8YUyCU0FQEBSc8UjfTlQYFZY5s8t45gqsNf3uJMw",
  tags: [
    [
      "imeta",
      "thumb https://arweave.net/Ive8YUyCU0FQEBSc8UjfTlQYFZY5s8t45gqsNf3uJMw",
      "url https://arweave.net/Ive8YUyCU0FQEBSc8UjfTlQYFZY5s8t45gqsNf3uJMw",
      "m image/gif"
    ],
  ]
}

let event3: Event = {
  id: "9f8e762bc2d4b859443e1a05bbd29cf4",
  pubkey: "vd97vAnBhKD7zGNDTjTgl5N0WKLcl92MO8Ob3T0w6IM",
  created_at: 1685312452,
  kind: 1,
  content: "A deep dive into web development trends. https://arweave.net/Ive8YUyCU0FQEBSc8UjfTlQYFZY5s8t45gqsNf3uJMw",
  tags: []
}

let _profileJson: Profile = {
  name: "Charazard",
  about: "A fire pokemon",
  picture: "-RmetHQufxWySiJact95a9ON6pb-0s56dElmyJusGwQ",
  display_name: "Char",
  website: "https://www.ao.link/",
  banner: "-RmetHQufxWySiJact95a9ON6pb-0s56dElmyJusGwQ",
  bot: false,
}

let _profile: Event = {
  id: '1',
  pubkey: 'vd97vAnBhKD7zGNDTjTgl5N0WKLcl92MO8Ob3T0w6IM',
  created_at: 1726767860000,
  kind: 0,
  tags: [[]],
  content: JSON.stringify(_profileJson)
}

let _userInfo: UserInfo = {
  Token: "WPyLgOqELOyN_BoTNdeEMZp5sz3RxDL19IGcs3A9IPc",
  Events: 1,
  Profile: _profile,
  SubscriptionCost: 1000000,
  FeedCost: 1000000,
  Subs: 0,
  Subscriptions: 0
}
export const userRelay = writable<string>();
export const isConnected = writable<boolean>(false);
export const currentUser = writable<UserInfo>();
export const user = writable<UserInfo>();
export const subscribers = writable<Array<UserInfo>>([_userInfo, _userInfo, _userInfo, _userInfo]);
export const subscriptions = writable<Array<UserInfo>>([_userInfo, _userInfo, _userInfo, _userInfo]);
export const userEvents = writable<Array<Event>>([]);


// User Data Store
/*export const userData = writable<UserData>({
  username: "Nickzz_AO",
  displayName: "Nickkzz",
  avatar: "/Users/nickk/Documents/Meme_Market_Frontend/src/assets/sunny.jpeg",
  bio: "Exploring the intersection of social media and crypto. Building the future of decentralized communication.",
  followers: 5280,
  following: 420,
  totalMarketCap: 156000
});

// Posts Store
export const posts = writable<Post[]>([
  {
    id: "1",
    author: {
      id: "user123",
      username: "Nickzz_AO",
      displayName: "Nickkzz",
      avatarUrl: "/Users/nickk/Documents/Meme_Market_Frontend/src/assets/sunny.jpeg"
    },
    content: "Just launched our new bonding curve algorithm! 🚀 The future of social media is here. #CryptoTwitter #Web3",
    createdAt: "2024-09-01T10:00:00Z",
    updatedAt: "2024-09-01T10:00:00Z",
    metrics: {
      marketCap: 2500,
      tokenPrice: 0.05,
      commentsCount: 42,
      sharesCount: 18,
      likesCount: 105
    },
    tags: ["CryptoTwitter", "Web3"],
    isEdited: false
  },
  {
    id: "2",
    author: {
      id: "user123",
      username: "Nickzz_AO",
      displayName: "Nickkzz",
      avatarUrl: "/Users/nickk/Documents/Meme_Market_Frontend/src/assets/sunny.jpeg"
    },
    content: "Thoughts on using market cap for content recommendation? Let's discuss the pros and cons. 🤔 #ContentDiscovery",
    createdAt: "2024-09-01T07:00:00Z",
    updatedAt: "2024-09-01T07:30:00Z",
    metrics: {
      marketCap: 1800,
      tokenPrice: 0.03,
      commentsCount: 37,
      sharesCount: 12,
      likesCount: 89
    },
    tags: ["ContentDiscovery"],
    isEdited: true
  },
]);

export const activeTab = writable<'posts' | 'marketCap'>('posts');

export const marketCapData = writable<MarketCapData>({
  labels: ['7d', '6d', '5d', '4d', '3d', '2d', '1d'],
  data: [120000, 125000, 140000, 135000, 150000, 145000, 156000]
});*/