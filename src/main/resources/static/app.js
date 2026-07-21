const API_URL = "https://edutrack-3426.onrender.com";

// --- GLOBAL STATE (The Fix for 'Object' errors) ---
let currentBatches = []; 

const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num);
};

// --- 1. Fetch & Store Data ---
async function fetchBatches() {
    const list = document.getElementById("batchList");
    
    try {
        const response = await fetch(`${API_URL}/batches`);
        
        // Handle Empty List
        if (response.status === 404) {
            currentBatches = [];
            renderTable();
            return;
        }

        const data = await response.json();
        
        // Store data globally so we don't need to pass IDs in HTML
        currentBatches = Array.isArray(data) ? data : [];
        renderTable();

    } catch (error) {
        console.error("System Error:", error);
        list.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#ff4d4d; padding:20px;">// SYSTEM OFFLINE //</td></tr>`;
    }
}

// --- 2. Render Table using Global Data ---
function renderTable() {
    const list = document.getElementById("batchList");
    list.innerHTML = "";

    if (currentBatches.length === 0) {
        list.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#8fa3bf; padding:20px;">// NO DATA RECORDS //</td></tr>`;
        return;
    }

    currentBatches.forEach((batch, index) => {
        const row = document.createElement("tr");

        // Try to handle ID display safely
        let displayId = "UNK";
        if (batch.id) {
            // If it's a string, use it. If it's an object, try to stringify or just show 'OBJ'
            displayId = (typeof batch.id === 'string') ? batch.id.substring(0, 5) : "OBJ";
        }

        // Pass the INDEX (0, 1, 2...) instead of the ID to avoid breaking HTML
        row.innerHTML = `
            <td style="font-family:monospace; color:#8fa3bf;">0x${index} [${displayId}]</td>
            <td style="font-weight:600;">${batch.name}</td>
            <td style="font-family:monospace;">${formatCurrency(batch.fees)}</td>
            <td style="text-align: right;">
                <button class="action-btn edit-btn" onclick="startEdit(${index})">EDIT</button>
                <button class="action-btn del-btn" onclick="deleteBatch(${index})">DEL</button>
            </td>
        `;
        list.appendChild(row);
    });
}

// --- 3. Handle Form (Create / Update) ---
document.getElementById("batchForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.innerText = "PROCESSING...";

    const index = document.getElementById("editIndex").value; // Get Index
    const name = document.getElementById("batchName").value;
    const fees = document.getElementById("fees").value;
    const payload = { name: name, fees: parseInt(fees) };

    try {
        let response;
        if (index !== "") {
            // --- UPDATE MODE ---
            // Get the real ID from our global array
            const realId = currentBatches[index].id;
            
            response = await fetch(`${API_URL}/batches/id/${realId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        } else {
            // --- CREATE MODE ---
            response = await fetch(`${API_URL}/batches`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        }

        if (response.ok) {
            cancelEdit();
            fetchBatches();
        } else {
            console.log("Server Error:", response);
            alert("Error: " + response.status);
        }
    } catch (error) {
        alert("Connection failed.");
    } finally {
        submitBtn.innerText = index !== "" ? "UPDATE PROTOCOL" : "INITIALIZE PROTOCOL";
    }
});

// --- 4. Delete ---
async function deleteBatch(index) {
    if (!confirm("CONFIRM DATA DELETION?")) return;

    // Retrieve the real ID object/string from memory
    const realId = currentBatches[index].id;
    
    // DEBUG: Check console to see what ID we are sending
    console.log("Attempting to delete ID:", realId);

    try {
        const response = await fetch(`${API_URL}/batches/id/${realId}`, {
            method: "DELETE"
        });

        if (response.ok || response.status === 204) {
            fetchBatches();
        } else {
            alert("Delete failed. Server status: " + response.status);
        }
    } catch (error) {
        console.error("Delete Error:", error);
    }
}

// --- 5. Edit Helpers ---
function startEdit(index) {
    const batch = currentBatches[index];
    
    document.getElementById("editIndex").value = index; // Store index, not ID
    document.getElementById("batchName").value = batch.name;
    document.getElementById("fees").value = batch.fees;

    // UI Updates
    document.getElementById("formTitle").innerText = ":: MODIFY ENTRY";
    document.getElementById("submitBtn").innerText = "UPDATE PROTOCOL";
    document.getElementById("submitBtn").style.background = "#ffffff";
    document.getElementById("submitBtn").style.color = "#0f1c2e";
    document.getElementById("cancelBtn").classList.remove("hidden");
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
    document.getElementById("batchForm").reset();
    document.getElementById("editIndex").value = "";

    document.getElementById("formTitle").innerText = ":: NEW ENTRY";
    document.getElementById("submitBtn").innerText = "INITIALIZE PROTOCOL";
    document.getElementById("submitBtn").style.background = ""; // Reset color
    document.getElementById("submitBtn").style.color = "";
    document.getElementById("cancelBtn").classList.add("hidden");
}

// Start
fetchBatches();
