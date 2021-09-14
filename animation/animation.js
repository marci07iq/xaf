export * from './element.js';
export * from './line.js';
export * from './mesh.js';

import * as Focus from './focus.js';
export { Focus };

import * as Utils from "../utils/utils.js";
import { context } from '../world/world.js';

export class AnimationObject {
    constructor(node, elems, materials) {
        this.node = node;
        this.elems = elems;
        this.materials = materials;
        this.grabable = false;

        this.follow_camera = false;
        this.show_arrow = false;

        this.arrow_pool = [];
    }

    setProgress(progress) {
        this.elems.forEach((e) => {
            e.setProgress(progress);
        });

        if (this.follow_camera) {
            Focus.simpleCameraFollow(this, context.camera);
        }
        if (this.show_arrow) {
            Focus.simpleFocusArrows(this, context.scene, this.materials["focus_arrow"]);

        }
    }

    setGrabable(grabable) {
        this.grabable = grabable;

        Utils.forEachDict(this.materials, (k, v) => {
            v.mat.diffuseColor = this.grabable ? v.color_select : context.color;
        });
    }

    onMotionControllerMove(position) {
        this.setGrabable(this.mesh.getBoundingInfo().intersectsPoint(position));
    }

    onGrab(parent) {
        this.node.setParent(parent);
    }
};