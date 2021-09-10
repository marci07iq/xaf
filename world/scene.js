import * as UI from '../ui/ui.js';

export function initScene(ctx) {
	// This creates and positions a free camera (non-mesh)
	let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 0.5), ctx.scene);
	camera.minZ = 1e-3;
	camera.speed = 0.01;
	// This targets the camera to scene origin
	camera.position = new BABYLON.Vector3(1, 2.5, 1);
	camera.setTarget(new BABYLON.Vector3(0, 1.5, 0));

	ctx.camera = camera;

	let speed_hwnd = UI.GUI.addElem({
		type: "slider",
		min: 1e-3,
		max: 0.01,
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