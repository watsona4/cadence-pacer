
# Bike Cadence Pacer

This is a Progressive Web App (PWA) for indoor cycling cadence pacing. It helps you maintain a consistent rhythm by playing alternating sounds ("tick-tock-tock-tock") at a configurable RPM (revolutions per minute).

## 🚴 Features

- Tick-tock beat corresponding to left-right pedal strokes (2 beats per revolution)
- Start/Stop cadence control
- Set RPM smoothly transitions over 5 seconds
- Stand Up mode (switch to 60 RPM temporarily)
- Cooldown mode:
  - Gradual RPM drop from current → 80 → 70
  - Holds 70 RPM for last 10% of cooldown
- Dark mode toggle with preference persistence
- Mobile optimized and PWA installable

## 📦 Files

- `index.html` — Main app UI and logic
- `service-worker.js` — PWA offline support
- `manifest.json` — PWA metadata
- `tick.wav`, `tock.wav`, `chime.wav` — Audio cues
- `favicon.ico` & PNG icons — App icons for platforms
- `Dockerfile` — Container image for serving app
- `docker-compose.yml` — Launch with NGINX server

## 🚀 Running the App in Docker

Ensure you have `tick.wav`, `tock.wav`, and `chime.wav` in the same directory.

```bash
docker-compose up --build
```

Visit your app at: `http://localhost:8223`

## 🔧 Apache Reverse Proxy Sample

```apacheconf
ProxyPass "/cadence" "http://0.0.0.0:8223"
ProxyPassReverse "/cadence" "http://0.0.0.0:8223"
```

## 📱 PWA Installation

- On iOS/Android Chrome: “Add to Home Screen”
- Fully offline-capable after first load

## 🌓 Optional

- Visual beat indicator was tested and removed based on user feedback
- Buttons and labels are styled with Bootstrap for mobile friendliness

---

MIT License – Customize and deploy as needed!
