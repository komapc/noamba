# Sizing and Export Rules (v0.4.0)

This app uses width-based sizing for the editor and a fixed-width export.

- Canvas export width: 1200px (fixed). Height scales to preserve aspect ratio.
- High DPI capture: internally scaled for crisp output.
- Textarea width: fills available container width (screen width minus padding).
- Textarea height: clamped to [width/6, width*4/3].
- Export font size: exactly 24px. On-screen font size auto-adjusts so that after scaling, the exported image renders text at 24px.

Behavior:
- As the viewport changes, the textarea resizes and reflows, preserving the rules above.
- When typing, if content would exceed `width*4/3`, input is truncated and background highlights the limit.
- The canvas preview matches the textarea visually and is scaled proportionally for export.
