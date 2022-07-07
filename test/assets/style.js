var videos;
(async () => {
    videos = await window.deepeshdg.videoPlayer({
        videos: document.querySelectorAll(".video"),
        initialPaused: true,
    });
})();
