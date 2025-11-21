# SketchScape Demo

A lightweight web demo for the novel <a href="https://github.com/Emil-Demic/SketchScape">Sketch-based Image Retrieval model</a>.

Live Demo: <a href="https://app.sbir.emil-demic.xyz" target="_blank">https://app.sbir.emil-demic.xyz</a>

## Retrieval Flow
1. User draws a sketch on the canvas.
2. Sketch is converted to Base64 (JPEG).
3. Sent to model API for nearest neighbor indices based on image and sketch embeddings.
4. Indices mapped to CDN images and rendered with pagination.
5. Sketch simultaneously POSTed (non-blocking) to Lambda for storage with timestamp.

## Privacy
Sketches are stored (base64 + timestamp) for further research. Do not submit sensitive content.