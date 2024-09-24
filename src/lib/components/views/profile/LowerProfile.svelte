<script lang="ts">
  import { onMount } from "svelte";
  import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
  import { MoreHorizontal } from "lucide-svelte";
  import { currentUser } from "../../../stores/profile.store";
  import ConnectWalletButton from "$lib/components/wallet.svelte";
  import { navigate } from "svelte-routing";
  import {
    profileFromEvent,
    type Profile,
    type UserInfo,
  } from "$lib/models/Profile";
  import CreateProfile from "./CreateProfile.svelte";

  let userInfo: UserInfo;
  let userProfile: Profile;
  let isConnected = false;

;
  // Function to format Arweave transaction URLs
  function toUrl(tx: string) {
    return (
      "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
      tx
    );
  }

  // Subscribe to the current user store
  currentUser.subscribe((value) => {
    if (value) {
      userInfo = value;
      userProfile = profileFromEvent(userInfo.Profile);
    }
  });


</script>

{#if userInfo}
  <button class="flex items-center space-x-4">
    {#if userProfile.picture}
      <Avatar class="h-12 w-12 ring-4">
        <AvatarImage src={toUrl(userProfile.picture)} alt={userProfile.name} />
        <AvatarFallback>{userProfile.name}</AvatarFallback>
      </Avatar>
    {/if}
    <div class="flex-grow text-left">
      <p class="font-semibold text-white">{userProfile.name}</p>
      <p class="text-sm text-white">@{userInfo.Profile.pubkey.slice(0, 12)}</p>
    </div>
    <MoreHorizontal class="w-5 h-5 text-white" />
  </button>
{/if}
