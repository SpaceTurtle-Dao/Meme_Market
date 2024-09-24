<script lang="ts">
  import { onMount } from 'svelte';
  import type { Event } from "../lib/stores/events.store";

  export let event: Event;

  let parsedTags: { key: string; value: string; extra?: string }[] = [];
  let imetaTag: { [key: string]: string } = {};
  let hasRequiredTags = false;

  const REQUIRED_KEYS = ['imeta', 'url'];
  const POSSIBLE_KEYS = [...REQUIRED_KEYS, 'm', 'blurhash', 'dim', 'alt', 'x'];

  onMount(() => {
    parseTags();
    checkRequiredTags();
  });

  function parseTags() {
    parsedTags = event.tags
      .filter(tag => POSSIBLE_KEYS.includes(tag[0]))
      .map(tag => ({
        key: tag[0],
        value: tag[1],
        extra: tag[2]
      }));

    imetaTag = Object.fromEntries(
      parsedTags
        .filter(tag => tag.key !== 'imeta')
        .map(tag => [tag.key, tag.value])
    );
  }

  function checkRequiredTags() {
    hasRequiredTags = REQUIRED_KEYS.every(key => 
      parsedTags.some(tag => tag.key === key)
    );
  }
</script>

<div class="tag-container p-4 bg-gray-100 rounded-lg">
  {#if hasRequiredTags}
    <h3 class="text-xl font-bold mb-2">Image Metadata (imeta):</h3>
    <ul class="list-disc pl-5 mb-4">
      {#each Object.entries(imetaTag) as [key, value]}
        <li class="mb-1"><strong>{key}:</strong> {value}</li>
      {/each}
    </ul>
  {:else}
    <p class="error text-red-500 mb-4">Error: Missing required tags (imeta and url)</p>
  {/if}

  <h3 class="text-xl font-bold mb-2">All Tags:</h3>
  <ul class="list-disc pl-5">
    {#each parsedTags as tag}
      <li class="mb-1">
        <strong>{tag.key}:</strong> {tag.value}
        {#if tag.extra}
          <span class="text-gray-600">(Extra: {tag.extra})</span>
        {/if}
      </li>
    {/each}
  </ul>
</div>