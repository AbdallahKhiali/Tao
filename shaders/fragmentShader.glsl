varying vec2 vUv;
uniform vec2 uResolution;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uProgress;
uniform vec2 uMouse;
// uniform float uTime;

vec2 warp(vec2 pos, vec2 amplitude) {
  pos = pos * 2.0 - 1.0;
  pos.x *= 1.0 - (pos.y * pos.y) * amplitude.x * 0.2;
  pos.y *= 1.0 + (pos.x * pos.x) * amplitude.y;
  return pos * 0.5 + 0.5;
}

void main() {

  vec2 center = (gl_FragCoord.xy / uResolution.xy) - vec2(0.5);

  float len = length(center);

  float vignette =  smoothstep(0.4,0.75,len);


  float progress = fract(uProgress);


  vec2 wrappedUV = warp(vUv, vec2(0.9));

  vec2 currentUv = vec2(wrappedUV.x + progress * 0.8 + uMouse.x * 0.001, wrappedUV.y + progress * 0.5 + uMouse.y * 0.1);

  vec2 nextUv = vec2(wrappedUV.x - (1. - progress) + uMouse.x * 0.001, wrappedUV.y - (1. - progress) + uMouse.y * 0.1);

  vec4 currentTexture = texture2D(uTexture1, currentUv);

  vec4 NextTexture = texture2D(uTexture2, nextUv);

  vec3 colorCurrent = currentTexture.rgb * (1. - progress);
  vec3 colorNext = NextTexture.rgb * progress;

  // vec4 texture = mix(currentTexture, NextTexture, uProgress);
  vec4 texture = vec4(colorCurrent + colorNext, 1.0);

  // gl_FragColor = currentTexture;
  gl_FragColor = vec4(texture);
  gl_FragColor.rgb = mix(gl_FragColor.rgb,gl_FragColor.rgb*0.5,vignette);
  // gl_FragColor = vec4(vec3(len), 1.0);
}