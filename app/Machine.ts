import Channel from './Channel';
import Amp from './modules/Amp';
import Sequencer from './Sequencer';
import UI from './UI';

/**
 * A drum machine with channels and a sequencer
 */
export default class Machine {
  private context: AudioContext;
  private master: Amp;
  private sequencer: Sequencer;
  private channels: {};
  private tempo: number;

  constructor(context: AudioContext, tempo: number = 120) {
    this.context = context;

    this.master = new Amp(context);
    this.master.level = 1.0;
    this.master.connect(context.destination);

    this.sequencer = new Sequencer(tempo);

    this.channels = {};

    this.tempo = tempo;
  }

  public addChannel(name: string, channel: {}, pattern?: string) {
    this.channels[name] = new Channel(this.context, this.master, channel);

    this.sequencer.addChannel(name, this.channels[name]);
    UI.addChannel(name, this.channels[name], this.sequencer.length, pattern || null);
  }

  public init() {
    // UI.indicator(this.sequencer.length);
    // UI.init(this.sequencer, this.channels, this.master, this.tempo);
  }
}
