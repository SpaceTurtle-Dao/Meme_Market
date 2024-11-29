<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
   import { Button } from "$lib/components/ui/button/index.js";
   import { MessageCircle, Repeat2, Heart, Share } from "lucide-svelte";
   import {
   profileFromEvent,
   type Profile,
   type UserInfo,
    } from "$lib/models/Profile";
   import type { Event } from "$lib/models/Event";
   import Nip92 from "$lib/handlers/NIP92.svelte";
   import EventList from "./EventList.svelte";
   
   let _profileJson: Profile = {
   name: "Charazard",
   about: "A fire pokemon",
   picture: "-RmetHQufxWySiJact95a9ON6pb-0s56dElmyJusGwQ",
   display_name: "Char",
   website: "https://www.ao.link/",
   banner: "-RmetHQufxWySiJact95a9ON6pb-0s56dElmyJusGwQ",
   bot: false,
    };
   
   let _profile: Event = {
   id: "1",
   pubkey: "vd97vAnBhKD7zGNDTjTgl5N0WKLcl92MO8Ob3T0w6IM",
   created_at: 1726767860000,
   kind: 0,
   tags: [[]],
   content: JSON.stringify(_profileJson),
    };
   
   let _userInfo: UserInfo = {
   Token: "WPyLgOqELOyN_BoTNdeEMZp5sz3RxDL19IGcs3A9IPc",
   Events: 1,
   Profile: _profile,
   SubscriptionCost: 1000000,
   FeedCost: 1000000,
   Subs: 0,
   Subscriptions: 0,
    };
   
   export let user: UserInfo = _userInfo;
   export let event: Event;
   export let originalEvent: Event;
   
   function getActionFromTags(tags: string[][]): string {
   const actionTag = tags.find((tag) => tag[0] === "Action");
   return actionTag ? actionTag[1] : "Unknown";
    }
   
   function formatDate(dateString: number): string {
   return new Date(dateString).toLocaleTimeString();
    }
   
   function toUrl(tx: string) {
   return (
   "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
   tx
    );
    }
   </script>
   
   <div class="pl-5 pt-5 pr-5">
     <div class="flex flex-col">
       <div class="flex justify-between mb-2">
         <div class="flex space-x-2">
           <Avatar.Root class="hidden h-9 w-9 sm:flex">
             {#if profileFromEvent(user.Profile).name}
               <Avatar.Image
                 src={toUrl(profileFromEvent(user.Profile).picture)}
                 alt="Avatar"
               />
             {/if}
             <Avatar.Fallback>OM</Avatar.Fallback>
           </Avatar.Root>
           <div class="flex space-x-1">
             <p class="font-medium text-primary">
               {profileFromEvent(user.Profile).name}
             </p>
             <p class="text-gray-500">
               {formatDate(user.Profile.created_at)}
             </p>
           </div>
         </div>
       </div>
   
       {#if event.kind == 6}
         <div class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
           <Repeat2 size={16} />
           <span>Reposted</span>
         </div>
         <div>
           <Nip92 {event} />
         </div>
         <div class="  relative">
           <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-white rounded-full"></div>
           
             <Nip92 event={originalEvent} />
         </div>
       {/if}
   
       <div class="flex justify-between mt-3">
         <Button variant="link" size="icon" class="text-primary">
           <MessageCircle />
         </Button>
         <Button variant="link" size="icon" class="text-primary">
           <Repeat2 />
         </Button>
         <Button variant="link" size="icon" class="text-primary">
           <Heart />
         </Button>
         <Button variant="link" size="icon" class="text-primary">
           <Share />
         </Button>
       </div>
     </div>
   </div>
   
   <style>
     /* Add any additional custom styles here if needed */
   </style>