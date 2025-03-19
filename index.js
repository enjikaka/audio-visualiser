import 'https://esm.sh/jsr/@enjikaka/audio-visualiser';

const { audio, visuals } = window;

audio.currentTime = 41;

const audioContext = new AudioContext();

const source = audioContext.createMediaElementSource(audio);
const analyser = audioContext.createAnalyser();

analyser.fftSize = 1024;

source.connect(analyser);
analyser.connect(audioContext.destination);

visuals.analyser = analyser;

audio.addEventListener('play', () => {
    audioContext.resume();
    console.log('playing');
    visuals.start();
});

audio.addEventListener('pause', () => {
    console.log('paused');
    visuals.stop();
});
