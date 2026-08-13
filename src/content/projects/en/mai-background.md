---
title: "MAI-Background"
slug: "mai-background"
category: "saas"
order: 37
excerpt: "Removes the background from a video, cutting the person out inside the browser itself: nothing is uploaded anywhere."
featured: false
published: true
year: 2026
status: "Lanzado"
cover: "/projects/mai-background/cover.webp"
coverAlt: "MAI-Background home page with the button to upload a video and remove its background"
demoUrl: "https://mai-background.pages.dev/"
repositoryUrl: "https://github.com/MAI-Software/MAI-Background"
technologies:
  - JavaScript
  - onnxruntime-web
  - WebGPU
services:
  - UI/UX design
  - PWA development
seoTitle: "MAI-Background — Remove a video background in the browser | MAI Software"
seoDescription: "Development of MAI-Background: cut people out of video and swap the background for transparency, colour, blur, an image or another video. Local, no uploads, free."
layoutVariant: "split-left"
---

## The brief

Removing a video background is one of those jobs that goes through either an expensive editor or a site that wants your file. Both are overkill when all you need is to cut a person out.

## The problem

Uploading a video to someone else's service means handing over material that often isn't yours, or that you're not ready to show. And the usual business model ends in a watermark, a queue or a subscription.

## The solution

The browser does the cutting. Pick a video and the model separates the person from the background, which can then become transparency, a colour, a blur, an image or even another video. Export comes out as WebM with the original audio intact.

It runs on **WebGPU** where the machine supports it, with a slower fallback where it doesn't. It installs as an app, works offline after the first load, and there's an Android APK too.

**No file leaves the device**: no server, no account, no uploads. The source is open.

## Outcome

Published and free. Today it works on videos you already have: recording straight from the camera isn't part of it.
