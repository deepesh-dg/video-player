interface IDocument extends Document {
    cancelFullScreen?: () => void;
    webkitExitFullScreen?: () => void;
    webkitCancelFullScreen?: () => void;
    mozCancelFullScreen?: () => void;
    mozFullScreenElement?: HTMLElement | null | undefined;
    webkitFullscreenElement?: HTMLElement | null | undefined;
    webkitIsFullScreen?: boolean;
    mozFullScreen?: boolean;
    msFullscreenElement?: HTMLElement | null | undefined;
}

interface IHTMLDivElement extends HTMLDivElement {
    webkitRequestFullScreen?: () => void;
    mozRequestFullScreen?: () => void;
}

export type BaseVideoPlayerOptions = {
    videoContainer?: IHTMLDivElement;
    initialPlay?: boolean;
    initialMuted?: boolean;
    loop?: boolean;
};

type VideoPlayerOptions = BaseVideoPlayerOptions & {
    video: HTMLVideoElement;
};

type Btn = {
    playPause?: HTMLElement | null;
    volume?: {
        mute: HTMLElement | null;
        slider: HTMLInputElement | null;
    };
    fullScreen?: HTMLElement | null;
    speed?: HTMLElement | null;
    duration?: {
        currentTime: HTMLElement | null;
        totalTime: HTMLElement | null;
    };
    timeline?: {
        timeline?: HTMLInputElement | null;
        jumpto?: HTMLDivElement | null;
    };
    notification?: {
        container?: HTMLDivElement | null;
        top?: HTMLDivElement | null;
        center?: HTMLDivElement | null;
        centerLeft?: HTMLDivElement | null;
        centerRight?: HTMLDivElement | null;
        bottom?: HTMLDivElement | null;
        on?: NodeJS.Timeout | null;
    };
};

type Events = {
    loadedData: Event;
    play: Event;
    pause: Event;
    mute: Event;
    unmute: Event;
    volume: Event;
    fullScreenIn: Event;
    fullScreenOut: Event;
    timeUpdate: Event;
    playbackSpeed: Event;
    // caption: Event;
    // pictureInPicture: Event;
};

function calcSliderPos(e: MouseEvent) {
    const el = e.target as HTMLInputElement;
    return {
        mouseLocation: e.offsetX,
        value:
            (e.offsetX / el.clientWidth) *
            parseInt(el.getAttribute("max") ?? "0", 10),
    };
}

export class VideoPlayer {
    private readonly classNames = {
        videoContainer: "deepeshdg-video-container",
        videoControlsContainer: "deepeshdg-video-controls-container",
    };
    private readonly icons = {
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
        forward: `
            <svg viewBox="0 0 512 512">
                <path fill="currentColor" d="M500.5 231.4l-192-160C287.9 54.3 256 68.6 256 96v320c0 27.4 31.9 41.8 52.5 24.6l192-160c15.3-12.8 15.3-36.4 0-49.2zm-256 0l-192-160C31.9 54.3 0 68.6 0 96v320c0 27.4 31.9 41.8 52.5 24.6l192-160c15.3-12.8 15.3-36.4 0-49.2z"/>
            </svg>
        `,
        backward: `
            <svg viewBox="0 0 512 512">
                <path fill="currentColor" d="M11.5 280.6l192 160c20.6 17.2 52.5 2.8 52.5-24.6V96c0-27.4-31.9-41.8-52.5-24.6l-192 160c-15.3 12.8-15.3 36.4 0 49.2zm256 0l192 160c20.6 17.2 52.5 2.8 52.5-24.6V96c0-27.4-31.9-41.8-52.5-24.6l-192 160c-15.3 12.8-15.3 36.4 0 49.2z"/>
            </svg>
        `,
    };

    /**
     * Properties of necessary DOM Elements
     */
    private video: HTMLVideoElement;
    private videoContainer?: IHTMLDivElement | null;
    private videoControlsContainer?: IHTMLDivElement | null;
    private btn: Btn = {};

    /**
     * Metadata of Video
     */
    private isPaused = true;
    private isMuted = false;
    private isFullScreen = false;
    private volume = 1;
    private currentTime = 0;
    private totalTime?: number;

    /**
     * Custom Events
     */
    private events: Events;

    /**
     * Initial State of Video
     */
    private initialPlay: boolean;
    private initialMuted: boolean;
    private loop: boolean;

    /**
     * Extended Document Object
     */
    private document = document as IDocument;

    constructor(options: VideoPlayerOptions) {
        this.video = options.video;
        this.videoContainer = options.videoContainer;
        this.initialPlay = options.initialPlay ?? false;
        this.initialMuted = options.initialMuted ?? false;
        this.loop = options.loop ?? false;

        /**
         * Creating Custom Events
         */
        this.events = {
            loadedData: new CustomEvent("loadeddata"),
            play: new CustomEvent("play"),
            pause: new CustomEvent("pause"),
            mute: new CustomEvent("mute"),
            unmute: new CustomEvent("unmute"),
            volume: new CustomEvent("volume"),
            timeUpdate: new CustomEvent("timeupdate"),
            fullScreenIn: new CustomEvent("fullscreenin"),
            fullScreenOut: new CustomEvent("fullscreenout"),
            playbackSpeed: new CustomEvent("playbackspeed"),
        };
    }

    public on(
        eventName:
            | "loadeddata"
            | "play"
            | "pause"
            | "mute"
            | "unmute"
            | "volume"
            | "timeupdate"
            | "fullscreenin"
            | "fullscreenout"
            | "playbackspeed",
        listener: (e: Event) => void
    ) {
        this.videoContainer?.addEventListener(eventName, listener);
    }

    public registerCustomEvents() {
        this.on("loadeddata", () => {
            this.totalTime = this.video.duration;

            if (this.btn.duration?.currentTime)
                this.btn.duration.currentTime.textContent =
                    this.getCurrentTime();
            if (this.btn.duration?.totalTime)
                this.btn.duration.totalTime.textContent = this.getTotalTime();

            if (
                this.currentTime >= 0 &&
                this.totalTime >= 0 &&
                this.btn.timeline
            ) {
                if (this.btn.timeline.timeline)
                    this.btn.timeline.timeline.value = (
                        (this.currentTime / this.totalTime) *
                        100
                    ).toString();
            }
        });

        this.on("play", (e) => {
            const videoContainer = e.target as IHTMLDivElement;
            videoContainer.classList.remove("paused");

            if (this.currentTime === this.totalTime && this.loop)
                this.currentTime = 0;

            if (this.video.paused) this.video.play();
            this.isPaused = this.video.paused;

            this.sendNotification("center", "playpause");
        });

        this.on("pause", (e) => {
            const videoContainer = e.target as IHTMLDivElement;
            videoContainer.classList.add("paused");

            if (!this.video.paused) this.video.pause();
            this.isPaused = this.video.paused;

            this.sendNotification("center", "playpause");
        });

        this.on("mute", () => {
            this.volumeLevel("muted");
            if (!this.video.muted) this.video.muted = true;
            this.isMuted = this.video.muted;

            this.sendNotification("center", "mute");
        });

        this.on("unmute", () => {
            if (this.volume <= 0)
                this.volume =
                    Number(this.btn.volume?.slider?.value) > 0
                        ? Number(this.btn.volume?.slider?.value)
                        : 0;

            if (this.video.muted) this.video.muted = false;
            this.isMuted = this.video.muted;

            this.sendNotification("center", "volumechange");
        });

        this.on("volume", () => {
            if (this.volume < 0) {
                this.video.volume = 0;
                this.volume = this.video.volume;
            }

            if (this.volume === 0) {
                this.mute();
                /**
                 * Assigning Volume Value to Input Range to reflect in Frontend
                 */
                if (this.btn.volume?.slider)
                    this.btn.volume.slider.value = this.volume.toString();
                return;
            }

            if (this.video.muted) this.unmute();

            if (this.volume > 1) this.volume = 1;

            this.video.volume = this.volume;
            if (this.volume <= 0.5) this.volumeLevel("low");
            else this.volumeLevel("high");

            /**
             * Assigning Volume Value to Input Range to reflect in Frontend
             */
            if (this.btn.volume?.slider)
                this.btn.volume.slider.value = this.volume.toString();

            this.sendNotification("center", "volumechange");
        });

        this.on("timeupdate", () => {
            if (this.currentTime < 0) this.currentTime = 0;
            if (this.totalTime && this.currentTime > this.totalTime) {
                if (this.loop) this.currentTime = 0;
                else this.currentTime = this.totalTime;
            }

            if (Math.abs(this.currentTime - this.video.currentTime) >= 1)
                this.video.currentTime = this.currentTime;
            else this.currentTime = this.video.currentTime;

            this.trigger("loadeddata");
        });

        this.on("fullscreenin", (e) => {
            const videoContainer = e.target as IHTMLDivElement;
            if (!this.document.fullscreenElement) {
                if (videoContainer.requestFullscreen)
                    videoContainer.requestFullscreen();
                else if (videoContainer.webkitRequestFullScreen)
                    videoContainer.webkitRequestFullScreen();
                else if (videoContainer.mozRequestFullScreen)
                    videoContainer.mozRequestFullScreen();
            }
            this.isFullScreen = true;
            videoContainer.classList.add("fullscreen");
        });

        this.on("fullscreenout", (e) => {
            const videoContainer = e.target as HTMLDivElement;
            if (
                this.document.fullscreenElement ||
                this.document.webkitIsFullScreen ||
                this.document.mozFullScreen ||
                this.document.msFullscreenElement
            ) {
                if (this.document.exitFullscreen)
                    this.document.exitFullscreen();
                else if (this.document.webkitExitFullScreen)
                    this.document.webkitExitFullScreen();
                else if (this.document.webkitCancelFullScreen)
                    this.document.webkitCancelFullScreen();
                else if (this.document.mozCancelFullScreen)
                    this.document.mozCancelFullScreen();
                else if (this.document.cancelFullScreen)
                    this.document.cancelFullScreen();
            }
            this.isFullScreen = false;
            videoContainer.classList.remove("fullscreen");
        });
    }

    public trigger(
        eventName:
            | "loadeddata"
            | "play"
            | "pause"
            | "mute"
            | "unmute"
            | "volume"
            | "timeupdate"
            | "fullscreenin"
            | "fullscreenout"
            | "playbackspeed"
    ) {
        let event: Event;

        switch (eventName) {
            case "loadeddata":
                event = this.events.loadedData;
                break;
            case "play":
                event = this.events.play;
                break;
            case "pause":
                event = this.events.pause;
                break;
            case "mute":
                event = this.events.mute;
                break;
            case "unmute":
                event = this.events.unmute;
                break;
            case "volume":
                event = this.events.volume;
                break;
            case "timeupdate":
                event = this.events.timeUpdate;
                break;
            case "fullscreenin":
                event = this.events.fullScreenIn;
                break;
            case "fullscreenout":
                event = this.events.fullScreenOut;
                break;
            case "playbackspeed":
                event = this.events.playbackSpeed;
                break;
            default:
                return;
                break;
        }

        this.videoContainer?.dispatchEvent(event);
    }

    public getCurrentTime() {
        return this.formatDuration(this.currentTime);
    }

    public getTotalTime() {
        return this.formatDuration(this.totalTime ?? 0);
    }

    public skip(howMuch: number) {
        this.currentTime += howMuch;
        this.trigger("timeupdate");
    }

    public formatDuration(time: number): string {
        const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
            minimumIntegerDigits: 2,
        });

        const seconds = Math.floor(time) % 60;
        const minutes = Math.floor(time / 60) % 60;
        const hours = Math.floor(time / 3600);

        if (hours === 0)
            return `${minutes}:${leadingZeroFormatter.format(seconds)}`;

        return `${hours}:${leadingZeroFormatter.format(
            minutes
        )}:${leadingZeroFormatter.format(seconds)}`;
    }

    public play() {
        this.trigger("play");
    }

    public pause() {
        this.trigger("pause");
    }

    public volumeLevel(level: "low" | "high" | "muted") {
        this.videoContainer?.setAttribute("data-volume-level", level);
    }

    public setVolume(volume: number, percent = false) {
        if (percent) {
            let volumeInPercent = Math.floor(this.volume * 100);

            volumeInPercent -= volumeInPercent % 5;

            volumeInPercent += volume;

            this.volume = Math.floor(volumeInPercent) / 100;
        } else this.volume = volume < 0 ? 0 : volume;
        this.trigger("volume");
    }

    public mute() {
        this.trigger("mute");
    }

    public unmute() {
        this.trigger("unmute");
    }

    public enterFullScreen() {
        this.trigger("fullscreenin");
    }

    public exitFullScreen() {
        this.trigger("fullscreenout");
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

    public autoPlay() {
        if (this.initialPlay) this.play();
        else this.pause();
    }

    public sendNotification(
        where: "top" | "center" | "centerLeft" | "centerRight" | "bottom",
        type: "playpause" | "volumechange" | "mute" | "forward" | "backward",
        timeout = 600
    ) {
        if (!this.btn.notification) return;
        const el = this.btn.notification[where];
        if (!el) return;

        const hide = () => {
            el.classList.remove("show");
        };

        const show = () => {
            el.classList.add("show");
        };

        if (this.btn.notification.on) {
            clearTimeout(this.btn.notification.on);
            hide();
        }

        switch (type) {
            case "playpause":
                if (this.isPaused)
                    el.innerHTML = `<span>${this.icons.pause}</span>`;
                else el.innerHTML = `<span>${this.icons.play}</span>`;
                show();
                break;
            case "volumechange":
                el.innerHTML = `<span class="text">${Math.floor(
                    this.volume * 100
                )}%</span>`;
                show();
                break;
            case "mute":
                if (this.isMuted)
                    el.innerHTML = `<span>${this.icons.volume.muted}</span>`;
                show();
                break;
            case "forward":
                el.innerHTML = `<span>${this.icons.forward}</span>`;
                break;
            case "backward":
                el.innerHTML = `<span>${this.icons.backward}</span>`;
                break;
            default:
                break;
        }

        this.btn.notification.on = setTimeout(hide, timeout);
    }

    private _init() {
        const appendCSS = () => {
            this.video.style.width = "100%";
            this.video.style.height = "100%";
        };

        const initVideoContainer = () => {
            if (!this.videoContainer) {
                this.videoContainer = this.document.createElement("div");
                this.videoContainer.classList.add(
                    this.classNames.videoContainer
                );

                this.video.before(this.videoContainer);
                this.videoContainer.appendChild(this.video);
            } else
                this.videoContainer.classList.add(
                    this.classNames.videoContainer
                );

            this.videoContainer.setAttribute("tabindex", "0");

            this.volumeLevel("high");
        };

        const initVideoControllers = () => {
            this.videoControlsContainer = this.document.createElement("div");
            this.videoControlsContainer.classList.add(
                this.classNames.videoControlsContainer
            );

            this.videoControlsContainer.innerHTML = `
                <div class="notifications">
                    <div class="notification-container">
                        <div class="top">
                            <div class="notification"></div>
                        </div>
                        <div class="center">
                            <div class="notification"></div>
                        </div>
                        <div class="centerLeft">
                            <div class="notification"></div>
                        </div>
                        <div class="centerRight">
                            <div class="notification"></div>
                        </div>
                        <div class="bottom">
                            <div class="notification"></div>
                        </div>
                    </div>
                </div>
                <div class="mouse-event-zone"></div>
                <div class="controllers">
                    <div class="timeline-controller">
                        <div class="timeline-slider-container">
                            <input class="timeline-slider" type="range" min="0" max="100" step="any" value="0"/>
                            <div class="jump-duration">0:00</div>
                        </div>
                    </div>
                    <div class="controls">
                        <div class="left">
                            <div class="play-pause-btn-container">
                                <button class="icon-btn play-pause-btn">${
                                    this.icons.play
                                }${this.icons.pause}</button>
                            </div>
                            <div class="volume-container">
                                <button class="icon-btn mute-btn">
                                    ${this.icons.volume.high}
                                    ${this.icons.volume.low}
                                    ${this.icons.volume.muted}
                                </button>
                                <input class="volume-slider" type="range" min="0" max="1" step="0.01" value="1"/>
                            </div>
                            <div class="duration-container">
                                <div class="current-time">${this.getCurrentTime()}</div>
                                /
                                <div class="total-time">${this.getTotalTime()}</div>
                            </div>
                        </div>
                        <div class="right">
                            <div class="fullscreen-btn-container">
                                <button class="icon-btn fullscreen-btn">
                                    ${this.icons.fullscreen.open}
                                    ${this.icons.fullscreen.close}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            /**
             * Assigning Controllers
             */
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
            this.btn.duration = {
                currentTime:
                    this.videoControlsContainer.querySelector<HTMLElement>(
                        ".current-time"
                    ),
                totalTime:
                    this.videoControlsContainer.querySelector<HTMLElement>(
                        ".total-time"
                    ),
            };
            this.btn.fullScreen =
                this.videoControlsContainer.querySelector<HTMLElement>(
                    `.icon-btn.fullscreen-btn`
                );
            this.btn.timeline = {
                timeline:
                    this.videoControlsContainer.querySelector<HTMLInputElement>(
                        ".timeline-slider"
                    ),
                jumpto: this.videoControlsContainer.querySelector<HTMLDivElement>(
                    ".jump-duration"
                ),
            };
            this.btn.notification = {
                container:
                    this.videoControlsContainer.querySelector<HTMLDivElement>(
                        ".notifications"
                    ),
                top: this.videoControlsContainer.querySelector<HTMLDivElement>(
                    ".notifications .top .notification"
                ),
                center: this.videoControlsContainer.querySelector<HTMLDivElement>(
                    ".notifications .center .notification"
                ),
                centerLeft:
                    this.videoControlsContainer.querySelector<HTMLDivElement>(
                        ".notifications .centerLeft .notification"
                    ),
                centerRight:
                    this.videoControlsContainer.querySelector<HTMLDivElement>(
                        ".notifications .centerRight .notification"
                    ),
                bottom: this.videoControlsContainer.querySelector<HTMLDivElement>(
                    ".notifications .bottom .notification"
                ),
            };

            this.videoContainer?.appendChild(this.videoControlsContainer);
        };

        appendCSS();
        initVideoContainer();
        initVideoControllers();
    }

    public run() {
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
                ?.addEventListener("click", () => this.togglePlay());

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

            this.btn.timeline?.timeline?.addEventListener("input", (e) => {
                const target = e.target as HTMLInputElement;
                this.currentTime =
                    (Number(this.totalTime) * Number(target.value)) / 100;
                this.trigger("timeupdate");
            });

            // this.btn.timeline?.timeline?.addEventListener("mouseover", (e) => {
            //     if (this.btn.timeline?.jumpto) {
            //         this.btn.timeline.jumpto.classList.add("visible");
            //     }
            // });

            // this.btn.timeline?.timeline?.addEventListener("mouseleave", (e) => {
            //     if (this.btn.timeline?.jumpto) {
            //         this.btn.timeline.jumpto.classList.remove("visible");
            //     }
            // });

            this.btn.timeline?.timeline?.addEventListener("mousemove", (e) => {
                const { mouseLocation, value } = calcSliderPos(e);
                const duration: number = this.totalTime
                    ? (this.totalTime * Number(value.toFixed(2))) / 100
                    : 0;
                if (this.btn.timeline?.jumpto) {
                    this.btn.timeline.jumpto.textContent =
                        this.formatDuration(duration);
                    this.btn.timeline.jumpto.style.left = `${mouseLocation.toString()}px`;
                }
            });

            this.btn.fullScreen?.addEventListener("click", () =>
                this.toggleFullScreen()
            );
        };

        const keyboardEvents = () => {
            this.document.body.addEventListener("keydown", (ev) => {
                const noEventTags = ["input", "textarea", "select"];
                const noEventClass = [""];
                const activeTag =
                    this.document.activeElement?.tagName.toLowerCase() ?? "";
                const activeClass =
                    this.document.activeElement?.className.split(" ") ?? [];
                if (noEventTags.indexOf(activeTag) > -1) return;
                for (let i = 0; i < activeClass.length; i++) {
                    const className = activeClass[i];
                    if (noEventClass.indexOf(className) > -1) return;
                }

                const activeVideoValidate = (): boolean => {
                    if (
                        this.videoContainer?.contains(
                            this.document.activeElement
                        )
                    ) {
                        ev.preventDefault();
                        return true;
                    }
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
                    case "j":
                        if (activeVideoValidate()) this.skip(-10);
                        break;
                    case "l":
                        if (activeVideoValidate()) this.skip(10);
                        break;
                    case "arrowleft":
                        if (activeVideoValidate()) this.skip(-5);
                        break;
                    case "arrowright":
                        if (activeVideoValidate()) this.skip(5);
                        break;
                    case "arrowup":
                        if (activeVideoValidate()) this.setVolume(5, true);
                        break;
                    case "arrowdown":
                        if (activeVideoValidate()) this.setVolume(-5, true);
                        break;
                    case "f":
                        if (activeVideoValidate()) this.toggleFullScreen();
                        break;
                    case "m":
                        if (activeVideoValidate()) this.toggleMute();
                        break;
                    case "0":
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                    case "5":
                    case "6":
                    case "7":
                    case "8":
                    case "9":
                        this.currentTime =
                            (Number(this.totalTime) *
                                Number(ev.key.toLowerCase())) /
                            10;
                        this.trigger("timeupdate");
                        break;
                    default:
                        break;
                }
            });
        };

        const videoEvents = () => {
            this.video.onloadeddata = () => this.trigger("loadeddata");
            this.video.ontimeupdate = () => this.trigger("timeupdate");
            this.video.onplay = () => this.play();
            this.video.onpause = () => this.pause();
            this.video.addEventListener("volumechange", (e) => {
                const video = e.target as HTMLVideoElement;

                if (video.muted) {
                    this.mute();
                    return;
                }
                this.unmute();
                this.setVolume(video.volume);
            });

            const fullScreenHandler = () => {
                if (
                    this.document.fullscreenElement ||
                    this.document.webkitIsFullScreen ||
                    this.document.mozFullScreen ||
                    this.document.msFullscreenElement
                )
                    this.enterFullScreen();
                else this.exitFullScreen();
            };
            this.document.addEventListener(
                "webkitfullscreenchange",
                fullScreenHandler
            );
            this.document.addEventListener(
                "mozfullscreenchange",
                fullScreenHandler
            );
            this.document.addEventListener(
                "fullscreenchange",
                fullScreenHandler
            );
            this.document.addEventListener(
                "MSFullscreenChange",
                fullScreenHandler
            );
        };

        this._init();
        this.registerCustomEvents();

        mouseEvents();
        keyboardEvents();
        controllersEvents();
        videoEvents();

        this.autoPlay();

        return this;
    }
}
