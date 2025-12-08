const fs = require('fs');
const path = require('path');

// Read the compiled JavaScript file
const jsFilePath = path.join(__dirname, 'dist', 'chatbot-widget.js');
let jsContent = fs.readFileSync(jsFilePath, 'utf8');

// Define the beautiful fairy icon as a data URI
const beautifulFairyIcon = `
(function() {
  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('width', '32');
  svg.setAttribute('height', '32');
  
  // Create defs
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  
  // Create gradient
  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
  gradient.setAttribute('id', 'fairyGlow');
  gradient.setAttribute('cx', '50%');
  gradient.setAttribute('cy', '50%');
  gradient.setAttribute('r', '50%');
  
  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#ffefc8');
  stop1.setAttribute('stop-opacity', '0.6');
  
  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', '#ffefc8');
  stop2.setAttribute('stop-opacity', '0');
  
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defs.appendChild(gradient);
  
  // Create filter
  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  filter.setAttribute('id', 'sparkle');
  filter.setAttribute('x', '-50%');
  filter.setAttribute('y', '-50%');
  filter.setAttribute('width', '200%');
  filter.setAttribute('height', '200%');
  
  const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
  blur.setAttribute('stdDeviation', '1');
  blur.setAttribute('result', 'blur');
  
  const composite = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
  composite.setAttribute('in', 'blur');
  composite.setAttribute('in2', 'SourceAlpha');
  composite.setAttribute('operator', 'arithmetic');
  composite.setAttribute('k2', '0.5');
  composite.setAttribute('k3', '0.5');
  
  filter.appendChild(blur);
  filter.appendChild(composite);
  defs.appendChild(filter);
  svg.appendChild(defs);
  
  // Create glow circle
  const glowCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  glowCircle.setAttribute('cx', '50');
  glowCircle.setAttribute('cy', '50');
  glowCircle.setAttribute('r', '45');
  glowCircle.setAttribute('fill', 'url(#fairyGlow)');
  svg.appendChild(glowCircle);
  
  // Create fairy body
  const body = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  body.setAttribute('cx', '50');
  body.setAttribute('cy', '65');
  body.setAttribute('rx', '7');
  body.setAttribute('ry', '14');
  body.setAttribute('fill', '#ffefc8');
  svg.appendChild(body);
  
  // Create fairy head
  const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  head.setAttribute('cx', '50');
  head.setAttribute('cy', '45');
  head.setAttribute('r', '9');
  head.setAttribute('fill', '#ffefc8');
  svg.appendChild(head);
  
  // Create eyes
  const eye1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  eye1.setAttribute('cx', '47');
  eye1.setAttribute('cy', '43');
  eye1.setAttribute('r', '1.2');
  eye1.setAttribute('fill', '#0C2E4D');
  svg.appendChild(eye1);
  
  const eye2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  eye2.setAttribute('cx', '53');
  eye2.setAttribute('cy', '43');
  eye2.setAttribute('r', '1.2');
  eye2.setAttribute('fill', '#0C2E4D');
  svg.appendChild(eye2);
  
  // Create smile
  const smile = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  smile.setAttribute('d', 'M 48 47 Q 50 49 52 47');
  smile.setAttribute('stroke', '#0C2E4D');
  smile.setAttribute('stroke-width', '1');
  smile.setAttribute('fill', 'none');
  smile.setAttribute('stroke-linecap', 'round');
  svg.appendChild(smile);
  
  // Create left wing
  const leftWing = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  leftWing.setAttribute('d', 'M 38 55 Q 25 45 32 32 Q 42 28 48 42 Q 43 50 38 55');
  leftWing.setAttribute('fill', '#ffefc8');
  leftWing.setAttribute('fill-opacity', '0.5');
  leftWing.setAttribute('stroke', '#ffefc8');
  leftWing.setAttribute('stroke-width', '0.8');
  svg.appendChild(leftWing);
  
  // Create right wing
  const rightWing = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  rightWing.setAttribute('d', 'M 62 55 Q 75 45 68 32 Q 58 28 52 42 Q 57 50 62 55');
  rightWing.setAttribute('fill', '#ffefc8');
  rightWing.setAttribute('fill-opacity', '0.5');
  rightWing.setAttribute('stroke', '#ffefc8');
  rightWing.setAttribute('stroke-width', '0.8');
  svg.appendChild(rightWing);
  
  // Create magic wand
  const wand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  wand.setAttribute('x1', '62');
  wand.setAttribute('y1', '58');
  wand.setAttribute('x2', '78');
  wand.setAttribute('y2', '35');
  wand.setAttribute('stroke', '#ffefc8');
  wand.setAttribute('stroke-width', '2.5');
  wand.setAttribute('stroke-linecap', 'round');
  svg.appendChild(wand);
  
  // Create wand tip
  const wandTip = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  wandTip.setAttribute('cx', '78');
  wandTip.setAttribute('cy', '35');
  wandTip.setAttribute('r', '3');
  wandTip.setAttribute('fill', '#ffefc8');
  wandTip.setAttribute('filter', 'url(#sparkle)');
  svg.appendChild(wandTip);
  
  // Create sparkles
  const sparkles = [
    {cx: 30, cy: 25, r: 1.5},
    {cx: 75, cy: 20, r: 1},
    {cx: 25, cy: 70, r: 0.8},
    {cx: 80, cy: 65, r: 1.2},
    {cx: 50, cy: 15, r: 1.5}
  ];
  
  sparkles.forEach(sparkle => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', sparkle.cx);
    circle.setAttribute('cy', sparkle.cy);
    circle.setAttribute('r', sparkle.r);
    circle.setAttribute('fill', '#ffefc8');
    svg.appendChild(circle);
  });
  
  return svg.outerHTML;
})()
`;

// Replace the BeautifulFairyIcon component with our beautiful fairy icon
const fairyIconRegex = /p\.jsx\(BeautifulFairyIcon,\{className:"w-8 h-8"\}\)/g;
const replacement = `p.jsx("div", {dangerouslySetInnerHTML: {__html: \`${beautifulFairyIcon}\`}, className: "w-8 h-8"})`;

jsContent = jsContent.replace(fairyIconRegex, replacement);

// Write the modified content back to the file
fs.writeFileSync(jsFilePath, jsContent);

console.log('Beautiful fairy icon has been added to the chatbot widget!');