const API_BASE_URL =
  (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) ||
  "http://localhost:8080";

const els = {
  addForm: document.getElementById("addForm"),
  updateForm: document.getElementById("updateForm"),
  refreshBtn: document.getElementById("refreshBtn"),
  tbody: document.getElementById("entriesTbody"),
  status: document.getElementById("status"),
  search: document.getElementById("searchInput"),
};

let cache = [];

function setStatus(msg, type = "info") {
  els.status.textContent = msg || "";
  els.status.style.color = type === "error" ? "#ff5c5c" : "#9bb0c6";
}

function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

function mapEntry(raw) {
  // Normalize possible backend field names
  return {
    id: raw.id || raw._id || raw.batchId || "",
    batchName: raw.batchName || raw.batch || raw.batch_title || "",
    courseName: raw.courseName || raw.course || raw.course_title || "",
    courseFees: raw.courseFees ?? raw.fees ?? raw.courseFee ?? "",
    raw,
  };
}

async function request(path, options = {}) {
  const res = await fetch(apiUrl(path), {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  // Try to read JSON, otherwise text
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg = data && data.message ? data.message : `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

function renderRows(list) {
  if (!list.length) {
    els.tbody.innerHTML = `<tr><td colspan="5" class="muted">No entries found.</td></tr>`;
    return;
  }

  els.tbody.innerHTML = list
    .map((e) => {
      const fees = e.courseFees === "" ? "" : String(e.courseFees);
      return `
      <tr>
        <td><code>${escapeHtml(e.id)}</code></td>
        <td>${escapeHtml(e.batchName)}</td>
        <td>${escapeHtml(e.courseName)}</td>
        <td>${escapeHtml(fees)}</td>
        <td class="row">
          <button class="secondary" data-action="fill" data-id="${escapeAttr(
            e.id
          )}">Fill Update</button>
          <button class="danger" data-action="delete" data-id="${escapeAttr(
            e.id
          )}">Delete</button>
        </td>
      </tr>
    `;
    })
    .join("");
}

function applySearch() {
  const q = (els.search.value || "").trim().toLowerCase();
  if (!q) return renderRows(cache);
  const filtered = cache.filter(
    (e) =>
      e.id.toLowerCase().includes(q) ||
      e.batchName.toLowerCase().includes(q) ||
      e.courseName.toLowerCase().includes(q) ||
      String(e.courseFees).toLowerCase().includes(q)
  );
  renderRows(filtered);
}

async function loadEntries() {
  setStatus("Loading entries...");
  els.tbody.innerHTML = `<tr><td colspan="5" class="muted">Loading...</td></tr>`;
  try {
    const data = await request("/getbatchentries", { method: "GET" });
    const arr = Array.isArray(data) ? data : data?.data || data?.result || [];
    cache = arr.map(mapEntry);
    applySearch();
    setStatus(`Loaded ${cache.length} entries.`);
  } catch (err) {
    els.tbody.innerHTML = `<tr><td colspan="5" class="muted">Failed to load entries.</td></tr>`;
    setStatus(err.message, "error");
  }
}

async function addEntry(payload) {
  return request("/addbatchentry", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function deleteEntry(id) {
  return request(`/deletebatchentry/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

async function updateEntry(id, payload) {
  return request(`/updatebatchentry/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// Events
els.refreshBtn.addEventListener("click", loadEntries);

els.search.addEventListener("input", applySearch);

els.tbody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const action = btn.getAttribute("data-action");
  const id = btn.getAttribute("data-id");
  if (!id) return;

  if (action === "delete") {
    const ok = confirm("Delete this entry?");
    if (!ok) return;
    try {
      btn.disabled = true;
      setStatus("Deleting...");
      await deleteEntry(id);
      setStatus("Deleted.");
      await loadEntries();
    } catch (err) {
      setStatus(err.message, "error");
    } finally {
      btn.disabled = false;
    }
  }

  if (action === "fill") {
    // Fill update form
    els.updateForm.elements["id"].value = id;
    const found = cache.find((x) => x.id === id);
    if (found) {
      els.updateForm.elements["batchName"].value = found.batchName;
      els.updateForm.elements["courseName"].value = found.courseName;
      els.updateForm.elements["courseFees"].value = found.courseFees;
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }
});

els.addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(els.addForm);

  // Common payload shape - may adjust to API.md if different
  const payload = {
    batchName: fd.get("batchName"),
    courseName: fd.get("courseName"),
    courseFees: Number(fd.get("courseFees")),
  };

  try {
    setStatus("Adding...");
    await addEntry(payload);
    setStatus("Added.");
    els.addForm.reset();
    await loadEntries();
  } catch (err) {
    setStatus(err.message, "error");
  }
});

els.updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(els.updateForm);

  const id = String(fd.get("id") || "").trim();
  if (!id) return setStatus("ID is required for update.", "error");

  // Send only provided fields
  const payload = {};
  const b = String(fd.get("batchName") || "").trim();
  const c = String(fd.get("courseName") || "").trim();
  const f = String(fd.get("courseFees") || "").trim();

  if (b) payload.batchName = b;
  if (c) payload.courseName = c;
  if (f) payload.courseFees = Number(f);

  try {
    setStatus("Updating...");
    await updateEntry(id, payload);
    setStatus("Updated.");
    await loadEntries();
  } catch (err) {
    setStatus(err.message, "error");
  }
});

// Helpers (basic escaping)
function escapeHtml(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[m])
  );
}
function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, "&quot;");
}

// init
loadEntries();
