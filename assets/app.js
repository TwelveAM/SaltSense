// ---------- Local Storage ----------
function saveLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function loadLS(key, fallback = null) {
  const v = localStorage.getItem(key);
  return v ? JSON.parse(v) : fallback;
}

// ---------- Tabs ----------
document.querySelectorAll(".ss-tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".ss-tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".ss-card").forEach(c =>
      c.classList.toggle("ss-card-active", c.id === btn.dataset.target)
    );
  });
});

// ---------- Intensity ----------
let selectedIntensity = loadLS("intensity", 1.0);
const intensityChips = document.querySelectorAll(".ss-chip-intensity");

intensityChips.forEach(chip => {
  if (parseFloat(chip.dataset.percent) === selectedIntensity)
    chip.classList.add("active");

  chip.addEventListener("click", () => {
    intensityChips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");

    selectedIntensity = parseFloat(chip.dataset.percent);
    saveLS("intensity", selectedIntensity);
  });
});

// ---------- General Seasoning ----------
const foodWeightInput = document.getElementById("foodWeight");
const saltTypeGeneralSelect = document.getElementById("saltTypeGeneral");

foodWeightInput.value = loadLS("foodWeight", "");
saltTypeGeneralSelect.value = loadLS("saltTypeGeneral", "fine");

calcGeneral.addEventListener("click", () => {
  const w = parseFloat(foodWeightInput.value);
  const saltType = saltTypeGeneralSelect.value;

  saveLS("foodWeight", foodWeightInput.value);
  saveLS("saltTypeGeneral", saltType);

  if (!w || w <= 0) {
    generalResult.textContent = "Enter a valid food weight.";
    return;
  }

  const grams = w * (selectedIntensity / 100);

  const notes = {
    fine: "Fine salt dissolves fast.",
    kosher: "Kosher salt is milder.",
    sea: "Sea salt melts slower."
  };

  generalResult.innerHTML = `
    <strong>${grams.toFixed(1)} g</strong> salt needed.<br>
    <span style="color:#9ca3af">${notes[saltType]}</span>
  `;
});

// ---------- General Presets ----------
document.querySelectorAll(".ss-preset-general").forEach(btn => {
  btn.addEventListener("click", () => {
    const val = parseFloat(btn.dataset.intensity);

    selectedIntensity = val;
    saveLS("intensity", val);

    intensityChips.forEach(c =>
      c.classList.toggle("active", parseFloat(c.dataset.percent) === val)
    );

    document.querySelectorAll(".ss-preset-general")
      .forEach(p => p.classList.remove("active"));

    btn.classList.add("active");
  });
});

// ---------- Brine ----------
waterAmount.value = loadLS("waterAmount", "");
brinePercent.value = loadLS("brinePercent", "");
saltTypeBrine.value = loadLS("saltTypeBrine", "fine");

calcBrine.addEventListener("click", () => {
  const w = parseFloat(waterAmount.value);
  const pct = parseFloat(brinePercent.value);
  const st = saltTypeBrine.value;

  saveLS("waterAmount", waterAmount.value);
  saveLS("brinePercent", brinePercent.value);
  saveLS("saltTypeBrine", st);

  if (!w || !pct || w <= 0 || pct <= 0) {
    brineResult.textContent = "Enter valid values.";
    return;
  }

  const grams = w * (pct / 100);

  brineResult.innerHTML = `
    <strong>${grams.toFixed(1)} g</strong> salt required.
  `;
});

// ---------- Brine Presets ----------
document.querySelectorAll(".ss-preset-brine").forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.percent;

    brinePercent.value = val;
    saveLS("brinePercent", val);

    document.querySelectorAll(".ss-preset-brine")
      .forEach(p => p.classList.remove("active"));

    btn.classList.add("active");
  });
});

// ---------- Recipe Scaling ----------
origTotal.value = loadLS("origTotal", "");
origSalt.value = loadLS("origSalt", "");
newTotal.value = loadLS("newTotal", "");

calcScaling.addEventListener("click", () => {
  const oT = parseFloat(origTotal.value);
  const oS = parseFloat(origSalt.value);
  const nT = parseFloat(newTotal.value);

  saveLS("origTotal", origTotal.value);
  saveLS("origSalt", origSalt.value);
  saveLS("newTotal", newTotal.value);

  // Empty fields → keep helper text
  if (origTotal.value === "" || origSalt.value === "" || newTotal.value === "") {
    scalingResult.innerHTML =
      "Enter all values to scale your recipe while keeping the same salt intensity.";
    return;
  }

  // Invalid values
  if (!oT || !oS || !nT || oT <= 0 || oS < 0 || nT <= 0) {
    scalingResult.textContent = "Enter valid values.";
    return;
  }

  const nS = oS * (nT / oT);

  scalingResult.innerHTML = `
    <p><strong>${nS.toFixed(1)} g</strong> salt needed.</p>
    <p style="color:#9ca3af;font-size:0.85rem;">
      Same salt concentration as original recipe.
    </p>
  `;
});
// =============== PWA INSTALL POPUP ===============
let deferredPrompt;

// Detect install availability
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (!localStorage.getItem("installDismissed")) {
    document.getElementById("installPrompt").classList.remove("hidden");
  }
});

// Install button clicked
document.getElementById("installBtn").addEventListener("click", async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;

  if (choice.outcome === "accepted") {
    console.log("PWA installed");
  }

  document.getElementById("installPrompt").classList.add("hidden");
  deferredPrompt = null;
});

// Dismiss button clicked
document.getElementById("dismissInstall").addEventListener("click", () => {
  document.getElementById("installPrompt").classList.add("hidden");
  localStorage.setItem("installDismissed", "1");
});

// Hide popup if already installed
window.addEventListener("appinstalled", () => {
  localStorage.setItem("installDismissed", "1");
  document.getElementById("installPrompt").classList.add("hidden");
});
