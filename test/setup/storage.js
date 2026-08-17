// Node exposes a built-in `localStorage` global that stays undefined unless the
// runtime is started with --localstorage-file, and it shadows the one jsdom
// would otherwise provide. The site stores accounts and sessions in
// localStorage, so install a small in-memory Storage for tests.

function createStorage() {
  const data = new Map();

  return {
    get length() {
      return data.size;
    },
    key(index) {
      return Array.from(data.keys())[index] ?? null;
    },
    getItem(key) {
      const value = data.get(String(key));
      return value === undefined ? null : value;
    },
    setItem(key, value) {
      data.set(String(key), String(value));
    },
    removeItem(key) {
      data.delete(String(key));
    },
    clear() {
      data.clear();
    },
  };
}

for (const name of ["localStorage", "sessionStorage"]) {
  Object.defineProperty(globalThis, name, {
    value: createStorage(),
    configurable: true,
    writable: true,
  });
  if (typeof window !== "undefined" && window !== globalThis) {
    Object.defineProperty(window, name, {
      value: globalThis[name],
      configurable: true,
      writable: true,
    });
  }
}
