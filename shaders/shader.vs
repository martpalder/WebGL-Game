attribute vec4 aVertexPos;
attribute vec2 aTexCoord;
attribute vec3 aVertexNormal;

uniform mat4 uNormal;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

varying highp vec2 vTexCoord;
varying highp vec3 vLighting;

void main(void) {
	gl_Position = uProjection * uView * uModel * aVertexPos;
	vTexCoord = aTexCoord;
	
	// Apply lighting effect
	highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
	highp vec3 directionalLightColor = vec3(1, 1, 1);
	highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
	
	highp vec4 transformedNormal = uNormal * vec4(aVertexNormal, 1.0);
	
	highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
	vLighting = ambientLight + (directionalLightColor * directional);
}
