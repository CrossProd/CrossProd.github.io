precision mediump float;

// mixes two textures

varying vec2 textureCoordinate;

uniform sampler2D texture01;
uniform sampler2D texture02;

void main() {
    gl_FragColor = mix(texture2D(texture01, textureCoordinate), texture2D(texture02, textureCoordinate), 1.0);
}