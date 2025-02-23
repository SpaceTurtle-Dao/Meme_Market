<script lang="ts">
  import Reply from "$lib/components/views/engagement/Reply.svelte";
  import { onMount } from "svelte";
  import { fetchEvents } from "$lib/ao/relay";
  import { CornerDownRight, Repeat2Icon } from "lucide-svelte";
  import Nip92 from "$lib/handlers/NIP92.svelte";
  import Like from "$lib/components/views/engagement/Like.svelte";
  import Repost from "$lib/components/views/engagement/Repost.svelte";
  import Buy from "$lib/components/views/engagement/Buy.svelte";
  import Share from "$lib/components/views/engagement/Share.svelte";
  import { createEventDispatcher } from "svelte";
  import { currentUser } from "$lib/stores/current-user.store";
  import { link } from "svelte-spa-router";
  import * as Dialog from "$lib/components/ui/dialog";
  import ProfilePictureHoverCard from "../UserProfile/ProfilePictureHoverCard.svelte";
  import { formatTimestamp } from "$lib/utils/timestamp.utils";
  import { usersProfile } from "$lib/stores/users-profile.store";
  import ProfileHoverCard from "$lib/components/UserProfile/ProfileHoverCard.svelte";
  import type { Profile } from "$lib/models/Profile";
  import { postsStore } from "$lib/stores/posts.store";

  export let event: any;
  export let replies: any[] = [];

  let replyCount = 0;

  let profile: Profile;

  let isReply: boolean = false;
  let replyingTo: string | null = null;
  let isRepost: boolean = false;
  let originalEvent: any = null;
  let originalUser: any = null;
  let isLoading: boolean = true;
  let loadError: string | null = null;
  let repostArray: any[] = [];
  let dialogOpen = false;
  let loadingCompletePosts = false;

  function transformEventToPost(
    event: any,
    isRepost = false,
    originalEvent = null
  ) {
    return {
      id: event.Id,
      from: event.From,
      timestamp: event.Timestamp,
      content: event.Tags?.["Content"] || "",
      isReply: event.Tags?.["marker"] === "reply",
      isRepost,
      originalEvent,
    };
  }

  async function parseRepostContent() {
    if (!event?.Tags?.["Content"]) return null;

    try {
      const parsed = JSON.parse(event.Tags["Content"]);
      if (!parsed || !parsed.From) {
        console.error("Invalid repost content structure");
        return null;
      }
      return parsed;
    } catch (error) {
      console.error("Failed to parse repost content:", error);
      return null;
    }
  }

  async function fetchConcurrentData() {
    try {
      const promises: Promise<any>[] = [];

      // Check for reply
      if (event.Tags["marker"] === "reply") {
        isReply = true;
        replyingTo = event.Tags["p"];
      }

      // Check for repost
      if (event.Tags["Kind"] === "6") {
        isRepost = true;
        promises.push(
          parseRepostContent().then(async (parsedContent) => {
            if (parsedContent) {
              originalEvent = parsedContent;
              originalUser = $usersProfile.get(parsedContent.From);
            }
          })
        );
      }

      // Count replies
      promises.push(
        (async () => {
          if (!event?.Id) return;

          const replyFilter = JSON.stringify([
            {
              kinds: ["1"],
              tags: { marker: ["reply"] },
            },
            {
              tags: { e: [event.Id] },
            },
          ]);

          const replies = await fetchEvents(replyFilter);
          replyCount = replies.length;
        })()
      );

      // Count reposts if it's an original post
      if (!isRepost) {
        promises.push(
          (async () => {
            const repostFilter = JSON.stringify([
              {
                kinds: "6",
                tags: { e: [event.Id.toString()] },
              },
            ]);
            repostArray = await fetchEvents(repostFilter);
          })()
        );
      }

      await Promise.all(promises);
    } 
    catch (error) {
      // console.error("Error loading event data:", error);
      // loadError = "Failed to load post data";
    } finally {
      // isLoading = false;
    }
  }

  onMount(async () => {
    if (event) {
      // Transform and add post to store
      const post = transformEventToPost(
        event,
        isRepost,
        isRepost ? originalEvent : null
      );

      // Add to posts store
      postsStore.update((posts) => {
        // Prevent duplicates
        const exists = posts.some((p) => p.id === post.id);
        return exists ? posts : [post, ...posts].slice(0, 100);
      });

      profile = (await usersProfile.get(event.From)) as Profile;
      isLoading = false;
      fetchConcurrentData();
    }
  });

  const dispatch = createEventDispatcher();

  function handleNewReply(replyEvent: any) {
    const newReply = transformEventToPost(
      replyEvent.detail,
      true,
      //@ts-ignore
      { e: event.Id }
    );

    // Add reply to posts store
    postsStore.update((posts) => {
      const exists = posts.some((p) => p.id === newReply.id);
      return exists ? posts : [newReply, ...posts].slice(0, 100);
    });

    replies = [...replies, replyEvent.detail];
    dispatch("newReply", replyEvent.detail);
    replyCount += 1;
  }

  function handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest(".engagement-buttons")) {
      dialogOpen = true;
    }
  }
</script>

<div class="cursor-pointer border-b border-gray-800">
  <Dialog.Root>
    <Dialog.Trigger asChild>
      {#if isLoading}
        <div class="p-4">
          <div>
            <div class="flex items-center text-gray-500 mb-2">
              <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div>
              <div class="flex justify-start space-x-2">
                <div
                  class="hidden sm:block h-9 w-9 rounded-full bg-gray-200 animate-pulse"
                ></div>

                <div class="flex-1">
                  <div
                    class="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2"
                  ></div>
                  <div class="space-y-2">
                    <div
                      class="h-4 w-full bg-gray-200 rounded animate-pulse"
                    ></div>
                    <div
                      class="h-4 w-3/4 bg-gray-200 rounded animate-pulse"
                    ></div>
                    <div
                      class="h-4 w-1/2 bg-gray-200 rounded animate-pulse"
                    ></div>
                  </div>
                </div>
              </div>

              <div class="flex justify-between py-4">
                {#each Array(5) as _}
                  <div class="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      {:else if loadError}
        <!--<div class="p-4 text-red-500">
          {loadError}
        </div>-->
      {:else}
        <div class="p-4">
          {#if isReply}
            <div class="flex items-center text-muted-foreground mb-2">
              <CornerDownRight size={16} class="mr-2" />
              <span class="text-sm">Replying to @{replyingTo}</span>
            </div>
          {/if}

          {#if isRepost && profile?.name}
            <div class="flex items-center text-muted-foreground mb-2">
              <Repeat2Icon size={16} class="mr-2" />
              <span class="text-sm"
                >Reposted by
                {#if profile?.name == $currentUser?.name}
                  You
                {:else}
                  @{profile.name}
                {/if}
              </span>
            </div>
          {/if}

          <a use:link href={`/post/${event.From}/${event.Id}`}>
            <div>
              <div class="flex justify-start space-x-3">
                {#if isRepost && originalUser}
                  <div>
                    <ProfilePictureHoverCard profile={originalUser} />
                  </div>
                {:else if profile}
                  <div>
                    <ProfilePictureHoverCard {profile} />
                  </div>
                {/if}

                <div class="flex-1">
                  <div class="flex space-x-1 mb-1">
                    {#if isRepost && originalUser}
                      <ProfileHoverCard profile={originalUser}>
                        <div class="flex space-x-1">
                          <p class="font-medium text-primary">
                            {originalUser.name}
                          </p>
                          <span
                            class="text-muted-foreground pl-0.5 text-ellipsis"
                            >@{originalUser.display_name}</span
                          >
                        </div>
                      </ProfileHoverCard>
                    {:else if profile}
                      <ProfileHoverCard {profile}>
                        <div class="flex space-x-1">
                          <p class="font-medium text-primary">
                            {profile?.name}
                          </p>
                          <span
                            class="text-muted-foreground pl-0.5 text-ellipsis"
                            >@{profile?.display_name}</span
                          >
                        </div>
                      </ProfileHoverCard>
                    {/if}

                    <span class="text-muted-foreground"
                      >· {formatTimestamp(event.Timestamp)}</span
                    >
                  </div>

                  <div class="text-gray-200">
                    {#if isRepost && originalEvent}
                      <Nip92 event={originalEvent} />
                    {:else}
                      <Nip92 {event} />
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <div class="flex justify-between mt-3 engagement-buttons">
            <div class="flex items-center">
              <Reply {event} {isRepost} on:newReply={handleNewReply} />
              {#if replyCount > 0}
                <span class="ml-1 text-sm text-muted-foreground">
                  {replyCount}
                </span>
              {/if}
            </div>
            <Repost _event={isRepost ? originalEvent : event} />
            <Like _event={isRepost ? originalEvent : event} />
            <Buy />
            <Share />
          </div>
        </div>
      {/if}
    </Dialog.Trigger>
  </Dialog.Root>
</div>
