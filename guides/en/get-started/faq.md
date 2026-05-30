# FAQ

This page summarizes common questions from early RZMenu testing.

## Why does RZMenu export a font even if my mod has no visible text?

Because the menu core can still need text rendering for internal/system messages: missing packages, broken setup, compatibility warnings, dependency notes, and future API-style messages.

One base font atlas is expected. Extra optional font atlases should be treated as cleanup candidates if they appear without being used.

## Why are unused files exported?

The intended rule is:

- registered resources are exported;
- resources referenced by filenames are exported;
- anything not registered and not referenced should be cut during checking or post-processing.

If something useless appears in output, first check whether it is accidentally referenced by the menu, a placeholder, a texture slot, or a debug file.

## What is the mod producer / post-build step?

It is the cleanup/build stage after export. Its job is to package variants, trim unused dependencies, and keep the output sane.

In plain English: export can be noisy, post-build should clean what is safe to clean.

## Should I back up before updating?

Yes. Especially if a build touches templates, shape keys, export cleanup, or shader logic.

## Why does the first install sometimes need a second restart?

Some early setups can fail to fully load dependencies such as `PySide6` or `Pillow` on the first pass. If the editor launch button does not appear, install dependencies again and restart Blender.

## Why not make every resource optional?

Because some resources are part of the runtime assumptions. Optional resources are good. Accidentally breaking the core renderer is not.
