// === SELETORES DE ELEMENTOS ===
const paletteContainer = document.getElementById("palette");
const gridContainer = document.getElementById("grid-container");
const clearButton = document.getElementById("clear-button");
const gridSizeSelector = document.getElementById("grid-size");
const eraserButton = document.getElementById("eraser-button");
const describeButton = document.getElementById("describe-button");
const descriptionContainer = document.getElementById("description-container");
const themeToggle = document.getElementById("theme-toggle");
const loadingOverlay = document.getElementById("loading-overlay");

// Novos elementos
const customColorPicker = document.getElementById("custom-color-picker");
const hexInput = document.getElementById("hex-input");
const addToPaletteBtn = document.getElementById("add-to-palette");
const colorHistory = document.getElementById("color-history");
const currentColorPreview = document.getElementById("current-color-preview");
const currentColorHex = document.getElementById("current-color-hex");
const currentColorRgb = document.getElementById("current-color-rgb");
const toolInfo = document.getElementById("tool-info");

// === SISTEMA DE CORES AVANÇADO ===
const colorCategories = {
  primary: {
    name: "Primárias",
    colors: [
      "#FF0000",
      "#00FF00",
      "#0000FF",
      "#FFFF00",
      "#FF00FF",
      "#00FFFF",
      "#000000",
      "#FFFFFF",
      "#800000",
      "#008000",
      "#000080",
      "#808000",
      "#800080",
      "#008080",
      "#808080",
      "#C0C0C0",
      "#FF8000",
      "#8000FF",
      "#FF0080",
      "#80FF00",
      "#0080FF",
      "#FF8080",
      "#80FF80",
      "#8080FF",
    ],
  },
  pastels: {
    name: "Pastéis",
    colors: [
      "#FFE4E1",
      "#E0FFFF",
      "#F0FFF0",
      "#FFF8DC",
      "#FFFACD",
      "#F5F5DC",
      "#FFE4B5",
      "#FFEFD5",
      "#FFF0F5",
      "#F8F8FF",
      "#E6E6FA",
      "#FDF5E6",
      "#DCDCDC",
      "#F5F5F5",
      "#FAFAFA",
      "#FFFAFA",
      "#F0F8FF",
      "#F5FFFA",
      "#FFF5EE",
      "#F0FFFF",
      "#FFFFF0",
      "#FFFFFED",
      "#FFE4E1",
      "#FFEFD5",
    ],
  },
  dark: {
    name: "Escuros",
    colors: [
      "#2F4F4F",
      "#696969",
      "#708090",
      "#778899",
      "#B0C4DE",
      "#483D8B",
      "#6B8E23",
      "#556B2F",
      "#8B4513",
      "#A0522D",
      "#A52A2A",
      "#800080",
      "#9932CC",
      "#8B008B",
      "#4B0082",
      "#191970",
      "#000080",
      "#00008B",
      "#0000CD",
      "#006400",
      "#008B8B",
      "#B22222",
      "#DC143C",
      "#8B0000",
    ],
  },
  neon: {
    name: "Neons",
    colors: [
      "#FF1493",
      "#00FF7F",
      "#FF4500",
      "#FFD700",
      "#ADFF2F",
      "#00CED1",
      "#FF69B4",
      "#00BFFF",
      "#1E90FF",
      "#32CD32",
      "#FFFF00",
      "#FF6347",
      "#7FFF00",
      "#00FFFF",
      "#FF00FF",
      "#9400D3",
      "#4169E1",
      "#00FA9A",
      "#FF7F50",
      "#F0E68C",
      "#98FB98",
      "#87CEEB",
      "#DDA0DD",
      "#F0A0FF",
    ],
  },
  earth: {
    name: "Terra",
    colors: [
      "#8B4513",
      "#A0522D",
      "#CD853F",
      "#D2691E",
      "#BC8F8F",
      "#F4A460",
      "#DEB887",
      "#D2B48C",
      "#BDB76B",
      "#F5DEB3",
      "#FFEBCD",
      "#FFE4B5",
      "#FFDAB9",
      "#FFEFD5",
      "#FDF5E6",
      "#FAF0E6",
      "#FAF0E6",
      "#FDF5E6",
      "#FAEBD7",
      "#F5F5DC",
      "#FFE4C4",
      "#FFEBCD",
      "#FFF8DC",
      "#FFF5EE",
    ],
  },
  grayscale: {
    name: "Cinzas",
    colors: [
      "#000000",
      "#111111",
      "#222222",
      "#333333",
      "#444444",
      "#555555",
      "#666666",
      "#777777",
      "#888888",
      "#999999",
      "#AAAAAA",
      "#BBBBBB",
      "#CCCCCC",
      "#DDDDDD",
      "#EEEEEE",
      "#FFFFFF",
      "#F8F8F8",
      "#F0F0F0",
      "#E8E8E8",
      "#E0E0E0",
      "#D8D8D8",
      "#D0D0D0",
      "#C8C8C8",
      "#C0C0C0",
    ],
  },
};

// === ESTADO DA APLICAÇÃO ===
const pencilCursor = "crosshair";
const eraserCursor = "cell";

const eraserColor = "#ffffff";
let selectedColor = "#000000";
let isPainting = false;
let currentTheme = localStorage.getItem("theme") || "light";
let currentCategory = "primary";
let colorHistoryArray = JSON.parse(localStorage.getItem("colorHistory")) || [];
let currentTool = "brush";
let currentBrushSize = 1;
let currentZoom = 100; // Zoom inicial de 100%
let currentGridSize = 32; // Tamanho padrão da grade

// Variáveis para ferramentas de linha e formas
let isDrawingShape = false;
let shapeStartPixel = null;
let previewPixels = [];

// === SISTEMA DE ANIMAÇÃO ===
let animationFrames = []; // Array para armazenar todos os frames
let currentFrameIndex = 0;
let isPlaying = false;
let animationSpeed = 12; // FPS
let animationLoop = true;
let onionSkinEnabled = false;
let animationInterval = null;

// === INICIALIZAÇÃO ===
function initialize() {
  showLoadingOverlay();
  initializeTheme();
  setupColorCategories();
  createPalette();
  setupCustomColorPicker();
  updateColorHistoryDisplay();
  createGrid();
  addEventListeners();
  setupSprayControls();
  updateCurrentColorDisplay(selectedColor);
  setActiveTool();
  applyZoom(); // Aplica zoom inicial
  gridContainer.style.cursor = pencilCursor;
  setupTooltips(); // Configura tooltips dinâmicos
  initializeAnimation(); // Inicializa sistema de animação
  applyStoredSettings(); // Aplica configurações salvas
  hideLoadingOverlay();
}

// === CONFIGURAÇÕES DO SPRAY ===
function setupSprayControls() {
  const sprayIntensity = document.getElementById("spray-intensity");
  const sprayRadius = document.getElementById("spray-radius");
  const sprayIntensityValue = document.getElementById("spray-intensity-value");
  const sprayRadiusValue = document.getElementById("spray-radius-value");

  if (sprayIntensity && sprayIntensityValue) {
    sprayIntensity.addEventListener("input", (e) => {
      sprayIntensityValue.textContent = e.target.value;
    });
  }

  if (sprayRadius && sprayRadiusValue) {
    sprayRadius.addEventListener("input", (e) => {
      sprayRadiusValue.textContent = e.target.value;
    });
  }
}

// === SISTEMA DE TEMAS ===
function initializeTheme() {
  applyTheme(currentTheme);
  updateThemeToggleText();
}

function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(currentTheme);
  updateThemeToggleText();
  localStorage.setItem("theme", currentTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function updateThemeToggleText() {
  if (themeToggle) {
    themeToggle.textContent = currentTheme === "light" ? "🌙" : "☀️";
    themeToggle.setAttribute(
      "data-tooltip",
      currentTheme === "light" ? "Modo escuro" : "Modo claro"
    );
  }
}

// === OVERLAY DE CARREGAMENTO ===
function showLoadingOverlay() {
  if (loadingOverlay) {
    loadingOverlay.classList.remove("hidden");
  }
}

function hideLoadingOverlay() {
  if (loadingOverlay) {
    setTimeout(() => {
      loadingOverlay.classList.add("hidden");
    }, 500);
  }
}

// === CRIAÇÃO DA PALETA ===
function createPalette() {
  paletteContainer.innerHTML = "";

  const colors = colorCategories[currentCategory].colors;

  colors.forEach((color, index) => {
    const colorSwatch = document.createElement("div");
    colorSwatch.className = "color-item tooltip";
    colorSwatch.style.backgroundColor = color;
    colorSwatch.dataset.color = color;
    colorSwatch.setAttribute("data-tooltip", `${color}`);
    colorSwatch.addEventListener("click", () => selectColor(color));
    paletteContainer.appendChild(colorSwatch);
  });
}

// === SISTEMA DE CATEGORIAS DE CORES ===
function setupColorCategories() {
  const categoryTabs = document.querySelectorAll(".category-tab");

  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active de todos os tabs
      categoryTabs.forEach((t) => t.classList.remove("active"));
      // Adiciona active no tab clicado
      tab.classList.add("active");
      // Atualiza categoria atual
      currentCategory = tab.dataset.category;
      // Recria a paleta
      createPalette();
    });
  });
}

// === SELEÇÃO DE COR ===
function selectColor(color) {
  selectedColor = color;
  updateCurrentColorDisplay(color);
  addToColorHistory(color);

  // Feedback visual de seleção
  const event = new CustomEvent("colorSelected", { detail: { color } });
  document.dispatchEvent(event);

  // Atualiza cursor baseado na ferramenta
  updateCursor();

  setActiveTool();
}

// === ATUALIZAÇÃO DE CURSOR BASEADA NA FERRAMENTA ===
function updateCursor() {
  gridContainer.className = gridContainer.className.replace(/cursor-\w+/g, "");

  switch (currentTool) {
    case "brush":
      gridContainer.classList.add("cursor-brush");
      break;
    case "eraser":
      gridContainer.classList.add("cursor-eraser");
      break;
    case "bucket":
      gridContainer.classList.add("cursor-bucket");
      break;
    case "eyedropper":
      gridContainer.classList.add("cursor-eyedropper");
      break;
    case "line":
    case "rectangle":
    case "circle":
      gridContainer.classList.add("cursor-shape");
      break;
    default:
      gridContainer.classList.add("cursor-brush");
  }
}

// === ATUALIZAÇÃO DO DISPLAY DE COR ATUAL ===
function updateCurrentColorDisplay(color) {
  if (currentColorPreview) {
    currentColorPreview.style.backgroundColor = color;
  }
  if (currentColorHex) {
    currentColorHex.textContent = color.toUpperCase();
  }
  if (currentColorRgb) {
    const rgb = hexToRgb(color);
    if (rgb) {
      currentColorRgb.textContent = `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
  }
}

// === HISTÓRICO DE CORES ===
function addToColorHistory(color) {
  // Remove cor se já existe
  const index = colorHistoryArray.indexOf(color);
  if (index > -1) {
    colorHistoryArray.splice(index, 1);
  }

  // Adiciona no início
  colorHistoryArray.unshift(color);

  // Mantém apenas 16 cores no histórico
  if (colorHistoryArray.length > 16) {
    colorHistoryArray.pop();
  }

  // Salva no localStorage
  localStorage.setItem("colorHistory", JSON.stringify(colorHistoryArray));

  // Atualiza display
  updateColorHistoryDisplay();
}

function updateColorHistoryDisplay() {
  if (!colorHistory) return;

  colorHistory.innerHTML = "";

  if (colorHistoryArray.length === 0) {
    colorHistory.innerHTML =
      '<div class="col-span-8 text-center text-xs text-purple-400 py-2">Use cores para vê-las aqui</div>';
    return;
  }

  colorHistoryArray.forEach((color, index) => {
    const colorSwatch = document.createElement("div");
    colorSwatch.className = "color-item tooltip";
    colorSwatch.style.backgroundColor = color;
    colorSwatch.dataset.color = color;
    colorSwatch.setAttribute("data-tooltip", `${color} (recente)`);
    colorSwatch.addEventListener("click", () => selectColor(color));
    colorHistory.appendChild(colorSwatch);
  });
}

// === SELETOR DE COR CUSTOMIZADO ===
function setupCustomColorPicker() {
  if (customColorPicker) {
    customColorPicker.addEventListener("change", (e) => {
      const color = e.target.value;
      selectColor(color);
      if (hexInput) {
        hexInput.value = color;
      }
    });
  }

  if (hexInput) {
    hexInput.addEventListener("input", (e) => {
      let color = e.target.value;
      if (!color.startsWith("#")) {
        color = "#" + color;
      }
      if (isValidHexColor(color)) {
        selectColor(color);
        if (customColorPicker) {
          customColorPicker.value = color;
        }
      }
    });
  }

  if (addToPaletteBtn) {
    addToPaletteBtn.addEventListener("click", () => {
      const color = customColorPicker ? customColorPicker.value : "#000000";
      addToColorHistory(color);
      selectColor(color);
    });
  }
}

// === FUNÇÕES UTILITÁRIAS ===
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function isValidHexColor(hex) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

// === CRIAÇÃO DA GRADE ===
function createGrid() {
  const gridSize = parseInt(gridSizeSelector.value);
  currentGridSize = gridSize; // Atualizar tamanho atual da grade
  gridContainer.innerHTML = "";
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  for (let i = 0; i < gridSize * gridSize; i++) {
    const pixel = document.createElement("div");
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;

    pixel.classList.add("pixel");
    pixel.dataset.row = row;
    pixel.dataset.col = col;
    pixel.dataset.index = i;

    pixel.addEventListener("mouseenter", () => {
      if (isPainting) {
        pixel.classList.add("drawing");
        setTimeout(() => pixel.classList.remove("drawing"), 200);
      }
    });
    gridContainer.appendChild(pixel);
  }
}

// === EVENT LISTENERS ===
function addEventListeners() {
  // Event listeners existentes
  gridContainer.addEventListener("mousedown", startPainting);
  document.addEventListener("mouseup", stopPainting);
  gridContainer.addEventListener("mouseleave", stopPainting);
  gridContainer.addEventListener("mousemove", handleMouseMove);
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

  // Botão de exportar
  const exportButton = document.getElementById("export-button");
  if (exportButton) {
    exportButton.addEventListener("click", exportAsImage);
  }

  // Novos event listeners
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Event listeners para ferramentas
  setupToolEventListeners();

  // Event listeners para zoom
  setupZoomEventListeners();

  // Event listeners para configurações
  setupConfigurationEventListeners();

  // Atalhos de teclado
  document.addEventListener("keydown", handleKeyboardShortcuts);
}

// === MANIPULAÇÃO DE MOUSE AVANÇADA ===
function handleMouseMove(e) {
  if (isPainting && ["brush", "eraser", "spray"].includes(currentTool)) {
    paint(e);
  } else if (
    isDrawingShape &&
    shapeStartPixel &&
    e.target.classList.contains("pixel")
  ) {
    // Mostra preview da forma sendo desenhada
    showShapePreview(e.target);
  }
}

function showShapePreview(endPixel) {
  if (!shapeStartPixel) return;

  let previewPixels = [];

  switch (currentTool) {
    case "line":
      previewPixels = getLinePixels(shapeStartPixel, endPixel);
      break;
    case "rectangle":
      previewPixels = getRectanglePixels(shapeStartPixel, endPixel);
      break;
    case "circle":
      previewPixels = getCirclePixels(shapeStartPixel, endPixel);
      break;
  }

  showPreview(previewPixels);
}

// === SETUP DE FERRAMENTAS ===
function setupToolEventListeners() {
  // Pincéis
  const brushButtons = document.querySelectorAll('[data-tool="brush"]');
  brushButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentTool = "brush";
      currentBrushSize = parseInt(btn.dataset.size);
      setActiveTool();
      gridContainer.style.cursor = pencilCursor;
    });
  });

  // Ferramentas especiais (excluindo formas geométricas que têm seu próprio sistema)
  const toolButtons = document.querySelectorAll(
    '.tool-btn[data-tool]:not([data-tool="triangle"]):not([data-tool="diamond"]):not([data-tool="star"]):not([data-tool="hexagon"])'
  );
  toolButtons.forEach((btn) => {
    const tool = btn.dataset.tool;
    if (tool !== "brush") {
      btn.addEventListener("click", () => {
        currentTool = tool;
        setActiveTool();

        // Configura cursor específico
        switch (tool) {
          case "eraser":
            gridContainer.style.cursor = eraserCursor;
            break;
          case "eyedropper":
            gridContainer.style.cursor = "copy";
            break;
          case "bucket":
            gridContainer.style.cursor = "alias";
            break;
          default:
            gridContainer.style.cursor = pencilCursor;
        }

        // Mostra/esconde configurações específicas
        updateToolSettings();
      });
    }
  });
}

function updateToolSettings() {
  const spraySettings = document.getElementById("spray-settings");

  if (spraySettings) {
    if (currentTool === "spray") {
      spraySettings.classList.remove("hidden");
    } else {
      spraySettings.classList.add("hidden");
    }
  }
}

// === SELEÇÃO DE FERRAMENTA ===
function setActiveTool() {
  // Remove active de todas as ferramentas
  document
    .querySelectorAll(".tool-btn, .color-item")
    .forEach((el) => el.classList.remove("selected"));

  // Adiciona active na ferramenta atual
  const activeElements = document.querySelectorAll(
    `[data-tool="${currentTool}"], [data-color="${selectedColor}"]`
  );
  activeElements.forEach((el) => el.classList.add("selected"));

  // Atualiza cursor
  updateCursor();

  // Atualiza informações da ferramenta
  updateToolInfo();

  // Atualiza configurações específicas da ferramenta
  updateToolSettings();
}

function updateToolInfo(customMessage = null) {
  if (!toolInfo) return;

  // Se uma mensagem customizada foi fornecida, usar ela
  if (customMessage) {
    toolInfo.innerHTML = `<strong>${customMessage}</strong>`;
    return;
  }

  let toolName = "";
  let toolDescription = "";

  switch (currentTool) {
    case "brush":
      toolName = `Pincel ${currentBrushSize}×${currentBrushSize}`;
      toolDescription = "Clique e arraste para desenhar pixels";
      break;
    case "eraser":
      toolName = "Borracha";
      toolDescription = "Clique e arraste para apagar pixels";
      break;
    case "bucket":
      toolName = "Balde de Tinta";
      toolDescription = "Clique para preencher uma área";
      break;
    case "eyedropper":
      toolName = "Conta-gotas";
      toolDescription = "Clique em um pixel para capturar sua cor";
      break;
    case "line":
      toolName = "Linha Reta";
      toolDescription = "Clique e arraste para desenhar linhas retas";
      break;
    case "spray":
      toolName = "Spray";
      toolDescription = "Clique e arraste para efeitos de spray";
      break;
    case "rectangle":
      toolName = "Retângulo";
      toolDescription = "Clique e arraste para desenhar retângulos";
      break;
    case "circle":
      toolName = "Círculo";
      toolDescription = "Clique e arraste para desenhar círculos";
      break;
    default:
      toolName = "Ferramenta";
      toolDescription = "Selecione uma ferramenta para começar";
  }

  toolInfo.innerHTML = `
    <div class="font-medium">${toolName}</div>
    <div class="text-purple-500 dark:text-purple-400 mt-1">${toolDescription}</div>
  `;
}

// === SISTEMA DE ZOOM ===
function setupZoomEventListeners() {
  const zoomInBtn = document.getElementById("zoom-in");
  const zoomOutBtn = document.getElementById("zoom-out");

  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", zoomIn);
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", zoomOut);
  }
}

function zoomIn() {
  console.log("Zoom In clicked, current zoom:", currentZoom);
  if (currentZoom < 300) {
    // Limite máximo de 300%
    currentZoom += 25;
    console.log("New zoom level:", currentZoom);
    applyZoom();
  }
}

function zoomOut() {
  console.log("Zoom Out clicked, current zoom:", currentZoom);
  if (currentZoom > 50) {
    // Limite mínimo de 50%
    currentZoom -= 25;
    console.log("New zoom level:", currentZoom);
    applyZoom();
  }
}

function applyZoom() {
  console.log("Applying zoom:", currentZoom);
  const gridContainer = document.getElementById("grid-container"); // ID correto
  const zoomLevel = document.getElementById("zoom-level");

  console.log("Grid container found:", !!gridContainer);
  console.log("Zoom level element found:", !!zoomLevel);

  if (gridContainer) {
    // Remove transform scale e aplica tamanho real
    gridContainer.style.transform = "none";

    // Calcula o tamanho baseado no zoom (tamanho base: 512px como definido no HTML)
    const baseSize = 512;
    const newSize = Math.round(baseSize * (currentZoom / 100));

    console.log("Base size:", baseSize, "New size:", newSize);

    // Aplica o novo tamanho
    gridContainer.style.width = `${newSize}px`;
    gridContainer.style.height = `${newSize}px`;
    gridContainer.style.maxWidth = `${newSize}px`;
    gridContainer.style.maxHeight = `${newSize}px`;

    console.log("Applied styles to grid container");
  }

  if (zoomLevel) {
    zoomLevel.textContent = `${currentZoom}%`;
  }
}

// === CONFIGURAÇÕES GERAIS ===
function setupConfigurationEventListeners() {
  const gridLinesCheckbox = document.getElementById("grid-lines");
  const pixelPerfectCheckbox = document.getElementById("pixel-perfect");

  if (gridLinesCheckbox) {
    gridLinesCheckbox.addEventListener("change", (e) => {
      toggleGridLines(e.target.checked);
    });
  }

  if (pixelPerfectCheckbox) {
    pixelPerfectCheckbox.addEventListener("change", (e) => {
      togglePixelPerfect(e.target.checked);
    });
  }
}

function toggleGridLines(enabled) {
  const pixels = document.querySelectorAll(".pixel");

  if (enabled) {
    // Mostra as linhas da grade
    pixels.forEach((pixel) => {
      pixel.style.border = "1px solid #f5f3ff";
    });

    // Atualiza para tema escuro se necessário
    if (currentTheme === "dark") {
      pixels.forEach((pixel) => {
        pixel.style.borderColor = "#4b5563";
      });
    }
  } else {
    // Remove as linhas da grade
    pixels.forEach((pixel) => {
      pixel.style.border = "none";
    });
  }

  // Salva a preferência
  localStorage.setItem("gridLinesEnabled", enabled);
}

function togglePixelPerfect(enabled) {
  // Controla a precisão do desenho pixel
  if (enabled) {
    // Modo pixel perfect: remove antialiasing e garante precisão
    gridContainer.style.imageRendering = "pixelated";
    gridContainer.style.imageRendering = "-moz-crisp-edges";
    gridContainer.style.imageRendering = "crisp-edges";
    gridContainer.classList.add("pixel-perfect-mode");
  } else {
    // Modo normal: permite suavização
    gridContainer.style.imageRendering = "auto";
    gridContainer.classList.remove("pixel-perfect-mode");
  }

  // Salva a preferência
  localStorage.setItem("pixelPerfectEnabled", enabled);
}

// Aplica configurações salvas na inicialização
function applyStoredSettings() {
  const gridLinesEnabled = localStorage.getItem("gridLinesEnabled");
  const pixelPerfectEnabled = localStorage.getItem("pixelPerfectEnabled");
  const gridLinesCheckbox = document.getElementById("grid-lines");
  const pixelPerfectCheckbox = document.getElementById("pixel-perfect");

  // Aplica configuração da grade (padrão: true)
  const shouldShowGrid =
    gridLinesEnabled === null ? true : gridLinesEnabled === "true";
  if (gridLinesCheckbox) {
    gridLinesCheckbox.checked = shouldShowGrid;
  }
  toggleGridLines(shouldShowGrid);

  // Aplica configuração pixel perfect (padrão: true)
  const shouldBePixelPerfect =
    pixelPerfectEnabled === null ? true : pixelPerfectEnabled === "true";
  if (pixelPerfectCheckbox) {
    pixelPerfectCheckbox.checked = shouldBePixelPerfect;
  }
  togglePixelPerfect(shouldBePixelPerfect);
}

// === SISTEMA DE TOOLTIPS DINÂMICOS ===
function setupTooltips() {
  // Remove tooltips CSS e implementa via JavaScript
  const style = document.createElement("style");
  style.textContent = `
    .tooltip::before, .tooltip::after { display: none !important; }
  `;
  document.head.appendChild(style);

  const tooltipElements = document.querySelectorAll(".tooltip[data-tooltip]");
  let currentTooltip = null;

  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", (e) => {
      showTooltip(e.target);
    });

    element.addEventListener("mouseleave", () => {
      hideTooltip();
    });

    element.addEventListener("focus", (e) => {
      showTooltip(e.target);
    });

    element.addEventListener("blur", () => {
      hideTooltip();
    });
  });

  function showTooltip(element) {
    hideTooltip(); // Remove tooltip anterior

    const text = element.getAttribute("data-tooltip");
    if (!text) return;

    // Cria o tooltip
    const tooltip = document.createElement("div");
    tooltip.className = "dynamic-tooltip";
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: fixed;
      background: #1a1a1a;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      z-index: 99999;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    document.body.appendChild(tooltip);

    // Posiciona o tooltip
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.top - tooltipRect.height - 8;

    // Ajusta se sair da tela
    if (left < 8) left = 8;
    if (left + tooltipRect.width > window.innerWidth - 8) {
      left = window.innerWidth - tooltipRect.width - 8;
    }
    if (top < 8) {
      top = rect.bottom + 8; // Mostra embaixo se não cabe em cima
    }

    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";

    // Mostra o tooltip
    requestAnimationFrame(() => {
      tooltip.style.opacity = "1";
    });

    currentTooltip = tooltip;
  }

  function hideTooltip() {
    if (currentTooltip) {
      currentTooltip.style.opacity = "0";
      setTimeout(() => {
        if (currentTooltip?.parentNode) {
          currentTooltip.parentNode.removeChild(currentTooltip);
        }
        currentTooltip = null;
      }, 300);
    }
  }
}

// === SISTEMA DE ANIMAÇÃO ===
function initializeAnimation() {
  // Cria o primeiro frame com o estado atual do grid
  captureCurrentFrame();
  updateTimeline();
  setupAnimationEventListeners();
  updateFrameCounter();
}

function setupAnimationEventListeners() {
  // Controles de reprodução
  const playPauseBtn = document.getElementById("play-pause");
  const prevFrameBtn = document.getElementById("prev-frame");
  const nextFrameBtn = document.getElementById("next-frame");

  // Controles da timeline
  const addFrameBtn = document.getElementById("add-frame");
  const duplicateFrameBtn = document.getElementById("duplicate-frame");
  const deleteFrameBtn = document.getElementById("delete-frame");

  // Configurações
  const fpsSlider = document.getElementById("fps-slider");
  const fpsValue = document.getElementById("fps-value");
  const loopCheckbox = document.getElementById("loop-animation");
  const onionSkinCheckbox = document.getElementById("onion-skin");

  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", togglePlayPause);
  }

  if (prevFrameBtn) {
    prevFrameBtn.addEventListener("click", previousFrame);
  }

  if (nextFrameBtn) {
    nextFrameBtn.addEventListener("click", nextFrame);
  }

  if (addFrameBtn) {
    addFrameBtn.addEventListener("click", addFrame);
  }

  if (duplicateFrameBtn) {
    duplicateFrameBtn.addEventListener("click", duplicateFrame);
  }

  if (deleteFrameBtn) {
    deleteFrameBtn.addEventListener("click", deleteFrame);
  }

  if (fpsSlider && fpsValue) {
    fpsSlider.addEventListener("input", (e) => {
      animationSpeed = parseInt(e.target.value);
      fpsValue.textContent = animationSpeed;

      // Reinicia animação se estiver tocando
      if (isPlaying) {
        stopAnimation();
        startAnimation();
      }
    });
  }

  if (loopCheckbox) {
    loopCheckbox.addEventListener("change", (e) => {
      animationLoop = e.target.checked;
    });
  }

  if (onionSkinCheckbox) {
    onionSkinCheckbox.addEventListener("change", (e) => {
      onionSkinEnabled = e.target.checked;
      updateOnionSkin();
    });
  }
}

function captureCurrentFrame() {
  const gridSize = parseInt(gridSizeSelector.value);
  const pixels = Array.from(gridContainer.children);

  // Captura o estado de cada pixel
  const frameData = pixels.map((pixel) => {
    return pixel.style.backgroundColor || "#ffffff";
  });

  return { data: frameData, gridSize: gridSize };
}

function saveCurrentFrame() {
  // Atualiza o frame atual com o estado atual do grid
  if (animationFrames[currentFrameIndex]) {
    animationFrames[currentFrameIndex] = captureCurrentFrame();
    updateTimeline();
  }
}

function loadFrame(frameIndex) {
  if (!animationFrames[frameIndex]) return;

  const frame = animationFrames[frameIndex];
  const pixels = Array.from(gridContainer.children);

  // Aplica o estado do frame ao grid
  frame.data.forEach((color, index) => {
    if (pixels[index]) {
      pixels[index].style.backgroundColor = color;
    }
  });

  currentFrameIndex = frameIndex;
  updateFrameCounter();
  updateTimeline();
  updateOnionSkin();
}

function addFrame() {
  // Salva o frame atual antes de adicionar um novo
  saveCurrentFrame();

  // Cria novo frame (cópia do frame atual ou frame em branco)
  const newFrame = captureCurrentFrame();
  animationFrames.push(newFrame);

  // Vai para o novo frame
  currentFrameIndex = animationFrames.length - 1;
  updateFrameCounter();
  updateTimeline();
}

function duplicateFrame() {
  if (animationFrames[currentFrameIndex]) {
    // Salva o frame atual
    saveCurrentFrame();

    // Duplica o frame atual
    const currentFrame = animationFrames[currentFrameIndex];
    const duplicatedFrame = {
      data: [...currentFrame.data],
      gridSize: currentFrame.gridSize,
    };

    // Insere o frame duplicado após o atual
    animationFrames.splice(currentFrameIndex + 1, 0, duplicatedFrame);
    currentFrameIndex = currentFrameIndex + 1;

    updateFrameCounter();
    updateTimeline();
  }
}

function deleteFrame() {
  if (animationFrames.length <= 1) {
    alert("Não é possível deletar o último frame!");
    return;
  }

  const confirmed = confirm("Tem certeza que deseja deletar este frame?");
  if (confirmed) {
    animationFrames.splice(currentFrameIndex, 1);

    // Ajusta o índice se necessário
    if (currentFrameIndex >= animationFrames.length) {
      currentFrameIndex = animationFrames.length - 1;
    }

    loadFrame(currentFrameIndex);
  }
}

function previousFrame() {
  saveCurrentFrame();

  if (currentFrameIndex > 0) {
    loadFrame(currentFrameIndex - 1);
  } else if (animationLoop) {
    loadFrame(animationFrames.length - 1);
  }
}

function nextFrame() {
  saveCurrentFrame();

  if (currentFrameIndex < animationFrames.length - 1) {
    loadFrame(currentFrameIndex + 1);
  } else if (animationLoop) {
    loadFrame(0);
  }
}

function togglePlayPause() {
  if (isPlaying) {
    stopAnimation();
  } else {
    startAnimation();
  }
}

function startAnimation() {
  if (animationFrames.length <= 1) return;

  isPlaying = true;
  const playPauseBtn = document.getElementById("play-pause");
  if (playPauseBtn) {
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    playPauseBtn.classList.add("playing");
  }

  animationInterval = setInterval(() => {
    nextFrame();

    // Para a animação se chegou ao fim e não tem loop
    if (!animationLoop && currentFrameIndex === animationFrames.length - 1) {
      stopAnimation();
    }
  }, 1000 / animationSpeed);
}

function stopAnimation() {
  isPlaying = false;

  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }

  const playPauseBtn = document.getElementById("play-pause");
  if (playPauseBtn) {
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    playPauseBtn.classList.remove("playing");
  }
}

function updateFrameCounter() {
  const frameCounter = document.getElementById("frame-counter");
  if (frameCounter) {
    frameCounter.textContent = `${currentFrameIndex + 1}/${
      animationFrames.length
    }`;
  }
}

function updateOnionSkin() {
  // Remove onion skin anterior
  const existingOverlay = document.querySelector(".onion-skin-overlay");
  if (existingOverlay) {
    existingOverlay.remove();
  }

  if (!onionSkinEnabled || currentFrameIndex === 0) return;

  // Cria overlay para mostrar frame anterior
  const overlay = document.createElement("div");
  overlay.className = "onion-skin-overlay";

  const prevFrame = animationFrames[currentFrameIndex - 1];
  if (prevFrame) {
    const pixels = Array.from(gridContainer.children);

    prevFrame.data.forEach((color, index) => {
      if (pixels[index] && color !== "#ffffff") {
        const pixelOverlay = document.createElement("div");
        pixelOverlay.style.cssText = `
          position: absolute;
          width: ${pixels[index].offsetWidth}px;
          height: ${pixels[index].offsetHeight}px;
          background-color: ${color};
          opacity: 0.3;
          top: ${pixels[index].offsetTop}px;
          left: ${pixels[index].offsetLeft}px;
          pointer-events: none;
        `;
        overlay.appendChild(pixelOverlay);
      }
    });
  }

  gridContainer.appendChild(overlay);
}

function updateTimeline() {
  const timeline = document.getElementById("timeline");
  if (!timeline) return;

  // Limpa timeline atual
  timeline.innerHTML = "";

  animationFrames.forEach((frame, index) => {
    const thumbnail = createFrameThumbnail(frame, index);
    timeline.appendChild(thumbnail);
  });
}

function createFrameThumbnail(frame, index) {
  const container = document.createElement("div");
  container.className = `frame-thumbnail ${
    index === currentFrameIndex ? "active" : ""
  }`;

  // Cria canvas para a miniatura
  const canvas = document.createElement("canvas");
  const size = 50;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  const pixelSize = size / frame.gridSize;

  // Desenha a miniatura
  frame.data.forEach((color, pixelIndex) => {
    const row = Math.floor(pixelIndex / frame.gridSize);
    const col = pixelIndex % frame.gridSize;

    if (color && color !== "#ffffff") {
      ctx.fillStyle = color;
      ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
    }
  });

  // Adiciona número do frame
  const frameNumber = document.createElement("div");
  frameNumber.className = "frame-number";
  frameNumber.textContent = index + 1;

  // Event listener para clicar no frame
  container.addEventListener("click", () => {
    saveCurrentFrame();
    loadFrame(index);
  });

  container.appendChild(canvas);
  container.appendChild(frameNumber);

  return container;
}

// Salva automaticamente o frame atual quando o usuário desenha
function autoSaveFrame() {
  if (animationFrames.length > 0) {
    // Debounce para não salvar a cada pixel
    clearTimeout(window.autoSaveTimeout);
    window.autoSaveTimeout = setTimeout(() => {
      saveCurrentFrame();
    }, 500);
  }
}

// === ATALHOS DE TECLADO ===
function handleKeyboardShortcuts(e) {
  // Evita interferir com inputs
  if (e.target.tagName === "INPUT") return;

  switch (e.key.toLowerCase()) {
    case "c":
      clearGrid();
      break;
    case "e":
      exportAsImage();
      break;
    case "r":
      currentTool = "eraser";
      setActiveTool();
      break;
    case "b":
      currentTool = "bucket";
      setActiveTool();
      break;
    case "i":
      currentTool = "eyedropper";
      setActiveTool();
      break;
    case "l":
      currentTool = "line";
      setActiveTool();
      break;
    case "s":
      currentTool = "spray";
      setActiveTool();
      break;
    case "t":
      toggleTheme();
      break;
    case "d":
      handleDescribeArt();
      break;
    case "1":
      currentTool = "brush";
      currentBrushSize = 1;
      setActiveTool();
      break;
    case "2":
      currentTool = "brush";
      currentBrushSize = 2;
      setActiveTool();
      break;
    case "3":
      currentTool = "brush";
      currentBrushSize = 3;
      setActiveTool();
      break;
    case "+":
    case "=":
      zoomIn();
      break;
    case "-":
    case "_":
      zoomOut();
      break;
    case "escape":
      // Cancela operações de forma
      if (isDrawingShape) {
        clearPreview();
        isDrawingShape = false;
        shapeStartPixel = null;
      }
      stopPainting();
      break;
  }
}

// === FUNÇÕES DE PINTURA ANTIGAS (REMOVIDAS - substituídas pelas novas) ===

function selectEraser() {
  currentTool = "eraser";
  selectedColor = eraserColor;
  setActiveTool();
  gridContainer.style.cursor = eraserCursor;
}

// === FUNÇÃO ANTIGA REMOVIDA ===
// setActiveTool(selectedElement) foi substituída pela nova versão sem parâmetros

function startPainting(e) {
  if (e.target.classList.contains("pixel")) {
    isPainting = true;

    // Sistema unificado - todas as ferramentas passam por handleToolAction
    handleToolAction(e);
  }
}

function stopPainting(e) {
  isPainting = false;
  isDrawingShape = false;
}

function paint(e) {
  if (!isPainting || !e.target.classList.contains("pixel")) return;

  handleToolAction(e);
}

function startDrawingShape(e) {
  console.log("Iniciando desenho de forma", { currentTool, currentShape });

  isDrawingShape = true;
  const pixel = e.target;
  shapeStartPos = {
    row: parseInt(pixel.dataset.row),
    col: parseInt(pixel.dataset.col),
  };

  console.log("Posição inicial da forma:", shapeStartPos);
}

function updateShapePreview(e) {
  if (!shapeStartPos) return;

  // Remover preview anterior
  if (shapePreview) {
    shapePreview.remove();
    shapePreview = null;
  }

  // Criar novo preview
  const pixel = e.target;
  const endRow = parseInt(pixel.dataset.row);
  const endCol = parseInt(pixel.dataset.col);

  createShapePreview(shapeStartPos.row, shapeStartPos.col, endRow, endCol);
}

function createShapePreview(startRow, startCol, endRow, endCol) {
  const container = document.getElementById("grid-container");
  shapePreview = document.createElement("div");
  shapePreview.className = "shape-preview";

  const fillMode = document.querySelector(
    'input[name="fill-mode"]:checked'
  ).value;
  if (fillMode === "filled") {
    shapePreview.classList.add("shape-filled");
  }

  const gridRect = container.getBoundingClientRect();
  const pixelSize = gridRect.width / currentGridSize;

  const left = Math.min(startCol, endCol) * pixelSize;
  const top = Math.min(startRow, endRow) * pixelSize;
  const width = (Math.abs(endCol - startCol) + 1) * pixelSize;
  const height = (Math.abs(endRow - startRow) + 1) * pixelSize;

  shapePreview.style.left = left + "px";
  shapePreview.style.top = top + "px";
  shapePreview.style.width = width + "px";
  shapePreview.style.height = height + "px";

  container.appendChild(shapePreview);
}

function finishDrawingShape(e) {
  console.log("finishDrawingShape chamado", {
    shapeStartPos,
    currentShape,
    target: e.target,
  });

  if (!shapeStartPos || !e.target.classList.contains("pixel")) {
    console.warn("Condições não atendidas para finalizar forma");
    return;
  }

  const pixel = e.target;
  const endRow = parseInt(pixel.dataset.row);
  const endCol = parseInt(pixel.dataset.col);

  console.log(
    `Finalizando forma ${currentShape} de (${shapeStartPos.row},${shapeStartPos.col}) para (${endRow},${endCol})`
  );

  // Desenhar a forma
  drawShape(shapeStartPos.row, shapeStartPos.col, endRow, endCol, currentShape);

  // Limpar preview
  if (shapePreview) {
    shapePreview.remove();
    shapePreview = null;
  }

  // Salvar no histórico (função ainda não implementada)
  // saveToHistory();

  // Resetar estado
  shapeStartPos = null;
  isDrawingShape = false;
}

// === SISTEMA DE FERRAMENTAS ===
function handleToolAction(e) {
  const pixel = e.target;

  switch (currentTool) {
    case "brush":
      paintBrush(pixel);
      break;
    case "eraser":
      erasePixel(pixel);
      break;
    case "bucket":
      if (isPainting) {
        // Só executa no click inicial
        bucketFill(pixel);
        isPainting = false; // Previne múltiplas execuções
      }
      break;
    case "eyedropper":
      if (isPainting) {
        pickColor(pixel);
        isPainting = false;
      }
      break;
    case "spray":
      sprayPaint(pixel);
      break;
    case "line":
      handleLineDrawing(pixel);
      break;
    case "rectangle":
      handleRectangleDrawing(pixel);
      break;
    case "circle":
      handleCircleDrawing(pixel);
      break;
    case "triangle":
      handleTriangleDrawing(pixel);
      break;
    case "diamond":
      handleDiamondDrawing(pixel);
      break;
    case "star":
      handleStarDrawing(pixel);
      break;
    case "hexagon":
      handleHexagonDrawing(pixel);
      break;
  }
}

// === FERRAMENTAS DE LINHA E FORMAS ===
function handleLineDrawing(pixel) {
  if (!isDrawingShape) {
    // Primeiro clique - inicia a linha
    shapeStartPixel = pixel;
    isDrawingShape = true;
  } else {
    // Segundo clique - completa a linha
    drawLine(shapeStartPixel, pixel);
    clearPreview();
    isDrawingShape = false;
    shapeStartPixel = null;
  }
}

function handleRectangleDrawing(pixel) {
  if (!isDrawingShape) {
    // Primeiro clique - inicia o retângulo
    shapeStartPixel = pixel;
    isDrawingShape = true;
  } else {
    // Segundo clique - completa o retângulo
    drawRectangle(shapeStartPixel, pixel);
    clearPreview();
    isDrawingShape = false;
    shapeStartPixel = null;
  }
}

function handleCircleDrawing(pixel) {
  if (!isDrawingShape) {
    // Primeiro clique - inicia o círculo
    shapeStartPixel = pixel;
    isDrawingShape = true;
  } else {
    // Segundo clique - completa o círculo
    drawCircle(shapeStartPixel, pixel);
    clearPreview();
    isDrawingShape = false;
    shapeStartPixel = null;
  }
}

function handleTriangleDrawing(pixel) {
  console.log("handleTriangleDrawing chamado", { isDrawingShape, pixel });
  if (!isDrawingShape) {
    // Primeiro clique - inicia o triângulo
    shapeStartPixel = pixel;
    isDrawingShape = true;
    console.log("Iniciando triângulo");
  } else {
    // Segundo clique - completa o triângulo
    console.log("Completando triângulo");
    drawTriangle(shapeStartPixel, pixel);
    clearPreview();
    isDrawingShape = false;
    shapeStartPixel = null;
  }
}

function handleDiamondDrawing(pixel) {
  if (!isDrawingShape) {
    // Primeiro clique - inicia o losango
    shapeStartPixel = pixel;
    isDrawingShape = true;
  } else {
    // Segundo clique - completa o losango
    drawDiamond(shapeStartPixel, pixel);
    clearPreview();
    isDrawingShape = false;
    shapeStartPixel = null;
  }
}

function handleStarDrawing(pixel) {
  if (!isDrawingShape) {
    // Primeiro clique - inicia a estrela
    shapeStartPixel = pixel;
    isDrawingShape = true;
  } else {
    // Segundo clique - completa a estrela
    drawStar(shapeStartPixel, pixel);
    clearPreview();
    isDrawingShape = false;
    shapeStartPixel = null;
  }
}

function handleHexagonDrawing(pixel) {
  if (!isDrawingShape) {
    // Primeiro clique - inicia o hexágono
    shapeStartPixel = pixel;
    isDrawingShape = true;
  } else {
    // Segundo clique - completa o hexágono
    drawHexagon(shapeStartPixel, pixel);
    clearPreview();
    isDrawingShape = false;
    shapeStartPixel = null;
  }
}

// === ALGORITMOS DE DESENHO ===
function drawLine(startPixel, endPixel) {
  const pixels = getLinePixels(startPixel, endPixel);
  pixels.forEach((pixel) => {
    if (pixel) {
      pixel.style.backgroundColor = selectedColor;
    }
  });
}

function getLinePixels(startPixel, endPixel) {
  const gridSize = parseInt(gridSizeSelector.value);
  const pixels = Array.from(gridContainer.children);

  const startIndex = pixels.indexOf(startPixel);
  const endIndex = pixels.indexOf(endPixel);

  const startRow = Math.floor(startIndex / gridSize);
  const startCol = startIndex % gridSize;
  const endRow = Math.floor(endIndex / gridSize);
  const endCol = endIndex % gridSize;

  const linePixels = [];

  // Algoritmo de Bresenham para linha
  const dx = Math.abs(endCol - startCol);
  const dy = Math.abs(endRow - startRow);
  const sx = startCol < endCol ? 1 : -1;
  const sy = startRow < endRow ? 1 : -1;
  let err = dx - dy;

  let x = startCol;
  let y = startRow;

  while (true) {
    const pixelIndex = y * gridSize + x;
    if (pixelIndex >= 0 && pixelIndex < pixels.length) {
      linePixels.push(pixels[pixelIndex]);
    }

    if (x === endCol && y === endRow) break;

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }

  return linePixels;
}

function drawRectangle(startPixel, endPixel) {
  const pixels = getRectanglePixels(startPixel, endPixel);
  pixels.forEach((pixel) => {
    if (pixel) {
      pixel.style.backgroundColor = selectedColor;
    }
  });
}

function getRectanglePixels(startPixel, endPixel) {
  const gridSize = parseInt(gridSizeSelector.value);
  const pixels = Array.from(gridContainer.children);

  const startIndex = pixels.indexOf(startPixel);
  const endIndex = pixels.indexOf(endPixel);

  const startRow = Math.floor(startIndex / gridSize);
  const startCol = startIndex % gridSize;
  const endRow = Math.floor(endIndex / gridSize);
  const endCol = endIndex % gridSize;

  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);
  const minCol = Math.min(startCol, endCol);
  const maxCol = Math.max(startCol, endCol);

  const rectanglePixels = [];

  // Desenha apenas o contorno do retângulo
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      if (
        row === minRow ||
        row === maxRow ||
        col === minCol ||
        col === maxCol
      ) {
        const pixelIndex = row * gridSize + col;
        if (pixelIndex >= 0 && pixelIndex < pixels.length) {
          rectanglePixels.push(pixels[pixelIndex]);
        }
      }
    }
  }

  return rectanglePixels;
}

function drawCircle(centerPixel, edgePixel) {
  const pixels = getCirclePixels(centerPixel, edgePixel);
  pixels.forEach((pixel) => {
    if (pixel) {
      pixel.style.backgroundColor = selectedColor;
    }
  });
}

function getCirclePixels(centerPixel, edgePixel) {
  const gridSize = parseInt(gridSizeSelector.value);
  const pixels = Array.from(gridContainer.children);

  const centerIndex = pixels.indexOf(centerPixel);
  const edgeIndex = pixels.indexOf(edgePixel);

  const centerRow = Math.floor(centerIndex / gridSize);
  const centerCol = centerIndex % gridSize;
  const edgeRow = Math.floor(edgeIndex / gridSize);
  const edgeCol = edgeIndex % gridSize;

  const radius = Math.round(
    Math.sqrt(
      Math.pow(edgeRow - centerRow, 2) + Math.pow(edgeCol - centerCol, 2)
    )
  );

  const circlePixels = [];

  // Algoritmo de Bresenham para círculo
  let x = 0;
  let y = radius;
  let d = 3 - 2 * radius;

  function addCirclePoints(x, y) {
    const points = [
      [centerRow + y, centerCol + x],
      [centerRow - y, centerCol + x],
      [centerRow + y, centerCol - x],
      [centerRow - y, centerCol - x],
      [centerRow + x, centerCol + y],
      [centerRow - x, centerCol + y],
      [centerRow + x, centerCol - y],
      [centerRow - x, centerCol - y],
    ];

    points.forEach(([row, col]) => {
      if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        const pixelIndex = row * gridSize + col;
        if (pixelIndex >= 0 && pixelIndex < pixels.length) {
          circlePixels.push(pixels[pixelIndex]);
        }
      }
    });
  }

  addCirclePoints(x, y);

  while (y >= x) {
    x++;
    if (d > 0) {
      y--;
      d = d + 4 * (x - y) + 10;
    } else {
      d = d + 4 * x + 6;
    }
    addCirclePoints(x, y);
  }

  return circlePixels;
}

// === FUNÇÕES DE DESENHO DAS FORMAS GEOMÉTRICAS ===
function drawTriangle(startPixel, endPixel) {
  const pixels = getTrianglePixels(startPixel, endPixel);
  pixels.forEach((pixel) => {
    if (pixel) {
      pixel.style.backgroundColor = selectedColor;
    }
  });
}

function getTrianglePixels(startPixel, endPixel) {
  console.log("getTrianglePixels chamado");
  const gridSize = parseInt(gridSizeSelector.value);
  const pixels = Array.from(gridContainer.children);

  const startIndex = pixels.indexOf(startPixel);
  const endIndex = pixels.indexOf(endPixel);

  const startRow = Math.floor(startIndex / gridSize);
  const startCol = startIndex % gridSize;
  const endRow = Math.floor(endIndex / gridSize);
  const endCol = endIndex % gridSize;

  const centerRow = Math.round((startRow + endRow) / 2);
  const centerCol = Math.round((startCol + endCol) / 2);
  const size = Math.max(
    Math.abs(endRow - startRow),
    Math.abs(endCol - startCol)
  );
  const radius = Math.floor(size / 2);

  console.log(
    `Triângulo - centro: (${centerRow},${centerCol}), raio: ${radius}`
  );

  const fillMode =
    document.querySelector('input[name="fill-mode"]:checked')?.value ||
    "outline";
  const trianglePixels = [];

  for (let row = -radius; row <= radius; row++) {
    for (let col = -radius; col <= radius; col++) {
      if (isInTriangle(row, col, radius, fillMode === "filled")) {
        const pixelRow = centerRow + row;
        const pixelCol = centerCol + col;
        if (
          pixelRow >= 0 &&
          pixelRow < gridSize &&
          pixelCol >= 0 &&
          pixelCol < gridSize
        ) {
          const pixelIndex = pixelRow * gridSize + pixelCol;
          if (pixelIndex >= 0 && pixelIndex < pixels.length) {
            trianglePixels.push(pixels[pixelIndex]);
          }
        }
      }
    }
  }

  console.log(`Triângulo gerou ${trianglePixels.length} pixels`);
  return trianglePixels;
}

function drawDiamond(startPixel, endPixel) {
  const pixels = getDiamondPixels(startPixel, endPixel);
  pixels.forEach((pixel) => {
    if (pixel) {
      pixel.style.backgroundColor = selectedColor;
    }
  });
}

function getDiamondPixels(startPixel, endPixel) {
  const gridSize = parseInt(gridSizeSelector.value);
  const pixels = Array.from(gridContainer.children);

  const startIndex = pixels.indexOf(startPixel);
  const endIndex = pixels.indexOf(endPixel);

  const startRow = Math.floor(startIndex / gridSize);
  const startCol = startIndex % gridSize;
  const endRow = Math.floor(endIndex / gridSize);
  const endCol = endIndex % gridSize;

  const centerRow = Math.round((startRow + endRow) / 2);
  const centerCol = Math.round((startCol + endCol) / 2);
  const size = Math.max(
    Math.abs(endRow - startRow),
    Math.abs(endCol - startCol)
  );
  const radius = Math.floor(size / 2);

  const fillMode =
    document.querySelector('input[name="fill-mode"]:checked')?.value ||
    "outline";
  const diamondPixels = [];

  for (let row = -radius; row <= radius; row++) {
    for (let col = -radius; col <= radius; col++) {
      if (isInDiamond(row, col, radius, fillMode === "filled")) {
        const pixelRow = centerRow + row;
        const pixelCol = centerCol + col;
        if (
          pixelRow >= 0 &&
          pixelRow < gridSize &&
          pixelCol >= 0 &&
          pixelCol < gridSize
        ) {
          const pixelIndex = pixelRow * gridSize + pixelCol;
          if (pixelIndex >= 0 && pixelIndex < pixels.length) {
            diamondPixels.push(pixels[pixelIndex]);
          }
        }
      }
    }
  }

  return diamondPixels;
}

function drawStar(startPixel, endPixel) {
  const pixels = getStarPixels(startPixel, endPixel);
  pixels.forEach((pixel) => {
    if (pixel) {
      pixel.style.backgroundColor = selectedColor;
    }
  });
}

function getStarPixels(startPixel, endPixel) {
  const gridSize = parseInt(gridSizeSelector.value);
  const pixels = Array.from(gridContainer.children);

  const startIndex = pixels.indexOf(startPixel);
  const endIndex = pixels.indexOf(endPixel);

  const startRow = Math.floor(startIndex / gridSize);
  const startCol = startIndex % gridSize;
  const endRow = Math.floor(endIndex / gridSize);
  const endCol = endIndex % gridSize;

  const centerRow = Math.round((startRow + endRow) / 2);
  const centerCol = Math.round((startCol + endCol) / 2);
  const size = Math.max(
    Math.abs(endRow - startRow),
    Math.abs(endCol - startCol)
  );
  const radius = Math.floor(size / 2);

  const fillMode =
    document.querySelector('input[name="fill-mode"]:checked')?.value ||
    "outline";
  const starPixels = [];

  for (let row = -radius; row <= radius; row++) {
    for (let col = -radius; col <= radius; col++) {
      if (isInStar(row, col, radius, fillMode === "filled")) {
        const pixelRow = centerRow + row;
        const pixelCol = centerCol + col;
        if (
          pixelRow >= 0 &&
          pixelRow < gridSize &&
          pixelCol >= 0 &&
          pixelCol < gridSize
        ) {
          const pixelIndex = pixelRow * gridSize + pixelCol;
          if (pixelIndex >= 0 && pixelIndex < pixels.length) {
            starPixels.push(pixels[pixelIndex]);
          }
        }
      }
    }
  }

  return starPixels;
}

function drawHexagon(startPixel, endPixel) {
  const pixels = getHexagonPixels(startPixel, endPixel);
  pixels.forEach((pixel) => {
    if (pixel) {
      pixel.style.backgroundColor = selectedColor;
    }
  });
}

function getHexagonPixels(startPixel, endPixel) {
  const gridSize = parseInt(gridSizeSelector.value);
  const pixels = Array.from(gridContainer.children);

  const startIndex = pixels.indexOf(startPixel);
  const endIndex = pixels.indexOf(endPixel);

  const startRow = Math.floor(startIndex / gridSize);
  const startCol = startIndex % gridSize;
  const endRow = Math.floor(endIndex / gridSize);
  const endCol = endIndex % gridSize;

  const centerRow = Math.round((startRow + endRow) / 2);
  const centerCol = Math.round((startCol + endCol) / 2);
  const size = Math.max(
    Math.abs(endRow - startRow),
    Math.abs(endCol - startCol)
  );
  const radius = Math.floor(size / 2);

  const fillMode =
    document.querySelector('input[name="fill-mode"]:checked')?.value ||
    "outline";
  const hexagonPixels = [];

  for (let row = -radius; row <= radius; row++) {
    for (let col = -radius; col <= radius; col++) {
      if (isInHexagon(row, col, radius, fillMode === "filled")) {
        const pixelRow = centerRow + row;
        const pixelCol = centerCol + col;
        if (
          pixelRow >= 0 &&
          pixelRow < gridSize &&
          pixelCol >= 0 &&
          pixelCol < gridSize
        ) {
          const pixelIndex = pixelRow * gridSize + pixelCol;
          if (pixelIndex >= 0 && pixelIndex < pixels.length) {
            hexagonPixels.push(pixels[pixelIndex]);
          }
        }
      }
    }
  }

  return hexagonPixels;
}

// === PREVIEW DAS FORMAS ===
function clearPreview() {
  previewPixels.forEach((pixel) => {
    if (pixel) {
      pixel.classList.remove("preview");
    }
  });
  previewPixels = [];
}

function showPreview(pixels) {
  clearPreview();
  pixels.forEach((pixel) => {
    if (pixel) {
      pixel.classList.add("preview");
      previewPixels.push(pixel);
    }
  });
}

// === PINCEL AVANÇADO ===
function paintBrush(centerPixel) {
  const pixels = getPixelsInBrush(centerPixel);
  pixels.forEach((pixel) => {
    if (pixel) {
      pixel.style.backgroundColor = selectedColor;
      pixel.classList.add("drawing");
      setTimeout(() => pixel.classList.remove("drawing"), 200);
    }
  });
}

function getPixelsInBrush(centerPixel) {
  const gridSize = parseInt(gridSizeSelector.value);
  const pixels = Array.from(gridContainer.children);
  const centerIndex = pixels.indexOf(centerPixel);
  const centerRow = Math.floor(centerIndex / gridSize);
  const centerCol = centerIndex % gridSize;

  const affectedPixels = [];

  // Lógica corrigida para pincéis quadrados
  if (currentBrushSize === 1) {
    // Pincel 1x1 - apenas o pixel clicado
    affectedPixels.push(centerPixel);
  } else if (currentBrushSize === 2) {
    // Pincel 2x2 - área 2x2 com o pixel clicado no canto superior esquerdo
    for (let dr = 0; dr < 2; dr++) {
      for (let dc = 0; dc < 2; dc++) {
        const newRow = centerRow + dr;
        const newCol = centerCol + dc;

        if (
          newRow >= 0 &&
          newRow < gridSize &&
          newCol >= 0 &&
          newCol < gridSize
        ) {
          const pixelIndex = newRow * gridSize + newCol;
          if (pixelIndex >= 0 && pixelIndex < pixels.length) {
            affectedPixels.push(pixels[pixelIndex]);
          }
        }
      }
    }
  } else if (currentBrushSize === 3) {
    // Pincel 3x3 - área 3x3 centralizada no pixel clicado
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const newRow = centerRow + dr;
        const newCol = centerCol + dc;

        if (
          newRow >= 0 &&
          newRow < gridSize &&
          newCol >= 0 &&
          newCol < gridSize
        ) {
          const pixelIndex = newRow * gridSize + newCol;
          if (pixelIndex >= 0 && pixelIndex < pixels.length) {
            affectedPixels.push(pixels[pixelIndex]);
          }
        }
      }
    }
  }

  return affectedPixels;
}

// === BORRACHA ===
function erasePixel(pixel) {
  pixel.style.backgroundColor = eraserColor;
  pixel.classList.add("drawing");
  setTimeout(() => pixel.classList.remove("drawing"), 200);
}

// === BALDE DE TINTA (FLOOD FILL) ===
function bucketFill(startPixel) {
  const targetColor = rgbToHex(startPixel.style.backgroundColor) || eraserColor;
  const fillColor = selectedColor;

  if (targetColor === fillColor) return; // Não faz nada se as cores são iguais

  const gridSize = parseInt(gridSizeSelector.value);
  const pixels = Array.from(gridContainer.children);
  const startIndex = pixels.indexOf(startPixel);

  const visited = new Set();
  const stack = [startIndex];

  while (stack.length > 0) {
    const currentIndex = stack.pop();

    if (
      visited.has(currentIndex) ||
      currentIndex < 0 ||
      currentIndex >= pixels.length
    ) {
      continue;
    }

    const currentPixel = pixels[currentIndex];
    const currentColor =
      rgbToHex(currentPixel.style.backgroundColor) || eraserColor;

    if (currentColor !== targetColor) {
      continue;
    }

    visited.add(currentIndex);
    currentPixel.style.backgroundColor = fillColor;

    // Adiciona pixels adjacentes
    const row = Math.floor(currentIndex / gridSize);
    const col = currentIndex % gridSize;

    // Cima
    if (row > 0) stack.push(currentIndex - gridSize);
    // Baixo
    if (row < gridSize - 1) stack.push(currentIndex + gridSize);
    // Esquerda
    if (col > 0) stack.push(currentIndex - 1);
    // Direita
    if (col < gridSize - 1) stack.push(currentIndex + 1);
  }
}

// === CONTA-GOTAS ===
function pickColor(pixel) {
  const color = rgbToHex(pixel.style.backgroundColor) || eraserColor;
  selectColor(color);
  currentTool = "brush"; // Volta para o pincel
  setActiveTool();
}

// === SPRAY ===
function sprayPaint(centerPixel) {
  const sprayIntensity = document.getElementById("spray-intensity")?.value || 5;
  const sprayRadius = document.getElementById("spray-radius")?.value || 2;

  const gridSize = parseInt(gridSizeSelector.value);
  const pixels = Array.from(gridContainer.children);
  const centerIndex = pixels.indexOf(centerPixel);
  const centerRow = Math.floor(centerIndex / gridSize);
  const centerCol = centerIndex % gridSize;

  // Aplica spray com probabilidade baseada na intensidade
  for (let i = 0; i < sprayIntensity; i++) {
    const randomAngle = Math.random() * 2 * Math.PI;
    const randomDistance = Math.random() * sprayRadius;

    const dr = Math.round(Math.sin(randomAngle) * randomDistance);
    const dc = Math.round(Math.cos(randomAngle) * randomDistance);

    const newRow = centerRow + dr;
    const newCol = centerCol + dc;

    if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
      const pixelIndex = newRow * gridSize + newCol;
      if (
        pixelIndex >= 0 &&
        pixelIndex < pixels.length &&
        Math.random() < 0.7
      ) {
        pixels[pixelIndex].style.backgroundColor = selectedColor;
      }
    }
  }
}

// === FUNÇÕES UTILITÁRIAS DE COR ===
function rgbToHex(rgb) {
  if (!rgb || rgb === "rgba(0, 0, 0, 0)") return null;

  if (rgb.startsWith("#")) return rgb;

  const result = rgb.match(/\d+/g);
  if (!result || result.length < 3) return null;

  return (
    "#" +
    (
      (1 << 24) +
      (parseInt(result[0]) << 16) +
      (parseInt(result[1]) << 8) +
      parseInt(result[2])
    )
      .toString(16)
      .slice(1)
  );
}

function startPaintingTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  if (element?.classList.contains("pixel")) {
    isPainting = true;
    paintTouch(e);
  }
}

function paintTouch(e) {
  if (!isPainting) return;
  e.preventDefault();
  const touch = e.touches[0];
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  if (element?.classList.contains("pixel")) {
    element.style.backgroundColor = selectedColor;
    element.classList.add("drawing");
    setTimeout(() => element.classList.remove("drawing"), 200);
  }
}

function clearGrid() {
  const confirmed = confirm("Tem certeza que deseja limpar toda a arte?");
  if (confirmed) {
    document.querySelectorAll(".pixel").forEach((pixel) => {
      pixel.style.backgroundColor = "#ffffff";
      pixel.classList.add("success-flash");
      setTimeout(() => pixel.classList.remove("success-flash"), 500);
    });

    // Feedback visual no botão
    if (clearButton) {
      const originalContent = clearButton.innerHTML;
      clearButton.innerHTML =
        '<i class="fas fa-check text-green-500"></i> Limpo!';
      setTimeout(() => {
        clearButton.innerHTML = originalContent;
      }, 1500);
    }
  }
}

// === EXPORTAR IMAGEM ===
function exportAsImage() {
  const gridSize = parseInt(gridSizeSelector.value);
  const pixels = Array.from(gridContainer.children);

  // Cria um canvas para exportar
  const canvas = document.createElement("canvas");
  const pixelSize = 10; // Tamanho de cada pixel na imagem exportada
  canvas.width = gridSize * pixelSize;
  canvas.height = gridSize * pixelSize;
  const ctx = canvas.getContext("2d");

  // Desenha cada pixel no canvas
  pixels.forEach((pixel, index) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    // Pega a cor do pixel
    const color = pixel.style.backgroundColor || "#ffffff";

    // Converte rgb() para hex se necessário
    let hexColor = color;
    if (color.startsWith("rgb")) {
      hexColor = rgbToHex(color);
    }

    // Desenha o pixel no canvas
    ctx.fillStyle = hexColor;
    ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
  });

  // Cria o link de download
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  link.download = `pixel-art-${timestamp}.png`;
  link.href = canvas.toDataURL("image/png");

  // Faz o download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Feedback visual no botão
  const exportButton = document.getElementById("export-button");
  if (exportButton) {
    const originalContent = exportButton.innerHTML;
    exportButton.innerHTML =
      '<i class="fas fa-check text-green-500"></i> Exportado!';
    setTimeout(() => {
      exportButton.innerHTML = originalContent;
    }, 2000);
  }
}

// --- Funcionalidade da API Gemini ---

// === FUNCIONALIDADE DA API GEMINI ===
async function handleDescribeArt() {
  descriptionContainer.innerHTML =
    '<div class="flex items-center gap-2"><div class="loader"></div><span class="text-sm">Analisando sua arte...</span></div>';
  describeButton.disabled = true;
  describeButton.classList.add("opacity-50");

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
    descriptionContainer.innerHTML = `<div class="animate-fade-in"><strong>✨ Descrição:</strong> ${description}</div>`;
  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    descriptionContainer.innerHTML =
      '<div class="text-red-500 animate-fade-in">❌ Não consegui descrever a arte. Verifique sua conexão e tente novamente.</div>';
  } finally {
    describeButton.disabled = false;
    describeButton.classList.remove("opacity-50");
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

  if (candidate?.content?.parts?.[0]?.text) {
    return candidate.content.parts[0].text;
  } else {
    return "Não foi possível gerar uma descrição. A resposta da IA estava vazia.";
  }
}

// === INICIALIZAÇÃO DA APLICAÇÃO ===
document.addEventListener("DOMContentLoaded", () => {
  console.log("🎨 Mini Paint Pixel Art - Inicializando...");

  // Pequeno delay para garantir que todos os elementos estejam carregados
  setTimeout(() => {
    initialize();
    initializeShapes();
    initializeFilters();
    initializeLayers();
    setupLayerEventListeners();
    setupMobileControls();
    setupResponsiveLayout();
    console.log("✨ Mini Paint Pixel Art - Pronto para usar!");
  }, 100);
});

function setupLayerEventListeners() {
  // Event listeners para controles de camadas
  document.getElementById("add-layer")?.addEventListener("click", addLayer);
  document.getElementById("delete-layer")?.addEventListener("click", () => {
    if (layers.length > 1) {
      deleteLayer(currentLayer);
    }
  });

  // Event listeners para cada camada
  setupLayerItemEventListeners();
}

function setupLayerItemEventListeners() {
  const layerItems = document.querySelectorAll(".layer-item");

  layerItems.forEach((item, index) => {
    // Seleção de camada
    item.addEventListener("click", () => {
      setCurrentLayer(index);
    });

    // Visibilidade
    const visibilityBtn = item.querySelector(".layer-visibility");
    visibilityBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLayerVisibility(index);
      visibilityBtn.classList.toggle("hidden");
    });

    // Opacidade
    const opacitySlider = item.querySelector(".layer-opacity");
    const opacityValue = item.querySelector(".layer-opacity-value");
    opacitySlider?.addEventListener("input", () => {
      const opacity = parseInt(opacitySlider.value) / 100;
      setLayerOpacity(index, opacity);
      opacityValue.textContent = opacitySlider.value + "%";
    });

    // Modo de mesclagem
    const blendSelect = item.querySelector(".layer-blend");
    blendSelect?.addEventListener("change", () => {
      setLayerBlendMode(index, blendSelect.value);
    });
  });
}

function setCurrentLayer(index) {
  currentLayer = index;

  // Atualizar interface
  document.querySelectorAll(".layer-item").forEach((item, i) => {
    item.classList.toggle("active", i === index);
  });
}

// Modificar a função paintBrush para usar camadas
function paintBrushWithLayers(pixel) {
  const row = parseInt(pixel.dataset.row);
  const col = parseInt(pixel.dataset.col);
  const key = `${row}-${col}`;

  // Salvar cor na camada atual
  if (layers[currentLayer]) {
    layers[currentLayer].pixels.set(key, selectedColor);
    renderLayers(); // Re-renderizar todas as camadas
  }

  // Adicionar efeito visual
  pixel.classList.add("drawing");
  setTimeout(() => pixel.classList.remove("drawing"), 200);
}

// === SISTEMA DE FORMAS GEOMÉTRICAS ===
let currentShape = null;
// isDrawingShape já foi declarado anteriormente
let shapeStartPos = null;
let shapePreview = null;

function initializeShapes() {
  // Event listeners para botões de formas (usando padrão padrão de ferramentas)
  const shapeButtons = document.querySelectorAll(
    '[data-tool="triangle"], [data-tool="diamond"], [data-tool="star"], [data-tool="hexagon"]'
  );
  shapeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tool = button.dataset.tool;
      currentTool = tool;

      // Atualizar interface
      document
        .querySelectorAll(".tool-btn")
        .forEach((btn) => btn.classList.remove("active", "selected"));
      button.classList.add("active");

      // Configurar cursor
      gridContainer.style.cursor = "crosshair";

      console.log(`Ferramenta ${tool} selecionada`);
    });
  });

  // Event listener para controle de tamanho
  const shapeSize = document.getElementById("shape-size");
  const shapeSizeValue = document.getElementById("shape-size-value");

  if (shapeSize && shapeSizeValue) {
    shapeSize.addEventListener("input", () => {
      shapeSizeValue.textContent = shapeSize.value;
    });
  }
}

function selectShapeTool(shape) {
  console.log(`Selecionando ferramenta: ${shape}`);
  currentTool = shape;
  currentShape = shape;

  // Limpar seleções anteriores e resetar estados
  document
    .querySelectorAll(".tool-btn")
    .forEach((btn) => btn.classList.remove("active", "selected"));
  isDrawingShape = false;
  shapeStartPos = null;

  // Ativar botão da forma selecionada
  const shapeButton = document.querySelector(`[data-tool="${shape}"]`);
  if (shapeButton) {
    shapeButton.classList.add("active");
    console.log(`Botão ${shape} ativado`);
  } else {
    console.warn(`Botão para ${shape} não encontrado`);
  }

  // Configurar cursor
  gridContainer.style.cursor = "crosshair";

  // Atualizar informações da ferramenta
  updateToolInfo(
    `Ferramenta: ${getShapeName(shape)} - Clique e arraste para desenhar`
  );
}

function getShapeName(shape) {
  const names = {
    triangle: "Triângulo",
    diamond: "Losango",
    star: "Estrela",
    hexagon: "Hexágono",
  };
  return names[shape] || shape;
}

function drawShape(startRow, startCol, endRow, endCol, shape) {
  console.log(
    `Desenhando ${shape} de (${startRow},${startCol}) para (${endRow},${endCol})`
  );

  const size = parseInt(document.getElementById("shape-size")?.value || 8);
  const fillMode =
    document.querySelector('input[name="fill-mode"]:checked')?.value ||
    "outline";
  const centerRow = Math.round((startRow + endRow) / 2);
  const centerCol = Math.round((startCol + endCol) / 2);

  console.log(
    `Tamanho: ${size}, Modo: ${fillMode}, Centro: (${centerRow},${centerCol})`
  );

  const pixels = getShapePixels(
    shape,
    centerRow,
    centerCol,
    size,
    fillMode === "filled"
  );
  console.log(`Pixels da forma:`, pixels.length);

  pixels.forEach(({ row, col }) => {
    if (
      row >= 0 &&
      row < currentGridSize &&
      col >= 0 &&
      col < currentGridSize
    ) {
      const pixel = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
      );
      if (pixel) {
        // Usar o sistema de camadas se disponível, senão pintar diretamente
        if (typeof layers !== "undefined" && layers[currentLayer]) {
          const key = `${row}-${col}`;
          layers[currentLayer].pixels.set(key, selectedColor);
          renderLayers();
        } else {
          pixel.style.backgroundColor = selectedColor;
        }

        // Adicionar efeito visual
        pixel.classList.add("drawing");
        setTimeout(() => pixel.classList.remove("drawing"), 200);
      } else {
        console.warn(`Pixel não encontrado para posição (${row},${col})`);
      }
    }
  });
}

function getShapePixels(shape, centerRow, centerCol, size, filled) {
  const pixels = [];
  const radius = Math.floor(size / 2);

  switch (shape) {
    case "triangle":
      for (let row = -radius; row <= radius; row++) {
        for (let col = -radius; col <= radius; col++) {
          if (isInTriangle(row, col, radius, filled)) {
            pixels.push({ row: centerRow + row, col: centerCol + col });
          }
        }
      }
      break;

    case "diamond":
      for (let row = -radius; row <= radius; row++) {
        for (let col = -radius; col <= radius; col++) {
          if (isInDiamond(row, col, radius, filled)) {
            pixels.push({ row: centerRow + row, col: centerCol + col });
          }
        }
      }
      break;

    case "star":
      for (let row = -radius; row <= radius; row++) {
        for (let col = -radius; col <= radius; col++) {
          if (isInStar(row, col, radius, filled)) {
            pixels.push({ row: centerRow + row, col: centerCol + col });
          }
        }
      }
      break;

    case "hexagon":
      for (let row = -radius; row <= radius; row++) {
        for (let col = -radius; col <= radius; col++) {
          if (isInHexagon(row, col, radius, filled)) {
            pixels.push({ row: centerRow + row, col: centerCol + col });
          }
        }
      }
      break;
  }

  return pixels;
}

function isInTriangle(x, y, radius, filled) {
  // Triângulo muito simples - apenas 3 linhas
  if (Math.abs(x) + Math.abs(y) > radius) return false;

  if (filled) {
    return y >= -radius / 2; // Triângulo preenchido simples
  } else {
    // Contorno - apenas algumas bordas básicas
    return (
      Math.abs(x) + Math.abs(y) === radius ||
      (y === -radius / 2 && Math.abs(x) <= radius / 2)
    );
  }
}

function isInDiamond(x, y, radius, filled) {
  const distance = Math.abs(x) + Math.abs(y);

  if (filled) {
    return distance <= radius;
  } else {
    return distance === radius;
  }
}

function isInStar(x, y, radius, filled) {
  // Estrela muito simples - cruz básica
  const isInCross =
    (Math.abs(x) <= 1 && Math.abs(y) <= radius) ||
    (Math.abs(y) <= 1 && Math.abs(x) <= radius);

  if (filled) {
    return isInCross;
  } else {
    return (
      isInCross && (Math.abs(x) >= radius - 1 || Math.abs(y) >= radius - 1)
    );
  }
}

function isInHexagon(x, y, radius, filled) {
  // Hexágono muito simples - octógono aproximado
  const distance = Math.max(Math.abs(x), Math.abs(y));

  if (filled) {
    return distance <= radius;
  } else {
    return distance === radius;
  }
}

// === SISTEMA DE FILTROS E EFEITOS ===
let currentFilter = null;
let originalPixelData = null;

function initializeFilters() {
  // Event listeners para tabs de filtros
  const filterTabs = document.querySelectorAll(".filter-tab");
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      switchFilterTab(tab.dataset.category);
    });
  });

  // Event listeners para filtros
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectFilter(button.dataset.filter);
    });
  });

  // Event listeners para efeitos
  const effectButtons = document.querySelectorAll(".effect-btn");
  effectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectEffect(button.dataset.effect);
    });
  });

  // Event listeners para controles
  const intensitySlider = document.getElementById("effect-intensity");
  const intensityValue = document.getElementById("effect-intensity-value");

  if (intensitySlider && intensityValue) {
    intensitySlider.addEventListener("input", () => {
      intensityValue.textContent = intensitySlider.value + "%";
      if (currentFilter) {
        previewFilter();
      }
    });
  }

  // Event listeners para botões de ação
  document
    .getElementById("preview-effect")
    ?.addEventListener("click", previewFilter);
  document
    .getElementById("apply-effect")
    ?.addEventListener("click", applyFilter);
  document
    .getElementById("reset-effect")
    ?.addEventListener("click", resetFilter);
}

function switchFilterTab(category) {
  // Atualizar tabs
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  document
    .querySelector(`[data-category="${category}"]`)
    .classList.add("active");

  // Mostrar/ocultar painéis
  document
    .getElementById("filters-panel")
    .classList.toggle("hidden", category !== "filters");
  document
    .getElementById("effects-panel")
    .classList.toggle("hidden", category !== "effects");
}

function selectFilter(filter) {
  currentFilter = filter;

  // Atualizar interface
  document.querySelectorAll(".filter-btn, .effect-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`[data-filter="${filter}"]`).classList.add("active");

  // Salvar estado original
  saveOriginalState();

  updateToolInfo(`Filtro: ${getFilterName(filter)}`);
}

function selectEffect(effect) {
  currentFilter = effect;

  // Atualizar interface
  document.querySelectorAll(".filter-btn, .effect-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`[data-effect="${effect}"]`).classList.add("active");

  // Salvar estado original
  saveOriginalState();

  updateToolInfo(`Efeito: ${getEffectName(effect)}`);
}

function getFilterName(filter) {
  const names = {
    blur: "Desfoque",
    sharpen: "Nitidez",
    emboss: "Relevo",
    edge: "Detecção de Bordas",
    sepia: "Sépia",
    vintage: "Vintage",
  };
  return names[filter] || filter;
}

function getEffectName(effect) {
  const names = {
    glow: "Brilho",
    shadow: "Sombra",
    noise: "Ruído",
    distort: "Distorção",
    gradient: "Gradiente",
    invert: "Inverter Cores",
  };
  return names[effect] || effect;
}

function saveOriginalState() {
  if (!originalPixelData) {
    originalPixelData = [];
    const pixels = document.querySelectorAll(".pixel");
    pixels.forEach((pixel) => {
      originalPixelData.push({
        element: pixel,
        color: pixel.style.backgroundColor || "rgb(255, 255, 255)",
      });
    });
  }
}

function previewFilter() {
  if (!currentFilter) return;

  const intensity =
    parseInt(document.getElementById("effect-intensity").value) / 100;
  applyFilterToPixels(currentFilter, intensity, true);
}

function applyFilter() {
  if (!currentFilter) return;

  const intensity =
    parseInt(document.getElementById("effect-intensity").value) / 100;
  applyFilterToPixels(currentFilter, intensity, false);

  // Limpar dados originais após aplicar
  originalPixelData = null;

  // Adicionar ao histórico de ações
  saveToHistory();
}

function resetFilter() {
  if (!originalPixelData) return;

  // Restaurar cores originais
  originalPixelData.forEach((data) => {
    data.element.style.backgroundColor = data.color;
  });

  originalPixelData = null;

  // Remover seleção de filtro
  document.querySelectorAll(".filter-btn, .effect-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  currentFilter = null;
  updateToolInfo("Filtro resetado");
}

function applyFilterToPixels(filter, intensity, isPreview) {
  const pixels = document.querySelectorAll(".pixel");

  pixels.forEach((pixel) => {
    const currentColor =
      isPreview && originalPixelData
        ? originalPixelData.find((data) => data.element === pixel)?.color ||
          pixel.style.backgroundColor
        : pixel.style.backgroundColor;

    const newColor = applyFilterToColor(currentColor, filter, intensity);
    pixel.style.backgroundColor = newColor;

    if (isPreview) {
      pixel.classList.add("effect-preview");
      setTimeout(() => pixel.classList.remove("effect-preview"), 1500);
    }
  });
}

function applyFilterToColor(colorStr, filter, intensity) {
  if (!colorStr || colorStr === "rgb(255, 255, 255)") return colorStr;

  const rgb = parseColor(colorStr);
  if (!rgb) return colorStr;

  let { r, g, b } = rgb;
  let avg, gray, embossed, edge, edgeValue, sr, sg, sb, noise, distortion;

  switch (filter) {
    case "blur":
      // Suavizar cores (reduzir contraste)
      avg = (r + g + b) / 3;
      r = lerp(r, avg, intensity * 0.5);
      g = lerp(g, avg, intensity * 0.5);
      b = lerp(b, avg, intensity * 0.5);
      break;

    case "sharpen":
      // Aumentar contraste
      r = Math.min(255, r + (r - 128) * intensity);
      g = Math.min(255, g + (g - 128) * intensity);
      b = Math.min(255, b + (b - 128) * intensity);
      break;

    case "emboss":
      // Efeito de relevo (converter para cinza com contraste)
      gray = r * 0.299 + g * 0.587 + b * 0.114;
      embossed = Math.min(255, gray + (gray - 128) * intensity * 2);
      r = g = b = embossed;
      break;

    case "edge":
      // Detecção de bordas (alto contraste)
      edge = Math.abs(r - 128) + Math.abs(g - 128) + Math.abs(b - 128);
      edgeValue = Math.min(255, edge * intensity * 2);
      r = g = b = edgeValue;
      break;

    case "sepia":
      // Filtro sépia
      sr = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
      sg = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
      sb = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      r = lerp(r, sr, intensity);
      g = lerp(g, sg, intensity);
      b = lerp(b, sb, intensity);
      break;

    case "vintage":
      // Efeito vintage (tons quentes + baixo contraste)
      r = Math.min(255, r * (1 + intensity * 0.2));
      g = Math.min(255, g * (1 + intensity * 0.1));
      b = Math.max(0, b * (1 - intensity * 0.1));
      break;

    case "glow":
      // Efeito de brilho
      r = Math.min(255, r + intensity * 50);
      g = Math.min(255, g + intensity * 50);
      b = Math.min(255, b + intensity * 50);
      break;

    case "shadow":
      // Efeito de sombra
      r = Math.max(0, r - intensity * 50);
      g = Math.max(0, g - intensity * 50);
      b = Math.max(0, b - intensity * 50);
      break;

    case "noise":
      // Adicionar ruído
      noise = (Math.random() - 0.5) * intensity * 50;
      r = Math.max(0, Math.min(255, r + noise));
      g = Math.max(0, Math.min(255, g + noise));
      b = Math.max(0, Math.min(255, b + noise));
      break;

    case "invert":
      // Inverter cores
      r = lerp(r, 255 - r, intensity);
      g = lerp(g, 255 - g, intensity);
      b = lerp(b, 255 - b, intensity);
      break;

    case "gradient": {
      // Efeito gradiente baseado na posição do pixel
      const pixelIndex = Array.from(
        document.querySelectorAll(".pixel")
      ).indexOf(
        originalPixelData?.find((data) => data.color === colorStr)?.element
      );
      if (pixelIndex >= 0) {
        const progress = pixelIndex / (currentGridSize * currentGridSize);
        r = Math.min(255, r + (255 - r) * progress * intensity);
        g = Math.min(255, g + (128 - g) * progress * intensity);
        b = Math.min(255, b + (64 - b) * progress * intensity);
      }
      break;
    }

    case "distort":
      // Efeito de distorção cromática
      distortion = Math.sin(Date.now() * 0.01) * intensity * 20;
      r = Math.max(0, Math.min(255, r + distortion));
      g = Math.max(0, Math.min(255, g + distortion * 0.5));
      b = Math.max(0, Math.min(255, b - distortion * 0.5));
      break;
  }

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

// === SISTEMA DE CAMADAS ===
let layers = [];
let currentLayer = 0;

function initializeLayers() {
  layers = [
    {
      name: "Camada 1",
      visible: true,
      opacity: 1.0,
      blendMode: "normal",
      pixels: new Map(),
    },
  ];
}

function addLayer() {
  const newLayer = {
    name: `Camada ${layers.length + 1}`,
    visible: true,
    opacity: 1.0,
    blendMode: "normal",
    pixels: new Map(),
  };

  layers.push(newLayer);
  currentLayer = layers.length - 1;
  updateLayersUI();
}

function deleteLayer(index) {
  if (layers.length > 1) {
    layers.splice(index, 1);
    if (currentLayer >= layers.length) {
      currentLayer = layers.length - 1;
    }
    updateLayersUI();
    renderLayers();
  }
}

function setLayerOpacity(index, opacity) {
  if (layers[index]) {
    layers[index].opacity = opacity;
    renderLayers();
  }
}

function setLayerBlendMode(index, blendMode) {
  if (layers[index]) {
    layers[index].blendMode = blendMode;
    renderLayers();
  }
}

function toggleLayerVisibility(index) {
  if (layers[index]) {
    layers[index].visible = !layers[index].visible;
    renderLayers();
  }
}

function renderLayers() {
  const pixels = document.querySelectorAll(".pixel");

  pixels.forEach((pixel, index) => {
    const row = parseInt(pixel.dataset.row);
    const col = parseInt(pixel.dataset.col);
    const key = `${row}-${col}`;

    // Cor base (branco)
    let finalR = 255,
      finalG = 255,
      finalB = 255;

    // Aplicar camadas em ordem
    layers.forEach((layer) => {
      if (!layer.visible) return;

      const layerColor = layer.pixels.get(key);
      if (layerColor) {
        const rgb = parseColor(layerColor);
        if (rgb) {
          // Aplicar blend mode
          const blended = applyBlendMode(
            { r: finalR, g: finalG, b: finalB },
            rgb,
            layer.blendMode,
            layer.opacity
          );

          finalR = blended.r;
          finalG = blended.g;
          finalB = blended.b;
        }
      }
    });

    pixel.style.backgroundColor = `rgb(${Math.round(finalR)}, ${Math.round(
      finalG
    )}, ${Math.round(finalB)})`;
  });
}

function applyBlendMode(base, overlay, blendMode, opacity) {
  let result = { ...overlay };

  switch (blendMode) {
    case "multiply":
      result.r = (base.r * overlay.r) / 255;
      result.g = (base.g * overlay.g) / 255;
      result.b = (base.b * overlay.b) / 255;
      break;

    case "screen":
      result.r = 255 - ((255 - base.r) * (255 - overlay.r)) / 255;
      result.g = 255 - ((255 - base.g) * (255 - overlay.g)) / 255;
      result.b = 255 - ((255 - base.b) * (255 - overlay.b)) / 255;
      break;

    case "overlay":
      result.r =
        base.r < 128
          ? (2 * base.r * overlay.r) / 255
          : 255 - (2 * (255 - base.r) * (255 - overlay.r)) / 255;
      result.g =
        base.g < 128
          ? (2 * base.g * overlay.g) / 255
          : 255 - (2 * (255 - base.g) * (255 - overlay.g)) / 255;
      result.b =
        base.b < 128
          ? (2 * base.b * overlay.b) / 255
          : 255 - (2 * (255 - base.b) * (255 - overlay.b)) / 255;
      break;

    case "soft-light":
      result.r =
        overlay.r < 128
          ? (2 * base.r * overlay.r) / 255 +
            (base.r * base.r * (255 - 2 * overlay.r)) / 65025
          : (2 * base.r * (255 - overlay.r)) / 255 +
            Math.sqrt(base.r / 255) * (2 * overlay.r - 255) * 255;
      result.g =
        overlay.g < 128
          ? (2 * base.g * overlay.g) / 255 +
            (base.g * base.g * (255 - 2 * overlay.g)) / 65025
          : (2 * base.g * (255 - overlay.g)) / 255 +
            Math.sqrt(base.g / 255) * (2 * overlay.g - 255) * 255;
      result.b =
        overlay.b < 128
          ? (2 * base.b * overlay.b) / 255 +
            (base.b * base.b * (255 - 2 * overlay.b)) / 65025
          : (2 * base.b * (255 - overlay.b)) / 255 +
            Math.sqrt(base.b / 255) * (2 * overlay.b - 255) * 255;
      break;

    default: // normal
      break;
  }

  // Aplicar opacidade
  result.r = lerp(base.r, result.r, opacity);
  result.g = lerp(base.g, result.g, opacity);
  result.b = lerp(base.b, result.b, opacity);

  return result;
}

function updateLayersUI() {
  const layersContainer = document.getElementById("layers-list");
  if (!layersContainer) {
    console.log(
      "Container de camadas não encontrado, registrando no console:",
      layers.map((l) => l.name)
    );
    return;
  }

  layersContainer.innerHTML = "";

  layers.forEach((layer, index) => {
    const layerItem = document.createElement("div");
    layerItem.className = `layer-item p-2 border rounded cursor-pointer ${
      index === currentLayer
        ? "bg-purple-100 border-purple-300"
        : "bg-white border-gray-200"
    }`;

    layerItem.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="font-medium">${layer.name}</span>
        <div class="flex items-center gap-2">
          <button class="layer-visibility text-sm ${
            layer.visible ? "text-blue-500" : "text-gray-400"
          }">
            <i class="fas ${layer.visible ? "fa-eye" : "fa-eye-slash"}"></i>
          </button>
          <span class="layer-opacity-value text-xs">${Math.round(
            layer.opacity * 100
          )}%</span>
        </div>
      </div>
      <div class="mt-2 flex items-center gap-2">
        <input type="range" min="0" max="100" value="${layer.opacity * 100}" 
               class="layer-opacity flex-1 h-1 bg-gray-200 rounded">
        <select class="layer-blend text-xs">
          <option value="normal" ${
            layer.blendMode === "normal" ? "selected" : ""
          }>Normal</option>
          <option value="multiply" ${
            layer.blendMode === "multiply" ? "selected" : ""
          }>Multiplicar</option>
          <option value="screen" ${
            layer.blendMode === "screen" ? "selected" : ""
          }>Tela</option>
          <option value="overlay" ${
            layer.blendMode === "overlay" ? "selected" : ""
          }>Sobreposição</option>
          <option value="soft-light" ${
            layer.blendMode === "soft-light" ? "selected" : ""
          }>Luz Suave</option>
        </select>
      </div>
    `;

    layersContainer.appendChild(layerItem);
  });

  // Reconfigurar event listeners
  setupLayerItemEventListeners();
}

function parseColor(colorStr) {
  const match = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
    };
  }
  return null;
}

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

// === CONTROLES MOBILE ===
function setupMobileControls() {
  const toggleColors = document.getElementById("toggle-colors");
  const toggleTools = document.getElementById("toggle-tools");
  const toggleEffects = document.getElementById("toggle-effects");

  const colorsPanel = document.getElementById("colors-panel");
  const toolsPanel = document.getElementById("tools-panel");

  if (toggleColors && colorsPanel) {
    toggleColors.addEventListener("click", () => {
      colorsPanel.classList.toggle("hidden");
      toolsPanel?.classList.add("hidden");

      // Atualizar aparência do botão
      toggleColors.classList.toggle("bg-purple-500");
      toggleColors.classList.toggle("text-white");
      toggleTools?.classList.remove("bg-purple-500", "text-white");
    });
  }

  if (toggleTools && toolsPanel) {
    toggleTools.addEventListener("click", () => {
      toolsPanel.classList.toggle("hidden");
      colorsPanel?.classList.add("hidden");

      // Atualizar aparência do botão
      toggleTools.classList.toggle("bg-purple-500");
      toggleTools.classList.toggle("text-white");
      toggleColors?.classList.remove("bg-purple-500", "text-white");
    });
  }

  if (toggleEffects) {
    toggleEffects.addEventListener("click", () => {
      // Encontrar seção de efeitos no painel de ferramentas
      const headings = document.querySelectorAll("h3");
      let effectsSection = null;

      headings.forEach((heading) => {
        if (
          heading.textContent.includes("Filtros") ||
          heading.textContent.includes("Efeitos")
        ) {
          effectsSection = heading;
        }
      });

      if (effectsSection) {
        effectsSection.scrollIntoView({ behavior: "smooth" });
      }

      // Mostrar painel de ferramentas se estiver oculto
      toolsPanel?.classList.remove("hidden");
      colorsPanel?.classList.add("hidden");

      toggleTools?.classList.add("bg-purple-500", "text-white");
      toggleColors?.classList.remove("bg-purple-500", "text-white");
    });
  }
}

// Detectar redimensionamento para ajustar layout
function setupResponsiveLayout() {
  function adjustCanvasSize() {
    const container = document.getElementById("canvas-container");
    const grid = document.getElementById("grid-container");
    if (!container || !grid) return;

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const isDesktop = window.innerWidth >= 1024;
    const isLargeDesktop = window.innerWidth >= 1440;
    const isUltraWide = window.innerWidth >= 1920;

    // Ajustar tamanho do canvas baseado na tela
    if (isMobile) {
      grid.style.width = "min(90vw, 90vh)";
      grid.style.height = "min(90vw, 90vh)";
    } else if (isTablet) {
      grid.style.width = "min(70vw, 70vh)";
      grid.style.height = "min(70vw, 70vh)";
    } else if (isUltraWide) {
      grid.style.width = "800px";
      grid.style.height = "800px";
    } else if (isLargeDesktop) {
      grid.style.width = "700px";
      grid.style.height = "700px";
    } else if (isDesktop) {
      grid.style.width = "600px";
      grid.style.height = "600px";
    }
  }

  function handleResize() {
    const isMobile = window.innerWidth < 768;
    const colorsPanel = document.getElementById("colors-panel");
    const toolsPanel = document.getElementById("tools-panel");

    if (!isMobile) {
      // Em desktop, mostrar painéis sempre
      colorsPanel?.classList.remove("hidden");
      toolsPanel?.classList.remove("hidden");

      // Reset mobile button states
      document
        .querySelectorAll("#toggle-colors, #toggle-tools, #toggle-effects")
        .forEach((btn) => {
          btn?.classList.remove("bg-purple-500", "text-white");
        });
    } else {
      // Em mobile, ocultar painéis inicialmente
      colorsPanel?.classList.add("hidden");
      toolsPanel?.classList.add("hidden");
    }

    // Ajustar canvas
    adjustCanvasSize();

    // Atualizar tooltip positions
    updateTooltipPositions();
  }

  // Throttle resize events para performance
  let resizeTimeout;
  function throttledResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 100);
  }

  window.addEventListener("resize", throttledResize);
  window.addEventListener("orientationchange", () => {
    setTimeout(handleResize, 500); // Delay para orientação
  });

  handleResize(); // Executar na inicialização
}

// Função para atualizar posições dos tooltips em telas pequenas
function updateTooltipPositions() {
  const tooltips = document.querySelectorAll(".tooltip");
  const isMobile = window.innerWidth < 768;

  tooltips.forEach((tooltip) => {
    if (isMobile) {
      // Em mobile, posicionar tooltips abaixo do elemento
      tooltip.style.setProperty("--tooltip-position", "bottom");
    } else {
      // Em desktop, manter posição padrão
      tooltip.style.removeProperty("--tooltip-position");
    }
  });
}
