<script lang="ts">
  import { formatTimestamp } from "$lib/utils/timestamp.utils";
  import type { Profile } from "$lib/models/Profile";
  import ProfilePictureHoverCard from "$lib/components/UserProfile/ProfilePictureHoverCard.svelte";
  import ProfileHoverCard from "$lib/components/UserProfile/ProfileHoverCard.svelte";
  import { Repeat2Icon } from "lucide-svelte";
  import { currentUser } from "$lib/stores/current-user.store";
  import { profileService } from "$lib/services/ProfileService";
  import { onMount } from "svelte";
  import { fetchProfile } from "$lib/ao/relay";
  import { PostType, type Post } from "$lib/models/Post";

  export let post: Post;

  function formatContent(content: string): string {
    // console.log("hhhh", JSON.parse(content));
    // content = isRepost ? JSON.parse(content).Content : content;
    // console.log("hhhh", content);

    let urlReplaceContent = content.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");

    if (urlReplaceContent.length < 400) {
      return urlReplaceContent;
    }

    return urlReplaceContent.slice(0, 400) + "...";
  }

  onMount(async () => {
 
  });
</script>

{#if post.type == PostType.Repost}
  <div class="flex items-center text-muted-foreground mb-2">
    <Repeat2Icon size={16} class="mr-2" />
    <span class="text-sm"
      >Reposted by
      {#if post.profile.address == $currentUser.address}
        You
      {:else}
        @{post.profile.display_name}
      {/if}
    </span>
  </div>
{/if}

<div class="flex mt-4">
  <div class="h-full flex flex-col items-center">
    {#if post.rePost}
      <ProfilePictureHoverCard size="lg" profile={post.rePost.profile} />
    {/if}
    <div
      id="vertical-line"
      class="h-full bg-secondary w-[2px] flex-1 mt-3"
    ></div>
  </div>
  <div class="flex flex-col">
    <div
      class="h-12 w-full flex items-center min-w-0 overflow-hidden whitespace-nowrap"
    >
      {#if post.rePost}
        <ProfileHoverCard profile={post.rePost.profile}>
          <div class="flex space-x-1">
            <div class="text-primary text-base font-medium mr-1 ml-2">
              {post.rePost.profile.name}
            </div>

            <div class="text-muted-foreground text-base font-light truncate">
              {"@" + post.rePost.profile.display_name}
            </div>
          </div>
        </ProfileHoverCard>
        <ProfileHoverCard profile={post.profile}>
          <div class="flex space-x-1">
            <div class="text-primary text-base font-medium mr-1 ml-2">
              {post.profile.name}
            </div>

            <div class="text-muted-foreground text-base font-light truncate">
              {"@" + post.profile.display_name}
            </div>
          </div>
        </ProfileHoverCard>
        
      

      <span class="text-muted-foreground pl-1">
        · {formatTimestamp(post.rePost.timestamp)}</span
      >
      {/if}
    </div>
    {#if post.rePost}
    <div class="text-primary text-start mt-4">
      {formatContent(post.rePost.content)}
    </div>
    {/if}

    <div class="text-start text-muted-foreground mt-5">
      {"Replying to "}
      <span class="text-sky-500">{"@" + post.profile.display_name}</span>
    </div>
  </div>
</div>
