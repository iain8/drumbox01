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
        this.channels = 1;
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
///<reference path="BaseModule.ts"/>
var Filter = (function (_super) {
    __extends(Filter, _super);
    function Filter(context) {
        _super.call(this);
        this._filter = context.createBiquadFilter();
        this.input = this._filter;
        this.output = this._filter;
    }
    Object.defineProperty(Filter.prototype, "gain", {
        get: function () {
            return this._filter.gain.value;
        },
        set: function (value) {
            this._filter.gain.value = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter.prototype, "frequency", {
        get: function () {
            return this._filter.frequency.value;
        },
        set: function (value) {
            this._filter.frequency.value = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter.prototype, "type", {
        set: function (value) {
            this._filter.type = value;
        },
        enumerable: true,
        configurable: true
    });
    return Filter;
})(BaseModule);
///<reference path="modules/Osc.ts"/>
///<reference path="modules/Amp.ts"/>
///<reference path="modules/Env.ts"/>
///<reference path="modules/Noise.ts"/>
///<reference path="modules/Filter.ts"/>
var Channel = (function () {
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
        this._preOutput = new Amp(context);
        this._preOutput.level = 1.0;
        this._postOutput = new Amp(context);
        this._postOutput.level = options.hasOwnProperty('outputLevel') ? options.outputLevel : 1.0;
        this._osc = new Osc(context);
        this._osc.type = options.hasOwnProperty('type') ? options.type : 'sine';
        this._osc.frequencyValue = options.hasOwnProperty('frequency') ? options.frequency : 440;
        this._oscAmp = new Amp(context);
        this._oscPitchEnv = new Env(context);
        this._oscPitchEnv.attack = options.hasOwnProperty('oscPitchAttack') ? options.oscPitchAttack : 0.1;
        this._oscPitchEnv.decay = options.hasOwnProperty('oscPitchDecay') ? options.oscPitchDecay : 0.5;
        this._oscPitchEnv.max = options.hasOwnProperty('frequency') ? options.frequency : 440;
        this._oscAmpEnv = new Env(context);
        this._oscAmpEnv.attack = options.hasOwnProperty('oscAmpAttack') ? options.oscAmpAttack : 0.2;
        this._oscAmpEnv.decay = options.hasOwnProperty('oscAmpDecay') ? options.oscAmpDecay : 0.8;
        this._oscAmpEnv.max = options.hasOwnProperty('oscLevel') ? options.oscLevel : 1.0;
        this._noise = new Noise(context);
        this._noiseAmp = new Amp(context);
        this._noiseAmpEnv = new Env(context);
        this._noiseAmpEnv.attack = options.hasOwnProperty('noiseAttack') ? options.noiseAttack : 0.1;
        this._noiseAmpEnv.decay = options.hasOwnProperty('noiseDecay') ? options.noiseDecay : 0.5;
        this._noiseAmpEnv.max = options.hasOwnProperty('noiseLevel') ? options.noiseLevel : 1.0;
        // single peak filter for channel
        this._channelFilter = new Filter(context);
        this._channelFilter.frequency = 500;
        this._channelFilter.type = 'peaking';
        this._channelFilter.gain = 0;
        // choice of high/mid/low pass for noise
        // wiring!
        this._osc.connect(this._oscAmp);
        this._oscPitchEnv.connect(this._osc.frequency);
        this._oscAmpEnv.connect(this._oscAmp.amplitude);
        this._oscAmp.connect(this._preOutput);
        this._noise.connect(this._noiseAmp);
        this._noiseAmpEnv.connect(this._noiseAmp.amplitude);
        this._noiseAmp.connect(this._preOutput);
        this._preOutput.connect(this._channelFilter);
        this._channelFilter.connect(this._postOutput);
        this._postOutput.connect(context.destination);
        this._osc.start();
        this._noise.noise.start();
    }
    Channel.prototype.trigger = function () {
        this._oscAmpEnv.trigger();
        this._oscPitchEnv.trigger();
        this._noiseAmpEnv.trigger();
    };
    Object.defineProperty(Channel.prototype, "level", {
        // this sure seems like it sucks
        get: function () {
            return this._preOutput.amplitude.value;
        },
        set: function (level) {
            this._preOutput.amplitude.value = level;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channel.prototype, "oscLevel", {
        get: function () {
            return this._oscAmpEnv.max;
        },
        set: function (level) {
            this._oscAmpEnv.max = level;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channel.prototype, "noiseLevel", {
        get: function () {
            return this._noiseAmpEnv.max;
        },
        set: function (level) {
            this._noiseAmpEnv.max = level;
        },
        enumerable: true,
        configurable: true
    });
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
            this._oscPitchEnv.max = frequency;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channel.prototype, "oscAttack", {
        get: function () {
            return this._oscAmpEnv.attack;
        },
        set: function (value) {
            this._oscAmpEnv.attack = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channel.prototype, "oscDecay", {
        get: function () {
            return this._oscAmpEnv.decay;
        },
        set: function (value) {
            this._oscAmpEnv.decay = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channel.prototype, "pitchAttack", {
        get: function () {
            return this._oscPitchEnv.attack;
        },
        set: function (value) {
            this._oscPitchEnv.attack = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channel.prototype, "pitchDecay", {
        get: function () {
            return this._oscPitchEnv.decay;
        },
        set: function (value) {
            this._oscPitchEnv.decay = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channel.prototype, "noiseAttack", {
        get: function () {
            return this._noiseAmpEnv.attack;
        },
        set: function (value) {
            this._noiseAmpEnv.attack = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channel.prototype, "noiseDecay", {
        get: function () {
            return this._noiseAmpEnv.decay;
        },
        set: function (value) {
            this._noiseAmpEnv.decay = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channel.prototype, "channelFilterGain", {
        get: function () {
            return this._channelFilter.gain;
        },
        set: function (value) {
            this._channelFilter.gain = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channel.prototype, "channelFilterFreq", {
        get: function () {
            return this._channelFilter.frequency;
        },
        set: function (value) {
            this._channelFilter.frequency = value;
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
        this.started = false;
    }
    Sequencer.prototype.loop = function () {
        // can we just do the active thing on the indicator?
        // also be nice to add a glowy effect
        var _this = this;
        $('.sequence li').removeClass('active');
        $('.sequence').each(function (i, sequence) {
            var $sequence = $(sequence);
            var $current = $($sequence.children('.beat')[_this._beat]);
            if ($current.hasClass('on') && $sequence.data('channel') !== 'indicator') {
                _this._channels[$sequence.data('channel')].trigger();
            }
            $current.addClass('active');
        });
        this._beat = this._beat == this._length - 1 ? 0 : this._beat + 1;
    };
    Sequencer.prototype.start = function () {
        var _this = this;
        this.started = true;
        this._interval = setInterval(function () { _this.loop(); }, this.bpmToMs(this._tempo));
    };
    Sequencer.prototype.stop = function () {
        this.started = false;
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
    UI.addChannel = function (name, channel, length, pattern) {
        if (pattern === void 0) { pattern = '0000000000000000'; }
        this._header(name);
        this._panel(name, channel);
        this._sequence(name, channel, length, pattern);
    };
    UI.removeChannel = function () {
        // delete it all
    };
    UI.indicator = function (length) {
        var $sequence = $('<ul class="sequence" data-channel="indicator" id="indicator-seq"></ul>');
        for (var i = 0; i < length; ++i) {
            $sequence.append('<li class="beat"></li>');
        }
        $('#sequencer').append($sequence);
    };
    UI._header = function (name) {
        var $header = $("<li><a href=\"#\" data-name=\"" + name + "\">" + name + "</a></li>");
        $('#channel-headers').append($header);
    };
    UI._panel = function (name, channel) {
        var $panel = $("<div class=\"channel\" id=\"" + name + "\"></div>");
        var $mixer = $('<div class="section"><p>mixer</p></div>');
        $mixer.append(this._knob('level', channel.level * 100));
        $mixer.append(this._knob('oscLevel', channel.oscLevel * 100));
        $mixer.append(this._knob('noiseLevel', channel.noiseLevel * 100));
        $mixer.append(this._knob('filterFreq', channel.channelFilterFreq));
        $mixer.append(this._knob('filterGain', channel.channelFilterGain));
        var $osc = $('<div class="section"><p>osc</p></div>');
        $osc.append("<select name=\"" + name + "-wave\" class=\"wave\">" + this._oscTypeSelect + "</select>");
        $osc.append(this._knob('frequency', channel.frequency));
        $osc.append(this._knob('oscAttack', channel.oscAttack * 1000));
        $osc.append(this._knob('oscDecay', channel.oscDecay * 1000));
        $osc.append(this._knob('pitchAttack', channel.pitchAttack * 1000));
        $osc.append(this._knob('pitchDecay', channel.pitchDecay * 1000));
        var $noise = $('<div class="section"><p>noise</p></div>');
        $noise.append(this._knob('noiseAttack', channel.noiseAttack * 1000));
        $noise.append(this._knob('noiseDecay', channel.noiseDecay * 1000));
        $panel.append($mixer);
        $panel.append($osc);
        $panel.append($noise);
        $('#synth').append($panel);
        $("#" + name + " .level").knob($.extend({}, this._knobDefaults, {
            min: 0,
            max: 100,
            change: function (value) {
                channel.level = value / 100;
            },
            format: function (value) {
                return 'level';
            }
        }));
        // TODO: combine this and next into 50:50 knob
        $("#" + name + " .oscLevel").knob($.extend({}, this._knobDefaults, {
            min: 0,
            max: 100,
            change: function (value) {
                channel.oscLevel = value / 100;
            },
            format: function (value) {
                return 'osc';
            }
        }));
        $("#" + name + " .noiseLevel").knob($.extend({}, this._knobDefaults, {
            min: 0,
            max: 100,
            change: function (value) {
                channel.noiseLevel = value / 100;
            },
            format: function (value) {
                return 'noise';
            }
        }));
        $("#" + name + " .filterGain").knob($.extend({}, this._knobDefaults, {
            min: -40,
            max: 40,
            change: function (value) {
                channel.channelFilterGain = value;
            },
            format: function (value) {
                return 'fltr gain';
            }
        }));
        $("#" + name + " .filterFreq").knob($.extend({}, this._knobDefaults, {
            min: 10,
            max: 22500,
            change: function (value) {
                channel.channelFilterFreq = value;
            },
            format: function (value) {
                return 'fltr freq';
            }
        }));
        $("#" + name + " .wave").change(function () {
            channel.wave = $(this).val();
        });
        $("#" + name + " .frequency").knob($.extend({}, this._knobDefaults, {
            min: 20,
            max: 2000,
            change: function (value) {
                channel.frequency = value * 1; // idk why
            },
            format: function (value) {
                return value;
            }
        }));
        $("#" + name + " .oscAttack").knob($.extend({}, this._knobDefaults, {
            min: 0,
            max: 10000,
            change: function (value) {
                channel.oscAttack = value / 1000;
            },
            format: function (value) {
                return value;
            }
        }));
        $("#" + name + " .oscDecay").knob($.extend({}, this._knobDefaults, {
            min: 10,
            max: 10000,
            change: function (value) {
                channel.oscDecay = value / 1000;
            },
            format: function (value) {
                return value;
            }
        }));
        $("#" + name + " .pitchAttack").knob($.extend({}, this._knobDefaults, {
            min: 0,
            max: 10000,
            change: function (value) {
                channel.pitchAttack = value / 1000;
            },
            format: function (value) {
                return value;
            }
        }));
        $("#" + name + " .pitchDecay").knob($.extend({}, this._knobDefaults, {
            min: 10,
            max: 10000,
            change: function (value) {
                channel.pitchDecay = value / 1000;
            },
            format: function (value) {
                return value;
            }
        }));
        $("#" + name + " .noiseAttack").knob($.extend({}, this._knobDefaults, {
            min: 0,
            max: 10000,
            change: function (value) {
                channel.noiseAttack = value / 1000;
            },
            format: function (value) {
                return value;
            }
        }));
        $("#" + name + " .noiseDecay").knob($.extend({}, this._knobDefaults, {
            min: 10,
            max: 10000,
            change: function (value) {
                channel.noiseDecay = value / 1000;
            },
            format: function (value) {
                return value;
            }
        }));
    };
    UI._sequence = function (name, channel, length, pattern) {
        // do sequences here instead of in sequencer
        var $sequence = $('<ul class="sequence"></ul>');
        $sequence.attr('data-channel', name);
        $sequence.append("<li class=\"sequence-label\">" + name + "</li>");
        for (var i = 0; i < length; ++i) {
            var cssClass = 'beat' + (pattern.charAt(i) === '1' ? ' on' : '');
            $sequence.append("<li class=\"" + cssClass + "\"><div class=\"light-outer\"><div class=\"light-inner\"></div></div></li>");
        }
        $sequence.append("<li><a href=\"#\" class=\"clear-sequence\">clear</a></li>");
        $('#sequencer-title').after($sequence);
    };
    UI._knob = function (type, value) {
        return "<div>\n\t\t\t<input type=\"text\" class=\"knob " + type + "\" value=\"" + value + "\">\n\t\t</div>";
    };
    UI._knobDefaults = {
        'angleOffset': -160,
        'angleArc': 320,
        'thickness': 0.1,
        'width': 50,
        'height': 50,
        'fgColor': '#0f0'
    };
    UI._oscTypeSelect = "\n\t\t<option>sine</option>\n        <option>square</option>\n        <option>sawtooth</option>\n\t    <option>triangle</option>\n\t";
    UI._filterTypeSelect = "\n\t\t<option>lowpass</option>\n\t\t<option>bandpass</option>\n\t\t<option>highpass</option>\n\t";
    return UI;
})();
///<reference path="jquery.d.ts"/>
///<reference path="Channel.ts"/>
///<reference path="Sequencer.ts"/>
///<reference path="UI.ts"/>
///<reference path="jquery.knob.d.ts"/>
var audioContext = new (AudioContext || webkitAudioContext)();
var tempo = 120;
var channels = {
    // better but still clicky
    'kick': new Channel(audioContext, {
        frequency: 105,
        oscAmpAttack: 0,
        oscAmpDecay: 0.630,
        oscPitchAttack: 0,
        oscPitchDecay: 0.380,
        noiseLevel: 0,
        oscLevel: 1.0,
        level: 0.8
    }),
    // need to tailor noise level (it is V LOUD)
    'snare': new Channel(audioContext, {
        frequency: 800,
        noiseLevel: 0.35,
        noiseAttack: 0,
        noiseDecay: 0.37,
        oscLevel: 0,
        level: 0.8
    }),
    'hat': new Channel(audioContext, {
        frequency: 1500,
        noiseLevel: 0.3,
        oscLevel: 0,
        noiseAttack: 0,
        noiseDecay: 0.15
    }),
    'thing': new Channel(audioContext, {
        frequency: 1000,
        noiseLevel: 0.0,
        oscLevel: 0.3
    })
};
// there's some encoding to be done here
var patterns = {
    kick: '1100001011000010',
    snare: '0000100000001000',
    hat: '0010010100110101'
};
var sequencer = new Sequencer(channels, tempo);
$.each(channels, function (name, channel) {
    UI.addChannel(name, channel, sequencer.length, patterns[name]);
});
$('.channel').hide().first().show();
$('#channel-headers li').first().addClass('active');
UI.indicator(sequencer.length);
// put these things in the UI class
// if dynamic elements need "on" bindings
$('.sequence li').click(function () {
    $(this).toggleClass('on');
});
$('#channel-headers li a').click(function () {
    $('#channel-headers li').removeClass('active');
    $('.channel').hide();
    $('#' + $(this).data('name')).show();
    $(this).parent().addClass('active');
    return false;
});
$('#start').click(function () {
    if (!sequencer.started) {
        sequencer.start();
        $('#start').toggleClass('active');
    }
    return false;
});
$('#stop').click(function () {
    if (sequencer.started) {
        sequencer.stop();
        $('#stop').toggleClass('active');
    }
    return false;
});
$('#tempo').change(function () {
    sequencer.setTempo($(this).val());
});
$('#tempo').keyup(function () {
    sequencer.setTempo($(this).val());
});
$('.clear-sequence').click(function () {
    $(this).closest('ul')
        .children('li')
        .removeClass('on');
    return false;
});
sequencer.start();
//# sourceMappingURL=app.js.map