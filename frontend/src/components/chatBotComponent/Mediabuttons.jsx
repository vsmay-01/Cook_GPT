import React, { useState } from "react";

const MediaButtons = ({ assets }) => {
  const [audioStream, setAudioStream] = useState(null);

  // Handle selecting or capturing a photo
  const handleGalleryClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*"; // Allows image selection
    input.capture = "environment"; // Enables camera capture on mobile
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        console.log("Selected file:", file);
      }
    };
    input.click();
  };

  // Handle microphone activation
  const handleMicClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      console.log("Microphone activated!");
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {/* Gallery Button */}
      <button onClick={handleGalleryClick} style={{ background: "none", border: "none", cursor: "pointer" }}>
        <img src={assets.gallery_icon} alt="Gallery" width="40" />
      </button>

      {/* Microphone Button */}
      <button onClick={handleMicClick} style={{ background: "none", border: "none", cursor: "pointer" }}>
        <img src={assets.mic_icon} alt="Microphone" width="40" />
      </button>
    </div>
  );
};

export default MediaButtons;
