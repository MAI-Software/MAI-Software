---
title: "MAI-Background"
slug: "mai-background"
category: "saas"
order: 37
excerpt: "Quita el fondo de un vídeo con la persona recortada dentro del propio navegador: nada se sube a ningún servidor."
featured: false
published: true
year: 2026
status: "Lanzado"
cover: "/projects/mai-background/cover.webp"
coverAlt: "Portada de MAI-Background con el botón para subir un vídeo y quitar el fondo"
demoUrl: "https://mai-background.pages.dev/"
repositoryUrl: "https://github.com/MAI-Software/MAI-Background"
technologies:
  - JavaScript
  - onnxruntime-web
  - WebGPU
services:
  - Diseño UI/UX
  - Desarrollo PWA
seoTitle: "MAI-Background — Quitar el fondo de un vídeo en el navegador | MAI Software"
seoDescription: "Desarrollo de MAI-Background: recorta personas en vídeo y cambia el fondo por transparencia, color, desenfoque, imagen u otro vídeo. Local, sin subidas y gratis."
layoutVariant: "split-left"
---

## El encargo

Quitar el fondo de un vídeo es de esas cosas que o pasan por un editor caro o por una web que te pide subir el archivo. Las dos opciones sobran cuando lo único que quieres es recortar a una persona.

## El problema

Subir un vídeo a un servicio ajeno es entregar material que muchas veces no es tuyo, o que todavía no quieres enseñar. Y el modelo de negocio habitual acaba en marca de agua, cola de espera o suscripción.

## La solución

El recorte lo hace el propio navegador. Se elige un vídeo y el modelo separa a la persona del fondo, que se puede sustituir por transparencia, un color, un desenfoque, una imagen o incluso otro vídeo. La exportación sale en WebM conservando el audio original.

Corre sobre **WebGPU** cuando el equipo lo soporta, con una vía alternativa más lenta cuando no. Se instala como aplicación, funciona sin conexión después de la primera carga y también hay APK de Android.

**Ningún archivo sale del dispositivo**: no hay servidor, ni cuenta, ni subidas. El código está abierto.

## Resultado

Publicada y gratuita. Hoy trabaja sobre vídeos que ya tienes: grabar directamente desde la cámara no está incluido.
