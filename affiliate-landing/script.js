/**
 * 联盟落地页 - 公共脚本
 * 含联盟链接跳转埋点 trackAffiliateClick，便于接入 Google Analytics
 */

(function () {
  'use strict';

  /**
   * 联盟点击埋点（跳转页 /go/xxx.html 使用，先埋点再跳转）
   * @param {string} productName - 产品标识，如 'product-name'
   * @param {string} source - 来源，如 'hero' | 'nav' | 'article' | 'direct'
   */
  function trackAffiliateClick(productName, source) {
    if (typeof console !== 'undefined' && console.log) {
      console.log('[Affiliate]', productName, source);
    }
    try {
      if (typeof gtag === 'function') {
        gtag('event', 'affiliate_click', {
          product: productName,
          source: source || 'direct'
        });
      }
    } catch (e) {
      // 未安装 GA 或 gtag 未加载时不报错
    }
  }

  /**
   * CTA 点击埋点（落地页内按钮点击时可选使用，预留 GA 接入）
   * @param {string} ctaName - 埋点名称，如 'hero' | 'why' | 'final'
   * @param {string} [label] - 可选标签，如按钮文案
   */
  function trackCtaClick(ctaName, label) {
    if (typeof console !== 'undefined' && console.info) {
      console.info('[CTA]', ctaName, label || '');
    }
    try {
      if (typeof gtag === 'function') {
        gtag('event', 'cta_click', {
          cta_location: ctaName,
          cta_label: label || ''
        });
      }
    } catch (e) {}
  }

  /**
   * 为所有 CTA 链接绑定点击追踪并统一跳转
   */
  function initCtaTracking() {
    var links = document.querySelectorAll('.cta-link[data-cta]');
    links.forEach(function (el) {
      if (el.tagName.toLowerCase() !== 'a') return;
      el.addEventListener('click', function (e) {
        var cta = el.getAttribute('data-cta') || 'unknown';
        var label = (el.textContent || '').trim();
        trackCtaClick(cta, label);
        // 若需要先发埋点再跳转，可保留默认跳转；若用 GA 的 outbound 等，可在这里做延迟跳转
      });
    });
  }

  /**
   * 可选：为页内锚点启用平滑滚动（对现代浏览器，CSS scroll-behavior: smooth 已生效，此处可做兼容）
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      var id = anchor.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    });
  }

  /**
   * 文章页：目录点击平滑滚动 + 滚动时高亮当前小节
   */
  function initArticleToc() {
    var toc = document.querySelector('.article-toc .toc-list');
    if (!toc) return;

    var links = toc.querySelectorAll('a[href^="#"]');
    var sections = [];
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var el = document.getElementById(id);
      if (el) sections.push({ id: id, link: a, el: el });
    });

    // 点击目录项：平滑滚动到对应 H2（CSS scroll-behavior 已支持，此处保证兼容）
    sections.forEach(function (s) {
      s.link.addEventListener('click', function (e) {
        e.preventDefault();
        s.el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // 滚动时高亮当前可见小节
    function setActiveSection() {
      var headerHeight = 80;
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var current = null;
      for (var i = sections.length - 1; i >= 0; i--) {
        var top = sections[i].el.getBoundingClientRect().top + scrollY;
        if (scrollY >= top - headerHeight) {
          current = sections[i];
          break;
        }
      }
      if (!current && sections.length) current = sections[0];
      sections.forEach(function (s) {
        s.link.parentElement.classList.toggle('active', s === current);
      });
    }

    if (sections.length) {
      setActiveSection();
      window.addEventListener('scroll', function () {
        requestAnimationFrame(setActiveSection);
      }, { passive: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initCtaTracking();
      initSmoothScroll();
      initArticleToc();
    });
  } else {
    initCtaTracking();
    initSmoothScroll();
    initArticleToc();
  }

  window.trackAffiliateClick = trackAffiliateClick;
  window.trackCtaClick = trackCtaClick;
})();
