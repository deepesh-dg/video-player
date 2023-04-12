# Video Player

A frontend web video player.

🏠 [Live Preview](https://video-player.deepeshdg.com/)

---

## Installation

CDN JavaScript

```bash
https://cdn.jsdelivr.net/gh/deepesh-dg/video-player/public/video-player.bundle.js
```

## Initialize

```bash
const video = window.deepeshdg.videoPlayer({
    video: document.querySelector("video"),
    loop: true,
});
```

### For Multiple

```bash
const videos = window.deepeshdg.videoPlayer({
    videos: document.querySelectorAll("video"),
    loop: true,
});
```

## Sample image

## ![Sample Image](https://res.cloudinary.com/deepeshgupta/image/upload/v1657291974/deepeshgupta/video-player/images/sample_ynqo63.png)

## Features

-   Press `space` or `k` for `Play / Pause`.

-   Press `j` or `left arrow` for `backward` 10s and 5s respectively.

-   Press `l` or `right arrow` for `forward` 10s and 5s respectively.

-   Press `up arrow` and `down arrow` for `volumn up` and `volumn down` 5% respectively.

-   Press `m` for toggle `Mute`.

-   Press `f` or `double click` Mouse on Screen for toggle `Full Screen`.

-   Press `0 - 9` to skip Video Duration Accordingly.

-   `click` Mouse on anywhere on Video above controllers for `Play / Pause`.

### Boom, You are good to go...

Developed By - [_Deepesh Gupta_](https://deepeshdg.com/)
