// high quality 4X down scale by averaging 4 x 4 pixels

precision mediump float;

varying vec2 textureCoordinate;

uniform vec2 scale;
uniform sampler2D texture;

void main() {
    vec4 result = vec4(0.0, 0.0, 0.0, 0.0);

    result += texture2D(texture, vec2(textureCoordinate.x + 1.5 * scale.x, textureCoordinate.y - 1.5 * scale.y));
    result += texture2D(texture, vec2(textureCoordinate.x + 1.5 * scale.x, textureCoordinate.y - 0.5 * scale.y));
    result += texture2D(texture, vec2(textureCoordinate.x + 1.5 * scale.x, textureCoordinate.y + 0.5 * scale.y));
    result += texture2D(texture, vec2(textureCoordinate.x + 1.5 * scale.x, textureCoordinate.y + 1.5 * scale.y));

    result += texture2D(texture, vec2(textureCoordinate.x + 0.5 * scale.x, textureCoordinate.y - 1.5 * scale.y));
    result += texture2D(texture, vec2(textureCoordinate.x + 0.5 * scale.x, textureCoordinate.y - 0.5 * scale.y));
    result += texture2D(texture, vec2(textureCoordinate.x + 0.5 * scale.x, textureCoordinate.y + 0.5 * scale.y));
    result += texture2D(texture, vec2(textureCoordinate.x + 0.5 * scale.x, textureCoordinate.y + 1.5 * scale.y));

    result += texture2D(texture, vec2(textureCoordinate.x - 0.5 * scale.x, textureCoordinate.y - 1.5 * scale.y));
    result += texture2D(texture, vec2(textureCoordinate.x - 0.5 * scale.x, textureCoordinate.y - 0.5 * scale.y));
    result += texture2D(texture, vec2(textureCoordinate.x - 0.5 * scale.x, textureCoordinate.y + 0.5 * scale.y));
    result += texture2D(texture, vec2(textureCoordinate.x - 0.5 * scale.x, textureCoordinate.y + 1.5 * scale.y));

    result += texture2D(texture, vec2(textureCoordinate.x - 1.5 * scale.x, textureCoordinate.y - 1.5 * scale.y));
    result += texture2D(texture, vec2(textureCoordinate.x - 1.5 * scale.x, textureCoordinate.y - 0.5 * scale.y));
    result += texture2D(texture, vec2(textureCoordinate.x - 1.5 * scale.x, textureCoordinate.y + 0.5 * scale.y));
    result += texture2D(texture, vec2(textureCoordinate.x - 1.5 * scale.x, textureCoordinate.y + 1.5 * scale.y));

	gl_FragColor = result / 16.0;
}