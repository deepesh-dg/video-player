# Video Player

A frontend web video player.

## Installation

CDN JavaScript

```bash
https://res.cloudinary.com/deepeshgupta/raw/upload/v1657472610/deepeshgupta/video-player/js/video-player-0.0.23_xll8pb.js
```

## Initialize

```bash
var myVideo;
(async () => {
    myVideo = await window.deepeshdg.videoPlayer({
        video: document.querySelector("video"),
        loop: true,
    });
})();
```

### For Multiple

```bash
var myVideos;
(async () => {
    myVideos = await window.deepeshdg.videoPlayer({
        videos: document.querySelectorAll("video"),
        loop: true,
    });
})();
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

-   `click` Mouse on anywhere on Video above controllers for `Play / Pause`.

### Boom, You are good to go...

## ![Deepesh Gupta](https://res.cloudinary.com/deepeshgupta/image/upload/v1657209567/deepeshgupta/facebook_cover_tsvhy3.png)

Developed By - _Deepesh Gupta_

---

## License

[MIT](https://choosealicense.com/licenses/mit/)
