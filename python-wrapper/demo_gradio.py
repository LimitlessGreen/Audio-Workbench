import gradio as gr

from audio_workbench_player import render_daw_player


def render_from_upload(file_obj, show_file_open):
    if file_obj is None:
        return "<p>Bitte eine Audiodatei hochladen.</p>"
    with open(file_obj.name, "rb") as f:
        audio_bytes = f.read()
    return render_daw_player(audio_bytes, showFileOpen=show_file_open)


with gr.Blocks(title="Audio Workbench Player (Gradio Demo)") as demo:
    gr.Markdown("# Audio Workbench Player (Gradio Demo)")
    upload = gr.File(label="Audio-Datei wählen", file_count="single")
    show_file_open = gr.Checkbox(
        label="Open-Button im Player anzeigen",
        value=False,
    )
    out = gr.HTML(label="Player")

    upload.change(
        fn=render_from_upload,
        inputs=[upload, show_file_open],
        outputs=out,
    )
    show_file_open.change(
        fn=render_from_upload,
        inputs=[upload, show_file_open],
        outputs=out,
    )


if __name__ == "__main__":
    demo.launch()
