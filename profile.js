const params = new URLSearchParams(window.location.search);
const userName = params.get("user");

const profileTrips = document.getElementById("profileTrips");
const userNameElement = document.getElementById("userName");

if (userNameElement) {
    userNameElement.innerText = userName || "Kirti";
}


async function loadProfileTrips() {

    try {

        const response = await fetch(
            "https://wanderlog-1sta.onrender.com/api/trips"
        );

        if (!response.ok) {
            throw new Error("Failed to load trips");
        }

        const trips = await response.json();

        updateProfileStatistics(trips);

        if (trips.length === 0) {

            profileTrips.innerHTML = `
                <div class="empty-state">
                    <h3>📭 No Trips Yet</h3>
                    <p>Start planning your first trip!</p>
                </div>
            `;

            return;
        }

        profileTrips.innerHTML = "";

        trips.forEach((trip) => {

            profileTrips.innerHTML += `
                <div class="trip-card">

                    ${
                        trip.image
                        ? `<img src="${trip.image}" 
                           alt="Trip Image"
                           class="trip-image">`
                        : ""
                    }

                    <h3>✈️ ${trip.title}</h3>

                    <p>📍 ${trip.destination}</p>

                    <p>📅 ${trip.date}</p>

                    ${
                        trip.notes
                        ? `<p>📝 ${trip.notes}</p>`
                        : ""
                    }

                </div>
            `;
        });

    } catch (error) {

        console.error("Profile error:", error);

        profileTrips.innerHTML = `
            <div class="empty-state">
                <h3>⚠️ Unable to load trips</h3>
                <p>Please make sure the Wanderlog backend is running.</p>
            </div>
        `;
    }
}


loadProfileTrips();

function updateProfileStatistics(trips) {

    const totalTrips = trips.length;

    const favoriteTrips = trips.filter(
        trip => Number(trip.favorite) === 1
    ).length;

    const totalDestinations = new Set(
        trips.map(trip =>
            trip.destination.trim().toLowerCase()
        )
    ).size;

    document.getElementById("profileTotalTrips").innerText =
        totalTrips;

    document.getElementById("profileFavoriteTrips").innerText =
        favoriteTrips;

    document.getElementById("profileDestinations").innerText =
        totalDestinations;
}

function copyProfileLink() {

    navigator.clipboard.writeText(window.location.href);

    alert("Profile link copied successfully!");
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