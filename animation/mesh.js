import * as Utils from '../utils/utils.js';
import { Element, ElementFactory } from './element.js';
//import * as Utils from '../utils/utils.js'
export class MeshElement extends Element {
    constructor(parent, motion, filename) {
        super(parent, motion);
        this.filename = filename;
    }

    init() {
        return this.parent.loader.loadMesh(this.filename,
                this.parent.scene)
            .then((newMeshes) => {
                if (newMeshes.meshes.length != 1) {
                    throw Exception("Broken meshes");
                }
                this.mesh = newMeshes.meshes[0];
                this.mesh.material = this.parent.material;
                this.mesh.parent = this.node;
                this.setTime(Infinity);
                return Promise.resolve();
            });
    }

    update(time) {
        if (this.mesh != undefined) {
            let pos = this.getMotionElem(time).getPosition(time);
            if (pos.show) {
                this.mesh.setEnabled(true);
            } else {
                this.mesh.setEnabled(false);
            }
        }
    }

    getFocus(time) {
        let motion = this.getMotionElem(time).getPosition(time);
        return {
            target: motion.pos,
            weight: motion.weight
        };
    }
};

ElementFactory.registerFactory("MeshElement", (ctx, data) => {

    let elem = new MeshElement(ctx, data.motion, data.filename);
    return elem.init().then(() => {
        return Promise.resolve(elem);
    });
});