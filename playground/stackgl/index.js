// load shader programs:
var createShader = require('glslify');
// used to create webgl buffers
var createBuffer = require('gl-buffer');
// create webgl array objects:
var createVAO = require('gl-vao');

// Gets webgl context and provides requestAnimationFrame handler:
var getContext = require('gl-context');

var canvas = document.querySelector('.scene');
var gl = getContext(canvas, render);

var shader = createShader({
  frag: './shaders/fragment.glsl',
  vert: './shaders/vertex.glsl'
})(gl);

var numPoints = 1024;
var vertexPositions = new Float32Array(numPoints * 3);
var vertexColors = new Float32Array(numPoints * 3);
var vertexSizes = new Float32Array(numPoints);
var vertexFreqs = new Float32Array(numPoints * 3);
var vertexPhases = new Float32Array(numPoints * 3);

var colorArray = [
  [1, 1, 1],
  [0.3451, 1.0, 0.5450],
  [1.0, 0.4313, 0.3411],
  [1.0, 0.8862, 0.3725],
  [0.3804, 0.7647, 1.0]
];

var pointer = 0;
for (var i = 0; i < numPoints; ++i) {
  var c = colorArray[(Math.random() * colorArray.length) | 0];
  vertexSizes[i] = 1.0 + Math.random() * 32.0;
  for (var j = 0; j < 3; ++j) {
    vertexPhases[pointer] = Math.random() * 2.0 * Math.PI;
    vertexFreqs[pointer] = Math.random() * 32.0;
    vertexColors[pointer] = c[j];
    pointer += 1;
  }
}

var vertexPBuffer = createBuffer(gl, vertexPositions);
var vertexCBuffer = createBuffer(gl, vertexColors);
var vertexSBuffer = createBuffer(gl, vertexSizes);
var vertexArray = createVAO(gl, [{
  "buffer": vertexPBuffer,
  "size": 3
}, {
  "buffer": vertexCBuffer,
  "size": 3
}, {
  "buffer": vertexSBuffer,
  "size": 1
}]);

function render() {
  var t = new Date() * 0.00001;
  for (var i = 0; i < 3 * numPoints; ++i) {
    vertexPositions[i] = Math.cos(t * vertexFreqs[i] + vertexPhases[i]);
  }
  var width  = gl.drawingBufferWidth;
  var height = gl.drawingBufferHeight;

  shader.bind();
  gl.viewport(0, 0, width, height);

  // Enables depth testing, which prevents triangles
  // from overlapping.
  gl.enable(gl.DEPTH_TEST);

  // Enables face culling, which prevents triangles
  // being visible from behind.
  gl.enable(gl.CULL_FACE);
  vertexPBuffer.update(vertexPositions);
  vertexArray.bind();
  vertexArray.draw(gl.POINTS, numPoints);
}
