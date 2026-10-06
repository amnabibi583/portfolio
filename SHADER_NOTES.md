# Shader Notes

The aurora is implemented in `shader.js` and rendered by a fullscreen WebGL canvas behind the hero content.

- **Vertex shader:** A pair of triangles covers the entire screen. It only places the fullscreen geometry.
- **UV coordinates:** `gl_FragCoord` is divided by the canvas resolution and remapped from 0–1 into centered -1–1 coordinates. This gives each pixel a useful position.
- **Aspect-ratio correction:** The horizontal coordinate is multiplied by the canvas width/height ratio so waves keep their shape on wide and tall screens.
- **Time animation:** `u_time` advances with each animation frame and shifts the sine waves, creating slow flowing motion.
- **Mouse influence:** `u_mouse` is converted to the same coordinate space as the pixels. A soft distance field slightly increases the nearby wave, so the cursor gently pulls the flow.
- **Aurora color layers:** Blue, teal, purple, and a small green contribution are mixed over a dark navy base using smooth wave thresholds.
- **Grain:** A tiny deterministic noise value is added per pixel to create gentle texture without an image asset.
- **Responsive rendering:** `u_resolution` is updated on resize and the canvas device-pixel ratio is capped at 1.5.
- **Accessibility and performance:** The canvas ignores pointer events, stops rendering when the tab is hidden, and is replaced by a static CSS gradient when `prefers-reduced-motion` is enabled.
