type BaseVideoPlayerOptions = {
    videoContainer?: HTMLDivElement;
    initialPaused?: boolean;
};

type VideoPlayerOptions = BaseVideoPlayerOptions & {
    video: HTMLVideoElement;
};

type btn = {
    playPause?: HTMLElement | null;
    volume?: {
        mute?: HTMLElement | null;
        slider?: HTMLInputElement | null;
    };
    fullScreen?: HTMLElement | null;
    speed?: HTMLElement | null;
};

class VideoPlayer {
    // private cssUrl = "http://127.0.0.1:3000/static/css/video-player.css";
    private cssUrl =
        "https://res.cloudinary.com/deepeshgupta/raw/upload/v1657209347/deepeshgupta/video-player/css/video-player_djqlym.css";
    private classNames = {
        videoContainer: "deepeshdg-video-container",
        videoControlsContainer: "deepeshdg-video-controls-container",
        focusBtn: "focus-btn",
    };
    private icons = {
        play: `
            <svg class="play-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            </svg>
        `,
        pause: `
            <svg class="pause-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
            </svg>
        `,
        volume: {
            high: `
                <svg class="volume-high-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                </svg>
            `,
            low: `
                <svg class="volume-low-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
                </svg>
            `,
            muted: `
                <svg class="volume-muted-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
                </svg>
            `,
        },
        fullscreen: {
            open: `
                <svg class="open" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
            `,
            close: `
                <svg class="close" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                </svg>
            `,
        },
    };

    private video: HTMLVideoElement;
    private videoContainer?: HTMLDivElement | null;
    private videoControlsContainer?: HTMLDivElement | null;
    private btn: btn = {};

    private _isPaused = true;
    private _isMuted = false;
    private _isFullScreen = false;

    private initialPaused: boolean;

    constructor(options: VideoPlayerOptions) {
        this.video = options.video;
        this.videoContainer = options.videoContainer;
        this.initialPaused = options.initialPaused ?? true;
    }

    get isPaused(): boolean {
        return this._isPaused;
    }

    get isMuted(): boolean {
        return this._isMuted;
    }

    get isFullScreen(): boolean {
        return this._isFullScreen;
    }

    public play(event = false) {
        this._isPaused = false;
        this.videoContainer?.classList.remove("paused");
        if (!event) this.video.play();
    }

    public pause(event = false) {
        this._isPaused = true;
        this.videoContainer?.classList.add("paused");
        if (!event) this.video.pause();
    }

    public volumeLevel(level: "low" | "high" | "muted") {
        this.videoContainer?.setAttribute("data-volume-level", level);
    }

    public setVolume(volume: number) {
        if (volume > 0 && volume <= 1) {
            this.video.volume = volume;
            if (volume < 0.5) this.volumeLevel("low");
            else this.volumeLevel("high");
        } else if (volume <= 0) {
            this.video.volume = 0;
            this.mute();
        } else if (volume > 1) this.setVolume(1);

        if (this.video.volume > 0) this.unmute(true);
    }

    public mute(event = false) {
        this.volumeLevel("muted");
        if (!event) this.video.muted = true;
        this._isMuted = this.video.muted;
    }

    public unmute(event = false) {
        if (!event) {
            const currentVolume = Number(this.btn.volume?.slider?.value) ?? 0;
            this.setVolume(currentVolume);
        }
        this.video.muted = false;
        this._isMuted = this.video.muted;
    }

    public enterFullScreen(event = false) {
        if (!event) this.videoContainer?.requestFullscreen();
        this._isFullScreen = true;
        this.videoContainer?.classList.add("fullscreen");
    }

    public exitFullScreen(event = false) {
        if (!event) document.exitFullscreen();
        this._isFullScreen = false;
        this.videoContainer?.classList.remove("fullscreen");
    }

    public togglePlay() {
        this.isPaused ? this.play() : this.pause();
    }

    public toggleMute() {
        this.isMuted ? this.unmute() : this.mute();
    }

    public toggleFullScreen() {
        this.isFullScreen ? this.exitFullScreen() : this.enterFullScreen();
    }

    public initialPlay() {
        if (this.initialPaused) this.pause();
        else this.play();
    }

    private async _init() {
        const appendCSS = async () => {
            const styleElement = document.createElement("style");

            const styles = await fetch(this.cssUrl);
            styleElement.innerHTML = await styles.text();

            document.head.appendChild(styleElement);

            this.video.style.width = "100%";
            this.video.style.height = "100%";
        };

        const initVideoContainer = () => {
            if (!this.videoContainer) {
                this.videoContainer = document.createElement("div");
                this.videoContainer.classList.add(
                    this.classNames.videoContainer
                );

                this.video.before(this.videoContainer);
                this.videoContainer.appendChild(this.video);
            } else
                this.videoContainer.classList.add(
                    this.classNames.videoContainer
                );

            const focusButton = document.createElement("button");
            focusButton.classList.add(this.classNames.focusBtn);
            this.videoContainer.appendChild(focusButton);

            this.volumeLevel("high");
        };

        const initVideoControllers = () => {
            this.videoControlsContainer = document.createElement("div");
            this.videoControlsContainer.classList.add(
                this.classNames.videoControlsContainer
            );

            this.videoControlsContainer.innerHTML = `
                <div class="mouse-event-zone"></div>
                <div class="controllers">
                    <div class="timeline-controller"></div>
                    <div class="controls">
                        <div class="left">
                            <button class="icon-btn play-pause-btn">${this.icons.play}${this.icons.pause}</button>
                            <div class="volume-container">
                                <button class="icon-btn mute-btn">
                                    ${this.icons.volume.high}
                                    ${this.icons.volume.low}
                                    ${this.icons.volume.muted}
                                </button>
                                <input class="volume-slider" type="range" min="0" max="1" step="any" value="1">
                            </div>
                        </div>
                        <div class="right">
                            <button class="icon-btn fullscreen-btn">
                                ${this.icons.fullscreen.open}
                                ${this.icons.fullscreen.close}
                            </button>
                        </div>
                    </div>
                </div>
            `;

            this.btn.playPause = this.videoControlsContainer.querySelector(
                ".icon-btn.play-pause-btn"
            );
            this.btn.volume = {
                mute: this.videoControlsContainer.querySelector<HTMLElement>(
                    ".icon-btn.mute-btn"
                ),
                slider: this.videoControlsContainer.querySelector<HTMLInputElement>(
                    `input.volume-slider[type="range"]`
                ),
            };

            this.btn.fullScreen =
                this.videoControlsContainer.querySelector<HTMLElement>(
                    `.icon-btn.fullscreen-btn`
                );

            this.videoContainer?.appendChild(this.videoControlsContainer);
        };

        await appendCSS();
        initVideoContainer();
        initVideoControllers();
    }

    public async run() {
        await this._init();
        this.initialPlay();

        const mouseEvents = () => {
            this.videoControlsContainer
                ?.querySelector(`.controllers`)
                ?.addEventListener("mouseover", () => {
                    this.videoContainer?.classList.add("hover");
                });
            this.videoControlsContainer
                ?.querySelector(`.controllers`)
                ?.addEventListener("mouseout", () => {
                    this.videoContainer?.classList.remove("hover");
                });

            this.videoControlsContainer
                ?.querySelector(".mouse-event-zone")
                ?.addEventListener("click", () => {
                    this.togglePlay();
                    this.videoContainer
                        ?.querySelector<HTMLButtonElement>(
                            `.${this.classNames.focusBtn}`
                        )
                        ?.focus();
                });

            this.videoControlsContainer
                ?.querySelector(".mouse-event-zone")
                ?.addEventListener("dblclick", () => {
                    this.toggleFullScreen();
                });
        };

        const controllersEvents = () => {
            this.btn.playPause?.addEventListener("click", () =>
                this.togglePlay()
            );

            this.btn.volume?.mute?.addEventListener("click", () =>
                this.toggleMute()
            );

            this.btn.volume?.slider?.addEventListener("input", (e) => {
                const target = e.target as HTMLInputElement;

                this.setVolume(Number(target.value));
            });

            this.btn.fullScreen?.addEventListener("click", () =>
                this.toggleFullScreen()
            );
        };

        const keyboardEvents = () => {
            document.body.addEventListener("keypress", (ev) => {
                const noEventTags = ["input", "textarea", "select"];
                const noEventClass = [""];
                const activeTag =
                    document.activeElement?.tagName.toLowerCase() ?? "";
                const activeClass =
                    document.activeElement?.className.split(" ") ?? [];
                if (noEventTags.indexOf(activeTag) > -1) return;
                for (let i = 0; i < activeClass.length; i++) {
                    const className = activeClass[i];
                    if (noEventClass.indexOf(className) > -1) return;
                }

                const activeVideoValidate = (): boolean => {
                    if (this.videoContainer?.contains(document.activeElement))
                        return true;
                    return false;
                };

                switch (ev.key.toLowerCase()) {
                    case " ":
                        for (let i = 0; i < activeClass.length; i++) {
                            const className = activeClass[i];
                            if (className === "icon-btn") return;
                        }
                        if (activeVideoValidate()) this.togglePlay();
                        break;
                    case "k":
                        if (activeVideoValidate()) this.togglePlay();
                        break;
                    case "f":
                        if (activeVideoValidate()) this.toggleFullScreen();
                        break;
                    case "m":
                        if (activeVideoValidate()) this.toggleMute();
                        break;
                    default:
                        break;
                }
            });
        };

        const videoEvents = () => {
            this.video.addEventListener("play", () => this.play());
            this.video.addEventListener("pause", () => this.pause());
            this.video.addEventListener("volumechange", () => {
                if (this.video.muted) {
                    this.mute(true);
                    return;
                }
                if (!this.video.muted) this.unmute(true);
                this.setVolume(this.video.volume);
            });
            document.addEventListener("fullscreenchange", () => {
                if (document.fullscreenElement) this.enterFullScreen(true);
                else this.exitFullScreen(true);
            });
        };

        mouseEvents();
        keyboardEvents();
        controllersEvents();
        videoEvents();

        return this;
    }
}

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
