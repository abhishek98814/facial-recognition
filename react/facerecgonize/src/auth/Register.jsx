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
    const blob = await fetch(imageSrc).then(res => res.blob());
    const file = new File([blob], `image_${images.length}.jpg`, { type: 'image/jpeg' });

    setImages([...images, file]);
  };

  const handleRegister = async () => {
    const formData = new FormData();
    formData.append('name', name);
    images.forEach((image, index) => formData.append('images', image));

    try {
      const response = await axios.post('http://localhost:5000/register', formData);
     console.log(response.data)
     
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
    <>
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Name" 
      />
    <div>
      {!hasPermission ? (
        <button onClick={requestPermission}>Enable Webcam</button>
      ) : (
        <>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
          <button onClick={handleCapture}>Capture Image</button>
          <button onClick={handleRegister}>Register</button>
        </>
      )}
    </div>
      <Link to="/">Login</Link>
    </>
  );
};

export default Register;
