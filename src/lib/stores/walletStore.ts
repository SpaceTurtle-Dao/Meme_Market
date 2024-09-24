import { writable } from 'svelte/store';

export const walletAddress = writable('');

//@ts-ignore
export const setWalletAddress = (address) => {
    walletAddress.set(address);
};

export const clearWalletAddress = () => {
    walletAddress.set('');
};