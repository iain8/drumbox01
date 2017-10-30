import * as $ from 'jquery';
import Channel from './Channel';
import Amp from './modules/Amp';
import Sequencer from './Sequencer';

/**
 * Where the cardboard and tape are combined into an interface
 */
export default class UI {
  /**
   * Do remaining stuff to set up UI
   */
  public static init(sequencer: Sequencer, channels: {}, master: Amp, tempo: number) {
    // $('.channel').hide().first().show();

    // $('#channel-headers li').first().addClass('active');

    $('#channel-headers li a').click(function() {
        // $('#channel-headers li').removeClass('active');
        $('.channel').hide();
        $('#' + $(this).data('name')).show();
        $(this).parent().addClass('active');
        return false;
    });

    $('.sequence li').click(function() {
      $(this).toggleClass('on');
    });

    $('#tempo').val(tempo.toString());

    $('#division').change(function() {
      sequencer.division = $(this).val() as number;
    });

    $('.sequencer-control').click(function() {
      if (sequencer.started && $(this).attr('id') === 'stop') {
        sequencer.stop();
        $('.sequencer-control').toggleClass('active');
      } else if (!sequencer.started && $(this).attr('id') === 'start') {
        sequencer.start();
        $('.sequencer-control').toggleClass('active');
      }

      return false;
    });

    $('#tempo').bind('change keyup', function() {
      sequencer.setTempo($(this).val() as number);
    });

    $('.clear-sequence').click(function() {
        $(this).closest('ul')
            .children('li')
            .removeClass('on');

        return false;
    });

    $('.wave a').click(function() {
      const $this = $(this);
      const id = $this.closest('.channel').attr('id');
      const $list = $this.hasClass('prev') ? $this.next('ul') : $this.prev('ul');
      const $wave = $list.children('.active');

      $wave.removeClass('active');

      if ($this.hasClass('prev')) {
        if ($wave.prev().is('li')) {
          $wave.prev().addClass('active');
        } else {
          $list.children().last().addClass('active');
        }
      } else {
        if ($wave.next().is('li')) {
          $wave.next().addClass('active');
        } else {
          $list.children().first().addClass('active');
        }
      }

      channels[id].wave = $list.children('.active').data('wave');

      return false;
    });

    $('#master-volume').knob($.extend({}, this.knobDefaults, {
      min: 0,
      max: 100,
      change: (value) => {
        master.level = value / 100;
      },
    }));

    // prevent something weird refreshing the page
    $('form').submit(() => false);

    $('.knob').parent().mouseover(function() {
      $(this).children('.knob').trigger('configure', {
        format: (value) => value,
      }).trigger('change');

      $('.knob').css('font-size', '9px');
    }).mouseout(function() {
      const name = $(this).children('.knob').data('name');

      $(this).children('.knob').trigger('configure', {
        format: () => name,
      }).trigger('change');

      $('.knob').css('font-size', '9px');
    });

    $(document).ready(() => {
      $('.knob').parent().trigger('mouseout');
      $('.knob').css('font-size', '9px');
    });

    $('#loader').hide();
    $('#main-panel').show();
  }

  /**
   * Add the necessary components for a channel
   */
  public static addChannel(name: string, channel: Channel, length: number, pattern: string = '0000000000000000') {
    this.header(name);
    this.panel(name, channel);
    this.sequence(name, channel, length, pattern);
  }

  /**
   * Create the indicator sequence
   */
  public static indicator(length: number) {
    const $sequence = $('<ul class="sequence" data-channel="indicator" id="indicator-seq"></ul>');

    for (let i = 0; i < length; ++i) {
      const active = i === 0 ? ' active' : '';

      $sequence.append(`<li class="beat${active}"></li>`);
    }

    $('#sequencer').prepend($sequence);
  }

  /**
   * Default options for jQuery Knob instances
   */
  private static knobDefaults = {
    angleOffset: -160,
    angleArc: 320,
    bgColor: '#FFF',
    fgColor: '#92C8CD',
    font: "'Orbitron', monospace",
    height: 60,
    inputColor: '#363439',
    thickness: 0.3,
    width: 60,
  };

  /**
   * Options for the wave selection of the oscillator
   */
  private static waveSelect = {
    sine: 'sine',
    square: 'sqr',
    sawtooth: 'saw',
    triangle: 'tri',
  };

  /**
   * Filter options for noise filter (not yet implemented)
   */
  private static filterTypeSelect = `
    <option>lowpass</option>
    <option>bandpass</option>
    <option>highpass</option>
  `;

  /**
   * Create a header item for the channel
   */
  private static header(name: string) {
    const $header = $(`<li><a href="#" data-name="${name}">${name}</a></li>`);
    $('#channel-headers').append($header);
  }

  /**
   * Populate the panel for the channel
   */
  private static panel(name: string, channel: Channel) {
    const $panel = $(`<div class="channel" id="${name}"></div>`);

    const $mixer = $('<div class="section"><p>mixer</p></div>');
    $mixer.append(this.knob('level', 'level', channel.level * 100));
    $mixer.append(this.knob('oscLevel', 'osc', channel.oscLevel * 100));
    $mixer.append(this.knob('noiseLevel', 'noise', channel.noiseLevel * 100));
    $mixer.append(this.knob('filterFreq', 'freq', channel.channelFilterFreq));
    $mixer.append(this.knob('filterGain', 'gain', channel.channelFilterGain));

    const $osc = $('<div class="section"><p>osc</p></div>');
    $osc.append(this.waveSelector(channel.wave));
    $osc.append(this.knob('frequency', 'freq', channel.frequency));
    $osc.append(this.knob('oscAttack', 'attack', channel.oscAttack * 1000));
    $osc.append(this.knob('oscDecay', 'decay', channel.oscDecay * 1000));
    $osc.append(this.knob('pitchAttack', 'attack', channel.pitchAttack * 1000));
    $osc.append(this.knob('pitchDecay', 'decay', channel.pitchDecay * 1000));

    const $noise = $('<div class="section"><p>noise</p></div>');
    $noise.append(this.knob('noiseAttack', 'attack', channel.noiseAttack * 1000));
    $noise.append(this.knob('noiseDecay', 'decay', channel.noiseDecay * 1000));

    $panel.append($mixer);
    $panel.append($osc);
    $panel.append($noise);

    $('#synth').append($panel);

    $(`#${name} .level`).knob($.extend({}, this.knobDefaults, {
      min: 0,
      max: 100,
      change: (value) => channel.level = value / 100,
    }));

    $(`#${name} .oscLevel`).knob($.extend({}, this.knobDefaults, {
      min: 0,
      max: 100,
      change: (value) => channel.oscLevel = value / 100,
    }));

    $(`#${name} .noiseLevel`).knob($.extend({}, this.knobDefaults, {
      min: 0,
      max: 100,
      change: (value) => channel.noiseLevel = value / 100,
    }));

    $(`#${name} .filterGain`).knob($.extend({}, this.knobDefaults, {
      min: -40,
      max: 40,
      change: (value) => channel.channelFilterGain = value,
    }));

    $(`#${name} .filterFreq`).knob($.extend({}, this.knobDefaults, {
      min: 10,
      max: 22500,
      change: (value) => channel.channelFilterFreq = value,
    }));

    $(`#${name} .wave`).change(function() {
      channel.wave = $(this).val() as string;
    });

    $(`#${name} .frequency`).knob($.extend({}, this.knobDefaults, {
      min: 20,
      max: 2000,
      change: (value) => channel.frequency = value,
    }));

    $(`#${name} .oscAttack`).knob($.extend({}, this.knobDefaults, {
      min: 0,
      max: 10000,
      change: (value) => channel.oscAttack = value / 1000,
    }));

    $(`#${name} .oscDecay`).knob($.extend({}, this.knobDefaults, {
      min: 10,
      max: 10000,
      change: (value) => channel.oscDecay = value / 1000,
    }));

    $(`#${name} .pitchAttack`).knob($.extend({}, this.knobDefaults, {
      min: 0,
      max: 10000,
      change: (value) => channel.pitchAttack = value / 1000,
    }));

    $(`#${name} .pitchDecay`).knob($.extend({}, this.knobDefaults, {
      min: 10,
      max: 10000,
      change: (value) => channel.pitchDecay = value / 1000,
    }));

    $(`#${name} .noiseAttack`).knob($.extend({}, this.knobDefaults, {
      min: 0,
      max: 10000,
      change: (value) => channel.noiseAttack = value / 1000,
    }));

    $(`#${name} .noiseDecay`).knob($.extend({}, this.knobDefaults, {
      min: 10,
      max: 10000,
      change: (value) => channel.noiseDecay = value / 1000,
    }));
  }

  /**
   * Create a sequence linked to a channel
   */
  private static sequence(name: string, channel: Channel, length: number, pattern: string) {
    const $sequence = $('<ul class="sequence"></ul>');
    $sequence.attr('data-channel', name);

    for (let i = 0; i < length; ++i) {
      const cssClass = 'beat' + (pattern.charAt(i) === '1' ? ' on' : '');

      $sequence.append(`<li class="${cssClass}"></li>`);
    }

    $sequence.append(`<li><a href="#" class="clear-sequence"></a></li>`);

    $('#sequencer').prepend($sequence);
  }

  /**
   * Output the markdown for a jQuery Knob
   */
  private static knob(type: string, name: string, value: number) {
    return `<div>
      <input type="text" class="knob ${type}" value="${value}" data-name="${name}">
    </div>`;
  }

  /**
   * Make a wave selection thing
   */
  private static waveSelector(selected: string) {
    let selector = '<div class="wave"><a href="#" class="prev"></a><ul>';

    $.each(this.waveSelect, (value, option) => {
      selector += `<li${selected === value ? ' class="active"' : ''} data-wave="${value}">${option}</li>`;
    });

    selector += '</ul><a href="#" class="next"></a></div>';

    return selector;
  }
}
