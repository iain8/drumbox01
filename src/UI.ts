///<reference path="jquery.d.ts"/>
///<reference path="jquery.knob.d.ts"/>
///<reference path="Channel.ts"/>
///<reference path="Sequencer.ts"/>
///<reference path="modules/Amp.ts"/>

/**
 * Where the cardboard and tape are hurriedly combined into an interface
 */
class UI {
	/**
	 * Default options for jQuery Knob instances
	 */
	private static _knobDefaults = {
	    'angleOffset': -160,
	    'angleArc': 320,
		'bgColor': '#FFF',
		'fgColor': '#92C8CD',
		'font': 'consolas, monaco, monospace',
		'height': 50,
		'inputColor': '#363439',
	    'thickness': 0.3,
	    'width': 50,
	};
	
	/**
	 * Options for the wave selection of the oscillator
	 */
	private static _waveSelect = {
		sine: 'sine',
		square: 'sqr',
		sawtooth: 'saw',
		triangle: 'tri'
	};
	
	/**
	 * Filter options for noise filter (not yet implemented)
	 */
	private static _filterTypeSelect = `
		<option>lowpass</option>
		<option>bandpass</option>
		<option>highpass</option>
	`;
	
	/**
	 * Do remaining stuff to set up UI
	 */
	static init(sequencer: Sequencer, channels: {}, master: Amp, tempo: number) {
		$('.channel').hide().first().show();
		
		$('#channel-headers li').first().addClass('active');
		
		$('#channel-headers li a').click(function() {
		    $('#channel-headers li').removeClass('active');
		    $('.channel').hide();
		    $('#' + $(this).data('name')).show();
		    $(this).parent().addClass('active');
		    return false;
		});
		
		$('.sequence li').click(function() {
			$(this).toggleClass('on');
		});
		
		$('#tempo').val(tempo.toString());
		
		$('.sequencer-control').click(function() {
			if (sequencer.started && $(this).attr('id') === 'stop') {
				sequencer.stop();
			} else if (!sequencer.started && $(this).attr('id') === 'start') {
				sequencer.start();
			}
			
			$('.sequencer-control').toggleClass('active');
			
			return false;
		});
		
		$('#tempo').bind('change keyup', function() {
			sequencer.setTempo($(this).val());
		});
		
		$('.clear-sequence').click(function() {
		    $(this).closest('ul')
		        .children('li')
		        .removeClass('on');
		    
		    return false;
		});
		
		$('.wave a').click(function() {
			var $this = $(this);
			var id = $this.closest('.channel').attr('id');
		    var $list = $this.hasClass('prev') ? $this.next('ul') : $this.prev('ul');
		    var $wave = $list.children('.active');
			
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
		
		$('#master-volume').knob($.extend({}, this._knobDefaults, {
		    'min': 0,
		    'max': 100,
		    'change': function(value) {
		        master.level = value / 100;
		    }
		}));
		
		// prevent something weird refreshing the page
		$('form').submit(function() {
		    return false;
		});
		
		$('.knob').parent().mouseover(function() {
		    $(this).children('.knob').trigger('configure', {
		        format: function(value) {
		            return value;
		        }
		    }).trigger('change');
		    
		    $('.knob').css('font-size', '9px');
		}).mouseout(function() {
		    var name = $(this).children('.knob').data('name');
		    
		    $(this).children('.knob').trigger('configure', {
		        format: function(value) {
		            return name;
		        }
		    }).trigger('change');
		    
		    $('.knob').css('font-size', '9px');
		});
		
		$(document).ready(function() {
		    $('.knob').parent().trigger('mouseout');
		    $('.knob').css('font-size', '9px');
		});
		
		$('#loader').hide();
		$('#main-panel').show();
	}
	
	/**
	 * Add the necessary components for a channel
	 */
	static addChannel(name: string, channel: Channel, length: number, pattern: string = '0000000000000000') {
		this._header(name);
		this._panel(name, channel);
		this._sequence(name, channel, length, pattern);
	}
	
	/**
	 * Create the indicator sequence
	 */
	static indicator(length: number) {
		var $sequence = $('<ul class="sequence" data-channel="indicator" id="indicator-seq"></ul>');
		
		for (var i = 0; i < length; ++i) {
			var active = i === 0 ? ' active' : '';
			
			$sequence.append(`<li class="beat${active}"></li>`);
		}
		
		$('#sequencer').prepend($sequence);
	}
	
	/**
	 * Create a header item for the channel
	 */
	private static _header(name: string) {
		var $header = $(`<li><a href="#" data-name="${name}">${name}</a></li>`);
		$('#channel-headers').append($header);
	}
	
	/**
	 * Populate the panel for the channel
	 */
	private static _panel(name: string, channel: Channel) {
		var $panel = $(`<div class="channel" id="${name}"></div>`);
		
		var $mixer = $('<div class="section"><p>mixer</p></div>');
		$mixer.append(this._knob('level', 'level', channel.level * 100));
		$mixer.append(this._knob('oscLevel', 'osc', channel.oscLevel * 100));
		$mixer.append(this._knob('noiseLevel', 'noise', channel.noiseLevel * 100));
		$mixer.append(this._knob('filterFreq', 'freq', channel.channelFilterFreq));
		$mixer.append(this._knob('filterGain', 'gain', channel.channelFilterGain));
		
		var $osc = $('<div class="section"><p>osc</p></div>');
		$osc.append(this._waveSelector(channel.wave));
		$osc.append(this._knob('frequency', 'freq', channel.frequency));
		$osc.append(this._knob('oscAttack', 'attack', channel.oscAttack * 1000));
		$osc.append(this._knob('oscDecay', 'decay', channel.oscDecay * 1000));
		$osc.append(this._knob('pitchAttack', 'attack', channel.pitchAttack * 1000));
		$osc.append(this._knob('pitchDecay', 'decay', channel.pitchDecay * 1000));
		
		var $noise = $('<div class="section"><p>noise</p></div>');
		$noise.append(this._knob('noiseAttack', 'attack', channel.noiseAttack * 1000));
		$noise.append(this._knob('noiseDecay', 'decay', channel.noiseDecay * 1000));
		
		$panel.append($mixer);
		$panel.append($osc);
		$panel.append($noise);
		
		$('#synth').append($panel);
		
		$(`#${name} .level`).knob($.extend({}, this._knobDefaults, {
			min: 0,
			max: 100,
			change: function(value) {
				channel.level = value / 100;
			}
		}));
		
		$(`#${name} .oscLevel`).knob($.extend({}, this._knobDefaults, {
			min: 0,
			max: 100,
			change: function(value) {
				channel.oscLevel = value / 100;
			}
		}));
		
		$(`#${name} .noiseLevel`).knob($.extend({}, this._knobDefaults, {
			min: 0,
			max: 100,
			change: function(value) {
				channel.noiseLevel = value / 100;
			}
		}));
		
		$(`#${name} .filterGain`).knob($.extend({}, this._knobDefaults, {
			min: -40,
			max: 40,
			change: function(value) {
				channel.channelFilterGain = value;
			}
		}));
		
		$(`#${name} .filterFreq`).knob($.extend({}, this._knobDefaults, {
			min: 10,
			max: 22500,
			change: function(value) {
				channel.channelFilterFreq = value;
			}
		}));
		
		$(`#${name} .wave`).change(function() {
			channel.wave = $(this).val();
		});
		
		$(`#${name} .frequency`).knob($.extend({}, this._knobDefaults, {
			min: 20,
			max: 2000,
			change: function(value) {
				channel.frequency = value;
			}
		}));
		
		$(`#${name} .oscAttack`).knob($.extend({}, this._knobDefaults, {
			min: 0,
			max: 10000,
			change: function(value) {
				channel.oscAttack = value / 1000;
			}
		}));
		
		$(`#${name} .oscDecay`).knob($.extend({}, this._knobDefaults, {
			min: 10,
			max: 10000,
			change: function(value) {
				channel.oscDecay = value / 1000;
			}
		}));
		
		$(`#${name} .pitchAttack`).knob($.extend({}, this._knobDefaults, {
			min: 0,
			max: 10000,
			change: function(value) {
				channel.pitchAttack = value / 1000;
			}
		}));
		
		$(`#${name} .pitchDecay`).knob($.extend({}, this._knobDefaults, {
			min: 10,
			max: 10000,
			change: function(value) {
				channel.pitchDecay = value / 1000;
			}
		}));
		
		$(`#${name} .noiseAttack`).knob($.extend({}, this._knobDefaults, {
			min: 0,
			max: 10000,
			change: function(value) {
				channel.noiseAttack = value / 1000;
			}
		}));
		
		$(`#${name} .noiseDecay`).knob($.extend({}, this._knobDefaults, {
			min: 10,
			max: 10000,
			change: function(value) {
				channel.noiseDecay = value / 1000;
			}
		}));
	}
	
	/**
	 * Create a sequence linked to a channel
	 */
	private static _sequence(name: string, channel: Channel, length: number, pattern: string) {
		var $sequence = $('<ul class="sequence"></ul>');
		$sequence.attr('data-channel', name);
		
		for (var i = 0; i < length; ++i) {
			var cssClass = 'beat' + (pattern.charAt(i) === '1' ? ' on' : '');
			
			$sequence.append(`<li class="${cssClass}"></li>`);
		}
		
		$sequence.append(`<li><a href="#" class="clear-sequence"></a></li>`);
		
		$('#sequencer').prepend($sequence);
	}
	
	/**
	 * Output the markdown for a jQuery Knob
	 */
	private static _knob(type: string, name: string, value: number) {
		return `<div>
			<input type="text" class="knob ${type}" value="${value}" data-name="${name}">
		</div>`;
	}
	
	/**
	 * Make a wave selection thing
	 */
	private static _waveSelector(selected: string) {
		var selector = '<div class="wave"><a href="#" class="prev"></a><ul>';
		
		$.each(this._waveSelect, function(value, option) {
			selector += `<li${selected === value ? ' class="active"' : ''} data-wave="${value}">${option}</li>`;
		});
		
		selector += '</ul><a href="#" class="next"></a></div>';
		
		return selector;
	}
}