import streamlit as st
import streamlit.components.v1 as components

from audio_workbench_player import render_daw_player

st.set_page_config(page_title="Audio Workbench Player Demo", layout="wide")
st.title("Audio Workbench Player (Python Wrapper Demo)")

uploaded = st.file_uploader("Audio-Datei wählen", type=["wav", "mp3", "ogg", "flac"])
if uploaded is not None:
    html = render_daw_player(uploaded.read(), showFileOpen=False)
    components.html(html, height=620, scrolling=False)
else:
    st.info("Lade eine Audiodatei hoch, um den Player zu sehen.")
