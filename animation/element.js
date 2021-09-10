import * as Utils from "../utils/utils.js";

export class Element {
	constructor(parent, time) {
		this.parent = parent;
		this.time = time;
		this.local_progress = 1;
	}

	setProgress(progress) {
		let local_progress = (this.time.max > this.time.min) ?
			((progress - this.time.min) / (this.time.max - this.time.min)) :
			((progress > this.time.min) ? 1 : 0);

		local_progress = Math.min(Math.max(0, local_progress), 1);
		let change = (this.local_progress != local_progress);
		this.local_progress = local_progress;

		if (change) {
			this.update();
		}
	}

	init() {
		throw Error("overload");
	}
	update() {
		throw Error("overload");
	}
	getFocus() {
		throw Error("overload");
	}
};

export let ElementFactory = new Utils.FactoryRegistry();