<script lang="ts">
  import ProfileCard from "$lib/components/views/profile/ProfileCard.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { currentUser } from "$lib/stores/current-user.store";
  import type { Profile } from "$lib/models/Profile";
  import { onMount } from "svelte";
  import { profileService } from "$lib/services/ProfileService";

  export let _profiles: string[] = [];
  const ITEMS_PER_PAGE = 100;
  let since = 0;
  let profiles: Profile[] = [];
  let containerRef: HTMLDivElement;
  let loading = false;
  let hasMore = true;

  onMount(() => {
    loadInitialProfiles();
  });

  profileService.subscribe(value => {
    profiles = value.values().toArray()
  })

  async function loadInitialProfiles() {
    console.log("follow list");
    console.log(_profiles);
    profileService.fetchProfiles(
      since,
      ITEMS_PER_PAGE,
      _profiles,
    );
    console.log(profiles.length);
  }

  async function loadMoreProfiles() {
    if (loading || !hasMore) return;
    console.log("follow list");
    console.log(_profiles);
    profileService.fetchProfiles(
      since,
      ITEMS_PER_PAGE,
      _profiles,
    );
    hasMore = profiles.length === ITEMS_PER_PAGE;
  }

  function handleScroll(event: Event) {
    const target = event.target as HTMLDivElement;
    const threshold = 100; // pixels from bottom to trigger load

    if (
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
    }
  }
</script>

{#if profiles.length > 0}
  <div class="w-full h-full mb-10">
    <Card.Root
      data-x-chunk-name="UserList"
      data-x-chunk-description="A card showing a list of users."
      class="border-border rounded p-0 min-w-[280px]"
    >
      {#if _profiles.length == 0}
        <Card.Header>
          <Card.Title>You might like</Card.Title>
        </Card.Header>
      {/if}

      <Card.Content class="w-full pt-5">
        <div
          bind:this={containerRef}
          on:scroll={handleScroll}
          class="grid gap-4 lg:gap-6 max-h-[60vh] lg:max-h-[80vh] overflow-y-auto scrollable-element pr-2 lg:pr-3"
        >
          {#each profiles as profile}
            {#if profile.address !== $currentUser.address}
              <ProfileCard {profile} />
            {/if}
          {/each}

          {#if loading}
            <div class="flex justify-center p-4">
              <div
                class="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"
              ></div>
            </div>
          {/if}
        </div>
      </Card.Content>
    </Card.Root>
  </div>
{/if}

<style>
  .scrollable-element {
    scrollbar-color: hsl(0, 0%, 45%) hsl(0 0% 14.9%);
    scrollbar-width: thin;
  }
</style>
