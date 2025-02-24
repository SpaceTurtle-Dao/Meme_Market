import { fetchEvents, fetchFollowList, fetchProfile } from "$lib/ao/relay";
import type { Profile } from "$lib/models/Profile";
import { get, writable, type Readable } from "svelte/store";

interface ProfileService extends Readable<Map<string, any>> {
  get: (address: string) => Promise<Profile>;
}

const service = (): ProfileService => {
  const { subscribe, set } = writable<Map<string, any>>(
    new Map<string, any>()
  );
  return {
    subscribe,
    get: async (address: string) => {
      let profiles = get(profileService);
      if (profiles.has(address)) {
        fetchProfile(address).then((profile) => {
          fetchFollowList(address).then((followList) => {
            profile.followList = followList
            profiles.set(profile.address, profile)
            set(profiles)
          })
        })
        return profiles.get(address)
      } else {
        try {
          let profile = await fetchProfile(address)
          profile.followList = await fetchFollowList(address)
          profiles.set(profile.address, profile)
          set(profiles)
          return profile
        } catch (error) {
          console.log(error)
          let profile: Profile = {
            name: "Anonymous",
            about: undefined,
            picture: undefined,
            display_name: "Anonymous",
            address: address,
            followList: [],
            website: undefined,
            banner: undefined,
            bot: undefined,
            created_at: 1740359833,
            updated_at: undefined
          }
          profiles.set(profile.address, profile)
          set(profiles)
          return profile
          //throw (error)
        }
      }
    },
  };
};

export const profileService = service();

