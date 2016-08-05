precision mediump float;

varying vec2 vUV;

uniform vec3 uChromaticDistortion;

uniform sampler2D uColorTexture;

vec3 sampleColor(sampler2D texture, vec2 uv) {
    float dist = distance(vec2(0.5, 0.5), uv);

    float percent = 0.98 - ((0.5 - dist) / 0.5) * 0.1;

    vec2 uvR = (uv - vec2(0.5)) * percent * uChromaticDistortion.x;
    vec2 uvG = (uv - vec2(0.5)) * percent * uChromaticDistortion.y;
    vec2 uvB = (uv - vec2(0.5)) * percent * uChromaticDistortion.z;

    uvR += vec2(0.5);
    uvG += vec2(0.5);
    uvB += vec2(0.5);

    float r = texture2D(texture, uvR).r;
    float g = texture2D(texture, uvG).g;
    float b = texture2D(texture, uvB).b;

    return vec3(r, g, b);
}

void main() {
    vec3 color = sampleColor(uColorTexture, vUV);

    gl_FragColor = vec4(color.r, color.g, color.b, 1.0) * (1.0 / 16.0);
}
