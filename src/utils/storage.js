// src/utils/storage.js
export function getJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`getJSON: failed to parse ${key}`, err);
    localStorage.removeItem(key);
    return null;
  }
}

export function setJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`setJSON: failed for ${key}`, err);
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`remove: failed for ${key}`, err);
  }
}
