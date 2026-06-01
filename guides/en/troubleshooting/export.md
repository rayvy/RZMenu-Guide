# Export Weirdness

This is where the output-side nonsense lives: fonts, junk files, and exports that are technically successful but still suspicious.

## Why does RZMenu export a font if there is no visible text?

Because the UI still needs a font path for internal messages, warnings, dependency notes, and future runtime text.

One base font atlas is expected. If extra font atlases show up without a reason, that is a cleanup candidate.

## Why is some junk exported?

Because the add-on either still needs it, or I have not finished the cleanup path yet.

Try removing it first. If the console stays quiet and the export still behaves, great. If something breaks, put it back.
