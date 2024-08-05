import os
import face_recognition
import cv2

def save_image(image_data, path):
    with open(path, 'wb') as f:
        f.write(image_data)

def enhance_image(image_path):
    print(f"Enhancing image: {image_path}")
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    cv2.imwrite(image_path, gray)
    print(f"Image enhanced: {image_path}")

def recognize_faces(db_dir, image_path, similarity_threshold=0.6):
    try:
        print(f"Recognizing faces in image: {image_path}")
        known_encodings = []
        known_names = []

        for user_dir in os.listdir(db_dir):
            user_path = os.path.join(db_dir, user_dir)
            for img_name in os.listdir(user_path):
                img_path = os.path.join(user_path, img_name)
                img = face_recognition.load_image_file(img_path)
                encodings = face_recognition.face_encodings(img)
                if encodings:
                    known_encodings.append(encodings[0])
                    known_names.append(user_dir)
                    print(f"Loaded encoding for {user_dir} from {img_path}")
                else:
                    print(f"No face encoding found for image: {img_path}")

        unknown_img = face_recognition.load_image_file(image_path)
        unknown_encodings = face_recognition.face_encodings(unknown_img)

        if not unknown_encodings:
            print("No face detected in the image")
            return "no_face_detected"

        for unknown_encoding in unknown_encodings:
            results = face_recognition.compare_faces(known_encodings, unknown_encoding, tolerance=similarity_threshold)
            if True in results:
                match_index = results.index(True)
                print(f"Match found: {known_names[match_index]}")
                return known_names[match_index]

        print("Unknown person")
        return "unknown_person"

    except Exception as e:
        print(f"Error occurred: {e}")
        return "error_occurred"
