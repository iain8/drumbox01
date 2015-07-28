///<reference path="jquery.d.ts"/>
///<reference path="Channel.ts"/>
///<reference path="Sequencer.ts"/>
///<reference path="UI.ts"/>
///<reference path="jquery.knob.d.ts"/>

declare var webkitAudioContext: {
    new (): AudioContext;
};
    
var audioContext: any = new (AudioContext || webkitAudioContext)();
var tempo: number = 120;

var channels = {
    // better but still clicky
    'kick': new Channel(audioContext, {
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
    'snare': new Channel(audioContext, {
        frequency: 800,
        noiseLevel: 0.35,
        noiseAttack: 0,
        noiseDecay: 0.37,
        oscLevel: 0,
        level: 0.8
    }),
    'hat': new Channel(audioContext, {
        frequency: 1500,
        noiseLevel: 0.3,
        oscLevel: 0,
        noiseAttack: 0,
        noiseDecay: 0.15
    }),
    'thing': new Channel(audioContext, {
        frequency: 1000,
        noiseLevel: 0.0,
        oscLevel: 0.3
    })
};

// there's some encoding to be done here
var patterns = {
    kick: '1100001011000010',
    snare: '0000100000001000',
    hat: '0010010100110101'
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
    }
    
    $('#start').toggleClass('active');
    $('#stop').toggleClass('active');
    
    return false;
});

$('#stop').click(() => {
    if (sequencer.started) {
        sequencer.stop();
    }
    
    $('#start').toggleClass('active');
    $('#stop').toggleClass('active');
    
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

$('.wave .prev').click(function() {
    // TODO: replace spans with list
    var id = $(this).closest('.channel').attr('id');
    
    var $wave = $(this).parent()
        .children('span')
        .filter('.active');
        
    $wave.removeClass('active');
    
    if ($wave.prev().is('span')) {
        $wave.prev().addClass('active');
    } else {
        $(this).parent()
            .children('span')
            .last()
            .addClass('active');
    }
    
    channels[id].wave = $wave.data('wave');
    
    return false;
});

$('.wave .next').click(function() {
    var id = $(this).closest('.channel').attr('id');
    
    var $wave = $(this).parent()
        .children('span')
        .filter('.active');
    
    $wave.removeClass('active');
    
    if ($wave.next().is('span')) {
        $wave.next().addClass('active');
    } else {
        $(this).parent()
            .children('span')
            .first()
            .addClass('active');
    }
    
    channels[id].wave = $wave.data('wave');
        
    return false;
});

//sequencer.start();