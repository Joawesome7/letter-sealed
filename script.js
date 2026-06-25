(function () {
  // ============================================================
  // EDIT THIS BLOCK to personalize the letter. Nothing else
  // needs to change. The QR code points to "shareUrl" — replace
  // that with the real address once you host this file
  // somewhere; a QR code can't encode a file sitting on your
  // own computer.
  // ============================================================
  const CONFIG = {
    recipientName: "bravest Girl!!!",
    senderName: "Love Jb 💞😚",
    pin: "5683", // 5683 = L-O-V-E on a phone keypad. Use any 4 digits.
    shareUrl: window.location.href,
    paragraphs: [
      "Happpyyy birthdayyyy😙 Hinintay ko talaga ang oras ng kaarawan mo HAHAHA 17 kanaaa🥹 tanda mo na, Joke HAHAHA ito seryoso na, sa araw mo gusto ko sabihin lahat ng gusto ko sabihin sayo, gusto ko sabihin na I'm veryy veryy proud of you kasi, nakakayanan mo yung mga pagsubok na nararanasan mo, yung mga bagay na alam kong hindi mo rin kaya sabihin pero alam kong kinakaya mo, stand still loveyyy, andito lang ako and susuportahan kita sa lahat ng bagay na gusto mong gawin, at sasamahan ka sa mga pagsubok mo. Ngayon ko nasasabi na hindi lahat ng babae ay pare-parehas, kasi ikaw yung babae na hindi poproblemahin, ikaw yung babae na go sa lahat at willing magbigay ng effort para sa minamahal, at kayang mag sacrifice at ibigay yung makakaya, sobrang na appreciate ko yung bagay na kahit alam mong delikado ginagawa mo parin, at pinaparandam mo parin na may mas mahalaga (Naiiyak ako HAHAHA Joke) sobrang proud din ako sa bagay na sinasabi mong hindi mo kaya pero nakakayanan mo, sobrang hirap na pero nakikita kong kinakaya mo. Alam ko maraming learnings at challenges ang mararanasan mo in the near future pero naniniwala ako na kaya mo, at gusto ko lang ipaalala na andito ako, wag mo alalahanin na iiwan kita, diba nga, liligawan pa kita, magpapakilala pa ako sa angkan mo, kahit maging sa 2030 maghihintay ako, wag mo sukatin yung taon, kasi hindi taon yung basehan ng pagmamahal, kundi yung habang buhay na pagmamahalan.",

      "On your special day, I pray na mapunonng saya ang iyong kaarawan, wag mo muna isipin yung mga bagay na kailangan tapusin, at mga problema, maging masaya ka sa iyong kaarawan, and I hope na maging successful yung plans mo in life and maging masaya ka pagnna achieve mo na. Always remember na andito lang ako lagi sa tabi mo, and laging proud sa lahat ng ginagawa mo. Hihintayin kita hanggang sa pwede kana, walang mahirap sa tunay na love hehe, and again I hope this day narandaman mong hindi lang special ang araw mo kundi araw araw kang special sa taong minamahal mo.",
    ],
  };
  // ============================================================

  const pinLength = CONFIG.pin.length;
  let entered = "";

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
  const audioEl = document.getElementById("bgMusic");

  const MUSIC_TARGET_VOLUME = 0.45; // 0 to 1. Lower this if "quiet" should mean quieter.

  function fadeInAudio() {
    audioEl.volume = 0;
    audioEl.play().catch(() => {
      // Autoplay was blocked. Nothing breaks, the letter just plays silently.
      // It will still play if the person interacts with the page again afterward.
    });
    const steps = 20;
    const stepTime = 1500 / steps;
    let i = 0;
    const fade = setInterval(() => {
      i++;
      audioEl.volume = Math.min(
        MUSIC_TARGET_VOLUME,
        (MUSIC_TARGET_VOLUME * i) / steps,
      );
      if (i >= steps) clearInterval(fade);
    }, stepTime);
  }

  for (let i = 0; i < pinLength; i++) {
    const dot = document.createElement("span");
    dot.className = "pin-dot";
    pinDotsEl.appendChild(dot);
  }

  headingEl.textContent = `To my ${CONFIG.recipientName},`;
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
      fadeInAudio();
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
})();
