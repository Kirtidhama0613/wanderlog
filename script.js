let editIndex=-1;
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
        notes
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
                <h3>✈️ ${trip.title}</h3>
                <p>📍 <strong>${trip.destination}</strong></p>
                <p class="date">📅 ${trip.date}</p>
                <p>${trip.notes}</p>
                <button onclick="editTrip(${index})">✏️ Edit</button>
                <button onclick="deleteTrip(${index})">🗑 Delete</button>
            
        `;
    });
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
        
    
