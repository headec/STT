import React, { useState, useRef } from "react";
import axios from "axios";

function Recorder() {
  const [recording, setRecording] = useState(false);
  const [text, setText] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");

      try {
        const response = await axios.post("http://localhost:8000/transcribe", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setText(response.data.text);
      } catch (err) {
        console.error("전송 실패", err);
        setText("STT 실패");
      }
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div>
      <h2>🎤 음성 녹음 후 STT 변환</h2>
      {recording ? (
        <button onClick={stopRecording}>⏹️ 녹음 종료</button>
      ) : (
        <button onClick={startRecording}>🎙️ 녹음 시작</button>
      )}
      <p>📝 결과: {text}</p>
    </div>
  );
}

export default Recorder;

