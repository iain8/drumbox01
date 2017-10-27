import Machine from './Machine';
import './sass/base.scss';

/**
 * Entry point for the drum machine
 */

declare const webkitAudioContext: {
  new (): AudioContext;
};

const audioContext = 'webkitAudioContext' in window ? new webkitAudioContext() : new AudioContext();
const tempo: number = 80;
const machine = new Machine(audioContext, tempo);
const presetId = window.location.pathname === '/' ? '/1' : window.location.pathname;

$.get(`/data${presetId}`).then((preset) => {
  preset.channels.forEach((channel) => {
    const instData = JSON.parse(channel);

    machine.addChannel(instData.name, instData.options, instData.pattern);
  });

  machine.init();
}).catch((error) => {
  $('#loader').text('Error: preset not found');
});
