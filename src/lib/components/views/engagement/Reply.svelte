<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import { event as aoEvent, fetchEvents } from "$lib/ao/relay";
  import { upload } from "$lib/ao/uploader";
  import { currentUser } from "$lib/stores/current-user.store";
  import type { Tag } from "$lib/models/Tag";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Image, X } from "lucide-svelte";
  import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";
  import ButtonWithLoader from "$lib/components/ButtonWithLoader/ButtonWithLoader.svelte";
  import PostPreview from "./PostPreview.svelte";
  import type { Profile } from "$lib/models/Profile";
  import { profileService } from "$lib/services/ProfileService";
  import type { Post } from "$lib/models/Post";

  export let post: Post;

  let newReply: any;

  let content = "";
  let fileInput: HTMLInputElement | null = null;
  let selectedMedia: File | null = null;
  let mediaPreviewUrl: string | null = null;
  let isLoading = false;
  let dialogOpen = false;

  const dispatch = createEventDispatcher();

  // Helper function to find tag value
  function findTagValue(tags: Tag[], tagName: string): string | undefined {
    return tags.find((tag) => tag.name === tagName)?.value;
  }

  function clearFields() {
    content = "";
    selectedMedia = null;
    mediaPreviewUrl = null;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  function handleMediaButtonClick() {
    if (fileInput) {
      fileInput.click();
    }
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      selectedMedia = target.files[0];
      mediaPreviewUrl = URL.createObjectURL(selectedMedia);
    }
  }

  async function handleSubmit() {
    if (!content.trim() && !selectedMedia) return;

    isLoading = true;
    try {
      const tags: Tag[] = [
        { name: "Kind", value: "1" },
        { name: "marker", value: "reply" },
        { name: "e", value: post.id },
        { name: "p", value: post.from },
      ];

      let _content = content;

      // Handle media upload
      if (selectedMedia) {
        const media = await upload(selectedMedia);
        const dimensions = "";

        tags.push({ name: "url", value: media.url });
        tags.push({ name: "mimeType", value: media.mimeType || "" });
        tags.push({ name: "dim", value: dimensions });

        _content = _content + " " + media.url;
      }

      tags.push({ name: "Content", value: _content });
      tags.push({ name: "action", value: "reply" });

      newReply = await aoEvent(tags);

      const replyTags = tags.reduce((acc: any, tag) => {
        acc[tag.name.toLowerCase()] = tag.value;
        return acc;
      }, {});

      dispatch("newReply", {
        ...newReply,
        Tags: replyTags,
      });

      clearFields();
      dialogOpen = false;
    } catch (error) {
      console.error("Error creating reply:", error);
    } finally {
      isLoading = false;
    }
  }

  function removeSelectedMedia() {
    selectedMedia = null;
    mediaPreviewUrl = null;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  $: if (dialogOpen === false) {
    clearFields();
  }

  onMount(async () => {

  });
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Trigger>
    <Button
      variant="ghost"
      size="icon"
      class="flex flex-row text-primary space-x-1 bg-transparent hover:bg-transparent"
    >
      <span class="sr-only">Reply</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-5 h-5"
        ><path
          d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        ></path></svg
      >
    </Button>
  </Dialog.Trigger>
  <Dialog.Content class="w-full text-primary border-border">
    <Dialog.Header>
      <PostPreview {post} />
    </Dialog.Header>
    <form on:submit|preventDefault={() => {}}>
      <div class="flex">
        <ProfilePicture
          size="lg"
          src={$currentUser?.picture}
          name={$currentUser?.name}
        />

        <div class="w-full ml-3">
          <Textarea
            bind:value={content}
            placeholder="Post your reply"
            class="text-lg w-full bg-background border-none focus:border-none outline-none focus:outline-none focus-visible:outline-none ring-none focus:ring-none focus-visible:ring-none ring-background overflow-y-hidden"
          />
          {#if mediaPreviewUrl}
            <div class="relative p-5">
              {#if selectedMedia?.type.startsWith("video")}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video
                  src={mediaPreviewUrl}
                  controls
                  class="w-full h-48 object-cover rounded-md"
                />
              {:else}
                <img
                  src={mediaPreviewUrl}
                  alt="Selected media"
                  class="w-full object-cover rounded-md"
                />
              {/if}
              <Button
                variant="ghost"
                on:click={removeSelectedMedia}
                class="text-muted-primary bg-muted-foreground h-18 w-18 hover:text-foreground rounded-full absolute top-2 right-2 p-1"
              >
                <X />
              </Button>
            </div>
          {/if}
        </div>
      </div>
      <input
        type="file"
        accept="image/*, video/*"
        bind:this={fileInput}
        class="hidden"
        on:change={handleFileChange}
      />
    </form>
    <Dialog.Footer>
      <div class="w-full flex flex-row justify-between">
        <Button
          type="button"
          variant="ghost"
          on:click={handleMediaButtonClick}
          class="text-primary hover:bg-primary/10 rounded-full"
        >
          <Image size={24} />
        </Button>

        <ButtonWithLoader
          class="rounded-full font-semibold text-md px-6 w-36"
          on:click={handleSubmit}
          disabled={isLoading || (!content.trim() && !selectedMedia)}
          loader={isLoading}>Reply</ButtonWithLoader
        >
      </div>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
