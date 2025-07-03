#!/bin/bash

set -e

echo "✅ STT 프로젝트 자동 설치 시작..."

# 1. 시스템 패키지 설치 및 Node.js 문제 예방
echo "🧼 1. 기존 Node.js 및 충돌 패키지 제거"
sudo apt remove -y nodejs npm libnode-dev || true

echo "📦 2. 필수 패키지 설치"
sudo apt update
sudo apt install -y curl python3 python3-venv python3-pip ffmpeg git

# 3. 최신 Node.js 20 LTS 설치
echo "⬇️ 3. Node.js 20 설치 중..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "🔍 Node.js 버전 확인"
node -v
npm -v

# 4. 디렉토리 구조 생성
echo "📁 4. 프로젝트 디렉토리 생성"
mkdir -p ~/stt_project/{backend,frontend}
cd ~/stt_project

# 5. Python 가상환경 설정 및 Whisper 설치
echo "🐍 5. Python 가상환경 설정"
python3 -m venv stt_env
source stt_env/bin/activate

echo "📦 6. Python 패키지 설치"
pip install --upgrade pip
pip install fastapi uvicorn websockets numpy
pip install git+https://github.com/guillaumekln/faster-whisper.git
deactivate

# 7. React 앱 생성
echo "⚛️ 7. React 앱 생성 (stt-client)"
cd frontend
npx create-react-app stt-client --template cra-template
cd stt-client
npm install react-use react-mic

# 8. 완료 안내
echo ""
echo "🎉 설치 완료!"
echo "📁 위치: ~/stt_project"
echo "🧠 백엔드: backend/"
echo "🌐 프론트엔드: frontend/stt-client/"
echo ""
echo "🟢 FastAPI 서버 실행:"
echo "cd ~/stt_project && source stt_env/bin/activate && cd backend && uvicorn main:app --reload"
echo ""
echo "🟢 React 앱 실행:"
echo "cd ~/stt_project/frontend/stt-client && npm start"
