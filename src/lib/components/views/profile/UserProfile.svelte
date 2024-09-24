<script lang="ts">
  import { onMount } from "svelte";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Label } from "$lib/components/ui/label";
  import { Camera } from "lucide-svelte";
  // import { profile } from "$lib/ao/relay";
  import { upload } from "$lib/ao/uploader";
  import { eventStore } from "../../../stores/events.store";

  let username = "";
  let displayName = "";
  let bio = "";
  let avatarUrl = "";
  let avatarFile: File | null = null;

  $: events = $eventStore.events;
  $: loading = $eventStore.loading;
  $: error = $eventStore.error;

  function addNewEvent(event: Event) {
    // eventStore.addEvent(event);
  }

  async function fetchEvents() {
    eventStore.setLoading(true);
    // let events = ao.getEvents();
    // eventsStore.set(events);
    try {
    } catch (err) {
    } finally {
      eventStore.setLoading(false);
    }
  }

  function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      avatarFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        avatarUrl = e.target?.result as string;
      };
      reader.readAsDataURL(avatarFile);
    }
  }

  // async function handleCreateProfile() {
  //   if (!avatarFile) {
  //     alert("Please upload a profile picture.");
  //     return;
  //   }

  //   try {
  //     // Upload avatar to Arweave
  //     const tx = await upload(await avatarFile.arrayBuffer());

  //     // Create profile
  //     await profile(username, tx, bio);

  //     alert("Profile created successfully!");
  //   } catch (error) {
  //     console.error("Error creating profile:", error);
  //     alert("An error occurred while creating your profile. Please try again.");
  //   }
  // }
</script>

<div class="max-w-2xl mx-auto p-4">
  <Card class="overflow-hidden transition-all duration-300 hover:shadow-xl">
    <CardHeader
      class="bg-gradient-to-r from-secondary-500 to-secondary-800 text-white"
    >
      <CardTitle class="text-2xl font-bold">Create Your Profile</CardTitle>
    </CardHeader>
    <CardContent class="p-6 space-y-6">
      <div class="flex flex-col items-center space-y-4">
        <Avatar class="h-32 w-32 ring-4 ring-secondary-500">
          {#if avatarUrl}
            <AvatarImage src={avatarUrl} alt={displayName} />
          {:else}
            <AvatarFallback
              class="bg-secondary-100 text-secondary-500 text-4xl flex items-center justify-center"
            >
              <Camera size={48} />
            </AvatarFallback>
          {/if}
        </Avatar>
        <Label
          for="avatar-upload"
          class="cursor-pointer bg-secondary-500 hover:bg-secondary-600 text-white py-2 px-4 rounded-full transition-colors duration-300"
        >
          Upload Profile Picture
        </Label>
        <Input
          type="file"
          id="avatar-upload"
          class="hidden"
          accept="image/*"
          on:change={handleFileUpload}
        />
      </div>

      <div class="space-y-4">
        <div>
          <Label for="username">Username</Label>
          <Input
            type="text"
            id="username"
            bind:value={username}
            placeholder="@username"
          />
        </div>
        <div>
          <Label for="displayName">Display Name</Label>
          <Input
            type="text"
            id="displayName"
            bind:value={displayName}
            placeholder="Your Name"
          />
        </div>
        <div>
          <Label for="bio">Bio</Label>
          <Textarea
            id="bio"
            bind:value={bio}
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>

      <!-- // <Button
      //   class="w-full bg-gradient-to-r from-secondary-500 to-pink-500 hover:from-pink-500 hover:to-secondary-500 text-white transition-all duration-300"
      //   on:click={handleCreateProfile}
      // >
      //   Create Profile
      // </Button> -->
    </CardContent>
  </Card>
</div>
