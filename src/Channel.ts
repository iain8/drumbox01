import Amp from './modules/Amp';
import Env from './modules/Env';
import Filter from './modules/Filter';
import Noise from './modules/Noise';
import Osc from './modules/Osc';

/**
 * Giant bastard channel class, wraps a lot of things to try and make an
 * easier public API, possibly fails
 */
export default class Channel {
  private osc: Osc;
  private oscAmp: Amp;
  private oscPitchEnv: Env;
  private oscAmpEnv: Env;

  private noise: Noise;
  private noiseAmp: Amp;
  private noiseAmpEnv: Env;

  private channelFilter: Filter;
  private channelCleanAmp: Amp;

  private preOutput: Amp;
  private postOutput: Amp;

  private started: boolean;

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
   *     wave: 'sine'
   * }
   */
  constructor(context: AudioContext, output: Amp, options: any = {}) {
    this.preOutput = new Amp(context);
    this.preOutput.level = 1.0;

    this.postOutput = new Amp(context);
    this.postOutput.level = options.hasOwnProperty('outputLevel') ? options.outputLevel : 1.0;

    this.osc = new Osc(context);
    this.osc.type = options.hasOwnProperty('wave') ? options.wave : 'sine';
    this.osc.frequencyValue = options.hasOwnProperty('frequency') ? options.frequency : 440;

    this.oscAmp = new Amp(context);

    this.oscPitchEnv = new Env(context);
    this.oscPitchEnv.attack = options.hasOwnProperty('oscPitchAttack') ? options.oscPitchAttack : 0.1;
    this.oscPitchEnv.decay = options.hasOwnProperty('oscPitchDecay') ? options.oscPitchDecay : 0.5;
    this.oscPitchEnv.max = options.hasOwnProperty('frequency') ? options.frequency : 440;

    this.oscAmpEnv = new Env(context);
    this.oscAmpEnv.attack = options.hasOwnProperty('oscAmpAttack') ? options.oscAmpAttack : 0.2;
    this.oscAmpEnv.decay = options.hasOwnProperty('oscAmpDecay') ? options.oscAmpDecay : 0.8;
    this.oscAmpEnv.max = options.hasOwnProperty('oscLevel') ? options.oscLevel : 1.0;

    this.noise = new Noise(context);

    this.noiseAmp = new Amp(context);

    this.noiseAmpEnv = new Env(context);
    this.noiseAmpEnv.attack = options.hasOwnProperty('noiseAttack') ? options.noiseAttack : 0.1;
    this.noiseAmpEnv.decay = options.hasOwnProperty('noiseDecay') ? options.noiseDecay : 0.5;
    this.noiseAmpEnv.max = options.hasOwnProperty('noiseLevel') ? options.noiseLevel : 1.0;

    // single peak filter for channel
    this.channelFilter = new Filter(context);
    this.channelFilter.frequency = options.hasOwnProperty('channelFilterFreq') ? options.channelFilterFreq : 500;
    this.channelFilter.gain = options.hasOwnProperty('channelFilterGain') ? options.channelFilterGain : 0;
    this.channelFilter.type = 'peaking';

    // wiring!
    this.osc.connect(this.oscAmp);
    this.oscPitchEnv.connect(this.osc.frequency);
    this.oscAmpEnv.connect(this.oscAmp.amplitude);
    this.oscAmp.connect(this.preOutput);
    this.noise.connect(this.noiseAmp);
    this.noiseAmpEnv.connect(this.noiseAmp.amplitude);
    this.noiseAmp.connect(this.preOutput);

    this.preOutput.connect(this.channelFilter);
    this.channelFilter.connect(this.postOutput);

    this.postOutput.connect(output);
  }

  /**
   * Start the channel
   */
  public start(): void {
    if (!this.started) {
      this.osc.start();
      this.noise.start();
    }

    this.started = true;
  }

  /**
   * Trigger all the sound making parts of the channel
   */
  public trigger(): void {
    this.oscAmpEnv.trigger();
    this.oscPitchEnv.trigger();
    this.noiseAmpEnv.trigger();
  }

  // getting and setting ad nauseum

  get channelFilterGain(): number {
    return this.channelFilter.gain;
  }

  set channelFilterGain(value: number) {
    this.channelFilter.gain = value;
  }

  get channelFilterFreq(): number {
    return this.channelFilter.frequency;
  }

  set channelFilterFreq(value: number) {
    this.channelFilter.frequency = value;
  }

  get frequency() {
    return this.osc.frequencyValue;
  }

  // frequency determined by maximum of pitch envelope
  set frequency(frequency: number) {
    this.osc.frequencyValue = frequency;
    this.oscPitchEnv.max = frequency;
  }

  get level(): number {
    return this.preOutput.amplitude.value;
  }

  set level(level: number) {
    this.preOutput.amplitude.value = level;
  }

  get noiseAttack(): number {
    return this.noiseAmpEnv.attack;
  }

  set noiseAttack(value: number) {
    this.noiseAmpEnv.attack = value;
  }

  get noiseDecay(): number {
    return this.noiseAmpEnv.decay;
  }

  set noiseDecay(value: number) {
    this.noiseAmpEnv.decay = value;
  }

  get noiseLevel(): number {
    return this.noiseAmpEnv.max;
  }

  set noiseLevel(level: number) {
    this.noiseAmpEnv.max = level;
  }

  get oscAttack(): number {
    return this.oscAmpEnv.attack;
  }

  set oscAttack(value: number) {
    this.oscAmpEnv.attack = value;
  }

  get oscDecay(): number {
    return this.oscAmpEnv.decay;
  }

  set oscDecay(value: number) {
    this.oscAmpEnv.decay = value;
  }

  get oscLevel(): number {
    return this.oscAmpEnv.max;
  }

  set oscLevel(level: number) {
    this.oscAmpEnv.max = level;
  }

  get pitchAttack(): number {
    return this.oscPitchEnv.attack;
  }

  set pitchAttack(value: number) {
    this.oscPitchEnv.attack = value;
  }

  get pitchDecay(): number {
    return this.oscPitchEnv.decay;
  }

  set pitchDecay(value: number) {
    this.oscPitchEnv.decay = value;
  }

  get wave(): string {
    return this.osc.type;
  }

  set wave(type: string) {
    this.osc.type = type;
  }
}
