<script>
  import { link } from "svelte-spa-router";
  import CreatePostModal from "$lib/components/posts/CreatePost.svelte";
  import LowerProfile from "$lib/components/views/profile/LowerProfile.svelte";
  import Logo from "../../../../assets/Logo2.png";
  import { Home as HomeIcon, User, MoreHorizontal, Mail, Search } from "lucide-svelte";
  import { currentUser } from "$lib/stores/current-user.store";
  import { isMobile } from "$lib/stores/is-mobile.store";
  import { addressStore } from "$lib/stores/address.store";
  import { Loader } from "lucide-svelte";
  import ButtonWithLoader from "$lib/components/ButtonWithLoader/ButtonWithLoader.svelte";

  let loader = false;

  if ($addressStore.address) {
  }

  let menuItems = [
    { icon: HomeIcon, label: "Home", href: "/feed" },
    { icon: User, label: "Profile", href: "/feed" },
    { icon: Mail, label: "Messages", href: "/messages" },
  ];

  function menuItems2() {
    return [
      { icon: HomeIcon, label: "Home", href: "/feed" },
      {
        icon: User,
        label: "Profile",
        href: `/profile/${$addressStore.address}`,
      },
      { icon: Mail, label: "Messages", href: "/messages" },
    ];
  }

  // width 259 plus widthpadding 8
</script>

{#if !$isMobile}
  <div class="flex p-4 lg:w-1/4 justify-start lg:justify-end">
    <div class="space-y-8 p-4">
      <nav>
        <ul class="space-y-3 overflow-hidden flex flex-col">
          <li>
            <img class="w-10 h-10" src={Logo} alt="Logo" />
          </li>
          {#if $addressStore.address}
            {#each menuItems2() as item}
              <li>
                <a
                  href={item.href}
                  use:link
                  class="flex items-center p-2 px-2 rounded-full hover:bg-background-700 transition-colors duration-200"
                >
                  <svelte:component
                    this={item.icon}
                    class="w-6 h-6 mr-4 text-primary"
                  />
                  <span class="text-lg font-medium text-primary"
                    >{item.label}</span
                  >
                </a>
              </li>
            {/each}
          {:else}
            {#each menuItems as item}
              <li>
                <a
                  href={item.href}
                  use:link
                  class="flex items-center p-2 px-2 rounded-full hover:bg-background-700 transition-colors duration-200"
                >
                  <svelte:component
                    this={item.icon}
                    class="w-6 h-6 mr-4 text-primary"
                  />
                  <span class="text-lg font-medium text-primary"
                    >{item.label}</span
                  >
                </a>
              </li>
            {/each}
          {/if}
          <li>
            <div
              class="flex items-center p-2 px-5 rounded-full hover:bg-background-700 transition-colors duration-200"
            >
              <MoreHorizontal class="w-6 h-6 mr-4 text-primary" />
              <span class="text-lg font-medium text-primary">More</span>
            </div>
            <!-- </button> -->
          </li>
        </ul>
      </nav>

      {#if $addressStore.address}
        <CreatePostModal />
      {:else}
        <div class="mt-8 flex flex-col items-center justify-center">
          {#if loader}
            <Loader class="animate-spin w-12 h-12" />
          {:else}
            <ButtonWithLoader
              {loader}
              class="w-full"
              on:click={async () => {
                loader = true;
                await addressStore.connectWallet();
                loader = false;
              }}>Connect Wallet</ButtonWithLoader
            >
          {/if}
        </div>
      {/if}

      <div class="p-4">
        <LowerProfile />
      </div>
    </div>
  </div>
{/if}
