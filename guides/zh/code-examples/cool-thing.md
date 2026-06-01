# 怎么做出一个酷东西

<p class="lead">一条实用路径，帮你把空白页变成看起来像有意图，而不是临时拼出来的东西。</p>

<div class="example-strip">
<details class="example-card" open>
<summary>
<img src="guide-media/editor-add-menu.png" alt="Editor add menu">
<strong>1. 先搭根节点</strong>
<p>在别的东西出现之前，先让一个 Anchor 或 Container 把页面管起来。</p>
</summary>
<div class="example-body">
<p>先做根节点，再往上叠标题、正文、按钮和状态。这样布局不会变成一堆漂浮垃圾。</p>
<div class="popup-note">好的根节点会让后面的菜单更容易理解。</div>
</div>
</details>

<details class="example-card" open>
<summary>
<img src="guide-media/outliner-pages.png" alt="Outliner pages">
<strong>2. 清楚地拆分页</strong>
<p>用父组和页面根节点，别让树变成沼泽。</p>
</summary>
<div class="example-body">
<p>把页面分开，再通过可见性或状态变量连接它们。这样菜单变大时，逻辑还是能看懂。</p>
<div class="popup-note">树结构整齐，后续修改就没那么痛苦。</div>
</div>
</details>

<details class="example-card" open>
<summary>
<img src="guide-media/texture-slot-panel.png" alt="Texture slot panel">
<strong>3. 接上真实行为</strong>
<p>布局好看之后，再连接真正的开关、贴图或数值。</p>
</summary>
<div class="example-body">
<p>别一上来就把所有东西都接好。先让布局能工作，再把真实状态接上去。</p>
<div class="popup-note">视觉框架要先稳住，逻辑才可以开始花。</div>
</div>
</details>

<details class="example-card" open>
<summary>
<img src="guide-media/shape-key-panel.png" alt="Shape key panel">
<strong>4. 用一个最脏的情况来测试</strong>
<p>先检查最丑的边界情况，再宣布胜利。</p>
</summary>
<div class="example-body">
<p>试一个怪开关、超长标签，或者空状态。如果页面还能正常工作，那它大概率已经能上实战了。</p>
<div class="popup-note">能扛住脏输入的菜单，通常才会被记成“稳”。</div>
</div>
</details>
</div>
