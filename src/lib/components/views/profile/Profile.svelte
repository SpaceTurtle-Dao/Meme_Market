<script lang="ts">
  import { fly } from "svelte/transition";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Root,
  } from "$lib/components/ui/card";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";
  import {
    profileFromEvent,
    type Profile,
    type UserInfo,
  } from "$lib/models/Profile";
  import { currentUser, userEvents, user } from "../../../stores/profile.store";
  import type { Event } from "$lib/models/Event";
  import Post from "../../Post.svelte";
  import Followers from "./Followers.svelte";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Separator } from "$lib/components/ui/separator";
  import { Users, LucideUserPlus } from "lucide-svelte/icons";
  import { onMount } from "svelte";
  import { fetchEvents } from "$lib/ao/relay";

  let activeTab: string = "posts";
  let userInfo: UserInfo;
  let userProfile: Profile;
  let events: Array<Event> = [];
  let filters: Array<any> = [];

  user.subscribe((value) => {
    if (value) {
      let filter = {
        kinds: [1],
        since: 1663905355000,
        until: Date.now(),
        limit: 100,
      };
      filters.push(filter);
      userInfo = value;
      userProfile = profileFromEvent(userInfo.Profile);
      let _filters = JSON.stringify(filters);
      if (userInfo) {
        console.log("///FETCHING EVENTS///");
        fetchEvents(userInfo.Profile.pubkey, _filters);
      }
    }
    filters = [];
  });

  async function fetchMedia() {
    events = []
    console.log("//////FETHCING MEDIA////////");
    if (userInfo) {
      let filter = {
        kinds: [1],
        since: 1663905355000,
        until: Date.now(),
        limit: 100,
        "#imeta": [
          "m image/apng",
          "m image/avif",
          "m image/gif",
          "m image/jpeg",
          "m image/png",
          "m image/svg+xml",
          "m image/webp",
          "m video/x-msvideo",
          "m video/mp4",
          "m video/mpeg",
          "m video/ogg",
          "m video/webm",
        ],
      };
      filters.push(filter);
      let _filters = JSON.stringify(filters);
      if (userInfo) {
        console.log("///FETCHING EVENTS///");
        fetchEvents(userInfo.Profile.pubkey, _filters);
      }
    }
    filters = [];
  }

  async function fetchPost() {
    events = []
    console.log("//////FETHCING MEDIA////////");
    if (userInfo) {
      let filter = {
        kinds: [1],
        since: 1663905355000,
        until: Date.now(),
        limit: 100,
      };
      filters.push(filter);
      let _filters = JSON.stringify(filters);
      if (userInfo) {
        console.log("///FETCHING EVENTS///");
        fetchEvents(userInfo.Profile.pubkey, _filters);
      }
    }
    filters = [];
  }

  userEvents.subscribe((value) => {
    if (value.length > 0) {
      console.log("///GOT EVENTS///");
      console.log(events);
      events = value;
    }
  });

  function toUrl(tx: string) {
    return (
      "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
      tx
    );
  }

  function setActiveTab(tab: string) {
    activeTab = tab;
  }

  onMount(async () => {});
</script>

<div>
  <Card
    class="mb-10 overflow-hidden transition-transform transform hover:scale-105 duration-300 shadow-lg rounded-lg border-border"
  >
    <!-- Gradient Header -->
    {#if userInfo}
      <div class="p-8">
        <div class="flex items-center space-x-6">
          <!-- Avatar with Border -->
          <Avatar class="h-28 w-28 rounded-full ring-4 ring-white shadow-lg">
            {#if userProfile.picture}
              <AvatarImage
                src={toUrl(userProfile.picture)}
                alt={userProfile.name}
              />
            {/if}
            <AvatarFallback>{userProfile.name}</AvatarFallback>
          </Avatar>
          <!-- Profile Info -->
          <div>
            <h1 class="text-4xl font-extrabold text-white leading-tight">
              {userProfile.name}
            </h1>
            <p class="text-lg text-pink-100">@{userProfile.name}</p>
          </div>
        </div>
      </div>
    {/if}

    <!-- Card Content with Blur Effect -->
    <CardContent class="backdrop-filter backdrop-blur-lg p-6 rounded-b-lg"
    ></CardContent>
  </Card>

  <Tabs.Root value="post" class="">
    <Tabs.List class="grid grid-cols-4">
      <Tabs.Trigger
        class="underline-tabs-trigger"
        on:click={fetchPost}
        value="post">Post</Tabs.Trigger
      >
      <Tabs.Trigger on:click={fetchMedia} value="media">Media</Tabs.Trigger>
      <Tabs.Trigger value="following">Following</Tabs.Trigger>
      <Tabs.Trigger value="followers">Followers</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="post">
      <div class="">
        {#each events as event}
          <div class="border border-border p-5">
            <Post {event} />
          </div>
        {/each}
      </div>
    </Tabs.Content>
    <Tabs.Content value="media">
      <div class="">
        {#each events as event}
          <div class="border border-border p-5">
            <Post {event} />
          </div>
        {/each}
      </div>
    </Tabs.Content>
    <Tabs.Content value="following">
      {#if $user && $currentUser}
        <Followers
          relay={$user.Profile.pubkey}
          userRelay={$currentUser.Profile.pubkey}
          token={$user.Token}
          quantity={$user.SubscriptionCost.toString()}
        />
      {/if}
    </Tabs.Content>
    <Tabs.Content value="followers">
      {#if $user && $currentUser}
        <Followers
          relay={$user.Profile.pubkey}
          userRelay={$currentUser.Profile.pubkey}
          token={$user.Token}
          quantity={$user.SubscriptionCost.toString()}
        />
      {/if}
    </Tabs.Content>
  </Tabs.Root>
</div>
