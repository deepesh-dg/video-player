var videos;
(async () => {
    videos = await window.deepeshdg.videoPlayer({
        video: document.querySelector(".video"),
        // initialPlay: true,
        loop: true,
    });
})();
