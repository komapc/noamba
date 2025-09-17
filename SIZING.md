# Sizing and Export Rules (v0.4.5)

This app uses width-based sizing for the editor and a fixed-width export.

- Canvas export width: 1200px (fixed). Height scales to preserve aspect ratio.
- High DPI capture: internally scaled for                                        output.
- Textarea width: fills available container width (screen width minus padding).
- Textarea height: clamped to [width/4, width*4/3].
- Export font size: exactly 32px. On-screen font size auto-adjusts so that after scaling, the exported image renders text at 32px.

Behavior:
- As the viewport changes, the textarea resizes, preserving the rules above.
- When typing, content is limited to `width*4/3`.
- The canvas matches the textarea visually and is scaled proportionally for export.
