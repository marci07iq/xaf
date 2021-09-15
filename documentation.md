
# Documentation

## Manifest layout

- `time`:
- - `min`: Describes start of animation in internal coordiante time
- - `max`: Describes end of animation in internal coordiante time
- - `speed`: Rate of animation, coordinate time / real world time. Use lower numbers for slower animation.
- `source`: Descibes the source of the data. All further paths are relative to this.
- - `type`: `"folder"` for a folder of data files, and `"zip"` for a single bundled file containing a virtual filesystem
- - `path`: Path to the folder or zip file.
- `objects[]`: List of the objects in the scene

Objects have the following layout:
- `position[3]`: The initial position of the object compared to the scene origin. You probably want to set y=1.5, to have the object in eye height instead of inside the ground.
- `boundry[2][3]`: An array of [min, max], describing the extents of your object in its local coordinate system. Will be used for VR hand grabbing.
- `materials{}`: An associative array of material name -> material used by the object (see below)
- `elems[]`: An array of the animation elements of the object (see below)

Materials have the following layout:
- `color{}`: The color of the material, 
- - `r`, `g`, `b`: RGB color components, 0-1.
- `color_selected{}?`: The color of the material when selected, may be omitted. Deafults to 20% whiter.

Elements have the following layout:
