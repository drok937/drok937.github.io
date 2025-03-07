

// --------------------- Function Expressions -----------
/**
 * Converts a linear amplitude to dB scale.
 * @param {number} linAmp - The linear amplitude value.
 * @returns {number} The corresponding amplitude in dB.
 */
const dBtoA = function(linAmp) {
    return Math.pow(10, linAmp / 20);
};


//resume audio and start oscillator
const enableAudio = function() {
    audCtx.resume();
    sawOsc.start();
    lFOOsc.start();
    modOsc.start();
    modOffset.start();
};

//Updates the master gain based on the fader input.
const updateMasterGain = function() {
    let amp = dBtoA(fader.value);
    masterGain.gain.exponentialRampToValueAtTime(amp, audCtx.currentTime + 0.01);
    faderLabel.innerText = `${fader.value} dBFS`;
};
//Updates LFOfrequency based on slider
const updateLFOFreq = function (){
    lFOFreqLabel.innerText = `${lFOFreqSlider.value} Hz`
    lFOOsc.frequency.exponentialRampToValueAtTime(lFOFreqSlider.value, audCtx.currentTime + 0.01);
};

// Updates LFO depth based on slider
const updateLFODepth = function (){
    lFODepthLabel.innerText = `${lFODepthSlider.value}`
    lFODepth.gain.setValueAtTime(lFODepthSlider.value / 1, audCtx.currentTime);
};
// Updates the delay time based on the slider input.
const updateDelay = function(){
    delayLabel.innerText = `${delaySlider.value} ms`
    delay.delayTime.linearRampToValueAtTime(delaySlider.value / 1000, audCtx.currentTime + 0.2);
};

//Updates modulator frequency based on slider
const updateModFreq = function (){
    modFreqLabel.innerText = `${modFreqSlider.value} Hz`
    modOsc.frequency.exponentialRampToValueAtTime (modFreqSlider.value, audCtx.currentTime + 0.01);
};

// Updates modulation depth based on slider
const updateModDepth = function (){
    modDepthLabel.innerText = `${modDepthSlider.value * 100}%`
    modDepth.gain.exponentialRampToValueAtTime(modDepthSlider.value / 100, audCtx.currentTime + 0.2);
};


//Updates the feedback amount based on the slider input.
const updateFeedback= function(){
    feedbackLabel.innerText = `${feedbackSlider.value} %`
    fb.gain.setValueAtTime(feedbackSlider.value / 100, audCtx.currentTime);
};


// ------------------------- WebAudio Setup --------------------------

/** @type {AudioContext} */
const audCtx = new AudioContext();


// ------------------------- Main Oscillator --------------------------
/** @type {OscillatorNode} */
let sawOsc = audCtx.createOscillator();
sawOsc.type = "sawtooth";
sawOsc.frequency.setValueAtTime(440, audCtx.currentTime);


//---------------------------LFO Freq----------------------
let lFOOsc = audCtx.createOscillator();
lFOOsc.type = "sine"
lFOOsc.frequency.setValueAtTime(5.0, audCtx.currentTime);
//---------------------------LFO Depth----------------------
let lFODepth = audCtx.createGain();
lFODepth.gain.setValueAtTime(0.0, audCtx.currentTime);

//---------------------------Modulation Freq----------------------
let modOsc = audCtx.createOscillator();
modOsc.type = "sine"
modOsc.frequency.setValueAtTime(5.0, audCtx.currentTime);

//--------------------------Modulation Offset----------------------

let modOffset = audCtx.createConstantSource();
modOffset.offset.value = 1;

//--------------------------Modulation Scaling----------------------
let modScaled = audCtx.createGain();
modScaled.gain.value = 0.5;

//---------------------------Modulation Depth----------------------
let modDepth = audCtx.createGain();
modDepth.gain.setValueAtTime(0.0, audCtx.currentTime);

// ------------------------- Delay node --------------------------
let delay = audCtx.createDelay();
delay.delayTime.setValueAtTime(0.125, audCtx.currentTime);

// ------------------------- Delay feedback node --------------------

let fb = audCtx.createGain();
fb.gain.setValueAtTime(0.0, audCtx.currentTime);


// ------------------------- Master Gain --------------------------
/** @type {GainNode} */
let masterGain = audCtx.createGain();
masterGain.gain.value = 0.125; // Default to -12 dBFS

// ------------------------- Connections --------------------------
sawOsc.connect(delay);
sawOsc.connect(masterGain);
lFOOsc.connect(lFODepth)
lFODepth.connect(sawOsc.frequency)
delay.connect(masterGain);
delay.connect(fb);
fb.connect(delay);

modOsc.connect(modScaled);
modOffset.connect(modScaled);
modScaled.connect(modDepth);
modDepth.connect(delay.delayTime);

masterGain.connect(audCtx.destination);


// ------------------------- Get HTML Elements --------------------------
let enableButton = document.getElementById("enableAudio");
let fader = document.getElementById("masterFader");
let lFOFreqSlider = document.getElementById("lFOFrequency");
let lFOFreqLabel = document.getElementById("lFOFreqLabel");
let lFODepthSlider = document.getElementById("lFODepth");
let lFODepthLabel = document.getElementById("lFODepthLabel");
let faderLabel = document.getElementById("fadeLabel");
let delaySlider = document.getElementById("delayTime");
let delayLabel = document.getElementById("delayLabel");
let feedbackSlider = document.getElementById("feedbackAmount");
let feedbackLabel = document.getElementById("fbLabel");
let modFreqSlider = document.getElementById("modFrequency");
let modFreqLabel = document.getElementById("modFreqLabel");
let modDepthSlider = document.getElementById("modDepth");
let modDepthLabel = document.getElementById("modDepthLabel");

// ------------------------- add event listeners --------------------------

enableButton.addEventListener("click", enableAudio);
fader.addEventListener("input", updateMasterGain);
lFOFreqSlider.addEventListener("input", updateLFOFreq);
lFODepthSlider.addEventListener("input", updateLFODepth);
modFreqSlider.addEventListener("input", updateModFreq);
modDepthSlider.addEventListener("input", updateModDepth);
delaySlider.addEventListener("input", updateDelay);
feedbackSlider.addEventListener("input", updateFeedback);

document.getElementById("modDepth").addEventListener("input", function() {
    console.log("Modulation Depth:", this.value);
});

document.getElementById("modFrequency").addEventListener("input", function() {
    console.log("Modulation Frequency:", this.value);
});

document.getElementById("feedbackAmount").addEventListener("input", function() {
    console.log("Feedback Amount:", this.value);
});
