(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const modalIds = ["emailModal", "hobbyModal", "qrModal"];
  const toast = $("#toast");
  let lastFocused = null;
  let toastTimer = null;

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    const close = modal.querySelector("[data-close]");
    if (close) close.focus();
    if (id === "qrModal") renderQrCode();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    if (modalIds.every((id) => document.getElementById(id).hidden)) {
      document.body.style.overflow = "";
    }
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  modalIds.forEach((id) => {
    const modal = document.getElementById(id);
    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest("[data-close]")) closeModal(modal);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      modalIds.forEach((id) => {
        const modal = document.getElementById(id);
        if (!modal.hidden) closeModal(modal);
      });
    }
  });

  $("#emailOpen").addEventListener("click", () => openModal("emailModal"));
  $("#hobbyOpen").addEventListener("click", () => openModal("hobbyModal"));
  $("#qrOpen").addEventListener("click", () => openModal("qrModal"));

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const temp = document.createElement("textarea");
        temp.value = text;
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.select();
        const copied = document.execCommand("copy");
        temp.remove();
        if (!copied) throw new Error("Copy command unavailable");
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  $("#copyEmail").addEventListener("click", async () => {
    const email = $("#emailAddress").textContent.trim();
    const success = await copyText(email);
    $("#copyFeedback").textContent = success ? "Email copied successfully!" : "Copy failed — please select and copy the email.";
  });

  $("#shareButton").addEventListener("click", async () => {
    const shareData = {
      title: "SADMAN GALIB | Link in Bio",
      text: "Connect with SADMAN GALIB — Professional Gamer.",
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        const success = await copyText(window.location.href);
        showToast(success ? "Profile link copied!" : "Copy the page URL from your browser.");
      }
    } catch (error) {
      if (error.name !== "AbortError") showToast("Unable to share right now.");
    }
  });

  function renderQrCode() {
    const target = $("#qrcode");
    const url = window.location.href;
    $("#qrUrl").textContent = url;
    target.innerHTML = "";
    if (!window.QRCode) {
      target.textContent = "QR library could not load. Check your internet connection.";
      target.style.color = "#222";
      target.style.fontSize = "11px";
      target.style.maxWidth = "190px";
      return;
    }
    new QRCode(target, {
      text: url,
      width: 180,
      height: 180,
      colorDark: "#101426",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  $("#copyLink").addEventListener("click", async () => {
    const success = await copyText(window.location.href);
    $("#qrFeedback").textContent = success ? "Page link copied!" : "Copy failed — copy the URL shown in your browser.";
  });

  const themeToggle = $("#themeToggle");
  const themeIcon = $("#themeIcon");
  let savedTheme = null;
  try { savedTheme = localStorage.getItem("sadman-linkhub-theme"); } catch (_) {}
  if (savedTheme === "light") document.body.classList.add("light");
  updateThemeIcon();

  function updateThemeIcon() {
    const isLight = document.body.classList.contains("light");
    themeIcon.textContent = isLight ? "☾" : "☼";
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    themeToggle.title = isLight ? "Switch to dark theme" : "Switch to light theme";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    try { localStorage.setItem("sadman-linkhub-theme", document.body.classList.contains("light") ? "light" : "dark"); } catch (_) {}
    updateThemeIcon();
  });

  // Lightweight animated background particles; pauses when the tab is hidden.
  const canvas = $("#particles");
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let particles = [];
  let frameId = null;

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(65, Math.max(25, Math.floor(window.innerWidth / 19)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + .4,
      vx: (Math.random() - .5) * .22,
      vy: (Math.random() - .5) * .22,
      a: Math.random() * .5 + .15
    }));
  }

  function drawParticles() {
    if (document.hidden || reduceMotion) {
      frameId = null;
      return;
    }
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const isLight = document.body.classList.contains("light");
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? `rgba(80, 95, 170, ${p.a * .45})` : `rgba(${i % 2 ? "91, 210, 255" : "163, 143, 255"}, ${p.a})`;
      ctx.fill();
    });
    frameId = window.requestAnimationFrame(drawParticles);
  }

  function startParticles() {
    if (!reduceMotion && !frameId && !document.hidden) frameId = window.requestAnimationFrame(drawParticles);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    if (frameId) { window.cancelAnimationFrame(frameId); frameId = null; }
    startParticles();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && frameId) {
      window.cancelAnimationFrame(frameId);
      frameId = null;
    } else startParticles();
  });
  resizeCanvas();
  startParticles();
})();
