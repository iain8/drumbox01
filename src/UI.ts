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
		var $panel = $('<div class="node"></div>');
		$panel.append(`<p>${name}</p>`);
		
		var $mixer = $('<div class="section"><p>mixer</p></div>');
		$mixer.append(this._knob('level', channel.level));
		
		var $osc = $('<div class="section"><p>osc</p></div>');
		$osc.append(`<select name="${name}-wave" class="wave">${this._typeSelect}</select>`);
		$osc.append(this._knob('frequency', channel.frequency));
		
		
		var $noise = $('<div class="section"><p>noise</p></div>');
		
		$panel.append($mixer);
		$panel.append($osc);
		$panel.append($noise);
		
		$('#synth').append($panel);
		
		$('.knob').knob(this._knobDefaults);
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
		return `<div><input type="text" class="knob ${type}" value="${value}"></div>`;
	}
}