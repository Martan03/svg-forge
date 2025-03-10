# svg-forge

SVG Forge lets you preview and edit SVGs in VSCode with ease

![image](https://github.com/user-attachments/assets/528b836c-6853-432e-917e-ab3ca3d15c78)

## Table of Contents

- [Features](#features)
    - [Planned features](#planned-features)
- [How to get it](#how-to-get-it)
- [Description](#description)
    - [Openning SVG Forge](#openning-svg-forge)
    - [Controls](#controls)
    - [Preview](#preview)
- [Release Notes](#release-notes)
    - [1.0.0](#100)
- [Links](#links)

## Features

- Preview SVG
    - Automatically updates on save
    - Change scale and position of the SVG
    - Display view box coordinates based on mouse position
- Edit SVG
    - Create new line or circle

### Planned features

- Select SVG element to move it around and edit its attributes
- Add settings

### How to get it

The extension is available on 
[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Martan03.svg-forge).

## Description

### Openning SVG Forge

When in SVG file, the top bar contains open preview icon, which you can click
to open the extension. It opens beside the SVG file and starts previewing the
SVG itself.

![image](https://github.com/user-attachments/assets/f8e09227-9703-4c92-9940-3d66d1d8a853)

### Controls

On top of the preview page is a bar containing controls. I'll describe each
control from left to right.

First is scale select, which by default is 100%, but you can change it to any
value in the options (or you can have custom value, which is described in
[next section](#preview)). Next to it is a center button, which centers the
SVG.

Next section contains background options, starting with transparent, dark
checkerboard or light cherkerboard (background is set to checkerboard by
default and to dark/light based on current theme).

The last section contains actual controls for the preview. First one is cursor,
which allows to work with the preview. The next ones are line, circle and 
rectangle, which allow you to create the corresponding element - more about 
this in the [preview](#preview) description.

On the most right of the bar are the current coordinates of the cursor based on
the SVG view box.

![image](https://github.com/user-attachments/assets/94b7be7c-5ecc-4474-ae73-37befa570f74)

### Preview

Preview displays the actual SVG. It changes the scale of it based on the set
scale. If cursor control is selected, you can change the scale to custom value
using a mouse wheel, and move the SVG around by dragging it.

When you change to line control, you can create a new line. When you somewhere
on the preview, it creates a first point of the line and then when you click
for the second time, it creates a second one. Before placing the second point,
you can use scroll wheel to change the line thickness.

Circle control is similar to the line one, but the first click sets circle
center position and then the second click sets the radius based on the distance
from the center of the circle. Same as with line control, you can change the
thickness of the stroke using scroll wheel before clicking for the second time.

Rectangle control allows you to create any rectangle. The first and second 
clicks define the rectangle itself. Scroll wheel can again be used for changing
the stroke width.

![image](https://github.com/user-attachments/assets/528b836c-6853-432e-917e-ab3ca3d15c78)

## Release Notes

### v0.0.1

- Initial release of SVG Forge
    - SVG preview
    - Basic SVG editor with option to add line or circle

## Links

- **Author:** [Martan03](https://github.com/Martan03)
- **Marketplace**: [svg-forge](https://marketplace.visualstudio.com/items?itemName=Martan03.svg-forge)
- **GitHub repository:** [svg-forge](https://github.com/Martan03/svg-forge)
- **Author website:** [martan03.github.io](https://martan03.github.io)
