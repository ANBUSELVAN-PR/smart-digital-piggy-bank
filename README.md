# Smart Digital Piggy Bank

An ANBU SELVAN project for an ESP32, HX711 load cell, programmable coin acceptor, Firebase Realtime Database, and an authenticated web dashboard.

GitHub owner: [ANBUSELVAN-PR](https://github.com/ANBUSELVAN-PR)

## Features

- Firebase email/password authentication and user-scoped realtime dashboard.
- Verified savings balance, target progress, measured weight, latest coin, device/sensor status, deposit history, and empty/error states.
- Configurable ESP32 MicroPython reference files for INR 1, 2, 5, and 10 coin denominations.
- Pulse mapping and weight-tolerance helpers with automated tests.
- Isolated simulation guidance; simulated data must never update real savings.
- Firebase rules protecting user boundaries and balance/count fields from direct client writes.

## Technology stack

Vanilla HTML/CSS/JavaScript ES modules, Firebase Web SDK 10.8.1, Firebase Authentication, Firebase Realtime Database, Chart.js, ESP32 MicroPython, and HX711 hardware.

## Project structure

```text
index.html                 Web dashboard
style.css                  Dashboard styles
app.js                     Firebase auth and realtime UI logic
firebase-config.example.js Firebase configuration template
database.rules.json        Rules template for review before deployment
firmware/esp32/             ESP32 reference firmware and configuration
simulation/                 Simulation isolation guidance
tests/                      Automated logic tests
.gitignore                 Secret/build exclusions
README.md                  This guide
```

## Firebase setup

Each developer must use their own Firebase project. Do not use credentials copied from another project.

1. Open https://console.firebase.google.com/.
2. Create a Firebase project.
3. Enable Email/Password authentication.
4. Create a Realtime Database.
5. Register a web application in the Firebase project.
6. Copy `firebase-config.example.js` to `firebase-config.js`.
7. Replace every placeholder with that project's Firebase web configuration.
8. Review and configure `database.rules.json` for the actual database structure and security requirements.
9. Serve the project using a local web server, for example `python -m http.server 8080`.
10. Test authentication and dashboard functionality at `http://localhost:8080`.

The app refuses to initialize when `firebase-config.js` is missing or still contains placeholders. Firebase web API keys are generally public identifiers rather than administrative secrets, but configure API restrictions, authentication, and database security rules appropriately. Never put service-account credentials or private keys in frontend code.

The existing Firebase rules are user-scoped, but they are a template that must be reviewed and deployed deliberately. If deposits and balances must be trusted, use a trusted backend or Cloud Function to validate device events and update protected totals; frontend code and database rules alone are not sufficient for that accounting trust boundary.

## ESP32 firmware

Copy `firmware/esp32/config.example.py` to a private `config.py`. Set Wi-Fi, restricted device authentication, GPIO pins, calibration factor, tolerance, reporting interval, and the actual coin acceptor pulse mapping. The example mapping is not universal: configure and calibrate the selected acceptor first. Use safe voltage levels and common ground when wiring the HX711 and acceptor.

The firmware files are a reference implementation. Physical drivers, Firebase device transport, durable event queue, calibration, and hardware operation remain pending and are not claimed as tested.

## Simulation

Use a separate Firebase development project or `users/{uid}/simulation/` namespace. Set `mode: "simulation"` so the dashboard labels it. Exercise duplicate events, unknown pulse counts, invalid readings, verified events, and unverified events without changing `totalSavings`.

## Testing

Run `python -m unittest discover -s tests`. The tests cover pulse mapping and weight tolerance helpers only. They do not prove physical hardware, Firebase deployment, security rules, or browser rendering.

## Limitations

- No physical ESP32, coin acceptor, or load-cell calibration has been completed.
- The exact coin pulse mapping depends on the selected acceptor.
- Trusted server-side accounting and restricted device authentication still require project-specific implementation.
- Firebase rules must be reviewed and deployed manually to a development project before production use.
- No GitHub upload, Git initialization, commit, or push has been performed.
