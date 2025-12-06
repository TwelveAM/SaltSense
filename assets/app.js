// ---------- Local Storage ----------
function saveLS(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
function loadLS(k, fb=null) {
  const v = localStorage.getItem(k);
  return v ? JSON.parse(v) : fb;
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

    // DO NOT clear preset highlight
  });
});

// ---------- General Seasoning ----------
const foodWeightInput = document.getElementById("foodWeight");
const saltTypeGeneralSelect = document.getElementById("saltTypeGeneral");

foodWeightInput.value = loadLS("foodWeight", "");
saltTypeGeneralSelect.value = loadLS("saltTypeGeneral", "fine");

document.getElementById("calcGeneral").addEventListener("click", () => {
  const w = parseFloat(foodWeightInput.value);
  const saltType = saltTypeGeneralSelect.value;

  saveLS("foodWeight", w);
  saveLS("saltTypeGeneral", saltType);

  if (!w || w <= 0) {
    generalResult.textContent = "Enter a valid food weight.";
    return;
  }

  const grams = w * (selectedIntensity / 100);

  const notes = {
    fine: "Fine salt dissolves fast.",
    kosher: "Kosher salt is milder.",
    sea: "Sea salt melts slower.",
  };

  generalResult.innerHTML = `
    <strong>${grams.toFixed(1)} g</strong> salt needed.<br>
    <span style="color:#9ca3af">${notes[saltType]}</span>
  `;
});

// ---------- General Presets ----------
const generalPresetBtns = document.querySelectorAll(".ss-preset-general");

generalPresetBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const val = parseFloat(btn.dataset.intensity);

    selectedIntensity = val;
    saveLS("intensity", val);

    intensityChips.forEach(c =>
      c.classList.toggle("active", parseFloat(c.dataset.percent) === val)
    );

    generalPresetBtns.forEach(p => p.classList.remove("active"));
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

  saveLS("waterAmount", w);
  saveLS("brinePercent", pct);
  saveLS("saltTypeBrine", st);

  if (!w || !pct) {
    brineResult.textContent = "Enter valid values.";
    return;
  }

  const grams = w * (pct / 100);

  brineResult.innerHTML = `
    <strong>${grams.toFixed(1)} g</strong> salt required.
  `;
});

// ---------- Brine Presets ----------
const brinePresetBtns = document.querySelectorAll(".ss-preset-brine");

brinePresetBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.percent;

    brinePercent.value = val;
    saveLS("brinePercent", val);

    brinePresetBtns.forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
  });
});

// ---------- Scaling ----------
origTotal.value = loadLS("origTotal", "");
origSalt.value = loadLS("origSalt", "");
newTotal.value = loadLS("newTotal", "");

calcScaling.addEventListener("click", () => {
  const oT = parseFloat(origTotal.value);
  const oS = parseFloat(origSalt.value);
  const nT = parseFloat(newTotal.value);

  // Save entries
  saveLS("origTotal", origTotal.value);
  saveLS("origSalt", origSalt.value);
  saveLS("newTotal", newTotal.value);

  // Empty fields → do nothing (no error)
  if (origTotal.value === "" || origSalt.value === "" || newTotal.value === "") {
    scalingResult.innerHTML = "";
    return;
  }

  // Invalid numbers → show error
  if (!oT || !oS || !nT || oT <= 0 || oS < 0 || nT <= 0) {
    scalingResult.textContent = "Enter valid values.";
    return;
  }

  // Valid → calculate
  const nS = oS * (nT / oT);

  scalingResult.innerHTML = `
    <p><strong>${nS.toFixed(1)} g</strong> salt needed.</p>
    <p style="color:#9ca3af;font-size:0.85rem;">
      Same salt concentration as original recipe.
    </p>
  `;
});
