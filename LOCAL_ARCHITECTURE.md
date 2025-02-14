# Local P1 device reconstruction architecture

This checkout preserves the upstream repository history. Local commits separate the original P1 rules from the Phaser presentation layer.

- `js/domain/p1-character-profiles.js`: per-character wake/sleep, heart decay, sickness, medicine, minimum weight, evolution and game probabilities.
- `js/domain/p1-device-engine.js`: elapsed-time simulation, attention, discipline, care mistakes, sickness, growth and death.
- `js/care/feeding-screen.js`: original-style Meal/Snack behavior.
- `js/care/left-right-game.js`: five-round P1 Left/Right game.
- `js/ui/device-shell.js`: A/B/C device navigation.
- `js/system/save-storage.js`: persistence and migration of old saves.

Phaser is now primarily a renderer/input shell around the P1 rules engine, so the care model can be reasoned about independently from the screen state code.
