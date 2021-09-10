export * from './element.js';
export * from './line.js';
export * from './mesh.js';

import * as Utils from "../utils/utils.js";
import { context } from '../world/world.js';

export class AnimationObject {
	constructor(node, elems, materials) {
		this.node = node;
		this.elems = elems;
		this.materials = materials;
		this.grabable = false;
	}

	setProgress(progress) {
		this.elems.forEach((e) => {
			e.setProgress(progress);
		})
	}

	setGrabable(grabable) {
		this.grabable = grabable;

		Utils.forEachDict(this.materials, (k, v) => {
			v.mat.diffuseColor = this.grabable ? v.color_select : context.color;
		});
	}

	onMotionControllerMove(position) {
		setGrabable(this.mesh.getBoundingInfo().intersectsPoint(position));
	}

	onGrab(parent) {
		
	}
};