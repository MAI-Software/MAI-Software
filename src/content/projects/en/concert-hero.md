---
title: "Concert Hero"
slug: "concert-hero"
category: "game"
order: 15
excerpt: "PC music game where the keyboard is the piano: a full chromatic octave, falling notes and a melody you actually play."
featured: false
published: true
year: 2026
status: "Prototipo"
cover: "/projects/concert-hero/cover.webp"
coverAlt: "Neon-lit piano keys with the Concert Hero title"
gallery: []
demoUrl: "https://mai-concert.pages.dev/"
technologies:
  - TypeScript
  - Vite
  - Web Audio API
services:
  - Game design
  - Web development
seoTitle: "Concert Hero — PC piano music game | MAI Softwares"
seoDescription: "Building Concert Hero: a PC rhythm game where the computer keyboard becomes the piano, with a full chromatic octave and its own chart editor."
layoutVariant: "split-right"
---

## The idea

A rhythm game for PC with no gamepad and no coloured lanes: **the computer keyboard is the piano**. Notes fall down the screen and the player performs the melody across a full chromatic octave — thirteen notes, white keys on letters and black keys on numbers.

## The problem

Rhythm games usually settle for four or five lanes. They are quick to learn, but they feel nothing like playing an instrument: the player memorises positions, not notes.

## The solution

The engine reasons in **abstract actions** (P01…P13) rather than specific keys, so the same chart can be remapped to guitar, bass or drums without touching the core.

On top of that, the rules push you to actually play:

- **Hitting a note makes no sound.** The melody is already in the track; the reward is hearing the song stay whole. Missing does sound wrong, and **drops the music volume** until you land the next note.
- **Pressing a key where there is no note counts as a miss.** Without that rule, mashing all thirteen keys produced a perfect run.
- **Clustered misses only punish once.** A chord you fumble is one mistake, not five: the meter drops once per 0.18 s window, even though every miss still counts towards accuracy.
- **Motivation**: once the meter fills, nine seconds of double score and a crowd that loses it.

While playing, the screen only shows what helps you play — score, streak, multiplier, Concert and Motivation. The judgement breakdown lives on the results screen instead of decorating the side of the stage.

## Modes

**Quick play** to chase your own records, and **Practice**, which never throws you off stage even if the meter hits zero: it exists so you can learn the song without punishment.

## Status

A playable browser prototype with its own chart editor and records saved on the device. The look is retro-futurist neon.
