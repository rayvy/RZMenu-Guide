# First Menu

This guide walks through the minimum useful RZMenu editor flow: create UI elements, organize them, and prepare them for logic.

RZMenu is a Blender add-on helper, not a standalone mod exporter. It helps you build menu data and UI logic, then the result still has to live in the target mod pipeline.

## 1. Open the editor

In Blender, open the RZMenu panel and launch the editor. The editor viewport is where you place menu elements.

Right-click an empty space in the editor viewport and use **Add** to create elements.

![Add menu](guide-media/editor-add-menu.png)

The usual first element is an **Anchor** or **Container**. Use it as the base for the rest of the menu.

## 2. Know the basic element types

**Container** is the generic box. It is useful for grouping, decoration, and custom logic.

**Anchor** behaves like a container but is designed to be dragged and positioned. It is a good root element for a screen or panel.

**Button** is the main clickable element. It can be linked to variables, toggles, and other logic.

**Slider** writes a smooth value, usually from `0.0` to `1.0`.

**Text** renders text through a separate draw path. Treat it differently from image-based elements: do not expect every image or effect option to behave the same way.

**Grid Container** can auto-place controls, but it is still experimental. Use it only when you are ready to debug layout surprises.

## 3. Organize the tree

The Outliner shows the hierarchy of your menu. Drag elements under a parent to group them, or drag them out to make them independent.

![Outliner pages](guide-media/outliner-pages.png)

For multi-page menus, use separate root panels and control their visibility with a page variable.

## 4. Use isolation roots for pages

If a panel represents a page, enable the page/isolation option on that root element. That makes it easier to work with large menus without selecting the entire pile of UI by accident.

Known rough edge: if a page does not render the first time, switch away and back. That refresh issue is expected in some builds.

## 5. End state

At this point you should have:

- one root Anchor or Container;
- a few Buttons, Text blocks, or Sliders;
- a clean hierarchy in the Outliner;
- a plan for what variables will drive the UI.

Next step: bind actual toggles and texture slots.

![Ray-chan finale](guide-media/ray-chan-finale.png)
