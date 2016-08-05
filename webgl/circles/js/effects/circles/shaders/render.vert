precision mediump float;

uniform mat4 uModelViewProjMat;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUV;

varying vec2 vUV;

void main() {
    vUV = aUV;

    gl_Position = uModelViewProjMat * vec4(aPosition, 1);
}
