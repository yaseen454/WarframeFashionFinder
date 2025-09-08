import { warframePalettes } from "./data/palettes.js";

// --- DOM Elements ---
const appNavTabs = document.getElementById('app-nav-tabs');
const appPages = document.querySelectorAll('main[id^="page-"]');
const colorPicker = document.getElementById('color-picker');
const hexInput = document.getElementById('hex-input');
const rgbInput = document.getElementById('rgb-input');
const hslInput = document.getElementById('hsl-input');
const messageBox = document.getElementById('message-box');
const warframeSlotsContainer = document.getElementById('warframe-slots-container');
const infoPopover = document.getElementById('info-popover');

// Main Tabs
const mainTabsNav = document.getElementById('main-tabs-nav');
const mainTabsContent = document.querySelectorAll('.main-tab-content');

// Classic Harmony Elements
const harmonyTabsNav = document.getElementById('harmony-tabs-nav');
const harmonyTabsContent = document.getElementById('harmony-tabs-content');

// Shades, Tints, Tones (STT) Elements
const sttTabsNav = document.getElementById('stt-tabs-nav');
const sttTabsContent = document.getElementById('stt-tabs-content');
const classicResultsContainer = document.getElementById('classic-results-container');
const sttResultsContainer = document.getElementById('stt-results-container');

// Generate Fashion Elements
const generateFashionBtn = document.getElementById('generate-fashion-btn');
const generateStyleSelector = document.getElementById('generate-style-selector');
const generateHarmonyContainer = document.getElementById('generate-harmony-container');
const generateHarmonySelector = document.getElementById('generate-harmony-selector');
const generateColorCount = document.getElementById('generate-color-count');
const generateOutputContainer = document.getElementById('generate-output-container');
const useCurrentColorCheckbox = document.getElementById('use-current-color-checkbox');

// Quick Add Modal Elements
const addToModal = document.getElementById('add-to-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalColorPreview = document.getElementById('modal-color-preview');
const modalColorHex = document.getElementById('modal-color-hex');
const modalSlots = document.getElementById('modal-slots');

// Base Palette Selector Elements
const paletteSelector = document.getElementById('palette-selector');
const paletteColorGrid = document.getElementById('palette-color-grid');
const basePaletteHeader = document.getElementById('base-palette-header');
const basePaletteContent = document.getElementById('base-palette-content');
const paletteToggleIcon = document.getElementById('palette-toggle-icon');

// Select-for-Slot Modal Elements
const selectForSlotModal = document.getElementById('select-for-slot-modal');
const selectForSlotCloseBtn = document.getElementById('select-for-slot-close-btn');
const selectForSlotTitle = document.getElementById('select-for-slot-title');
const selectForSlotPaletteSelector = document.getElementById('select-for-slot-palette-selector');
const selectForSlotGridContainer = document.getElementById('select-for-slot-grid-container');
const selectForSlotSearch = document.getElementById('select-for-slot-search');

// Palette Filter Elements
const filterPalettesHeader = document.getElementById('filter-palettes-header');
const filterPalettesContent = document.getElementById('filter-palettes-content');
const filterToggleIcon = document.getElementById('filter-toggle-icon');
const paletteFilterGrid = document.getElementById('palette-filter-grid');
const selectAllPalettesBtn = document.getElementById('select-all-palettes');
const deselectAllPalettesBtn = document.getElementById('deselect-all-palettes');
const paletteSearchInput = document.getElementById('palette-search-input');

// --- App State ---
const warframeColorSlots = {
    Primary: null,
    Secondary: null,
    Tertiary: null,
    Accents: null,
    'Emissive 1': null,
    'Emissive 2': null,
    'Energy 1': null,
    'Energy 2': null,
};
let currentlyEditingSlot = null;
let activePalettes = new Set(warframePalettes.map(p => p.name));

// --- Event Listeners ---
// App Navigation Listener
appNavTabs.addEventListener('click', (e) => {
    if (e.target.matches('.app-nav-button')) {
        const targetPageId = e.target.dataset.page;

        // Update buttons
        appNavTabs.querySelectorAll('.app-nav-button').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Update pages
        appPages.forEach(page => {
            page.classList.toggle('hidden', page.id !== targetPageId);
        });
    }
});

colorPicker.addEventListener('input', () => updateColor(colorPicker.value, { regenerate: true, showNotif: false }));
hexInput.addEventListener('change', () => updateColor(hexInput.value, { regenerate: true, showNotif: true }));
rgbInput.addEventListener('change', () => updateColor(rgbInput.value, { regenerate: true, showNotif: true }));
hslInput.addEventListener('change', () => updateColor(hslInput.value, { regenerate: true, showNotif: true }));
document.getElementById('copy-hex').addEventListener('click', () => copyToClipboard(hexInput.value));
document.getElementById('copy-rgb').addEventListener('click', () => copyToClipboard(rgbInput.value));
document.getElementById('copy-hsl').addEventListener('click', () => copyToClipboard(hslInput.value));

// Modal Listeners
modalCloseBtn.addEventListener('click', hideAddToMenu);
addToModal.addEventListener('click', (event) => {
    if (event.target === addToModal) hideAddToMenu();
});
selectForSlotCloseBtn.addEventListener('click', hideSelectForSlotModal);
selectForSlotModal.addEventListener('click', (event) => {
    if (event.target === selectForSlotModal) hideSelectForSlotModal();
});
selectForSlotPaletteSelector.addEventListener('change', (e) => renderSelectForSlotGrid(e.target.value));
// --- Base Palette Selector Listener
paletteSelector.addEventListener('change', (e) => renderPaletteSelectorGrid(e.target.value));
basePaletteHeader.addEventListener('click', () => {
    const isExpanded = basePaletteContent.classList.toggle('expanded');
    paletteToggleIcon.classList.toggle('rotated', isExpanded);
    basePaletteContent.style.maxHeight = isExpanded ? basePaletteContent.scrollHeight + 'px' : '0px';
});

// Main Tab Listeners
mainTabsNav.addEventListener('click', (e) => {
    if (e.target.matches('.main-tab-button')) {
        mainTabsNav.querySelectorAll('.main-tab-button').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        mainTabsContent.forEach(content => {
            content.classList.toggle('hidden', content.id !== e.target.dataset.target);
        });
    }
});

// Generate Fashion Listener
generateFashionBtn.addEventListener('click', handleGenerateFashion);
generateStyleSelector.addEventListener('change', updateGeneratorControls);

// Palette Filter Listeners
filterPalettesHeader.addEventListener('click', () => {
    const isExpanded = filterPalettesContent.classList.toggle('expanded');
    filterToggleIcon.classList.toggle('rotated', isExpanded);
    filterPalettesContent.style.maxHeight = isExpanded ? filterPalettesContent.scrollHeight + 'px' : '0px';
});
selectAllPalettesBtn.addEventListener('click', () => {
    document.querySelectorAll('.palette-filter-checkbox').forEach(cb => cb.checked = true);
    activePalettes = new Set(warframePalettes.map(p => p.name));
    updatePaletteSelectors();
});
deselectAllPalettesBtn.addEventListener('click', () => {
    document.querySelectorAll('.palette-filter-checkbox').forEach(cb => cb.checked = false);
    activePalettes.clear();
    updatePaletteSelectors();
});
paletteSearchInput.addEventListener('input', handlePaletteSearch);

// --- Color Conversion & Calculation Functions ---
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    const num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r, g, b) {
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        console.error("Invalid RGB value received:", { r, g, b });
        return "#000000";
    }
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
    else if (h >= 60 && h < 120) [r, g, b] = [x, c, 0];
    else if (h >= 120 && h < 180) [r, g, b] = [0, c, x];
    else if (h >= 180 && h < 240) [r, g, b] = [0, x, c];
    else if (h >= 240 && h < 300) [r, g, b] = [x, 0, c];
    else if (h >= 300 && h < 360) [r, g, b] = [c, 0, x];
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return { r, g, b };
}

function rgbToLab(r, g, b) {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    r = r * 100;
    g = g * 100;
    b = b * 100;
    const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
    const xRef = x / 95.047;
    const yRef = y / 100.0;
    const zRef = z / 108.883;
    const xNorm = xRef > 0.008856 ? Math.pow(xRef, 1 / 3) : (7.787 * xRef) + (16 / 116);
    const yNorm = yRef > 0.008856 ? Math.pow(yRef, 1 / 3) : (7.787 * yRef) + (16 / 116);
    const zNorm = zRef > 0.008856 ? Math.pow(zRef, 1 / 3) : (7.787 * zRef) + (16 / 116);
    const L = (116 * yNorm) - 16;
    const a = 500 * (xNorm - yNorm);
    const bLab = 200 * (yNorm - zNorm);
    return [L, a, bLab];
}

function ciede2000(L1, a1, b1, L2, a2, b2, kL = 1, kC = 1, kH = 1) {
    const radianToDegree = radian => radian * (180 / Math.PI);
    const degreeToRadian = degree => degree * (Math.PI / 180);
    const deltaLp = L2 - L1;
    const L_ = (L1 + L2) / 2;
    const C1 = Math.sqrt(a1 * a1 + b1 * b1);
    const C2 = Math.sqrt(a2 * a2 + b2 * b2);
    const C_ = (C1 + C2) / 2;
    const ap1 = a1 + (a1 / 2) * (1 - Math.sqrt(Math.pow(C_, 7) / (Math.pow(C_, 7) + Math.pow(25, 7))));
    const ap2 = a2 + (a2 / 2) * (1 - Math.sqrt(Math.pow(C_, 7) / (Math.pow(C_, 7) + Math.pow(25, 7))));
    const Cp1 = Math.sqrt(ap1 * ap1 + b1 * b1);
    const Cp2 = Math.sqrt(ap2 * ap2 + b2 * b2);
    const Cp_ = (Cp1 + Cp2) / 2;
    const deltaCp = Cp2 - Cp1;
    let hp1 = b1 === 0 && ap1 === 0 ? 0 : radianToDegree(Math.atan2(b1, ap1));
    if (hp1 < 0) hp1 += 360;
    let hp2 = b2 === 0 && ap2 === 0 ? 0 : radianToDegree(Math.atan2(b2, ap2));
    if (hp2 < 0) hp2 += 360;
    let deltahp;
    if (C1 === 0 || C2 === 0) {
        deltahp = 0;
    } else if (Math.abs(hp1 - hp2) <= 180) {
        deltahp = hp2 - hp1;
    } else if (hp2 <= hp1) {
        deltahp = hp2 - hp1 + 360;
    } else {
        deltahp = hp2 - hp1 - 360;
    }
    const deltaHp = 2 * Math.sqrt(Cp1 * Cp2) * Math.sin(degreeToRadian(deltahp) / 2);
    const Hp_ = Math.abs(hp1 - hp2) > 180 ? (hp1 + hp2 + 360) / 2 : (hp1 + hp2) / 2;
    const T = 1 - 0.17 * Math.cos(degreeToRadian(Hp_ - 30)) + 0.24 * Math.cos(degreeToRadian(2 * Hp_)) +
        0.32 * Math.cos(degreeToRadian(3 * Hp_ + 6)) - 0.20 * Math.cos(degreeToRadian(4 * Hp_ - 63));
    const SL = 1 + ((0.015 * Math.pow(L_ - 50, 2)) / Math.sqrt(20 + Math.pow(L_ - 50, 2)));
    const SC = 1 + 0.045 * Cp_;
    const SH = 1 + 0.015 * Cp_ * T;
    const RT = -2 * Math.sqrt(Math.pow(Cp_, 7) / (Math.pow(Cp_, 7) + Math.pow(25, 7))) *
        Math.sin(degreeToRadian(60 * Math.exp(-Math.pow((Hp_ - 275) / 25, 2))));
    return Math.sqrt(
        Math.pow(deltaLp / (kL * SL), 2) +
        Math.pow(deltaCp / (kC * SC), 2) +
        Math.pow(deltaHp / (kH * SH), 2) +
        RT * (deltaCp / (kC * SC)) * (deltaHp / (kH * SH))
    );
}

// --- Color Combination Generation ---
function getHarmonies(hsl) {
    const { h, s, l } = hsl;
    return {
        complementary: [hslToRgb((h + 180) % 360, s, l)],
        monochromatic: [hslToRgb(h, s, Math.min(100, l + 20)), hslToRgb(h, s, Math.max(0, l - 20))],
        analogous: [hslToRgb((h + 30) % 360, s, l), hslToRgb((h - 30 + 360) % 360, s, l)],
        triadic: [hslToRgb((h + 120) % 360, s, l), hslToRgb((h + 240) % 360, s, l)],
        tetradic: [hslToRgb((h + 90) % 360, s, l), hslToRgb((h + 180) % 360, s, l), hslToRgb((h + 270) % 360, s, l)]
    };
}

function getShadesTintsTones(hsl) {
    const { h, s, l } = hsl;
    const variations = { shades: [], tints: [], tones: [] };
    for (let i = 1; i <= 5; i++) {
        variations.shades.push(hslToRgb(h, s, Math.max(0, l - i * 10)));
        variations.tints.push(hslToRgb(h, s, Math.min(100, l + i * 10)));
        variations.tones.push(hslToRgb(h, Math.max(0, s - i * 15), l));
    }
    return variations;
}

// --- Color Matching ---
const getFilteredPalettes = () => warframePalettes.filter(p => activePalettes.has(p.name));

function colorDiff(rgb1, rgb2) {
    const [L1, a1, b1] = rgbToLab(rgb1.r, rgb1.g, rgb1.b);
    const [L2, a2, b2] = rgbToLab(rgb2.r, rgb2.g, rgb2.b);
    return ciede2000(L1, a1, b1, L2, a2, b2);
}

function findClosestWarframeColors(rgbColor, count = 50) {
    const allMatches = [];
    const maxDiff = 100;
    const similarityThreshold = 70; // Only show palettes with at least this similarity
    const processedHexCodes = new Set(); // Keep track of colors we've already processed

    getFilteredPalettes().forEach(palette => {
        palette.colors.forEach((hex, index) => {
            // If hex is null or we've already processed this exact color, skip it.
            if (!hex || processedHexCodes.has(hex)) {
                return;
            }

            const paletteRgb = hexToRgb(hex);
            const diff = colorDiff(rgbColor, paletteRgb);
            const similarity = 100 * Math.pow(1 - (diff / maxDiff), 2);

            if (similarity >= similarityThreshold) {
                allMatches.push({
                    palette: palette.name,
                    color: hex,
                    diff: diff,
                    similarity: similarity.toFixed(1),
                    rowIndex: Math.floor(index / 5),
                    colIndex: index % 5,
                });
                processedHexCodes.add(hex); // Mark this hex code as processed.
            }
        });
    });

    allMatches.sort((a, b) => b.similarity - a.similarity);
    return allMatches.slice(0, count);
}

function findSingleClosestWarframeColor(rgbColor) {
    let bestMatch = { diff: Infinity };
    getFilteredPalettes().forEach(palette => {
        palette.colors.forEach((hex, index) => {
            const paletteRgb = hexToRgb(hex);
            const diff = colorDiff(rgbColor, paletteRgb);
            if (diff < bestMatch.diff) {
                bestMatch = {
                    palette: palette.name,
                    color: hex,
                    diff,
                    rowIndex: Math.floor(index / 5),
                    colIndex: index % 5
                };
            }
        });
    });
    return bestMatch.diff === Infinity ? null : bestMatch;
}

// --- UI Update Functions ---
function parseColorString(colorStr) {
    let rgb, hex, hsl;
    try {
        if (colorStr.startsWith('#')) {
            hex = colorStr;
            rgb = hexToRgb(hex);
        } else if (colorStr.startsWith('rgb')) {
            const parts = colorStr.match(/(\d+)/g);
            rgb = { r: parseInt(parts[0]), g: parseInt(parts[1]), b: parseInt(parts[2]) };
            hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        } else if (colorStr.startsWith('hsl')) {
            const parts = colorStr.match(/(\d+(\.\d+)?)/g);
            hsl = { h: parseFloat(parts[0]), s: parseFloat(parts[1]), l: parseFloat(parts[2]) };
            rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
            hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        } else {
            if (/^[0-9A-F]{6}$/i.test(colorStr) || /^[0-9A-F]{3}$/i.test(colorStr)) {
                hex = '#' + colorStr;
                rgb = hexToRgb(hex);
            } else {
                return null;
            }
        }
        if (!hsl) hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        return { rgb, hex, hsl };
    } catch (e) {
        console.error("Invalid color format:", e);
        return null;
    }
}

function updateColor(colorStr, options = {}) {
    const defaults = {
        regenerate: false,
        showNotif: false
    };
    const settings = { ...defaults, ...options };

    const colorData = parseColorString(colorStr);
    if (!colorData) return;

    const { rgb, hex, hsl } = colorData;

    colorPicker.value = hex;
    hexInput.value = hex.toUpperCase();
    rgbInput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    hslInput.value = `hsl(${hsl.h.toFixed(0)}, ${hsl.s.toFixed(0)}%, ${hsl.l.toFixed(0)}%)`;

    if (settings.regenerate) {
        buildClassicCombinationsTabs(getHarmonies(hsl), rgb);
        buildShadesTintsTonesTabs(getShadesTintsTones(hsl), rgb);
    }

    if (settings.showNotif) {
        const message = settings.regenerate ? `Matches updated for ${hex.toUpperCase()}` : `Base color set to ${hex.toUpperCase()} click "Update Matches" to apply this color.`;
        showMessage(message);
    }
}

function buildClassicCombinationsTabs(harmonies, baseRgb) {
    const harmonyExplanations = {
        complementary: "Two colors on opposite sides of the wheel for high contrast.",
        monochromatic: "Shades, tones, and tints of one base color for a subtle look.",
        analogous: "Three colors side-by-side on the wheel. Versatile but can be overwhelming.",
        triadic: "Three colors evenly spaced on the wheel for high contrast and harmony.",
        tetradic: "Four evenly spaced colors, creating a bold and vibrant palette."
    };
    buildTabbedContent(harmonyTabsNav, harmonyTabsContent, harmonies, baseRgb, harmonyExplanations);
}

function buildShadesTintsTonesTabs(variations, baseRgb) {
    const sttExplanations = {
        shades: "A shade is created by adding black to a base hue, darkening it.",
        tints: "A tint is created by adding white to a base hue, lightening it.",
        tones: "A tone is created by adding grey to a base hue, desaturating it."
    };
    buildTabbedContent(sttTabsNav, sttTabsContent, variations, baseRgb, sttExplanations);
}

function buildTabbedContent(navContainer, contentContainer, colorGroups, baseRgb, explanations) {
    navContainer.innerHTML = '';
    contentContainer.innerHTML = '';

    Object.keys(colorGroups).forEach((type, index) => {
        const button = document.createElement('button');
        button.className = `tab-button ${index === 0 ? 'active' : ''}`;
        button.textContent = type;
        button.dataset.target = `sub-tab-${type}-${navContainer.id}`;
        navContainer.appendChild(button);

        const content = document.createElement('div');
        content.id = `sub-tab-${type}-${navContainer.id}`;
        content.className = `tab-content ${index === 0 ? '' : 'hidden'}`;

        if (explanations[type]) {
            const description = document.createElement('p');
            description.className = 'text-sm text-gray-400 mb-4';
            description.textContent = explanations[type];
            content.appendChild(description);
        }

        const generatedColors = [baseRgb, ...colorGroups[type]];
        const colorSelectorContainer = document.createElement('div');
        colorSelectorContainer.className = 'harmony-color-selector';

        generatedColors.forEach((color, colorIndex) => {
            const hex = rgbToHex(color.r, color.g, color.b);
            const colorButton = document.createElement('button');
            colorButton.className = 'harmony-color-choice';
            
            const isBaseColor = colorIndex === 0;
            const baseLabelHTML = isBaseColor ? '<span class="base-label">Base</span>' : '';

            colorButton.innerHTML = `
                <div class="color-swatch" style="background-color: ${hex};">
                    <div class="harmony-swatch-overlay">
                        ${baseLabelHTML}
                        <span class="font-mono">${hex}</span>
                    </div>
                </div>`;
            colorButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent this click from being caught by the document listener immediately
                const isActive = colorButton.classList.contains('active');
                // Deactivate all other buttons
                content.querySelectorAll('.harmony-color-choice.active').forEach(btn => btn.classList.remove('active'));
                // If it wasn't active, activate it and load matches
                if (!isActive) {
                    colorButton.classList.add('active');
                    displayPaletteMatchesForColor(color, content);
                } else {
                    // If it was already active, clicking it again does nothing to the button,
                    // but we clear the results below.
                    const resultsContainer = content.querySelector('.results-area');
                    resultsContainer.innerHTML = '';
                }
            });
            colorSelectorContainer.appendChild(colorButton);
        });
        content.appendChild(colorSelectorContainer);

        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'results-area mt-4';
        content.appendChild(resultsContainer);

        contentContainer.appendChild(content);
    });

    navContainer.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            navContainer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            contentContainer.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            button.classList.add('active');
            document.getElementById(button.dataset.target).classList.remove('hidden');
        });
    });

    // Add a listener to close active harmony choices when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.harmony-color-selector')) {
            contentContainer.querySelectorAll('.harmony-color-choice.active').forEach(btn => btn.classList.remove('active'));
        }
    });
}

function displayMatchesInContainer(selectedRgb, container) {
    container.innerHTML = `
        <div class="palette-display-area">
            <div class="color-list-container">
                <p class="text-xs text-gray-500 mb-2 text-center">Click a swatch to see its palette. Hover for options.</p>
                <div class="color-match-scroller"></div>
            </div>
            <div class="palette-grid-container">
                <div class="placeholder">Select a color swatch from the list to view its palette.</div>
            </div>
        </div>`;

    const scroller = container.querySelector('.color-match-scroller');
    const paletteDisplay = container.querySelector('.palette-grid-container');
    const closeMatches = findClosestWarframeColors(selectedRgb);

    if (closeMatches.length > 0) {
        const matchesByPalette = closeMatches.reduce((acc, match) => {
            if (!acc[match.palette]) {
                acc[match.palette] = [];
            }
            acc[match.palette].push(match);
            return acc;
        }, {});

        for (const paletteName in matchesByPalette) {
            const matches = matchesByPalette[paletteName];
            const card = document.createElement('div');
            card.className = 'palette-match-card';

            const header = document.createElement('h4');
            header.className = 'palette-match-card-header';
            header.textContent = paletteName;
            card.appendChild(header);

            const grid = document.createElement('div');
            grid.className = 'palette-match-grid';

            matches.forEach(match => {
                const swatch = document.createElement('div');
                swatch.className = 'matched-color-swatch';
                swatch.style.backgroundColor = match.color;
                swatch.innerHTML = `
                    <div class="matched-color-info">
                        <span>~${match.similarity}%</span>
                    </div>
                    <button class="add-to-warframe-btn-small"><i class="fa fa-plus"></i></button>
                `;

                swatch.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isActive = swatch.classList.contains('active');
                    scroller.querySelectorAll('.matched-color-swatch.active').forEach(s => s.classList.remove('active'));
                    if (!isActive) {
                        swatch.classList.add('active');
                        displayPaletteGrid(match.palette, selectedRgb, paletteDisplay, match.color, match.similarity);
                    } else {
                        paletteDisplay.innerHTML = `<div class="placeholder">Select a color swatch from the list to view its palette.</div>`;
                    }
                });

                swatch.querySelector('.add-to-warframe-btn-small').addEventListener('click', (e) => {
                    e.stopPropagation();
                    showAddToMenu(match.color);
                });

                grid.appendChild(swatch);
            });

            card.appendChild(grid);
            scroller.appendChild(card);
        }

        // Add a listener to close active swatches when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.color-list-container')) {
                scroller.querySelectorAll('.matched-color-swatch.active').forEach(s => s.classList.remove('active'));
            }
        });

    } else {
        scroller.innerHTML = `<p class="text-gray-500 italic p-4 text-center">No strong matches found.</p>`;
    }
}

function displayPaletteMatchesForColor(selectedRgb, tabContent) {
    const resultsContainer = tabContent.querySelector('.results-area');
    displayMatchesInContainer(selectedRgb, resultsContainer);
}

function displayPaletteGrid(paletteName, originalRgb, displayContainer, matchedHex, similarity) {
    displayContainer.innerHTML = '';
    const palette = warframePalettes.find(p => p.name === paletteName);
    if (!palette) return;

    const gridContainer = document.createElement('div');
    gridContainer.className = 'bg-gray-900 p-4 rounded-lg';
    const gridTitle = document.createElement('h3');
    gridTitle.className = 'text-xl font-semibold mb-4 text-white';
    gridTitle.textContent = `${palette.name} Palette`;
    gridContainer.appendChild(gridTitle);

    const grid = document.createElement('div');
    grid.className = 'palette-grid';
    gridContainer.appendChild(grid);

    // Create headers using DOM methods for performance and consistency
    const headerFrag = document.createDocumentFragment();
    const corner = document.createElement('div');
    corner.className = 'palette-cell header';
    headerFrag.appendChild(corner);
    for (let i = 1; i <= 5; i++) {
        const headerCell = document.createElement('div');
        headerCell.className = 'palette-cell header';
        headerCell.textContent = i;
        headerFrag.appendChild(headerCell);
    }
    grid.append(headerFrag);

    const numRows = Math.ceil(palette.colors.length / 5);
    for (let i = 0; i < numRows; i++) {
        const rowHeader = document.createElement('div');
        rowHeader.className = 'palette-cell header';
        rowHeader.textContent = String.fromCharCode(65 + i);
        grid.appendChild(rowHeader);

        for (let j = 0; j < 5; j++) {
            const colorIndex = i * 5 + j;
            if (colorIndex < palette.colors.length) {
                const hex = palette.colors[colorIndex];
                const cell = document.createElement('div');
                cell.className = 'palette-cell';
                cell.dataset.hex = hex;
                cell.dataset.coord = `${String.fromCharCode(65 + i)}${j + 1}`;
                cell.style.backgroundColor = hex;
                cell.innerHTML = `<button class="add-to-warframe-btn"><i class="fa fa-plus"></i></button>`;
                grid.appendChild(cell);
            } else {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'palette-cell empty';
                grid.appendChild(emptyCell);
            }
        }
    }

    grid.addEventListener('mouseenter', (event) => {
        const cell = event.target.closest('.palette-cell');
        if (!cell || !cell.dataset.hex || 'ontouchstart' in window) return; // Don't run on touch devices

        const cellHex = cell.dataset.hex;
        const cellCoord = cell.dataset.coord;
        const cellRgb = hexToRgb(cellHex);
        const diff = colorDiff(originalRgb, cellRgb);
        const currentSimilarity = (100 * Math.pow(1 - (diff / 100), 2)).toFixed(1);
        const originalHex = rgbToHex(originalRgb.r, originalRgb.g, originalRgb.b);

        const popoverContent = `
            <div class="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 items-center">
                <span class="font-semibold text-right">Original:</span>
                <div class="flex items-center gap-2"><div class="w-3 h-3 rounded border border-gray-500" style="background-color:${originalHex};"></div><span class="font-mono text-gray-300">${originalHex}</span></div>
                
                <span class="font-semibold text-right">Hovered:</span>
                <div class="flex items-center gap-2"><div class="w-3 h-3 rounded border border-gray-500" style="background-color:${cellHex};"></div><span class="font-mono text-gray-300">${cellHex}</span></div>

                <span class="font-semibold text-right">Similarity:</span>
                <span class="font-bold text-cyan-400">~${currentSimilarity}%</span>

                <span class="font-semibold text-right">Coord:</span>
                <span class="font-mono text-gray-300">${cellCoord}</span>
            </div>`;
        showInfoPopover(event, popoverContent);
    }, true); // Use capture phase to ensure this fires first

    grid.addEventListener('mouseleave', () => {
        infoPopover.classList.add('hidden', 'opacity-0');
    });

    grid.addEventListener('click', function (e) {
        const cell = e.target.closest('.palette-cell');
        if (!cell || !cell.dataset.hex) return;

        // Handle Add to Warframe button click
        if (e.target.closest('.add-to-warframe-btn')) {
            showAddToMenu(cell.dataset.hex);
            return;
        }

        // Touch device logic: tap to show popover, tap again to select
        if ('ontouchstart' in window) {
            const wasActive = cell.classList.contains('popover-active');
            grid.querySelectorAll('.popover-active').forEach(c => c.classList.remove('popover-active'));
            infoPopover.classList.add('hidden', 'opacity-0');

            if (wasActive) {
                // This was the second tap, so select the color
                updateColor(cell.dataset.hex, { regenerate: false, showNotif: true });
            } else {
                // This is the first tap, show the popover
                cell.classList.add('popover-active');
                const cellHex = cell.dataset.hex;
                const cellCoord = cell.dataset.coord;
                const cellRgb = hexToRgb(cellHex);
                const diff = colorDiff(originalRgb, cellRgb);
                const currentSimilarity = (100 * Math.pow(1 - (diff / 100), 2)).toFixed(1);
                const originalHex = rgbToHex(originalRgb.r, originalRgb.g, originalRgb.b);
                const popoverContent = `
                    <div class="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 items-center">
                        <span class="font-semibold text-right">Original:</span>
                        <div class="flex items-center gap-2"><div class="w-3 h-3 rounded border border-gray-500" style="background-color:${originalHex};"></div><span class="font-mono text-gray-300">${originalHex}</span></div>
                        
                        <span class="font-semibold text-right">Hovered:</span>
                        <div class="flex items-center gap-2"><div class="w-3 h-3 rounded border border-gray-500" style="background-color:${cellHex};"></div><span class="font-mono text-gray-300">${cellHex}</span></div>

                        <span class="font-semibold text-right">Similarity:</span>
                        <span class="font-bold text-cyan-400">~${currentSimilarity}%</span>

                        <span class="font-semibold text-right">Coord:</span>
                        <span class="font-mono text-gray-300">${cellCoord}</span>
                    </div>`;
                showInfoPopover(e, popoverContent);
            }
            return;
        }

        // Default desktop click logic
        updateColor(cell.dataset.hex, { regenerate: false, showNotif: true });
    });

    const matchedCell = grid.querySelector(`.palette-cell[data-hex="${matchedHex}"]`);
    if (matchedCell) {
        matchedCell.classList.add('highlight');
    }

    displayContainer.appendChild(gridContainer);
}

function updateWarframeSlotsUI() {
    warframeSlotsContainer.innerHTML = '';
    for (const slotName in warframeColorSlots) {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'warframe-slot';

        const slotLabel = document.createElement('span');
        slotLabel.className = 'warframe-slot-label';
        slotLabel.textContent = slotName;

        const slotDetails = document.createElement('div');
        slotDetails.className = 'warframe-slot-details';
        slotDetails.addEventListener('click', () => showSelectForSlotModal(slotName));

        const colorHex = warframeColorSlots[slotName];
        if (colorHex) {
            const closestMatch = findSingleClosestWarframeColor(hexToRgb(colorHex));
            const matchInfoHTML = closestMatch
                ? `<div class="warframe-slot-match-info" title="${closestMatch.palette} / ${String.fromCharCode(65 + closestMatch.rowIndex)}${closestMatch.colIndex + 1}">
                    <span class="palette-name">${closestMatch.palette}</span>
                    <span class="palette-pos">&middot; ${String.fromCharCode(65 + closestMatch.rowIndex)}${closestMatch.colIndex + 1}</span>
                </div>`
                : `<p class="text-xs text-gray-400 italic">No match found</p>`;
            slotDetails.innerHTML = `
                <div class="warframe-slot-color" style="background-color: ${colorHex};"></div>
                <div class="warframe-slot-info">
                    <p class="font-semibold text-white font-mono">${colorHex}</p>
                    ${matchInfoHTML}
                </div>`;
        } else {
            slotDetails.innerHTML = `
                <div class="warframe-slot-color"></div>
                <div class="warframe-slot-info"><p class="text-gray-400 italic">Click to select</p></div>`;
        }

        slotDiv.appendChild(slotLabel);
        slotDiv.appendChild(slotDetails);
        warframeSlotsContainer.appendChild(slotDiv);
    }
}

// --- Modals and Messages ---
function hideAddToMenu() {
    addToModal.classList.add('hidden');
}

function showAddToMenu(hexColor) {
    modalColorPreview.style.backgroundColor = hexColor;
    modalColorHex.textContent = hexColor.toUpperCase();
    modalSlots.innerHTML = '';
    Object.keys(warframeColorSlots).forEach(slotName => {
        const button = document.createElement('button');
        button.className = "modal-slot-button";
        button.textContent = slotName;
        button.addEventListener('click', () => {
            warframeColorSlots[slotName] = hexColor;
            updateWarframeSlotsUI();
            hideAddToMenu();
        });
        modalSlots.appendChild(button);
    });
    addToModal.classList.remove('hidden');
}

function showInfoPopover(event, content) {
    infoPopover.innerHTML = content;
    infoPopover.classList.remove('hidden', 'opacity-0');
    const popoverRect = infoPopover.getBoundingClientRect();
    const targetRect = event.target.getBoundingClientRect();
    let top = targetRect.top - popoverRect.height - 10;
    let left = targetRect.left + (targetRect.width / 2) - (popoverRect.width / 2);
    if (left < 10) left = 10;
    if (left + popoverRect.width > window.innerWidth - 10) left = window.innerWidth - popoverRect.width - 10;
    if (top < 10) top = targetRect.bottom + 10;
    infoPopover.style.left = `${left}px`;
    infoPopover.style.top = `${top}px`;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => showMessage("Copied!"), () => showMessage("Failed to copy!", true));
}

function showMessage(msg, isError = false) {
    messageBox.textContent = msg;
    messageBox.classList.remove('opacity-0', 'bg-red-500', 'bg-green-500');
    messageBox.classList.add(isError ? 'bg-red-500' : 'bg-green-500');
    setTimeout(() => messageBox.classList.add('opacity-0'), 2000);
}

// --- Palette Filter & Selector Functions ---
function handlePaletteSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const paletteItems = paletteFilterGrid.querySelectorAll('.palette-filter-item');

    paletteItems.forEach(item => {
        const label = item.querySelector('label');
        if (label) {
            const paletteName = label.textContent.toLowerCase();
            // Use 'flex' to match the display property of the parent div
            item.style.display = paletteName.includes(searchTerm) ? 'flex' : 'none';
        }
    });
}

function updatePaletteSelectors() {
    const filtered = getFilteredPalettes();
    const currentVal1 = paletteSelector.value;
    const currentVal2 = selectForSlotPaletteSelector.value;

    [paletteSelector, selectForSlotPaletteSelector].forEach(selector => {
        selector.innerHTML = '';
        if (filtered.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'No Palettes Selected';
            option.disabled = true;
            selector.appendChild(option);
        } else {
            filtered.forEach(palette => {
                const option = document.createElement('option');
                option.value = palette.name;
                option.textContent = palette.name;
                selector.appendChild(option);
            });
        }
    });

    if (filtered.some(p => p.name === currentVal1)) {
        paletteSelector.value = currentVal1;
    }
    if (filtered.some(p => p.name === currentVal2)) {
        selectForSlotPaletteSelector.value = currentVal2;
    }

    renderPaletteSelectorGrid(paletteSelector.value);
    renderSelectForSlotGrid(selectForSlotPaletteSelector.value);
}

function populatePaletteFilter() {
    paletteFilterGrid.innerHTML = '';
    warframePalettes.forEach(palette => {
        const div = document.createElement('div');
        div.className = 'flex items-center palette-filter-item';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `filter-${palette.name}`;
        checkbox.value = palette.name;
        checkbox.checked = true;
        checkbox.className = 'palette-filter-checkbox h-4 w-4 rounded border-gray-600 bg-gray-700 text-cyan-600 focus:ring-cyan-500';

        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                activePalettes.add(e.target.value);
            } else {
                activePalettes.delete(e.target.value);
            }
            updatePaletteSelectors();
        });

        const label = document.createElement('label');
        label.htmlFor = `filter-${palette.name}`;
        label.textContent = palette.name;
        label.className = 'ml-2 block text-sm text-gray-300';

        div.appendChild(checkbox);
        div.appendChild(label);
        paletteFilterGrid.appendChild(div);
    });
}

function renderPaletteSelectorGrid(paletteName) {
    paletteColorGrid.innerHTML = '';
    const palette = warframePalettes.find(p => p.name === paletteName);
    if (!palette) return;

    paletteColorGrid.className = 'palette-grid'; // Use the main compact grid style

    // Create headers
    const headerFrag = document.createDocumentFragment();
    const corner = document.createElement('div');
    corner.className = 'palette-cell header';
    headerFrag.appendChild(corner);
    for (let i = 1; i <= 5; i++) {
        const headerCell = document.createElement('div');
        headerCell.className = 'palette-cell header';
        headerCell.textContent = i;
        headerFrag.appendChild(headerCell);
    }
    paletteColorGrid.append(headerFrag);

    const numRows = Math.ceil(palette.colors.length / 5);
    for (let i = 0; i < numRows; i++) {
        const rowHeader = document.createElement('div');
        rowHeader.className = 'palette-cell header';
        rowHeader.textContent = String.fromCharCode(65 + i);
        paletteColorGrid.appendChild(rowHeader);

        for (let j = 0; j < 5; j++) {
            const colorIndex = i * 5 + j;
            if (colorIndex < palette.colors.length) {
                const hex = palette.colors[colorIndex];
                const cell = document.createElement('div');
                cell.className = 'palette-cell';
                cell.dataset.hex = hex;
                cell.dataset.coord = `${String.fromCharCode(65 + i)}${j + 1}`;
                cell.style.backgroundColor = hex;
                cell.innerHTML = `<button class="add-to-warframe-btn"><i class="fa fa-plus"></i></button>`;
                paletteColorGrid.appendChild(cell);
            } else {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'palette-cell empty';
                paletteColorGrid.appendChild(emptyCell);
            }
        }
    }
}

// --- Select-for-Slot Modal Functions ---
function showSelectForSlotModal(slotName) {
    currentlyEditingSlot = slotName;
    selectForSlotTitle.textContent = `Select Color for ${slotName}`;
    updatePaletteSelectors(); // This populates the dropdown
    renderSelectForSlotGrid(selectForSlotPaletteSelector.value);
    selectForSlotModal.classList.remove('hidden');
}

function hideSelectForSlotModal() {
    selectForSlotModal.classList.add('hidden');
    currentlyEditingSlot = null;
}

function renderSelectForSlotGrid(paletteName) {
    selectForSlotGridContainer.innerHTML = '';
    const palette = warframePalettes.find(p => p.name === paletteName);
    if (!palette) {
        selectForSlotGridContainer.innerHTML = '<div class="placeholder">Select a palette.</div>';
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'palette-grid'; // Use the main compact grid style

    // Create headers
    const headerFrag = document.createDocumentFragment();
    const corner = document.createElement('div');
    corner.className = 'palette-cell header';
    headerFrag.appendChild(corner);
    for (let i = 1; i <= 5; i++) {
        const headerCell = document.createElement('div');
        headerCell.className = 'palette-cell header';
        headerCell.textContent = i;
        headerFrag.appendChild(headerCell);
    }
    grid.append(headerFrag);

    const numRows = Math.ceil(palette.colors.length / 5);
    for (let i = 0; i < numRows; i++) {
        const rowHeader = document.createElement('div');
        rowHeader.className = 'palette-cell header';
        rowHeader.textContent = String.fromCharCode(65 + i);
        grid.appendChild(rowHeader);

        for (let j = 0; j < 5; j++) {
            const colorIndex = i * 5 + j;
            if (colorIndex < palette.colors.length) {
                const hex = palette.colors[colorIndex];
                const cell = document.createElement('div');
                cell.className = 'palette-cell'; // Use the main compact cell style
                if (hex) {
                    cell.style.backgroundColor = hex;
                    cell.dataset.hex = hex;
                } else {
                    cell.classList.add('empty');
                }
                grid.appendChild(cell);
            } else {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'palette-cell empty';
                grid.appendChild(emptyCell);
            }
        }
    }
    selectForSlotGridContainer.appendChild(grid);
}

// --- Generate Fashion Functions ---
const randomInRange = (min, max) => min + Math.random() * (max - min);

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateGeneratorControls() {
    const style = generateStyleSelector.value;
    const harmonyStyles = ['modern', 'retro_vintage', 'cyberpunk_neon', 'pastel_minimalist'];
    generateHarmonyContainer.style.display = harmonyStyles.includes(style) ? 'block' : 'none';
}

function handleGenerateFashion() {
    const style = generateStyleSelector.value;
    const count = parseInt(generateColorCount.value, 10);
    let baseHsl;

    if (useCurrentColorCheckbox.checked) {
        try {
            const hslStr = hslInput.value;
            const parts = hslStr.match(/(\d+(\.\d+)?)/g);
            if (!parts || parts.length < 3) throw new Error("Invalid HSL string");
            baseHsl = { h: parseFloat(parts[0]), s: parseFloat(parts[1]), l: parseFloat(parts[2]) };
        } catch (e) {
            console.error("Could not parse HSL color, using random.", e);
            baseHsl = { h: Math.random() * 360, s: randomInRange(40, 100), l: randomInRange(30, 70) };
        }
    } else {
        // Use a random base color, but tailor its properties slightly to the selected style
        const randomHue = Math.random() * 360;
        const highSat = randomInRange(70, 100);
        const midSat = randomInRange(40, 70);
        const lowSat = randomInRange(10, 40);
        const highLight = randomInRange(70, 90);
        const midLight = randomInRange(30, 70);
        const lowLight = randomInRange(15, 30);

        const styleDefaults = {
            cyberpunk_neon: { h: randomHue, s: highSat, l: midLight },
            pastel_minimalist: { h: randomHue, s: lowSat, l: highLight },
            void_shadow: { h: randomHue, s: midSat, l: lowLight },
            orokin_opulence: { h: randomInRange(45, 60), s: highSat, l: highLight },
            infested_growth: { h: randomInRange(280, 340), s: midSat, l: midLight },
            grineer_grit: { h: randomInRange(20, 40), s: lowSat, l: lowLight },
            corpus_prime: { h: randomInRange(180, 240), s: midSat, l: midLight },
            default: { h: randomHue, s: midSat, l: midLight }
        };
        baseHsl = styleDefaults[style] || styleDefaults.default;
    }

    let palette;
    switch (style) {
        case 'retro_vintage':
            palette = _generateRetroVintage(baseHsl, count);
            break;
        case 'cyberpunk_neon':
            palette = _generateCyberpunkNeon(baseHsl, count);
            break;
        case 'pastel_minimalist':
            palette = _generatePastelMinimalist(baseHsl, count);
            break;
        case 'nature_inspired':
            palette = _generateNatureInspired(count);
            break;
        case 'monochrome_gradient':
            palette = _generateMonochromeGradient(baseHsl, count);
            break;
        case 'vaporwave':
            palette = _generateVaporwave(count);
            break;
        case 'metallic':
            palette = _generateMetallic(count);
            break;
        case 'void_shadow':
            palette = _generateVoidAndShadow(baseHsl, count);
            break;
        case 'orokin_opulence':
            palette = _generateOrokinOpulence(baseHsl, count);
            break;
        case 'infested_growth':
            palette = _generateInfestedGrowth(baseHsl, count);
            break;
        case 'grineer_grit':
            palette = _generateGrineerGrit(baseHsl, count);
            break;
        case 'corpus_prime':
            palette = _generateCorpusPrime(baseHsl, count);
            break;
        case 'modern':
        default:
            palette = _generateModern(baseHsl, count);
            break;
    }

    renderGeneratedPalette(palette);
}

function hslToHex(h, s, l) {
    const { r, g, b } = hslToRgb(h, s, l);
    return rgbToHex(r, g, b);
}

// --- Generator Functions ---
function _generateModern(baseHsl, count) {
    const harmony = generateHarmonySelector.value;
    const h1 = baseHsl.h;
    let h2;
    const harmonies = ['analogous', 'split-complementary', 'monochrome', 'triadic'];
    const selectedHarmony = harmony === 'random' ? harmonies[Math.floor(Math.random() * harmonies.length)] : harmony;

    switch (selectedHarmony) {
        case 'analogous':
            h2 = (h1 + randomInRange(20, 45)) % 360;
            break;
        case 'split-complementary':
            h2 = (h1 + 180 + randomInRange(-35, 35)) % 360;
            break;
        case 'triadic':
            h2 = (h1 + (Math.random() > 0.5 ? 120 : 240) + randomInRange(-20, 20)) % 360;
            break;
        case 'monochrome':
        default:
            h2 = h1;
            break;
    }

    const colors = [];
    for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const hue = (h1 * (1 - t) + h2 * t + randomInRange(-8, 8)) % 360;
        const s = 60 + 35 * Math.cos(t * Math.PI * 2) + randomInRange(-15, 15);
        const l = 50 + 40 * Math.sin(t * Math.PI) + randomInRange(-10, 10);
        colors.push({
            h: hue < 0 ? hue + 360 : hue,
            s: Math.max(15, Math.min(100, s)),
            l: Math.max(10, Math.min(95, l))
        });
    }
    return shuffleArray(colors).map(c => hslToHex(c.h, c.s, c.l));
}

function _generateRetroVintage(baseHsl, count) {
    const baseHue = baseHsl.h;
    const colors = [];
    const hueSpread = randomInRange(20, 40);
    for (let i = 0; i < count; i++) {
        const h = (baseHue + (i * hueSpread * (Math.random() > 0.5 ? 1 : -1)) + randomInRange(-10, 10)) % 360;
        const s = randomInRange(30, 65);
        const l = randomInRange(40, 75);
        colors.push({
            h: h < 0 ? h + 360 : h,
            s: Math.max(25, Math.min(70, s)),
            l: Math.max(25, Math.min(80, l))
        });
    }
    // Add a dark and a light neutral color for balance
    colors.push({ h: baseHue, s: randomInRange(5, 15), l: randomInRange(15, 30) });
    colors.push({ h: baseHue, s: randomInRange(5, 15), l: randomInRange(80, 95) });

    return shuffleArray(colors).slice(0, count).map(c => hslToHex(c.h, c.s, c.l));
}

function _generateCyberpunkNeon(baseHsl, count) {
    const baseHue = baseHsl.h;
    const colors = [
        { h: baseHue, s: randomInRange(90, 100), l: randomInRange(50, 60) }, // Bright base
        { h: (baseHue + randomInRange(160, 200)) % 360, s: randomInRange(90, 100), l: randomInRange(50, 65) } // Bright complement
    ];
    // Add a very dark, slightly colored base
    colors.push({ h: (baseHue + randomInRange(-20, 20)) % 360, s: randomInRange(30, 80), l: randomInRange(5, 15) });

    while (colors.length < count) {
        const h = (baseHue + randomInRange(20, 340)) % 360; // Pick from a wide range for variety
        colors.push({
            h,
            s: randomInRange(85, 100),
            l: randomInRange(50, 75)
        });
    }
    return shuffleArray(colors).slice(0, count).map(c => hslToHex(c.h, c.s, c.l));
}

function _generatePastelMinimalist(baseHsl, count) {
    const baseHue = baseHsl.h;
    const colors = [];
    const hueStep = randomInRange(15, 45);
    for (let i = 0; i < count; i++) {
        const h = (baseHue + i * hueStep + randomInRange(-10, 10)) % 360;
        const s = randomInRange(25, 55);
        const l = randomInRange(80, 95);
        colors.push({
            h: h < 0 ? h + 360 : h,
            s: Math.max(20, Math.min(60, s)),
            l: Math.max(75, Math.min(95, l))
        });
    }
    // Add a contrasting darker, desaturated color
    if (count > 3) {
        colors.push({ h: baseHue, s: randomInRange(10, 20), l: randomInRange(30, 50) });
    }
    return shuffleArray(colors).slice(0, count).map(c => hslToHex(c.h, c.s, c.l));
}

function _generateNatureInspired(count) {
    const modes = {
        spring: { h: [30, 150], s: [50, 80], l: [60, 90] },
        autumn: { h: [0, 60], s: [60, 85], l: [30, 55] },
        forest: { h: [90, 150], s: [40, 70], l: [20, 50] },
        ocean: { h: [180, 240], s: [50, 80], l: [30, 85] }
    };
    const modeKeys = Object.keys(modes);
    const randomMode = modes[modeKeys[Math.floor(Math.random() * modeKeys.length)]];
    const colors = [];
    for (let i = 0; i < count; i++) {
        const h = randomInRange(randomMode.h[0], randomMode.h[1]) + randomInRange(-15, 15);
        const s = randomInRange(randomMode.s[0], randomMode.s[1]) + randomInRange(-10, 10);
        const l = randomInRange(randomMode.l[0], randomMode.l[1]);
        colors.push({
            h: (h + 360) % 360,
            s: Math.max(20, Math.min(95, s)),
            l: Math.max(15, Math.min(95, l))
        });
    }
    return shuffleArray(colors).map(c => hslToHex(c.h, c.s, c.l));
}

function _generateMonochromeGradient(baseHsl, count) {
    const baseHue = baseHsl.h;
    const sat = randomInRange(15, 85);
    const colors = [];
    for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        // Use an easing function for a more dynamic gradient
        const l = 10 + (85 * (1 - Math.pow(1 - t, 3)));
        colors.push({
            h: (baseHue + randomInRange(-4, 4)) % 360,
            s: Math.max(10, Math.min(90, sat + randomInRange(-10, 10))),
            l: Math.max(10, Math.min(95, l))
        });
    }
    return colors.map(c => hslToHex(c.h, c.s, c.l));
}

function _generateVaporwave(count) {
    const basePalette = ["#ff71ce", "#01cdfe", "#05ffa1", "#b967ff", "#fffb96"];
    const darks = ["#2C003E", "#030640"];
    let colors = shuffleArray([...basePalette]);
    
    // Ensure at least one dark color for contrast
    colors.unshift(darks[Math.floor(Math.random() * darks.length)]);

    if (colors.length < count) {
        const extras = count - colors.length;
        for (let i = 0; i < extras; i++) {
            const baseColor = hexToRgb(colors[i % basePalette.length]); // base off the brights
            const hsl = rgbToHsl(baseColor.r, baseColor.g, baseColor.b);
            colors.push(hslToHex(
                (hsl.h + randomInRange(-15, 15)) % 360,
                Math.min(100, hsl.s + randomInRange(-10, 5)),
                Math.min(90, hsl.l + randomInRange(-10, 10))
            ));
        }
    }
    return shuffleArray(colors).slice(0, count);
}

function _generateMetallic(count) {
    const golds = ["#D4AF37", "#FFD700", "#CFB53B"];
    const silvers = ["#C0C0C0", "#E5E4E2", "#A9A9A9"];
    const coppers = ["#B87333", "#CD7F32", "#8B4513"];
    const allMetals = [...golds, ...silvers, ...coppers];
    
    let colors = shuffleArray(allMetals);

    return colors.slice(0, count).map(hex => {
        const { h, s, l } = rgbToHsl(hexToRgb(hex).r, hexToRgb(hex).g, hexToRgb(hex).b);
        // Reduce saturation and vary lightness to make them more 'in-game' friendly
        const newS = Math.max(5, Math.min(40, s + randomInRange(-20, 5)));
        const newL = Math.max(15, Math.min(85, l + randomInRange(-20, 20)));
        return hslToHex(h, newS, newL);
    });
}

// --- NEW GENERATOR FUNCTIONS ---

function _generateVoidAndShadow(baseHsl, count) {
    const colors = [];
    const accentHue = baseHsl.h;

    // Generate dark, desaturated base colors
    for (let i = 0; i < count - 2; i++) {
        colors.push({
            h: (accentHue + randomInRange(-40, 40)) % 360,
            s: randomInRange(5, 25),
            l: randomInRange(10, 25)
        });
    }

    // Add a brighter, more saturated accent color
    colors.push({
        h: accentHue,
        s: randomInRange(80, 100),
        l: randomInRange(50, 65)
    });

    // Add a secondary, less bright accent or a highlight
    colors.push({
        h: (accentHue + randomInRange(-15, 15)) % 360,
        s: randomInRange(40, 70),
        l: randomInRange(30, 50)
    });

    return shuffleArray(colors).slice(0, count).map(c => hslToHex(c.h, c.s, c.l));
}

function _generateOrokinOpulence(baseHsl, count) {
    const accentHue = baseHsl.h; // Use baseHsl for the accent
    const colors = [];

    // Primary Orokin Colors: White, Cream, Gold
    colors.push({ h: 45, s: randomInRange(15, 30), l: randomInRange(90, 98) }); // White/Cream
    colors.push({ h: 50, s: randomInRange(60, 85), l: randomInRange(65, 80) }); // Gold
    colors.push({ h: 48, s: randomInRange(20, 40), l: randomInRange(20, 35) }); // Darker Gold/Bronze

    // Add the accent color
    colors.push({
        h: accentHue,
        s: randomInRange(70, 90),
        l: randomInRange(50, 60)
    });

    // Fill remaining slots with variations
    while (colors.length < count) {
        const choice = Math.random();
        if (choice < 0.6) { // More gold/white variations
            colors.push({ h: randomInRange(45, 55), s: randomInRange(30, 75), l: randomInRange(40, 90) });
        } else { // More accent variations
            colors.push({ h: accentHue, s: randomInRange(50, 80), l: randomInRange(30, 70) });
        }
    }

    return shuffleArray(colors).slice(0, count).map(c => hslToHex(c.h, c.s, c.l));
}

function _generateInfestedGrowth(baseHsl, count) {
    const baseHue = baseHsl.h; // Fleshy tones: purples, pinks
    const colors = [];
    const hueRange = [baseHue - 30, baseHue + 30];

    for (let i = 0; i < count; i++) {
        const h = randomInRange(hueRange[0], hueRange[1]);
        const s = randomInRange(30, 65);
        const l = randomInRange(20, 60);
        colors.push({
            h: (h + 360) % 360,
            s: Math.max(25, Math.min(70, s)),
            l: Math.max(15, Math.min(65, l))
        });
    }

    // Add a sickly green/yellow accent
    if (count > 3) {
        colors.push({
            h: randomInRange(70, 90),
            s: randomInRange(40, 70),
            l: randomInRange(40, 60)
        });
    }

    return shuffleArray(colors).slice(0, count).map(c => hslToHex(c.h, c.s, c.l));
}

function _generateGrineerGrit(baseHsl, count) {
    const colors = [];
    const baseHue = baseHsl.h; // Rust/Brown tones

    // Gritty base colors
    for (let i = 0; i < count - 1; i++) {
        colors.push({
            h: (baseHue + randomInRange(-15, 15)) % 360,
            s: randomInRange(10, 45),
            l: randomInRange(15, 40)
        });
    }
    // Add a muted olive/green
    colors.push({ h: randomInRange(70, 90), s: randomInRange(20, 40), l: randomInRange(25, 45) });

    // Add a single pop of color for lights/syandana
    if (count > 2) {
        colors.push({
            h: randomInRange(30, 50), // Orange/Yellow
            s: randomInRange(80, 100),
            l: randomInRange(50, 60)
        });
    }

    return shuffleArray(colors).slice(0, count).map(c => hslToHex(c.h, c.s, c.l));
}

function _generateCorpusPrime(baseHsl, count) {
    const accentHue = baseHsl.h; // Blue/Cyan tones
    const colors = [];

    // Corpus base colors: Greys, Whites, Blacks
    colors.push({ h: 200, s: randomInRange(5, 15), l: randomInRange(85, 95) }); // Off-White
    colors.push({ h: 200, s: randomInRange(5, 10), l: randomInRange(40, 60) }); // Mid-Grey
    colors.push({ h: 200, s: randomInRange(0, 10), l: randomInRange(10, 20) }); // Dark Grey/Black

    // Add the primary accent
    colors.push({
        h: accentHue,
        s: randomInRange(70, 90),
        l: randomInRange(55, 70)
    });

    // Fill with variations
    while (colors.length < count) {
        const choice = Math.random();
        if (choice < 0.5) { // More greys
            colors.push({ h: 200, s: randomInRange(0, 15), l: randomInRange(10, 95) });
        } else { // More accent variations
            colors.push({ h: (accentHue + randomInRange(-10, 10)) % 360, s: randomInRange(50, 90), l: randomInRange(40, 80) });
        }
    }

    return shuffleArray(colors).slice(0, count).map(c => hslToHex(c.h, c.s, c.l));
}


function renderGeneratedPalette(palette) {
    generateOutputContainer.innerHTML = '';

    const colorSelectorContainer = document.createElement('div');
    colorSelectorContainer.className = 'harmony-color-selector';

    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'results-area mt-4';
    resultsContainer.innerHTML = `<div class="placeholder">Select a generated color above to find its closest in-game match.</div>`;

    palette.forEach(hex => {
        const rgb = hexToRgb(hex);
        const colorButton = document.createElement('button');
        colorButton.className = 'harmony-color-choice';
        colorButton.innerHTML = `
            <div class="color-swatch" style="background-color: ${hex};">
                 <div class="harmony-swatch-overlay">
                    <span class="font-mono">${hex}</span>
                </div>
            </div>`;

        colorButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = colorButton.classList.contains('active');
            colorSelectorContainer.querySelectorAll('.harmony-color-choice.active').forEach(btn => btn.classList.remove('active'));
            if (!isActive) {
                colorButton.classList.add('active');
                displayMatchesInContainer(rgb, resultsContainer);
            } else {
                resultsContainer.innerHTML = `<div class="placeholder">Select a generated color above to find its closest in-game match.</div>`;
            }
        });
        colorSelectorContainer.appendChild(colorButton);
    });

    generateOutputContainer.appendChild(colorSelectorContainer);
    generateOutputContainer.appendChild(resultsContainer);
}

function updateMatches() {
    const hex = hexInput.value;
    if (hex) {
        updateColor(hex, { regenerate: true, showNotif: true });
    }
}

document.getElementById('update-matches-btn').addEventListener('click', updateMatches);

// --- Main Application Logic ---

// This is a placeholder for your existing function that displays match results.
// You will need to integrate the new search bar and filtering logic into your actual function.
function displayColorMatches(matches, container) {
    if (!container) return;

    // Clear previous results
    container.innerHTML = '';

    if (!matches || matches.length === 0) {
        container.innerHTML = `<div class="placeholder">No matches found.</div>`;
        return;
    }

    // Create and append the search bar
    const searchBarHTML = `
        <div class="relative mb-4">
            <input type="text" id="${container.id}-search" placeholder="Filter matched palettes..."
                class="w-full bg-gray-900 border border-gray-600 rounded-md p-2 pl-8 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
            <i class="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', searchBarHTML);

    const resultsList = document.createElement('div');
    resultsList.className = 'space-y-4';
    container.appendChild(resultsList);

    // Group matches by palette
    const matchesByPalette = matches.reduce((acc, match) => {
        if (!acc[match.palette.name]) {
            acc[match.palette.name] = [];
        }
        acc[match.palette.name].push(match);
        return acc;
    }, {});

    // Create palette result elements
    for (const paletteName in matchesByPalette) {
        const paletteMatches = matchesByPalette[paletteName];
        const palette = paletteMatches[0].palette;

        const paletteContainer = document.createElement('div');
        paletteContainer.className = 'palette-result-container';
        paletteContainer.dataset.paletteName = paletteName.toLowerCase();

        const header = document.createElement('h4');
        header.className = 'text-lg font-semibold text-cyan-300 mb-2';
        header.textContent = paletteName;
        paletteContainer.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'flex flex-wrap gap-2';
        
        paletteMatches.forEach(match => {
            // This is a simplified representation of your color match button.
            // You should replace this with your actual color match element creation.
            const colorButton = document.createElement('div');
            colorButton.className = 'w-10 h-10 rounded cursor-pointer';
            colorButton.style.backgroundColor = match.hex;
            colorButton.title = `Delta E: ${match.deltaE.toFixed(2)}`;
            grid.appendChild(colorButton);
        });

        paletteContainer.appendChild(grid);
        resultsList.appendChild(paletteContainer);
    }

    // Add event listener to the new search bar
    const searchInput = document.getElementById(`${container.id}-search`);
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const allPalettes = container.querySelectorAll('.palette-result-container');
            allPalettes.forEach(p => {
                const name = p.dataset.paletteName;
                p.style.display = name.includes(searchTerm) ? '' : 'none';
            });
        });
    }
}


function initializeApp() {
    updateColor(colorPicker.value, { regenerate: true, showNotif: false });
    populatePaletteFilter();
    updatePaletteSelectors();
    updateWarframeSlotsUI();
    updateGeneratorControls();

    paletteColorGrid.addEventListener('click', (event) => {
        const cell = event.target.closest('.palette-cell');
        if (!cell || !cell.dataset.hex) return;

        if (event.target.closest('.add-to-warframe-btn')) {
            showAddToMenu(cell.dataset.hex);
            return;
        }
        
        updateColor(cell.dataset.hex, { regenerate: false, showNotif: true });
    });
     
    selectForSlotGridContainer.addEventListener('click', (event) => {
        const cell = event.target.closest('.palette-cell');
        if (cell && cell.dataset.hex && currentlyEditingSlot) {
            warframeColorSlots[currentlyEditingSlot] = cell.dataset.hex;
            updateWarframeSlotsUI();
            hideSelectForSlotModal();
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeApp);