/* ============================================================
   PogoLink 官网 · 全局交互脚本
   覆盖：导航 / 移动端菜单 / 滚动揭示 / 回到顶部 / Toast /
         统计数字动画 / 产品筛选 / 详情页渲染 / 登录专区 / 表单
   ============================================================ */
(function () {
  "use strict";

  var D = window.SITE || {};

  /* ---------- 工具 ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function toast(msg, type) {
    var wrap = $(".toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-wrap";
      document.body.appendChild(wrap);
    }
    var el = document.createElement("div");
    el.className = "toast " + (type || "");
    el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(function () {
      el.style.opacity = "0";
      el.style.transition = "opacity .3s";
      setTimeout(function () { el.remove(); }, 320);
    }, 3200);
  }
  window.PogoToast = toast;

  function getParam(name) {
    var m = new RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

  /* ---------- 顶部导航：滚动阴影 ---------- */
  var header = $(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 10);
    var bt = $(".back-top");
    if (bt) bt.classList.toggle("show", window.scrollY > 400);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 移动端菜单 ---------- */
  var toggle = $(".menu-toggle");
  var nav = $(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
    });
    $all(".main-nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.classList.remove("open");
      });
    });
  }

  /* ---------- 滚动揭示 ---------- */
  var revealEls = $all(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- 回到顶部 ---------- */
  var backTop = $(".back-top");
  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 统计数字动画 ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-target"));
    if (isNaN(target)) return;
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = $all(".count-num");
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCount(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-target") + (el.getAttribute("data-suffix") || "");
    });
  }

  /* ---------- 产品中心：分类筛选 ---------- */
  var filterBar = $(".filter-bar");
  var productGrid = $("#productGrid");
  if (filterBar && productGrid && D.PRODUCTS) {
    function renderProducts(cat) {
      var list = D.PRODUCTS.filter(function (p) {
        return !cat || cat === "all" || p.category === cat;
      });
      if (!list.length) {
        productGrid.innerHTML = '<p class="empty-tip">该分类暂无产品，请联系我们了解定制方案。</p>';
        return;
      }
      productGrid.innerHTML = list.map(function (p) {
        return (
          '<article class="product-card reveal">' +
            '<a class="thumb" href="product-detail.html?id=' + p.id + '" aria-label="查看 ' + p.series + ' 详情">' +
              '<span class="series-mark">' + p.category + '</span>' +
              '<img src="' + p.thumb + '" alt="' + p.series + ' 产品图（占位，请替换为真实产品图）">' +
            '</a>' +
            '<div class="body">' +
              '<h3>' + p.series + '</h3>' +
              '<div class="en">' + p.en + '</div>' +
              '<div class="params">' +
                p.params.slice(0, 4).map(function (it) { return '<div>' + it.k + '<b>' + it.v + '</b></div>'; }).join("") +
              '</div>' +
              '<div class="card-foot">' +
                '<a class="btn-ghost-blue" href="product-detail.html?id=' + p.id + '">查看详情</a>' +
                '<a class="btn-ghost-blue" href="contact.html?product=' + encodeURIComponent(p.series) + '">询价</a>' +
              '</div>' +
            '</div>' +
          '</article>'
        );
      }).join("");
      var els = $all(".reveal", productGrid);
      els.forEach(function (el) { el.classList.add("in"); });
    }
    renderProducts("all");
    $all(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        $all(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        renderProducts(btn.getAttribute("data-filter"));
      });
    });
  }

  /* ---------- 产品详情页 ---------- */
  var detailRoot = $("#productDetail");
  if (detailRoot && D.PRODUCTS) {
    var id = getParam("id");
    var prod = null;
    if (id) {
      for (var i = 0; i < D.PRODUCTS.length; i++) {
        if (D.PRODUCTS[i].id === id) { prod = D.PRODUCTS[i]; break; }
      }
    }
    if (!prod) prod = D.PRODUCTS[0];

    document.title = prod.series + " | PogoLink 精密连接器";
    var crumb = $(".crumb");
    if (crumb) crumb.innerHTML = '<a href="index.html">首页</a> / <a href="products.html">产品中心</a> / <span>' + prod.series + "</span>";
    $("#detailTitle").textContent = prod.series;
    $("#detailEn").textContent = prod.en;
    $("#detailBrief").textContent = prod.brief;
    $("#detailImg").src = prod.thumb;
    $("#detailImg").alt = prod.series + " 产品图（占位，请替换为真实产品图）";
    $("#detailParams").innerHTML = prod.params.map(function (it) {
      return "<tr><th>" + it.k + "</th><td>" + it.v + "</td></tr>";
    }).join("");
    $("#detailFeatures").innerHTML = prod.features.map(function (f) {
      return (
        '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>' + f + "</li>"
      );
    }).join("");
    var appsEl = $("#detailApps");
    if (appsEl) appsEl.innerHTML = prod.apps.map(function (a) {
      return '<span class="filter-btn" style="cursor:default">' + a + "</span>";
    }).join("");
    var related = D.PRODUCTS.filter(function (p) { return p.id !== prod.id; }).slice(0, 3);
    $("#relatedGrid").innerHTML = related.map(function (p) {
      return (
        '<article class="product-card reveal">' +
          '<a class="thumb" href="product-detail.html?id=' + p.id + '">' +
            '<span class="series-mark">' + p.category + '</span>' +
            '<img src="' + p.thumb + '" alt="' + p.series + ' 产品图（占位）">' +
          '</a>' +
          '<div class="body">' +
            '<h3>' + p.series + '</h3>' +
            '<div class="en">' + p.en + '</div>' +
            '<div class="params">' +
              p.params.slice(0, 2).map(function (it) { return '<div>' + it.k + '<b>' + it.v + '</b></div>'; }).join("") +
            '</div>' +
            '<div class="card-foot"><a class="btn-ghost-blue" href="product-detail.html?id=' + p.id + '">查看详情</a></div>' +
          '</div>' +
        '</article>'
      );
    }).join("");
    $all(".reveal", $("#relatedGrid")).forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- 首页：核心产品（前 6 个） ---------- */
  var homeProducts = $("#homeProducts");
  if (homeProducts && D.PRODUCTS) {
    homeProducts.innerHTML = D.PRODUCTS.slice(0, 6).map(function (p) {
      return (
        '<article class="product-card reveal">' +
          '<a class="thumb" href="product-detail.html?id=' + p.id + '" aria-label="查看 ' + p.series + ' 详情">' +
            '<span class="series-mark">' + p.category + '</span>' +
            '<img src="' + p.thumb + '" alt="' + p.series + ' 产品图（占位，请替换为真实产品图）">' +
          '</a>' +
          '<div class="body">' +
            '<h3>' + p.series + '</h3>' +
            '<div class="en">' + p.en + '</div>' +
            '<div class="params">' +
              p.params.slice(0, 4).map(function (it) { return '<div>' + it.k + '<b>' + it.v + '</b></div>'; }).join("") +
            '</div>' +
            '<div class="card-foot">' +
              '<a class="btn-ghost-blue" href="product-detail.html?id=' + p.id + '">查看详情</a>' +
              '<a class="btn-ghost-blue" href="contact.html?product=' + encodeURIComponent(p.series) + '">询价</a>' +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join("");
    $all(".reveal", homeProducts).forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- 首页：新闻 + 弹窗 ---------- */
  var newsList = $("#newsList");
  var modal = $("#newsModal");
  if (newsList && D.NEWS) {
    newsList.innerHTML = D.NEWS.map(function (n, i) {
      return (
        '<article class="news-item reveal">' +
          '<div class="news-date">' + n.date + " · " + n.tag + "</div>" +
          "<h3>" + n.title + "</h3>" +
          "<p>" + n.summary + "</p>" +
          '<button type="button" class="news-more btn-ghost-blue" data-news="' + i + '">阅读全文</button>' +
        "</article>"
      );
    }).join("");
    $all(".reveal", newsList).forEach(function (el) { el.classList.add("in"); });
  }
  if (modal && D.NEWS) {
    function closeNews() {
      modal.hidden = true;
      document.body.style.overflow = "";
    }
    function openNews(i) {
      var n = D.NEWS[i];
      if (!n) return;
      $("#newsModalDate").textContent = n.date + " · " + n.tag;
      $("#newsModalTitle").textContent = n.title;
      $("#newsModalBody").innerHTML = n.paragraphs.map(function (p) { return "<p>" + p + "</p>"; }).join("");
      modal.hidden = false;
      document.body.style.overflow = "hidden";
    }
    newsList.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-news]");
      if (btn) openNews(parseInt(btn.getAttribute("data-news"), 10));
    });
    $all("[data-close]", modal).forEach(function (el) { el.addEventListener("click", closeNews); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNews(); });
  }

  /* ---------- 客户专区：登录 + 门户 ---------- */
  var loginPanel = $("#loginPanel");
  var portalPanel = $("#portalPanel");
  var loginForm = $("#loginForm");
  var SESSION_KEY = "pogolink_portal_session";

  function isLoggedIn() {
    try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch (e) { return false; }
  }
  function renderPortal() {
    if (!portalPanel) return;
    var ok = isLoggedIn();
    if (loginPanel) loginPanel.style.display = ok ? "none" : "block";
    if (portalPanel) portalPanel.style.display = ok ? "block" : "none";
    if (ok) {
      $("#portalUserName").textContent = "演示客户（admin）";
      var dl = $("#downloadList");
      if (dl && D.DOWNLOADS) {
        dl.innerHTML = D.DOWNLOADS.map(function (f) {
          return (
            '<div class="dl-item">' +
              '<svg class="dl-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>' +
              '<div class="dl-info"><b>' + f.title + '</b><span>' + f.meta + "</span></div>" +
              '<button type="button" class="btn btn-outline-dark btn-sm" data-file="' + f.title + '">下载</button>' +
            "</div>"
          );
        }).join("");
        $all(".dl-item button", dl).forEach(function (btn) {
          btn.addEventListener("click", function () {
            toast('演示站点：资料 "' + btn.getAttribute("data-file") + '" 为占位文件，正式上线后替换为真实 PDF 下载链接。');
          });
        });
      }
      var nl = $("#noticeList");
      if (nl && D.NOTICES) {
        nl.innerHTML = D.NOTICES.map(function (n) {
          return (
            '<div class="notice-item">' +
              '<span class="dot"></span>' +
              '<div><b>' + n.title + '</b><p>' + n.desc + '</p><time>' + n.date + "</time></div>" +
            "</div>"
          );
        }).join("");
      }
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var u = $("#loginUser").value.trim();
      var p = $("#loginPass").value;
      if (!u || !p) { toast("请输入账号和密码", "err"); return; }
      if (D.DEMO_ACCOUNT && u === D.DEMO_ACCOUNT.username && p === D.DEMO_ACCOUNT.password) {
        try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (e2) {}
        toast("登录成功，欢迎进入客户专区");
        renderPortal();
      } else {
        toast("账号或密码错误（演示账号 admin / 123456）", "err");
      }
    });
  }
  var logoutBtn = $("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
      toast("已退出登录");
      renderPortal();
    });
  }
  if (loginPanel && portalPanel) renderPortal();

  /* ---------- 联系我们：表单 ---------- */
  var contactForm = $("#contactForm");
  if (contactForm) {
    var prodParam = getParam("product");
    if (prodParam) {
      var d = $("#contactProduct");
      if (d) d.value = prodParam;
    }
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#cName").value.trim();
      var phone = $("#cPhone").value.trim();
      var company = $("#cCompany").value.trim();
      var msg = $("#cMessage").value.trim();
      if (!name) { toast("请填写您的姓名", "err"); return; }
      if (!/^1\d{10}$/.test(phone) && !/^[0-9+\-\s]{7,20}$/.test(phone)) {
        toast("请填写有效的联系电话", "err"); return;
      }
      if (!msg) { toast("请简单描述您的需求", "err"); return; }
      toast("提交成功！我们的销售工程师将在 1 个工作日内与您联系。");
      contactForm.reset();
    });
  }

  /* ---------- 首页轮播（静态渐入，自动循环） ---------- */
  var heroH1 = $("#heroHeadline");
  if (heroH1) {
    var slides = [
      "精于毫厘，连接可靠",
      "一站式 Pogo Pin 定制解决方案",
      "月产能 4,000 万件，交付有保障"
    ];
    var idx = 0;
    function fadeHeadline() {
      heroH1.style.opacity = "0";
      heroH1.style.transition = "opacity .35s ease";
      setTimeout(function () {
        idx = (idx + 1) % slides.length;
        heroH1.textContent = slides[idx];
        heroH1.style.opacity = "1";
      }, 380);
    }
    setInterval(fadeHeadline, 4200);
  }
})();
