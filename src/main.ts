///<reference path="jquery.d.ts"/>
///<reference path="modules/Amp.ts"/>
///<reference path="Channel.ts"/>
///<reference path="Sequencer.ts"/>
///<reference path="UI.ts"/>
///<reference path="jquery.knob.d.ts"/>

declare var webkitAudioContext: {
    new (): AudioContext;
};
    
var audioContext: any = new (AudioContext || webkitAudioContext)();
var tempo: number = 140;

var master = new Amp(audioContext);
master.level = 1.0;
master.connect(audioContext.destination);

$('#tempo').val(tempo.toString());

var channels = {
    // better but still clicky
    'kick': new Channel(audioContext, master, {
        frequency: 105,
        oscAmpAttack: 0,
        oscAmpDecay: 0.630,
        oscPitchAttack: 0,
        oscPitchDecay: 0.380,
        noiseLevel: 0,
        oscLevel: 1.0,
        level: 0.8
    }),
    // need to tailor noise level (it is V LOUD)
    'snare': new Channel(audioContext, master, {
        frequency: 800,
        noiseLevel: 0.35,
        noiseAttack: 0,
        noiseDecay: 0.37,
        oscLevel: 0,
        level: 0.8
    }),
    'hat': new Channel(audioContext, master, {
        frequency: 1500,
        noiseLevel: 0.3,
        oscLevel: 0,
        noiseAttack: 0,
        noiseDecay: 0.15,
        channelFilterFreq: 15000,
        channelFilterGain: 10
    }),
    'tom': new Channel(audioContext, master, {
        frequency: 100,
        noiseLevel: 0.0,
        oscLevel: 0.3,
        wave: 'sawtooth',
        oscPitchAttack: 0,
        oscPitchDecay: 4,
        oscAmpAttack: 0,
        oscAmpDecay: 4
    })
};

// there's some encoding to be done here
var patterns = {
    kick: '1100001011000010',
    snare: '0000100000001000',
    hat: '0010010100110101',
    tom: '1000000001000000'
};

var sequencer = new Sequencer(channels, tempo);

$.each(channels, (name, channel) => {
    UI.addChannel(name, channel, sequencer.length, patterns[name]);
});

$('.channel').hide().first().show();
$('#channel-headers li').first().addClass('active');

UI.indicator(sequencer.length);

// put these things in the UI class
// if dynamic elements need "on" bindings
$('.sequence li').click(function() {
	$(this).toggleClass('on');
});

$('#channel-headers li a').click(function() {
    $('#channel-headers li').removeClass('active');
    $('.channel').hide();
    $('#' + $(this).data('name')).show();
    $(this).parent().addClass('active');
    return false;
});

$('#start').click(() => {
    if (!sequencer.started) {
        sequencer.start();
        
        $('#start').toggleClass('active');
        $('#stop').toggleClass('active');
    }
    
    return false;
});

$('#stop').click(() => {
    if (sequencer.started) {
        sequencer.stop();
        
        $('#start').toggleClass('active');
        $('#stop').toggleClass('active');
    }
    
    return false;
});

$('#tempo').change(function() {
    sequencer.setTempo($(this).val());
});

$('#tempo').keyup(function() {
    sequencer.setTempo($(this).val());
});

$('.clear-sequence').click(function() {
    $(this).closest('ul')
        .children('li')
        .removeClass('on');
    
    return false;
});

// TODO: combine these two
$('.wave .prev').click(function() {
    var id = $(this).closest('.channel').attr('id');
    var $list = $(this).next('ul');
    var $wave = $list.children('.active');
        
    $wave.removeClass('active');
    
    if ($wave.prev().is('li')) {
        $wave.prev().addClass('active');
    } else {
        $list.children().last().addClass('active');
    }
    
    channels[id].wave = $list.children('.active').data('wave');
    
    return false;
});

$('.wave .next').click(function() {
    var id = $(this).closest('.channel').attr('id');
    var $list = $(this).prev('ul');
    var $wave = $list.children('.active');
    
    $wave.removeClass('active');
    
    if ($wave.next().is('li')) {
        $wave.next().addClass('active');
    } else {
        $list.children().first().addClass('active');
    }
    
    channels[id].wave = $list.children('.active').data('wave');
        
    return false;
});

$('#master-volume').knob({
    'angleOffset': -160,
    'angleArc': 320,
    'thickness': 0.3,
    'width': 50,
    'height': 50,
    'fgColor': '#92C8CD',
	'bgColor': '#FFF',
	'inputColor': '#363439',
    'min': 0,
    'max': 100,
    'change': function(value) {
        master.level = value / 100;
    },
	format: function(value) {
		return 'level';
	}
});

// might prevent some weirdness
$('form').submit(function() {
    return false;
});

//sequencer.start();