<script lang="ts">
  import { onMount } from "svelte";

  import Post from "$lib/components/PostMedia.svelte";
// =======
//   import Post from "$lib/components/Post.svelte";
//   import { fetchMemes } from "$lib/ao/relay";
//   import type { Meme } from "$lib/models/Meme";
// >>>>>>> development
  import Spinner from "$lib/components/Spinner.svelte";
  import type { Event } from "$lib/models/Event"; // Define your Event model here or import it

  let events: Event[] = [];
  let loading = true;

  // Simulating the fetchEvents function with dummy data
  async function fetchEvents(): Promise<Array<Event>> {
    return [
      
    ];
  }

  // Fetching the events when the component mounts
  onMount(async () => {
    try {
      events = await fetchEvents();
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      loading = false;
    }
  });
</script>

<div class="max-w-4xl mx-auto p-4 bg-background-500">
  {#if loading}
    <div>
      <Spinner />
    </div>
  {:else}
    <div class="space-y-6">
      {#each events as event (event.id)}
        <!--<Post {event} />-->
      {/each}
    </div>
  {/if}
</div>

<style>
/* Add custom styles here if needed */
</style>
