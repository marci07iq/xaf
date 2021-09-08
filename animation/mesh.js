import { Element, ElementFactory } from './element.js';
//import * as Utils from '../utils/utils.js'
import { TransitionFactory } from './transition.js';

export class MeshElement extends Element {
    constructor(parent, time, filename, motion) {
        super(parent, time);
        this.filename = filename;
        this.motion = motion;
    }

    init() {
        return BABYLON.SceneLoader.ImportMeshAsync(
                "",
                this.filename,
                this.parent.scene)
            .then((newMeshes) => {
                this.mesh = newMeshes.meshes[0];
                this.mesh.material = this.parent.material;
                this.mesh.parent = this.parent.node;
                this.updateMesh();
            });
    }

    update() {
        if (this.mesh != undefined) {
            let pos = this.motion.getPosition(this.local_progress);
            if (pos.show) {
                this.mesh.position = pos.pos;
                this.mesh.setEnabled(true);
            } else {
                this.mesh.setEnabled(false);
            }
        }
    }

    getFocus() {
        return {
            target: this.motion.getPosition(this.local_progress).pos
        };
    }
};

ElementFactory.registerFactory("MeshElement", (ctx, data) => {

    let motion = (data.motion != undefined) ?
        TransitionFactory.useFactory(data.motion.type, [data.motion]) :
        TransitionFactory.useFactory("TransitionStatic", [{}]);
    let elem = new MeshElement(ctx, data.time, data.filename, motion);
    return elem.init();
});