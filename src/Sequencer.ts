///<reference path="jquery.d.ts"/>
///<reference path="Channel.ts"/>

class Sequencer {
	private _tempo: number;
	private _beat: number;
	private _length: number;
	private _channels; // what is it
	private _interval;	// what is it
	
	constructor(channels, tempo: number = 120) {
		this._beat = 0;
		this._length = 16;
		this._channels = channels;
		this._tempo = tempo;
	}
	
	loop() {
		// can we just do the active thing on the indicator?
		// also be nice to add a glowy effect
		
		$('.sequence li').removeClass('active');
		
		$('.sequence').each((i, sequence) => {
			var $sequence = $(sequence);
			var $current = $($sequence.children('li')[this._beat]);
			
			if ($current.hasClass('on') && $sequence.data('channel') !== 'indicator') {
				this._channels[$sequence.data('channel')].trigger();
			}
			
			$current.addClass('active');
		});
		
		this._beat = this._beat == this._length - 1 ? 0 : this._beat + 1;
	}
	
	start() {
		$.each(this._channels, function() {
			this.start();
		});
		
		this._interval = setInterval(() => { this.loop(); }, this.bpmToMs(this._tempo));
	}
	
	setTempo(tempo: number) {
		this._tempo = tempo;
		
		clearInterval(this._interval);
		this.start();
	}
	
	bpmToMs(bpm: number) {
		return (60000 / bpm) / 2;
	}
}