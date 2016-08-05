precision mediump float;

uniform vec3 uColor;

varying vec2 vUV;

void main() {
    float length = length(vUV + vec2(-0.5, -0.5));

    //float brightness = length <= 0.5 ? 1.0 : 0.0;

    if (length >= 0.5) {
        discard;
    }

    gl_FragColor = vec4(uColor, 1.0);
}
