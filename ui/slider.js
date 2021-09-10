import * as Utils from "../utils/utils.js";

export function Slider(
	parent,
	min_val = 0,
	max_val = 1,
	start_val = 0,
	speed = 0.01, //val per second
	keyvals = [],
	buttons = []) {
	this.callbacks = {
		onValue: [],
		custom: {}
	};


	//Init HTML tree
	this.elems = {
		base: null,
		progress: {
			base: null,
			highlight: Utils.createElem("div", ["slider-progress-highlight"], {}, "", [
				Utils.createElem("div", ["slider-progress-knob"])
			]),
		},
		lower: {
			base: null,
			left: {
				base: null,
				play_button: Utils.createElem("button", ["slider-control-item", "slider-playbutton"]),

			},

			right: {
				base: null,
				elems: []
			}
		},
	};

	this.elems.progress.base = Utils.createElem("div", ["slider-progress-container"], {}, "", [
		this.elems.progress.highlight
	]);

	this.elems.lower.left.base = Utils.createElem("div", ["slider-control-left"], {}, "", [
		this.elems.lower.left.play_button
	]);

	//Init right menu
	buttons.forEach((button) => {
		let input_elem = undefined;
		switch (button.type) {
			case "toggle":
				this.callbacks.custom[button.name] = [];
				this.elems.lower.right.elems.push(
					Utils.createElem("label", ["slider-control-item", "toggle"], { title: button.display }, "", [
						input_elem = Utils.createElem("input", [], { type: "checkbox" }),
						Utils.createElem("span", ["toggle-line", "round"]),
						//createElem("span", ["tooltiptext"], {}, button.display)
					]),
				);
				input_elem.onchange = (e) => {
					this.callbacks.custom[button.name].forEach(cb => {
						cb(e.target.checked);
					});
				};

				break;
			case "button":
				this.callbacks.custom[button.name] = [];
				this.elems.lower.right.elems.push(
					input_elem = Utils.createElem("i", ["slider-control-item", "slider-control-icon", "bi", button.icons], { title: button.display }, "", []),
				);
				input_elem.onclick = (e) => {
					this.callbacks.custom[button.name].forEach(cb => {
						cb();
					});
				};
				break;
			default:
				throw Error("Unknown type " + button.type);
		}
	})

	this.elems.lower.right.base = Utils.createElem("div", ["slider-control-right"], {}, "",
		this.elems.lower.right.elems
	);

	this.elems.lower.base = Utils.createElem("div", ["slider-control"], {}, "", [
		this.elems.lower.left.base,
		this.elems.lower.right.base
	]);

	this.elems.base = Utils.createElem("div", ["slider"], {}, "", [
		this.elems.progress.base,
		this.elems.lower.base
	]);

	parent.appendChild(this.elems.base);

	//Functions
	this.val = 0;
	this.range = [min_val, max_val];
	this.setProgress = (progress) => {
		let oub = (progress >= this.range[1]);

		this.val = Math.min(Math.max(this.range[0], progress), this.range[1]);
		let rel_progress = (this.val - this.range[0]) / (this.range[1] - this.range[0]);

		this.elems.progress.highlight.style.width = String(100 * rel_progress) + "%";

		this.callbacks.onValue.forEach(cb => {
			cb(this.val);
		});

		return oub;
	}
	this.setProgress(start_val);

	this.lastAnimationFrame = undefined;
	this.playing = false;
	this.animationFrame = (time) => {
		if (this.playing) {
			if (this.lastAnimationFrame != undefined) {
				let ms_elapsed = time - this.lastAnimationFrame;
				if (this.setProgress(this.val + speed * ms_elapsed / 1000.)) {
					this.setPlaying(false);
				}
			}
			this.lastAnimationFrame = time;

			window.requestAnimationFrame((time2) => {
				this.animationFrame(time2);
			});
		} else {
			this.lastAnimationFrame = undefined;
		}
	};

	this.setPlaying = (playing) => {
		this.playing = !!playing;

		if (this.playing) {
			if (this.val >= this.range[1]) {
				this.val = this.range[0];
			}
			this.elems.lower.left.play_button.classList.add("pause");
			window.requestAnimationFrame((time2) => {
				this.animationFrame(time2);
			});
		} else {
			this.elems.lower.left.play_button.classList.remove("pause");
		}
	};
	this.setPlaying(false);
	this.elems.lower.left.play_button.onclick = () => { this.setPlaying(!this.playing) };

	this.moveKnob = (e) => {
		if (this.dragging) {
			let scrollRect = this.elems.progress.base.getClientRects()[0];
			let rel_progress = (e.screenX - scrollRect.left) / (scrollRect.right - scrollRect.left);
			let val_progress = this.range[0] + (this.range[1] - this.range[0]) * rel_progress;
			this.setProgress(val_progress);
		}
	}

	this.dragging = false;
	this.setDragging = (dragging) => {
		this.dragging = !!dragging;

		if (this.dragging) {
			this.elems.progress.base.classList.add("expand");
		} else {
			this.elems.progress.base.classList.remove("expand");
		}
	}
	this.elems.progress.base.addEventListener('mousedown', e => {
		this.setPlaying(false);
		this.setDragging(true);
		this.moveKnob(e);
	});

	window.addEventListener('mousemove', e => {
		this.moveKnob(e);
	});

	window.addEventListener('mouseup', e => {
		this.moveKnob(e);
		this.setDragging(false);
	});
}