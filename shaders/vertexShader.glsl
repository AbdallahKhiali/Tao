varying vec2 vUv;
uniform vec2 uAspectRatio;
uniform float uTime;

void main() {
  vUv = (uv - 0.5) * uAspectRatio + 0.5;

  // vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
}