import { PerspectiveCamera, ShaderMaterial, Uniform } from "three";

const fragment = "#include <packing>\n#include <clipping_planes_pars_fragment>\n\nuniform sampler2D depthBuffer;\nuniform float cameraNear;\nuniform float cameraFar;\n\nvarying float vViewZ;\nvarying vec4 vProjTexCoord;\n\nvoid main() {\n\n\t#include <clipping_planes_fragment>\n\n\t// Transform into Cartesian coordinate (not mirrored).\n\tvec2 projTexCoord = (vProjTexCoord.xy / vProjTexCoord.w) * 0.5 + 0.5;\n\tprojTexCoord = clamp(projTexCoord, 0.002, 0.998);\n\n\tfloat fragCoordZ = unpackRGBAToDepth(texture2D(depthBuffer, projTexCoord));\n\n\t#ifdef PERSPECTIVE_CAMERA\n\n\t\tfloat viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);\n\n\t#else\n\n\t\tfloat viewZ = orthographicDepthToViewZ(fragCoordZ, cameraNear, cameraFar);\n\n\t#endif\n\n\tfloat depthTest = (-vViewZ > -viewZ) ? 1.0 : 0.0;\n\n\tgl_FragColor.rgb = vec3(0.0, depthTest, 1.0);\n\n}\n";
const vertex = "#include <common>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nvarying float vViewZ;\nvarying vec4 vProjTexCoord;\n\nvoid main() {\n\n\t#include <skinbase_vertex>\n\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <project_vertex>\n\n\tvViewZ = mvPosition.z;\n\tvProjTexCoord = gl_Position;\n\n\t#include <clipping_planes_vertex>\n\n}\n";

/**
 * A depth comparison shader material.
 */

export class DepthComparisonMaterial extends ShaderMaterial {

	/**
	 * Constructs a new depth comparison material.
	 *
	 * @param {Texture} [depthTexture=null] - A depth texture.
	 * @param {PerspectiveCamera} [camera] - A camera.
	 */

	constructor(depthTexture = null, camera) {

		super({

			type: "DepthComparisonMaterial",

			uniforms: {

				depthBuffer: new Uniform(depthTexture),
				cameraNear: new Uniform(0.3),
				cameraFar: new Uniform(1000)

			},

			fragmentShader: fragment,
			vertexShader: vertex,

			depthWrite: false,
			depthTest: false,

			morphTargets: true,
			skinning: true

		});

		this.adoptCameraSettings(camera);

	}

	/**
	 * Adopts the settings of the given camera.
	 *
	 * @param {Camera} [camera=null] - A camera.
	 */

	adoptCameraSettings(camera = null) {

		if(camera !== null) {

			this.uniforms.cameraNear.value = camera.near;
			this.uniforms.cameraFar.value = camera.far;

			if(camera instanceof PerspectiveCamera) {

				this.defines.PERSPECTIVE_CAMERA = "1";

			} else {

				delete this.defines.PERSPECTIVE_CAMERA;

			}

		}

	}

}
