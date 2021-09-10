import * as XAF from './xaf.js';

window.XAF = XAF; //For console

window.onload = () => {
	XAF.init({
		delayed: true,
		message: ["Hi"]
	}, () => {
		return XAF.World.loadManifest("manifest_oftct.json");
	});
}