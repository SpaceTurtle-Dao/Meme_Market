<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Coins } from "lucide-svelte";

  export let name: string = "";
  export let owners: number = 0;
  export let price: number = 0;
  export let quantity: number = 0;
  export let maxQuantity: number = 0;
  export let imageUrl: string = "";

  function handleBuy() {
    // Implement buy functionality
    console.log("Buy clicked for:", name);
  }
</script>

<Card class="w-full bg-background-800 shadow-lg border border-border">
  <CardHeader class="space-y-1">
    <div class="flex items-center justify-between">
      <CardTitle class="text-lg font-medium">{name}</CardTitle>
      <span class="text-sm text-muted-foreground">{owners} owners</span>
    </div>
  </CardHeader>
  <CardContent class="space-y-4">
    <div class="flex items-center justify-center">
      {#if imageUrl}
        <img
          src={imageUrl}
          alt={name}
          class="w-24 h-24 object-contain rounded-lg"
        />
      {:else}
        <div class="w-24 h-24 bg-background-700 rounded-lg flex items-center justify-center">
          <Coins class="w-12 h-12 text-primary opacity-50" />
        </div>
      {/if}
    </div>

    <div class="space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-muted-foreground">Price</span>
        <span class="font-medium">{price} Ⓝ</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-muted-foreground">Available</span>
        <span class="font-medium">{quantity}/{maxQuantity}</span>
      </div>
    </div>

    <Button 
      variant="default" 
      class="w-full bg-primary hover:bg-primary/90"
      on:click={handleBuy}
    >
      Buy Now
    </Button>
  </CardContent>
</Card>