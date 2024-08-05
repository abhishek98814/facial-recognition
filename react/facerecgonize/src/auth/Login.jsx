import React, { useState, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import { Link } from 'react-router-dom';

const Login = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loginMethod, setLoginMethod] = useState('webcam');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loginTime, setLoginTime] = useState('');
  const webcamRef = useRef(null);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    setLoginTime('');
  
    let file;
    if (loginMethod === 'webcam') {
      const imageSrc = webcamRef.current.getScreenshot();
      const blob = await fetch(imageSrc).then(res => res.blob());
      file = new File([blob], 'login.jpg', { type: 'image/jpeg' });
    } else {
      file = selectedFile;
    }
  
    if (!file) {
      setError('No image selected');
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      console.log('Sending login request with image:', file);
      const response = await axios.post('http://localhost:5000/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Login response:', response.data);
      setMessage(response.data.message);
      setLoginTime(response.data.time);
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.message || 'Error logging in');
      } else if (error.request) {
        console.error('Error request:', error.request);
        setError('No response received from server');
      } else {
        console.error('Error message:', error.message);
        setError(error.message || 'Error logging in');
      }
    } finally {
      setLoading(false);
    }
  };

  const requestPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
    } catch (error) {
      console.error('Webcam permission error:', error);
      setError('Permission denied for webcam');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-center">Login</h2>
        <div className="mb-4">
          <label className="mr-4">
            <input
              type="radio"
              value="webcam"
              checked={loginMethod === 'webcam'}
              onChange={() => setLoginMethod('webcam')}
              className="mr-2"
            />
            Use Webcam
          </label>
          <label>
            <input
              type="radio"
              value="file"
              checked={loginMethod === 'file'}
              onChange={() => setLoginMethod('file')}
              className="mr-2"
            />
            Upload Image
          </label>
        </div>

        {loginMethod === 'webcam' && (
          <div className="mb-4">
            {!hasPermission ? (
              <button
                onClick={requestPermission}
                className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
              >
                Enable Webcam
              </button>
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-64 rounded"
              />
            )}
          </div>
        )}

        {loginMethod === 'file' && (
          <div className="mb-4">
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        )}

        {imagePreview && (
          <div className="mb-4 items-center flex justify-center">
            <img src={imagePreview} alt="Selected for login" className="w-16 h-32 rounded" />
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 disabled:bg-green-300"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {error && <p className="mt-4 text-red-500">{error}</p>}
        {message && <p className="mt-4 text-green-500">{message}</p>}
        {loginTime && <p className="mt-4 text-blue-500">Login Time: {loginTime}</p>}

        <div className="mt-4 text-center">
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
