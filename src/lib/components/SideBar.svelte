<script lang="ts">
  import { Router, Link, Route } from "svelte-routing";
  import {
    Home,
    Search,
    Bell,
    Mail,
    Bookmark,
    Users,
    User,
    MoreHorizontal,
    Plus,
  } from "lucide-svelte";
  import UserProfile from "./views/profile/UserProfile.svelte";
  import Feed from "$lib/Feed.svelte";
  import { currentUser } from "$lib/stores/profile.store";
  import { profileFromEvent, type Profile } from "$lib/models/Profile";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";

  export let url = "";

  let profile: Profile;

  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Explore", href: "/explore" },
    // { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: User, label: "Profile", href: "/UserProfile" },
  ];

  function toUrl(tx: string) {
    return (
      "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
      tx
    );
  }

  currentUser.subscribe((value) => {
    profile = profileFromEvent(value.Profile);
  });
</script>

<Router {url}>
  <div class="flex h-screen">
    <aside
      class="w-1/4 bg-background shadow-lg flex flex-col justify-between p-4"
    >
      <div class="space-y-4">
        <!-- secondarysecondary -->
        <div class="p-2">
          <svg
            class="w-8 h-8 text-secondary-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M23 3a10.9 10.9 secondary 3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
            ></path>
          </svg>
        </div>
        <nav>
          <ul class="space-y-2">
            {#each menuItems as item}
              <li>
                secondary
                <Link
                  to={item.href}
                  class="flex items-center p-2 rounded-full hover:bg-secondary-100 transition-colors duration-200"
                >
                  <svelte:component
                    this={item.icon}
                    class="w-6 h-6 mr-4 text-secondary-500"
                  />
                  <span class="text-lg font-medium text-gray-700"
                    >{item.label}</span
                  >
                </Link>
              </li>
            {/each}
            <li>
              <button
                class="flex items-center p-2 rounded-full hover:bg-secondary-100 transition-colors duration-200"
              >
                <MoreHorizontal class="w-6 h-6 mr-4 text-secondary-500" />
                <span class="text-lg font-medium text-gray-700">More</span>
              </button>
            </li>
          </ul>
        </nav>
        <button
          class="w-full bg-secondary-500 text-white rounded-full py-3 font-bold text-lg hover:bg-purple-600 transition-colors duration-200 flex items-center justify-center"
        >
          <Plus class="w-5 h-5 mr-2" />
          Post
        </button>
      </div>
      <div class="p-4">
        <div class="bg-gradient-to-r from-secondary-500 to-pink-500 p-6">
          <div class="flex items-center space-x-4">
            {#if profile.picture}
              <Avatar class="h-24 w-24 ring-4 ring-white">
                <AvatarImage src={toUrl(profile.picture)} alt={profile.name} />
                <AvatarFallback>{profile.name}</AvatarFallback>
              </Avatar>
            {/if}
            <div>
              <h1 class="text-3xl font-extrabold text-white">
                {profile.name}
              </h1>
              <p class="text-secondary-200">@{profile.name}</p>
              <p class="mt-2 text-white">{"profile.bio"}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <main class="flex-1 p-4 bg-[#FFF0F5] overflow-auto">
      <Route path="/" component={Feed} />
      <!-- <Route path="/explore" component={ExploreComponent} /> 
      <Route path="/notifications" component={NotificationsComponent} /> -->
      <Route path="/UserProfile" component={UserProfile} />
    </main>
  </div>
</Router>
