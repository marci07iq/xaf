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