import { Uniform, Vector2, Vector3 } from "three";
import { Effect } from "./Effect.js";

const fragment = "uniform bool active;\nuniform vec2 center;\nuniform float waveSize;\nuniform float radius;\nuniform float maxRadius;\nuniform float amplitude;\n\nvarying float vSize;\n\nvoid mainUv(inout vec2 uv) {\n\n\tif(active) {\n\n\t\tvec2 aspectCorrection = vec2(aspect, 1.0);\n\t\tvec2 difference = uv * aspectCorrection - center * aspectCorrection;\n\t\tfloat distance = sqrt(dot(difference, difference)) * vSize;\n\n\t\tif(distance > radius) {\n\n\t\t\tif(distance < radius + waveSize) {\n\n\t\t\t\tfloat angle = (distance - radius) * PI2 / waveSize;\n\t\t\t\tfloat cosSin = (1.0 - cos(angle)) * 0.5;\n\n\t\t\t\tfloat extent = maxRadius + waveSize;\n\t\t\t\tfloat decay = max(extent - distance * distance, 0.0) / extent;\n\n\t\t\t\tuv -= ((cosSin * amplitude * difference) / distance) * decay;\n\n\t\t\t}\n\n\t\t}\n\n\t}\n\n}\n";
const vertex = "uniform float size;\nuniform float cameraDistance;\n\nvarying float vSize;\n\nvoid mainSupport() {\n\n\tvSize = (0.1 * cameraDistance) / size;\n\n}\n";

/**
 * Half PI.
 *
 * @type {Number}
 * @private
 */

const HALF_PI = Math.PI * 0.5;

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const v = new Vector3();

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const ab = new Vector3();

/**
 * A shock wave effect.
 *
 * Based on a Gist by Jean-Philippe Sarda:
 *  https://gist.github.com/jpsarda/33cea67a9f2ecb0a0eda
 *
 * Warning: This effect cannot be merged with convolution effects.
 */

export class ShockWaveEffect extends Effect {

	/**
	 * Constructs a new shock wave effect.
	 *
	 * @param {Camera} camera - The main camera.
	 * @param {Vector3} [epicenter] - The world position of the shock wave epicenter.
	 * @param {Object} [options] - The options.
	 * @param {Number} [options.speed=2.0] - The animation speed.
	 * @param {Number} [options.maxRadius=1.0] - The extent of the shock wave.
	 * @param {Number} [options.waveSize=0.2] - The wave size.
	 * @param {Number} [options.amplitude=0.05] - The distortion amplitude.
	 */

	constructor(camera, epicenter = new Vector3(), options = {}) {

		const settings = Object.assign({
			speed: 2.0,
			maxRadius: 1.0,
			waveSize: 0.2,
			amplitude: 0.05
		}, options);

		super("ShockWaveEffect", fragment, {

			uniforms: new Map([
				["active", new Uniform(false)],
				["center", new Uniform(new Vector2(0.5, 0.5))],
				["cameraDistance", new Uniform(1.0)],
				["size", new Uniform(1.0)],
				["radius", new Uniform(-settings.waveSize)],
				["maxRadius", new Uniform(settings.maxRadius)],
				["waveSize", new Uniform(settings.waveSize)],
				["amplitude", new Uniform(settings.amplitude)]
			]),

			vertexShader: vertex

		});

		/**
		 * The main camera.
		 *
		 * @type {Camera}
		 */

		this.camera = camera;

		/**
		 * The epicenter.
		 *
		 * @type {Vector3}
		 * @example shockWavePass.epicenter = myMesh.position;
		 */

		this.epicenter = epicenter;

		/**
		 * The object position in screen space.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.screenPosition = this.uniforms.get("center").value;

		/**
		 * The speed of the shock wave animation.
		 *
		 * @type {Number}
		 */

		this.speed = settings.speed;

		/**
		 * A time accumulator.
		 *
		 * @type {Number}
		 * @private
		 */

		this.time = 0.0;

		/**
		 * Indicates whether the shock wave animation is active.
		 *
		 * @type {Boolean}
		 * @private
		 */

		this.active = false;

	}

	/**
	 * Emits the shock wave.
	 */

	explode() {

		this.time = 0.0;
		this.active = true;
		this.uniforms.get("active").value = true;

	}

	/**
	 * Updates this effect.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {Number} [delta] - The time between the last frame and the current one in seconds.
	 */

	update(renderer, inputBuffer, delta) {

		const epicenter = this.epicenter;
		const camera = this.camera;
		const uniforms = this.uniforms;

		let radius;

		if(this.active) {

			const waveSize = uniforms.get("waveSize").value;

			// Calculate direction vectors.
			camera.getWorldDirection(v);
			ab.copy(camera.position).sub(epicenter);

			// Don't render the effect if the object is behind the camera.
			if(v.angleTo(ab) > HALF_PI) {

				// Scale the effect based on distance to the object.
				uniforms.get("cameraDistance").value = camera.position.distanceTo(epicenter);

				// Calculate the screen position of the epicenter.
				v.copy(epicenter).project(camera);
				this.screenPosition.set((v.x + 1.0) * 0.5, (v.y + 1.0) * 0.5);

			}

			// Update the shock wave radius based on time.
			this.time += delta * this.speed;
			radius = this.time - waveSize;
			uniforms.get("radius").value = radius;

			if(radius >= (uniforms.get("maxRadius").value + waveSize) * 2.0) {

				this.active = false;
				uniforms.get("active").value = false;

			}


		}

	}

}
