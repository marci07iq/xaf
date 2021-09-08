import * as Scene from './scene/scene.js';
import * as Utils from './utils/utils.js';
import * as UI from './ui/ui.js';
import * as Animation from './animation/animation.js';

export { Scene, Utils, UI, Animation };

export function init(config, sceneLoader) {
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            let script = document.createElement('script');
            script.onload = () => {
                resolve();
            };
            script.onerror = () => {
                reject();
            };
            script.src = src;

            document.head.appendChild(script); //or something of the likes
        });
    }

    function loadCSS(src) {
        return new Promise((resolve, reject) => {
            let elem = Utils.createElem("link", [], { rel: "stylesheet" });
            elem.onload = () => {
                resolve();
            };
            elem.onerror = () => {
                reject();
            };
            elem.href = src;

            document.head.appendChild(elem); //or something of the likes
        });
    }


    let canvas;
    let ui_div;
    let blocker;
    document.body.appendChild(Utils.createElem("div", ["xaf-main"], {}, "", [
        canvas = Utils.createElem("canvas", ["xaf-canvas"], {}, "", []),
        ui_div = Utils.createElem("div", ["xaf-ui"], {}, "", []),
    ]));

    document.body.appendChild(blocker = Utils.createElem("div", ["xaf-blocker", "noselect"], {}, "", []));

    Scene.startEngine(canvas)
        .then(ctx => {
            UI.GUI.init(ui_div, ctx.scene);
            return Scene.setupEnvironment(ctx);
        })
        .then(ctx => {
            return UI.Blocker.init(blocker, config.delayed)
                .then(() => {
                    return sceneLoader(ctx);
                });
        }).then(() => {
            UI.Blocker.loadingEnd(config.message)
        });

};