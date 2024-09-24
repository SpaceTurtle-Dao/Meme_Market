// event.ts
import { writable } from 'svelte/store';
export interface Event {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: Array<Array<string>>;
  content: string;
}

export interface EventRequest {
  kind: number;
  tags: Array<Array<string>>;
  content: string;
}

export type EventsStoresData = Array<Event>

const mockData: EventsStoresData = [
  {
    id: '1',
    pubkey: 'user1',
    created_at: 1726767860000,
    kind: 1,
    tags: [['Action', 'EVENT']],
    content: 'New event created: Conference on Svelte Development'
  },
  {
    id: '2',
    pubkey: 'user2',
    created_at: 1726767860000,
    kind: 1,
    tags: [['Action', 'CLOSE']],
    content: 'Event closed: Workshop on Reactive Programming'
  },
  {
    id: '3',
    pubkey: 'user3',
    created_at: 1726767860000,
    kind: 1,
    tags: [['Action', 'Cost']],
    content: 'Cost updated: $50 for early bird tickets'
  },
  {
    id: '4',
    pubkey: 'user4',
    created_at: 1726767860000,
    kind: 1,
    tags: [['Action', 'Token']],
    content: 'New token created: SVLT'
  },
  {
    id: '5',
    pubkey: 'user5',
    created_at: 1726767860000,
    kind: 1,
    tags: [['Action', 'Profile']],
    content: 'Profile updated: John Doe, Senior Svelte Developer'
  },
  {
    id: '6',
    pubkey: 'user6',
    created_at: 1726767860000,
    kind: 1,
    tags: [['Action', 'Feed']],
    content: 'New feed item: Latest Svelte tips and tricks'
  },
  {
    id: '7',
    pubkey: 'user7',
    created_at: 1726767860000,
    kind: 1,
    tags: [['Action', 'FetchFeed']],
    content: 'Fetching feed: Svelte community updates'
  },
  {
    id: '8',
    pubkey: 'user8',
    created_at: 1726767860000,
    kind: 1,
    tags: [['Action', 'Info']],
    content: 'Info update: New Svelte version 4.0 released'
  },
  {
    id: '9',
    pubkey: 'user9',
    created_at: 1726767860000,
    kind: 1,
    tags: [['Action', 'Withdraw']],
    content: 'Withdrawal processed: 100 SVLT tokens'
  },
  {
    id: '10',
    pubkey: 'user10',
    created_at: 1726767860000,
    kind: 1,
    tags: [['Action', 'Credit-Notice']],
    content: 'Credit notice: 50 SVLT tokens added to your account'
  }
];

export const eventsStore = writable<EventsStoresData>(mockData);


// export enum EventType {
//   TEXT_NOTE = 1,
//   REACTION = 7,
//   // Add more event types as needed
// }

// export interface BaseEventData {
//   id: string;
//   pubkey: string;
//   created_at: string;
//   kind: EventType;
//   tags: string[][];
//   content: string;
// }

// export interface TextNoteEvent extends BaseEventData {
//   kind: EventType.TEXT_NOTE;
// }

// export interface ReactionEvent extends BaseEventData {
//   kind: EventType.REACTION;
// }

// export type EventData = TextNoteEvent | ReactionEvent;

// export class Event {
//   readonly id: string;
//   readonly pubkey: string;
//   readonly created_at: Date;
//   readonly kind: EventType;
//   readonly tags: string[][];
//   readonly content: string;

//   constructor(data: EventData) {
//     this.id = data.id;
//     this.pubkey = data.pubkey;
//     this.created_at = new Date(data.created_at);
//     this.kind = data.kind;
//     this.tags = data.tags;
//     this.content = data.content;
//   }
// }

// export interface ProcessedTextNoteEvent extends Event {
//   kind: EventType.TEXT_NOTE;
//   getText: () => string;
// }

// export interface ProcessedReactionEvent extends Event {
//   kind: EventType.REACTION;
//   getReactionType: () => string;
//   getReferencedEvent: () => string | undefined;
// }

// export type ProcessedEvent = ProcessedTextNoteEvent | ProcessedReactionEvent;

// export function processEvent(event: Event): ProcessedEvent {
//   switch (event.kind) {
//     case EventType.TEXT_NOTE:
//       return {
//         ...event,
//         kind: EventType.TEXT_NOTE,
//         getText: () => event.content,
//       };
//     case EventType.REACTION:
//       return {
//         ...event,
//         kind: EventType.REACTION,
//         getReactionType: () => event.content,
//         getReferencedEvent: () => event.tags.find(tag => tag[0] === 'e')?.[1],
//       };
//     default:
//       throw new Error(`Unknown event type: ${event.kind}`);
//   }
// }
// interface EventStore {
//   subscribe: typeof writable<Event[]>['subscribe'];
//   setEvents: (events: EventData[]) => void;
//   addEvents: (events: EventData[]) => void;
//   removeEvent: (id: string) => void;
//   clearEvents: () => void;
// }

// function createEventStore(): EventStore {
//   const { subscribe, set, update } = writable<Event[]>([]);

//   return {
//     subscribe,
//     setEvents: (eventDataArray: EventData[]) => {
//       const events = eventDataArray.map(data => new Event(data));
//       set(events);
//     },
//     addEvents: (eventDataArray: EventData[]) => {
//       const newEvents = eventDataArray.map(data => new Event(data));
//       update(events => [...events, ...newEvents]);
//     },
//     removeEvent: (id: string) => {
//       update(events => events.filter(event => event.id !== id));
//     },
//     clearEvents: () => {
//       set([]);
//     }
//   };
// }

// export const eventStore = createEventStore();

// // Function to process an array of events
// export function processEvents(events: Event[]): ProcessedEvent[] {
//   return events.map(processEvent);
// }