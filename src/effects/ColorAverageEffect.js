import { BlendFunction } from "./blending/BlendFunction.js";
import { Effect } from "./Effect.js";

const fragment = "void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {\n\n\tfloat sum = inputColor.r + inputColor.g + inputColor.b;\n\n\toutputColor = vec4(vec3(sum / 3.0), inputColor.a);\n\n}\n";

/**
 * A color average effect.
 */

export class ColorAverageEffect extends Effect {

	/**
	 * Constructs a new color average effect.
	 *
	 * @param {BlendFunction} [blendFunction=BlendFunction.NORMAL] - The blend function of this effect.
	 */

	constructor(blendFunction = BlendFunction.NORMAL) {

		super("ColorAverageEffect", fragment, { blendFunction });

	}

}
