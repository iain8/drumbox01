///<reference path="jquery.d.ts"/>
///<reference path="Channel.ts"/>

/**
 * Sequencer for the beats
 */
class Sequencer {
	private _tempo: number;
	private _beat: number;
	private _length: number;
	private _channels: {};
	private _interval;
	private _division: number;
	started: boolean;
	
	constructor(tempo: number = 120) {
		this._beat = 0;
		this._length = 16;
		this._channels = {};
		this._tempo = tempo;
		this._division = 4;
		this.started = false;
	}
	
	/**
	 * Add a channel to the sequencer
	 */
	addChannel(name: string, channel: {}) {
		this._channels[name] = channel;
	}
	
	/**
	 * Perform one sequencer step
	 */
	step() {
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
	
	/**
	 * Start the sequencer
	 */
	start() {
		this.started = true;
		
		this._interval = setInterval(() => { this.step(); }, this.bpmToMs(this._tempo));
	}
	
	/**
	 * Stop the sequencer
	 */
	stop() {
		this.started = false;
		clearInterval(this._interval);
	}
	
	/**
	 * Set the tempo in beats per minute
	 */
	setTempo(tempo: number) {
		this._tempo = tempo;
		
		clearInterval(this._interval);
		this.start();
	}
	
	set division(value: number) {
		this._division = value;
		
		clearInterval(this._interval);
		this.start();
	}
	
	/**
	 * Convert bpm to ms
	 */
	bpmToMs(bpm: number) {
		return (60000 / bpm) / this._division;
	}
	
	get length() {
		return this._length;
	}
}