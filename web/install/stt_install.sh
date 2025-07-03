#!/bin/bash

# 설치 로그용
echo "🔧 STT 프로젝트 환경 설정 중..."

# 시스템 패키지
sudo apt update
sudo apt install -y python3 python3-pip ffmpeg git curl

# Node.js 20 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 가상환경 생성
python3 -m venv stt_env
source stt_env/bin/activate

# 파이썬 패키지 설치
pip install --upgrade pip
pip install fastapi uvicorn faster-whisper numpy

# frontend 준비
cd web/frontend
npm install --legacy-peer-deps

# 완료 메시지
echo "✅ 설치 완료!"

