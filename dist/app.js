var BaseModule = (function () {
    function BaseModule() {
    }
    BaseModule.prototype.connect = function (node) {
        if (node.hasOwnProperty('input')) {
            this.output.connect(node.input);
        }
        else {
            this.output.connect(node);
        }
    };
    return BaseModule;
})();
///<reference path="BaseModule.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Osc = (function (_super) {
    __extends(Osc, _super);
    function Osc(context, type, frequency) {
        _super.call(this);
        this.context = context;
        this.oscillator = context.createOscillator();
        this.oscillator.type = type;
        this.oscillator.frequency.value = frequency;
        this.input = this.oscillator;
        this.output = this.oscillator;
    }
    return Osc;
})(BaseModule);
///<reference path="BaseModule.ts"/>
var Amp = (function (_super) {
    __extends(Amp, _super);
    function Amp(context, level) {
        if (level === void 0) { level = 0; }
        _super.call(this);
        this._gain = context.createGain();
        this._gain.gain.value = level;
        this.amplitude = this._gain.gain;
        this.input = this._gain;
        this.output = this._gain;
    }
    return Amp;
})(BaseModule);
var Env = (function () {
    function Env(context, attack, decay, max, min) {
        if (attack === void 0) { attack = 0.01; }
        if (decay === void 0) { decay = 0.1; }
        if (max === void 0) { max = 1; }
        if (min === void 0) { min = 0; }
        this.context = context;
        this.attack = attack;
        this.decay = decay;
        this.max = max;
        this.min = min;
    }
    Env.prototype.trigger = function () {
        var now = this.context.currentTime;
        this.param.cancelScheduledValues(now);
        this.param.setValueAtTime(this.min, now);
        this.param.linearRampToValueAtTime(this.max, now + this.attack);
        this.param.linearRampToValueAtTime(this.min, now + this.attack + this.decay);
    };
    Env.prototype.connect = function (param) {
        this.param = param;
    };
    return Env;
})();
///<reference path="BaseModule.ts"/>
var Noise = (function (_super) {
    __extends(Noise, _super);
    function Noise(context) {
        _super.call(this);
        this.channels = 2;
        var size = 2 * context.sampleRate;
        var buffer = context.createBuffer(this.channels, size, context.sampleRate);
        var output = buffer.getChannelData(0);
        // more noise functions to be done
        for (var i = 0; i < size; ++i) {
            output[i] = Math.random() * 2 - 1;
        }
        this.noise = context.createBufferSource();
        this.noise.buffer = buffer;
        this.noise.loop = true;
        this.input = this.noise;
        this.output = this.noise;
    }
    return Noise;
})(BaseModule);
///<reference path="modules/Osc.ts"/>
///<reference path="modules/Amp.ts"/>
///<reference path="modules/Env.ts"/>
///<reference path="modules/Noise.ts"/>
var Channel = (function () {
    // amp or summing buss
    // LFO?
    function Channel(context) {
        this._output = new Amp(context, 1.0);
        this._osc = new Osc(context, 'sine', 440);
        this._oscAmp = new Amp(context);
        this._oscPitchEnv = new Env(context);
        this._oscAmpEnv = new Env(context);
        this._noise = new Noise(context);
        this._noiseAmp = new Amp(context);
        this._noiseAmpEnv = new Env(context);
        this._osc.connect(this._oscAmp);
        this._oscPitchEnv.connect(this._osc.oscillator.frequency);
        this._oscAmpEnv.connect(this._oscAmp.amplitude);
        this._oscAmp.connect(this._output);
        this._noise.connect(this._noiseAmp);
        this._noiseAmpEnv.connect(this._noiseAmp.amplitude);
        this._noiseAmp.connect(this._output);
        this._output.connect(context.destination);
    }
    Channel.prototype.start = function () {
        this._osc.oscillator.start();
        this._noise.noise.start();
        // may end up redundant as nodes have to be renewed if stopped
    };
    Channel.prototype.trigger = function () {
        this._oscAmpEnv.trigger();
        this._oscPitchEnv.trigger();
        this._noiseAmpEnv.trigger();
    };
    Object.defineProperty(Channel.prototype, "wave", {
        set: function (type) {
            this._osc.oscillator.type = type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channel.prototype, "level", {
        get: function () {
            return this._output.amplitude.value;
        },
        set: function (level) {
            this._oscAmp.amplitude.value = level;
            this._output.amplitude.value = level;
        },
        enumerable: true,
        configurable: true
    });
    return Channel;
})();
///<reference path="jquery.d.ts"/>
///<reference path="Channel.ts"/>
var Sequencer = (function () {
    function Sequencer(channels, tempo) {
        if (tempo === void 0) { tempo = 120; }
        this._beat = 0;
        this._length = 16;
        this._channels = channels;
        this._tempo = tempo;
    }
    Sequencer.prototype.loop = function () {
        var _this = this;
        var $beat = this._beat; // this (har) sucks
        var $channels = this._channels;
        $('.sequence').each(function (i, sequence) {
            var $sequence = $(sequence);
            var $current = $($sequence.children('li')[_this._beat]);
            if ($current.hasClass('on') && $sequence.data('channel') !== 'indicator') {
                _this._channels[$sequence.data('channel')].trigger();
            }
            $current.addClass('active');
        });
        this._beat = this._beat == this._length - 1 ? 0 : this._beat + 1;
    };
    Sequencer.prototype.start = function () {
        var _this = this;
        $.each(this._channels, function () {
            this.start();
        });
        this._interval = setInterval(function () { _this.loop(); }, this.bpmToMs(this._tempo));
    };
    Sequencer.prototype.setTempo = function (tempo) {
        this._tempo = tempo;
        clearInterval(this._interval);
        this.start();
    };
    Sequencer.prototype.bpmToMs = function (bpm) {
        return (60000 / bpm) / 2;
    };
    return Sequencer;
})();
///<reference path="Channel.ts"/>
///<reference path="Sequencer.ts"/>
var audioContext = new (AudioContext || webkitAudioContext)();
var tempo = 80;
var channels = {};
channels['kick'] = new Channel(audioContext);
var sequencer = new Sequencer(channels, 80);
// sequencer.start();
// then jq knobs
// namespaces
// gui code 
//# sourceMappingURL=app.js.map