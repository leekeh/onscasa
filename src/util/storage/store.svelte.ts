export function createGenericStore<T>(key: string, initialValue?: T | null) {
  const cachedValue = localStorage.getItem(key);
  const initial = cachedValue ? JSON.parse(cachedValue) : initialValue;

  let state: T = $state(initial);
  function set(newState: T) {
    state = newState;
    localStorage.setItem(key, JSON.stringify(newState));
  }

  return {
    get state() {
      return state;
    },
    set,
  };
}

// TODO: This should be stored in a secure storage
export function createSecureStore<T>(key: string, initialValue?: T | null) {
  return createGenericStore(key, initialValue);
}
