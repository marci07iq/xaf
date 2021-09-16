import * as UI from "../ui/ui.js";

class CameraController {
    constructor(ctx, keys, name) {
        this.ctx = ctx
        this.active = false;

        this.keys = keys;
        this.keys_down = this.keys.map(v => false);

        this.enable_button_hwnd = XAF.UI.GUI.addElem({
            "type": "button",
            "name": name
        }, () => { ctx.controller.enable_controller_obj(this); });
    }

    //Plugin activated
    onActivate() {
        this.active = true;
        this.enable_button_hwnd.setVisible(false);
    }

    onDeactivate() {
        this.onHalt();
        this.active = false;
        this.enable_button_hwnd.setVisible(true);
    }

    onKeyDown(code) {
        let pos = this.keys.indexOf(code);
        if (pos > -1) {
            this.keys_down[pos] = true;
        }
    }

    //Context menu triggererd / focus lost
    onHalt() {
        this.keys_down.forEach((v, idx) => this.keys_down[idx] = false);
    }

    onKeyUp(code) {
        let pos = this.keys.indexOf(code);
        if (pos > -1) {
            this.keys_down[pos] = false;
        }
    }

    onMouseDown(position, type) {

    }

    onMouseDrag(position, type, offset) {

    }

    onMouseUp() {

    }

    onMouseWheel(delta) {

    }

    onFrame(delta_t) {

    }
}

class FirstPersonViewCameraController extends CameraController {
    constructor(ctx) {
        super(ctx, ["KeyW", "KeyA", "KeyS", "KeyD", "Space", "ShiftLeft"], "First person view");

        //Attach UI
        this.speed = 1;
        this.speed_ui = UI.GUI.addElem({
            type: "slider",
            min: 1e-1,
            max: 10,
            name: "Camera speed"
        }, (v) => {
            this.speed = v;
        });
        this.speed_ui.setValue(this.speed);
    }

    onActivate() {
        super.onActivate();

        this.speed_ui.setVisible(true);
    }

    onDeactivate() {
        super.onDeactivate();

        this.speed_ui.setVisible(false);
    }

    onMouseWheel(delta) {
        let mult = Math.pow(0.999, delta);
        //console.log(mult);
        this.speed_ui.setValue(this.speed_ui.getValue() * mult);
    }

    onFrame(delta_t) {
        //Fix camera direction
        let forward = this.ctx.camera.getTarget().subtract(this.ctx.camera.position).normalize();
        forward.y = 0;

        let move_up = new BABYLON.Vector3(0, 1, 0);
        let right = BABYLON.Vector3.Cross(forward, move_up).normalize();

        this.ctx.camera.upVector = BABYLON.Vector3.Cross(right, forward).normalize();

        let target_move = delta_t * this.speed;

        if (this.keys_down[0]) {
            this.ctx.camera.position.addInPlace(forward.scale(target_move));
        }
        if (this.keys_down[1]) {
            this.ctx.camera.position.addInPlace(right.scale(target_move));
        }
        if (this.keys_down[2]) {
            this.ctx.camera.position.addInPlace(forward.scale(-target_move));
        }
        if (this.keys_down[3]) {
            this.ctx.camera.position.addInPlace(right.scale(-target_move));
        }
        if (this.keys_down[4]) {
            this.ctx.camera.position.addInPlace(move_up.scale(target_move));
        }
        if (this.keys_down[5]) {
            this.ctx.camera.position.addInPlace(move_up.scale(-target_move));
        }

        this.ctx.camera.position.y = Math.max(this.ctx.camera.position.y, .001);
    }

    onMouseDrag(position, type, offset) {
        //Left drag
        if (type == 0) {
            let forward = this.ctx.camera.getTarget().subtract(this.ctx.camera.position).normalize();

            let theta = Math.acos(forward.y);
            let phi = Math.atan2(forward.z, forward.x);

            theta += offset[1] / 400.0;
            phi -= offset[0] / 400.0;

            theta = Math.min(Math.max(0.001, theta), 3.14);
            //phi = phi % (2*Math.PI);


            let new_forward = new BABYLON.Vector3(
                Math.sin(theta) * Math.cos(phi),
                Math.cos(theta),
                Math.sin(theta) * Math.sin(phi));

            let new_up = new BABYLON.Vector3(-Math.cos(theta) * Math.cos(phi),
                Math.sin(theta), -Math.cos(theta) * Math.sin(phi));

            this.ctx.camera.setTarget(new_forward.add(this.ctx.camera.position));
            this.ctx.camera.upVector.copyFrom(new_up);
        }
    }
}

class ThirdPersonViewCameraController extends CameraController {
    constructor(ctx) {
        super(ctx, [], "Third person view");

        this.radius = 1;
    }

    onActivate() {
        super.onActivate();
    }

    onDeactivate() {
        super.onDeactivate();
    }

    onMouseWheel(delta) {
        let mult = Math.pow(0.999, delta);
        //console.log(mult);
        let new_radius = Math.min(Math.max(1e-3, this.radius * mult), 5);



        let forward = this.ctx.camera.getTarget().subtract(this.ctx.camera.position).normalize();

        let center = this.ctx.camera.position.add(forward.scale(this.radius));

        this.ctx.camera.position.copyFrom(center.add(forward.scale(-new_radius)));
        this.ctx.camera.setTarget(center);

        this.radius = new_radius;
    }

    onFrame(delta_t) {

    }

    onMouseDrag(position, type, offset) {
        //Left drag (move)
        if (type == 0) {
            let forward = this.ctx.camera.getTarget().subtract(this.ctx.camera.position).normalize();

            let move_up = new BABYLON.Vector3(0, 1, 0);
            let right = BABYLON.Vector3.Cross(forward, move_up).normalize();

            let up = BABYLON.Vector3.Cross(right, forward).normalize();

            this.ctx.camera.position.addInPlace(up.scale(this.radius * offset[1] / this.ctx.canvas.height));
            this.ctx.camera.position.addInPlace(right.scale(this.radius * offset[0] / this.ctx.canvas.height));
        }

        //Right (rotate)
        if (type == 2) {
            let forward = this.ctx.camera.getTarget().subtract(this.ctx.camera.position).normalize();

            let theta = Math.acos(forward.y);
            let phi = Math.atan2(forward.z, forward.x);

            theta += offset[1] / 400.0;
            phi -= offset[0] / 400.0;

            theta = Math.min(Math.max(0.001, theta), 3.14);
            //phi = phi % (2*Math.PI);

            let center = this.ctx.camera.position.add(forward.scale(this.radius));

            let new_forward = new BABYLON.Vector3(
                Math.sin(theta) * Math.cos(phi),
                Math.cos(theta),
                Math.sin(theta) * Math.sin(phi));

            let new_up = new BABYLON.Vector3(-Math.cos(theta) * Math.cos(phi),
                Math.sin(theta), -Math.cos(theta) * Math.sin(phi));


            this.ctx.camera.position.copyFrom(center.add(new_forward.scale(-this.radius)));
            this.ctx.camera.setTarget(center);

            this.ctx.camera.upVector.copyFrom(new_up);
        }
    }
}

export function initCameraController(ctx) {
    let current_controller = undefined;

    document.addEventListener('wheel', (evt) => {
        if (current_controller != undefined) {
            current_controller.onMouseWheel(evt.deltaY);
        }
    });

    ctx.canvas.addEventListener('keydown', (evt) => {
        if (current_controller != undefined) {
            current_controller.onKeyDown(evt.code);
        }
    });


    document.addEventListener('keyup', (evt) => {
        if (current_controller != undefined) {
            current_controller.onKeyUp(evt.code);
        }
    });

    ctx.canvas.addEventListener('focusout', () => {
        if (current_controller != undefined) {
            current_controller.onHalt();
        }
    });
    document.addEventListener('focusout', () => {
        if (current_controller != undefined) {
            current_controller.onHalt();
        }
    });
    document.addEventListener('contextmenu', (e) => {
        if (current_controller != undefined) {
            current_controller.onHalt();
        }
        e.preventDefault();
        return false;
    });

    let last_pos = undefined;
    let last_button = -1;

    ctx.canvas.addEventListener('mousedown', e => {
        if (last_button == -1) {
            last_button = e.button;
        }
        if (current_controller != undefined) {
            last_pos = [e.clientX, e.clientY];
            current_controller.onMouseDown(last_pos, last_button);
        }
    });

    window.addEventListener('mousemove', e => {
        let new_pos = [e.clientX, e.clientY];
        if (current_controller != undefined && last_pos != undefined) {
            current_controller.onMouseDrag(new_pos, last_button, [new_pos[0] - last_pos[0], new_pos[1] - last_pos[1]]);
        }
        last_pos = new_pos;
    });

    window.addEventListener('mouseup', e => {
        if (last_button == e.button) {
            last_button = -1;
        }
        if (current_controller != undefined) {
            current_controller.onMouseUp();
        }
    });

    let last_time = performance.now();
    ctx.scene.registerBeforeRender(() => {
        let new_time = performance.now();
        if (current_controller != undefined) {
            current_controller.onFrame((new_time - last_time) / 1000);
        }
        last_time = new_time;
    });

    let controllers = {
        fpv: new FirstPersonViewCameraController(ctx),
        tpv: new ThirdPersonViewCameraController(ctx),
    };
    controllers.fpv.onDeactivate();
    controllers.tpv.onActivate();

    let enable_controller_name = (name) => {
        if (current_controller != undefined) {
            current_controller.onDeactivate();
        }
        current_controller = controllers[name];
        current_controller.onActivate();
    };

    let enable_controller_obj = (obj) => {
        if (current_controller != undefined) {
            current_controller.onDeactivate();
        }
        current_controller = obj;
        current_controller.onActivate();
    };

    return {
        enable_controller_name: enable_controller_name,
        enable_controller_obj: enable_controller_obj
    };
}