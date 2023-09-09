import { writable } from "svelte/store";

function createStore<T>(key: string, initialValue?: T | null) {
  // Get the value from localStorage if it exists
  const cachedValue = localStorage.getItem(key);
  const initial = cachedValue ? JSON.parse(cachedValue) : initialValue;

  // Create a writable store with the initial value
  const { subscribe, set, update } = writable<T>(initial);

  // Update localStorage whenever the store value changes
  subscribe((value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
  });

  // Return the store methods
  return {
    subscribe,
    set,
    update,
  };
}

// This should be stored in a secure storage
export const storedAccessToken = createStore<string>("access_token", null);
export const storedRefreshToken = createStore<string>("refresh_token", null);
