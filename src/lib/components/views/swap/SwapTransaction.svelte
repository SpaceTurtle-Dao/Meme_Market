<script lang="ts">
  import { onMount } from "svelte";
  import { formatDistanceToNow } from "date-fns";
  import { ArrowUpRight, ArrowDownRight } from "lucide-svelte";
  // import { fetchSwaps } from "$lib/ao/relay";
  import { swapsStore } from "../../../stores/pool.store";
  import type { Swap } from "$lib/models/Swap";
  import { DECIMALS, formatNumber } from "$lib/constants";
  import type { Meme } from "$lib/models/Meme";

  export let meme: Meme;

  let swaps: Swap[] = [];

  // onMount(async () => {
  //   console.log("meme")
  //   console.log(meme)
  //   try {
  //     await fetchSwaps(meme.Pool);
  //   } catch (error) {
  //     console.error("Error fetching swaps:", error);
  //   }
  // });

  swapsStore.subscribe((value) => {
    console.log("got swaps");
    swaps = value;
    console.log(swaps);
  });

  function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function formatTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return "Just now";
  }
</script>

<div class="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
  <h2 class="text-2xl font-bold mb-4">Swap Transactions</h2>
  <div class="space-y-4">
    {#each swaps as swap}
      <div class="bg-gray-50 p-4 rounded-md flex items-center justify-between">
        <div>
          <p class="font-semibold">
            {swap.IsBuy ? "Buy" : "Sell"}
            {#if swap.IsBuy}
              <ArrowUpRight
                class="inline-block text-green-500 ml-1"
                size={18}
              />
            {:else}
              <ArrowDownRight
                class="inline-block text-red-500 ml-1"
                size={18}
              />
            {/if}
          </p>
          {#if swap.Recipient}
            <p class="text-sm text-gray-600">
              Recipient: {formatAddress(swap.Recipient)}
            </p>
          {:else}
          <p class="text-sm text-gray-600">
            Dev: {formatAddress(meme.Creator)}
          </p>
          {/if}
        </div>
        <div class="text-right">
          {#if swap.IsBuy}
          <p class="font-medium">
            {formatNumber(swap.TokenB / DECIMALS)} wAr → {formatNumber(swap.TokenA / DECIMALS)} TokenA
          </p>
          {:else}
          <p class="font-medium">
            {formatNumber(swap.TokenA / DECIMALS)} TokenA → {formatNumber(swap.TokenB / DECIMALS)} wAr
          </p>
          {/if}
          <p class="text-xs text-gray-500">{formatTime(swap.Timestamp)}</p>
        </div>
      </div>
    {/each}
  </div>
</div>
