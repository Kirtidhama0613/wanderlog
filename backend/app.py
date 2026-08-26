from flask import Flask, jsonify, request  
from flask_cors import CORS 
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect("wanderlog.db")
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS trips (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            destination TEXT NOT NULL,
            date TEXT NOT NULL
        )
    """)

    try:
        conn.execute(
            "ALTER TABLE trips ADD COLUMN favorite INTEGER DEFAULT 0"
        )
    except sqlite3.OperationalError:
        pass

    try:
        conn.execute(
            "ALTER TABLE trips ADD COLUMN notes TEXT DEFAULT ''"
        )
    except sqlite3.OperationalError:
        pass

    try:
       conn.execute(
        "ALTER TABLE trips ADD COLUMN image TEXT DEFAULT ''"
    )
    except sqlite3.OperationalError:
        pass

    conn.commit()
    conn.close()

@app.route("/")
def home():
    return "Wanderlog Backend is running!"


@app.route("/api/health")
def health():
    return jsonify({
        "status": "success",
        "message": "Wanderlog API is working"
    })


@app.route("/api/trips", methods=["GET"])
def get_trips():
    conn = get_db_connection()

    trips = conn.execute(
    "SELECT * FROM trips ORDER BY LOWER(title) ASC"
).fetchall()

    conn.close()

    return jsonify([dict(trip) for trip in trips])


@app.route("/api/trips", methods=["POST"])
def add_trip():
    data = request.get_json()

    title = data.get("title")
    destination = data.get("destination")
    date = data.get("date")
    notes = data.get("notes")
    image = data.get("image")

    if not title or not destination or not date:
        return jsonify({
            "status": "error",
            "message": "All fields are required"
        }), 400

    conn = get_db_connection()

    cursor = conn.execute(
        "INSERT INTO trips (title, destination, date, notes, image) VALUES (?, ?, ?, ?, ?)",
        (title, destination, date, notes, image)
    )

    conn.commit()

    trip_id = cursor.lastrowid
    conn.close()

    return jsonify({
        "status": "success",
        "message": "Trip added successfully",
        "id": trip_id
    }), 201

@app.route("/api/trips/<int:trip_id>", methods=["DELETE"])
def delete_trip(trip_id):
    conn = get_db_connection()

    cursor = conn.execute(
        "DELETE FROM trips WHERE id = ?",
        (trip_id,)
    )

    conn.commit()
    conn.close()

    if cursor.rowcount == 0:
        return jsonify({
            "status": "error",
            "message": "Trip not found"
        }), 404

    return jsonify({
        "status": "success",
        "message": "Trip deleted successfully"
    })

@app.route("/api/trips/<int:trip_id>", methods=["PUT"])
def update_trip(trip_id):
    data = request.get_json()

    title = data.get("title")
    destination = data.get("destination")
    date = data.get("date")
    notes = data.get("notes", "")
    image = data.get("image", "")

    if not title or not destination or not date:
        return jsonify({
            "status": "error",
            "message": "All fields are required"
        }), 400

    conn = get_db_connection()

    cursor = conn.execute(
        """
        UPDATE trips
        SET title = ?,
            destination = ?,
            date = ?,
            notes = ?,
            image = ?
        WHERE id = ?
        """,
        (title, destination, date, notes, image, trip_id)
    )

    conn.commit()
    conn.close()

    if cursor.rowcount == 0:
        return jsonify({
            "status": "error",
            "message": "Trip not found"

        }), 404

    return jsonify({
        "status": "success",
        "message": "Trip updated successfully"
    })

@app.route("/api/trips/<int:trip_id>/favorite", methods=["PUT"])
def toggle_favorite(trip_id):
    conn = get_db_connection()

    trip = conn.execute(
        "SELECT favorite FROM trips WHERE id = ?",
        (trip_id,)
    ).fetchone()

    if trip is None:
        conn.close()
        return jsonify({
            "status": "error",
            "message": "Trip not found"
        }), 404

    new_value = 0 if trip["favorite"] else 1

    conn.execute(
        "UPDATE trips SET favorite = ? WHERE id = ?",
        (new_value, trip_id)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "status": "success",
        "favorite": new_value
    })


if __name__ == "__main__":
    init_db()
    app.run(debug=True)