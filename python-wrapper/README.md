# audio-workbench-player (Python wrapper)

Python helper package to embed `audio-workbench-player` in Streamlit, Jupyter, and other HTML-capable UIs.

## Install (local)

```bash
pip install -e .
```

## Usage

```python
from audio_workbench_player import render_daw_player
html = render_daw_player(audio_bytes, showFileOpen=False)
```

## Streamlit demo

```bash
streamlit run demo_streamlit.py
```

## Gradio demo

```bash
pip install gradio
python demo_gradio.py
```
