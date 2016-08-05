precision mediump float;

attribute vec2 aPosition;

varying vec2 vUV;

void main() {
    vUV = (aPosition * vec2(0.5, -0.5)) + vec2(0.5, 0.5);

    gl_Position = vec4(aPosition, 0.0, 1.0);
}