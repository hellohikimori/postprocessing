import { Uniform } from "three";
import { BlendFunction } from "./BlendFunction.js";

import addBlendFunction from "./glsl/add/shader.frag";
import alphaBlendFunction from "./glsl/alpha/shader.frag";
import averageBlendFunction from "./glsl/average/shader.frag";
import colorBurnBlendFunction from "./glsl/color-burn/shader.frag";
import colorDodgeBlendFunction from "./glsl/color-dodge/shader.frag";
import darkenBlendFunction from "./glsl/darken/shader.frag";
import differenceBlendFunction from "./glsl/difference/shader.frag";
import exclusionBlendFunction from "./glsl/exclusion/shader.frag";
import lightenBlendFunction from "./glsl/lighten/shader.frag";
import multiplyBlendFunction from "./glsl/multiply/shader.frag";
import negationBlendFunction from "./glsl/negation/shader.frag";
import normalBlendFunction from "./glsl/normal/shader.frag";
import overlayBlendFunction from "./glsl/overlay/shader.frag";
import reflectBlendFunction from "./glsl/reflect/shader.frag";
import screenBlendFunction from "./glsl/screen/shader.frag";
import softLightBlendFunction from "./glsl/soft-light/shader.frag";
import subtractBlendFunction from "./glsl/subtract/shader.frag";

/**
 * A blend function shader code catalogue.
 *
 * @type {Map<BlendFunction, String>}
 * @private
 */

const blendFunctions = new Map();
blendFunctions.set(BlendFunction.SKIP, null);
blendFunctions.set(BlendFunction.ADD, addBlendFunction);
blendFunctions.set(BlendFunction.ALPHA, alphaBlendFunction);
blendFunctions.set(BlendFunction.AVERAGE, averageBlendFunction);
blendFunctions.set(BlendFunction.COLOR_BURN, colorBurnBlendFunction);
blendFunctions.set(BlendFunction.COLOR_DODGE, colorDodgeBlendFunction);
blendFunctions.set(BlendFunction.DARKEN, darkenBlendFunction);
blendFunctions.set(BlendFunction.DIFFERENCE, differenceBlendFunction);
blendFunctions.set(BlendFunction.EXCLUSION, exclusionBlendFunction);
blendFunctions.set(BlendFunction.LIGHTEN, lightenBlendFunction);
blendFunctions.set(BlendFunction.MULTIPLY, multiplyBlendFunction);
blendFunctions.set(BlendFunction.NEGATION, negationBlendFunction);
blendFunctions.set(BlendFunction.NORMAL, normalBlendFunction);
blendFunctions.set(BlendFunction.OVERLAY, overlayBlendFunction);
blendFunctions.set(BlendFunction.REFLECT, reflectBlendFunction);
blendFunctions.set(BlendFunction.SCREEN, screenBlendFunction);
blendFunctions.set(BlendFunction.SOFT_LIGHT, softLightBlendFunction);
blendFunctions.set(BlendFunction.SUBTRACT, subtractBlendFunction);

/**
 * A blend mode.
 */

export class BlendMode {

	/**
	 * Constructs a new blend mode.
	 *
	 * @param {BlendFunction} blendFunction - The blend function to use.
	 * @param {Number} opacity - The opacity of the color that will be blended with the base color.
	 */

	constructor(blendFunction, opacity = 1.0) {

		/**
		 * The blend function.
		 *
		 * @type {BlendFunction}
		 */

		this.blendFunction = blendFunction;

		/**
		 * The opacity of the color that will be blended with the base color.
		 *
		 * @type {Uniform}
		 */

		this.opacity = new Uniform(opacity);

	}

	/**
	 * Returns the blend function shader code.
	 *
	 * @return {String} The blend function shader code.
	 */

	getShaderCode() {

		return blendFunctions.get(this.blendFunction);

	}

}
