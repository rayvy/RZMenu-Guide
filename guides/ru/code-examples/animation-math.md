# Математика анимаций

Тут лежат формулы для движения UI. Не надо воспринимать их как священные скрижали: копируешь, смотришь, крутишь числа, страдаешь меньше.

## Дуга туда-обратно

```ini
$positionX = $PositionX - (50 * ((time % 1) * (1 - (time % 1)) * 4))
```

Двигает элемент от базы к пику и обратно за один цикл.

## Движение рывками

```ini
local $step
$step = (time * 4 % 4) - (time * 4 % 1)
$positionX = $PositionX - (10 * $step)
```

Когда нужен не плавный luxury-slider, а намеренный “тук-тук-тук” по кадрам.

## Easy out

```ini
$positionY = $PositionY - (50 * ((time % 1) * (time % 1)))
```

В обратную сторону:

```ini
$positionY = $PositionY - (50 * ((1 - (time % 1)) * (1 - (time % 1))))
```

## Круговое движение

```ini
$mathin = (time % 1) * 6.2831853
run = CommandListMathCos
$positionX = $PositionX + (50 * $mathout)

run = CommandListMathSin
$positionY = $PositionY + (50 * $mathout)
```

`6.2831853` — это примерно `2 * pi`, то есть полный оборот.

## Знак бесконечности

```ini
$mathin = (time % 1) * 6.2831853
run = CommandListMathCos
$positionX = $PositionX + (50 * $mathout)

$mathin = (time * 2 % 1) * 6.2831853
run = CommandListMathSin
$positionY = $PositionY + (50 * $mathout)
```

Одна ось идёт обычным кругом, вторая в два раза быстрее. Получается восьмёрка.

## Магнит к курсору + эластичность от клика

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

`z23` — импульс клика. `w23` можно использовать как удержание/наведение, в зависимости от того, как настроена интеракция.
