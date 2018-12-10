import { ShaderMaterial, Uniform } from "three";

const fragment = "uniform sampler2D previousLuminanceBuffer;\nuniform sampler2D currentLuminanceBuffer;\nuniform float minLuminance;\nuniform float delta;\nuniform float tau;\n\nvarying vec2 vUv;\n\nvoid main() {\n\n\tfloat previousLuminance = texture2D(previousLuminanceBuffer, vUv, MIP_LEVEL_1X1).r;\n\tfloat currentLuminance = texture2D(currentLuminanceBuffer, vUv, MIP_LEVEL_1X1).r;\n\n\tpreviousLuminance = max(minLuminance, previousLuminance);\n\tcurrentLuminance = max(minLuminance, currentLuminance);\n\n\t// Adapt the luminance using Pattanaik's technique.\n\tfloat adaptedLum = previousLuminance + (currentLuminance - previousLuminance) * (1.0 - exp(-delta * tau));\n\n\tgl_FragColor.r = adaptedLum;\n\n}\n";
const vertex = "varying vec2 vUv;\n\nvoid main() {\n\n\tvUv = uv;\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\n}\n";

/**
 * An adaptive luminance shader material.
 */

export class AdaptiveLuminanceMaterial extends ShaderMaterial {

	/**
	 * Constructs a new adaptive luminance material.
	 */

	constructor() {

		super({

			type: "AdaptiveLuminanceMaterial",

			defines: {

				MIP_LEVEL_1X1: "0.0"

			},

			uniforms: {

				previousLuminanceBuffer: new Uniform(null),
				currentLuminanceBuffer: new Uniform(null),
				minLuminance: new Uniform(0.01),
				delta: new Uniform(0.0),
				tau: new Uniform(1.0)

			},

			fragmentShader: fragment,
			vertexShader: vertex,

			depthWrite: false,
			depthTest: false

		});

	}

}
