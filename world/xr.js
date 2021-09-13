import * as UI from "../ui/ui.js";

async function attachMotionController(ctx, controller) {
    //Turn controller into motionController
    controller.onMotionControllerInitObservable.add((motionController) => {
        //Wait for mesh. Controller is fully loaded now
        if (motionController.handedness == "right") {
            motionController.onModelLoadedObservable.add((model) => {
                let lastpos = undefined;

                ctx.scene.registerBeforeRender(() => {
                    lastpos = controller.grip._position;
                    ctx.objects.forEach((obj) => {
                        obj.onMotionControllerMove(lastpos);
                    });
                });

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

                let playButton = motionController.getComponent("a-button");

                playButton.onButtonStateChangedObservable.add(() => {
                    if (playButton.pressed) {
                        ctx.slider.setPlaying(true);
                    }
                });

                let pauseButton = motionController.getComponent("b-button");

                pauseButton.onButtonStateChangedObservable.add(() => {
                    if (pauseButton.pressed) {
                        ctx.slider.setPlaying(false);
                    }
                });
            });

            controller.onDisposeObservable.add(() => {
                ctx.objects.forEach((obj) => {
                    obj.onGrab(undefined);
                });
            });
        }
    });


}

export async function initXR(ctx) {
    console.log("Attempting to load XR");
    // XR
    try {
        new WebXRPolyfill();
        let xrHelper = await ctx.scene.createDefaultXRExperienceAsync({
            floorMeshes: [ctx.ground]
        });

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