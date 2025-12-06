// -------------------------
// LocalStorage helpers
// -------------------------
function saveLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function loadLS(key, fallback = null) {
  const v = localStorage.getItem(key);
  return v ? JSON.parse(v) : fallback;
}

// -------------------------
// TAB switching
// -------------------------
const tabButtons = document.querySelectorAll(".ss-tab-btn");
const cards = document.querySelectorAll(".ss-card");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;

    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    cards.forEach((card) => {
      card.classList.toggle("ss-card-active", card.id === target);
    });
  });
});

// -------------------------
// INTENSITY chip logic
// -------------------------
let selectedIntensity = loadLS("intensity", 1.0);
const intensityChips = document.querySelectorAll(".ss-chip-intensity");

intensityChips.forEach((chip) => {
  if (parseFloat(chip.dataset.percent) === selectedIntensity) {
    chip.classList.add("active");
  }

  chip.addEventListener("click", () => {
    intensityChips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    selectedIntensity = parseFloat(chip.dataset.percent);
    saveLS("intensity", selectedIntensity);

    // Clear general preset highlights
    generalPresetBtns.forEach((p) => p.classList.remove("active"));
  });
});

// -------------------------
// GENERAL SEASONING
// -------------------------
const foodWeightInput = document.getElementById("foodWeight");
const saltTypeGeneralSelect = document.getElementById("saltTypeGeneral");
const generalResultDiv = document.getElementById("generalResult");
const calcGeneralBtn = document.getElementById("calcGeneral");

// Load saved values
foodWeightInput.value = loadLS("foodWeight", "");
saltTypeGeneralSelect.value = loadLS("saltTypeGeneral", "fine");

calcGeneralBtn.addEventListener("click", () => {
  const weight = parseFloat(foodWeightInput.value);
  const saltType = saltTypeGeneralSelect.value;

  saveLS("foodWeight", weight);
  saveLS("saltTypeGeneral", saltType);

  if (!weight || weight <= 0) {
    generalResultDiv.textContent = "Enter a valid food weight.";
    return;
  }

  const saltGrams = weight * (selectedIntensity / 100);

  let intensityLabel =
    selectedIntensity >= 2.0 ? "bold" :
    selectedIntensity >= 1.5 ? "medium" : "light";

  const notes = {
    fine: "Fine salt dissolves fast and evenly.",
    kosher: "Kosher salt is milder and easier to control.",
    sea: "Sea salt melts slower — good for finishing."
  };

  generalResultDiv.innerHTML = `
    <p><strong>${saltGrams.toFixed(1)} g</strong> salt needed.</p>
    <p style="color:#9ca3af;font-size:0.8rem;margin-top:4px;">
      Intensity: <strong>${intensityLabel}</strong> (${selectedIntensity.toFixed(1)}%)<br>
      ${notes[saltType]}
    </p>
  `;
});

// -------------------------
// GENERAL PRESETS (WITH HIGHLIGHT)
// -------------------------
const generalPresetBtns = document.querySelectorAll(".ss-preset-general");

generalPresetBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = parseFloat(btn.dataset.intensity);

    // Update intensity
    selectedIntensity = val;
    saveLS("intensity", val);

    // Highlight correct intensity chip
    intensityChips.forEach((c) =>
      c.classList.toggle("active", parseFloat(c.dataset.percent) === val)
    );

    // Highlight selected preset
    generalPresetBtns.forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
  });
});

// -------------------------
// BRINE SECTION
// -------------------------
const waterAmountInput = document.getElementById("waterAmount");
const brinePercentInput = document.getElementById("brinePercent");
const saltTypeBrineSelect = document.getElementById("saltTypeBrine");
const brineResultDiv = document.getElementById("brineResult");
const calcBrineBtn = document.getElementById("calcBrine");

waterAmountInput.value = loadLS("waterAmount", "");
brinePercentInput.value = loadLS("brinePercent", "");
saltTypeBrineSelect.value = loadLS("saltTypeBrine", "fine");

calcBrineBtn.addEventListener("click", () => {
  const waterMl = parseFloat(waterAmountInput.value);
  const brinePct = parseFloat(brinePercentInput.value);
  const saltType = saltTypeBrineSelect.value;

  saveLS("waterAmount", waterMl);
  saveLS("brinePercent", brinePct);
  saveLS("saltTypeBrine", saltType);

  if (!waterMl || waterMl <= 0) {
    brineResultDiv.textContent = "Enter a valid water amount.";
    return;
  }
  if (!brinePct || brinePct <= 0) {
    brineResultDiv.textContent = "Enter a valid brine percentage.";
    return;
  }

  const gramsSalt = waterMl * (brinePct / 100);

  const usageHint =
    brinePct <= 3 ? "Light brine." :
    brinePct <= 8 ? "Poultry / meat brine." :
    "Strong pickling brine.";

  const notes = {
    fine: "Fine salt dissolves quickly.",
    kosher: "Kosher salt creates smoother brines.",
    sea: "Sea salt dissolves slower — stir well."
  };

  brineResultDiv.innerHTML = `
    <p><strong>${gramsSalt.toFixed(1)} g</strong> salt required.</p>
    <p style="color:#9ca3af;font-size:0.8rem;margin-top:4px;">
      Strength: <strong>${brinePct.toFixed(1)}%</strong> — ${usageHint}<br>
      ${notes[saltType]}
    </p>
  `;
});

// -------------------------
// BRINE PRESETS (WITH HIGHLIGHT)
// -------------------------
const brinePresetBtns = document.querySelectorAll(".ss-preset-brine");

brinePresetBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = parseFloat(btn.dataset.percent);

    brinePercentInput.value = val;
    saveLS("brinePercent", val);

    // Highlight selected preset
    brinePresetBtns.forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
  });
});

// -------------------------
// RECIPE SCALING
// -------------------------
const origTotalInput = document.getElementById("origTotal");
const origSaltInput = document.getElementById("origSalt");
const newTotalInput = document.getElementById("newTotal");
const scalingResultDiv = document.getElementById("scalingResult");
const calcScalingBtn = document.getElementById("calcScaling");

origTotalInput.value = loadLS("origTotal", "");
origSaltInput.value = loadLS("origSalt", "");
newTotalInput.value = loadLS("newTotal", "");

calcScalingBtn.addEventListener("click", () => {
  const origTotal = parseFloat(origTotalInput.value);
  const origSalt = parseFloat(origSaltInput.value);
  const newTotal = parseFloat(newTotalInput.value);

  saveLS("origTotal", origTotal);
  saveLS("origSalt", origSalt);
  saveLS("newTotal", newTotal);

  if (!origTotal || !origSalt || !newTotal || origTotal <= 0 || newTotal <= 0) {
    scalingResultDiv.textContent = "Enter valid values.";
    return;
  }

  const factor = newTotal / origTotal;
  const newSalt = origSalt * factor;
  const saltPct = (newSalt / newTotal) * 100;

  scalingResultDiv.innerHTML = `
    <p><strong>${newSalt.toFixed(1)} g</strong> salt for the new batch.</p>
    <p style="color:#9ca3af;font-size:0.8rem;margin-top:4px;">
      Final salt concentration: <strong>${saltPct.toFixed(2)}%</strong>
    </p>
  `;
});
