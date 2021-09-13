import * as Engine from "./engine.js";
import * as Scene from "./scene.js";
import * as XR from "./xr.js";
import * as Animation from '../animation/animation.js';
import * as UI from '../ui/ui.js';
import * as Utils from '../utils/utils.js';

export { Engine, Scene, XR };

export let context = {};

export async function initWorld(canvas_elem, ui_div, blocker_div, load_config, sceneLoader) {
    let engine = await Engine.initEngine(canvas_elem);
    context.canvas = engine.canvas;
    context.engine = engine.engine;
    context.scene = engine.scene;
    context.objects = [];

    BABYLON.OBJFileLoader.SKIP_MATERIALS = true;

    UI.GUI.init(ui_div, context.scene);

    //This will create objects
    let scene = await Scene.initScene(context);
    context.camera = scene.camera;
    context.ground = scene.ground;

    if (location.hash == "#xr") {
        let xr = await XR.initXR(context);
        context.xrHelper = xr.xrHelper;
    }

    await UI.Blocker.init(blocker_div, load_config.delayed);

    await sceneLoader();
    UI.Blocker.loadingEnd(load_config.message)
}

export function addObjects(new_objects) {
    context.objects.push(...new_objects);
}

export async function loadManifest(src) {
    return Utils.Loader.loadTextfile(src).then((data) => {
            let json = JSON.parse(data);

            let time = json.time;

            let root_folder = json.root_folder;

            //Load models
            return Promise.all(json.objects.map((object) => {
                //Load materials
                let materials = {};
                Utils.forEachDict(object.materials, (k, v) => {
                    let mat = new BABYLON.StandardMaterial("", context.scene);

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
                    return Animation.ElementFactory.useFactory(e.type, [{
                        node: node,
                        material: materials[e.material].material,
                        scene: context.scene,
                        root_folder: root_folder
                    }, e]);
                })).then((elems) => {
                    return Promise.resolve(new Animation.AnimationObject(node, elems, materials));
                });
            })).then((objects) => {
                addObjects(objects);
                return Promise.resolve({
                    objects: objects,
                    time: time
                });
            });
        })
        .then((animation) => {
            context.slider = XAF.UI.GUI.initSlider(
                animation.time.min,
                animation.time.max,
                animation.time.max,
                animation.time.speed);
            context.slider.onValue.push((v) => {
                animation.objects.forEach(obj => {
                    obj.setProgress(v);
                });
            });
            return Promise.resolve(animation);
        });
}