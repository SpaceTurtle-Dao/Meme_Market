<script lang="ts">
  import PostComponent from "$lib/components/posts/Post.svelte";
  import type { Post } from "$lib/models/Post";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { onMount } from "svelte";
  import { currentUser } from "$lib/stores/current-user.store";
  import { postService } from "$lib/services/PostService";
  import { profileService } from "$lib/services/ProfileService";

  let posts: Array<Post> = [];

  postService.subscribe((value) => {
    posts = value.values().toArray();
  });

  async function fetchFeedEvents() {
    //if (isFetchingAlready || !$currentUser) return;

    try {
      console.log("will get feed");
      postService.fetchPost(0, 1000, []);
      console.log(posts);
    } catch (error) {
      console.error("Error fetching feed events:", error);
    } finally {
      //isFetchingAlready = false;
    }
  }

  async function fetchFollowingEvents() {
    console.log("will get Follow List");
    if (!$currentUser.followList) return;
    console.log("Got Follow List");
    console.log($currentUser.followList);
    try {
      postService.fetchPost(1663905355000, 100, $currentUser.followList);
    } catch (error) {
      console.error("Error fetching following events:", error);
    }
  }

  function handleNewReply(event: any) {
    const newReply = event.detail;
    // Process events including the new reply
    //events = processEvents([...events.flat(), newReply]);
  }
  let container;
  function handleScroll(event: Event) {
    //const target = event.target as HTMLDivElement;
    //const threshold = 100; // pixels from bottom to trigger load
    console.log("we are scrolling");
    /*if (
      target.scrollHeight - (target.scrollTop + target.clientHeight) <
        threshold &&
      !loading &&
      hasMore
    ) {
      if (
        profiles.length == ITEMS_PER_PAGE &&
        profiles[profiles.length - 1].created_at != since
      ) {
        since = profiles[profiles.length - 1].created_at;
        loadMoreProfiles();
      }
    }*/
  }

  // Initialize feed
  onMount(async () => {
    fetchFeedEvents();
  });

  // Handle new post notifications
  /*notifyNewPostStore.subscribe(async (value) => {
    if (value) {
      await fetchFeedEvents();
      // Reset the notification store
      notifyNewPostStore.set(0);
    }
  });*/
</script>

{#if $currentUser}
  <div class="relative">
    <div bind:this={container} on:scroll={handleScroll}>
      <div class="md:mt-10 mt-5 max-w-prose w-full">
        <Tabs.Root value="for you" class="max-w-prose">
          <Tabs.List class="grid grid-cols-2 md:mx-0 mx-4 ">
            <Tabs.Trigger
              class="underline-tabs-trigger"
              on:click={fetchFeedEvents}
              value="for you">For You</Tabs.Trigger
            >
            <Tabs.Trigger on:click={fetchFollowingEvents} value="following"
              >Following</Tabs.Trigger
            >
          </Tabs.List>
  
          <Tabs.Content value="for you">
            <div>
              {#each posts as post}
                <div class="border border-border max-w-prose">
                  <PostComponent {post} />
                </div>
              {/each}
            </div>
          </Tabs.Content>
  
          <Tabs.Content value="following">
            <div>
              {#each posts as post}
                <div class="border border-border max-w-prose">
                  <PostComponent
                    {post}
                  />
                </div>
              {/each}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  </div>
{/if}