import * as Utils from '../utils/utils.js'
import * as Slider from './slider.js'

export let GUI = (() => {
	let my_parent = undefined;
	let container = Utils.createElem("div", ["xaf-ui-panel"]);

	let getUniqueID = (() => {
		let id = 0;
		return () => { return id++ };
	})();

	let ui_elems = {};

	let eventSubmit = (id, args) => {
		//TODO: Network send
		ui_elems[id].handler(...args);
	};

	let addToGroup = (elem, group) => {
		let tgtgroup = container;
		if (group != undefined) {
			tgtgroup = group.elem;
		}
		tgtgroup.appendChild(elem);
	};

	let buildElem = (id, description, handler) => {
		let html_root;
		let html_elem;
		let hwnd;

		switch (description.type) {
			case "group":
				html_root = html_elem = Utils.createElem("div", ["xaf-ui-group"]);
				hwnd = {
					getValue: () => { return undefined },
					setValue: () => { }
				};
				break;
			case "button":
				html_root = html_elem = Utils.createElem("button", ["xaf-ui-button"], {}, description.name);
				html_elem.onclick = () => { eventSubmit(id, []) };
				hwnd = {
					getValue: () => { return undefined },
					setValue: () => { html_elem.onclick(); }
				};
				break;
			case "slider":
				html_root = Utils.createElem("div", ["xaf-ui-named"], {}, "", [
					Utils.createElem("div", ["xaf-ui-title"], {}, description.name),
					html_elem = Utils.createElem("input", ["xaf-ui-slider"], {
						type: "range",
						min: Utils.getDefault(description.min, 0),
						max: Utils.getDefault(description.max, 0),
						step: Utils.getDefault(description.step, "any")
					})
				]);
				html_elem.oninput = () => { eventSubmit(id, [html_elem.value]) };
				hwnd = {
					getValue: () => { return html_elem.value },
					setValue: (v) => {
						html_elem.value = v;
						html_elem.oninput();
					}
				};
				break;
			default:
				throw Error("Unknwon type");
		}

		addToGroup(html_root, description.group);

		hwnd.root = html_root;
		hwnd.elem = html_elem;
		hwnd.id = id;
		hwnd.description = description;
		hwnd.handler = handler;

		return hwnd;
	};

	let addElem = (description, handler) => {
		let id = getUniqueID();
		let hwnd = buildElem(id, description, handler);

		ui_elems[id] = hwnd;

		return hwnd;
	};


	return {
		init: (parent, scene) => {
			my_parent = parent;
			parent.appendChild(container);
			if (scene != undefined) {
				//UI3D_manager = new BABYLON.GUI.GUI3DManager(scene);
				//UI3D_anchor = new BABYLON.AbstractMesh("anchor", scene);
			}
		},

		toggleXR: (enable) => {

		},

		addElem: addElem,

		initSlider: (min, max, start, speed) => {
			let slider = new Slider.Slider(my_parent, min, max, start, speed, [], []);
			return {
				setPlaying: (p) => { slider.setPlaying(p); },
				setProgress: (p) => { slider.setProgress(p); },
				onValue: slider.callbacks.onValue
			};
		}
	}
})();

export let Blocker = (() => {
	let click_cnt = 0;

	let current_click_handler = () => { };

	let click_handler = () => {
		current_click_handler();
		++click_cnt;
	}

	let blocker_element;

	return {
		init: (element, delayed) => {
			blocker_element = element;
			blocker_element.onclick = click_handler;
			if (delayed) {
				return new Promise((resolve, reject) => {
					blocker_element.innerHTML = "Click here to load";
					current_click_handler = () => {
						blocker_element.innerHTML = "Loading, please wait!";
						resolve();
					}

				});
			} else {
				blocker_element.innerHTML = "Loading, please wait!";
				return Promise.resolve();
			}
		},
		loadingEnd: (welcomeMessage) => {
			blocker_element.innerHTML = welcomeMessage.join("\n");
			current_click_handler = () => {
				//Suicide
				blocker_element.parentNode.removeChild(blocker_element);
			}
		},

	};
})();