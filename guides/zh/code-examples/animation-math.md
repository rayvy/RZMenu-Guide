# 动画数学

<p class="lead">这里有用的东西本来就故意做得很小。你需要的是那种容易复制、容易修改、以后也不容易后悔的公式。</p>

<div class="callout">无聊的数学通常就是好数学。如果曲线一眼就能看懂，项目烂掉以后下一个人也还能维护它。</div>

<div class="example-strip">
<details class="example-card" open>
<summary>
<img src="assets/cissia_gif_crisps.gif" alt="Looping animation preview">
<strong>缓动曲线</strong>
<p>当数值不应该像砖头一样硬停时，就用这个。</p>
</summary>
<div class="example-body">
```text
t = clamp(t, 0.0, 1.0)
ease = t * t * (3.0 - 2.0 * t)
```
<div class="popup-note">适合悬停状态、页面淡入淡出，以及任何想要柔和而不是机器感的运动。</div>
</div>
</details>

<details class="example-card" open>
<summary>
<strong>弹入缩放</strong>
<p>给按钮或弹窗一点点超调，让它看起来更有底气。</p>
</summary>
<div class="example-body">
```text
scale = 1.0 + sin(time * 8.0) * 0.02
scale = lerp(scale, 1.0, clamp(progress, 0.0, 1.0))
```
<div class="popup-note">超调要很小。如果菜单抖得像卡车，那就是数学太吵了。</div>
</div>
</details>

<details class="example-card" open>
<summary>
<img src="guide-media/value-link-fields.png" alt="Value links preview">
<strong>滞后跟随器</strong>
<p>当一个值应该追着另一个值跑，而不是瞬移过去时很有用。</p>
</summary>
<div class="example-body">
```text
current += (target - current) * min(speed * dt, 1.0)
```
<div class="popup-note">这是平滑计数器、标记和动画指示器的基础技巧。</div>
</div>
</details>

<details class="example-card" open>
<summary>
<img src="guide-media/toggle-assign-panel.png" alt="Toggle assignment preview">
<strong>脉冲爆发</strong>
<p>切换状态时来一下快速闪烁会很好看。</p>
</summary>
<div class="example-body">
```text
pulse = max(0.0, 1.0 - abs(time * frequency % 2.0 - 1.0))
```
<div class="popup-note">如果看起来太猛，就先降频率，再考虑降低你的审美底线。</div>
</div>
</details>
</div>
