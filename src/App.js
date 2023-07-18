import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import Webcam from 'react-webcam';
import { drawHand } from './utilities';
import './App.css';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [noHandDetected, setNoHandDetected] = useState(false);

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log('Handpose model loaded');
    detect(net);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      video.width = videoWidth;
      video.height = videoHeight;

      const canvas = canvasRef.current;
      canvas.width = videoWidth;
      canvas.height = videoHeight;

      const hands = await net.estimateHands(video);

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, videoWidth, videoHeight);

      if (hands.length > 0) {
        setNoHandDetected(false);
        hands.forEach((hand) => {
          drawHand(hand, ctx);
        });
      } else {
        setNoHandDetected(true);
      }
    }

    requestAnimationFrame(() => {
      detect(net);
    });
  };

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission(true);
      setShowCamera(true);
      runHandpose();
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleBackButtonClick = () => {
    setShowCamera(false);
    setNoHandDetected(false);
  };

  useEffect(() => {
    const handleWindowResize = () => {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      video.width = videoWidth;
      video.height = videoHeight;

      const canvas = canvasRef.current;
      canvas.width = videoWidth;
      canvas.height = videoHeight;
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <div className="App">
      <nav className="nav">
        <h1 className="nav-title">Motion Tracker</h1>
      </nav>
      {!cameraPermission && !showCamera && (
        <div className="permission-prompt">
          <div className="app-description">
            <h2 className="app-description-title">What This App Does</h2>
            <p className="app-description-text">
              This React-based web application uses TensorFlow.js and the handpose model to track and analyze hand movements captured by the user's camera. It leverages machine learning to estimate hand poses in real-time and displays them accordingly.
            </p>
          </div>
          <h3 className="app-description-title">This App Needs Access To Your Camera</h3>
          <button className="allow-button" onClick={requestCameraPermission}>
            Allow
          </button>
        </div>
      )}
      {cameraPermission && !showCamera && (
        <div className="permission-prompt">
          <div className="app-description">
            <h2 className="app-description-title">What This App Does</h2>
            <p className="app-description-text">
              This app uses handpose detection to track and analyze hand movements captured by your camera. It leverages TensorFlow.js and machine learning techniques to estimate hand poses in real-time.
            </p>
          </div>
          <button className="open-camera-button" onClick={() => setShowCamera(true)}>
            Open Camera
          </button>
        </div>
      )}
      {showCamera && (
        <React.Fragment>
          <Webcam ref={webcamRef} className="webcam" />
          <canvas ref={canvasRef} className="canvas" />
          {noHandDetected && (
            <div className="no-hand-prompt">
              <p>No hand detected. Please try again.</p>
            </div>
          )}
          <button className="back-button" onClick={handleBackButtonClick}>
            Back
          </button>
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
