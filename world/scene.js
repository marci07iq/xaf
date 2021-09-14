import * as UI from '../ui/ui.js';

export function initScene(ctx) {
    // This creates and positions a free camera (non-mesh)
    let camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, 0), ctx.scene);
    camera.minZ = 1e-4;
    camera.maxZ = 1e2;
    camera.speed = 0.01;
    // This targets the camera to scene origin
    camera.position = new BABYLON.Vector3(1, 2.5, 1);
    camera.setTarget(new BABYLON.Vector3(0, 1.5, 0));

    camera.keysUp = []; //w
    camera.keysUpward = []; //space
    camera.keysDown = []; //s
    camera.keysDownward = []; //shift

    camera.keysLeft = []; //a
    camera.keysRight = []; //d
    camera.keysLeftRotate = []; //q
    camera.keysRotateRight = []; //e


    (() => {
        let state = [false, false, false, false, false, false]; //wasd ud

        ctx.canvas.addEventListener('keydown', (event) => {
            switch (event.code) {
                case "KeyW":
                    state[0] = true;
                    break;
                case "KeyA":
                    state[1] = true;
                    break;
                case "KeyS":
                    state[2] = true;
                    break;
                case "KeyD":
                    state[3] = true;
                    break;
                case "Space":
                    state[4] = true;
                    break;
                case "ShiftLeft":
                    state[5] = true;
                    break;
            }
        }, false);
        ctx.canvas.addEventListener('keyup', (event) => {
            switch (event.code) {
                case "KeyW":
                    state[0] = false;
                    break;
                case "KeyA":
                    state[1] = false;
                    break;
                case "KeyS":
                    state[2] = false;
                    break;
                case "KeyD":
                    state[3] = false;
                    break;
                case "Space":
                    state[4] = false;
                    break;
                case "ShiftLeft":
                    state[5] = false;
                    break;
            }
        }, false);
        let stopMoving = () => {
            state[0] = false;
            state[1] = false;
            state[2] = false;
            state[3] = false;
            state[4] = false;
            state[5] = false;
        }

        ctx.canvas.addEventListener('focusout', stopMoving, false);
        document.addEventListener('contextmenu', stopMoving, false);


        ctx.scene.registerBeforeRender(() => {
            //Fix camera direction
            let forward = camera.getTarget().subtract(camera.position).normalize();
            forward.y = 0;

            let move_up = new BABYLON.Vector3(0, 1, 0);
            let right = BABYLON.Vector3.Cross(forward, move_up).normalize();

            camera.upVector = BABYLON.Vector3.Cross(right, forward).normalize();

            if (state[0]) {
                camera.position.addInPlace(forward.scale(camera.speed));
            }
            if (state[1]) {
                camera.position.addInPlace(right.scale(camera.speed));
            }
            if (state[2]) {
                camera.position.addInPlace(forward.scale(-camera.speed));
            }
            if (state[3]) {
                camera.position.addInPlace(right.scale(-camera.speed));
            }
            if (state[4]) {
                camera.position.addInPlace(move_up.scale(camera.speed));
            }
            if (state[5]) {
                camera.position.addInPlace(move_up.scale(-camera.speed));
            }

            camera.position.y = Math.max(camera.position.y, .001);
        });
    })();

    ctx.camera = camera;

    let speed_hwnd = UI.GUI.addElem({
        type: "slider",
        min: 1e-3,
        max: 0.1,
        name: "Camera speed"
    }, (v) => {
        camera.speed = v;
    });

    //Camera speed changable
    document.addEventListener('wheel', (evt) => {
        //evt.preventDefault();
        let mult = Math.pow(0.999, evt.deltaY);
        //console.log(mult);
        speed_hwnd.setValue(speed_hwnd.getValue() * mult);
    });


    /*document.getElementById("ui-input-movementspeed").oninput = () => {
    		setCameraSpeed(null, camera);
    };*/

    // This attaches the camera to the canvas
    camera.attachControl(ctx.canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    //let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    let light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(3, 2, 1), ctx.scene);
    light = new BABYLON.DirectionalLight("DirectionalLight2", new BABYLON.Vector3(-3, -2, -1), ctx.scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    let environment = ctx.scene.createDefaultEnvironment({ createGround: false, skyboxSize: 1000 });
    environment.setMainColor(BABYLON.Color3.FromHexString("#74b9ff"));

    let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, ctx.scene);
    ground.material = new BABYLON.GridMaterial("mat_ground", ctx.scene);
    ground.material.gridRatio = 0.1;
    ground.material.majorUnitFrequency = 10;

    ctx.ground = ground;

    return ctx;
};