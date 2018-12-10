import { Uniform } from "three";
import { BlendFunction } from "./blending/BlendFunction.js";
import { Effect, EffectAttribute } from "./Effect.js";

const fragment = "uniform float focus;\nuniform float dof;\nuniform float aperture;\nuniform float maxBlur;\n\nvoid mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {\n\n\tvec2 aspectCorrection = vec2(1.0, aspect);\n\n\tfloat focusNear = clamp(focus - dof, 0.0, 1.0);\n\tfloat focusFar = clamp(focus + dof, 0.0, 1.0);\n\n\t// Calculate a DoF mask.\n\tfloat low = step(depth, focusNear);\n\tfloat high = step(focusFar, depth);\n\n\tfloat factor = (depth - focusNear) * low + (depth - focusFar) * high;\n\tvec2 dofBlur = vec2(clamp(factor * aperture, -maxBlur, maxBlur));\n\n\tvec2 dofblur9 = dofBlur * 0.9;\n\tvec2 dofblur7 = dofBlur * 0.7;\n\tvec2 dofblur4 = dofBlur * 0.4;\n\n\tvec4 color = inputColor;\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.0,   0.4 ) * aspectCorrection) * dofBlur);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.15,  0.37) * aspectCorrection) * dofBlur);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.29,  0.29) * aspectCorrection) * dofBlur);\n\tcolor += texture2D(inputBuffer, uv + (vec2(-0.37,  0.15) * aspectCorrection) * dofBlur);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.40,  0.0 ) * aspectCorrection) * dofBlur);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.37, -0.15) * aspectCorrection) * dofBlur);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.29, -0.29) * aspectCorrection) * dofBlur);\n\tcolor += texture2D(inputBuffer, uv + (vec2(-0.15, -0.37) * aspectCorrection) * dofBlur);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.0,  -0.4 ) * aspectCorrection) * dofBlur);\n\tcolor += texture2D(inputBuffer, uv + (vec2(-0.15,  0.37) * aspectCorrection) * dofBlur);\n\tcolor += texture2D(inputBuffer, uv + (vec2(-0.29,  0.29) * aspectCorrection) * dofBlur);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.37,  0.15) * aspectCorrection) * dofBlur);\n\tcolor += texture2D(inputBuffer, uv + (vec2(-0.4,   0.0 ) * aspectCorrection) * dofBlur);\n\tcolor += texture2D(inputBuffer, uv + (vec2(-0.37, -0.15) * aspectCorrection) * dofBlur);\n\tcolor += texture2D(inputBuffer, uv + (vec2(-0.29, -0.29) * aspectCorrection) * dofBlur);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.15, -0.37) * aspectCorrection) * dofBlur);\n\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.15,  0.37) * aspectCorrection) * dofblur9);\n\tcolor += texture2D(inputBuffer, uv + (vec2(-0.37,  0.15) * aspectCorrection) * dofblur9);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.37, -0.15) * aspectCorrection) * dofblur9);\n\tcolor += texture2D(inputBuffer, uv + (vec2(-0.15, -0.37) * aspectCorrection) * dofblur9);\n\tcolor += texture2D(inputBuffer, uv + (vec2(-0.15,  0.37) * aspectCorrection) * dofblur9);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.37,  0.15) * aspectCorrection) * dofblur9);\n\tcolor += texture2D(inputBuffer, uv + (vec2(-0.37, -0.15) * aspectCorrection) * dofblur9);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.15, -0.37) * aspectCorrection) * dofblur9);\n\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.29,  0.29) * aspectCorrection) * dofblur7);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.40,  0.0 ) * aspectCorrection) * dofblur7);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.29, -0.29) * aspectCorrection) * dofblur7);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.0,  -0.4 ) * aspectCorrection) * dofblur7);\n\tcolor += texture2D(inputBuffer, uv + (vec2(-0.29,  0.29) * aspectCorrection) * dofblur7);\n\tcolor += texture2D(inputBuffer, uv + (vec2(-0.4,   0.0 ) * aspectCorrection) * dofblur7);\n\tcolor += texture2D(inputBuffer, uv + (vec2(-0.29, -0.29) * aspectCorrection) * dofblur7);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.0,   0.4 ) * aspectCorrection) * dofblur7);\n\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.29,  0.29) * aspectCorrection) * dofblur4);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.4,   0.0 ) * aspectCorrection) * dofblur4);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.29, -0.29) * aspectCorrection) * dofblur4);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.0,  -0.4 ) * aspectCorrection) * dofblur4);\n\tcolor += texture2D(inputBuffer, uv + (vec2(-0.29,  0.29) * aspectCorrection) * dofblur4);\n\tcolor += texture2D(inputBuffer, uv + (vec2(-0.4,   0.0 ) * aspectCorrection) * dofblur4);\n\tcolor += texture2D(inputBuffer, uv + (vec2(-0.29, -0.29) * aspectCorrection) * dofblur4);\n\tcolor += texture2D(inputBuffer, uv + (vec2( 0.0,   0.4 ) * aspectCorrection) * dofblur4);\n\n\toutputColor = color / 41.0;\n\n}\n";

/**
 * A depth of field (bokeh) shader effect.
 *
 * Original shader code by Martins Upitis:
 *  http://artmartinsh.blogspot.com/2010/02/glsl-lens-blur-filter-with-bokeh.html
 */

export class BokehEffect extends Effect {

	/**
	 * Constructs a new bokeh effect.
	 *
	 * @param {Object} [options] - The options.
	 * @param {BlendFunction} [options.blendFunction=BlendFunction.NORMAL] - The blend function of this effect.
	 * @param {Number} [options.focus=0.5] - The focus distance ratio, ranging from 0.0 to 1.0.
	 * @param {Number} [options.dof=0.02] - Depth of field. An area in front of and behind the focal point that still appears sharp.
	 * @param {Number} [options.aperture=0.015] - Camera aperture scale. Bigger values for stronger blur and shallower depth of field.
	 * @param {Number} [options.maxBlur=1.0] - The maximum blur strength.
	 */

	constructor(options = {}) {

		const settings = Object.assign({
			blendFunction: BlendFunction.NORMAL,
			focus: 0.5,
			dof: 0.02,
			aperture: 0.015,
			maxBlur: 1.0
		}, options);

		super("BokehEffect", fragment, {

			attributes: EffectAttribute.CONVOLUTION | EffectAttribute.DEPTH,
			blendFunction: settings.blendFunction,

			uniforms: new Map([
				["focus", new Uniform(settings.focus)],
				["dof", new Uniform(settings.dof)],
				["aperture", new Uniform(settings.aperture)],
				["maxBlur", new Uniform(settings.maxBlur)]
			])

		});

	}

}
