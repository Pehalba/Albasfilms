(function () {
  "use strict";

  var modal = null;
  var video = null;
  var titleEl = null;
  var externalEl = null;
  var closeBtn = null;
  var lastFocus = null;

  function ensureModal() {
    if (modal) return;
    modal = document.createElement("div");
    modal.className = "pf-lightbox";
    modal.id = "pfLightbox";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "pfLightboxTitle");
    modal.innerHTML =
      '<div class="pf-lightbox-backdrop" data-pf-close="1"></div>' +
      '<div class="pf-lightbox-panel">' +
      '<div class="pf-lightbox-head">' +
      '<h2 class="pf-lightbox-title" id="pfLightboxTitle"></h2>' +
      '<button type="button" class="pf-lightbox-close" aria-label="Fechar">&times;</button>' +
      "</div>" +
      '<div class="pf-lightbox-video-wrap">' +
      '<video controls playsinline preload="none"></video>' +
      "</div>" +
      '<div class="pf-lightbox-foot">' +
      '<a class="pf-lightbox-external" href="#" target="_blank" rel="noopener noreferrer" hidden>Abrir no Instagram</a>' +
      "</div>" +
      "</div>";
    document.body.appendChild(modal);
    video = modal.querySelector("video");
    titleEl = modal.querySelector("#pfLightboxTitle");
    externalEl = modal.querySelector(".pf-lightbox-external");
    closeBtn = modal.querySelector(".pf-lightbox-close");
    closeBtn.addEventListener("click", close);
    modal.querySelector("[data-pf-close]").addEventListener("click", close);
  }

  function clearVideo() {
    if (!video) return;
    video.pause();
    video.removeAttribute("src");
    video.load();
  }

  function open(src, title, externalUrl, externalLabel) {
    ensureModal();
    lastFocus = document.activeElement;
    titleEl.textContent = title || "Vídeo";
    clearVideo();
    video.src = src;
    video.load();
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }

    if (externalUrl) {
      externalEl.hidden = false;
      externalEl.href = externalUrl;
      externalEl.textContent = externalLabel || "Abrir link externo";
      if (/instagram\.com/i.test(externalUrl)) {
        externalEl.textContent = "Abrir no Instagram";
      } else if (/drive\.google|photos\.google/i.test(externalUrl)) {
        externalEl.textContent = "Abrir entrega";
      }
    } else {
      externalEl.hidden = true;
      externalEl.removeAttribute("href");
    }

    modal.hidden = false;
    document.body.classList.add("pf-lightbox-open");
    closeBtn.focus();
  }

  function close() {
    if (!modal || modal.hidden) return;
    clearVideo();
    modal.hidden = true;
    document.body.classList.remove("pf-lightbox-open");
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  function triggerTitle(el) {
    var card = el.closest(".folder-card");
    if (card) {
      var name = card.querySelector(".folder-name");
      if (name) return name.textContent.trim();
    }
    var fileName = el.querySelector(".file-name");
    if (fileName) return fileName.textContent.trim();
    return el.getAttribute("aria-label") || "Vídeo";
  }

  function externalFrom(el) {
    var custom = el.getAttribute("data-external");
    if (custom) return custom;
    var href = el.getAttribute("href") || "";
    if (/^https?:\/\//i.test(href) && !/\.mp4($|\?)/i.test(href)) return href;
    var card = el.closest(".folder-card");
    if (card) {
      var ig = card.querySelector(".folder-arrow[href^='http']");
      if (ig) return ig.getAttribute("href");
    }
    return "";
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-video]");
    if (!trigger) return;
    var src = trigger.getAttribute("data-video");
    if (!src) return;
    e.preventDefault();
    open(src, triggerTitle(trigger), externalFrom(trigger));
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
})();
