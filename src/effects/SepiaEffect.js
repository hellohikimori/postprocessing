import { Uniform } from "three";
import { BlendFunction } from "./blending/BlendFunction.js";
import { Effect } from "./Effect.js";

const fragment = "uniform float intensity;\n\nvoid mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {\n\n\tvec3 color = vec3(\n\t\tdot(inputColor.rgb, vec3(1.0 - 0.607 * intensity, 0.769 * intensity, 0.189 * intensity)),\n\t\tdot(inputColor.rgb, vec3(0.349 * intensity, 1.0 - 0.314 * intensity, 0.168 * intensity)),\n\t\tdot(inputColor.rgb, vec3(0.272 * intensity, 0.534 * intensity, 1.0 - 0.869 * intensity))\n\t);\n\n\toutputColor = vec4(color, inputColor.a);\n\n}\n";

/**
 * A sepia effect.
 */

export class SepiaEffect extends Effect {

	/**
	 * Constructs a new sepia effect.
	 *
	 * @param {Object} [options] - The options.
	 * @param {BlendFunction} [options.blendFunction=BlendFunction.NORMAL] - The blend function of this effect.
	 * @param {Number} [options.intensity=1.0] - The intensity of the effect.
	 */

	constructor(options = {}) {

		const settings = Object.assign({
			blendFunction: BlendFunction.NORMAL,
			intensity: 1.0
		}, options);

		super("SepiaEffect", fragment, {

			blendFunction: settings.blendFunction,

			uniforms: new Map([
				["intensity", new Uniform(settings.intensity)]
			])

		});

	}

}
