export * from './element.js';
export * from './line.js';
export * from './mesh.js';

import * as Utils from "../utils/utils.js";

class AnimationObject {
    constructor(elems, materials) {
        this.elems = elems;
        this.materials = materials;
    }

    setProgress(progress) {
        this.elems.forEach((e) => {
            e.setProgress(progress);
        })
    }
};

export function loadManifest(ctx, src) {
    return Utils.Loader.loadTextfile(src).then((data) => {
        let json = JSON.parse(data);

        let time = json.time;

        //Load models
        return Promise.all(json.objects.map((object) => {
            //Load materials
            let materials = {};
            Utils.forEachDict(object.materials, (k, v) => {
                let mat = new BABYLON.StandardMaterial("", ctx.scene);

                let color = new BABYLON.Color3(v.color.r, v.color.g, v.color.b);
                let color_select =
                    (v.color_select != undefined) ?
                    new BABYLON.Color3(v.color_select.r, v.color_select.g, v.color_select.b) :
                    color;

                mat.alpha = 1.0;
                mat.diffuseColor = color;
                mat.backFaceCulling = false;
                materials[k] = {
                    material: mat,
                    color: color,
                    color_select: color_select
                };
            });

            //Object
            let node = new BABYLON.TransformNode();
            return Promise.all(object.elems.map((e) => {
                return ElementFactory.useFactory(e.type, [{
                    node: node,
                    material: materials[e.material].material,
                    scene: ctx.scene
                }, e])
            })).then((elems) => {
                return Promise.resolve(new AnimationObject(elems, materials));
            });
        })).then((objects) => {
            return Promise.resolve({
                objects: objects,
                time: time
            });
        });
    })
}