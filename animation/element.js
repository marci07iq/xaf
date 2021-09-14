import * as Utils from "../utils/utils.js";

export class Element {
    constructor(parent, time) {
        this.parent = parent;
        this.time = time;
        this.local_progress = 1;
        this.oub = true;
    }

    setProgress(progress) {
        let local_progress = (this.time.max > this.time.min) ?
            ((progress - this.time.min) / (this.time.max - this.time.min)) :
            ((progress > this.time.min) ? 1 : 0);

        let oub = (local_progress < 0 || 1 <= local_progress); //Bounds range from [0,1)
        local_progress = Math.min(Math.max(0, local_progress), 1);

        let change = (this.local_progress != local_progress) || (oub != this.oub);

        this.local_progress = local_progress;
        this.oub = oub;

        if (change) {
            this.update();
        }
    }

    //Called for async loading (put XHR requests here), return Promise
    init() {
        throw Error("overload");
    }

    //After any important parameter has changed
    update() {
        throw Error("overload");
    }

    //Query POI
    getFocus() {
        throw Error("overload");
    }
};

export let ElementFactory = new Utils.FactoryRegistry();