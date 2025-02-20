// users-profile.store.ts
import { fetchEvents, fetchFollowList, fetchProfile } from "$lib/ao/relay";
import type { Profile } from "$lib/models/Profile";
import { get, writable, type Readable } from "svelte/store";
import { profileService } from "./ProfileService";
import { PostType, type Post } from "$lib/models/Post";

export interface PostService extends Readable<Map<string, Post>> {
    fetchPost: (since: Number, limit: Number, authors: string[]) => Promise<Map<string, Post>>;
    fetchReplies: (since: Number, limit: Number, id: string) => Promise<Map<string, Post>>;
    get: (id: string) => Promise<Post>;
}

const service = (): PostService => {
    const { subscribe, set, update } = writable<Map<string, Post>>(
        new Map<string, any>()
    );
    return {
        subscribe,
        fetchPost: async (since: Number, limit: Number, authors: string[] = []): Promise<Map<string, Post>> => {
            let posts = get(postService)
            try {
                if (authors.length > 0) {
                    let _posts:Map<string, Post> = new Map<string, Post>()
                    const filter = {
                        kinds: ["1", "6"],
                        authors: authors
                    };
                    const _filters = JSON.stringify([filter]);
                    let events = await fetchEvents(_filters)
                    let profiles = await profileService.fetchProfiles(0, 10000, authors)
                    for (var i = 0; i < events.length; i++) {
                        let profile = profiles.get(events[i].From);
                        let post = postFactory(events[i], profile);
                        _posts.set(post.id, post)
                        posts.set(post.id, post)
                    }
                    set(posts)
                    return _posts
                } else {
                    const filter = {
                        kinds: ["1"],
                        since: since,
                        limit: limit
                    };
                    const filter2 = {
                        tags: { marker: ["root"] },
                    };

                    const _filters = JSON.stringify([filter, filter2]);
                    let events = await fetchEvents(_filters);
                    const authors = events.map(event => event.From);
                    let profiles = await profileService.fetchProfiles(0, 1000, authors)
                    for (var i = 0; i < events.length; i++) {
                        let profile = profiles.get(events[i].From);
                        let post = postFactory(events[i], profile) ;
                        posts.set(post.id, post)
                    }
                    set(posts)
                    return posts
                }
            } catch (error) {
                throw (error)
            }
        },
        fetchReplies: async (since: Number, limit: Number, id: string): Promise<Map<string, any>> => {
            let posts = get(postService);
            let replies: Map<string, any> = new Map<string, any>();
            try {
                const filter = {
                    kinds: ["1"],
                    //since: since,
                    //limit: limit
                };
                const filter2 = {
                    tags: { marker: ["reply"] },
                };

                const filter3 = {
                    tags: { e: [id] },
                };

                const _filters = JSON.stringify([filter, filter2, filter3]);
                let events = await fetchEvents(_filters)
                const authors = events.map(event => event.From);
                let profiles = await profileService.fetchProfiles(0, 10000, authors)
                for (var i = 0; i < events.length; i++) {
                    let post = events[i];
                    post.profile = profiles.get(post.From);
                    posts.set(post.From, post)
                    replies.set(post.From, post)
                }
                set(posts)
                console.log("got replies")
                console.log(replies)
                return replies

            } catch (error) {
                throw (error)
            }
        },
        get: async (id: string): Promise<Post> => {
            let posts = get(postService)
            try {
                const filter = {
                    kinds: ["1", "6"],
                    ids: [id]
                };
                const _filters = JSON.stringify([filter]);
                let result = await fetchEvents(_filters)
                if (result.length == 0) throw ("Not Found")
                let profile = await profileService.get(result[0].From)
                let post = postFactory(result[0],profile);
                post = await getRepost(post)
                posts.set(id, post)
                set(posts)
                return post
            } catch (error) {
                throw (error)
            }
        },
    };
};

function postFactory(event: any, profile:Profile): Post {
    let postType: PostType;
    switch (event.Tags["marker"]) {
        case "media":
            postType = PostType.Media
            break
        case "reply":
            postType = PostType.Reply
            break
        case "repost":
            postType = PostType.Repost
            break
        default:
            postType = PostType.Root
    }

    if( event.Kind == "6") postType = PostType.Repost;
    
    let _post: Post = {
        id: event.Id,
        from: event.From,
        timestamp: event.Timestamp,
        content: event.Content,
        profile: profile,
        type: postType,
        rePost: undefined,
        mimeType: event.mimeType,
        url: event.url
    }
    return _post
}

async function getRepost(post:Post):Promise<Post> {
    let _post = post;
    if(_post.type == PostType.Repost){
        const content = JSON.parse(_post.content);
        let profile = await profileService.get(content.From)
        _post.rePost = postFactory(content,profile);
    }
    return _post
}

export const postService = service();
