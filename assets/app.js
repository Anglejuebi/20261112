/* 从任务级泛化到中心级适配 — deck navigation
   scroll-snap does the heavy lifting; this script keeps the
   HUD, rail, counter and keyboard in sync. */

(function () {
  "use strict";

  var deck = document.getElementById("deck");
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var rail = document.getElementById("rail");
  var chapter = document.getElementById("chapter");
  var bar = document.getElementById("bar");
  var cur = document.getElementById("cur");
  var total = document.getElementById("total");
  var hint = document.getElementById("hint");

  total.textContent = pad(slides.length);

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  /* ---- build rail ---- */
  var buttons = slides.map(function (slide, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "第 " + (i + 1) + " 页：" + (slide.dataset.chapter || ""));
    b.title = pad(i + 1) + " · " + (slide.dataset.chapter || "");
    b.addEventListener("click", function () {
      go(i);
    });
    rail.appendChild(b);
    return b;
  });

  var current = 0;

  function setActive(i) {
    if (i === current) return;
    current = i;
    slides.forEach(function (s, k) {
      s.classList.toggle("is-active", k === i);
    });
    buttons.forEach(function (b, k) {
      if (k === i) b.setAttribute("aria-current", "true");
      else b.removeAttribute("aria-current");
    });
    chapter.textContent = slides[i].dataset.chapter || "";
    cur.textContent = pad(i + 1);
    if (hint && i > 0) hint.classList.add("hide");
  }

  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    slides[i].scrollIntoView({ behavior: "smooth", block: "start" });
    /* scrollIntoView on a snap container is reliable, but the
       observer may lag on fast input — set state immediately. */
    setActive(i);
  }

  /* ---- track the visible slide ---- */
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio > 0.55) {
          var i = slides.indexOf(e.target);
          if (i >= 0) setActive(i);
        }
      });
    },
    { root: deck, threshold: [0.55, 0.75] }
  );
  slides.forEach(function (s) {
    io.observe(s);
  });

  /* ---- progress bar ---- */
  var ticking = false;
  deck.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var max = deck.scrollHeight - deck.clientHeight;
        var p = max > 0 ? deck.scrollTop / max : 0;
        bar.style.width = (p * 100).toFixed(2) + "%";
        ticking = false;
      });
    },
    { passive: true }
  );

  /* ---- keyboard ---- */
  var nextKeys = ["ArrowDown", "ArrowRight", "PageDown", " ", "Spacebar"];
  var prevKeys = ["ArrowUp", "ArrowLeft", "PageUp"];

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightboxOpen) {
      closeBox();
      return;
    }
    if (lightboxOpen) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (nextKeys.indexOf(e.key) >= 0) {
      e.preventDefault();
      go(current + 1);
    } else if (prevKeys.indexOf(e.key) >= 0) {
      e.preventDefault();
      go(current - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(slides.length - 1);
    }
  });

  /* ---- swallow trackpad momentum after a slide change ---- */
  var lockUntil = 0;
  deck.addEventListener(
    "scroll",
    function () {
      if (Date.now() < lockUntil) return;
    },
    { passive: true }
  );

  /* ---- figure lightbox ---- */
  var box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", "放大查看图片");
  box.innerHTML = '<img alt=""><div class="lightbox__hint">点击任意位置或按 Esc 关闭</div>';
  document.body.appendChild(box);
  var boxImg = box.querySelector("img");
  var lightboxOpen = false;

  function openBox(src, alt) {
    boxImg.src = src;
    boxImg.alt = alt || "";
    box.classList.add("open");
    lightboxOpen = true;
  }
  function closeBox() {
    box.classList.remove("open");
    lightboxOpen = false;
  }

  slides.forEach(function (slide) {
    Array.prototype.forEach.call(slide.querySelectorAll("figure.fig img"), function (img) {
      img.setAttribute("title", "点击放大原图");
      img.addEventListener("click", function () {
        openBox(img.currentSrc || img.src, img.alt);
      });
    });
  });
  box.addEventListener("click", closeBox);

  /* ---- initial state ---- */
  slides[0].classList.add("is-active");
  buttons[0].setAttribute("aria-current", "true");
  chapter.textContent = slides[0].dataset.chapter || "";
})();
