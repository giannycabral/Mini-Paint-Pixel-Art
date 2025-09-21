const paletteContainer = document.getElementById("palette");
const gridContainer = document.getElementById("grid-container");
const clearButton = document.getElementById("clear-button");
const gridSizeSelector = document.getElementById("grid-size");
const eraserButton = document.getElementById("eraser-button");
const describeButton = document.getElementById("describe-button");
const descriptionContainer = document.getElementById("description-container");

// Cursores padrão do navegador para máxima compatibilidade
const pencilCursor = "crosshair";
const eraserCursor = "cell";

// Paleta de cores com tons de lilás e rosa
const colors = [
  "#000000",
  "#ffffff",
  "#4c1d95",
  "#7e22ce",
  "#a855f7",
  "#d8b4fe",
  "#f3e8ff",
  "#86198f",
  "#be185d",
  "#ec4899",
  "#f9a8d4",
  "#fce7f3",
  "#0e7490",
  "#22d3ee",
  "#a5f3fc",
  "#15803d",
  "#4ade80",
  "#fde047",
  "#f97316",
  "#ef4444",
  "#9ca3af",
];

const eraserColor = "#ffffff";
let selectedColor = colors[0];
let isPainting = false;

function initialize() {
  createPalette();
  createGrid();
  addEventListeners();
  setActiveTool(paletteContainer.firstChild);
  gridContainer.style.cursor = pencilCursor;
}

function createPalette() {
  paletteContainer.innerHTML = "";
  colors.forEach((color) => {
    const colorSwatch = document.createElement("div");
    colorSwatch.className =
      "w-8 h-8 md:w-10 md:h-10 rounded-full cursor-pointer border-2 border-purple-300 transition-transform transform hover:scale-110";
    colorSwatch.style.backgroundColor = color;
    colorSwatch.dataset.color = color;
    paletteContainer.appendChild(colorSwatch);
  });
}

function createGrid() {
  const gridSize = parseInt(gridSizeSelector.value);
  gridContainer.innerHTML = "";
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
  for (let i = 0; i < gridSize * gridSize; i++) {
    const pixel = document.createElement("div");
    pixel.classList.add("pixel");
    gridContainer.appendChild(pixel);
  }
}

function addEventListeners() {
  paletteContainer.addEventListener("click", selectColor);
  gridContainer.addEventListener("mousedown", startPainting);
  document.addEventListener("mouseup", stopPainting);
  gridContainer.addEventListener("mouseleave", stopPainting);
  gridContainer.addEventListener("mousemove", paint);
  gridContainer.addEventListener("touchstart", startPaintingTouch, {
    passive: false,
  });
  document.addEventListener("touchend", stopPainting);
  gridContainer.addEventListener("touchcancel", stopPainting);
  gridContainer.addEventListener("touchmove", paintTouch, { passive: false });
  clearButton.addEventListener("click", clearGrid);
  eraserButton.addEventListener("click", selectEraser);
  gridSizeSelector.addEventListener("change", createGrid);
  describeButton.addEventListener("click", handleDescribeArt);
}

function selectColor(e) {
  if (e.target.dataset.color) {
    selectedColor = e.target.dataset.color;
    setActiveTool(e.target);
    gridContainer.style.cursor = pencilCursor;
  }
}

function selectEraser() {
  selectedColor = eraserColor;
  setActiveTool(eraserButton);
  gridContainer.style.cursor = eraserCursor;
}

function setActiveTool(selectedElement) {
  document
    .querySelectorAll(".selected")
    .forEach((el) => el.classList.remove("selected"));
  selectedElement.classList.add("selected");
}

function startPainting(e) {
  if (e.target.classList.contains("pixel")) {
    isPainting = true;
    paint(e);
  }
}
function stopPainting() {
  isPainting = false;
}
function paint(e) {
  if (!isPainting || !e.target.classList.contains("pixel")) return;
  e.target.style.backgroundColor = selectedColor;
}
function startPaintingTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  if (element && element.classList.contains("pixel")) {
    isPainting = true;
    paintTouch(e);
  }
}
function paintTouch(e) {
  if (!isPainting) return;
  e.preventDefault();
  const touch = e.touches[0];
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  if (element && element.classList.contains("pixel")) {
    element.style.backgroundColor = selectedColor;
  }
}

function clearGrid() {
  document
    .querySelectorAll(".pixel")
    .forEach((pixel) => (pixel.style.backgroundColor = "#ffffff"));
}

// --- Funcionalidade da API Gemini ---

async function handleDescribeArt() {
  descriptionContainer.innerHTML = '<div class="loader"></div>';
  describeButton.disabled = true;

  const gridSize = parseInt(gridSizeSelector.value);
  const canvas = document.createElement("canvas");
  canvas.width = gridSize;
  canvas.height = gridSize;
  const ctx = canvas.getContext("2d");
  const pixels = gridContainer.childNodes;

  for (let i = 0; i < pixels.length; i++) {
    const pixel = pixels[i];
    const color = pixel.style.backgroundColor || "#ffffff";
    const x = i % gridSize;
    const y = Math.floor(i / gridSize);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }

  const base64ImageData = canvas.toDataURL("image/png").split(",")[1];

  try {
    const description = await callGeminiAPI(base64ImageData);
    descriptionContainer.textContent = description;
  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    descriptionContainer.textContent =
      "Desculpe, não consegui descrever a arte. Tente novamente.";
  } finally {
    describeButton.disabled = false;
  }
}

async function callGeminiAPI(base64ImageData) {
  const apiKey = "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: "Descreva esta pixel art em uma frase curta, divertida e criativa. Aja como um crítico de arte entusiasmado.",
          },
          {
            inlineData: {
              mimeType: "image/png",
              data: base64ImageData,
            },
          },
        ],
      },
    ],
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  const candidate = result.candidates?.[0];

  if (candidate && candidate.content?.parts?.[0]?.text) {
    return candidate.content.parts[0].text;
  } else {
    return "Não foi possível gerar uma descrição. A resposta da IA estava vazia.";
  }
}

document.addEventListener("DOMContentLoaded", initialize);
