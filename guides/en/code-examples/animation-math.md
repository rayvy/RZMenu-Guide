# Animation Math

<p class="lead">The useful stuff here is small on purpose. You want formulas that are easy to copy, easy to change, and hard to regret later.</p>

<div class="callout">Boring math is usually good math. If the curve is obvious, the next person can still maintain it when the project becomes a mess.</div>

<div class="example-strip">
<details class="example-card" open>
<summary>
<img src="assets/cissia_gif_crisps.gif" alt="Looping animation preview">
<strong>Ease curve</strong>
<p>Use this when a value should stop snapping like a brick.</p>
</summary>
<div class="example-body">
```text
t = clamp(t, 0.0, 1.0)
ease = t * t * (3.0 - 2.0 * t)
```
<div class="popup-note">Good for hover states, page fades, and any motion that should feel soft instead of robotic.</div>
</div>
</details>

<details class="example-card" open>
<summary>
<img src="assets/ray_chan_gachi_muchi_jojo_pose_ai_slop.png" alt="Ray-chan ready for a dramatic entrance">
<strong>Punch-in scale</strong>
<p>Small overshoot for a button or popup that needs confidence.</p>
</summary>
<div class="example-body">
```text
scale = 1.0 + sin(time * 8.0) * 0.02
scale = lerp(scale, 1.0, clamp(progress, 0.0, 1.0))
```
<div class="popup-note">Keep the overshoot tiny. If the menu shakes like a truck, the math is too loud.</div>
</div>
</details>

<details class="example-card" open>
<summary>
<img src="guide-media/value-link-fields.png" alt="Value links preview">
<strong>Lag follower</strong>
<p>Useful when a value should chase another value instead of teleporting.</p>
</summary>
<div class="example-body">
```text
current += (target - current) * min(speed * dt, 1.0)
```
<div class="popup-note">This is the basic trick for smoothing counters, markers, and animated indicators.</div>
</div>
</details>

<details class="example-card" open>
<summary>
<img src="guide-media/toggle-assign-panel.png" alt="Toggle assignment preview">
<strong>Pulse burst</strong>
<p>Nice for a quick flash when a toggle changes state.</p>
</summary>
<div class="example-body">
```text
pulse = max(0.0, 1.0 - abs(time * frequency % 2.0 - 1.0))
```
<div class="popup-note">If it looks too intense, lower the frequency before you lower your standards.</div>
</div>
</details>
</div>
