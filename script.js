(function () {
  // ============================================================
  // EDIT THIS BLOCK to personalize the letter. Nothing else
  // needs to change. The QR code points to "shareUrl" — replace
  // that with the real address once you host this file
  // somewhere; a QR code can't encode a file sitting on your
  // own computer.
  // ============================================================
  const CONFIG = {
    recipientName: "Faith",
    senderName: "Johnbert",
    pin: "5683", // 5683 = L-O-V-E on a phone keypad. Use any 4 digits.
    shareUrl: window.location.href,
    paragraphs: [
      "I have been trying, for longer than I will admit, to find a way to say this without it sounding like something already written by someone else. So I will just say it plainly: thank you for being who you are in the ordinary hours, the ones where no one is watching and there is nothing to prove. The mornings that ran late, the small inconveniences you absorbed without ever mentioning them, the way you remember the things I forget about myself \u2014 none of that was owed to me, and I have not forgotten that.",
      "What I appreciate most is not the grand gestures, though I remember those too. It is the steadiness. The way you stay curious about my days, even the ones that bore even me. The way an ordinary Tuesday becomes something worth keeping, simply because you were in it. I do not think I say often enough that being known this well, and chosen anyway, is the rarest thing I have.",
      "So here is the truth I keep circling back to: I am grateful for you, plainly and without metaphor, today and on every day that looks nothing like today. Thank you for staying. Thank you for being easy to love.",
    ],
  };
  // ============================================================

  const pinLength = CONFIG.pin.length;
  let entered = "";
  let qrRendered = false;

  const pinDotsEl = document.getElementById("pinDots");
  const keypadEl = document.getElementById("keypad");
  const pinErrorEl = document.getElementById("pinError");
  const pinPanelEl = document.getElementById("pinPanel");
  const envelopeEl = document.getElementById("envelope");
  const letterOverlayEl = document.getElementById("letterOverlay");
  const letterCardEl = document.getElementById("letterCard");
  const headingEl = document.getElementById("letterHeading");
  const bodyEl = document.getElementById("letterBody");
  const signEl = document.getElementById("letterSign");
  const resealBtn = document.getElementById("resealBtn");
  const shareBtn = document.getElementById("shareBtn");
  const qrPanel = document.getElementById("qrPanel");

  for (let i = 0; i < pinLength; i++) {
    const dot = document.createElement("span");
    dot.className = "pin-dot";
    pinDotsEl.appendChild(dot);
  }

  headingEl.textContent = `For ${CONFIG.recipientName},`;
  bodyEl.innerHTML = CONFIG.paragraphs.map((p) => `<p>${p}</p>`).join("");
  signEl.innerHTML = `With love,<br>${CONFIG.senderName}`;

  function updateDots() {
    const dots = pinDotsEl.querySelectorAll(".pin-dot");
    dots.forEach((d, i) => d.classList.toggle("filled", i < entered.length));
  }

  function shakeAndClear() {
    pinPanelEl.classList.add("shake");
    pinErrorEl.textContent = "That's not quite it \u2014 try again.";
    setTimeout(() => {
      pinPanelEl.classList.remove("shake");
      entered = "";
      updateDots();
    }, 420);
  }

  function tryUnseal() {
    if (entered === CONFIG.pin) {
      pinErrorEl.textContent = "";
      runUnsealSequence();
    } else {
      shakeAndClear();
    }
  }

  function addDigit(d) {
    if (entered.length >= pinLength) return;
    entered += d;
    updateDots();
    if (entered.length === pinLength) {
      setTimeout(tryUnseal, 150);
    }
  }

  function backspace() {
    entered = entered.slice(0, -1);
    updateDots();
    pinErrorEl.textContent = "";
  }

  keypadEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === "back") backspace();
    else if (action) addDigit(action);
  });

  window.addEventListener("keydown", (e) => {
    if (letterOverlayEl.classList.contains("visible")) return;
    if (/^[0-9]$/.test(e.key)) addDigit(e.key);
    else if (e.key === "Backspace") backspace();
  });

  function runUnsealSequence() {
    envelopeEl.classList.add("cracking");
    setTimeout(() => envelopeEl.classList.add("opening"), 450);
    setTimeout(() => envelopeEl.classList.add("sealed-away"), 1150);
    setTimeout(() => {
      letterOverlayEl.classList.add("visible");
      letterCardEl.classList.add("show");
    }, 1300);
    setTimeout(() => pinPanelEl.classList.add("hidden"), 1300);
  }

  resealBtn.addEventListener("click", () => {
    letterOverlayEl.classList.remove("visible");
    letterCardEl.classList.remove("show");
    qrPanel.hidden = true;
    shareBtn.textContent = "Share this letter";
    setTimeout(() => {
      envelopeEl.classList.remove("cracking", "opening", "sealed-away");
      pinPanelEl.classList.remove("hidden");
      entered = "";
      updateDots();
    }, 350);
  });

  shareBtn.addEventListener("click", () => {
    const wasHidden = qrPanel.hidden;
    qrPanel.hidden = !wasHidden;
    shareBtn.textContent = wasHidden ? "Hide QR code" : "Share this letter";
    if (wasHidden && !qrRendered) {
      qrRendered = true;
      new QRCode(document.getElementById("qrcode"), {
        text: CONFIG.shareUrl,
        width: 152,
        height: 152,
        colorDark: "#2B2418",
        colorLight: "#EDE1C9",
        correctLevel: QRCode.CorrectLevel.M,
      });
    }
  });
})();
