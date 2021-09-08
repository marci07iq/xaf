import * as XAF from './xaf.js';

window.XAF = XAF; //For console

window.onload = () => {
    XAF.init({
        delayed: true,
        message: ["Hi"]
    }, (ctx) => {
        return XAF.Animation.loadManifest(ctx, "manifest_oftct.json").then((animation) => {
            let slider_hwnd = XAF.UI.GUI.initSlider(
                animation.time.min,
                animation.time.max,
                animation.time.max,
                0.5);
            slider_hwnd.onValue.push((v) => {
                animation.objects.forEach(obj => {
                    obj.setProgress(v);
                });
            });
            window.slider_hwnd = slider_hwnd;
            window.animation = animation;
            return Promise.resolve();
        });

    });
}