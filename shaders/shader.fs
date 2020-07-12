varying highp vec2 vTexCoord;
varying highp vec3 vLighting;

uniform sampler2D uSampler;

void main(void) {
	highp vec4 texelColor = texture2D(uSampler, vTexCoord);
	
	gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}
