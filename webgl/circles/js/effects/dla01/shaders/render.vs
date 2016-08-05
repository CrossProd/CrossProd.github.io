precision mediump float;

uniform mat4 uModelMat;
uniform mat4 uModelViewMat;
uniform mat4 uModelViewProjMat;
uniform mat4 uInversedModelMat;
uniform mat4 uViewMat;
uniform mat4 uProjMat;

uniform vec3 uCameraLocation;

uniform float uTimer;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aCenter;
attribute float aGeneration;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {

    float mixPosition = uTimer - (aGeneration * 0.4);

    vec3 position = mix(aCenter, aPosition, clamp(mixPosition, 0.0, 1.0));

    vNormal = aNormal;
    vPosition = (uModelMat * vec4(position, 1)).xyz;

    gl_Position = uModelViewProjMat * vec4(position, 1);
}
