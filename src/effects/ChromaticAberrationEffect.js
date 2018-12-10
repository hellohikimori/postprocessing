import { Uniform, Vector2 } from "three";
import { BlendFunction } from "./blending/BlendFunction.js";
import { Effect, EffectAttribute } from "./Effect.js";

const fragment = "varying vec2 vUvR;\nvarying vec2 vUvB;\n\nvoid mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {\n\n\tvec4 color = inputColor;\n\n\tcolor.r = texture2D(inputBuffer, vUvR).r;\n\tcolor.b = texture2D(inputBuffer, vUvB).b;\n\n\toutputColor = color;\n\n}\n";
const vertex = "uniform vec2 offset;\n\nvarying vec2 vUvR;\nvarying vec2 vUvB;\n\nvoid mainSupport() {\n\n\tvUvR = uv + offset;\n\tvUvB = uv - offset;\n\n}\n";

/**
 * A chromatic aberration effect.
 */

export class ChromaticAberrationEffect extends Effect {

	/**
	 * Constructs a new chromatic aberration effect.
	 *
	 * @param {Object} [options] - The options.
	 * @param {BlendFunction} [options.blendFunction=BlendFunction.NORMAL] - The blend function of this effect.
	 * @param {Vector2} [options.offset] - The color offset.
	 */

	constructor(options = {}) {

		const settings = Object.assign({
			blendFunction: BlendFunction.NORMAL,
			offset: new Vector2(0.001, 0.0005)
		}, options);

		super("ChromaticAberrationEffect", fragment, {

			attributes: EffectAttribute.CONVOLUTION,
			blendFunction: settings.blendFunction,

			uniforms: new Map([
				["offset", new Uniform(settings.offset)]
			]),

			vertexShader: vertex

		});

	}

	/**
	 * The color offset.
	 *
	 * @type {Vector2}
	 */

	get offset() {

		return this.uniforms.get("offset").value;

	}

	/**
	 * @type {Vector2}
	 */

	set offset(value) {

		this.uniforms.get("offset").value = value;

	}

}
