// --- Password Gate ---
const ADMIN_HASH = "REPLACE_WITH_SHA256_HEX"; // generate once and paste here

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function requireAdmin() {
  if (sessionStorage.getItem("auth") === "ok") return true;
  const pwd = window.prompt("Enter admin password");
  if (!pwd) return false;
  const ok = (await sha256Hex(pwd)) === ADMIN_HASH;
  if (ok) sessionStorage.setItem("auth", "ok");
  return ok;
}
