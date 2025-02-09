// users-profile.store.ts
import { fetchProfile, fetchProfilesForUsersProfileMap } from "$lib/ao/relay";
import type { Profile } from "$lib/models/Profile";
import { get, writable, type Readable } from "svelte/store";

interface PaginatedProfileStore extends Readable<Map<string, Profile>> {
  fetchProfiles: (page: number, limit: number) => Promise<void>;
  get: (address: string) => Promise<Profile | undefined>;
  hasMore: Readable<boolean>;
  isLoading: Readable<boolean>;
}

const initUsersProfileMapStore = (): PaginatedProfileStore => {
  const { subscribe, set, update } = writable<Map<string, Profile>>(
    new Map<string, Profile>()
  );
  const { subscribe: subscribeToHasMore, set: setHasMore } =
    writable<boolean>(true);
  const { subscribe: subscribeToLoading, set: setLoading } =
    writable<boolean>(false);

  return {
    subscribe,
    hasMore: { subscribe: subscribeToHasMore },
    isLoading: { subscribe: subscribeToLoading },
    fetchProfiles: async (page: number, limit: number) => {
      try {
        setLoading(true);
        console.log(`Fetching profiles - page ${page}, limit ${limit}`);

        // Modify your fetchProfilesForUsersProfileMap to accept pagination params
        const profiles = await fetchProfilesForUsersProfileMap(page, limit);

        update((existingProfiles) => {
          // Merge new profiles with existing ones
          profiles.forEach((profile, address) => {
            existingProfiles.set(address, profile);
          });
          return existingProfiles;
        });

        // Update hasMore based on whether we received fewer items than requested
        setHasMore(profiles.size === limit);
      } catch (error) {
        console.error("Failed to fetch Users Profiles", error);
      } finally {
        setLoading(false);
      }
    },
    get: async (address: string): Promise<Profile | undefined> => {
      try {
        let profile = get({ subscribe }).get(address);
        if (profile) return profile;

        const fetchedProfile = await fetchProfile(address);
        update((map) => map.set(fetchedProfile.address, fetchedProfile));
        return fetchedProfile;
      } catch (error) {
        console.error("UsersProfileMapStore.get ", error);
      }
    },
  };
};

export const usersProfile = initUsersProfileMapStore();
