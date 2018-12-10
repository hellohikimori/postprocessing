import { Uniform, Vector4 } from "three";
import { BlendFunction } from "./blending/BlendFunction.js";
import { Effect, EffectAttribute } from "./Effect.js";

const fragment = "uniform float focus;\nuniform float focalLength;\nuniform float maxBlur;\nuniform float luminanceThreshold;\nuniform float luminanceGain;\nuniform float bias;\nuniform float fringe;\n\n#ifdef MANUAL_DOF\n\n\tuniform vec4 dof;\n\n#endif\n\n#ifdef PENTAGON\n\n\tfloat pentagon(const in vec2 coords) {\n\n\t\tconst vec4 HS0 = vec4( 1.0,          0.0,         0.0, 1.0);\n\t\tconst vec4 HS1 = vec4( 0.309016994,  0.951056516, 0.0, 1.0);\n\t\tconst vec4 HS2 = vec4(-0.809016994,  0.587785252, 0.0, 1.0);\n\t\tconst vec4 HS3 = vec4(-0.809016994, -0.587785252, 0.0, 1.0);\n\t\tconst vec4 HS4 = vec4( 0.309016994, -0.951056516, 0.0, 1.0);\n\t\tconst vec4 HS5 = vec4( 0.0,          0.0,         1.0, 1.0);\n\n\t\tconst vec4 ONE = vec4(1.0);\n\n\t\tconst float P_FEATHER = 0.4;\n\t\tconst float N_FEATHER = -P_FEATHER;\n\n\t\tfloat inOrOut = -4.0;\n\n\t\tvec4 P = vec4(coords, vec2(RINGS_FLOAT - 1.3));\n\n\t\tvec4 dist = vec4(\n\t\t\tdot(P, HS0),\n\t\t\tdot(P, HS1),\n\t\t\tdot(P, HS2),\n\t\t\tdot(P, HS3)\n\t\t);\n\n\t\tdist = smoothstep(N_FEATHER, P_FEATHER, dist);\n\n\t\tinOrOut += dot(dist, ONE);\n\n\t\tdist.x = dot(P, HS4);\n\t\tdist.y = HS5.w - abs(P.z);\n\n\t\tdist = smoothstep(N_FEATHER, P_FEATHER, dist);\n\t\tinOrOut += dist.x;\n\n\t\treturn clamp(inOrOut, 0.0, 1.0);\n\n\t}\n\n#endif\n\nvec3 processTexel(const in vec2 coords, const in float blur) {\n\n\tvec3 c = vec3(\n\t\ttexture2D(inputBuffer, coords + vec2(0.0, 1.0) * texelSize * fringe * blur).r,\n\t\ttexture2D(inputBuffer, coords + vec2(-0.866, -0.5) * texelSize * fringe * blur).g,\n\t\ttexture2D(inputBuffer, coords + vec2(0.866, -0.5) * texelSize * fringe * blur).b\n\t);\n\n\t// Calculate the luminance of the constructed color.\n\tfloat luminance = linearToRelativeLuminance(c);\n\tfloat threshold = max((luminance - luminanceThreshold) * luminanceGain, 0.0);\n\n\treturn c + mix(vec3(0.0), c, threshold * blur);\n\n}\n\nfloat gather(const in float i, const in float j, const in float ringSamples,\n\tconst in vec2 uv, const in vec2 blurFactor, const in float blur, inout vec3 color) {\n\n\tfloat step = PI2 / ringSamples;\n\tvec2 wh = vec2(cos(j * step) * i, sin(j * step) * i);\n\n\t#ifdef PENTAGON\n\n\t\tfloat p = pentagon(wh);\n\n\t#else\n\n\t\tfloat p = 1.0;\n\n\t#endif\n\n\tcolor += processTexel(wh * blurFactor + uv, blur) * mix(1.0, i / RINGS_FLOAT, bias) * p;\n\n\treturn mix(1.0, i / RINGS_FLOAT, bias) * p;\n\n}\n\nvoid mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {\n\n\t// Translate depth into world space units.\n\tfloat linearDepth = (-cameraFar * cameraNear / (depth * (cameraFar - cameraNear) - cameraFar));\n\n\t#ifdef MANUAL_DOF\n\n\t\tfloat focalPlane = linearDepth - focus;\n\t\tfloat farDoF = (focalPlane - dof.z) / dof.w;\n\t\tfloat nearDoF = (-focalPlane - dof.x) / dof.y;\n\n\t\tfloat blur = (focalPlane > 0.0) ? farDoF : nearDoF;\n\n\t#else\n\n\t\tconst float CIRCLE_OF_CONFUSION = 0.03; // 35mm film = 0.03mm CoC.\n\n\t\tfloat focalPlaneMM = focus * 1000.0;\n\t\tfloat depthMM = linearDepth * 1000.0;\n\n\t\tfloat focalPlane = (depthMM * focalLength) / (depthMM - focalLength);\n\t\tfloat farDoF = (focalPlaneMM * focalLength) / (focalPlaneMM - focalLength);\n\t\tfloat nearDoF = (focalPlaneMM - focalLength) / (focalPlaneMM * focus * CIRCLE_OF_CONFUSION);\n\n\t\tfloat blur = abs(focalPlane - farDoF) * nearDoF;\n\n\t#endif\n\n\tblur = clamp(blur, 0.0, 1.0);\n\n\tvec2 blurFactor = vec2(\n\t\ttexelSize.x * blur * maxBlur,\n\t\ttexelSize.y * blur * maxBlur\n\t);\n\n\tconst int MAX_RING_SAMPLES = RINGS_INT * SAMPLES_INT;\n\n\tvec3 color = inputColor.rgb;\n\n\tif(blur >= 0.05) {\n\n\t\tfloat s = 1.0;\n\t\tint ringSamples;\n\n\t\tfor(int i = 1; i <= RINGS_INT; i++) {\n\n\t\t\tringSamples = i * SAMPLES_INT;\n\n\t\t\tfor(int j = 0; j < MAX_RING_SAMPLES; j++) {\n\n\t\t\t\tif(j >= ringSamples) {\n\n\t\t\t\t\tbreak;\n\n\t\t\t\t}\n\n\t\t\t\ts += gather(float(i), float(j), float(ringSamples), uv, blurFactor, blur, color);\n\n\t\t\t}\n\n\t\t}\n\n\t\tcolor /= s;\n\n\t}\n\n\t#ifdef SHOW_FOCUS\n\n\t\tfloat edge = 0.002 * linearDepth;\n\t\tfloat m = clamp(smoothstep(0.0, edge, blur), 0.0, 1.0);\n\t\tfloat e = clamp(smoothstep(1.0 - edge, 1.0, blur), 0.0, 1.0);\n\n\t\tcolor = mix(color, vec3(1.0, 0.5, 0.0), (1.0 - m) * 0.6);\n\t\tcolor = mix(color, vec3(0.0, 0.5, 1.0), ((1.0 - e) - (1.0 - m)) * 0.2);\n\n\t#endif\n\n\toutputColor = vec4(color, inputColor.a);\n\n}\n";

/**
 * Depth of Field shader v2.4.
 *
 * Yields more realistic results but is also more demanding.
 *
 * Original shader code by Martins Upitis:
 *  http://blenderartists.org/forum/showthread.php?237488-GLSL-depth-of-field-with-bokeh-v2-4-(update)
 */

export class RealisticBokehEffect extends Effect {

	/**
	 * Constructs a new bokeh effect.
	 *
	 * @param {Object} [options] - The options.
	 * @param {BlendFunction} [options.blendFunction=BlendFunction.NORMAL] - The blend function of this effect.
	 * @param {Number} [options.focus=0.5] - The focus distance ratio, ranging from 0.0 to 1.0.
	 * @param {Number} [options.focalLength=24.0] - The focal length of the main camera.
	 * @param {Number} [options.luminanceThreshold=0.5] - A luminance threshold.
	 * @param {Number} [options.luminanceGain=2.0] - A luminance gain factor.
	 * @param {Number} [options.bias=0.5] - A blur bias.
	 * @param {Number} [options.fringe=0.7] - A blur offset.
	 * @param {Number} [options.maxBlur=1.0] - The maximum blur strength.
	 * @param {Boolean} [options.rings=3] - The number of blur iterations.
	 * @param {Boolean} [options.samples=2] - The amount of samples taken per ring.
	 * @param {Boolean} [options.showFocus=false] - Whether the focal point should be highlighted. Useful for debugging.
	 * @param {Boolean} [options.manualDoF=false] - Enables manual control over the depth of field.
	 * @param {Boolean} [options.pentagon=false] - Enables pentagonal blur shapes. Requires a high number of rings and samples.
	 */

	constructor(options = {}) {

		const settings = Object.assign({
			blendFunction: BlendFunction.NORMAL,
			focus: 0.5,
			focalLength: 24.0,
			luminanceThreshold: 0.5,
			luminanceGain: 2.0,
			bias: 0.5,
			fringe: 0.7,
			maxBlur: 1.0,
			rings: 3,
			samples: 2,
			showFocus: false,
			manualDoF: false,
			pentagon: false
		}, options);

		super("RealisticBokehEffect", fragment, {

			attributes: EffectAttribute.CONVOLUTION | EffectAttribute.DEPTH,
			blendFunction: settings.blendFunction,

			uniforms: new Map([
				["focus", new Uniform(settings.focus)],
				["focalLength", new Uniform(settings.focalLength)],
				["luminanceThreshold", new Uniform(settings.luminanceThreshold)],
				["luminanceGain", new Uniform(settings.luminanceGain)],
				["bias", new Uniform(settings.bias)],
				["fringe", new Uniform(settings.fringe)],
				["maxBlur", new Uniform(settings.maxBlur)]
			])

		});

		this.rings = settings.rings;
		this.samples = settings.samples;
		this.showFocus = settings.showFocus;
		this.manualDoF = settings.manualDoF;
		this.pentagon = settings.pentagon;

	}

	/**
	 * The amount of blur iterations.
	 *
	 * @type {Number}
	 */

	get rings() {

		return Number.parseInt(this.defines.get("RINGS_INT"));

	}

	/**
	 * Sets the amount of blur iterations.
	 *
	 * You'll need to call {@link EffectPass#recompile} after changing this value.
	 *
	 * @type {Number}
	 */

	set rings(value) {

		value = Math.floor(value);

		this.defines.set("RINGS_INT", value.toFixed(0));
		this.defines.set("RINGS_FLOAT", value.toFixed(1));

	}

	/**
	 * The amount of blur samples per ring.
	 *
	 * @type {Number}
	 */

	get samples() {

		return Number.parseInt(this.defines.get("SAMPLES_INT"));

	}

	/**
	 * Sets the amount of blur samples per ring.
	 *
	 * You'll need to call {@link EffectPass#recompile} after changing this value.
	 *
	 * @type {Number}
	 */

	set samples(value) {

		value = Math.floor(value);

		this.defines.set("SAMPLES_INT", value.toFixed(0));
		this.defines.set("SAMPLES_FLOAT", value.toFixed(1));

	}

	/**
	 * Indicates whether the focal point will be highlighted.
	 *
	 * @type {Boolean}
	 */

	get showFocus() {

		return this.defines.has("SHOW_FOCUS");

	}

	/**
	 * Enables or disables focal point highlighting.
	 *
	 * You'll need to call {@link EffectPass#recompile} after changing this value.
	 *
	 * @type {Boolean}
	 */

	set showFocus(value) {

		value ? this.defines.set("SHOW_FOCUS", "1") : this.defines.delete("SHOW_FOCUS");

	}

	/**
	 * Indicates whether the Depth of Field should be calculated manually.
	 *
	 * If enabled, the Depth of Field can be adjusted via the `dof` uniform.
	 *
	 * @type {Boolean}
	 */

	get manualDoF() {

		return this.defines.has("MANUAL_DOF");

	}

	/**
	 * Enables or disables manual Depth of Field.
	 *
	 * You'll need to call {@link EffectPass#recompile} after changing this value.
	 *
	 * @type {Boolean}
	 */

	set manualDoF(value) {

		if(value) {

			this.defines.set("MANUAL_DOF", "1");
			this.uniforms.set("dof", new Uniform(new Vector4(0.2, 1.0, 0.2, 2.0)));

		} else {

			this.defines.delete("MANUAL_DOF");
			this.uniforms.delete("dof");

		}

	}

	/**
	 * Indicates whether the blur shape should be pentagonal.
	 *
	 * @type {Boolean}
	 */

	get pentagon() {

		return this.defines.has("PENTAGON");

	}

	/**
	 * Enables or disables pentagonal blur.
	 *
	 * You'll need to call {@link EffectPass#recompile} after changing this value.
	 *
	 * @type {Boolean}
	 */

	set pentagon(value) {

		value ? this.defines.set("PENTAGON", "1") : this.defines.delete("PENTAGON");

	}

}
