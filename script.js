let editIndex = -1;
let imagebase64 = "";
let showFavoritesOnly = false;

const form = document.getElementById("tripForm");
const tripContainer = document.getElementById("tripContainer");
const tripImage = document.getElementById("tripImage");
const imagePreview = document.getElementById("imagePreview");

let trips = [];


/* ================================
   LOAD TRIPS
================================ */

async function loadTrips() {
    try {
        const response = await fetch("https://wanderlog-1sta.onrender.com/api/trips");

        if (!response.ok) {
            throw new Error("Failed to load trips");
        }

        trips = await response.json();

        displayTrips();

    } catch (error) {
        console.error("Error loading trips:", error);

        tripContainer.innerHTML = `
            <div class="empty-state">
                <h3>⚠️ Unable to Load Trips</h3>
                <p>Please make sure the Wanderlog backend is running.</p>
            </div>
        `;
    }
}

loadTrips();


/* ================================
   ADD / EDIT TRIP
================================ */

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const date = document.getElementById("date").value;
    const notes = document.getElementById("notes").value.trim();

    if (!title || !destination || !date) {
        alert("Please fill all required fields.");
        return;
    }


    /* ---------- ADD TRIP ---------- */

    if (editIndex === -1) {

        try {

            const response = await fetch(
                "https://wanderlog-1sta.onrender.com/api/trips",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title,
                        destination,
                        date,
                        notes,
                        image: imagebase64
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert("Trip added successfully!");

                form.reset();

                imagebase64 = "";

                imagePreview.src = "";
                imagePreview.style.display = "none";

                await loadTrips();

            } else {

                alert(data.message || "Failed to add trip");
            }

        } catch (error) {

            console.error("Add error:", error);

            alert("Backend se connection nahi ho pa raha.");
        }

        return;
    }


    /* ---------- UPDATE TRIP ---------- */

    const tripId = trips[editIndex].id;

    try {

        const response = await fetch(
            `https://wanderlog-1sta.onrender.com/api/trips/${tripId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    destination,
                    date,
                    notes,
                    image: imagebase64
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert("Trip updated successfully!");

            editIndex = -1;

            form.reset();

            imagebase64 = "";

            imagePreview.src = "";
            imagePreview.style.display = "none";

            await loadTrips();

        } else {

            alert(data.message || "Failed to update trip");
        }

    } catch (error) {

        console.error("Update error:", error);

        alert("Backend se connection nahi ho pa raha.");
    }
});


/* ================================
   DISPLAY TRIPS
================================ */

function displayTrips() {

    if (trips.length === 0) {

        tripContainer.innerHTML = `
            <div class="empty-state">
                <h3>🧳 No Trips Yet</h3>
                <p>Add your first trip using the form above.</p>
            </div>
        `;

        updateStatistics();
        return;
    }

    tripContainer.innerHTML = "";

    trips.forEach((trip, index) => {

        tripContainer.innerHTML += `
            <div class="trip-card">

                ${
                    trip.image
                        ? `<img src="${trip.image}" 
                            alt="Trip Image" 
                            class="trip-image">`
                        : ""
                }

                <h3>✈️ ${trip.title}</h3>

                <p>
                    📍 <strong>${trip.destination}</strong>
                </p>

                <p class="date">
                    📅 ${trip.date}
                </p>

                <p>
                    ${trip.notes || ""}
                </p>

                <button onclick="toggleFavorite(${index})">
                    ${Number(trip.favorite) === 1
                        ? "⭐ Favorited"
                        : "☆ Favorite"}
                </button>

                <button onclick="editTrip(${index})">
                    ✏️ Edit
                </button>

                <button onclick="viewTrip(${index})">
                    👁 View Details
                </button>

                <button onclick="deleteTrip(${index})">
                    🗑 Delete
                </button>

            </div>
        `;
    });

    updateStatistics();
}


/* ================================
   DELETE TRIP
================================ */

async function deleteTrip(index) {

    if (!confirm("Are you sure you want to delete this trip?")) {
        return;
    }

    const tripId = trips[index].id;

    try {

        const response = await fetch(
            `https://wanderlog-1sta.onrender.com/api/trips/${tripId}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert("Trip deleted successfully!");

            await loadTrips();

        } else {

            alert(data.message || "Failed to delete trip");
        }

    } catch (error) {

        console.error("Delete error:", error);

        alert("Backend se connection nahi ho pa raha.");
    }
}


/* ================================
   EDIT TRIP
================================ */

function editTrip(index) {

    const trip = trips[index];

    document.getElementById("title").value = trip.title;
    document.getElementById("destination").value = trip.destination;
    document.getElementById("date").value = trip.date;
    document.getElementById("notes").value = trip.notes || "";

    editIndex = index;

    /* Keep existing image while editing */
    imagebase64 = trip.image || "";

    if (trip.image) {

        imagePreview.src = trip.image;
        imagePreview.style.display = "block";

    } else {

        imagePreview.src = "";
        imagePreview.style.display = "none";
    }

    /* Scroll to form */
    form.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


/* ================================
   IMAGE UPLOAD
================================ */

tripImage.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {

        imagebase64 = e.target.result;

        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
    };

    reader.readAsDataURL(file);
});


/* ================================
   VIEW TRIP DETAILS
================================ */

function viewTrip(index) {

    const trip = trips[index];

    const detailImage = document.getElementById("detailImage");

    if (trip.image) {

        detailImage.src = trip.image;
        detailImage.style.display = "block";

    } else {

        detailImage.src = "";
        detailImage.style.display = "none";
    }

    document.getElementById("detailTitle").textContent =
        trip.title;

    document.getElementById("detailDestination").textContent =
        trip.destination;

    document.getElementById("detailDate").textContent =
        trip.date;

    document.getElementById("detailNotes").textContent =
        trip.notes || "No notes added.";

    document.getElementById("tripDetails").style.display =
        "block";
}


function closeDetails() {

    document.getElementById("tripDetails").style.display =
        "none";
}


/* ================================
   PROFILE
================================ */

function viewProfile() {

    window.location.href = "profile.html?user=Kirti";
}


/* ================================
   SEARCH + DATE FILTER
================================ */

function applyFilters() {

    const searchValue = document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    const selectedDate =
        document.getElementById("filterDate").value;

    const filteredTrips = trips.filter(trip => {

        const matchesSearch =
            searchValue === "" ||
            trip.title.toLowerCase().includes(searchValue) ||
            trip.destination.toLowerCase().includes(searchValue) ||
            (trip.notes || "").toLowerCase().includes(searchValue);

        const matchesDate =
            selectedDate === "" ||
            trip.date === selectedDate;

        const matchesFavorite =
            !showFavoritesOnly ||
            Number(trip.favorite) === 1;

        return (
            matchesSearch &&
            matchesDate &&
            matchesFavorite
        );
    });

    displayFilteredTrips(filteredTrips);
}


/* ================================
   FAVORITE FILTER
================================ */

function toggleFavoriteFilter() {

    showFavoritesOnly = !showFavoritesOnly;

    const button =
        document.getElementById("favoriteFilterBtn");

    if (showFavoritesOnly) {

        button.innerText = "⭐ Show All Trips";

    } else {

        button.innerText = "⭐ Favorites";
    }

    applyFilters();
}


/* ================================
   DISPLAY FILTERED TRIPS
================================ */

function displayFilteredTrips(filteredTrips) {

    tripContainer.innerHTML = "";

    if (filteredTrips.length === 0) {

        tripContainer.innerHTML = `
            <div class="empty-state">
                <h3>🔍 No Trips Found</h3>
                <p>No trip matches your search/filter.</p>
            </div>
        `;

        return;
    }

    filteredTrips.forEach(trip => {

        const index =
            trips.findIndex(t => t.id === trip.id);

        tripContainer.innerHTML += `
            <div class="trip-card">

                ${
                    trip.image
                        ? `<img src="${trip.image}" 
                            alt="Trip Image" 
                            class="trip-image">`
                        : ""
                }

                <h3>✈️ ${trip.title}</h3>

                <p>
                    📍 <strong>${trip.destination}</strong>
                </p>

                <p class="date">
                    📅 ${trip.date}
                </p>

                <p>
                    ${trip.notes || ""}
                </p>

                <button onclick="toggleFavorite(${index})">
                    ${Number(trip.favorite) === 1
                        ? "⭐ Favorited"
                        : "☆ Favorite"}
                </button>

                <button onclick="editTrip(${index})">
                    ✏️ Edit
                </button>

                <button onclick="viewTrip(${index})">
                    👁 View Details
                </button>

                <button onclick="deleteTrip(${index})">
                    🗑 Delete
                </button>

            </div>
        `;
    });
}


/* ================================
   TOGGLE FAVORITE
================================ */

async function toggleFavorite(index) {

    const tripId = trips[index].id;

    try {

        const response = await fetch(
            `https://wanderlog-1sta.onrender.com/api/trips/${tripId}/favorite`,
            {
                method: "PUT"
            }
        );

        const data = await response.json();

        if (response.ok) {

            await loadTrips();

        } else {

            alert(
                data.message ||
                "Failed to update favorite"
            );
        }

    } catch (error) {

        console.error("Favorite error:", error);

        alert("Backend se connection nahi ho pa raha.");
    }
}


/* ================================
   STATISTICS
================================ */

function updateStatistics() {

    const totalTrips = trips.length;

    const favoriteTrips =
        trips.filter(
            trip => Number(trip.favorite) === 1
        ).length;

    const totalDestinations =
        new Set(
            trips.map(
                trip =>
                    trip.destination
                        .trim()
                        .toLowerCase()
            )
        ).size;

    document.getElementById("totalTrips").innerText =
        totalTrips;

    document.getElementById("favoriteTrips").innerText =
        favoriteTrips;

    document.getElementById("totalDestinations").innerText =
        totalDestinations;
}


/* ================================
   DARK MODE
================================ */

const themeToggle = document.getElementById("themeToggle");


function applyTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add("dark");
        themeToggle.innerText = "☀️ Light Mode";

    } else {

        document.body.classList.remove("dark");
        themeToggle.innerText = "🌙 Dark Mode";
    }
}


/* Load saved theme */

const savedTheme = localStorage.getItem("theme") || "light";

applyTheme(savedTheme);


/* Toggle theme */

themeToggle.addEventListener("click", () => {

    const newTheme =
        document.body.classList.contains("dark")
            ? "light"
            : "dark";

    localStorage.setItem("theme", newTheme);

    applyTheme(newTheme);
});


/* Sync theme between pages/tabs */

window.addEventListener("storage", (event) => {

    if (event.key === "theme") {

        applyTheme(event.newValue || "light");
    }
});