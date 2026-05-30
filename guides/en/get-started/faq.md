# FAQ

This page covers the annoying questions that keep showing up during testing.

## Why does RZMenu export a font if there is no visible text?

Because the UI still needs a font path for internal messages, warnings, dependency notes, and future runtime text.

One base font atlas is expected. If extra font atlases show up without a reason, that is a cleanup candidate.

## Why is some junk exported?

Because the add-on either still needs it, or I have not finished the cleanup path yet.

Try removing it first. If the console stays quiet and the export still behaves, great. If something breaks, put it back.

## What is the mod producer / post-build step?

Skip it for now. It is not finished.

## Should I back up before updating?

Yes, especially if a build touches templates, shape keys, export cleanup, shader logic, or ini optimization.

There is also an annoying Blender hang that sometimes appears once after an add-on update. I hit it a lot because I test every commit, and I still do not fully know why it happens.

## Why does the first install sometimes need a second restart?

Some early setups can fail to load dependencies such as `PySide6` or `Pillow` on the first pass. If the editor launch button does not appear, install dependencies again and restart Blender.

## Why not make everything optional?

Because the tool already has a huge pile of code, custom mistakes, urgency, and size. If I tried to make every little piece modular right now, I would spend more time untangling the system than building the thing.
