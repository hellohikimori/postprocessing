import { ShaderMaterial, Uniform, Vector2 } from "three";

const fragment = "uniform sampler2D inputBuffer;\n\nvarying vec2 vUv;\n\nvarying vec2 vUv0;\nvarying vec2 vUv1;\nvarying vec2 vUv2;\nvarying vec2 vUv3;\nvarying vec2 vUv4;\nvarying vec2 vUv5;\n\nvoid main() {\n\n\tconst vec2 threshold = vec2(EDGE_THRESHOLD);\n\n\t// Calculate color deltas.\n\tvec4 delta;\n\tvec3 c = texture2D(inputBuffer, vUv).rgb;\n\n\tvec3 cLeft = texture2D(inputBuffer, vUv0).rgb;\n\tvec3 t = abs(c - cLeft);\n\tdelta.x = max(max(t.r, t.g), t.b);\n\n\tvec3 cTop = texture2D(inputBuffer, vUv1).rgb;\n\tt = abs(c - cTop);\n\tdelta.y = max(max(t.r, t.g), t.b);\n\n\t// Use a threshold to detect significant color edges.\n\tvec2 edges = step(threshold, delta.xy);\n\n\t// Discard if there is no edge.\n\tif(dot(edges, vec2(1.0)) == 0.0) {\n\n\t\tdiscard;\n\n\t}\n\n\t// Calculate right and bottom deltas.\n\tvec3 cRight = texture2D(inputBuffer, vUv2).rgb;\n\tt = abs(c - cRight);\n\tdelta.z = max(max(t.r, t.g), t.b);\n\n\tvec3 cBottom = texture2D(inputBuffer, vUv3).rgb;\n\tt = abs(c - cBottom);\n\tdelta.w = max(max(t.r, t.g), t.b);\n\n\t// Calculate the maximum delta in the direct neighborhood.\n\tfloat maxDelta = max(max(max(delta.x, delta.y), delta.z), delta.w);\n\n\t// Calculate left-left and top-top deltas.\n\tvec3 cLeftLeft = texture2D(inputBuffer, vUv4).rgb;\n\tt = abs(c - cLeftLeft);\n\tdelta.z = max(max(t.r, t.g), t.b);\n\n\tvec3 cTopTop = texture2D(inputBuffer, vUv5).rgb;\n\tt = abs(c - cTopTop);\n\tdelta.w = max(max(t.r, t.g), t.b);\n\n\t// Calculate the final maximum delta.\n\tmaxDelta = max(max(maxDelta, delta.z), delta.w);\n\n\t// Local contrast adaptation.\n\tedges *= step(0.5 * maxDelta, delta.xy);\n\n\tgl_FragColor = vec4(edges, 0.0, 0.0);\n\n}\n";
const vertex = "uniform vec2 texelSize;\n\nvarying vec2 vUv;\n\nvarying vec2 vUv0;\nvarying vec2 vUv1;\nvarying vec2 vUv2;\nvarying vec2 vUv3;\nvarying vec2 vUv4;\nvarying vec2 vUv5;\n\nvoid main() {\n\n\tvUv = uv;\n\n\t// Left and top texel coordinates.\n\tvUv0 = uv + texelSize * vec2(-1.0, 0.0);\n\tvUv1 = uv + texelSize * vec2(0.0, 1.0);\n\n\t// Right and bottom texel coordinates.\n\tvUv2 = uv + texelSize * vec2(1.0, 0.0);\n\tvUv3 = uv + texelSize * vec2(0.0, -1.0);\n\n\t// Left-left and top-top texel coordinates.\n\tvUv4 = uv + texelSize * vec2(-2.0, 0.0);\n\tvUv5 = uv + texelSize * vec2(0.0, 2.0);\n\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\n}\n";

/**
 * A material that detects edges in a color texture.
 *
 * Mainly used for Subpixel Morphological Antialiasing.
 */

export class ColorEdgesMaterial extends ShaderMaterial {

	/**
	 * Constructs a new color edges material.
	 *
	 * @param {Vector2} [texelSize] - The absolute screen texel size.
	 */

	constructor(texelSize = new Vector2()) {

		super({

			type: "ColorEdgesMaterial",

			defines: {

				EDGE_THRESHOLD: "0.1"

			},

			uniforms: {

				inputBuffer: new Uniform(null),
				texelSize: new Uniform(texelSize)

			},

			fragmentShader: fragment,
			vertexShader: vertex,

			depthWrite: false,
			depthTest: false

		});

	}

	/**
	 * Sets the edge detection sensitivity.
	 *
	 * A lower value results in more edges being detected at the expense of
	 * performance.
	 *
	 * 0.1 is a reasonable value, and allows to catch most visible edges.
	 * 0.05 is a rather overkill value, that allows to catch 'em all.
	 *
	 * If temporal supersampling is used, 0.2 could be a reasonable value,
	 * as low contrast edges are properly filtered by just 2x.
	 *
	 * @param {Number} threshold - The edge detection sensitivity. Range: [0.05, 0.5].
	 */

	setEdgeDetectionThreshold(threshold) {

		this.defines.EDGE_THRESHOLD = threshold.toFixed("2");
		this.needsUpdate = true;

	}

}
