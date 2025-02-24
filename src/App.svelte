<script lang="ts">
  import "./app.css";
  import { onMount, tick } from "svelte";
  import Router, { location, push, replace } from "svelte-spa-router";
  import LandingPage from "$lib/components/views/landingPage/LandingPage.svelte";
  import Spinner from "$lib/components/spinners/Spinner.svelte";
  import Middle from "$lib/components/views/main/MiddleView.svelte";
  import Left from "$lib/components/views/main/LeftView.svelte";
  import Right from "$lib/components/views/main/RightView.svelte";
  import SignUp from "./lib/components/views/signup/SignUp.svelte";
  import { addressStore } from "$lib/stores/address.store";
  import Feed from "$lib/components/views/feed/Feed.svelte";
  import Profile from "$lib/components/views/profile/Profile.svelte";
  import IndividualPost from "$lib/components/posts/IndividualPost.svelte";
  import MessagesPage from "$lib/components/Messages/MessagesPage.svelte";
  import MobileTopView from "$lib/components/views/main/MobileTopView.svelte";
  import MobileBottomNavBar from "$lib/components/views/main/MobileBottomNavBar.svelte";
  import { postService } from "$lib/services/PostService";
  import { profileService } from "$lib/services/ProfileService";
  import PublicProfile from "$lib/components/views/profile/PublicProfile.svelte";
  import Search from "$lib/components/search/Search.svelte";

  let isLoading = false;
  //let isFollowListAlreadyFetched = false;
  //let initialRoute = window.location.hash.slice(1) || "/";

  const routes = {
    "/": Feed,
    "/feed": Feed,
    "/search": Search,
    "/profile": Profile,
    "/messages": MessagesPage,
    "/profile/:address": Profile,
    "/public/profile/:address": PublicProfile,
    "/post/:id/:user": IndividualPost,
    "/signup": SignUp,
    "/test": MobileTopView,
  };

  onMount(async () => {
    console.log("getting connected status")
    let isConnected = await addressStore.isConnected()
    console.log("got status")
    if (isConnected && $addressStore.address){
      profileService.get($addressStore.address)
    }
  });
</script>

<div class="bg-background">
  <MobileTopView />
  <div class="flex w-full bg-background justify-center">
    <Left />
    <Middle>
      <Router {routes} />
    </Middle>
    <Right />
  </div>
  <MobileBottomNavBar />
</div>