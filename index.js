import * as XAF from './xaf.js';

window.XAF = XAF; //For console

window.onload = () => {
    XAF.init({
        delayed: true,
        message: ["Hi"]
    }, async() => {
        //Wait for loading
        let animation = await XAF.World.loadManifest("manifest_sushi2.json");

        animation.objects[0].node.position.y = 1.5;

        //Allow changing main body opacity
        /*XAF.UI.GUI.addElem({
            "type": "slider",
            "name": "Opactity",
            "min": 0,
            "max": 1
        }, (v) => {
            animation.objects[0].materials["body"].material.alpha = v;
        }).setValue(1);*/

        //

        return;
    });
}