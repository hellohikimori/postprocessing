import { ShaderMaterial, Uniform } from "three";

const fragment = "uniform sampler2D inputBuffer;\nuniform float opacity;\n\nvarying vec2 vUv;\n\nvoid main() {\n\n\tvec4 texel = texture2D(inputBuffer, vUv);\n\tgl_FragColor = opacity * texel;\n\n}\n";
const vertex = "varying vec2 vUv;\n\nvoid main() {\n\n\tvUv = uv;\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\n}\n";

/**
 * A simple copy shader material.
 */

export class CopyMaterial extends ShaderMaterial {

	/**
	 * Constructs a new copy material.
	 */

	constructor() {

		super({

			type: "CopyMaterial",

			uniforms: {

				inputBuffer: new Uniform(null),
				opacity: new Uniform(1.0)

			},

			fragmentShader: fragment,
			vertexShader: vertex,

			depthWrite: false,
			depthTest: false

		});

	}

}
