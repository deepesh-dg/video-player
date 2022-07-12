interface IHTMLDivElement extends HTMLDivElement {
    webkitRequestFullScreen?: () => void;
    mozRequestFullScreen?: () => void;
}
export declare type BaseVideoPlayerOptions = {
    videoContainer?: IHTMLDivElement;
    initialPlay?: boolean;
    initialMuted?: boolean;
    loop?: boolean;
};
declare type VideoPlayerOptions = BaseVideoPlayerOptions & {
    video: HTMLVideoElement;
};
export declare class VideoPlayer {
    private readonly classNames;
    private readonly icons;
    /**
     * Properties of necessary DOM Elements
     */
    private video;
    private videoContainer?;
    private videoControlsContainer?;
    private btn;
    /**
     * Metadata of Video
     */
    private isPaused;
    private isMuted;
    private isFullScreen;
    private volume;
    private currentTime;
    private totalTime?;
    /**
     * Custom Events
     */
    private events;
    /**
     * Initial State of Video
     */
    private initialPlay;
    private initialMuted;
    private loop;
    /**
     * Extended Document Object
     */
    private document;
    constructor(options: VideoPlayerOptions);
    on(eventName: "loadeddata" | "play" | "pause" | "mute" | "unmute" | "volume" | "timeupdate" | "fullscreenin" | "fullscreenout" | "playbackspeed", listener: (e: Event) => void): void;
    registerCustomEvents(): void;
    trigger(eventName: "loadeddata" | "play" | "pause" | "mute" | "unmute" | "volume" | "timeupdate" | "fullscreenin" | "fullscreenout" | "playbackspeed"): void;
    getCurrentTime(): string;
    getTotalTime(): string;
    skip(howMuch: number): void;
    formatDuration(time: number): string;
    play(): void;
    pause(): void;
    volumeLevel(level: "low" | "high" | "muted"): void;
    setVolume(volume: number, percent?: boolean): void;
    mute(): void;
    unmute(): void;
    enterFullScreen(): void;
    exitFullScreen(): void;
    togglePlay(): void;
    toggleMute(): void;
    toggleFullScreen(): void;
    autoPlay(): void;
    private _init;
    run(): this;
}
export {};
