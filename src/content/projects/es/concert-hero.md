---
title: "Concert Hero"
slug: "concert-hero"
category: "game"
order: 15
excerpt: "Juego musical para PC donde el teclado es el piano: una octava cromática entera, las notas caen y tú tocas la melodía."
featured: false
published: true
year: 2026
status: "Prototipo"
cover: "/projects/concert-hero/cover.webp"
coverAlt: "Teclas de piano iluminadas en neón con el título Concert Hero"
gallery: []
demoUrl: "https://mai-concert.pages.dev/"
technologies:
  - TypeScript
  - Vite
  - Web Audio API
services:
  - Diseño de juego
  - Desarrollo web
seoTitle: "Concert Hero — Juego musical de piano para PC | MAI Softwares"
seoDescription: "Desarrollo de Concert Hero: juego de ritmo para PC donde el teclado del ordenador es el piano, con octava cromática completa y editor de partituras propio."
layoutVariant: "split-right"
---

## La idea

Un juego de ritmo para PC en el que no hay mando ni carriles de colores: **el teclado del ordenador es el piano**. Las notas caen por la pantalla y el jugador toca la melodía sobre una octava cromática completa — trece notas, blancas en letras y negras en números.

## El problema

Los juegos de ritmo suelen resolverse con cuatro o cinco carriles. Se aprenden rápido, pero no se parecen en nada a tocar un instrumento: el jugador memoriza posiciones, no notas.

## La solución

El motor razona con **acciones abstractas** (P01…P13) en lugar de con letras concretas, así que la misma partitura puede reasignarse a guitarra, bajo o batería sin tocar el núcleo del juego.

Sobre esa base, las reglas empujan a tocar de verdad:

- **Acertar no suena.** La melodía ya está en la canción; el premio es que el tema suene entero. Fallar sí suena a error y **baja el volumen** hasta que se vuelve a acertar.
- **Pulsar donde no hay nota cuenta como fallo.** Sin esa regla, machacar las trece teclas daba una actuación perfecta.
- **Los fallos en bloque castigan una sola vez.** Un acorde que se escapa es un error, no cinco: el medidor baja una vez por ventana de 0,18 s, aunque todos cuenten para la precisión.
- **Motivación**: cuando el medidor se llena, nueve segundos de puntuación doble y el público entregado.

Durante la partida solo se ve lo que sirve para tocar — puntuación, racha, multiplicador, Concert y Motivación. El desglose de juicios va en la pantalla de resultados, no de adorno en un lateral.

## Modos

**Juego rápido** para competir contra tus propias marcas y **Práctica**, que no te echa del escenario aunque el medidor llegue a cero: sirve para aprenderse la canción sin castigo.

## Estado

Prototipo jugable en el navegador, con editor de partituras propio y las marcas guardadas en el dispositivo. La estética es retro-futurista de neón.
