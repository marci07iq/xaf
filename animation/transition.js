import * as Utils from '../utils/utils.js'

export let TransitionFactory = new Utils.FactoryRegistry();

export class TransitionIn {
    constructor(to, direction) {
        this.to = to;
        this.direction = direction;
    }

    getPosition(progress) {
        let direction_scale = 1 / (1 - (1 - progress) * (1 - progress)) - 1;
        return {
            show: progress > 0,
            weight: (progress > 0.5) ? ((1 - Math.cos((progress - 0.5) * 4 * Math.PI)) / 2) : 0,
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
        [Number(data.to[0]), Number(data.to[1]), Number(data.to[2])], [Number(data.direction[0]), Number(data.direction[1]), Number(data.direction[2])]
    );
})

export class TransitionOut {
    constructor(to, direction) {
        this.to = to;
        this.direction = direction;
    }

    getPosition(progress) {
        let direction_scale = 1 / (1 - (progress) * (progress)) - 1;
        return {
            show: progress < 1,
            weight: (progress < 0.5) ? ((1 - Math.cos((progress) * 4 * Math.PI)) / 2) : 0,
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
        [Number(data.to[0]), Number(data.to[1]), Number(data.to[2])], [Number(data.direction[0]), Number(data.direction[1]), Number(data.direction[2])]
    );
})

export class TransitionMove {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }

    getPosition(progress) {
        let x = progress * progress * 3 - progress * progress * progress * 2;
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
            weight: ((1 - Math.cos((progress) * 2 * Math.PI)) / 2),
            pos: Utils.Geometry.lerp(this.from, this.to, x)
        };
    }
}

TransitionFactory.registerFactory("TransitionMove", (data) => {
    return new TransitionMove(
        [Number(data.from[0]), Number(data.from[1]), Number(data.from[2])], [Number(data.to[0]), Number(data.to[1]), Number(data.to[2])]
    );
})

export class TransitionStatic {
    constructor(pos = Utils.Geometry.createVector([0, 0, 0])) {
        this.pos = pos;
    }

    getPosition(progress) {
        return {
            show: 1,
            weight: 0,
            pos: pos
        };
    }
}

TransitionFactory.registerFactory("TransitionStatic", (data) => {
    return new TransitionStatic(
        (data.pos != undefined) ? [Number(data.pos[0]), Number(data.pos[1]), Number(data.pos[2])] : [0, 0, 0]
    );
})

export class TransitionStaticFocus {
    constructor(pos = Utils.Geometry.createVector([0, 0, 0])) {
        this.pos = pos;
    }

    getPosition(progress) {
        return {
            show: 1,
            weight: ((1 - Math.cos((progress) * 2 * Math.PI)) / 2),
            pos: pos
        };
    }
}

TransitionFactory.registerFactory("TransitionStaticFocus", (data) => {
    return new TransitionStaticFocus(
        (data.pos != undefined) ? [Number(data.pos[0]), Number(data.pos[1]), Number(data.pos[2])] : [0, 0, 0]
    );
})