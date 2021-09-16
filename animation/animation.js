export * from './element.js';
export * from './line.js';
export * from './mesh.js';

import * as Focus from './focus.js';
export { Focus };

import * as Utils from "../utils/utils.js";
import { context } from '../world/world.js';

export class AnimationObject {
    constructor(node, elems, materials, boundry) {
        this.node = node;
        this.elems = elems;
        this.materials = materials;
        this.grabable = false;

        this.follow_camera = false;
        this.show_arrow = false;

        this.arrow_pool = [];

        this.local_bounding_box = new BABYLON.BoundingBox(
            Utils.Geometry.createVector(boundry[0]),
            Utils.Geometry.createVector(boundry[1]));
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
        let newly = grabable && (!this.grabable);
        this.grabable = grabable;

        Utils.forEachDict(this.materials, (k, v) => {
            v.material.diffuseColor = this.grabable ? v.color_select : v.color;
        });
        return newly;
    }

    onMotionControllerMove(position) {
        let mat = this.node.getWorldMatrix().clone().invert();

        let localPos = BABYLON.Vector3.TransformCoordinates(position, mat);

        return this.setGrabable(this.local_bounding_box.intersectsPoint(localPos));
    }

    onGrab(parent) {
        if (this.grabable) {
            this.node.setParent(parent);
        } else {
            this.node.setParent(undefined);
        }
    }
};