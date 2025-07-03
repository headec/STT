# uvicorn live:app --reload
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
import base64
import tempfile
import subprocess
import os

app = FastAPI()

@app.websocket("/ws/stt")
async def websocket_stt(websocket: WebSocket):
    await websocket.accept()
    print("✅ WebSocket 연결됨")
    try:
        while True:
            try:
                data = await websocket.receive_text()
                print("🎙️ 수신된 데이터 길이:", len(data))

                # base64 디코딩 → 임시 파일 저장
                audio_bytes = base64.b64decode(data)
                with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as f:
                    f.write(audio_bytes)
                    webm_path = f.name

                wav_path = webm_path.replace(".webm", ".wav")
                
                # ffmpeg 변환 시도
                result = subprocess.run([
                    "ffmpeg", "-y", "-i", webm_path, wav_path
                ], capture_output=True, text=True)

                if result.returncode != 0:
                    print("❌ ffmpeg 변환 실패:", result.stderr)
                    await websocket.send_text("(ffmpeg 변환 실패)")
                    continue

                # Whisper 처리 (더미 응답)
                result_text = "(예시 텍스트 변환 결과)"
                await websocket.send_text(result_text)

            except Exception as e:
                print("❌ 처리 중 오류 발생:", e)
                try:
                    await websocket.send_text("(오류 발생)")
                except RuntimeError:
                    print("❌ 이미 WebSocket 닫힘")
            finally:
                if 'webm_path' in locals() and os.path.exists(webm_path):
                    os.remove(webm_path)
                if 'wav_path' in locals() and os.path.exists(wav_path):
                    os.remove(wav_path)

    except WebSocketDisconnect:
        print("❌ 클라이언트 WebSocket 연결 종료")