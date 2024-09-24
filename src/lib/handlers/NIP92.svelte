<script lang="ts">
  import { onMount } from "svelte";
  import type { Event } from "$lib/models/Event";
  import { Video } from "flowbite-svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  export let event: Event;
  let inlineUrl: string;
  let media: string;
  let mimeType: string;
  let thumb: string;

  function toUrl(tx: string) {
    return (
      "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
      tx
    );
  }

  function convert() {
    var text = document.getElementById("url")!.innerHTML;
    var exp =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    var text1 = text.replace(exp, "<a href='$1'>$1</a>");
    var exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    document.getElementById("converted_url")!.innerHTML = text1.replace(
      exp2,
      '$1<a target="_blank" href="http://$2">$2</a>',
    );
  }

  function parseTags() {
    console.log("/////////PARSING EVENT///////////");
    let isImeta = false;
    let match = event.content.match(/https?:\/\/[^\s]+/);
    if (match == null) return;
    inlineUrl = match[0];
    let tags = event.tags[0];
    console.log(tags);
    for (var i in tags) {
      let tag = tags[i];
      console.log(tag);
      if (tag == "imeta") {
        isImeta = true;
      }
    }
    if (isImeta) {
      for (var i in tags) {
        let tag = tags[i];
        console.log(tag.split(" "));
        if (tag.split(" ")[0] == "url" && inlineUrl == tag.split(" ")[1]) {
          media = tag.split(" ")[1];
        }
        if (tag.split(" ")[0] == "m") {
          mimeType = tag.split(" ")[1];
        }
        if (tag.split(" ")[0] == "thumb") {
          thumb = tag.split(" ")[1];
        }
      }
    }
    console.log("/////////GOT MEDIA///////////");
    console.log(media);
    console.log(mimeType);
    console.log(thumb);
  }

  parseTags();
</script>

{#if mimeType && media && inlineUrl}
  <article class="pl-11 pb-6 pt-1 text-primary text-wrap ...">
    <p>{event.content.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")}</p>
  </article>
  <div class="flex justify-center">
    {#if mimeType.startsWith("image/")}
      <img alt="The project logo" src={media} />
    {:else}
      <Video src={media} controls />
    {/if}
  </div>
{:else if inlineUrl}
  <article class="pl-11 pt-1 justify-left text-primary text-wrap ...">
    <p>{event.content.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")}</p>
  </article>
  <Button href={inlineUrl} variant="link" class="pl-11 pb-6 text-blue-500"
    >{inlineUrl}</Button
  >
{:else}
  <article class="pl-11 pb-6 pt-1 text-primary text-wrap ...">
    <p>{event.content}</p>
  </article>
{/if}
