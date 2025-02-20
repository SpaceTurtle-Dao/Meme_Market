<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import type { Tag } from "$lib/models/Tag";
    import { Heart } from "lucide-svelte";
    import { onMount } from "svelte";
    import { fetchEvents, event } from "$lib/ao/relay";
    import { currentUser } from "$lib/stores/current-user.store";
    import type { Post } from "$lib/models/Post";

    export let post: Post;

    let liked = false;
    let likes: Array<any> = [];
    let _tags: Array<Tag> = [];

    let kind: Tag = {
        name: "Kind",
        value: "7",
    };

    async function like() {
        let contentTag: Tag = {
            name: "Content",
            value: "+",
        };
        let eventTag: Tag = {
            name: "e",
            value: _event.Id.toString(),
        };
        let pubkeyTag: Tag = {
            name: "p",
            value: _event.From,
        };
        _tags.push(kind);
        _tags.push(contentTag);
        _tags.push(eventTag);
        _tags.push(pubkeyTag);
        liked = !liked;
        await event(_tags);
        await fetchLikes();
    }

    async function fetchLikes() {
        if (!_event) return;
        let filters: Array<any> = [];
        likes = [];
        let filter1 = {
            kinds: ["7"],
            //since: Number(timestamp),
            //until: Date.now(),
            //limit: 100,
        };
        let filter2 = {
            tags: {
                e: [_event.Id],
                //p: [_event.From]
            },
        };
        filters.push(filter1, filter2);
        let _filters = JSON.stringify(filters);
        likes = await fetchEvents(_filters);
        for (var i = 0; i < likes.length; i++) {
            if (likes[i].From == $currentUser.address) {
                liked = true;
            }
        }
        filters = [];
    }

    onMount(async () => {
        //console.log($currentUser.address)
        //console.log("getting likes for id");
        await fetchLikes();
        /*console.log("got "+likes.length+" likes for id");
        console.log(_event.Id)
        console.log(likes);*/
    });
</script>

<Button
    variant="ghost"
    size="icon"
    class="flex flex-row text-primary space-x-1 bg-transparent hover:bg-transparent"
    on:click={like}
>
    {#if liked}
        <Heart strokeWidth={0} class="fill-red-400" />
        <p class="font-thin text-red-400">{likes.length}</p>
    {:else}
        <Heart
            strokeWidth={0.8}
            class="text-primary hover:fill-red-400 hover:text-red-400"
        />
        <p class="font-thin">{likes.length}</p>
    {/if}
</Button>
