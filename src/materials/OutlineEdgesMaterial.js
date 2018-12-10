import { ShaderMaterial, Uniform, Vector2 } from "three";

const fragment = "uniform sampler2D maskTexture;\n\nvarying vec2 vUv0;\nvarying vec2 vUv1;\nvarying vec2 vUv2;\nvarying vec2 vUv3;\n\nvoid main() {\n\n\tvec2 c0 = texture2D(maskTexture, vUv0).rg;\n\tvec2 c1 = texture2D(maskTexture, vUv1).rg;\n\tvec2 c2 = texture2D(maskTexture, vUv2).rg;\n\tvec2 c3 = texture2D(maskTexture, vUv3).rg;\n\n\tfloat d0 = (c0.x - c1.x) * 0.5;\n\tfloat d1 = (c2.x - c3.x) * 0.5;\n\tfloat d = length(vec2(d0, d1));\n\n\tfloat a0 = min(c0.y, c1.y);\n\tfloat a1 = min(c2.y, c3.y);\n\tfloat visibilityFactor = min(a0, a1);\n\n\tgl_FragColor.rg = (1.0 - visibilityFactor > 0.001) ? vec2(d, 0.0) : vec2(0.0, d);\n\n}\n";
const vertex = "uniform vec2 texelSize;\n\nvarying vec2 vUv0;\nvarying vec2 vUv1;\nvarying vec2 vUv2;\nvarying vec2 vUv3;\n\nvoid main() {\n\n\tvUv0 = vec2(uv.x + texelSize.x, uv.y);\n\tvUv1 = vec2(uv.x - texelSize.x, uv.y);\n\tvUv2 = vec2(uv.x, uv.y + texelSize.y);\n\tvUv3 = vec2(uv.x, uv.y - texelSize.y);\n\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\n}\n";

/**
 * An outline edge detection shader material.
 */

export class OutlineEdgesMaterial extends ShaderMaterial {

	/**
	 * Constructs a new outline edge detection material.
	 *
	 * @param {Vector2} [texelSize] - The absolute screen texel size.
	 */

	constructor(texelSize = new Vector2()) {

		super({

			type: "OutlineEdgesMaterial",

			uniforms: {

				maskTexture: new Uniform(null),
				texelSize: new Uniform(new Vector2())

			},

			fragmentShader: fragment,
			vertexShader: vertex,

			depthWrite: false,
			depthTest: false

		});

		this.setTexelSize(texelSize.x, texelSize.y);

	}

	/**
	 * Sets the texel size.
	 *
	 * @param {Number} x - The texel width.
	 * @param {Number} y - The texel height.
	 */

	setTexelSize(x, y) {

		this.uniforms.texelSize.value.set(x, y);

	}

}
