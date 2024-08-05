import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import save_image, recognize_faces, enhance_image
from datetime import datetime

app = Flask(__name__)
CORS(app)

db_dir = os.path.join('data', 'db')
output_dir = 'output'

if not os.path.exists(db_dir):
    os.makedirs(db_dir)
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

@app.route('/register', methods=['POST'])
def register():
    name = request.form['name']
    images = request.files.getlist('images')
    user_dir = os.path.join(db_dir, name)
    if not os.path.exists(user_dir):
        os.mkdir(user_dir)
    
    for idx, image in enumerate(images):
        image_path = os.path.join(user_dir, f'{name}_{idx}.jpg')
        save_image(image.read(), image_path)
        enhance_image(image_path)
    
    return jsonify({"message": "User registered successfully"})

@app.route('/login', methods=['POST'])
def login():
    print("Login request received")

    if 'image' not in request.files:
        print("No image file in request")
        return jsonify({"message": "No image file provided"}), 400

    image = request.files['image']
    image_path = os.path.join(output_dir, 'unknown.jpg')
    image.save(image_path)

    print(f"Image saved to {image_path}")

    result = recognize_faces(db_dir, image_path, similarity_threshold=0.6)
    print(f"Recognition result: {result}")

    login_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    if result == "no_face_detected":
        return jsonify({"message": "No face detected in the image", "time": login_time}), 400
    elif result == "unknown_person":
        return jsonify({"message": "Unknown person", "time": login_time}), 404
    elif result == "error_occurred":
        return jsonify({"message": "An error occurred during face recognition", "time": login_time}), 500
    else:
        return jsonify({"message": f"Welcome {result}", "time": login_time}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
