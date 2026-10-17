# Simulation mode

Simulation is intentionally isolated under `users/{uid}/simulation/` or a separate Firebase development project. Set a visible `mode: "simulation"` marker and never update `totalSavings` from simulated input. Simulate detected, duplicate, unknown-pulse, invalid-weight, verified, and unverified events against a test namespace only.
