import * as UI from "../ui/ui.js";

let right_thumbstick_axes = [0, 0];

async function attachMotionController(ctx, controller) {
    //Turn controller into motionController
    controller.onMotionControllerInitObservable.add((motionController) => {
        //Wait for mesh. Controller is fully loaded now

        if (motionController.handedness == "right") {
            motionController.onModelLoadedObservable.add((model) => {
                let lastpos = undefined;

                ctx.scene.registerBeforeRender(() => {
                    let vibrate = false;
                    lastpos = controller.grip._position;
                    ctx.objects.forEach((obj) => {
                        vibrate |= obj.onMotionControllerMove(lastpos);
                    });
                    if (vibrate) {
                        //Vibrate controller when entering new object. Usually doesnt work.
                        motionController.pulse(1, 100);
                    }
                });

                //Grab
                let grabComponent = motionController.getComponentOfType("squeeze");
                grabComponent.onButtonStateChangedObservable.add(() => {
                    if (grabComponent.pressed) {
                        ctx.objects.forEach((obj) => {
                            obj.onGrab(controller.grip);
                        });
                    } else {
                        ctx.objects.forEach((obj) => {
                            obj.onGrab(undefined);
                        });
                    }
                });


                //A: play/pause
                let playButton = motionController.getComponent("a-button");
                playButton.onButtonStateChangedObservable.add(() => {
                    if (playButton.pressed) {
                        ctx.slider.togglePlaying();
                    }
                });

                let thumbstickComponent = motionController.getComponent("xr-standard-thumbstick");
                thumbstickComponent.onButtonStateChangedObservable.add(() => {

                });
                thumbstickComponent.onAxisValueChangedObservable.add((axes) => {
                    right_thumbstick_axes = [axes.x, axes.y];
                });
            });

            controller.onDisposeObservable.add(() => {
                right_thumbstick_axes = [0, 0];

                ctx.objects.forEach((obj) => {
                    obj.onGrab(undefined);
                });
            });
        }


        if (motionController.handedness == "left") {
            //x: teleport user home
            let resetUserButton = motionController.getComponent("x-button");
            resetUserButton.onButtonStateChangedObservable.add(() => {
                if (resetUserButton.pressed) {
                    ctx.xrHelper.baseExperience.camera.position.x = 0;
                    ctx.xrHelper.baseExperience.camera.position.z = 0;
                }
            });

            //y: teleport objects home
            let resetSceneButton = motionController.getComponent("y-button");
            resetSceneButton.onButtonStateChangedObservable.add(() => {
                if (resetSceneButton.pressed) {
                    ctx.objects.forEach((obj) => {
                        obj.node.position.x = 0;
                        obj.node.position.y = 1.5;
                        obj.node.position.z = 0;
                    });
                }
            });
        }
    });


}

export async function initXR(ctx) {
    console.log("Attempting to load XR");
    // XR
    try {
        //new WebXRPolyfill();
        let xrHelper = await ctx.scene.createDefaultXRExperienceAsync({
            floorMeshes: [ctx.ground],
            disableTeleportation: true
        });
        //xrHelper.teleportation.detach();
        xrHelper.pointerSelection.detach();

        //xrHelper.baseExperience.enableSpectatorMode();

        xrHelper.input.onControllerAddedObservable.add((controller) => {
            if (controller.grip) {
                attachMotionController(ctx, controller);
            }
        });

        xrHelper.baseExperience.onStateChangedObservable.add((state) => {
            //
            console.log(state);
            if (state == BABYLON.WebXRState.IN_XR) {
                UI.GUI.toggleXR(true);
            }

            if (state == BABYLON.WebXRState.NOT_IN_XR) {
                UI.GUI.toggleXR(false);
            }
        });

        let last_frame_time = performance.now();
        ctx.scene.registerBeforeRender(() => {
            let new_frame_time = performance.now();
            if (ctx.slider != undefined) {
                let elapsed = new_frame_time - last_frame_time;
                ctx.slider.setProgressRelative((0.3 * right_thumbstick_axes[0] + 4 * Math.abs(right_thumbstick_axes[0]) * right_thumbstick_axes[0]) * (elapsed / 1000.0));
            }
            last_frame_time = new_frame_time;
        });

        return {
            xrHelper: xrHelper
        };
    } catch (e) {
        // no XR support
        console.error(e);
        console.log("XR mode failed");
    }

    return {
        xrHelper: undefined
    };
}