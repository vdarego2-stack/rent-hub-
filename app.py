from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os, json

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Folders and JSON files
UPLOAD_FOLDER = "static"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
USERS_FILE = "users.json"
PRODUCTS_FILE = "products.json"

# ---------------- HELPER FUNCTIONS ----------------
def load_json(file_path):
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            return json.load(f)
    return []

def save_json(file_path, data):
    with open(file_path, "w") as f:
        json.dump(data, f, indent=4)

# ---------------- IN-MEMORY DATABASE (loaded from JSON) ----------------
users = load_json(USERS_FILE)
products = load_json(PRODUCTS_FILE)
rentals = []

# ---------------- SIGNUP ----------------
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    for user in users:
        if user["email"] == data["email"]:
            return jsonify({"message": "Email already exists"}), 400
    user = {
        "id": len(users) + 1,
        "name": data["name"],
        "email": data["email"],
        "password": data["password"]
    }
    users.append(user)
    save_json(USERS_FILE, users)
    print("Current Users:", users)
    return jsonify({"message": "Signup successful"})

# ---------------- LOGIN ----------------
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    for user in users:
        if user["email"] == data["email"] and user["password"] == data["password"]:
            return jsonify({
                "message": "Login successful",
                "user_id": user["id"]
            })
    return jsonify({"message": "Invalid credentials"}), 401

# ---------------- ADD PRODUCT ----------------
@app.route('/add_product', methods=['POST'])
def add_product():
    name = request.form.get('name')
    price = request.form.get('price')
    location = request.form.get('location')
    user_id = request.form.get('user_id')
    image = request.files.get('image')

    if not all([name, price, location, user_id]):
        return jsonify({"message": "Missing product data"}), 400
    if not image:
        return jsonify({"message": "No image uploaded"}), 400

    filename = image.filename
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    image.save(filepath)

    product = {
        "id": len(products) + 1,
        "name": name,
        "price": price,
        "location": location,
        "image": filepath,
        "owner_id": int(user_id)
    }
    products.append(product)
    save_json(PRODUCTS_FILE, products)

    return jsonify({"message": "Product added successfully"})

# ---------------- DELETE PRODUCT ----------------
@app.route('/delete_product/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    global products
    user_id = request.json.get('user_id') if request.json else None
    
    product = next((p for p in products if p['id'] == product_id), None)
    if not product:
        return jsonify({"message": "Product not found"}), 404
        
    if str(product['owner_id']) != str(user_id):
        return jsonify({"message": "Unauthorized to delete this product"}), 403
        
    products = [p for p in products if p['id'] != product_id]
    save_json(PRODUCTS_FILE, products)
    
    return jsonify({"message": "Product deleted successfully"})

# ---------------- GET PRODUCTS ----------------
@app.route('/products', methods=['GET'])
def get_products():
    return jsonify(products)

# ---------------- RENT PRODUCT ----------------
@app.route('/rent', methods=['POST'])
def rent_product():
    data = request.json
    rental = {
        "user_id": data["user_id"],
        "product_id": data["product_id"]
    }
    rentals.append(rental)
    return jsonify({"message": "Product rented successfully"})

# ---------------- SERVE IMAGES ----------------
@app.route('/static/<path:filename>')
def serve_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# ---------------- RUN APP ----------------
if __name__ == '__main__':
    app.run(debug=True)