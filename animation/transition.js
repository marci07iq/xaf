import * as Utils from '../utils/utils.js'

export let TransitionFactory = new Utils.FactoryRegistry();
export class TransitionIn {
    constructor(time, to, direction) {
        this.time = time;
        this.to = to;
        this.direction = direction;
    }

    getPosition(time) {
        let local_progress = Math.min(Math.max(0, ((time - this.time.min) / (this.time.max - this.time.min))), 1);

        let direction_scale = 1 / (1 - (1 - local_progress) * (1 - local_progress)) - 1;
        return {
            show: local_progress > 0,
            weight: (local_progress > 0.5) ? ((1 - Math.cos((local_progress - 0.5) * 4 * Math.PI)) / 2) : 0,
            pos: [
                this.to[0] + this.direction[0] * direction_scale,
                this.to[1] + this.direction[1] * direction_scale,
                this.to[2] + this.direction[2] * direction_scale,
            ]
        };
    }
}

TransitionFactory.registerFactory("TransitionIn", (data) => {
    return new TransitionIn(
        data.time, [Number(data.to[0]), Number(data.to[1]), Number(data.to[2])], [Number(data.direction[0]), Number(data.direction[1]), Number(data.direction[2])]
    );
})

export class TransitionOut {
    constructor(time, to, direction) {
        this.time = time;
        this.to = to;
        this.direction = direction;
    }

    getPosition(time) {
        let local_progress = Math.min(Math.max(0, ((time - this.time.min) / (this.time.max - this.time.min))), 1);

        let direction_scale = 1 / (1 - (local_progress) * (local_progress)) - 1;
        return {
            show: local_progress < 1,
            weight: (local_progress < 0.5) ? ((1 - Math.cos((local_progress) * 4 * Math.PI)) / 2) : 0,
            pos: [
                this.to[0] + this.direction[0] * direction_scale,
                this.to[1] + this.direction[1] * direction_scale,
                this.to[2] + this.direction[2] * direction_scale,
            ]
        };
    }
}

TransitionFactory.registerFactory("TransitionOut", (data) => {
    return new TransitionOut(
        data.time, [Number(data.to[0]), Number(data.to[1]), Number(data.to[2])], [Number(data.direction[0]), Number(data.direction[1]), Number(data.direction[2])]
    );
})

export class TransitionMove {
    constructor(time, from, to) {
        this.time = time;
        this.from = from;
        this.to = to;
    }

    getPosition(time) {
        let local_progress = Math.min(Math.max(0, ((time - this.time.min) / (this.time.max - this.time.min))), 1);

        let x = local_progress * local_progress * 3 - local_progress * local_progress * local_progress * 2;
        if (x < 0) {
            return {
                show: true,
                weight: 0,
                pos: this.from
            };
        }
        if (x > 1) {
            return {
                show: true,
                weight: 0,
                pos: this.from
            };
        }
        return {
            show: true,
            weight: ((1 - Math.cos((local_progress) * 2 * Math.PI)) / 2),
            pos: Utils.Geometry.lerp(this.from, this.to, x)
        };
    }
}

TransitionFactory.registerFactory("TransitionMove", (data) => {
    return new TransitionMove(
        data.time, [Number(data.from[0]), Number(data.from[1]), Number(data.from[2])], [Number(data.to[0]), Number(data.to[1]), Number(data.to[2])]
    );
})

export class TransitionStatic {
    constructor(time, pos = Utils.Geometry.createVector([0, 0, 0])) {
        this.time = time;
        this.pos = pos;
    }

    getPosition(time) {
        return {
            show: 1,
            weight: 0,
            pos: this.pos
        };
    }
}

TransitionFactory.registerFactory("TransitionStatic", (data) => {
    return new TransitionStatic(
        data.time,
        (data.pos != undefined) ? [Number(data.pos[0]), Number(data.pos[1]), Number(data.pos[2])] : [0, 0, 0]
    );
})

export class TransitionStaticFocus {
    constructor(time, pos = Utils.Geometry.createVector([0, 0, 0])) {
        this.time = time;
        this.pos = pos;
    }

    getPosition(time) {
        let local_progress = Math.min(Math.max(0, ((time - this.time.min) / (this.time.max - this.time.min))), 1);

        return {
            show: 1,
            weight: ((1 - Math.cos((local_progress) * 2 * Math.PI)) / 2),
            pos: pos
        };
    }
}

TransitionFactory.registerFactory("TransitionStaticFocus", (data) => {
    return new TransitionStaticFocus(
        data.time,
        (data.pos != undefined) ? [Number(data.pos[0]), Number(data.pos[1]), Number(data.pos[2])] : [0, 0, 0]
    );
})