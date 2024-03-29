import * as UI from '../ui/ui.js';

export async function initEngine(canvas) {
    //Start engine
    let engine = new BABYLON.Engine(
        canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            disableWebGL2Support: false
        });
    if (!engine) throw 'engine should not be null.';

    //Resize handler
    window.addEventListener("resize", function() {
        engine.resize();
    });

    // This creates a basic Babylon Scene object (non-mesh)
    let scene = new BABYLON.Scene(engine);

    //Allow custom camera controls to attach
    scene.preventDefaultOnPointerDown = false;
    //Dont run meshpicker on each mouse move. Massive performance bonus on weak machines
    scene.detachControl(canvas);
    //This messes with tabindex. Needed to get key inputs to work
    canvas.tabindex = 1;

    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogStart = 3;
    scene.fogEnd = 15;
    scene.fogColor = scene.clearColor;


    engine.runRenderLoop(function() {
        if (scene && scene.activeCamera) {
            scene.render();
        }
    });

    return {
        engine: engine,
        scene: scene,
        canvas: canvas
    };
};