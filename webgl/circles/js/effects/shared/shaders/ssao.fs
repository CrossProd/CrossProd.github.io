precision mediump float;

varying vec2 textureCoordinate;

uniform sampler2D normalTexture;
uniform sampler2D rotationTexture;
uniform sampler2D positionTexture;

uniform mat4 projection;

uniform vec3 samples[16];

uniform float zNear;
uniform float zFar;

uniform float sampleRadius;

int nrOfSamples = 16;

float noiseFrequency = 50.0;

float readDepth(in vec2 coord) {
    return texture2D(positionTexture, coord).w;
}

vec3 readNormal(in vec2 coord) {
    return normalize(texture2D(normalTexture, coord).xyz);
}

vec3 readRotation(in vec2 coord) {
    return texture2D(rotationTexture, coord).xyz;
}

vec3 readPosition(in vec2 coord) {
    return texture2D(positionTexture, coord).xyz;
}

void main(void) {
    vec3 mainNormal = readNormal(textureCoordinate);
    vec3 mainPosition = readPosition(textureCoordinate);

    float depth = readDepth(textureCoordinate);

    if (depth < 1.0) {
        vec3 rvec = readRotation(textureCoordinate * noiseFrequency);

        vec3 tangent = normalize(rvec - mainNormal * dot(rvec, mainNormal));
        vec3 bitangent = cross(mainNormal, tangent);
        mat3 tbn = mat3(tangent, bitangent, mainNormal);

        float ssao = 0.0;

        for (int i = 0; i < nrOfSamples; i++) {
            // get sample position:
            vec3 sample = tbn * samples[i];

            sample = mainPosition + sample * sampleRadius;

            // project sample position:
            vec4 offset = vec4(sample, 1.0);

            offset = projection * offset;

            offset.xy /= offset.w;
            offset.xy = offset.xy * 0.5 + 0.5;

            // get sample depth:
            float sampleDepth = readPosition(offset.xy).z;

            // range check & accumulate:
            float rangeCheck = abs(mainPosition.z - sampleDepth) < sampleRadius ? 1.0 : 0.0;

            ssao += (sampleDepth > sample.z ? 1.0 : 0.0) * rangeCheck;
        }

        ssao = 1.0 - (ssao / 16.0);

        gl_FragColor = vec4(ssao, depth, 0, 0);

    }
    else
    {
        gl_FragColor = vec4(1, 1, 1, 1);
    }
}
