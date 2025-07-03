import streamlit as st
import whisper
import tempfile
import os

# Whisper 모델 로딩 (기본 'base', 더 높은 품질은 'small', 'medium', 'large')
@st.cache_resource
def load_model():
    return whisper.load_model("base")

model = load_model()

st.title("🎤 Speech-to-Text (Whisper 기반)")

uploaded_audio = st.file_uploader("음성 파일 업로드 (mp3, wav 등)", type=["mp3", "wav", "m4a"])

if uploaded_audio is not None:
    # 임시파일로 저장
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        tmp.write(uploaded_audio.read())
        tmp_path = tmp.name

    st.audio(tmp_path)

    with st.spinner("음성을 텍스트로 변환 중..."):
        result = model.transcribe(tmp_path, language="ko")
        st.success("변환 완료!")

    st.subheader("📝 변환된 텍스트:")
    st.write(result["text"])

    # 파일 삭제
    os.remove(tmp_path)
