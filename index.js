import * as XAF from './xaf.js';

window.XAF = XAF; //For console

window.onload = () => {
    XAF.init({
        delayed: true,
        message: ["Please click to begin"]
    }, async() => {
        //Wait for loading
        const params = new URLSearchParams(window.location.search)
        if (params.has("model") && params.get('model') == "oftct") {
            let animation = await XAF.World.loadManifest("manifest_oftct.json");
            XAF.UI.GUI.addElem({
                "type": "slider",
                "name": "Opactity",
                "min": 0,
                "max": 1
            }, (v) => {
                animation.objects[0].materials["body"].material.alpha = v;
            }).setValue(1);

        } else {
            let animation = await XAF.World.loadManifest("manifest_sushi.json");
        }



        //let slider = XAF.UI.GUI.initSlider(0, 1, 0.5, 1);

        //animation.objects[0].node.position.y = 1.5;

        //Allow changing main body opacity
        /**/

        //

        return;
    });
}