///<reference path="jquery.d.ts"/>
///<reference path="Channel.ts"/>

class Sequencer {
	private _tempo: number;
	private _beat: number;
	private _length: number;
	private _channels; // what is it
	private _interval;	// what is it
	started: boolean;
	
	constructor(channels, tempo: number = 120) {
		this._beat = 0;
		this._length = 16;
		this._channels = channels;
		this._tempo = tempo;
		this.started = false;
	}
	
	loop() {
		// indicator is out of sync with sequence by 1 beat
		
		$('.sequence li').removeClass('active');
		
		$('.sequence').each((i, sequence) => {
			var $sequence = $(sequence);
			var $current = $($sequence.children('.beat')[this._beat]);
			
			if ($current.hasClass('on') && $sequence.data('channel') !== 'indicator') {
				this._channels[$sequence.data('channel')].trigger();
			}
			
			$current.addClass('active');
		});
		
		this._beat = this._beat == this._length - 1 ? 0 : this._beat + 1;
	}
	
	start() {
		this.started = true;
		
		this._interval = setInterval(() => { this.loop(); }, this.bpmToMs(this._tempo));
	}
	
	stop() {
		this.started = false;
		clearInterval(this._interval);
	}
	
	setTempo(tempo: number) {
		this._tempo = tempo;
		
		clearInterval(this._interval);
		this.start();
	}
	
	bpmToMs(bpm: number) {
		return (60000 / bpm) / 2;
	}
	
	get length() {
		return this._length;
	}
}