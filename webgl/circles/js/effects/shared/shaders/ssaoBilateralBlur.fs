precision mediump float;

varying vec2 textureCoordinate;

uniform sampler2D ssaoTexture;
uniform sampler2D normalTexture;

uniform vec2 scale;

float totStrength = 0.003;

float g_Sharpness = 16000.0;
float g_BlurRadius = 5.0;

float getDepth(vec2 uv) {
    return texture2D(ssaoTexture, uv).g;
}

float getOcclusion(vec2 uv) {
    return texture2D(ssaoTexture, uv).r;
}

float blurFunction(vec2 uv, float r, float center_c, float center_d, inout float w_total) {
    float radius     = g_BlurRadius;
    float sigma      = (radius + 1.0) / 2.0;
    float g_BlurFalloff = 1.0 / (2.0 * sigma * sigma);

    float c = getOcclusion(uv);
    float d = getDepth(uv);

    float ddiff = d - center_d;

    float w = exp(-r * r * g_BlurFalloff - ddiff * ddiff * g_Sharpness);

    w_total += w;

    return w * c;
}

void main() {
    float pixelOcclusion = getOcclusion(textureCoordinate);
    float pixelDepth = getDepth(textureCoordinate);

    float b = 0.0;
    float w_total = 0.0;

    for (float r = -g_BlurRadius; r <= g_BlurRadius; ++r) {
        vec2 uv = textureCoordinate + vec2(r, r) * scale;

        b += blurFunction(uv, r, pixelOcclusion, pixelDepth, w_total);
    }

    gl_FragColor = vec4(b / w_total, pixelDepth, 0, 0);
}