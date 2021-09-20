import * as Utils from "../utils/utils.js";

/*export function findFocusProperties(object) {
    let focii = [];
    object.elems.forEach(elem => {
        if (!elem.oub) {
            focii.push(elem.getFocus());

        }
    });
    return focii;
}

export function findFocusArrows(object) {
    let arrows = [];
    findFocusProperties(object).forEach((focus) => {
        if (focus.direction != undefined) {
            arrows.push({
                point_to: Utils.Geometry.add(
                    focus.target,
                    focus.direction,
                    Utils.getDefault(focus.offset, 0)),
                point_dir: focus.direction
            })
        }
    });
    return arrows;
}

export function simpleFocusArrows(object, scene, material) {
    let arrows = object.findFocusArrows();

    //Expand pool
    while (object.arrow_pool.length < arrows.length) {
        object.arrow_pool.push(Utils.Geometry.createArrow(scene, material, 0.1));
    }

    for (let i = 0; i < object.arrow_pool.length; i++) {
        object.arrow_pool[i].parent = object.node;
        if (i < arrows.length) {
            Utils.Geometry.setTransformationNode(
                object.arrow_pool[i],
                Utils.Geometry.createVector(arrows[i].point_to),
                Utils.Geometry.createVector(arrows[i].point_dir));
            object.arrow_pool[i].setEnabled(true);
        } else {
            object.arrow_pool[i].setEnabled(false);
        }
    }
}

export function simpleCameraFollow(object, camera) {
    let mat = object.node.getWorldMatrix();

    let pos_avg = [];
    let tgt_avg = [];
    let pos_avg_w = [];
    let tgt_avg_w = [];

    findFocusProperties(object).forEach((focus) => {
        if (focus.direction != undefined && focus.distance != undefined) {
            pos_avg.push(Utils.Geometry.add(
                focus.target,
                focus.direction,
                focus.distance));
            pos_avg_w.push(focus.weight);
        }
        tgt_avg.push(focus.target);
        tgt_avg_w.push(focus.weight);
    });

    pos_avg = Utils.Geometry.average(pos_avg, pos_avg_w);
    if (pos_avg != undefined) {
        camera.position = BABYLON.Vector3.TransformCoordinates(
            Utils.Geometry.createVector(pos_avg), mat);
    }

    tgt_avg = Utils.Geometry.average(tgt_avg, tgt_avg_w);
    console.log(tgt_avg);
    if (tgt_avg != undefined) {
        camera.setTarget(BABYLON.Vector3.TransformCoordinates(
            Utils.Geometry.createVector(tgt_avg), mat));
    }
}*/