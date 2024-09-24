import { writable } from "svelte/store";


export interface Meme {
  BondingCurve: string
  Post: Post
  Denomination: string
  AmountB: string
  AmountA: string
  Dumps: number
  createdAt: number
  Creator: string
  Module: string
  Supply: string
  Analytics: Analytics
  TokenB: string
  Pumps: number
  TokenA: string
  IsPump: boolean
  Pool: string
  IsActive: boolean
  Replies: number
  Profile: Profile
  Holders: Holders
}

export interface Post {
  Tags: any[]
  Content: string
  Kind: string
}

export interface Analytics {
  WeekVolume: WeekVolume
  Volume: string
  Buys: number
  HourVolume: HourVolume
  MarketCap: number
  Liquidty: string
  Price: string
  MontlyVolume: MontlyVolume
  DayVolume: DayVolume
}

export interface WeekVolume {
  Past: string
  Now: string
}

export interface HourVolume {
  Past: string
  Now: string
}

export interface MontlyVolume {
  Past: string
  Now: string
}

export interface DayVolume {
  Past: string
  Now: string
}

export interface Profile {
  Image: string
  CreatedAt: number
  Name: string
  Creator: string
}

export interface Holders {
  count: number
  top10: number
  dev: number
}

export const currentUser = writable<Profile | null>(null);
export const feedPosts = writable<Meme[]>([]);
export const replies = writable<Meme[]>([]);
