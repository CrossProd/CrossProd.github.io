precision mediump float;

uniform mat4 uModelMat;
uniform mat4 uModelViewMat;
uniform mat4 uModelViewProjMat;
uniform mat4 uInversedModelMat;

uniform vec3 uLightPosition;
uniform vec3 uCameraLocation;

uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 normal = normalize(vNormal);

    vec3 lightPosition = uCameraLocation;//(uModelViewMat * vec4(uCameraLocation, 1.0)).xyz;
    vec3 direction = normalize(lightPosition - vPosition);

    float brightness = dot(normal, direction);

    brightness = clamp(brightness, 0.2, 1.0);

    gl_FragColor = vec4(brightness * uColor, 1.0);
}
