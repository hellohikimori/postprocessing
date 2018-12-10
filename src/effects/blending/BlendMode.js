import { Uniform } from "three";
import { BlendFunction } from "./BlendFunction.js";

const addBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn min(x + y, 1.0) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";
const alphaBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn y * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, y.a), x.a);\n\n}\n";
const averageBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn (x + y) * 0.5 * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";
const colorBurnBlendFunction = "float blend(const in float x, const in float y) {\n\n\treturn (y == 0.0) ? y : max(1.0 - (1.0 - x) / y, 0.0);\n\n}\n\nvec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\tvec3 z = vec3(blend(x.r, y.r), blend(x.g, y.g), blend(x.b, y.b));\n\n\treturn z * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";
const colorDodgeBlendFunction = "float blend(const in float x, const in float y) {\n\n\treturn (y == 1.0) ? y : min(x / (1.0 - y), 1.0);\n\n}\n\nvec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\tvec3 z = vec3(blend(x.r, y.r), blend(x.g, y.g), blend(x.b, y.b));\n\n\treturn z * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";
const darkenBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn min(x, y) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";
const differenceBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn abs(x - y) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";
const exclusionBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn (x + y - 2.0 * x * y) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";
const lightenBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn max(x, y) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";
const multiplyBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn x * y * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";
const negationBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn (1.0 - abs(1.0 - x - y)) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";
const normalBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn y * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";
const overlayBlendFunction = "float blend(const in float x, const in float y) {\n\n\treturn (x < 0.5) ? (2.0 * x * y) : (1.0 - 2.0 * (1.0 - x) * (1.0 - y));\n\n}\n\nvec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\tvec3 z = vec3(blend(x.r, y.r), blend(x.g, y.g), blend(x.b, y.b));\n\n\treturn z * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";
const reflectBlendFunction = "float blend(const in float x, const in float y) {\n\n\treturn (y == 1.0) ? y : min(x * x / (1.0 - y), 1.0);\n\n}\n\nvec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\tvec3 z = vec3(blend(x.r, y.r), blend(x.g, y.g), blend(x.b, y.b));\n\n\treturn z * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";
const screenBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn (1.0 - (1.0 - x) * (1.0 - y)) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";
const softLightBlendFunction = "float blend(const in float x, const in float y) {\n\n\treturn (y < 0.5) ?\n\t\t(2.0 * x * y + x * x * (1.0 - 2.0 * y)) :\n\t\t(sqrt(x) * (2.0 * y - 1.0) + 2.0 * x * (1.0 - y));\n\n}\n\nvec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\tvec3 z = vec3(blend(x.r, y.r), blend(x.g, y.g), blend(x.b, y.b));\n\n\treturn z * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";
const subtractBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn max(x + y - 1.0, 0.0) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";

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
