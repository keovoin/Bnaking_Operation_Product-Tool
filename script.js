// --- Password Gate ---
const ADMIN_HASH = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"; // generate once and paste here

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
function addRecord(ds, row) {
  const data = loadData(ds); // your existing getter
  data.push(row);
  saveData(ds, data);
}

function updateRecord(ds, index, updates) {
  const data = loadData(ds);
  Object.assign(data[index], updates);
  saveData(ds, data);
}

function deleteRecord(ds, index) {
  const data = loadData(ds);
  data.splice(index, 1);
  saveData(ds, data);
}
async function handleBulkUpload(ds, file) {
  if (!(await requireAdmin())) return;
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  const headers = lines[0].split(",");
  const expected = schemas[ds].headers; // define once
  const missing = expected.filter(h => !headers.includes(h));
  if (missing.length) {
    alert("Missing headers: " + missing.join(", "));
    return;
  }
  const rows = lines.slice(1).map(line => {
    const cols = line.split(",");
    const obj = {};
    headers.forEach((h, i) => obj[h] = cols[i] ?? "");
    return obj;
  });
  saveData(ds, rows);
  renderTable(ds); // reuse your existing renderer
}
function downloadTemplate(ds) {
  const headers = schemas[ds].headers;
  const csv = headers.join(",") + "\n";
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = ds + "_Template.csv";
  a.click();
}
