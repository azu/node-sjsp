(window || self).sjsp__result = (window || self).sjsp__result || {};
(window || self).sjsp__state = (window || self).sjsp__state || {
    time: 0,
    line: 0,
    col: 0,
    name: ''
};
(window || self).sjsp__start = (window || self).sjsp__start || function (fname, line, col, name, linestr) {
    var key = fname + '::' + line + '::' + col;
    if (window.performance && typeof window.performance.mark === 'function') {
        performance.mark(key);
    }
    return {
        start: Date.now(),
        line: line,
        col: col,
        name: name,
        fname: fname,
        linestr: linestr
    };
};
(window || self).sjsp__end = (window || self).sjsp__end || function (x) {
    if (!x.start) {
        return;
    }
    var key = x.fname + '::' + x.line + '::' + x.col;
    if (window.performance && typeof window.performance.mark === 'function') {
        try {
            window.performance.measure(x.name || x.linestr, key);
            performance.clearMarks(key);
            performance.clearMeasures(x.name || x.linestr);
        } catch (error) {
        }
    }
    sjsp__result[key] = sjsp__result[key] || {
        count: 0,
        time: 0,
        line: x.line,
        col: x.col,
        name: x.name,
        fname: x.fname,
        linestr: x.linestr
    };
    sjsp__result[key].time += Date.now() - x.start;
    sjsp__result[key].count += 1;
};
if (!(window || self).hasOwnProperty('sjsp__interval')) {
    (window || self).sjsp__interval = setInterval(function () {
        var sjsp__print = function (x, n) {
            if (!x) {
                return '';
            }
            return Array(Math.max(0, n - x.toString().length + 1)).join(' ') + x;
        };
        var sjsp__format = function (x) {
            if (!x) {
                return '';
            }
            return 'time: ' + sjsp__print((x.time / 1000).toFixed(2), 7) + 'sec   count: ' + sjsp__print(x.count, 7) + ' ' + sjsp__print(x.fname, 15) + '  ' + sjsp__print(x.name, 13) + '  ' + ' (line:' + sjsp__print(x.line, 4) + ', col:' + sjsp__print(x.col, 3) + ')   ' + x.linestr;
        };
        var sjsp__result_count = Object.keys(sjsp__result).map(function (key) {
            return sjsp__result[key];
        }).sort(function (x, y) {
            return y.time - x.time;
        }).slice(0, 30).map(function (x) {
            var filePath = x.fname + ':' + x.line + ':' + x.col;
            return {
                time: x.time,
                count: x.count,
                name: x.name,
                filePath: filePath,
                line: x.linestr
            };
        });
        console.table(sjsp__result_count);
    }, 1 * 1000);
}
import URLToolkit from 'url-toolkit';
import {
    ErrorTypes,
    ErrorDetails
} from './errors';
import PlaylistLoader from './loader/playlist-loader';
import FragmentLoader from './loader/fragment-loader';
import KeyLoader from './loader/key-loader';
import StreamController from './controller/stream-controller';
import LevelController from './controller/level-controller';
import ID3TrackController from './controller/id3-track-controller';
import { isSupported } from './helper/is-supported';
import {
    logger,
    enableLogs
} from './utils/logger';
import { hlsDefaultConfig } from './config';
import { FragmentTracker } from './helper/fragment-tracker';
import HlsEvents from './events';
import EventEmitter from 'events';
require('string.prototype.endswith');
export default class Hls {
    static get version() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 37, 26, 'anonymous', '    static get version() {');
        return function () {
            var sjsp__return = __VERSION__;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    static isSupported() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 44, 26, 'anonymous', '    static isSupported() {');
        return function () {
            var sjsp__return = isSupported();
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    static get Events() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 51, 25, 'anonymous', '    static get Events() {');
        return function () {
            var sjsp__return = HlsEvents;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    static get ErrorTypes() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 58, 29, 'anonymous', '    static get ErrorTypes() {');
        return function () {
            var sjsp__return = ErrorTypes;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    static get ErrorDetails() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 65, 31, 'anonymous', '    static get ErrorDetails() {');
        return function () {
            var sjsp__return = ErrorDetails;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    static get DefaultConfig() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 72, 32, 'anonymous', '    static get DefaultConfig() {');
        if (!Hls.defaultConfig) {
            return function () {
                var sjsp__return = hlsDefaultConfig;
                typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
                return sjsp__return;
            }.call(this, arguments);
        }
        return function () {
            var sjsp__return = Hls.defaultConfig;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    static set DefaultConfig(defaultConfig) {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 82, 45, 'anonymous', '    static set DefaultConfig(defaultConfig) {');
        Hls.defaultConfig = defaultConfig;
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    constructor(config = {}) {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 92, 30, 'anonymous', '    constructor(config = {}) {');
        var defaultConfig = Hls.DefaultConfig;
        if ((config.liveSyncDurationCount || config.liveMaxLatencyDurationCount) && (config.liveSyncDuration || config.liveMaxLatencyDuration)) {
            throw new Error('Illegal hls.js config: don\'t mix up liveSyncDurationCount/liveMaxLatencyDurationCount and liveSyncDuration/liveMaxLatencyDuration');
        }
        for (var prop in defaultConfig) {
            if (prop in config) {
                continue;
            }
            config[prop] = defaultConfig[prop];
        }
        if (config.liveMaxLatencyDurationCount !== undefined && config.liveMaxLatencyDurationCount <= config.liveSyncDurationCount) {
            throw new Error('Illegal hls.js config: "liveMaxLatencyDurationCount" must be gt "liveSyncDurationCount"');
        }
        if (config.liveMaxLatencyDuration !== undefined && (config.liveMaxLatencyDuration <= config.liveSyncDuration || config.liveSyncDuration === undefined)) {
            throw new Error('Illegal hls.js config: "liveMaxLatencyDuration" must be gt "liveSyncDuration"');
        }
        enableLogs(config.debug);
        this.config = config;
        this._autoLevelCapping = -1;
        var observer = this.observer = new EventEmitter();
        observer.trigger = function trigger(event, ...data) {
            var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 117, 62, 'observer.trigger', '        observer.trigger = function trigger (event, ...data) {');
            observer.emit(event, event, ...data);
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
        };
        observer.off = function off(event, ...data) {
            var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 121, 54, 'observer.off', '        observer.off = function off (event, ...data) {');
            observer.removeListener(event, ...data);
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
        };
        this.on = observer.on.bind(observer);
        this.off = observer.off.bind(observer);
        this.trigger = observer.trigger.bind(observer);
        const abrController = this.abrController = new config.abrController(this);
        const bufferController = new config.bufferController(this);
        const capLevelController = new config.capLevelController(this);
        const fpsController = new config.fpsController(this);
        const playListLoader = new PlaylistLoader(this);
        const fragmentLoader = new FragmentLoader(this);
        const keyLoader = new KeyLoader(this);
        const id3TrackController = new ID3TrackController(this);
        const levelController = this.levelController = new LevelController(this);
        const fragmentTracker = new FragmentTracker(this);
        const streamController = this.streamController = new StreamController(this, fragmentTracker);
        let networkControllers = [
            levelController,
            streamController
        ];
        let Controller = config.audioStreamController;
        if (Controller) {
            networkControllers.push(new Controller(this, fragmentTracker));
        }
        this.networkControllers = networkControllers;
        const coreComponents = [
            playListLoader,
            fragmentLoader,
            keyLoader,
            abrController,
            bufferController,
            capLevelController,
            fpsController,
            id3TrackController,
            fragmentTracker
        ];
        Controller = config.audioTrackController;
        if (Controller) {
            const audioTrackController = new Controller(this);
            this.audioTrackController = audioTrackController;
            coreComponents.push(audioTrackController);
        }
        Controller = config.subtitleTrackController;
        if (Controller) {
            const subtitleTrackController = new Controller(this);
            this.subtitleTrackController = subtitleTrackController;
            coreComponents.push(subtitleTrackController);
        }
        Controller = config.emeController;
        if (Controller) {
            const emeController = new Controller(this);
            this.emeController = emeController;
            coreComponents.push(emeController);
        }
        [
            config.subtitleStreamController,
            config.timelineController
        ].forEach(Controller => {
            if (Controller) {
                coreComponents.push(new Controller(this));
            }
        });
        this.coreComponents = coreComponents;
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    destroy() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 239, 15, 'anonymous', '    destroy() {');
        logger.log('destroy');
        this.trigger(HlsEvents.DESTROYING);
        this.detachMedia();
        this.coreComponents.concat(this.networkControllers).forEach(component => {
            component.destroy();
        });
        this.url = null;
        this.observer.removeAllListeners();
        this._autoLevelCapping = -1;
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    attachMedia(media) {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 253, 24, 'anonymous', '    attachMedia(media) {');
        logger.log('attachMedia');
        this.media = media;
        this.trigger(HlsEvents.MEDIA_ATTACHING, { media: media });
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    detachMedia() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 262, 19, 'anonymous', '    detachMedia() {');
        logger.log('detachMedia');
        this.trigger(HlsEvents.MEDIA_DETACHING);
        this.media = null;
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    loadSource(url) {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 272, 21, 'anonymous', '    loadSource(url) {');
        url = URLToolkit.buildAbsoluteURL(window.location.href, url, { alwaysNormalize: true });
        logger.log(`loadSource:${ url }`);
        this.url = url;
        this.trigger(HlsEvents.MANIFEST_LOADING, { url: url });
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    startLoad(startPosition = -1) {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 287, 35, 'anonymous', '    startLoad(startPosition = -1) {');
        logger.log(`startLoad(${ startPosition })`);
        this.networkControllers.forEach(controller => {
            controller.startLoad(startPosition);
        });
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    stopLoad() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 295, 16, 'anonymous', '    stopLoad() {');
        logger.log('stopLoad');
        this.networkControllers.forEach(controller => {
            controller.stopLoad();
        });
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    swapAudioCodec() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 303, 22, 'anonymous', '    swapAudioCodec() {');
        logger.log('swapAudioCodec');
        this.streamController.swapAudioCodec();
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    recoverMediaError() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 314, 25, 'anonymous', '    recoverMediaError() {');
        logger.log('recoverMediaError');
        var media = this.media;
        this.detachMedia();
        this.attachMedia(media);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get levels() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 324, 18, 'anonymous', '    get levels() {');
        return function () {
            var sjsp__return = this.levelController.levels;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get currentLevel() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 332, 24, 'anonymous', '    get currentLevel() {');
        return function () {
            var sjsp__return = this.streamController.currentLevel;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    set currentLevel(newLevel) {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 342, 32, 'anonymous', '    set currentLevel(newLevel) {');
        logger.log(`set currentLevel:${ newLevel }`);
        this.loadLevel = newLevel;
        this.streamController.immediateLevelSwitch();
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get nextLevel() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 352, 21, 'anonymous', '    get nextLevel() {');
        return function () {
            var sjsp__return = this.streamController.nextLevel;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    set nextLevel(newLevel) {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 362, 29, 'anonymous', '    set nextLevel(newLevel) {');
        logger.log(`set nextLevel:${ newLevel }`);
        this.levelController.manualLevel = newLevel;
        this.streamController.nextLevelSwitch();
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get loadLevel() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 372, 21, 'anonymous', '    get loadLevel() {');
        return function () {
            var sjsp__return = this.levelController.level;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    set loadLevel(newLevel) {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 382, 29, 'anonymous', '    set loadLevel(newLevel) {');
        logger.log(`set loadLevel:${ newLevel }`);
        this.levelController.manualLevel = newLevel;
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get nextLoadLevel() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 391, 25, 'anonymous', '    get nextLoadLevel() {');
        return function () {
            var sjsp__return = this.levelController.nextLoadLevel;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    set nextLoadLevel(level) {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 400, 30, 'anonymous', '    set nextLoadLevel(level) {');
        this.levelController.nextLoadLevel = level;
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get firstLevel() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 409, 22, 'anonymous', '    get firstLevel() {');
        return function () {
            var sjsp__return = Math.max(this.levelController.firstLevel, this.minAutoLevel);
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    set firstLevel(newLevel) {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 417, 30, 'anonymous', '    set firstLevel(newLevel) {');
        logger.log(`set firstLevel:${ newLevel }`);
        this.levelController.firstLevel = newLevel;
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get startLevel() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 429, 22, 'anonymous', '    get startLevel() {');
        return function () {
            var sjsp__return = this.levelController.startLevel;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    set startLevel(newLevel) {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 440, 30, 'anonymous', '    set startLevel(newLevel) {');
        logger.log(`set startLevel:${ newLevel }`);
        const hls = this;
        if (newLevel !== -1) {
            newLevel = Math.max(newLevel, hls.minAutoLevel);
        }
        hls.levelController.startLevel = newLevel;
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get autoLevelCapping() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 454, 28, 'anonymous', '    get autoLevelCapping() {');
        return function () {
            var sjsp__return = this._autoLevelCapping;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    set autoLevelCapping(newLevel) {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 462, 36, 'anonymous', '    set autoLevelCapping(newLevel) {');
        logger.log(`set autoLevelCapping:${ newLevel }`);
        this._autoLevelCapping = newLevel;
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get autoLevelEnabled() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 471, 28, 'anonymous', '    get autoLevelEnabled() {');
        return function () {
            var sjsp__return = this.levelController.manualLevel === -1;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get manualLevel() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 480, 23, 'anonymous', '    get manualLevel() {');
        return function () {
            var sjsp__return = this.levelController.manualLevel;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get minAutoLevel() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 488, 24, 'anonymous', '    get minAutoLevel() {');
        let hls = this, levels = hls.levels, minAutoBitrate = hls.config.minAutoBitrate, len = levels ? levels.length : 0;
        for (let i = 0; i < len; i++) {
            const levelNextBitrate = levels[i].realBitrate ? Math.max(levels[i].realBitrate, levels[i].bitrate) : levels[i].bitrate;
            if (levelNextBitrate > minAutoBitrate) {
                return function () {
                    var sjsp__return = i;
                    typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
                    return sjsp__return;
                }.call(this, arguments);
            }
        }
        return function () {
            var sjsp__return = 0;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get maxAutoLevel() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 503, 24, 'anonymous', '    get maxAutoLevel() {');
        const hls = this;
        const levels = hls.levels;
        const autoLevelCapping = hls.autoLevelCapping;
        let maxAutoLevel;
        if (autoLevelCapping === -1 && levels && levels.length) {
            maxAutoLevel = levels.length - 1;
        } else {
            maxAutoLevel = autoLevelCapping;
        }
        return function () {
            var sjsp__return = maxAutoLevel;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get nextAutoLevel() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 520, 25, 'anonymous', '    get nextAutoLevel() {');
        const hls = this;
        return function () {
            var sjsp__return = Math.min(Math.max(hls.abrController.nextAutoLevel, hls.minAutoLevel), hls.maxAutoLevel);
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    set nextAutoLevel(nextLevel) {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 534, 34, 'anonymous', '    set nextAutoLevel(nextLevel) {');
        const hls = this;
        hls.abrController.nextAutoLevel = Math.max(hls.minAutoLevel, nextLevel);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get audioTracks() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 542, 23, 'anonymous', '    get audioTracks() {');
        const audioTrackController = this.audioTrackController;
        return function () {
            var sjsp__return = audioTrackController ? audioTrackController.audioTracks : [];
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get audioTrack() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 551, 22, 'anonymous', '    get audioTrack() {');
        const audioTrackController = this.audioTrackController;
        return function () {
            var sjsp__return = audioTrackController ? audioTrackController.audioTrack : -1;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    set audioTrack(audioTrackId) {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 560, 34, 'anonymous', '    set audioTrack(audioTrackId) {');
        const audioTrackController = this.audioTrackController;
        if (audioTrackController) {
            audioTrackController.audioTrack = audioTrackId;
        }
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get liveSyncPosition() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 570, 28, 'anonymous', '    get liveSyncPosition() {');
        return function () {
            var sjsp__return = this.streamController.liveSyncPosition;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get subtitleTracks() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 578, 26, 'anonymous', '    get subtitleTracks() {');
        const subtitleTrackController = this.subtitleTrackController;
        return function () {
            var sjsp__return = subtitleTrackController ? subtitleTrackController.subtitleTracks : [];
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get subtitleTrack() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 587, 25, 'anonymous', '    get subtitleTrack() {');
        const subtitleTrackController = this.subtitleTrackController;
        return function () {
            var sjsp__return = subtitleTrackController ? subtitleTrackController.subtitleTrack : -1;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    set subtitleTrack(subtitleTrackId) {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 596, 40, 'anonymous', '    set subtitleTrack(subtitleTrackId) {');
        const subtitleTrackController = this.subtitleTrackController;
        if (subtitleTrackController) {
            subtitleTrackController.subtitleTrack = subtitleTrackId;
        }
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    get subtitleDisplay() {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 606, 27, 'anonymous', '    get subtitleDisplay() {');
        const subtitleTrackController = this.subtitleTrackController;
        return function () {
            var sjsp__return = subtitleTrackController ? subtitleTrackController.subtitleDisplay : false;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
    set subtitleDisplay(value) {
        var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 615, 32, 'anonymous', '    set subtitleDisplay(value) {');
        const subtitleTrackController = this.subtitleTrackController;
        if (subtitleTrackController) {
            subtitleTrackController.subtitleDisplay = value;
        }
        typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
    }
}