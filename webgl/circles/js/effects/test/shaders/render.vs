precision mediump float;

uniform mat4 uModelMat;
uniform mat4 uModelViewMat;
uniform mat4 uModelViewProjMat;
uniform mat4 uInversedModelMat;
uniform mat4 uViewMat;
uniform mat4 uProjMat;

uniform vec3 uCameraLocation;

attribute vec3 aPosition;
attribute vec3 aNormal;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vNormal = aNormal;
    vPosition = (uModelMat * vec4(aPosition, 1)).xyz;

    gl_Position = uModelViewProjMat * vec4(aPosition, 1);
}
