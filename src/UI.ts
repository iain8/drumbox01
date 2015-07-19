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
	
	private static _typeSelect = `<option>sine</option>
        <option>square</option>
        <option>sawtooth</option>
	    <option>triangle</option>
	`;
	
	static addChannel(name: string, channel: Channel, length: number) {
		this._panel(name, channel);
		this._sequence(name, channel, length);
	}
	
	static removeChannel() {
		// delete it all
	}
	
	private static _panel(name: string, channel: Channel) {
		var $panel = $(`<div class="node" id="${name}"></div>`);
		$panel.append(`<p>${name}</p>`);
		
		var $mixer = $('<div class="section"><p>mixer</p></div>');
		$mixer.append(this._knob('level', channel.level * 100));
		
		var $osc = $('<div class="section"><p>osc</p></div>');
		$osc.append(`<select name="${name}-wave" class="wave">${this._typeSelect}</select>`);
		$osc.append(this._knob('frequency', channel.frequency));
		$osc.append(this._knob('oscAttack', channel.oscAttack));
		$osc.append(this._knob('oscDecay', channel.oscDecay));
		$osc.append(this._knob('pitchAttack', channel.pitchAttack));
		$osc.append(this._knob('pitchDecay', channel.pitchDecay));
		
		var $noise = $('<div class="section"><p>noise</p></div>');
		
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
			format: function() {
				return 'level';
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
			format: function() {
				return 'freq';
			}
		}));
		
		$(`#${name} .oscAttack`).knob($.extend({}, this._knobDefaults, {
			min: 0,
			max: 10000,
			change: function(value) {
				channel.oscAttack = value / 1000;
			},
			format: function() {
				return 'attack';
			}
		}));
		
		$(`#${name} .oscDecay`).knob($.extend({}, this._knobDefaults, {
			min: 10,
			max: 10000,
			change: function(value) {
				channel.oscDecay = value / 1000;
			},
			format: function() {
				return 'decay';
			}
		}));
		
		$(`#${name} .pitchAttack`).knob($.extend({}, this._knobDefaults, {
			min: 0,
			max: 10000,
			change: function(value) {
				channel.pitchAttack = value / 1000;
			},
			format: function() {
				return 'attack';
			}
		}));
		
		$(`#${name} .pitchDecay`).knob($.extend({}, this._knobDefaults, {
			min: 10,
			max: 10000,
			change: function(value) {
				channel.pitchDecay = value / 1000;
			},
			format: function() {
				return 'decay';
			}
		}));
	}
	
	private static _sequence(name: string, channel: Channel, length: number) {
		// do sequences here instead of in sequencer
		var $sequence = $('<ul class="sequence"></ul>');
		$sequence.attr('data-channel', name);
		
		for (var i = 0; i < length; ++i) {
			$sequence.append('<li><div class="light-outer"><div class="light-inner"></div></div></li>');
		}
		
		$('#sequencer-title').after($sequence);
	}
	
	private static _knob(type: string, value: number) {
		return `<div>
			<input type="text" class="knob ${type}" value="${value}">
		</div>`;
	}
}