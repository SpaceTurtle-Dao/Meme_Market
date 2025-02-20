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
  import ProfileHoverCard from "$lib/components/UserProfile/ProfileHoverCard.svelte";
  import type { Profile } from "$lib/models/Profile";
  import { profileService } from "$lib/services/ProfileService";
  import { postService } from "$lib/services/PostService";
  import { PostType, type Post } from "$lib/models/Post";

  export let post: Post;
  export let replies: Post[] = [];

  let replyCount = 0;

  let isLoading: boolean = false;
  let loadError: string | null = null;
  let repostArray: any[] = [];
  let dialogOpen = false;
  let loadingCompletePosts = false;

  function transformEventToPost(
    event: any,
    isRepost = false,
    originalEvent = null,
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

  onMount(async () => {
    if (post.type == PostType.Repost) {
      isLoading = true;
      post = await postService.get(post.id);
      console.log("got profile for post");
      isLoading = false;
    }
  });

  const dispatch = createEventDispatcher();

  function handleNewReply(replyEvent: any) {
    const newReply = transformEventToPost(
      replyEvent.detail,
      true,
      //@ts-ignore
      { e: event.Id },
    );

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
          {#if post.type == PostType.Reply}
            <div class="flex items-center text-muted-foreground mb-2">
              <CornerDownRight size={16} class="mr-2" />
              <!--<span class="text-sm">Replying to @{replyingTo}</span>-->
              <span class="text-sm">Replying to @ someone fix</span>
            </div>
          {/if}

          {#if post.rePost}
            <div class="flex items-center text-muted-foreground mb-2">
              <Repeat2Icon size={16} class="mr-2" />
              <span class="text-sm">
                {#if post.profile.address == $currentUser?.address}
                  You Reposted
                {:else}
                  Reposted by @{post.profile.name}
                {/if}
              </span>
            </div>
          {/if}

          <a use:link href={`/post/${post.from}/${post.id}`}>
            <div>
              <div class="flex justify-start space-x-3">
                {#if post.rePost}
                  <div>
                    <ProfilePictureHoverCard profile={post.rePost.profile} />
                  </div>
                {:else}
                  <div>
                    <ProfilePictureHoverCard profile={post.profile} />
                  </div>
                {/if}
                <div class="flex-1">
                  <div class="flex space-x-1 mb-1">
                    {#if post.rePost}
                    <ProfileHoverCard profile={post.profile}>
                      <div class="flex space-x-1">
                        <p class="font-medium text-primary">
                          {post.rePost.profile.name}
                        </p>
                        <span class="text-muted-foreground pl-0.5 text-ellipsis"
                          >@{post.rePost.profile.display_name}</span
                        >
                      </div>
                    </ProfileHoverCard>
                    {:else}
                    <ProfileHoverCard profile={post.profile}>
                      <div class="flex space-x-1">
                        <p class="font-medium text-primary">
                          {post.profile.name}
                        </p>
                        <span class="text-muted-foreground pl-0.5 text-ellipsis"
                          >@{post.profile.display_name}</span
                        >
                      </div>
                    </ProfileHoverCard>
                    {/if}
                    <span class="text-muted-foreground"
                      >· {formatTimestamp(post.timestamp)}</span
                    >
                  </div>

                  <div class="text-gray-200">
                    {#if post.rePost}
                      <Nip92 post={post.rePost} />
                    {:else}
                      <Nip92 {post} />
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <div class="flex justify-between mt-3 engagement-buttons">
            <div class="flex items-center">
              <Reply {post} on:newReply={handleNewReply} />
              {#if replyCount > 0}
                <span class="ml-1 text-sm text-muted-foreground">
                  {replyCount}
                </span>
              {/if}
            </div>
            <!--<Repost {post} />
            <Like {post} />-->
            <Buy />
            <Share />
          </div>
        </div>
      {/if}
    </Dialog.Trigger>
  </Dialog.Root>
</div>
