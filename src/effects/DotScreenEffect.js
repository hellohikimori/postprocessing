import { Uniform, Vector2 } from "three";
import { BlendFunction } from "./blending/BlendFunction.js";
import { Effect } from "./Effect.js";

const fragment = "uniform vec2 angle;\nuniform float scale;\n\nfloat pattern(const in vec2 uv) {\n\n\tvec2 point = scale * vec2(\n\t\tdot(angle.yx, vec2(uv.x, -uv.y)),\n\t\tdot(angle, uv)\n\t);\n\n\treturn (sin(point.x) * sin(point.y)) * 4.0;\n\n}\n\nvoid mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {\n\n\tvec3 color = vec3(inputColor.rgb * 10.0 - 5.0 + pattern(uv * resolution));\n\toutputColor = vec4(color, inputColor.a);\n\n}\n";

/**
 * A dot screen effect.
 */

export class DotScreenEffect extends Effect {

	/**
	 * Constructs a new dot screen effect.
	 *
	 * @param {Object} [options] - The options.
	 * @param {BlendFunction} [options.blendFunction=BlendFunction.NORMAL] - The blend function of this effect.
	 * @param {Number} [options.angle=1.57] - The angle of the dot pattern.
	 * @param {Number} [options.scale=1.0] - The scale of the dot pattern.
	 */

	constructor(options = {}) {

		const settings = Object.assign({
			blendFunction: BlendFunction.NORMAL,
			angle: Math.PI * 0.5,
			scale: 1.0
		}, options);

		super("DotScreenEffect", fragment, {

			blendFunction: settings.blendFunction,

			uniforms: new Map([
				["angle", new Uniform(new Vector2())],
				["scale", new Uniform(settings.scale)]
			])

		});

		this.setAngle(settings.angle);

	}

	/**
	 * Sets the pattern angle.
	 *
	 * @param {Number} [angle] - The angle of the dot pattern.
	 */

	setAngle(angle) {

		this.uniforms.get("angle").value.set(Math.sin(angle), Math.cos(angle));

	}

}
