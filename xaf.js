import * as World from './world/world.js';
import * as Utils from './utils/utils.js';
import * as UI from './ui/ui.js';
import * as Animation from './animation/animation.js';

export { World, Utils, UI, Animation };

export async function init(config, sceneLoader) {
	let canvas;
	let ui_div;
	let blocker;
	document.body.appendChild(Utils.createElem("div", ["xaf-main"], {}, "", [
		canvas = Utils.createElem("canvas", ["xaf-canvas"], {}, "", []),
		ui_div = Utils.createElem("div", ["xaf-ui"], {}, "", []),
	]));

	document.body.appendChild(blocker = Utils.createElem("div", ["xaf-blocker", "noselect"], {}, "", []));

	try {
		await World.initWorld(canvas, ui_div, blocker, config, sceneLoader);
	} catch (e) {
		alert("An error has occured " + e);
		console.error(e);
	};

};