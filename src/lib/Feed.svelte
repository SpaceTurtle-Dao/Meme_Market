<script lang="ts">
    //@ts-nocheck
    import { onMount } from "svelte";
    import Tweet from "$lib/components/Post.svelte";
    import { fetchMemes } from "./ao/relay";
    import type { Meme } from "$lib/models/Meme";

    let memes: Meme[] = [];

    onMount(async () => {
        try {
            memes = await fetchMemes("1", "100");
        } catch (error) {
            console.error("Error fetching memes:", error);
        }
    });
</script>

<div class="max-w-4xl mx-auto p-4">
    <div class="space-y-6">
        {#each memes as meme (meme.Pool)}
            <Tweet {meme} />
        {/each}
    </div>
</div>
