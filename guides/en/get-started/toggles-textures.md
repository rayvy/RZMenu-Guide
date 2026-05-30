# Toggles and Textures

Toggles are the most common way to control visible mesh states. Texture slots let you bind custom resources to selected meshes.

## 1. Create a toggle variable

Open the Variables panel and create a **Toggles (@)** variable. Set its length and, if needed, a starting index.

Use `@` variables when you want discrete states: outfit variants, visibility states, menu pages, or anything that behaves like a selector.

## 2. Assign the toggle to a mesh

Select the mesh in Blender, open the RZMenu N-panel, then use **RZ-Toggles -> Assign**.

![Toggle assign panel](guide-media/toggle-assign-panel.png)

Pick one of the available toggles. RZMenu will show a bitmask for the selected mesh.

## 3. Read the bitmask

The bitmask decides when the mesh is visible.

Example:

- if toggle value is `0` and the first bit is enabled, the mesh is visible at state `0`;
- if toggle value is `1` and the second bit is disabled, the mesh is hidden at state `1`.

This is useful for clothing variants, optional parts, alternate accessories, and any mesh that needs conditional visibility.

## 4. Assign a texture slot

Select a mesh and fill the texture slot name in **RZ-TexSlots**.

![Texture slot panel](guide-media/texture-slot-panel.png)

If the texture does not exist yet, RZMenu can create a slot for it. If it exists in TexWorks, it can be pulled from there.

## 5. Keep it boring first

Do not start with ten conditions and five texture overrides. First confirm that one toggle hides and shows one mesh. Then add complexity.
