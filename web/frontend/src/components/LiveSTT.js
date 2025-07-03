import React, { useRef, useState } from 'react';

function LiveSTT() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    wsRef.current = new WebSocket('ws://localhost:8000/ws/stt');

    wsRef.current.onmessage = (event) => {
      setTranscript((prev) => prev + ' ' + event.data);
    };

    mediaRecorderRef.current.ondataavailable = async (e) => {
      if (e.data.size > 0 && wsRef.current.readyState === WebSocket.OPEN) {
        const arrayBuffer = await e.data.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        wsRef.current.send(base64);
      }
    };

    mediaRecorderRef.current.start(1000); // 1초마다 오디오 chunk 전송
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    wsRef.current.close();
    setIsRecording(false);
  };

  return (
    <div>
      <h2>🎧 실시간 STT</h2>
      {isRecording ? (
        <button onClick={stopRecording}>🛑 중지</button>
      ) : (
        <button onClick={startRecording}>🎙️ 녹음 시작</button>
      )}
      <h3>📝 텍스트:</h3>
      <p>{transcript}</p>
    </div>
  );
}

export default LiveSTT;
