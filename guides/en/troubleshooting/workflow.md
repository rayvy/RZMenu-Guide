# Backups and Workflow

This page covers the boring stuff that saves you from losing time later: backups, updates, build steps, and maintenance habits.

## Should I back up before updating?

Yes, especially if a build touches templates, shape keys, export cleanup, shader logic, or ini optimization.

There is also an annoying Blender hang that sometimes appears once after an add-on update. I hit it a lot because I test every commit, and I still do not fully know why it happens.

## What should I do about the mod producer / post-build step?

Skip it for now. It is not finished.

## Should I keep the project modular from the start?

Not aggressively. The tool already has custom mistakes, urgency, and size. If I tried to make every little piece modular right now, I would spend more time untangling the system than building the thing.
