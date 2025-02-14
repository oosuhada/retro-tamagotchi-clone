# Retro Tamagotchi Clone

A responsive browser recreation of the original P1 virtual-pet loop, keeping the three-button device interaction and generation-specific care rules at the center of the implementation.

## Current systems

- Egg → baby → child → teen → adult evolution flow
- P1 character profiles for wake/sleep schedules and minimum weight
- Character-specific hunger and happiness decay timing
- Attention deadline, care mistakes and discipline mistakes
- 25% discipline increments for valid discipline calls
- Meal and Snack behavior with classic heart/weight effects
- Five-round Left/Right game with character-specific win probability
- Character-specific sickness timing and medicine requirements
- Sleep/light care, waste, illness, aging and death
- A/B/C three-button navigation and A+C restart after death
- Persistent local save state

## Architecture

```text
domain/p1-character-profiles.js  P1 character data
domain/p1-device-engine.js       time/care/evolution simulation
care/                            feeding and Left/Right game screens
ui/                              device shell and three-button navigation
system/                          save/load storage
game.js                          Phaser presentation/state wiring
```

See `LOCAL_ARCHITECTURE.md` for more detail.

## Local development

Serve this directory with any static HTTP server and open `index.html`.

## Deployment

Production is served from `https://retro.oosu.dev/tamagotchi/`. The canonical repository is `oosuhada/retro-tamagotchi-clone`. GitHub `main` is the canonical release branch. The 800x800 game surface keeps its original coordinate system while scaling down or up to fit desktop, tablet, and mobile browser viewports.
