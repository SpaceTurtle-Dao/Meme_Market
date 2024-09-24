import { writable } from 'svelte/store';
import type { Event } from "$lib/models/Event"

let event1:Event = {
       id: "8f4e867bcf2c4a63944c2c04bbd28be3",
       pubkey: "a3b35fe237529f80798e4a5c4f6d12be",
       created_at: 1684312352,
       kind: 1,
       content: "Check out this cool video about Svelte!",
       tags: [
              ["title", "Svelte Introduction"],
              ["thumb", "https://arweave.net/Ov0Xea2kWa5GS1DCEmeF0aoct8rbJwDmizmTo9bQrtY"],
              ["published_at", "1684312352"],
              ["url", "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"],
              ["m", "video/mp4"],
              ["size", "1048576"],
              ["duration", "180"],
              ["dim", "1280x720"]
       ]
}

let event2:Event = {
       id: "9f8e762bc2d4b859443e1a05bbd29cf4",
       pubkey: "b3c45ae138739f80897f5b6d5e7e24cf",
       created_at: 1685312452,
       kind: 1,
       content: "A deep dive into web development trends.",
       tags: [
              ["title", "Web Development Trends 2024"],
              ["thumb", "https://arweave.net/Ive8YUyCU0FQEBSc8UjfTlQYFZY5s8t45gqsNf3uJMw"],
              ["published_at", "1685312452"],
              ["url", "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"],
              ["m", "video/mp4"],
              ["size", "2097152"],
              ["duration", "240"],
              ["dim", "1920x1080"]
       ]
}

interface EventStore {
       events: Event[];
       loading: boolean;
       error: string | null;
}

const initialState: EventStore = {
       events: [event1,event2],
       loading: false,
       error: null,
};


// Create the store
function createEventStore() {
       const { subscribe, set, update } = writable<EventStore>(initialState);

       return {
              subscribe,

              // Add a new event
              addEvent: (event: Event) => update(state => ({
                     ...state,
                     events: [...state.events, event]
              })),

              // Set multiple events (e.g., when fetching from a relay)
              setEvents: (events: Event[]) => update(state => ({
                     ...state,
                     events
              })),

              // Remove an event by its ID
              removeEvent: (id: string) => update(state => ({
                     ...state,
                     events: state.events.filter(event => event.id !== id)
              })),

              // Set loading state
              setLoading: (loading: boolean) => update(state => ({
                     ...state,
                     loading
              })),

              // Set error state
              setError: (error: string | null) => update(state => ({
                     ...state,
                     error
              })),

              // Clear all events
              clearEvents: () => update(state => ({
                     ...state,
                     events: []
              })),

              // Reset the store to its initial state
              reset: () => set(initialState)
       };
}

// Export the store
export const eventStore = createEventStore();