# 如何提交

保持简单：

1. 把可下载文件放进 `asset-dump/files/`。
2. 把预览图放进 `asset-dump/previews/`。
3. 往 `asset-dump/catalog.json` 里加一行。
4. 提交并推送。

## 文件类型

- `.rzm` 是完整存档，可以当成一个完整包来移动。
- `.rzmt` 是片段或模板块。
- `.rzmct` 是未来的自动菜单生成系统。它已经存在，但还没做完。

示例条目：

```json
{
  "name": "Example Theme",
  "type": "theme",
  "author": "Rayvich",
  "uploader": "rayvy",
  "description": "A sample RZMenu theme.",
  "file": "asset-dump/files/example-theme.rzm",
  "preview": "asset-dump/previews/example-theme.png"
}
```

工作就这么简单。仓库页面会直接读取目录并渲染这些卡片。
