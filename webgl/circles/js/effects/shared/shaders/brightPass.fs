precision mediump float;

varying vec2 textureCoordinate;

uniform sampler2D texture01;

const float luminance = 0.08;
const float middleGray = 0.18;
const float whiteCutoff = 0.9;

void main() {
    vec4 result = texture2D(texture01, textureCoordinate);

    result *= middleGray / (luminance + 0.001);
    result *= (1.0 + (result / (whiteCutoff * whiteCutoff)));

    result -= 5.0;

    result = max(result, 0.0);

    result /= (10.0 + result);

	gl_FragColor = result;
}