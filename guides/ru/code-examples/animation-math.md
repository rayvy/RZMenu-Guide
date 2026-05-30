# Математика анимаций

<p class="lead">Здесь лежат куски математики, которые не стыдно копировать. Чем тупее и понятнее формула, тем меньше ты потом проклянёшь себя в будущем.</p>

<img class="hero-shot" src="assets/ray_chan_thinking_ai_slop.png" alt="Ray-chan думает про кривые движения">

<div class="callout">Скучная математика - это обычно хорошая математика. Если кривая читается сразу, потом её ещё можно поддерживать, а не молиться на неё.</div>

<div class="example-strip">
<details class="example-card" open>
<summary>
<img src="assets/cissia_gif_crisps.gif" alt="Зацикленная анимация">
<strong>Плавная кривая</strong>
<p>Когда значение не должно дёргаться как мешок с гвоздями.</p>
</summary>
<div class="example-body">
```text
t = clamp(t, 0.0, 1.0)
ease = t * t * (3.0 - 2.0 * t)
```
<div class="popup-note">Подходит для hover-эффектов, затемнения страниц и всего, что должно ехать мягко, а не по-танковому.</div>
</div>
</details>

<details class="example-card" open>
<summary>
<img src="assets/ray_chan_gachi_muchi_jojo_pose_ai_slop.png" alt="Ray-chan пришла драматично">
<strong>Лёгкий пинок масштаба</strong>
<p>Маленький overshoot для кнопки или попапа, если им нужна уверенность.</p>
</summary>
<div class="example-body">
```text
scale = 1.0 + sin(time * 8.0) * 0.02
scale = lerp(scale, 1.0, clamp(progress, 0.0, 1.0))
```
<div class="popup-note">Не разгоняй overshoot слишком сильно. Если меню трясёт как маршрутку, значит формула орёт.</div>
</div>
</details>

<details class="example-card" open>
<summary>
<img src="guide-media/value-link-fields.png" alt="Ссылки на значения">
<strong>Погоня за значением</strong>
<p>Нужно, когда одно число должно догонять другое, а не телепортироваться.</p>
</summary>
<div class="example-body">
```text
current += (target - current) * min(speed * dt, 1.0)
```
<div class="popup-note">Базовый трюк для сглаживания счётчиков, маркеров и прочих бегущих индикаторов.</div>
</div>
</details>

<details class="example-card" open>
<summary>
<img src="guide-media/toggle-assign-panel.png" alt="Панель тогглов">
<strong>Импульс</strong>
<p>Хорошо смотрится, когда тоггл переключился и хочется маленькую вспышку.</p>
</summary>
<div class="example-body">
```text
pulse = max(0.0, 1.0 - abs(time * frequency % 2.0 - 1.0))
```
<div class="popup-note">Если слишком жёстко - сначала убавь частоту, а уже потом жалуйся на жизнь.</div>
</div>
</details>
</div>
