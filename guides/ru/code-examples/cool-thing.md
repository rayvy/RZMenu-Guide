# Как сделать крутую штуку

<p class="lead">Практический путь от пустой страницы до чего-то, что выглядит осознанно, а не как случайный набор окон и паники.</p>

<div class="example-strip">
<details class="example-card" open>
<summary>
<img src="guide-media/editor-add-menu.png" alt="Редактор add menu">
<strong>1. Сначала сделай корень</strong>
<p>Один Anchor или Container должен владеть страницей, прежде чем там вообще появится что-то ещё.</p>
</summary>
<div class="example-body">
<p>Сначала строишь root, потом на него навешиваешь заголовок, тело, кнопки и состояние. Тогда верстка не расползается в плавающую свалку.</p>
<div class="popup-note">Хороший корень делает весь остальной меню-каркас менее противным.</div>
</div>
</details>

<details class="example-card" open>
<summary>
<img src="guide-media/outliner-pages.png" alt="Страницы в Outliner">
<strong>2. Разделяй страницу нормально</strong>
<p>Используй группы родителей и page root, чтобы дерево не превратилось в болото.</p>
</summary>
<div class="example-body">
<p>Держи страницы отдельно, а потом связывай их через visibility или state variables. Тогда логика остаётся читаемой, даже когда меню разрастается.</p>
<div class="popup-note">Если дерево выглядит аккуратно, потом меньше боли на правках.</div>
</div>
</details>

<details class="example-card" open>
<summary>
<img src="guide-media/texture-slot-panel.png" alt="Панель texture slot">
<strong>3. Подключай реальное поведение</strong>
<p>Когда макет уже нормальный, вешай настоящие тогглы, текстуры или значения.</p>
</summary>
<div class="example-body">
<p>Не начинай с того, чтобы навалить всё сразу. Сначала сделай, чтобы layout жил, а уже потом цепляй состояние.</p>
<div class="popup-note">Визуальная рамка должна быть стабильной, прежде чем логика начнёт чудить.</div>
</div>
</details>

<details class="example-card" open>
<summary>
<img src="guide-media/shape-key-panel.png" alt="Панель shape key">
<strong>4. Проверь на одном мерзком кейсе</strong>
<p>Посмотри на гадкий edge case до того, как объявишь победу.</p>
</summary>
<div class="example-body">
<p>Потестируй странный тоггл, длинную надпись или пустое состояние. Если страница всё ещё живая, значит она уже почти рабочая.</p>
<div class="popup-note">Меню, которое переживает мерзкий ввод, обычно потом и называют "нормальным".</div>
</div>
</details>
</div>
