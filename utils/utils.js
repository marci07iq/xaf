import * as Loader from './loader.js';
import * as Geometry from './geometry.js';
export { Loader, Geometry };

export function getDefault(val, def) {
    return (val == undefined) ? def : val;
}

/**
 * Create HTML element, setting classes, other attribures, text, and children.
 * @param  {string} type
 * DOM element type
 * @param  {string[]} classes=[]
 * Classes to apply to element
 * @param  {Object.<string, string>} attributes={}
 * Map of attribute name to value
 * @param  {string} iText=""
 * innerText of element (HTML escaped by browser)
 * @param  {HTMLElement[]} children=[]
 * Array of children
 * @returns {HTMLElement}
 * The created element
 */
export function createElem(type, classes = [], attributes = {}, iText = "", children = []) {
    //Create elem
    let elem = document.createElement(type);
    //Add classes
    elem.classList.add(...classes);
    //Apply attributes
    for (let attname in attributes) {
        elem.setAttribute(attname, attributes[attname]);
    }
    //Inner text
    elem.innerText = iText;
    //Childten
    for (let child in children) {
        elem.appendChild(children[child]);
    }
    return elem;
}

export class FactoryRegistry {
    constructor() {
        this.registry = {};
    }

    registerFactory(name, factory) {
        this.registry[name] = factory;
    }
    useFactory(name, params) {
        return this.registry[name](...params);
    }
};

export function forEachDict(dict, callback) {
    for (let key in dict) {
        // check if the property/key is defined in the object itself, not in parent
        if (dict.hasOwnProperty(key)) {
            callback(key, dict[key]);
        }
    }
}

export function formatTime(seconds, show_ms = false, blocks = undefined) {
    let t_ms = Math.floor((seconds * 1000) % 1000);
    let t_s = Math.floor((seconds) % 60);
    let t_min = Math.floor((seconds / 60) % 60);
    let t_h = Math.floor((seconds / 3600));

    let nonzero_blocks = ((t_h > 0) ? 3 : ((t_min > 0) ? 2 : ((t_s > 0) ? 1 : (show_ms ? 1 : 0))));

    blocks = Math.max((blocks === undefined) ? 0 : blocks, nonzero_blocks);
    blocks = Math.max(blocks, 2);

    let res = "";
    if (blocks >= 3) {
        res += String(t_h) + ":";
    }
    if (blocks >= 2) {
        res += String(t_min).padStart(2, '0') + ":";
    }
    if (blocks >= 1) {
        res += String(t_s).padStart(2, '0');
    }
    if (show_ms) {
        res += "." + String(t_ms).padStart(3, '0');
    }

    return [res, blocks];
}