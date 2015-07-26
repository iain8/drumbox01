///<reference path="jquery.d.ts"/>
///<reference path="jquery.knob.d.ts"/>
///<reference path="Channel.ts"/>

class UI {
	private static _knobDefaults = {
	    'angleOffset': -160,
	    'angleArc': 320,
	    'thickness': 0.1,
	    'width': 50,
	    'height': 50,
	    'fgColor': '#0f0'
	};
	
	private static _oscTypeSelect = `
		<option>sine</option>
        <option>square</option>
        <option>sawtooth</option>
	    <option>triangle</option>
	`;
	
	private static _filterTypeSelect = `
		<option>lowpass</option>
		<option>bandpass</option>
		<option>highpass</option>
	`;
	
	static addChannel(name: string, channel: Channel, length: number, pattern: string = '0000000000000000') {
		this._header(name);
		this._panel(name, channel);
		this._sequence(name, channel, length, pattern);
	}
	
	static removeChannel() {
		// delete it all
	}
	
	static indicator(length: number) {
		var $sequence = $('<ul class="sequence" data-channel="indicator" id="indicator-seq"></ul>');
		
		for (var i = 0; i < length; ++i) {
			$sequence.append('<li class="beat"></li>');
		}
		
		$('#sequencer').append($sequence);
	}
	
	private static _header(name: string) {
		var $header = $(`<li><a href="#" data-name="${name}">${name}</a></li>`);
		$('#channel-headers').append($header);
	}
	
	private static _panel(name: string, channel: Channel) {
		var $panel = $(`<div class="channel" id="${name}"></div>`);
		
		var $mixer = $('<div class="section"><p>mixer</p></div>');
		$mixer.append(this._knob('level', channel.level * 100));
		$mixer.append(this._knob('oscLevel', channel.oscLevel * 100));
		$mixer.append(this._knob('noiseLevel', channel.noiseLevel * 100));
		$mixer.append(this._knob('filterFreq', channel.channelFilterFreq));
		$mixer.append(this._knob('filterGain', channel.channelFilterGain));
		
		var $osc = $('<div class="section"><p>osc</p></div>');
		$osc.append(`<select name="${name}-wave" class="wave">${this._oscTypeSelect}</select>`);
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
		
		$(`#${name} .level`).knob($.extend({}, this._knobDefaults, {
			min: 0,
			max: 100,
			change: function(value) {
				channel.level = value / 100;
			},
			format: function(value) {
				return 'level';
			}
		}));
		
		// TODO: combine this and next into 50:50 knob
		$(`#${name} .oscLevel`).knob($.extend({}, this._knobDefaults, {
			min: 0,
			max: 100,
			change: function(value) {
				channel.oscLevel = value / 100;
			},
			format: function(value) {
				return 'osc';
			}
		}));
		
		$(`#${name} .noiseLevel`).knob($.extend({}, this._knobDefaults, {
			min: 0,
			max: 100,
			change: function(value) {
				channel.noiseLevel = value / 100;
			},
			format: function(value) {
				return 'noise';
			}
		}));
		
		$(`#${name} .filterGain`).knob($.extend({}, this._knobDefaults, {
			min: -40,
			max: 40,
			change: function(value) {
				channel.channelFilterGain = value;
			},
			format: function(value) {
				return 'fltr gain';
			}
		}));
		
		$(`#${name} .filterFreq`).knob($.extend({}, this._knobDefaults, {
			min: 10,
			max: 22500, // TODO: calculate this
			change: function(value) {
				channel.channelFilterFreq = value;
			},
			format: function(value) {
				return 'fltr freq';
			}
		}));
		
		$(`#${name} .wave`).change(function() {
			channel.wave = $(this).val();
		});
		
		$(`#${name} .frequency`).knob($.extend({}, this._knobDefaults, {
			min: 20,
			max: 2000,
			change: function(value) {
				channel.frequency = value * 1; // idk why
			},
			format: function(value) {
				return value;
			}
		}));
		
		$(`#${name} .oscAttack`).knob($.extend({}, this._knobDefaults, {
			min: 0,
			max: 10000,
			change: function(value) {
				channel.oscAttack = value / 1000;
			},
			format: function(value) {
				return value;
			}
		}));
		
		$(`#${name} .oscDecay`).knob($.extend({}, this._knobDefaults, {
			min: 10,
			max: 10000,
			change: function(value) {
				channel.oscDecay = value / 1000;
			},
			format: function(value) {
				return value;
			}
		}));
		
		$(`#${name} .pitchAttack`).knob($.extend({}, this._knobDefaults, {
			min: 0,
			max: 10000,
			change: function(value) {
				channel.pitchAttack = value / 1000;
			},
			format: function(value) {
				return value;
			}
		}));
		
		$(`#${name} .pitchDecay`).knob($.extend({}, this._knobDefaults, {
			min: 10,
			max: 10000,
			change: function(value) {
				channel.pitchDecay = value / 1000;
			},
			format: function(value) {
				return value;
			}
		}));
		
		$(`#${name} .noiseAttack`).knob($.extend({}, this._knobDefaults, {
			min: 0,
			max: 10000,
			change: function(value) {
				channel.noiseAttack = value / 1000;
			},
			format: function(value) {
				return value;
			}
		}));
		
		$(`#${name} .noiseDecay`).knob($.extend({}, this._knobDefaults, {
			min: 10,
			max: 10000,
			change: function(value) {
				channel.noiseDecay = value / 1000;
			},
			format: function(value) {
				return value;
			}
		}));
	}
	
	private static _sequence(name: string, channel: Channel, length: number, pattern: string) {
		// do sequences here instead of in sequencer
		var $sequence = $('<ul class="sequence"></ul>');
		$sequence.attr('data-channel', name);
		
		$sequence.append(`<li class="sequence-label">${name}</li>`);
		
		for (var i = 0; i < length; ++i) {
			var cssClass = 'beat' + (pattern.charAt(i) === '1' ? ' on' : '');
			
			$sequence.append(`<li class="${cssClass}"><div class="light-outer"><div class="light-inner"></div></div></li>`);
		}
		
		$sequence.append(`<li><a href="#" class="clear-sequence">clear</a></li>`);
		
		$('#sequencer').prepend($sequence);
	}
	
	private static _knob(type: string, value: number) {
		return `<div>
			<input type="text" class="knob ${type}" value="${value}">
		</div>`;
	}
}