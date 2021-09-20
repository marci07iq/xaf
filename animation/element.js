import * as Utils from "../utils/utils.js";

import { TransitionFactory, TransitionStatic } from './transition.js';

export class Element {
    constructor(parent, motion) {
        this.parent = parent;

        this.node = new BABYLON.TransformNode();
        this.node.parent = this.parent.node;

        //Turn single motion object to array
        if (motion != undefined) {
            if (!Array.isArray(motion)) {
                motion = [motion];
            }
        } else {
            motion = [];
        }

        if (motion.length == 0) {
            motion.push({
                type: "TransitionStatic",
                time: { min: 0, max: 1 }
            });
        }

        //Sort to be increasing in time min
        motion = motion.sort((firstEl, secondEl) => { return firstEl.time.min > secondEl.time.min });

        this.motion = motion.map(m => {
            return TransitionFactory.useFactory(m.type, [m]);
        });
    }

    //Called for async loading (put XHR requests here), return Promise
    init() {
        throw Error("overload");
    }

    setTime(time) {
        //Set position
        this.node.position = Utils.Geometry.createVector(this.getMotionElem(time).getPosition(time).pos);

        //And update mesh
        this.update(time);
    }

    update(time) {
        throw Error("overload");
    }

    //Query POI
    getMeshFocus(time) {
        throw Error("overload");
    }

    //Query POI
    getFocus(time) {
        let position = this.getMotionElem(time).getPosition(time);
        let mesh_focus = this.getMeshFocus(time);

        let res = {
            target: position.pos + mesh_focus.target,
            direction: mesh_focus.direction,
            distance: mesh_focus.distance,
            offset: mesh_focus.offset,
            weight: position.weight + mesh_focus.weight,
        };

        return res;
    }

    getMotionElem(time) {
        for (let i = this.motion.length - 1; i >= 0; i--) {
            let m = this.motion[i];
            if (m.time.min < time) {
                return m;
            }
        }
        return this.motion[0];
    }
};

export let ElementFactory = new Utils.FactoryRegistry();