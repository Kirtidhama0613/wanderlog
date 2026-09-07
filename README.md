# ✈️ Wanderlog - Trip Planner Web Application

Wanderlog is a full-stack Trip Planner web application that allows users to manage and organize their travel plans.

Users can add trips, edit trip details, delete trips, mark trips as favorites, search and filter trips, upload trip images, and view trip statistics.

---

## 🌐 Live Demo

- **Frontend (Live Website):** https://kirtidhama0613.github.io/wanderlog/
- **Backend API:** https://wanderlog-1sta.onrender.com
- **Health Check:** https://wanderlog-1sta.onrender.com/api/health

  
## 🚀 Features

- ➕ Add new trips
- ✏️ Edit existing trips
- 🗑️ Delete trips
- ⭐ Mark trips as favorites
- 🔍 Search trips
- 📅 Filter trips by date
- ⭐ Filter favorite trips
- 🖼️ Upload trip images
- 👁️ View complete trip details
- 📊 Trip statistics
- 🌙 Dark mode
- 👤 User profile page
- 💾 Persistent data storage using SQLite
- 🔗 Frontend and backend API integration

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Python
- Flask
- Flask-CORS

### Database
- SQLite

### Tools
- VS Code
- Git
- GitHub

---

## 📂 Project Structure

```text
wanderlog-fullstack/
│
├── backend/
│   ├── app.py
│   └── wanderlog.db
│
├── screenshots/
│
├── index.html
├── style.css
├── script.js
│
├── profile.html
├── profile.css
├── profile.js
│
├── README.md
└── .gitignore
```

## 📸 Screenshots

### 🏠 Home Page

![Home Page](screenshots/home.png)

---

### ➕ Add Trip

![Add Trip](screenshots/add-trip.png)

---

### 🧳 Trips

![Trips](screenshots/trips.png)

---

### 👤 Profile Page

![Profile Page](screenshots/profile.png)

---

### 🌙 Dark Mode

![Dark Mode](screenshots/dark-mode.png)


## ⚙️ Installation & Setup

Follow the steps below to run the Wanderlog project locally.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Kirtidhama0613/wanderlog.git
```

### 2️⃣ Navigate to the Project Folder

```bash
cd wanderlog
```

### 3️⃣ Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

### 4️⃣ Run the Backend Server

```bash
python app.py
```

The backend server will start at:

```text
http://127.0.0.1:5000
```

### 5️⃣ Run the Frontend

Open the project folder in VS Code and run the frontend using Live Server.

The frontend will open at:

```text
http://127.0.0.1:5500
```


