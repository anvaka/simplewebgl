precision highp float;

attribute vec3 position, color;
attribute float size;

varying vec3 fragColor;

void main() {
  gl_Position = vec4(position, 1.0);
  gl_PointSize = size;
  fragColor = color;
}
