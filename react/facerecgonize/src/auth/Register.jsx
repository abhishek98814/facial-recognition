import React, { useState, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import { Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [images, setImages] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const webcamRef = useRef(null);

  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then((res) => res.blob());
    const file = new File([blob], `image_${images.length}.jpg`, { type: 'image/jpeg' });

    setImages([...images, file]);
  };

  const handleRegister = async () => {
    const formData = new FormData();
    formData.append('name', name);
    images.forEach((image, index) => formData.append('images', image));

    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      console.log(response.data);

      alert(response.data.message);
    } catch (error) {
      alert('Error registering user');
    }
  };

  const requestPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
    } catch (error) {
      alert('Permission denied');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <div className="flex flex-col items-center">
          {!hasPermission ? (
            <button
              onClick={requestPermission}
              className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600 transition duration-300"
            >
              Enable Webcam
            </button>
          ) : (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="mb-4"
              />
              <button
                onClick={handleCapture}
                className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600 transition duration-300"
              >
                Capture Image
              </button>
              <button
                onClick={handleRegister}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600 transition duration-300"
              >
                Register
              </button>
            </>
          )}
        </div>
        <div className="text-center">
          <Link
            to="/"
            className="text-blue-500 hover:text-blue-600 transition duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
