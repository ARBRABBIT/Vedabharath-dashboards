export type AdminRole = "warehouse" | "super";

function storageKey(role: AdminRole) {
  return `vedabharath.defaultPasswordUpdated.${role}`;
}

export function hasUpdatedDefaultPassword(role: AdminRole) {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(storageKey(role)) === "true";
}

export function markDefaultPasswordUpdated(role: AdminRole) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(role), "true");
}
