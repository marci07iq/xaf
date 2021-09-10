import { Element, ElementFactory } from './element.js';
import * as Utils from '../utils/utils.js'

export class LineElement extends Element {
	constructor(parent, time, radius) {
		super(parent, time);
		this.radius = radius;
	}

	initMesh() {
		this.length = Utils.Geometry.pathLength(this.keyframes);

		let path = Utils.Geometry.createPath(this.keyframes, 1);
		this.mesh1 = BABYLON.Mesh.CreateTube("tube", path, this.radius, 16, null, BABYLON.CAP_ALL, this.parent.scene, false);
		this.mesh1.material = this.parent.material;
		this.mesh1.parent = this.parent.node;
		this.updateMesh();
		return Promise.resolve();
	}

	updateMesh() {
		//Delete temp mesh
		if (this.meshx != undefined) {
			this.meshx.dispose();
			this.meshx = undefined;
		}

		//Incomplete
		if (this.local_progress < 1) {
			//Hide full
			if (this.mesh1 != undefined) {
				this.mesh1.setEnabled(false);
			}

			//Create temp
			if (this.local_progress > 0) {
				let path = Utils.Geometry.createPath(this.keyframes, this.local_progress);
				this.meshx = BABYLON.Mesh.CreateTube("tube", path, this.radius, 16, null, BABYLON.CAP_ALL, this.parent.scene, false);
				this.meshx.material = this.parent.material;
				this.meshx.parent = this.parent.node;
			}
		} else {
			//Full
			if (this.mesh1 != undefined) {
				//Enable
				this.mesh1.setEnabled(true);
			}
		}
	}

	update() {
		this.updateMesh();
	}

	getFocus() {
		let key_id = 1 + Math.floor((this.keyframes.length - 1) * this.local_progress); //1..length
		let last_frame_partial = (this.local_progress - (key_id - 1) * 1.0 / (this.keyframes.length - 1)) / ((1.0 / (this.keyframes.length - 1)));

		let end_position = (key_id < this.keyframes.length) ?
			Utils.Geometry.lerp(
				this.keyframes[key_id - 1],
				this.keyframes[key_id],
				last_frame_partial
			) :
			this.keyframes[this.keyframes.length - 1];

		return {
			target: [end_position[0], end_position[1], end_position[2]],
			direction: [end_position[6], end_position[7], end_position[8]],
			distance: this.length * (1.2 - Math.cos(local_progress * Math.PI)) / 2
		};
	}
};

export class CurvedLineElement extends LineElement {
	constructor(parent, time, radius, filename) {
		super(parent, time, radius);

		this.filename = filename;
	}

	init() {
		return Utils.Loader.loadKeyframes(this.filename).then((keyframes) => {
			this.keyframes = keyframes;
			return this.initMesh();
		});

	}
};

ElementFactory.registerFactory("CurvedLineElement", (ctx, data) => {
	let elem = new CurvedLineElement(ctx, data.time, data.radius, ctx.root_folder + data.filename);
	return elem.init().then(() => {
		return Promise.resolve(elem);
	});
});

export class BridgeLineElement extends LineElement {
	constructor(parent, time, radius, from_name, to_name) {
		super(parent, time, radius);

		this.from_name = from_name;
		this.to_name = to_name;
	}

	init() {
		return Promise.all([
			Utils.Loader.loadKeyframes(this.from_name),
			Utils.Loader.loadKeyframes(this.to_name)
		]).then((values) => {
			this.keyframes = [
				values[0][values[0].length - 1],
				values[1][0]
			];
			return this.initMesh();
		})
	}
};

ElementFactory.registerFactory("BridgeLineElement", (ctx, data) => {
	let elem = new BridgeLineElement(ctx, data.time, data.radius, ctx.root_folder + data.filename_f, ctx.root_folder + data.filename_t);
	return elem.init().then(() => {
		return Promise.resolve(elem);
	});
});