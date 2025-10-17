// src/utils/storage.js
export function getJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    // If parsing fails, remove the bad value and return null
    console.warn(`getJSON: failed to parse localStorage.${key}`, err);
    localStorage.removeItem(key);
    return null;
  }
}

export function setJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`setJSON: failed to stringify for localStorage.${key}`, err);
  }
}
