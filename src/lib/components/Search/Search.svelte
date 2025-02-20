<script lang="ts">
  import { Search as SearchIcon } from "lucide-svelte";
  import { onMount } from "svelte";
  import { fetchEvents } from "$lib/ao/relay";
  import type { Profile } from "$lib/models/Profile";
  import { profileFromEvent } from "$lib/models/Profile";
  
  let searchQuery = "";
  let searchResults: Profile[] = [];
  let isLoading = false;
  let debounceTimer: NodeJS.Timeout;

  async function handleSearch() {
    if (!searchQuery.trim()) {
      searchResults = [];
      return;
    }
    
    isLoading = true;
    try {
      const filter = JSON.stringify([
        {
          kinds: ["0"],
          search: searchQuery.toLowerCase()
        }
      ]);

      const events = await fetchEvents(filter);

      //@ts-ignore
      searchResults = events.map(event => {
        try {
          const profile = profileFromEvent(event);
          return {
            ...profile,
            address: event.From,
            created_at: event.Timestamp,
            updated_at: event.Timestamp,
            followList: []
          };
        } catch (e) {
          console.error("Error parsing profile:", e);
          return null;
        }
      }).filter(profile => {
        if (!profile) return false;
        const nameMatch = profile.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const displayNameMatch = profile.display_name?.toLowerCase().includes(searchQuery.toLowerCase());
        return nameMatch || displayNameMatch;
      });
      
    } catch (error) {
      console.error("Search error:", error);
      searchResults = [];
    } finally {
      isLoading = false;
    }
  }

  function debounceSearch() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(handleSearch, 300);
  }

  onMount(() => {
    return () => {
      clearTimeout(debounceTimer);
    };
  });
</script>

<div class="w-full p-4">
  <!-- Search Container -->
  <div class="bg-background-800 rounded-lg p-4 shadow-lg">
    <!-- Search Input -->
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center space-x-4 bg-background-700 rounded-full p-3 border border-background-600">
        <SearchIcon class="w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search profiles..."
          class="w-full bg-transparent focus:outline-none text-primary"
          on:input={debounceSearch}
        />
      </div>
    </div>

    <!-- Results Container with Scroll -->
    <div class="mt-4 relative">
      {#if isLoading}
        <div class="flex justify-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      {:else if searchResults.length > 0}
        <div class="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-background-600 scrollbar-track-background-700">
          <div class="max-w-3xl mx-auto space-y-4 p-2">
            {#each searchResults as profile}
              <a
                href="/profile/{profile.address}"
                class="block p-4 bg-background-700 rounded-lg hover:bg-background-600 transition-colors duration-200"
              >
                <div class="flex items-center space-x-4">
                  {#if profile.picture}
                    <img
                      src={profile.picture}
                      alt={profile.display_name || profile.name}
                      class="w-12 h-12 rounded-full object-cover"
                    />
                  {:else}
                    <div class="w-12 h-12 rounded-full bg-background-500 flex items-center justify-center">
                      <span class="text-lg text-primary">
                        {(profile.display_name || profile.name || profile.address).charAt(0).toUpperCase()}
                      </span>
                    </div>
                  {/if}
                  
                  <div class="flex-1 min-w-0">
                    <h3 class="text-primary font-medium truncate">
                      {profile.display_name || profile.name || profile.address.slice(0, 8) + '...'}
                    </h3>
                    {#if profile.about}
                      <p class="text-sm text-muted-foreground line-clamp-2">
                        {profile.about}
                      </p>
                    {/if}
                  </div>
                </div>
              </a>
            {/each}
          </div>
        </div>
      {:else if searchQuery}
        <p class="text-center text-muted-foreground py-4">No profiles found</p>
      {/if}
    </div>
  </div>
</div>