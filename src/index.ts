import { BaseVideoPlayerOptions, VideoPlayer } from "./video-player";
import "./scss/video-player.scss";

type VideoPlayerConfigs = BaseVideoPlayerOptions & {
    video: HTMLVideoElement;
    videos?: HTMLVideoElement[];
};

Object.defineProperty(window, "deepeshdg", {
    value: {
        videoPlayer: async (options: VideoPlayerConfigs) => {
            if (options.video) {
                const videoPlayer = new VideoPlayer(options);
                return await videoPlayer.run();
            } else if (options.videos) {
                const response: any[] = [];

                for (let index = 0; index < options.videos.length; index++) {
                    options.video = options.videos[index];
                    const videoPlayer = new VideoPlayer(options);
                    response[index] = await videoPlayer.run();
                }

                return response;
            }

            return false;
        },
    },
    writable: false,
});
