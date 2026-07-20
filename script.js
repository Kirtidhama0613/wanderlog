let editIndex=-1;
let imagebase64 = "";
const form = document.getElementById("tripForm");
const tripContainer = document.getElementById("tripContainer");

// LocalStorage se data load karo
let trips = JSON.parse(localStorage.getItem("trips")) || [];

displayTrips();

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const destination = document.getElementById("destination").value;
    const date = document.getElementById("date").value;
    const notes = document.getElementById("notes").value;

    const trip = {
        title,
        destination,
        date,
        notes,
        image: imagebase64,// Store the base64 string in the trip object
        favroite: false
    };

    if (editIndex === -1) {
    trips.push(trip);
} else {
    trips[editIndex] = trip;
    editIndex = -1;
}

    // LocalStorage me save karo
    localStorage.setItem("trips", JSON.stringify(trips));
    console.log(trips);
    displayTrips();

    form.reset();
});

function displayTrips() {
    if (trips.length === 0) {
    tripContainer.innerHTML = `
        <div class="empty-state">
            <h3>🧳 No Trips Yet</h3>
            <p>Add your first trip using the form above.</p>
        </div>
    `;
    return;
    }
    tripContainer.innerHTML = "";

    trips.forEach((trip,index) => {
        tripContainer.innerHTML += `
            <div class="trip-card">
                ${trip.image ? `<img src="${trip.image}" alt="Trip Image" class="trip-image">` : ''}
                <h3>✈️ ${trip.title}</h3>
                <p>📍 <strong>${trip.destination}</strong></p>
                <p class="date">📅 ${trip.date}</p>
                <p>${trip.notes}</p>
                <button onclick="toggleFavorite(${index})"> ${trip.favorite ? "⭐ Favorited" : "☆ Favorite"} </button>
                <button onclick="editTrip(${index})">✏️ Edit</button>
                <button onclick="viewTrip(${index})">👁 View Details</button>
                <button onclick="deleteTrip(${index})">🗑 Delete</button>
                <button onclick="viewProfile()">👤 View Profile</button>     
        `;
    });

    updateStatistics(); // Update statistics after displaying trips
}

function deleteTrip(index) {
    if (confirm("Are you sure you want to delete this trip?")) {
        trips.splice(index, 1);

        localStorage.setItem("trips", JSON.stringify(trips));

        displayTrips();
    }
}

function editTrip(index) {
    document.getElementById("title").value = trips[index].title;
    document.getElementById("destination").value = trips[index].destination;
    document.getElementById("date").value = trips[index].date;
    document.getElementById("notes").value = trips[index].notes;

    editIndex = index;
}
        
 const tripImage = document.getElementById("tripImage");
const imagePreview = document.getElementById("imagePreview");

tripImage.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagebase64 = e.target.result; // Store the base64 string
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
        };

        reader.readAsDataURL(file);
    }
});   

function viewTrip(index) {
    const trip = trips[index];

    document.getElementById("detailImage").src = trip.image;
    document.getElementById("detailTitle").textContent = trip.title;
    document.getElementById("detailDestination").textContent = trip.destination;
    document.getElementById("detailDate").textContent = trip.date;
    document.getElementById("detailNotes").textContent = trip.notes;

    document.getElementById("tripDetails").style.display = "block";
}

function closeDetails() {
    document.getElementById("tripDetails").style.display = "none";
}

function viewProfile() {
    window.location.href = "profile.html?user=Kirti";
}


function searchTrips() {
    const searchValue = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const cards = document.querySelectorAll(".trip-card");

    cards.forEach(card => {
        const text = card.innerText.toLowerCase();

        if (text.includes(searchValue)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function filterTripsByDate() {
    const selectedDate = document.getElementById("filterDate").value;
    const cards = document.querySelectorAll(".trip-card");

    cards.forEach(card => {
        if (selectedDate === ""|| card.innerText.includes(selectedDate)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function toggleFavorite(index) {

    console.log("Favorite button clicked", index);

    trips[index].favorite = !trips[index].favorite; // Toggle the favorite status

    localStorage.setItem("trips", JSON.stringify(trips)); // Update localStorage

    displayTrips(); // Refresh the displayed trips
}


function sortTrips() {
    trips.sort((a, b) => a.title.localeCompare(b.title));

    localStorage.setItem("trips", JSON.stringify(trips));

    displayTrips();
}

function updateStatistics() {

    const totalTrips = trips.length;

    const favoriteTrips = trips.filter(trip => trip.favorite).length;

    const totalDestinations = [...new Set(trips.map(trip => trip.destination))].length;

    document.getElementById("totalTrips").innerText = totalTrips;
    document.getElementById("favoriteTrips").innerText = favoriteTrips;
    document.getElementById("totalDestinations").innerText = totalDestinations;

}   

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme","dark");
        themeToggle.innerText="☀️ Light Mode";
    }else{
        localStorage.setItem("theme","light");
        themeToggle.innerText="🌙 Dark Mode";
    }

});

if(localStorage.getItem("theme")==="dark"){
    document.body.classList.add("dark");
    themeToggle.innerText="☀️ Light Mode";
}