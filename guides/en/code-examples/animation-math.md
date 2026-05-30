# Animation Math

These snippets are starter formulas for RZMenu-style animated UI. Treat them as patterns, then tune values for your menu.

## Arc motion

```ini
$positionX = $PositionX - (50 * ((time % 1) * (1 - (time % 1)) * 4))
```

This moves from rest to peak and back to rest over one cycle.

## Stepped motion

```ini
local $step
$step = (time * 4 % 4) - (time * 4 % 1)
$positionX = $PositionX - (10 * $step)
```

Useful when you want intentionally chunky movement instead of smooth interpolation.

## Easy out

```ini
$positionY = $PositionY - (50 * ((time % 1) * (time % 1)))
```

Reverse direction:

```ini
$positionY = $PositionY - (50 * ((1 - (time % 1)) * (1 - (time % 1))))
```

## Circle motion

```ini
$mathin = (time % 1) * 6.2831853
run = CommandListMathCos
$positionX = $PositionX + (50 * $mathout)

run = CommandListMathSin
$positionY = $PositionY + (50 * $mathout)
```

## Infinity motion

```ini
$mathin = (time % 1) * 6.2831853
run = CommandListMathCos
$positionX = $PositionX + (50 * $mathout)

$mathin = (time * 2 % 1) * 6.2831853
run = CommandListMathSin
$positionY = $PositionY + (50 * $mathout)
```

## Click elasticity

```ini
local $centerX
local $centerY
local $diffX
local $diffY
local $magnetX
local $magnetY
local $elasticSize

$centerX = $PositionX + ($sizeX / 2)
$centerY = $PositionY + ($sizeY / 2)
$diffX = $cursorX - $centerX
$diffY = $cursorY - $centerY
$magnetX = $diffX * 0.1 * w23
$magnetY = $diffY * 0.1 * w23
$elasticSize = 1.0 + (z23 * 0.3)

$positionX = $PositionX + $magnetX
$positionY = $PositionY + $magnetY
$sizeX = $SizeX * $elasticSize
$sizeY = $SizeY * $elasticSize
```

`z23` is click impulse. `w23` behaves like hold/hover pressure depending on the configured interaction.
