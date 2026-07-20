const params = new URLSearchParams(window.location.search);
const userName = params.get("user");


const profileTrips=document.getElementById("profileTrips");
const trips = JSON.parse(localStorage.getItem("trips")) || [];
if (trips.length === 0) {
    profileTrips.innerHTML = `
        <div class="empty-state">
            <h3>📭 No Trips Yet</h3>
            <p>Start planning your first trip!</p>
        </div>
    `;
} else {
    trips.forEach((trip) => {
        profileTrips.innerHTML += `
        <div class="trip-card">
            <img src="${trip.image}" alt="Trip Image"
             onerror="this.src='https://via.placeholder.com/300x180?text=No+Image'"> 
            <h3>${trip.title}</h3>
            <p>📍 ${trip.destination}</p>
            <p>📅 ${trip.date}</p>
        </div>
        `;
    });
}


function copyProfileLink() {
    navigator.clipboard.writeText(window.location.href);
    alert("Profile link copied successfully!");
}
