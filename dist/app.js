var Osc = (function () {
    function Osc(context, type, frequency) {
        this.context = context;
        this.oscillator = context.createOscillator();
        this.oscillator.type = type;
        this.oscillator.frequency.value = frequency;
        this.input = this.oscillator;
        this.output = this.oscillator;
    }
    Osc.prototype.connect = function (node) {
        if (node.hasOwnProperty('input')) {
            this.output.connect(node.input);
        }
        else {
            this.output.connect(node);
        }
    };
    return Osc;
})();
var Amp = (function () {
    function Amp(context) {
        this.gain = context.createGain();
        this.gain.gain.value = 0;
        this.amplitude = this.gain.gain;
        this.input = this.gain.gain;
    }
    Amp.prototype.connect = function (node) {
        if (node.hasOwnProperty('input')) {
            this.gain.connect(node.input);
        }
        else {
            this.gain.connect(node);
        }
    };
    return Amp;
})();
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
var Noise = (function () {
    function Noise(context) {
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
        this.noise.start();
        this.input = this.noise;
    }
    Noise.prototype.connect = function (node) {
        if (node.hasOwnProperty('input')) {
            this.noise.connect(node.input);
        }
        else {
            this.noise.connect(node);
        }
    };
    return Noise;
})();
///<reference path="modules/Osc.ts"/>
///<reference path="modules/Amp.ts"/>
///<reference path="modules/Env.ts"/>
///<reference path="modules/Noise.ts"/>
var Channel = (function () {
    // amp or summing buss
    // LFO?
    function Channel(context) {
        this._output = new Amp(context);
        this._osc = new Osc(context, 'sine', 440);
        this._oscAmp = new Amp(context);
        this._oscPitchEnv = new Env(context);
        this._oscAmpEnv = new Env(context);
        this._wave = this._osc.oscillator.type;
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
        this._level = this._output.amplitude.value;
    }
    Channel.prototype.start = function () {
        this._osc.oscillator.start();
        // start noise, LFO, etc
    };
    Object.defineProperty(Channel.prototype, "wave", {
        set: function (type) {
            this._wave = type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channel.prototype, "level", {
        get: function () {
            return this._level;
        },
        set: function (level) {
            this._level = level;
        },
        enumerable: true,
        configurable: true
    });
    return Channel;
})();
///<reference path="Channel.ts"/>
var audioContext = new (AudioContext || webkitAudioContext)();
var tempo = 120;
var channel = new Channel(audioContext);
channel.start();
// also jquery
// then jq knobs
// namespaces
// gui code 
//# sourceMappingURL=app.js.map