import { send, read } from "$lib/ao/process.svelte";
import {
    Event,
    Subscribe,
    UnSubscribe,
    SetOwner,
    GetOwner,
    Info,
    Subs,
    Subscriptions,
    IsSubscribed,
    FetchFeed,
    FetchEvents,
    Request,
    Relay,
    Relays
} from "$lib/ao/messegeFactory.svelte";
import { INDEXER_ID, WAR_TOKEN } from "$lib/constants";
import { upload } from "$lib/ao/uploader";

import { currentUser, userEvents } from "../stores/profile.store";
import { feedPosts, replies } from "../stores/feedpage.store";
import type { Swap } from "$lib/models/Swap";
import { swapsStore } from "../stores/pool.store";
import { ta } from "date-fns/locale";


export const event = async (
    value: string,
    relay: string
) => {
    try {
        // @ts-ignore
        let message = Event();
        let result = await send(relay, message, value);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};

export const subscribe = async (
    token: string,
    quantity: string,
    subscribing_relay: string,
    relay: string,
) => {
    try {
        // @ts-ignore
        let message = Subscribe(token, quantity, relay);
        let result = await send(subscribing_relay, message, null);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};

export const unsubscribe = async (
    unsubscribing_relay: string,
    relay: string,
) => {
    try {
        // @ts-ignore
        let message = UnSubscribe(relay);
        let result = await send(unsubscribing_relay, message, null);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};

export const setOwner = async (
    owner: string,
    relay: string
) => {
    try {
        // @ts-ignore
        let message = SetOwner(owner);
        let result = await send(relay, message, null);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};

export const spawnRelay = async () => {
    try {
        // @ts-ignore
        let message = Request();
        let result = await send(INDEXER_ID(), message, null);
        //console.log(result);
    } catch (e) {
        console.log(e);
    }
};

export const fetchFeed = async (relay: string, filters: string) => {
    let _events: Array<any> = [];
    try {
        // @ts-ignore
        let message = FetchFeed(filters);
        let result = await read(relay, message);
        if (result == undefined) return _events;
        console.log(result);
        let json = JSON.parse(result.Data);
        console.log(json);
        for (const key in json) {
            _events.push(json[key]);
            console.log(json[key]);
        }
        feedPosts.set(_events)
    } catch (e) {
        console.log(e);
    }
    return _events;
};

export const fetchEvents = async (relay: string, filters: string) => {
    console.log("/////RELAY//////")
    console.log(relay)
    console.log("/////Filters//////")
    console.log(JSON.parse(filters))
    try {
        // @ts-ignore
        let message = FetchEvents(filters);
        let result = await read(relay, message);
        if (result) {
            console.log(result);
            let json = JSON.parse(result.Data);
            console.log(json);
            userEvents.set(json)
        };
    } catch (e) {
        console.log(e);
    }
};

export const subs = async (relay: string, page: string, size: string) => {
    let _subs: Array<any> = [];
    try {
        // @ts-ignore
        let message = Subs(page, size);
        let result = await read(relay, message);
        if (result == undefined) return _subs;
        console.log(result);
        let json = JSON.parse(result.Data);
        console.log(json);
        for (const key in json) {
            _subs.push(json[key]);
            console.log(json[key]);
        }
        feedPosts.set(_subs)
    } catch (e) {
        console.log(e);
    }
    return _subs;
};

export const subscriptions = async (relay: string, page: string, size: string) => {
    let _subs: Array<any> = [];
    try {
        // @ts-ignore
        let message = Subscriptions(page, size);
        let result = await read(relay, message);
        if (result == undefined) return _subs;
        console.log(result);
        let json = JSON.parse(result.Data);
        console.log(json);
        for (const key in json) {
            _subs.push(json[key]);
            console.log(json[key]);
        }
        feedPosts.set(_subs)
    } catch (e) {
        console.log(e);
    }
    return _subs;
};

export const isSubscribed = async (process: string, relay: string) => {
    try {
        // @ts-ignore
        let message = IsSubscribed(relay);
        let result = await read(process, message);
        if (result == undefined) throw (404);
        console.log(result);
        return result.Data
    } catch (e) {
        console.log(e);
    }
};

export const info = async (process: string):Promise<any | null> => {
    let _info = null;
    try {
        // @ts-ignore
        let message = Info();
        let result = await read(process, message);
        console.log(result);
        let json = JSON.parse(result.Data);
        console.log(json);
        _info = json
    } catch (e) {
        console.log(e);
    }
    return _info
};

export const getOwner = async (process: string):Promise<string> => {
    let owner = ""
    try {
        // @ts-ignore
        let message = GetOwner();
        let result = await read(process, message);
        console.log(result);
        owner = result.Data
    } catch (e) {
        console.log(e);
    }
    return owner
};


export const relay = async (owner: string): Promise<string | null> => {
    let _relay = null;
    try {
        // @ts-ignore
        let message = Relay(owner);
        let result = await read(INDEXER_ID(), message);
        if (result) {
            console.log(result);
            _relay = result.Data
        }
    } catch (e) {
        console.log(e);
    }
    return _relay
};

export const relays = async (page: string, size: string) => {
    let _relays: Array<any> = [];
    try {
        // @ts-ignore
        let message = Relays(page, size);
        let result = await read(INDEXER_ID(), message);
        if (result == undefined) return _relays;
        console.log(result);
        let json = JSON.parse(result.Data);
        console.log(json);
        return json
    } catch (e) {
        console.log(e);
    }
    return _relays;
};