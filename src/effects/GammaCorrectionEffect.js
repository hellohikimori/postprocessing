import { Uniform } from "three";
import { BlendFunction } from "./blending/BlendFunction.js";
import { Effect } from "./Effect.js";

const fragment = "uniform float gamma;\n\nvoid mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {\n\n\toutputColor = LinearToGamma(max(inputColor, 0.0), gamma);\n\n}\n";

/**
 * A gamma correction effect.
 */

export class GammaCorrectionEffect extends Effect {

	/**
	 * Constructs a new gamma correction effect.
	 *
	 * @param {Object} [options] - The options.
	 * @param {BlendFunction} [options.blendFunction=BlendFunction.NORMAL] - The blend function of this effect.
	 * @param {Number} [options.gamma=2.0] - The gamma factor.
	 */

	constructor(options = {}) {

		const settings = Object.assign({
			blendFunction: BlendFunction.NORMAL,
			gamma: 2.0
		}, options);

		super("GammaCorrectionEffect", fragment, {

			blendFunction: settings.blendFunction,

			uniforms: new Map([
				["gamma", new Uniform(settings.gamma)]
			])

		});

	}

}
