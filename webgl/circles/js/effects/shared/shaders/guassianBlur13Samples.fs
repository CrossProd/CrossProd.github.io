// 13x1 gaussian blur fragment shader, do either horizontal or vertical pass

precision mediump float;

varying vec2 vUV;

uniform vec2 uScale;
uniform sampler2D uTexture;

void main() {
	vec4 result = vec4(0.0, 0.0, 0.0, 0.0);

    result += uTexture2D(uTexture, vec2(vUV.x - 6.0 * uScale.x, vUV.y - 6.0 * uScale.y)) * 0.002216;
    result += uTexture2D(uTexture, vec2(vUV.x - 5.0 * uScale.x, vUV.y - 5.0 * uScale.y)) * 0.008764;
    result += uTexture2D(uTexture, vec2(vUV.x - 4.0 * uScale.x, vUV.y - 4.0 * uScale.y)) * 0.026995;
    result += uTexture2D(uTexture, vec2(vUV.x - 3.0 * uScale.x, vUV.y - 3.0 * uScale.y)) * 0.064759;
    result += uTexture2D(uTexture, vec2(vUV.x - 2.0 * uScale.x, vUV.y - 2.0 * uScale.y)) * 0.120985;
    result += uTexture2D(uTexture, vec2(vUV.x - 1.0 * uScale.x, vUV.y - 1.0 * uScale.y)) * 0.176033;
    result += uTexture2D(uTexture, vec2(vUV.x + 0.0 * uScale.x, vUV.y + 0.0 * uScale.y)) * 0.199471;
    result += uTexture2D(uTexture, vec2(vUV.x + 1.0 * uScale.x, vUV.y + 1.0 * uScale.y)) * 0.176033;
    result += uTexture2D(uTexture, vec2(vUV.x + 2.0 * uScale.x, vUV.y + 2.0 * uScale.y)) * 0.120985;
    result += uTexture2D(uTexture, vec2(vUV.x + 3.0 * uScale.x, vUV.y + 3.0 * uScale.y)) * 0.064759;
    result += uTexture2D(uTexture, vec2(vUV.x + 4.0 * uScale.x, vUV.y + 4.0 * uScale.y)) * 0.026995;
    result += uTexture2D(uTexture, vec2(vUV.x + 5.0 * uScale.x, vUV.y + 5.0 * uScale.y)) * 0.008764;
    result += uTexture2D(uTexture, vec2(vUV.x + 6.0 * uScale.x, vUV.y + 6.0 * uScale.y)) * 0.002216;

	gl_FragColor = result;
}