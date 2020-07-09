<<<<<<< HEAD
varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform sampler2D uSampler;

void main(void) {
	highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
	
	gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}
=======
varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform sampler2D uSampler;

void main(void) {
	highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
	
	gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}
>>>>>>> eef9478f40cc009588c6b5695770292fd19006d0
