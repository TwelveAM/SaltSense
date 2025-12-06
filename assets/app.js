// ----- TAB SWITCHING -----
const tabButtons = document.querySelectorAll(".ss-tab-btn");
const cards = document.querySelectorAll(".ss-card");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;

    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    cards.forEach((card) => {
      card.id === target
        ? card.classList.add("ss-card-active")
        : card.classList.remove("ss-card-active");
    });
  });
});

// ----- INTENSITY CHIP -----
let selectedIntensity = 1.0;
const intensityChips = document.querySelectorAll(".ss-chip-intensity");

intensityChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    intensityChips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    selectedIntensity = parseFloat(chip.dataset.percent);
  });
});

// ----- GENERAL SEASONING -----
const foodWeightInput = document.getElementById("foodWeight");
const saltTypeGeneralSelect = document.getElementById("saltTypeGeneral");
const generalResultDiv = document.getElementById("generalResult");
const calcGeneralBtn = document.getElementById("calcGeneral");

calcGeneralBtn.addEventListener("click", () => {
  const weight = parseFloat(foodWeightInput.value);
  const saltType = saltTypeGeneralSelect.value;

  if (!weight || weight <= 0) {
    generalResultDiv.textContent = "Enter a valid food weight (grams).";
    return;
  }

  const saltGrams = weight * (selectedIntensity / 100);

  let intensityLabel =
    selectedIntensity >= 2.0 ? "bold" :
    selectedIntensity >= 1.5 ? "medium" : "light";

  const saltNotes = {
    fine: "Fine salt dissolves fast and seasons evenly.",
    kosher: "Kosher salt is milder and easier to control.",
    sea: "Coarse sea salt melts slowly—good for finishing."
  };

  generalResultDiv.innerHTML = `
    <p><strong>${saltGrams.toFixed(1)} g</strong> salt needed.</p>
    <p style="margin-top:4px;color:#9ca3af;font-size:0.8rem;">
      Seasoning intensity: <strong>${intensityLabel}</strong> (${selectedIntensity.toFixed(1)}%).
      <br>Note: ${saltNotes[saltType]}
    </p>
  `;
});

// ----- BRINE -----
const waterAmountInput = document.getElementById("waterAmount");
const brinePercentInput = document.getElementById("brinePercent");
const saltTypeBrineSelect = document.getElementById("saltTypeBrine");
const brineResultDiv = document.getElementById("brineResult");
const calcBrineBtn = document.getElementById("calcBrine");

calcBrineBtn.addEventListener("click", () => {
  const waterMl = parseFloat(waterAmountInput.value);
  const brinePct = parseFloat(brinePercentInput.value);
  const saltType = saltTypeBrineSelect.value;

  if (!waterMl || waterMl <= 0) {
    brineResultDiv.textContent = "Enter a valid water amount (ml).";
    return;
  }
  if (!brinePct || brinePct <= 0) {
    brineResultDiv.textContent = "Enter a valid brine percentage.";
    return;
  }

  const gramsSalt = waterMl * (brinePct / 100);

  let usageHint =
    brinePct <= 3 ? "Light brine." :
    brinePct <= 8 ? "Ideal for poultry, meat, vegetables." :
    "Strong pickling brine — reduce soak time.";

  const saltNotes = {
    fine: "Fine salt dissolves quickest in cold water.",
    kosher: "Kosher salt makes smoother brines.",
    sea: "Coarse sea salt requires longer dissolving time."
  };

  brineResultDiv.innerHTML = `
    <p><strong>${gramsSalt.toFixed(1)} g</strong> salt required.</p>
    <p style="margin-top:4px;color:#9ca3af;font-size:0.8rem;">
      Brine strength: <strong>${brinePct.toFixed(1)}%</strong>.
      ${usageHint}<br>Note: ${saltNotes[saltType]}
    </p>
  `;
});

// ----- RECIPE SCALING -----
const origTotalInput = document.getElementById("origTotal");
const origSaltInput = document.getElementById("origSalt");
const newTotalInput = document.getElementById("newTotal");
const scalingResultDiv = document.getElementById("scalingResult");
const calcScalingBtn = document.getElementById("calcScaling");

calcScalingBtn.addEventListener("click", () => {
  const origTotal = parseFloat(origTotalInput.value);
  const origSalt = parseFloat(origSaltInput.value);
  const newTotal = parseFloat(newTotalInput.value);

  if (!origTotal || origTotal <= 0 || !origSalt || origSalt < 0 || !newTotal || newTotal <= 0) {
    scalingResultDiv.textContent = "Enter valid values for original total, original salt, and new total.";
    return;
  }

  const factor = newTotal / origTotal;
  const newSalt = origSalt * factor;
  const saltPct = (newSalt / newTotal) * 100;

  scalingResultDiv.innerHTML = `
    <p>Use <strong>${newSalt.toFixed(1)} g</strong> salt for the new batch.</p>
    <p style="margin-top:4px;color:#9ca3af;font-size:0.8rem;">
      Resulting salt concentration: <strong>${saltPct.toFixed(2)}%</strong>.
    </p>
  `;
});
