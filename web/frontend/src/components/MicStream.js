import React, { useEffect, useRef, useState } from 'react';
import { ReactMic } from 'react-mic';

function MicStream() {
    const [record, setRecord] = useState(false);
    const [socket, setSocket] = useState(null);
    const [result, setResult] = useState('');

    const handleStart = () => setRecord(true);
    const handleStop = () => setRecord(false);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws/stt');

        ws.onopen = () => {
            console.log("🔌 WebSocket 연결됨");
        };

        ws.onmessage = (event) => {
            console.log("📩 수신된 메시지:", event.data);
            setResult(event.data);
        };

        ws.onclose = (event) => {
            console.log("🔌 WebSocket 종료:", event.code, event.reason);
        };

        ws.onerror = (error) => {
            console.error("❌ WebSocket 오류:", error);
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    const onData = (recordedBlob) => {
        console.log("📤 전송할 blob:", recordedBlob.blob);
        if (socket && socket.readyState === WebSocket.OPEN) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result.split(',')[1];
                socket.send(base64data);
            };
            reader.readAsDataURL(recordedBlob.blob);
        }
    };

    return (
        <div>
            <h2>🎧 실시간 STT 데모</h2>
            <ReactMic
                record={record}
                onStop={onData}
                mimeType="audio/webm"
                strokeColor="#000000"
                backgroundColor="#FF4081"
            />
            <div style={{ marginTop: "1em" }}>
                <button onClick={handleStart}>🎤 녹음 시작</button>
                <button onClick={handleStop}>⏹️ 정지</button>
            </div>
            <p>📝 결과: {result}</p>
        </div>
    );
}

export default MicStream;