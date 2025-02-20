<script lang="ts">
  import { onMount } from "svelte";
  import { Video } from "flowbite-svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import type { Post } from "$lib/models/Post";

  export let post: Post;
  let inlineUrl: string;
  let processedContent: string;

  function parseTags() {
    let match = post.content.match(/https?:\/\/[^\s]+/);
    if (match == null) return;
    inlineUrl = match[0];
  }

  onMount(() => {
    parseTags();
  });
</script>

{#if post.mimeType && post.url && inlineUrl}
  <article class="pb-5 text-primary text-wrap ...">
    <p>{post.content.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")}</p>
  </article>
  {#if post.mimeType.startsWith("image/")}
    <img
      class="border border-border rounded-lg w-full"
      alt="The project logo"
      src={post.url}
    />
  {:else}
    <Video src={post.url} controls />
  {/if}
{:else if inlineUrl}
  <article class="justify-left text-primary text-wrap ...">
    <p>{post.content.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")}</p>
  </article>
  <a
    href={inlineUrl}
    class="pl-0 pb-6 text-blue-500 hover:underline"
    target="_blank"
    rel="noopener noreferrer"
    on:click|stopPropagation={() => {}}
  >
    <p class="text-wrap">{inlineUrl}</p>
  </a>
{:else}
  <article class="text-primary text-wrap ...">
    <p>{post.content}</p>
  </article>
{/if}

<style>
  img {
    border-radius: 2.5%;
  }
</style>
