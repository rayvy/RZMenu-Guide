# First Menu

This is the minimum sane flow: create elements, organize them, and stop before you build a cursed pile of boxes.

RZMenu is a Blender add-on helper, not a standalone exporter. It helps you build menu data and UI logic. The final result still has to move through the rest of the mod pipeline.

## 1. Open the editor

Open the RZMenu panel in Blender and launch the editor. That viewport is where you place menu elements.

Right-click empty space and use **Add**.

![Add menu](guide-media/editor-add-menu.png)

The first element is usually an **Anchor** or **Container**. That becomes the base for everything else.

## 2. Know the basic element types

**Container** is the general-purpose box. It groups things and can hold custom logic.

**Anchor** is close to a container, but it is meant to be moved and positioned. It is a solid root for a screen or panel.

**Button** is the main clickable thing. It can be linked to variables, toggles, and other logic.

**Slider** writes a smooth value, usually from `0.0` to `1.0`.

**Text** renders through a different path. Do not assume image rules and text rules behave the same way.

**Grid Container** used to be the lazy way to place children automatically. It broke after the positioning refactor and the maintainer has not fixed it. You should avoid creating one unless you enjoy dead ends.

## 3. Organize the tree

The Outliner shows parent-child hierarchy. Drag elements under a parent to group them, or move them out to make them independent.

![Outliner pages](guide-media/outliner-pages.png)

For multi-page menus, use separate root panels and drive visibility with a page variable.

## 4. Use isolation roots for pages

If a panel is a page, enable the page or isolation option on that root element. That makes large menus much easier to manage.

Known rough edge: if a page does not render on the first try, switch away and back. The refresh bug is still around in some builds. The author is also weirdly attached to this bug and does not want to spend time digging through the hidden code path.

## 5. End state

At this point you should have:

- one root Anchor or Container;
- a few Buttons, Text blocks, or Sliders;
- a clean hierarchy in the Outliner;
- a plan for what variables will drive the UI.

Next step: bind actual toggles and texture slots.

If something appeared after you clicked, or even if the app only lagged in a convincing way, that still counts as progress. Stand up and yell: "VICTORY."

