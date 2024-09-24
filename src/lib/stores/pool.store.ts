import type { Swap } from "$lib/models/Swap";
import { writable } from "svelte/store";

export const swapsStore = writable<Swap[]>([]);