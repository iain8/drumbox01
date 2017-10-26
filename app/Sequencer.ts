import * as $ from 'jquery';
import Channel from './Channel';

/**
 * Sequencer for the beats
 */
export default class Sequencer {
  public started: boolean;
  private tempo: number;
  private beat: number;
  private seqLength: number;
  private channels: {};
  private interval: any;
  private seqDivision: number;
  private iOSTouchStarted: boolean;

  constructor(tempo: number = 120) {
    this.beat = 0;
    this.seqLength = 16;
    this.channels = {};
    this.tempo = tempo;
    this.seqDivision = 4;
    this.started = false;
    this.iOSTouchStarted = false;
  }

  /**
   * Add a channel to the sequencer
   */
  public addChannel(name: string, channel: {}) {
    this.channels[name] = channel;
  }

  /**
   * Start the sequencer
   */
  public start() {
    $.each(this.channels, function() {
      this.start();
    });

    this.started = true;

    this.interval = setInterval(() => this.step(), this.bpmToMs(this.tempo));
  }

  /**
   * Stop the sequencer
   */
  public stop() {
    this.started = false;
    clearInterval(this.interval);
  }

  /**
   * Set the tempo in beats per minute
   */
  public setTempo(tempo: number) {
    this.tempo = tempo;

    clearInterval(this.interval);
    this.start();
  }

  public set division(value: number) {
    this.seqDivision = value;

    clearInterval(this.interval);
    this.start();
  }

  /**
   * Perform one sequencer step
   */
  private step() {
    $('.sequence li').removeClass('active');

    $('.sequence').each((i, sequence) => {
      const $sequence = $(sequence);
      const $current = $($sequence.children('.beat')[this.beat]);

      if ($current.hasClass('on') && $sequence.data('channel') !== 'indicator') {
        this.channels[$sequence.data('channel')].trigger();
      }

      $current.addClass('active');
    });

    this.beat = this.beat === this.seqLength - 1 ? 0 : this.beat + 1;
  }

  /**
   * Convert bpm to ms
   */
  private bpmToMs(bpm: number) {
    return (60000 / bpm) / this.seqDivision;
  }

  get length() {
    return this.seqLength;
  }
}
