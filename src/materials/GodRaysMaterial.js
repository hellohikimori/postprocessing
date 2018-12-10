import { ShaderMaterial, Uniform, Vector2 } from "three";

const fragment = "#include <common>\n#include <dithering_pars_fragment>\n\nuniform sampler2D inputBuffer;\nuniform vec2 lightPosition;\nuniform float exposure;\nuniform float decay;\nuniform float density;\nuniform float weight;\nuniform float clampMax;\n\nvarying vec2 vUv;\n\nvoid main() {\n\n\tvec2 coord = vUv;\n\n\t// Calculate the vector from this pixel to the light position in screen space.\n\tvec2 delta = coord - lightPosition;\n\tdelta *= 1.0 / SAMPLES_FLOAT * density;\n\n\t// A decreasing illumination factor.\n\tfloat illuminationDecay = 1.0;\n\n\tvec4 sample;\n\tvec4 color = vec4(0.0);\n\n\t/* Estimate the probability of occlusion at each pixel by summing samples\n\talong a ray to the light position. */\n\tfor(int i = 0; i < SAMPLES_INT; ++i) {\n\n\t\tcoord -= delta;\n\t\tsample = texture2D(inputBuffer, coord);\n\n\t\t// Apply the sample attenuation scale/decay factors.\n\t\tsample *= illuminationDecay * weight;\n\t\tcolor += sample;\n\n\t\t// Update the exponential decay factor.\n\t\tilluminationDecay *= decay;\n\n\t}\n\n\tgl_FragColor = clamp(color * exposure, 0.0, clampMax);\n\n\t#include <dithering_fragment>\n\n}\n";
const vertex = "varying vec2 vUv;\n\nvoid main() {\n\n\tvUv = uv;\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\n}\n";

/**
 * A crepuscular rays shader material.
 *
 * This material supports dithering.
 *
 * References:
 *
 * Thibaut Despoulain, 2012:
 *  [(WebGL) Volumetric Light Approximation in Three.js](
 *  http://bkcore.com/blog/3d/webgl-three-js-volumetric-light-godrays.html)
 *
 * Nvidia, GPU Gems 3, 2008:
 *  [Chapter 13. Volumetric Light Scattering as a Post-Process](
 *  https://developer.nvidia.com/gpugems/GPUGems3/gpugems3_ch13.html)
 */

export class GodRaysMaterial extends ShaderMaterial {

	/**
	 * Constructs a new god rays material.
	 *
	 * @param {Vector2} [lightPosition] - The light position in screen space.
	 * @param {Object} [options] - The options.
	 * @param {Number} [options.density=0.96] - The density of the light rays.
	 * @param {Number} [options.decay=0.93] - An illumination decay factor.
	 * @param {Number} [options.weight=0.4] - A light ray weight factor.
	 * @param {Number} [options.exposure=0.6] - A constant attenuation coefficient.
	 * @param {Number} [options.clampMax=1.0] - An upper bound for the saturation of the overall effect.
	 */

	constructor(lightPosition = new Vector2(), options = {}) {

		const settings = Object.assign({
			exposure: 0.6,
			density: 0.93,
			decay: 0.96,
			weight: 0.4,
			clampMax: 1.0
		}, options);

		super({

			type: "GodRaysMaterial",

			defines: {

				SAMPLES_INT: "60",
				SAMPLES_FLOAT: "60.0"

			},

			uniforms: {

				inputBuffer: new Uniform(null),
				lightPosition: new Uniform(lightPosition),

				exposure: new Uniform(settings.exposure),
				decay: new Uniform(settings.decay),
				density: new Uniform(settings.density),
				weight: new Uniform(settings.weight),
				clampMax: new Uniform(settings.clampMax)

			},

			fragmentShader: fragment,
			vertexShader: vertex,

			depthWrite: false,
			depthTest: false

		});

	}

	/**
	 * The amount of samples per pixel.
	 *
	 * @type {Number}
	 */

	get samples() {

		return Number.parseInt(this.defines.SAMPLES_INT);

	}

	/**
	 * Sets the amount of samples per pixel.
	 *
	 * @type {Number}
	 */

	set samples(value) {

		value = Math.floor(value);

		this.defines.SAMPLES_INT = value.toFixed(0);
		this.defines.SAMPLES_FLOAT = value.toFixed(1);
		this.needsUpdate = true;

	}

}
