let attractors = [];
let attractorsQty = 20;
let particles = [];
let particlesQty = 10000;
let lerpValue = 0.5;
let xspeed = 0.1;
let yspeed = 0.1;
let r = 10000;
let xPos;
let yPos;

// Sliders
let lerpSlider;
let particlesSlider;
let attractorsSlider;
let strokeOpacitySlider;

// Labels
let lerpLabel;
let particlesLabel;
let attractorsLabel;
let strokeOpacityLabel;

// Stroke opacity
let strokeOpacity = 5;

// Animation
let isAnimating = false;
let animateButton;
let attractorVelocities = [];

// Show attractors
let showAttractors = false;
let showAttractorsButton;

// Colors
let colorPalette = [
  { name: "Grønn", color: [34, 139, 116] }, // medium teal-green
  { name: "Grønn lys", color: [144, 238, 200] }, // light mint-green
  { name: "Blå", color: [59, 130, 246] }, // medium blue
  { name: "Blå lys", color: [147, 197, 253] }, // light blue
  { name: "Lilla", color: [139, 92, 246] }, // medium purple
  { name: "Lilla lys", color: [196, 181, 253] }, // light lavender-purple
  { name: "Rød", color: [239, 68, 68] }, // reddish-orange
  { name: "Rød Lys", color: [254, 202, 202] }, // light peach-orange
  { name: "Oransje", color: [249, 115, 22] }, // vibrant orange
  { name: "Oransje lys", color: [254, 215, 170] }, // light orange/tan
  { name: "Gul", color: [234, 179, 8] }, // bright yellow
  { name: "Gul lys", color: [254, 240, 138] }, // pale yellow
  { name: "Hvit", color: [255, 255, 255] }, // white
  { name: "Grå lys", color: [209, 213, 219] }, // light grey
  { name: "Svart", color: [55, 65, 81] }, // dark grey/charcoal
];

let selectedStrokeColor = [0, 0, 0]; // Default black
let selectedBgColor = [255, 255, 255]; // Default white
let isBgTransparent = false; // Track if background is transparent
let strokeColorButtons = [];
let bgColorButtons = [];
let colorBarY = 610; // Y position for color bars
let downloadButton;

function setup() {
  createCanvas(600, 800);

  // Create color picker bars
  createColorPickers();

  // Create sliders at the bottom
  lerpSlider = createSlider(0, 1, lerpValue, 0.01);
  lerpSlider.position(20, height - 110);
  lerpSlider.style("width", "200px");

  particlesSlider = createSlider(100, 20000, particlesQty, 100);
  particlesSlider.position(20, height - 80);
  particlesSlider.style("width", "200px");

  attractorsSlider = createSlider(1, 50, attractorsQty, 1);
  attractorsSlider.position(20, height - 50);
  attractorsSlider.style("width", "200px");

  strokeOpacitySlider = createSlider(0, 100, strokeOpacity, 5);
  strokeOpacitySlider.position(20, height - 20);
  strokeOpacitySlider.style("width", "200px");

  // Create labels at the bottom
  lerpLabel = createP("Lerp Value: " + lerpValue.toFixed(2));
  lerpLabel.position(240, height - 125);
  lerpLabel.style("font-size", "12px");
  lerpLabel.style("color", "#000");

  particlesLabel = createP("Particles: " + particlesQty);
  particlesLabel.position(240, height - 95);
  particlesLabel.style("font-size", "12px");
  particlesLabel.style("color", "#000");

  attractorsLabel = createP("Attractors: " + attractorsQty);
  attractorsLabel.position(240, height - 65);
  attractorsLabel.style("font-size", "12px");
  attractorsLabel.style("color", "#000");

  strokeOpacityLabel = createP("Stroke Opacity: " + strokeOpacity);
  strokeOpacityLabel.position(240, height - 35);
  strokeOpacityLabel.style("font-size", "12px");
  strokeOpacityLabel.style("color", "#000");

  // Create animate button
  animateButton = createButton("Animate Attractors");
  animateButton.position(450, height - 50);
  animateButton.mousePressed(toggleAnimation);
  animateButton.style("padding", "10px 15px");
  animateButton.style("font-size", "12px");

  // Create show attractors button
  showAttractorsButton = createButton("Show Attractors");
  showAttractorsButton.position(450, height - 80);
  showAttractorsButton.mousePressed(toggleShowAttractors);
  showAttractorsButton.style("padding", "10px 15px");
  showAttractorsButton.style("font-size", "12px");

  // Create download PNG button
  downloadButton = createButton("Download PNG");
  downloadButton.position(450, height - 20);
  downloadButton.mousePressed(downloadPNG);
  downloadButton.style("padding", "10px 15px");
  downloadButton.style("font-size", "12px");

  // Generate initial composition
  generateComposition();
}

function createColorPickers() {
  let swatchSize = 30;
  let spacing = 5;
  let startX = 20;
  let strokeBarY = colorBarY;
  let bgBarY = colorBarY + 40;

  // Calculate position after all color swatches
  let labelX = startX + colorPalette.length * (swatchSize + spacing) + 10;

  // Create stroke color label (on the right side)
  let strokeLabel = createP("Stroke:");
  strokeLabel.position(labelX, strokeBarY + 5);
  strokeLabel.style("font-size", "12px");
  strokeLabel.style("color", "#000");
  strokeLabel.style("margin", "0");

  // Create background color label (on the right side)
  let bgLabel = createP("Background:");
  bgLabel.position(labelX, bgBarY + 5);
  bgLabel.style("font-size", "12px");
  bgLabel.style("color", "#000");
  bgLabel.style("margin", "0");

  // Create stroke color buttons
  for (let i = 0; i < colorPalette.length; i++) {
    let btn = createButton("");
    btn.position(startX + i * (swatchSize + spacing), strokeBarY);
    btn.size(swatchSize, swatchSize);
    let c = colorPalette[i].color;
    btn.style("background-color", `rgb(${c[0]}, ${c[1]}, ${c[2]})`);
    btn.style("border", "2px solid #333");
    btn.style("padding", "0");
    btn.style("cursor", "pointer");
    btn.mousePressed(() => selectStrokeColor(i));
    strokeColorButtons.push(btn);
  }

  // Create background color buttons (including transparent option)
  for (let i = 0; i < colorPalette.length; i++) {
    let btn = createButton("");
    btn.position(startX + i * (swatchSize + spacing), bgBarY);
    btn.size(swatchSize, swatchSize);
    let c = colorPalette[i].color;
    btn.style("background-color", `rgb(${c[0]}, ${c[1]}, ${c[2]})`);
    btn.style("border", "2px solid #333");
    btn.style("padding", "0");
    btn.style("cursor", "pointer");
    btn.mousePressed(() => selectBgColor(i));
    bgColorButtons.push(btn);
  }

  // Add transparent background button
  let transparentBtn = createButton("");
  transparentBtn.position(
    startX + colorPalette.length * (swatchSize + spacing),
    bgBarY
  );
  transparentBtn.size(swatchSize, swatchSize);
  transparentBtn.style(
    "background",
    "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 10px 10px"
  );
  transparentBtn.style("border", "2px solid #333");
  transparentBtn.style("padding", "0");
  transparentBtn.style("cursor", "pointer");
  transparentBtn.mousePressed(() => selectTransparentBg());
  bgColorButtons.push(transparentBtn);

  // Set initial selections (black for stroke, white for background)
  updateColorButtonStyles();
}

function selectStrokeColor(index) {
  selectedStrokeColor = colorPalette[index].color;
  updateColorButtonStyles();
}

function selectBgColor(index) {
  selectedBgColor = colorPalette[index].color;
  isBgTransparent = false;
  updateColorButtonStyles();
}

function selectTransparentBg() {
  isBgTransparent = true;
  updateColorButtonStyles();
}

function updateColorButtonStyles() {
  // Update stroke color buttons
  for (let i = 0; i < strokeColorButtons.length; i++) {
    if (arraysEqual(selectedStrokeColor, colorPalette[i].color)) {
      strokeColorButtons[i].style("border", "3px solid #000");
      strokeColorButtons[i].style("box-shadow", "0 0 5px rgba(0,0,0,0.5)");
    } else {
      strokeColorButtons[i].style("border", "2px solid #333");
      strokeColorButtons[i].style("box-shadow", "none");
    }
  }

  // Update background color buttons
  for (let i = 0; i < bgColorButtons.length; i++) {
    if (i < colorPalette.length) {
      // Regular color buttons
      if (
        !isBgTransparent &&
        arraysEqual(selectedBgColor, colorPalette[i].color)
      ) {
        bgColorButtons[i].style("border", "3px solid #000");
        bgColorButtons[i].style("box-shadow", "0 0 5px rgba(0,0,0,0.5)");
      } else {
        bgColorButtons[i].style("border", "2px solid #333");
        bgColorButtons[i].style("box-shadow", "none");
      }
    } else {
      // Transparent button (last button)
      if (isBgTransparent) {
        bgColorButtons[i].style("border", "3px solid #000");
        bgColorButtons[i].style("box-shadow", "0 0 5px rgba(0,0,0,0.5)");
      } else {
        bgColorButtons[i].style("border", "2px solid #333");
        bgColorButtons[i].style("box-shadow", "none");
      }
    }
  }
}

function arraysEqual(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

function generateComposition() {
  // Clear existing arrays
  attractors = [];
  particles = [];

  // Update values from sliders
  lerpValue = lerpSlider.value();
  particlesQty = particlesSlider.value();
  attractorsQty = attractorsSlider.value();

  // Generate attractors (in the composition area, avoiding bottom slider area)
  let compositionHeight = 600; // Reserve bottom 100px for sliders
  attractorVelocities = []; // Reset velocities
  for (let i = 0; i < attractorsQty; i++) {
    xPos = random(50, width - 50);
    yPos = random(50, compositionHeight - 50);
    let a = createVector(xPos, yPos);
    attractors.push(a);
    // Initialize velocity for each attractor
    let vel = createVector(random(-1, 1), random(-1, 1));
    vel.normalize();
    vel.mult(0.5); // Speed multiplier
    attractorVelocities.push(vel);
  }

  // Generate particles (in the composition area)
  for (let i = 0; i < particlesQty; i++) {
    let initialPosition = createVector(
      random(width),
      random(compositionHeight)
    );
    let p = { path: [initialPosition], visitedAttractors: [] };
    particles.push(p);
  }

  // Generate paths
  for (let n = 0; n < attractorsQty; n++) {
    for (let p of particles) {
      let lastPosition = p.path[p.path.length - 1];
      let closestIndex = getClosestAttractorIndex(
        lastPosition,
        p.visitedAttractors
      );
      let newPosition = p5.Vector.lerp(
        lastPosition,
        attractors[closestIndex],
        lerpValue
      );
      p.visitedAttractors.push(closestIndex);
      p.path.push(newPosition);
    }
  }
}

function draw() {
  // Check if sliders have changed
  let lerpChanged = lerpSlider.value() !== lerpValue;
  let particlesChanged = particlesSlider.value() !== particlesQty;
  let attractorsChanged = attractorsSlider.value() !== attractorsQty;

  if (lerpChanged || particlesChanged || attractorsChanged) {
    generateComposition();
  }

  // Animate attractors if enabled
  if (isAnimating) {
    animateAttractors();
    // Regenerate paths when attractors move
    regeneratePaths();
  }

  // Update stroke opacity from slider
  strokeOpacity = strokeOpacitySlider.value();

  // Update labels
  lerpLabel.html("Lerp Value: " + lerpSlider.value().toFixed(2));
  particlesLabel.html("Particles: " + particlesSlider.value());
  attractorsLabel.html("Attractors: " + attractorsSlider.value());
  strokeOpacityLabel.html("Stroke Opacity: " + strokeOpacity);

  // Background for entire canvas (white for controls area)
  background(255, 255, 255);

  // Draw background color only for composition area (if not transparent)
  let compositionHeight = 600;
  if (!isBgTransparent) {
    fill(selectedBgColor[0], selectedBgColor[1], selectedBgColor[2]);
    noStroke();
    rect(0, 0, width, compositionHeight);
  }

  // Draw composition in the top area (600px height)
  push();
  translate(0, 0);
  noFill();
  // Use selected stroke color with opacity from slider
  stroke(
    selectedStrokeColor[0],
    selectedStrokeColor[1],
    selectedStrokeColor[2],
    strokeOpacity
  );
  for (let particle of particles) {
    beginShape();
    for (let position of particle.path) {
      vertex(position.x, position.y);
    }
    endShape();
  }

  // Draw attractors if enabled
  if (showAttractors) {
    rectMode(RADIUS);
    fill(
      selectedStrokeColor[0],
      selectedStrokeColor[1],
      selectedStrokeColor[2]
    );
    noStroke();
    for (let attractor of attractors) {
      ellipse(attractor.x, attractor.y, 10);
    }
  }
  pop();

  // Draw separator line above color pickers
  stroke(200);
  strokeWeight(1);
  line(0, 600, width, 600);
}

function getClosestAttractorIndex(pos, visitedAttractors) {
  let closestIndex;
  let closestDistance = Infinity;
  for (let i = 0; i < attractors.length; i++) {
    let d = pos.dist(attractors[i]);
    if (d < closestDistance && !visitedAttractors.includes(i)) {
      closestIndex = i;
      closestDistance = d;
    }
  }
  return closestIndex;
}

function toggleAnimation() {
  isAnimating = !isAnimating;
  if (isAnimating) {
    animateButton.html("Stop Animation");
  } else {
    animateButton.html("Animate Attractors");
  }
}

function toggleShowAttractors() {
  showAttractors = !showAttractors;
  if (showAttractors) {
    showAttractorsButton.html("Hide Attractors");
  } else {
    showAttractorsButton.html("Show Attractors");
  }
}

function downloadPNG() {
  // Create a temporary graphics buffer for just the composition area
  let compositionHeight = 600;
  let pg = createGraphics(width, compositionHeight);

  // Draw background color (or transparent)
  if (!isBgTransparent) {
    pg.background(selectedBgColor[0], selectedBgColor[1], selectedBgColor[2]);
  } else {
    pg.clear(); // Transparent background
  }

  // Draw particle paths
  pg.noFill();
  pg.stroke(
    selectedStrokeColor[0],
    selectedStrokeColor[1],
    selectedStrokeColor[2],
    strokeOpacity
  );
  for (let particle of particles) {
    pg.beginShape();
    for (let position of particle.path) {
      pg.vertex(position.x, position.y);
    }
    pg.endShape();
  }

  // Draw attractors if enabled
  if (showAttractors) {
    pg.rectMode(RADIUS);
    pg.fill(
      selectedStrokeColor[0],
      selectedStrokeColor[1],
      selectedStrokeColor[2]
    );
    pg.noStroke();
    for (let attractor of attractors) {
      pg.ellipse(attractor.x, attractor.y, 10);
    }
  }

  // Save the graphics buffer as PNG
  save(pg, "composition.png");
}

function animateAttractors() {
  let compositionHeight = 600;
  let margin = 50;

  for (let i = 0; i < attractors.length; i++) {
    // Update attractor position
    attractors[i].add(attractorVelocities[i]);

    // Bounce off walls
    if (attractors[i].x < margin || attractors[i].x > width - margin) {
      attractorVelocities[i].x *= -1;
      attractors[i].x = constrain(attractors[i].x, margin, width - margin);
    }
    if (
      attractors[i].y < margin ||
      attractors[i].y > compositionHeight - margin
    ) {
      attractorVelocities[i].y *= -1;
      attractors[i].y = constrain(
        attractors[i].y,
        margin,
        compositionHeight - margin
      );
    }
  }
}

function regeneratePaths() {
  // Clear existing paths but keep initial positions
  for (let p of particles) {
    let initialPosition = p.path[0];
    p.path = [initialPosition];
    p.visitedAttractors = [];
  }

  // Regenerate paths based on current attractor positions
  for (let n = 0; n < attractorsQty; n++) {
    for (let p of particles) {
      let lastPosition = p.path[p.path.length - 1];
      let closestIndex = getClosestAttractorIndex(
        lastPosition,
        p.visitedAttractors
      );
      let newPosition = p5.Vector.lerp(
        lastPosition,
        attractors[closestIndex],
        lerpValue
      );
      p.visitedAttractors.push(closestIndex);
      p.path.push(newPosition);
    }
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    window.location.reload();
  }
}
