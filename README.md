# XAF

XR Animation Framework is an easy to use library based on Babylon.js used to view animations, on your computer or in virtual reality.

The library was originally developed to illustrate the winding of superconducting magnets, but is well suited for rendering engineering assembly processes.

## Features
- Animate the motion of simple static meshes
- Animate growing paths (eg. wires and pipes)
- Allow custom user defined animation objects
- Serve all resources in a single zip, and use as a virtual filesystem in code
- First person view controls (familiar to gamers) to move around the scene
- Little code required for simple tasks, many dedicated features built in

### VR Features:
- Toggle into VR rendering on capable devices (Url must end with `#xr` to enable this mode)
- Control animation directly using VR motion controllers

### Upcoming features:
- Cad-style third person orbiting camera
- In-app help

## Controls

By default, use:

W (forward), A (left), S (back), D (right), Space (up), Shift (down) for movement, and drag the mouse to look around

In VR use:

- Right hand controller:
- - Controller A: Play/Pause animation
- - Controller joystick left/right: Wind animation progress
- - Squeeze: Grab object (when highlighted), to move.
- Left hand controller:
- - Controller X: Teleport user to origin (in case room center is in wrong place)
- - Controller Y: Teleoprt all objects to origin

# Getting started

## Preparations

First, create the pieces you would like to animate. To animate the assembly of static meshes, save each mesh as an OBJ file.

If you have your assembled object as an Autodesk Inventor Assembly, click export as cad format, and choose OBJ. Click options, and select save all parts in different file. This will create a folder of OBJ files, representing each instance of each part of the assembly. This method also ensured that all saved meshes are placed in a common coordiante system.

Next, it is optional but recommended to create a Zip archive, to save on bandwidth and speed up loading. Windows file explorers built in zip feature seems to produce functional zip files, while 7zip appears to be incompatible. Please experiment if you get zip loading errors.

## Modifying the code

Now, copy the `manifest.json` file in the root folder of the project, this will serve as your template. In `index.js` change the loaded filename to your new manifest.

You may later want to add further operations after the file loads, such as create UI controls to adjust material transparency. These can be placed in `index.js`.

## Creating the manifest

Now begin editing the manifest file. For a full documentation of the format chekc out `documentation.md`.

First in the beginning of the file, adjust the input source to your data folder or zip file name.

You will want to set up multiple named materials, with different colors, and then create an element from each induvidually animated moving part.