let sound; // The audio file
let fft; // For frequency analysis
let amplitude; // For amplitude analysis

function preload() {
  sound = loadSound("./assets/audio/Fall Murders Summer DEMO MAS1.mp3"); // Load your audio file
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  // FFT and Amplitude for audio analysis
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();

  // Create a button to play/pause the audio
  let playButton = createButton("Play / Pause");
  playButton.position(10, 10);
  playButton.mousePressed(() => {
    if (sound.isPlaying()) {
      sound.pause();
    } else {
      sound.loop();
    }
  });
}

function draw() {
  background(0);

  // Get frequency spectrum data
  let spectrum = fft.analyze();

  // Extract frequency bands
  let bass = fft.getEnergy("bass"); // 20 - 140 Hz
  let lowMid = fft.getEnergy("lowMid"); // 140 - 400 Hz
  let mid = fft.getEnergy("mid"); // 400 - 2.6 kHz
  let highMid = fft.getEnergy("highMid"); // 2.6 kHz - 5.2 kHz
  let treble = fft.getEnergy("treble"); // 5.2 kHz - 20 kHz

  // Map frequency band energies to visual elements
  noFill();
  rect(150, height - 50, bass * 2, 20); // Bass visualization
  rect(150, height - 80, lowMid * 2, 20); // Low-mid visualization
  rect(150, height - 110, mid * 2, 20); // Mid visualization
  rect(150, height - 140, highMid * 2, 20); // High-mid visualization
  rect(150, height - 170, treble * 2, 20); // Treble visualization

  // Draw labels for frequency bands
  fill(255);
  noStroke();
  textSize(16);
  text("Bass", 10, height - 35);
  text("Low Mid", 10, height - 65);
  text("Mid", 10, height - 95);
  text("High Mid", 10, height - 125);
  text("Treble", 10, height - 155);

  // Visualize the frequency spectrum
  noStroke();
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = map(spectrum[i], 0, 255, 0, height / 2);
    fill(255);
    rect(x, height / 2, width / spectrum.length, -h);
  }

  // Waveform visualization
  let waveform = fft.waveform(); // Get waveform data
  stroke(200);
  noFill();
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height / 2 - 100, height / 2 + 100);
    vertex(x, y);
  }
  endShape();

  // Amplitude visualization
  let level = amplitude.getLevel(); // Get the amplitude level
  let size = map(level, 0, 1, 10, 200);
  fill(255, 100);
  ellipse(width - 100, height - 100, size, size);

  push();
  noStroke();
  fill(255);
  textSize(16);
  text("Waveform", 10, height / 2 - 110);
  text("Frequency Spectrum", 10, height / 2 + 20);
  text("Amplitude", width - 140, height - 120);
  pop();
}
