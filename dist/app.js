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
    function Osc(context) {
        _super.call(this);
        this._oscillator = context.createOscillator();
        this._oscillator.type = 'sine';
        this._oscillator.frequency.value = 440;
        this.input = this._oscillator;
        this.output = this._oscillator;
        this.frequency = this._oscillator.frequency;
    }
    Osc.prototype.start = function () {
        this._oscillator.start();
    };
    Object.defineProperty(Osc.prototype, "type", {
        set: function (type) {
            this._oscillator.type = type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Osc.prototype, "frequencyValue", {
        get: function () {
            return this.frequency.value;
        },
        set: function (frequency) {
            this.frequency.value = frequency;
        },
        enumerable: true,
        configurable: true
    });
    return Osc;
})(BaseModule);
///<reference path="BaseModule.ts"/>
var Amp = (function (_super) {
    __extends(Amp, _super);
    function Amp(context) {
        _super.call(this);
        this._gain = context.createGain();
        this._gain.gain.value = 0;
        this.amplitude = this._gain.gain;
        this.input = this._gain;
        this.output = this._gain;
    }
    Object.defineProperty(Amp.prototype, "level", {
        set: function (level) {
            this.amplitude.value = level;
        },
        enumerable: true,
        configurable: true
    });
    return Amp;
})(BaseModule);
var Env = (function () {
    function Env(context) {
        this.context = context;
        this.attack = 0.01;
        this.decay = 0.5;
        this.max = 1;
        this.min = 0;
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
    /**
     * options = {
     *     frequency: 440,
     *     noiseAttack: 0.1,
     *     noiseDecay: 0.5,
     *     noiseLevel: 1.0,
     *     outputLevel: 1.0,
     *     oscAmpAttack: 0.1,
     *     oscAmpDecay: 0.5,
     *     oscLevel: 1.0,
     *     oscPitchAttack: 0.1,
     *     oscPitchDecay: 0.5,
     *     type: 'sine'
     * }
     */
    function Channel(context, options) {
        if (options === void 0) { options = {}; }
        this._output = new Amp(context);
        this._output.level = options.outputLevel || 1.0;
        this._osc = new Osc(context);
        this._osc.type = options.type || 'sine';
        this._osc.frequencyValue = options.frequency || 440;
        this._oscAmp = new Amp(context);
        this._oscPitchEnv = new Env(context);
        this._oscPitchEnv.attack = options.oscPitchAttack || 0.1;
        this._oscPitchEnv.decay = options.oscPitchDecay || 0.5;
        this._oscPitchEnv.max = options.frequency || 440;
        this._oscAmpEnv = new Env(context);
        this._oscAmpEnv.attack = options.oscAmpAttack || 0.2;
        this._oscAmpEnv.decay = options.oscAmpDecay || 0.8;
        this._oscAmpEnv.max = options.oscLevel || 1.0;
        this._noise = new Noise(context);
        this._noiseAmp = new Amp(context);
        this._noiseAmpEnv = new Env(context);
        this._noiseAmpEnv.attack = options.noiseAmpAttack || 0.1;
        this._noiseAmpEnv.decay = options.noiseAmpDecay || 0.5;
        this._noiseAmpEnv.max = options.noiseLevel || 1.0;
        // wiring!
        this._osc.connect(this._oscAmp);
        this._oscPitchEnv.connect(this._osc.frequency);
        this._oscAmpEnv.connect(this._oscAmp.amplitude);
        this._oscAmp.connect(this._output);
        this._noise.connect(this._noiseAmp);
        this._noiseAmpEnv.connect(this._noiseAmp.amplitude);
        this._noiseAmp.connect(this._output);
        this._output.connect(context.destination);
    }
    Channel.prototype.start = function () {
        this._osc.start();
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
            this._osc.type = type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channel.prototype, "frequency", {
        get: function () {
            return this._osc.frequencyValue;
        },
        set: function (frequency) {
            this._osc.frequencyValue = frequency;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channel.prototype, "level", {
        get: function () {
            return this._output.amplitude.value;
        },
        set: function (level) {
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
        // can we just do the active thing on the indicator?
        // also be nice to add a glowy effect
        var _this = this;
        $('.sequence li').removeClass('active');
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
    Sequencer.prototype.stop = function () {
        clearInterval(this._interval);
    };
    Sequencer.prototype.setTempo = function (tempo) {
        this._tempo = tempo;
        clearInterval(this._interval);
        this.start();
    };
    Sequencer.prototype.bpmToMs = function (bpm) {
        return (60000 / bpm) / 2;
    };
    Object.defineProperty(Sequencer.prototype, "length", {
        get: function () {
            return this._length;
        },
        enumerable: true,
        configurable: true
    });
    return Sequencer;
})();
///<reference path="jquery.d.ts"/>
///<reference path="jquery.knob.d.ts"/>
///<reference path="Channel.ts"/>
var UI = (function () {
    function UI() {
    }
    UI.addChannel = function (name, channel, length) {
        this._panel(name, channel);
        this._sequence(name, channel, length);
    };
    UI.removeChannel = function () {
        // delete it all
    };
    UI._panel = function (name, channel) {
        var $panel = $('<div class="node"></div>');
        $panel.append("<p>" + name + "</p>");
        var $mixer = $('<div class="section"><p>mixer</p></div>');
        $mixer.append(this._knob('level', channel.level));
        var $osc = $('<div class="section"><p>osc</p></div>');
        $osc.append("<select name=\"" + name + "-wave\" class=\"wave\">" + this._typeSelect + "</select>");
        $osc.append(this._knob('frequency', channel.frequency));
        var $noise = $('<div class="section"><p>noise</p></div>');
        $panel.append($mixer);
        $panel.append($osc);
        $panel.append($noise);
        $('#synth').append($panel);
        $('.knob').knob(this._knobDefaults);
    };
    UI._sequence = function (name, channel, length) {
        // do sequences here instead of in sequencer
        var $sequence = $('<ul class="sequence"></ul>');
        $sequence.attr('data-channel', name);
        for (var i = 0; i < length; ++i) {
            $sequence.append('<li><div class="light-outer"><div class="light-inner"></div></div></li>');
        }
        $('#sequencer-title').after($sequence);
    };
    UI._knob = function (type, value) {
        return "<div><input type=\"text\" class=\"knob " + type + "\" value=\"" + value + "\"></div>";
    };
    UI._knobDefaults = {
        'angleOffset': -160,
        'angleArc': 320,
        'thickness': 0.1,
        'width': 50,
        'height': 50,
        'fgColor': '#0f0'
    };
    UI._typeSelect = "<option>sine</option>\n        <option>square</option>\n        <option>sawtooth</option>\n\t    <option>triangle</option>\n\t";
    return UI;
})();
///<reference path="jquery.d.ts"/>
///<reference path="Channel.ts"/>
///<reference path="Sequencer.ts"/>
///<reference path="UI.ts"/>
var audioContext = new (AudioContext || webkitAudioContext)();
var tempo = 80;
var channels = {
    'kick': new Channel(audioContext, {
        frequency: 200,
        noiseLevel: 0.001,
        oscLevel: 0.9
    }),
    'snare': new Channel(audioContext, {
        frequency: 800,
        noiseLevel: 0.7,
        oscLevel: 0.3
    }),
    'hat': new Channel(audioContext, {
        frequency: 1500,
        noiseLevel: 0.7,
        oscLevel: 0.3
    }),
    'thing': new Channel(audioContext, {
        frequency: 1000,
        noiseLevel: 0.0,
        oscLevel: 0.3
    })
};
var sequencer = new Sequencer(channels, 80);
$.each(channels, function (name, channel) {
    UI.addChannel(name, channel, sequencer.length);
});
$('.sequence li').click(function () {
    $(this).toggleClass('on');
});
$('#mute').click(function () {
    sequencer.stop();
});
sequencer.start();
// then jq knobs
// namespaces
// gui code 
//# sourceMappingURL=app.js.map