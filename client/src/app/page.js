"use client";
import { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

export default function Home() {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("");
  const [faceData, setFaceData] = useState(null);

  const API_URL = "http://localhost:3000/api/upload"; // Change if different

  // Capture webcam photo
  const capture = () => {
    const imgSrc = webcamRef.current.getScreenshot();
    setImage(imgSrc);
  };

  // Upload image to API
  const handleUpload = async () => {
    if (!image) return alert("Take a photo first!");
    setStatus("Uploading...");
    try {
      const blob = await fetch(image).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "face.jpg");
      formData.append("userId", "user123");

      const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus("Uploaded! Processing...");
      pollStatus(res.data.faceId);
    } catch (err) {
      console.error(err);
      setStatus("Upload failed");
    }
  };

  // Poll for face status
  const pollStatus = async (faceId) => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/face/${faceId}`);
        setFaceData(res.data);
        setStatus(res.data.status);
        if (res.data.status === "processed" || res.data.status === "error") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>whoare 🚀 Face Capture & Upload</h1>

      <div style={{ margin: "1rem 0" }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={320}
          height={240}
        />
      </div>
      <button onClick={capture} style={{ marginRight: "1rem" }}>
        Capture Photo
      </button>
      <button onClick={handleUpload}>Upload</button>

      {image && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Preview:</h3>
          <img src={image} alt="Captured" width={320} height={240} />
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <strong>Status:</strong> {status}
      </div>

      {faceData && faceData.embedding && (
        <div>
          <strong>Embedding length:</strong> {faceData.embedding.length}
        </div>
      )}
    </div>
  );
}
