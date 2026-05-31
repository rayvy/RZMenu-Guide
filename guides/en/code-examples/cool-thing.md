# How to Make a Cool Thing

<p class="lead">A practical path for turning a blank page into something that feels intentional instead of improvised.</p>

<div class="example-strip">
<details class="example-card" open>
<summary>
<img src="guide-media/editor-add-menu.png" alt="Editor add menu">
<strong>1. Start with the root</strong>
<p>One Anchor or Container should own the page before anything else exists.</p>
</summary>
<div class="example-body">
<p>Build the root first, then layer on the title, body, buttons, and state. This keeps the layout from turning into a floating junk pile.</p>
<div class="popup-note">A good root makes the rest of the menu easier to reason about.</div>
</div>
</details>

<details class="example-card" open>
<summary>
<img src="guide-media/outliner-pages.png" alt="Outliner pages">
<strong>2. Split the page cleanly</strong>
<p>Use parent groups and page roots so the tree does not become a swamp.</p>
</summary>
<div class="example-body">
<p>Keep pages separate, then connect them through visibility or state variables. That way the logic stays readable when the menu grows.</p>
<div class="popup-note">If the tree looks tidy, future changes are less painful.</div>
</div>
</details>

<details class="example-card" open>
<summary>
<img src="guide-media/texture-slot-panel.png" alt="Texture slot panel">
<strong>3. Wire the actual behavior</strong>
<p>Once the layout looks good, connect the real toggles, textures, or values.</p>
</summary>
<div class="example-body">
<p>Do not start by wiring everything. First make the layout behave, then attach the actual state.</p>
<div class="popup-note">The visual frame should be stable before the logic gets fancy.</div>
</div>
</details>

<details class="example-card" open>
<summary>
<img src="guide-media/shape-key-panel.png" alt="Shape key panel">
<strong>4. Test with one messy case</strong>
<p>Check the ugly edge case before you declare victory.</p>
</summary>
<div class="example-body">
<p>Try a weird toggle, a long label, or an empty state. If the page still behaves, it is probably ready for real use.</p>
<div class="popup-note">A menu that survives ugly input is usually the one people remember as "solid."</div>
</div>
</details>
</div>
