# 单产品联盟营销静态站

专注「一个产品 + 内容引流 + 落地页转化」的静态网站模板，可直接部署到 GitHub Pages，无需后端。

## 项目结构

```
affiliate-landing/
├── index.html          # 首页
├── product.html        # 单产品落地页（含 Hero / 痛点 / 方案 / 优势 / 场景 / FAQ / CTA）
├── go/
│   └── product-name.html  # 联盟链接跳转页（埋点后跳转到真实联盟链接）
├── articles/
│   └── article-1.html # 示例文章页（可复制扩展更多文章）
├── style.css           # 公共样式
├── script.js           # 公共脚本（含 trackAffiliateClick 埋点）
└── README.md
```

## 部署到 GitHub Pages

### 方式一：用本仓库根目录作为站点（推荐）

1. **创建 GitHub 仓库**
   - 在 GitHub 新建一个仓库（例如 `affiliate-landing`）。
   - 若仓库名为 `你的用户名.github.io`，站点将部署在 `https://你的用户名.github.io`。
   - 若仓库名为其他（如 `affiliate-landing`），站点将部署在 `https://你的用户名.github.io/affiliate-landing/`。

2. **推送代码**
   ```bash
   cd affiliate-landing
   git init
   git add .
   git commit -m "Initial commit: single product affiliate site"
   git branch -M main
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```

3. **开启 GitHub Pages**
   - 打开仓库 → **Settings** → **Pages**。
   - **Source** 选 **Deploy from a branch**。
   - **Branch** 选 `main`（或你使用的默认分支），**Folder** 选 **/ (root)**。
   - 保存后等待 1–2 分钟，在 **Pages** 页面会显示站点地址。

4. **使用自定义域名（可选）**
   - 在 **Pages** 设置里填 **Custom domain**，按提示在 DNS 添加 CNAME 或 A 记录即可。

### 方式二：用 `docs` 目录

若希望站点来自 `main` 分支的 `docs` 目录：

1. 把当前项目里的所有文件（含 `index.html`、`product.html`、`articles/`、`style.css`、`script.js`）放进仓库里的 `docs` 目录。
2. 仓库 **Settings** → **Pages** → **Source** 选 **Deploy from a branch**，**Folder** 选 **/docs**。
3. 站点根路径为 `https://你的用户名.github.io/仓库名/`，注意站内链接需与 `docs` 下的路径一致（例如从 `docs/articles/article-1.html` 链到 `docs/product.html`）。

## 上线前必改项

1. **联盟链接**  
   见下方「联盟链接跳转管理」：只需在 `go/product-name.html` 中改一处 `AFFILIATE_URL`，无需在多个页面替换。

2. **Canonical 与 OG URL**  
   在所有页面的 `<link rel="canonical">` 和 `<meta property="og:url">` 中，把 `https://your-username.github.io/affiliate-landing/` 换成你实际的站点根 URL（与上面部署方式一致）。

3. **站点名称与产品名**  
   将「网球装备指南」等替换为你自己的网站名和产品名；若产品名变更，记得同步 `product.html`、文章页与 `go/` 下跳转页中的称呼和链接。

## 扩展更多文章

- 在 `articles/` 下复制 `article-1.html` 为 `article-2.html`、`article-3.html` 等。
- 修改每篇文章的 `title`、`meta description`、`canonical`、`og:*` 以及正文中的 H1/H2/H3。
- 在文章内自然插入指向 `../product.html` 的链接。
- 在首页 `index.html` 和页脚导航中按需增加对新文章页的链接。

## 联盟链接跳转管理

所有 CTA 不直接写死联盟链接，而是链到统一跳转页（如 `/go/product-name.html`），由跳转页执行埋点后再跳转到真实联盟地址。这样方便**统一替换链接**和**统计点击**。

### 如何替换联盟链接

1. 打开 `go/product-name.html`。
2. 在页面顶部脚本中找到并修改这一行：
   ```javascript
   var AFFILIATE_URL = 'https://example.com/affiliate-link';
   ```
   改为你的真实联盟链接（可带 ref、tag 等参数），保存即可。全站所有指向 `go/product-name.html` 的按钮都会跳转到新链接，无需改其他页面。

### 如何新增第二个产品跳转页

1. 在 `go/` 目录下复制 `product-name.html`，重命名为新产品标识，例如 `go/product-b.html`。
2. 打开新文件，修改两处：
   - `AFFILIATE_URL`：改为该产品的联盟链接。
   - `PRODUCT_NAME`：改为便于统计的标识，如 `'product-b'`。
3. 在落地页或文章页中，将需要跳转到该产品的 CTA 链接改为 `go/product-b.html?from=xxx`（`from` 建议用 `hero`、`nav`、`article`、`final` 等，便于在 GA 中区分来源）。

### 埋点说明

- 跳转页加载后会调用 `trackAffiliateClick(productName, source)`，其中 `source` 来自 URL 参数 `?from=xxx`。
- 该函数在 `script.js` 中定义：先用 `console.log` 模拟，并预留了 Google Analytics `gtag` 调用；未安装 GA 时不会报错。

---

## 如何接入 Google Analytics

1. **安装 gtag**  
   在全部页面的 `<head>` 中（或通过 GTM）加入 GA4 提供的 gtag 脚本，例如：
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){ dataLayer.push(arguments); }
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

2. **联盟点击已预留**  
   `script.js` 中的 `trackAffiliateClick(productName, source)` 内已预留：
   ```javascript
   if (typeof gtag === 'function') {
     gtag('event', 'affiliate_click', { product: productName, source: source || 'direct' });
   }
   ```
   只要页面加载了 gtag，跳转页在执行跳转前会自动发送 `affiliate_click` 事件，可在 GA4 的「事件」中查看，并按 `product`、`source` 做分析。

3. **未安装 GA 时**  
   代码放在 `try/catch` 中，且会先判断 `typeof gtag === 'function'`，因此即使用户未安装 GA 也不会报错，仅会执行 `console.log` 模拟。

---

## 技术说明

- 纯 HTML + CSS + JavaScript，无构建步骤，无后端。
- 适配移动端，样式集中在 `style.css`，便于统一修改。
- 每个页面均包含基础 SEO：`title`、`meta description`、`canonical`、Open Graph。
- 使用语义化标签与清晰的标题层级（H1/H2/H3），便于搜索引擎与可访问性。

## 许可与免责

本模板可自由修改与使用。实际推广产品时请遵守各平台联盟条款，并在页脚保留 affiliate 声明（模板中已含示例文案）。
