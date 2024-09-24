<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { subscribers } from "../../../stores/profile.store";
  import { profileFromEvent, type UserInfo } from "$lib/models/Profile";
  import Follow from "./Follow.svelte";

  export let relay: string;
  export let userRelay: string;
  export let token: string;
  export let quantity: string;

  let _subscribers: Array<UserInfo> = [];

  //@ts-ignore
  subscribers.subscribe((value) => {
    _subscribers = value;
  });

  function getActionFromTags(tags: string[][]): string {
    const actionTag = tags.find((tag) => tag[0] === "Action");
    return actionTag ? actionTag[1] : "Unknown";
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  function toUrl(tx: string) {
    return (
      "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
      tx
    );
  }
</script>

<!--<div class="events-list">
  <h1>Events</h1>
  {#each _subscribers as subscriber}
    <div class="event-item">
      <h2>{getActionFromTags(subscriber.Profile.tags)}</h2>
      <p>{subscriber.Profile.pubkey}</p>
      <small
        >Created at: {formatDate(subscriber.Profile.created_at.toString())} by {subscriber
          .Profile.pubkey}</small
      >
    </div>
  {/each}
</div>

<div class="p-4 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold text-purple-600 mb-4">Followers</h2>
  <ul class="space-y-2">
    {#each _subscribers as subscriber}
      <li class="p-3 bg-gray-100 rounded-lg shadow-sm">
        {subscriber.Profile.pubkey}
      </li>
    {/each}
  </ul>
</div>-->

<div class="border border-border pl-5 pt-5 pr-5">
  {#each _subscribers as subscriber}
    <div class="flex justify-between ">
      <div class="flex space-x-2">
        {#if profileFromEvent(subscriber.Profile).picture}
        <Avatar.Root class="hidden h-9 w-9 sm:flex">
          <Avatar.Image
            src={toUrl(profileFromEvent(subscriber.Profile).picture)}
            alt="Avatar"
          />
          <Avatar.Fallback>OM</Avatar.Fallback>
        </Avatar.Root>
        {/if}
        <div>
          <p class="text-sm font-medium leading-none text-primary">
            {profileFromEvent(subscriber.Profile).name}
          </p>
          <p class="text-muted-foreground text-sm text-secondary">
            {profileFromEvent(subscriber.Profile).name}
          </p>
        </div>
      </div>
      <Follow {relay} {userRelay} {token} {quantity} />
    </div>
    <article class="pl-11 pb-6 pt-1 text-primary text-wrap ...">
      <p>
        New Yorkers are facing the winter chill with less warmth this year
        as the city's most revered soup stand unexpectedly shutters,
        following a series of events that have left the community puzzled.
      </p>
    </article>
  {/each}
</div>
