///<reference path="modules/Amp.ts"/>
///<reference path="Sequencer.ts"/>
///<reference path="UI.ts"/>

/**
 * A drum machine with channels and a sequencer
 */
class Machine {
	private _context: AudioContext;
	private _master: Amp;
	private _sequencer: Sequencer;
	private _channels: {};
	private _tempo: number;
	
	constructor(context: AudioContext, tempo: number = 120) {
		this._context = context;
		
		this._master = new Amp(context);
		this._master.level = 1.0;
		this._master.connect(context.destination);
		
		this._sequencer = new Sequencer(tempo);
		
		this._channels = {};
		
		this._tempo = tempo;
	}
	
	addChannel(name: string, channel: {}, pattern?: string) {
		this._channels[name] = new Channel(this._context, this._master, channel);
		
		this._sequencer.addChannel(name, this._channels[name]);
		UI.addChannel(name, this._channels[name], this._sequencer.length, pattern || null);
	}
	
	init() {
		UI.indicator(this._sequencer.length);
        UI.init(this._sequencer, this._channels, this._master, this._tempo);
	}
}