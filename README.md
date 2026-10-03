# PogoLink 精密连接器科技 · 企业官网（纯静态版）

一个可直接部署到任意虚拟主机 / 服务器 / 对象存储的**纯 HTML + CSS + JavaScript 静态网站**，无后端依赖。

## 一、目录结构

```
pogo-pin-website/
├── index.html            # 首页（品牌主视觉 / 产品入口 / 实力数据 / 应用领域 / 客户Logo / 新闻）
├── products.html         # 产品中心（按系列筛选）
├── product-detail.html   # 产品详情页（?id= 自动渲染对应系列）
├── applications.html     # 应用场景（6 大行业）
├── about.html            # 关于我们（简介 / 发展历程时间轴 / 产能 / 认证）
├── customer.html         # 客户专区（登录后可看资料下载与新品通知）
├── contact.html          # 联系我们（联系方式 + 在线留言表单）
├── css/style.css         # 全局样式（深蓝 + 金属灰工业风）
├── js/data.js            # 产品 / 新闻 / 资料 / 通知数据（改这里即可更新内容）
├── js/main.js            # 全局交互逻辑
└── assets/               # 占位图片（SVG），替换为真实图片后同名覆盖即可
```

## 二、本地预览

直接用浏览器打开 `index.html` 即可（无需安装任何环境）。
建议用 VS Code 等编辑器修改文件后刷新浏览器查看。

## 三、替换占位内容（上线前必做）

| 内容 | 位置 | 说明 |
| --- | --- | --- |
| 品牌名 PogoLink | 全站（编辑器全局搜索替换） | 替换为公司真实中英文品牌名 |
| 联系方式 / 地址 / 邮箱 | 各页页脚 + contact.html | 全部标注了「占位」字样 |
| 产品参数（电流/高度/寿命等） | `js/data.js` 的 `SITE.PRODUCTS` | 按公司真实规格表修改 |
| 公司实力数据（型号数/产能/良率） | index.html / about.html 的 `data-target` | 修改数字即可，动画自动适配 |
| 产品图 / 场景图 / 厂房图 | `assets/` 下的 SVG 占位图（已按系列命名，如 `placeholder-product-standard.svg`） | 替换为真实 JPG/PNG/WebP，**保持同名**则无需改代码；或改 `js/data.js` 与 HTML 中的图片路径 |
| 发展历程 / 认证资质 / 新闻 | about.html / index.html + data.js | 按公司真实信息修改 |
| 客户专区账号 | `js/data.js` 的 `SITE.DEMO_ACCOUNT` | 演示账号 admin / 123456，正式上线请接入真实后端鉴权 |
| ICP 备案号 | 各页页脚 | 备案后填写 |

> 提示：图片建议尺寸——产品图 800×600（4:3）、场景图 800×540（16:10.8）、厂房图 900×600（3:2），与占位图比例一致，替换后不会变形。

## 四、部署到服务器 / 虚拟主机

本网站是纯静态文件，**不需要** PHP / Node / 数据库，以下两种方式任选：

### 方式 A：虚拟主机 / 服务器（FTP / 宝塔面板 / SSH）

1. 将 `pogo-pin-website` 目录下的**所有文件**（index.html、css、js、assets）上传到主机 Web 根目录。
   - 常见根目录：`/www/wwwroot/你的域名/`（宝塔）、`public_html/`（cPanel）、`htdocs/`（XAMPP）、`/var/www/html/`（Nginx/Apache 默认）
   - **不要把 `pogo-pin-website` 这层文件夹也传上去**，要让 `index.html` 直接在根目录，否则访问 `www.你的域名.com` 不会自动打开首页。
2. 上传完成后，浏览器访问你的域名即可看到网站。

### 方式 B：对象存储 / CDN（腾讯云 COS、阿里云 OSS、七牛云等）

1. 在控制台创建 Bucket，把文件全部上传；
2. 开启「静态网站托管」并指定默认首页为 `index.html`；
3. 绑定自定义域名即可。

## 五、绑定域名

1. 在域名服务商（阿里云 / 腾讯云 / GoDaddy 等）解析一条 **A 记录**（指向主机 IP）或 **CNAME 记录**（指向虚拟主机/存储分配的域名）；
2. 等待解析生效（一般 10 分钟 – 2 小时）；
3. 若使用虚拟主机，需在主机面板「域名绑定」里添加该域名；
4. 若在中国大陆服务器部署，域名需完成 **ICP 备案** 后方可正常访问。

## 六、在 GitHub 上管理版本

本仓库即源码托管位置。每次修改后：

```bash
git add .
git commit -m "更新说明"
git push
```

需要回退版本时，在 GitHub 仓库页面查看 Commit 历史即可找回旧版本。

## 七、可选：用 GitHub Pages 免费托管

1. 仓库 Settings → Pages → Source 选择分支 `main`，目录选 `/ (root)`；
2. 保存后等待几分钟，访问 `https://你的用户名.github.io/pogo-pin-website/` 即可在线预览；
3. 正式使用仍建议部署到自己的服务器并绑定域名。

---

*本网站为示例占位站点，所有公司名称、数据、联系方式均为占位内容，正式上线前请替换为公司真实信息。*
