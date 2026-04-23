/**
 * Star classification UI: slider drives spectral class, charts, and article content.
 * Images: ../static/img/ relative to the HTML page URL (e.g. both in templates/ vs static/).
 */
const STATIC_IMG_BASE = new URL('../static/img/', window.location.href);

const kBoltz = 1.38065e-23;
const planck = 6.62607e-34;
const c = 299792458;

const LIFESPAN_LABELS = ['M', 'K', 'G', 'F', 'A', 'B', 'O'];
const LIFESPAN_MYR = [200000, 40000, 10000, 4000, 1000, 70, 5];

/** One entry per slider step 0..6 */
const STAR_SPECS = [
    {
        letter: 'M',
        tempK: 3000,
        border: '2px solid red',
        imageWidthPct: 66,
        img: 'Class M.jpg',
        title: 'Class M',
        desc: "M-type stars, commonly known as red dwarfs, are the coolest and most numerous stars in the universe, comprising about 76% of all main-sequence stars. Within the Yerkes classification system, they are identified by surface temperatures below 3,500 Kelvin and distinct spectral signatures, such as deep absorption bands of titanium oxide. Because they are much smaller and less massive than the Sun, they burn their hydrogen fuel at an incredibly slow rate, allowing them to remain stable for trillions of years—potentially outlasting every other type of star. While their low luminosity means none are visible to the naked eye from Earth, their sheer abundance and longevity make them critical subjects in the study of galactic evolution and the long-term stability of planetary systems.",
    },
    {
        letter: 'K',
        tempK: 4500,
        border: '2px solid orange',
        imageWidthPct: 68,
        img: 'Class K.png',
        title: 'Class K',
        desc: "K-type stars, often called orange dwarfs, are moderately cool stars with surface temperatures ranging from approximately 3,500 to 5,000 Kelvin. In the Yerkes classification system, they sit between the Sun-like G-type stars and the smaller, cooler M-type red dwarfs, and are distinguished by strong spectral lines of neutral metals and molecular bands. These stars are significantly more abundant than O-type stars, making up about 12% of the main-sequence stars in our solar neighborhood. Because they burn their hydrogen fuel much more slowly than more massive stars, K-type stars can remain stable for 15 to 70 billion years—far exceeding the current age of the universe. This extreme longevity and relatively stable radiation output make them primary targets in the search for exoplanets and potential extraterrestrial life.",
    },
    {
        letter: 'G',
        tempK: 5800,
        border: '2px solid yellow',
        imageWidthPct: 70,
        img: 'Class G.png',
        title: 'Class G',
        desc: "G-type stars, famously known as yellow dwarfs, are intermediate-sized stars with surface temperatures ranging from approximately 5,200 to 6,000 Kelvin. In the Yerkes classification system, they are identified by extremely strong spectral lines of ionized calcium and neutral metals, with our own Sun serving as the primary prototype for this class. While they make up only about 7% of the main-sequence stars in the Milky Way, their stable radiation and multi-billion-year lifespans make them the gold standard for habitability in modern astronomy. These stars typically remain on the main sequence for about 10 billion years, providing a long-term, steady environment that is widely considered ideal for the development of complex life. Because of this, G-type stars are the most scrutinized targets in the search for Earth-like analogs and biosignatures in other solar systems.",
    },
    {
        letter: 'F',
        tempK: 6600,
        border: '2px solid lightyellow',
        imageWidthPct: 67,
        img: 'Class F.png',
        title: 'Class F',
        desc: "F-type stars, often referred to as yellow-white stars, are stars that occupy the space between the hotter A-type and the Sun-like G-type stars, with surface temperatures ranging from approximately 6,000 to 7,500 Kelvin. In the Yerkes classification system, they are identified by strong spectral lines of ionized calcium and a noticeable presence of neutral metals, though their hydrogen lines are weaker than those of hotter stars. While they make up only about 3% of the main-sequence stars in our galaxy, they are significantly more luminous and massive than the Sun, leading to shorter lifespans of roughly 2 to 4 billion years. Astronomers are particularly interested in F-type stars because their wide habitable zones and intense ultraviolet radiation may provide a unique chemical environment for the rapid evolution of life, making them key targets in the search for exoplanetary systems.",
    },
    {
        letter: 'A',
        tempK: 8700,
        border: '2px solid lightcyan',
        imageWidthPct: 69,
        img: 'Class A.webp',
        title: 'Class A',
        desc: "A-type stars, which are bluish-white stars, are among the most common naked-eye stars due to their high luminosity and surface temperatures ranging from 7,500 to 10,000 Kelvin. In the Yerkes classification system, they are defined by the strongest hydrogen absorption lines of any stellar class, along with lines of ionized metals like magnesium and silicon. These stars, which include famous examples like Sirius and Vega, are significantly more massive and rotate much faster than the Sun, often resulting in a slightly oblate shape. While they make up only about 0.6% of main-sequence stars, their intense radiation and relatively short lifespans of roughly one billion years create a challenging but intriguing environment for the formation of planetary systems.",
    },
    {
        letter: 'B',
        tempK: 22000,
        border: '2px solid skyblue',
        imageWidthPct: 64,
        img: 'Class B.png',
        title: 'Class B',
        desc: "B-type stars are exceptionally luminous and hot blue stars, with surface temperatures ranging from approximately 10,000 to 30,000 Kelvin. In the Yerkes classification system, they are identified by the presence of neutral helium lines and moderate hydrogen lines, placing them just below the extreme O-type stars in terms of mass and temperature. While they represent only about 0.1% of main-sequence stars, their immense brightness—often hundreds or thousands of times that of the Sun—makes them prominent members of young stellar clusters and the spiral arms of galaxies. Because of their high mass, B-type stars have relatively short lifespans of a few hundred million years, typically ending their cycles as massive white dwarfs or, in the case of the most massive members, as violent supernovae.",
    },
    {
        letter: 'O',
        tempK: 45000,
        border: '2px solid dodgerblue',
        imageWidthPct: 63,
        img: 'Class O.png',
        title: 'Class O',
        desc: 'O-type stars, usually called blue giants, are among the most massive and luminous objects in the universe, characterized by extreme surface temperatures exceeding 30,000 Kelvin. Identified in the Yerkes classification system by the presence of ionized helium lines in their spectra, these blue giants radiate intense ultraviolet energy that illuminates star-forming regions and spiral arms in distant galaxies. Despite them only accounting for less than 0.0001% of main-sequence stars, their immense brightness allows them to be seen across vast interstellar distances. However, their high mass leads to a "live fast, die young" lifecycle; they exhaust their nuclear fuel in just a few million years, ultimately ending in violent supernova explosions that leave behind remnants such as neutron stars or black holes.',
    },
];

const HABITABILITY_INFO = {
    M: {
        mass: '0.08-0.5 \u2609',
        tier: 'C+',
        reason:
            'Due to the low mass of this star, its Goldilocks zone is very close, so many planets can become tidally locked and face stronger flare activity.',
    },
    K: {
        mass: '0.5-0.85 \u2609',
        tier: 'S',
        reason:
            'K-type stars are long-lived and stable, with a comfortable habitable zone and lower harmful radiation than hotter stars, making them excellent long-term life candidates.',
    },
    G: {
        mass: '0.85-1.1 \u2609',
        tier: 'A',
        reason:
            'G-type stars provide a well-balanced energy output and stable lifetimes that support complex biospheres, as demonstrated by the Solar System.',
    },
    F: {
        mass: '1.1-1.6 \u2609',
        tier: 'B',
        reason:
            'F-type stars offer wide habitable zones, but their stronger UV output and shorter lifespans can make long biological evolution harder than around G and K stars.',
    },
    A: {
        mass: '1.6-2.3 \u2609',
        tier: 'D',
        reason:
            'A-type stars are very luminous but live for comparatively short times, limiting the window for life to emerge and stabilize on planets.',
    },
    B: {
        mass: '2.3-20 \u2609',
        tier: 'E',
        reason:
            'B-type stars are intense UV emitters with short lifetimes, so planetary surfaces face harsh radiation and very little time for biological complexity to develop.',
    },
    O: {
        mass: '20-70+ \u2609',
        tier: 'F',
        reason:
            'O-type stars live fast and die young, blasting nearby systems with extreme radiation and stellar winds that make stable, life-friendly planets very unlikely.',
    },
};

const TIER_COLORS = {
    S: '#3bfd00',
    A: '#a2c036',
    B: '#beb208',
    'C+': '#fd9800',
    D: '#b45309',
    E: '#c01445',
    F: '#a30000',
};

const CLASS_ACCENT = {
    M: { boxBg: 'rgba(190, 45, 30, 0.9)', text: '#ffffff', tierBg: 'rgba(255, 255, 255, 0.82)' },
    K: { boxBg: 'rgba(181, 98, 26, 0.92)', text: '#ffffff', tierBg: 'rgba(255, 250, 240, 0.84)' },
    G: { boxBg: 'rgba(145, 145, 0, 0.97)', text: '#111827', tierBg: 'rgba(255, 252, 220, 0.88)' },
    F: { boxBg: 'rgba(194, 178, 106, 0.94)', text: '#111827', tierBg: 'rgba(255, 255, 236, 0.9)' },
    A: { boxBg: 'rgba(96, 137, 184, 0.92)', text: '#f8fafc', tierBg: 'rgba(236, 245, 255, 0.86)' },
    B: { boxBg: 'rgba(50, 95, 173, 0.92)', text: '#f8fafc', tierBg: 'rgba(227, 239, 255, 0.86)' },
    O: { boxBg: 'rgba(35, 74, 148, 0.95)', text: '#f8fafc', tierBg: 'rgba(219, 234, 254, 0.88)' },
};

const EXPLOSION_CLASSES = new Set(['O', 'B']);
const PLANETARY_NEBULA_CLASSES = new Set(['K', 'A', 'F', 'G']);
const WARP_DEFAULT_FREQ = 0.25;
const WARP_DEFAULT_SCALE = 1.0;
const WARP_DEFAULT_RADIUS = 10;

/** After class change, `getComputedStyle(star).backgroundColor` lags until `.star` CSS transition ends (star-classes.css: `transition: all 0.3s ease`). */
const STAR_CHART_COLOR_DELAY_MS = 350;

let chartColorRefreshTimer = null;

const header = document.querySelector('.header');
const body = document.querySelector('body');
const starInfo = document.querySelector('.starInfo');
const star = document.querySelector('.star');
const mainPanel = document.querySelector('.main');
const slider = document.getElementById('starSlider');
const explodeStar = document.getElementById('endLife');
const starStatBox = document.getElementById('starStats');
const stellarRemnant = document.querySelector('.stellar-remnant');

let starClass = 'M';
let starTemp = 3000;
let lifespanChart = null;
let blackbodyChart = null;
// Current interaction intensity (0..1) used by CSS to render the hologram depression.
let holoDepth = 0;
// requestAnimationFrame id for the active decay loop (null when idle).
let holoFrame = null;
// Tracks whether the user is actively pressing within the main panel.
let isPointerDownInMain = false;

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function setMainHoloVars(xPct, yPct, depth) {
    if (!mainPanel) return;
    // CSS custom properties let the shader-like CSS layers react without layout thrash.
    mainPanel.style.setProperty('--holo-x', `${clamp(xPct, 0, 100)}%`);
    mainPanel.style.setProperty('--holo-y', `${clamp(yPct, 0, 100)}%`);
    mainPanel.style.setProperty('--holo-depth', String(clamp(depth, 0, 1)));
}
function scheduleHoloDepthDecay() {
    // Single RAF loop guard: avoid spawning competing decay animations.
    if (!mainPanel || holoFrame) return;
    const step = () => {
        // Ease depth back toward zero so the "dent" recovers instead of snapping off.
        holoDepth = Math.max(0, holoDepth - 0.05);
        mainPanel.style.setProperty('--holo-depth', holoDepth.toFixed(3));
        if (holoDepth > 0) {
            holoFrame = requestAnimationFrame(step); 
        } else {
            holoFrame = null;
        }
    };
    holoFrame = requestAnimationFrame(step);
}

function initHolographicMain() {
    if (!mainPanel) return;
    setMainHoloVars(50, 50, 0);
    // Ignore zones keep controls/charts from triggering hologram hover behavior.
    const hologramIgnoreSelector =
        'svg, canvas, #starStats, .chartSection, .chartPanel, .chartModeToggle, .slider-container, .slider, #endLife, button, input, select, textarea, a';
    const updateHoloFromPointer = (event, depthGain = 0.7) => {
        // Convert viewport pointer coordinates into percentages local to .main.
        const rect = mainPanel.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        // Use percentages so CSS gradients stay resolution-independent and responsive.
        const xPct = ((event.clientX - rect.left) / rect.width) * 100;
        const yPct = ((event.clientY - rect.top) / rect.height) * 100;
        holoDepth = Math.min(1, holoDepth + depthGain);
        setMainHoloVars(xPct, yPct, holoDepth);
    };

    mainPanel.addEventListener('pointermove', (event) => {
        // Skip passive hover effect on controls; allow effect again while pressed.
        if (!isPointerDownInMain && event.target instanceof Element && event.target.closest(hologramIgnoreSelector)) {
            scheduleHoloDepthDecay();
            return;
        }

        // Pressing intensifies the CRT "dent" compared to passive hover.
        const depthGain = isPointerDownInMain ? 0.5 : 0.22;
        updateHoloFromPointer(event, depthGain);

        if (holoFrame) {
            // Pointer movement takes ownership over depth, so stop any ongoing decay first.
            cancelAnimationFrame(holoFrame);
            holoFrame = null;
        }
        scheduleHoloDepthDecay();
    });

    mainPanel.addEventListener('pointerleave', () => {
        // Leaving the panel should release the effect naturally.
        scheduleHoloDepthDecay();
    });

    mainPanel.addEventListener('pointerdown', (event) => {
        // Do not intercept UI controls (button, slider, chart canvas, etc.).
        if (event.target instanceof Element && event.target.closest(hologramIgnoreSelector)) {
            return;
        }
        isPointerDownInMain = true;
        // Immediate hit response on first click, even from zero depth.
        updateHoloFromPointer(event, 1.1);
        if (holoFrame) {
            cancelAnimationFrame(holoFrame);
            holoFrame = null;
        }
        // Keep pointer events routed to .main during drag gestures.
        mainPanel.setPointerCapture(event.pointerId);
    });

    const releaseMainPress = () => {
        isPointerDownInMain = false;
        scheduleHoloDepthDecay();
    };
    window.addEventListener('pointerup', releaseMainPress);
    window.addEventListener('pointercancel', releaseMainPress);
}

function imgSrc(filename) {
    return new URL(filename, STATIC_IMG_BASE).href;
}

function buildStarArticleHtml(spec) {
    const src = imgSrc(spec.img);
    const widthPct = Math.min(77, Math.max(55, spec.imageWidthPct || 70));
    return (
        `<div class='sky shootingstar'></div><h1 class="audiowide-regular"> ${spec.title} </h1> ` +
        `<img src="${src}" style="width: ${widthPct}%; max-height: 52vh; height:auto; object-fit: contain; border:${spec.border};" alt="${spec.title}">` +
        `<p class='detailedDesc share-tech-regular'>${spec.desc}</p>` +
        `<div class="briefOverview"></div>` +
        // Holographic projector — keep in sync with templates/star-classes.html
        `<div class="starInfoHologram">` +
        `<div class="starInfoMore"></div>` +
        `<div class="hologramBelow" aria-hidden="true">` +
        `<div class="hologramBeamLayer">` +
        `<svg class="hologramBeams" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1 1">` +
        `<defs>` +
        `<linearGradient id="hologram-beam-grad" x1="0%" y1="100%" x2="0%" y2="0%" gradientUnits="objectBoundingBox">` +
        `<stop offset="0%" stop-color="rgba(37, 99, 235, 0.85)"/>` +
        `<stop offset="55%" stop-color="rgba(186, 220, 255, 0.65)"/>` +
        `<stop offset="100%" stop-color="rgba(255, 255, 255, 0.9)"/>` +
        `</linearGradient>` +
        `</defs>` +
        `<line class="hologramWire hologramWire--top" x1="0" y1="0" x2="1" y2="0"/>` +
        `<line class="hologramWire hologramWire--bottom" x1="0" y1="1" x2="1" y2="1"/>` +
        `<line class="hologramWire hologramWire--mid" x1="0" y1="0.5" x2="1" y2="0.5"/>` +
        `<line class="hologramBeamLine hologramBeamLine--left" x1="0" y1="1" x2="0" y2="0"/>` +
        `<line class="hologramBeamLine hologramBeamLine--right" x1="1" y1="1" x2="1" y2="0"/>` +
        `</svg>` +
        `</div>` +
        `<div class="hologramProjector"></div>` +
        `</div>` +
        `</div>`
    );
}

/** Maps panel bottom corners + projector top edge into .hologramBeamLayer pixel space (see CSS on .hologramBeams). */
let hologramBeamResizeObserver = null;

function updateHologramBeamGeometry() {
    const root = document.querySelector('.starInfoHologram');
    if (!root) return;

    const panel = root.querySelector('.starInfoMore');
    const layer = root.querySelector('.hologramBeamLayer');
    const projector = root.querySelector('.hologramProjector');
    const svg = root.querySelector('.hologramBeams');
    if (!panel || !layer || !projector || !svg) return;
    if (panel.matches(':empty')) return;

    const lineL = svg.querySelector('.hologramBeamLine--left');
    const lineR = svg.querySelector('.hologramBeamLine--right');
    const wireTop = svg.querySelector('.hologramWire--top');
    const wireBot = svg.querySelector('.hologramWire--bottom');
    const wireMid = svg.querySelector('.hologramWire--mid');
    if (!lineL || !lineR || !wireTop || !wireBot || !wireMid) return;

    const w = layer.clientWidth;
    const h = layer.clientHeight;
    if (w < 2 || h < 2) return;

    const lr = layer.getBoundingClientRect();
    const pr = panel.getBoundingClientRect();
    const jr = projector.getBoundingClientRect();

    // Top of strip ≈ panel bottom: horizontal position of panel lower corners in layer coords
    const xPanelL = pr.left - lr.left;
    const xPanelR = pr.right - lr.left;
    const yTop = 0;

    // Bottom of strip meets projector: upper edge of projector, left/right sides
    const xProjL = jr.left - lr.left;
    const xProjR = jr.right - lr.left;
    const yBot = h;

    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    lineL.setAttribute('x1', String(xProjL));
    lineL.setAttribute('y1', String(yBot));
    lineL.setAttribute('x2', String(xPanelL));
    lineL.setAttribute('y2', String(yTop));

    lineR.setAttribute('x1', String(xProjR));
    lineR.setAttribute('y1', String(yBot));
    lineR.setAttribute('x2', String(xPanelR));
    lineR.setAttribute('y2', String(yTop));

    wireTop.setAttribute('x1', String(xPanelL));
    wireTop.setAttribute('y1', String(yTop));
    wireTop.setAttribute('x2', String(xPanelR));
    wireTop.setAttribute('y2', String(yTop));

    wireBot.setAttribute('x1', String(xProjL));
    wireBot.setAttribute('y1', String(yBot));
    wireBot.setAttribute('x2', String(xProjR));
    wireBot.setAttribute('y2', String(yBot));

    const ym = h / 2;
    const xMidL = xPanelL + (xProjL - xPanelL) * 0.5;
    const xMidR = xPanelR + (xProjR - xPanelR) * 0.5;
    wireMid.setAttribute('x1', String(xMidL));
    wireMid.setAttribute('y1', String(ym));
    wireMid.setAttribute('x2', String(xMidR));
    wireMid.setAttribute('y2', String(ym));
}

function scheduleHologramBeamGeometry() {
    requestAnimationFrame(() => {
        requestAnimationFrame(updateHologramBeamGeometry);
    });
}

function initHologramBeamLayout() {
    if (!starInfo) return;
    if (hologramBeamResizeObserver) hologramBeamResizeObserver.disconnect();
    if (typeof ResizeObserver !== 'undefined') {
        hologramBeamResizeObserver = new ResizeObserver(() => updateHologramBeamGeometry());
        hologramBeamResizeObserver.observe(starInfo);
    }
    window.addEventListener('resize', scheduleHologramBeamGeometry);
    scheduleHologramBeamGeometry();
}

function renderStarInfoMore(spec) {
    const starInfoMore = starInfo.querySelector('.starInfoMore');
    if (!starInfoMore) return;
    const info = HABITABILITY_INFO[spec.letter];
    if (!info) {
        starInfoMore.innerHTML = '';
        return;
    }
    const tierColor = TIER_COLORS[info.tier] || '#111827';
    const classAccent = CLASS_ACCENT[spec.letter] || CLASS_ACCENT.G;
    starInfoMore.innerHTML = `
        <div class="infoLine">
            <span class="infoLabel">Star Surface Temperature:</span>
            <span class="infoValue infoValue--temp">${spec.tempK}K</span>
        </div>
        <div class="infoLine">
            <span class="infoLabel">Star Mass:</span>
            <span class="infoValue">${info.mass}</span>
        </div>
        <div class="habitabilityBox" style="background:${classAccent.boxBg}; color:${classAccent.text};">
            <div class="infoLine">
                <span class="infoLabel">Habitability Rating:</span>
                <span class="tierBadge" style="color:${tierColor}; border-color:${tierColor}; background:${classAccent.tierBg};">${info.tier}</span>
            </div>
            <p>${info.reason}</p>
        </div>
    `;
    scheduleHologramBeamGeometry();
}

/**
 * Gravitational lensing: SVG displacement + backdrop blur; strength scales with maxRadiusPx.
 * Ring mask in CSS fades the effect from the BH limb outward (~30px).
 */
function warp(maxRadiusPx = 30) {
    const map = document.querySelector('#bh-warp-filter feDisplacementMap');
    if (map) {
        const scale = Math.min(14, 3 + maxRadiusPx * 0.35); // Scale the displacement map to create a realistic lensing effect
        map.setAttribute('scale', String(Math.round(scale * 10) / 10)); // Round the scale to 1 decimal place
    }
    return 'url(#bh-warp-filter)';
}

function applyBlackHoleWarp() {
    applyWarpDefaults();
    const ring = document.querySelector('.bh-warp-ring');
    if (!ring) return;
    ring.style.setProperty('--bh-warp-filter', 'url(#bh-warp-filter)');
    ring.style.setProperty('--bh-warp-backdrop', 'blur(0.55px) brightness(1.03) saturate(1.05)');
}

function applyWarpDefaults() {
    const turb = document.querySelector('#bh-warp-filter feTurbulence');
    const map = document.querySelector('#bh-warp-filter feDisplacementMap');
    const ring = document.querySelector('.bh-warp-ring');
    if (turb) turb.setAttribute('baseFrequency', String(WARP_DEFAULT_FREQ));
    if (map) map.setAttribute('scale', String(WARP_DEFAULT_SCALE));
    if (ring) ring.style.setProperty('--bh-warp-radius', String(WARP_DEFAULT_RADIUS));
}

function resetStellarRemnant() {
    if (!stellarRemnant) return;
    stellarRemnant.classList.remove(
        'stellar-remnant--active',
        'stellar-remnant--neutron',
        'stellar-remnant--blackhole',
    );
    const ring = document.querySelector('.bh-warp-ring');
    if (ring) {
        ring.style.removeProperty('--bh-warp-filter');
        ring.style.removeProperty('--bh-warp-backdrop');
    }
}

function applyStarSpec(index) {
    const i = Math.min(Math.max(0, index), STAR_SPECS.length - 1);
    const spec = STAR_SPECS[i];
    starClass = spec.letter;
    starTemp = spec.tempK;
    resetStellarRemnant();
    star.className = 'star ' + starClass;
    starInfo.innerHTML = buildStarArticleHtml(spec);
    renderStarInfoMore(spec);
}

function computeBlackbodySeries(tempK) {
    const dataPoints = [];
    const lambdaMin = 5e-9;
    const lambdaMax = 3e-6;
    const step = 1e-8;
    const hc = planck * c;
    const coeff = 8 * Math.PI * planck * c;
    for (let lambda = lambdaMin; lambda <= lambdaMax; lambda += step) {
        const expArg = hc / (lambda * kBoltz * tempK);
        const expTerm = Math.exp(expArg) - 1;
        const energyDensity = (coeff / lambda ** 5) * (1 / expTerm);
        dataPoints.push({ x: lambda * 1e9, y: energyDensity });
    }
    return dataPoints;
}

function starBarColor(context) {
    const labels = context.chart.data.labels;
    const current = labels[context.dataIndex];
    if (current === starClass) {
        return window.getComputedStyle(star).backgroundColor;
    }
    return 'rgba(54, 162, 235, 0.5)';
}

const CHART_MOBILE_MQ = window.matchMedia('(max-width: 768px)');

/** Wider bar chart footprint; line chart slightly wider than tall for wavelength axis. */
const LIFESPAN_CHART_ASPECT = 1.52;
const SPECTRUM_CHART_ASPECT = 1.52;

const CHART_LAYOUT_PADDING = {
    top: 16,
    right: 14,
    bottom: 12,
    left: 12,
};

function resizeBothCharts() {
    requestAnimationFrame(() => {
        lifespanChart?.resize();
        blackbodyChart?.resize();
    });
}

function setChartTab(mode) {
    const panels = document.querySelectorAll('[data-chart-panel]');
    const buttons = document.querySelectorAll('[data-chart-tab]');
    if (!panels.length || !buttons.length) return;
    panels.forEach((p) => {
        p.classList.toggle('is-active', p.getAttribute('data-chart-panel') === mode);
    });
    buttons.forEach((b) => {
        const sel = b.getAttribute('data-chart-tab') === mode;
        b.classList.toggle('is-selected', sel);
        b.setAttribute('aria-selected', sel ? 'true' : 'false');
    });
    resizeBothCharts();
}

function onChartLayoutModeChange() {
    if (!CHART_MOBILE_MQ.matches) {
        resizeBothCharts();
        return;
    }
    const current =
        document.querySelector('.chartPanel.is-active')?.getAttribute('data-chart-panel') || 'lifespan';
    setChartTab(current);
}

let chartTabsInitialized = false;

function initChartTabs() {
    const toggle = document.querySelector('.chartModeToggle');
    if (!toggle || chartTabsInitialized) {
        onChartLayoutModeChange();
        return;
    }
    chartTabsInitialized = true;

    toggle.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-chart-tab]');
        if (!btn) return;
        e.preventDefault();
        setChartTab(btn.getAttribute('data-chart-tab'));
    });

    const mqHandler = () => onChartLayoutModeChange();
    if (CHART_MOBILE_MQ.addEventListener) {
        CHART_MOBILE_MQ.addEventListener('change', mqHandler);
    } else {
        CHART_MOBILE_MQ.addListener(mqHandler);
    }

    onChartLayoutModeChange();
}

function createLifespanChart() {
    const ctx = document.getElementById('myChart');
    lifespanChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: LIFESPAN_LABELS,
            datasets: [
                {
                    label: 'Lifespan (million years)',
                    data: LIFESPAN_MYR,
                    borderWidth: 1,
                    backgroundColor: starBarColor,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: LIFESPAN_CHART_ASPECT,
            layout: {
                padding: CHART_LAYOUT_PADDING,
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#0b1324',
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    type: 'logarithmic',
                    ticks: {
                        color: '#0b1324',
                    },
                    grid: {
                        color: 'rgba(11, 19, 36, 0.15)',
                    },
                },
                x: {
                    ticks: {
                        color: '#0b1324',
                    },
                    grid: {
                        color: 'rgba(11, 19, 36, 0.12)',
                    },
                },
            },
        },
    });
    return lifespanChart;
}

function createBlackbodyChart() {
    const ctx = document.getElementById('myChart2');
    blackbodyChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: `Star Class: ${starClass}`,
                    data: computeBlackbodySeries(starTemp),
                    borderColor: () => window.getComputedStyle(star).backgroundColor,
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: SPECTRUM_CHART_ASPECT,
            layout: {
                padding: CHART_LAYOUT_PADDING,
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#0b1324',
                    },
                },
            },
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Wavelength (nm)',
                        color: '#0b1324',
                    },
                    ticks: {
                        color: '#0b1324',
                    },
                    grid: {
                        color: 'rgba(11, 19, 36, 0.15)',
                    },
                },
                y: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Energy Density (J/m^-4)',
                        color: '#0b1324',
                    },
                    ticks: {
                        color: '#0b1324',
                    },
                    grid: {
                        color: 'rgba(11, 19, 36, 0.15)',
                    },
                },
            },
        },
    });
    return blackbodyChart;
}

function ensureChartCanvases() {
    if (document.getElementById('myChart')) return;
    const lifePanel = document.querySelector('.chartPanel--lifespan');
    const specPanel = document.querySelector('.chartPanel--spectrum');
    if (lifePanel && specPanel) {
        lifePanel.insertAdjacentHTML('beforeend', '<canvas id="myChart"></canvas>');
        specPanel.insertAdjacentHTML('beforeend', '<canvas id="myChart2"></canvas>');
    } else if (starStatBox) {
        starStatBox.insertAdjacentHTML('beforeend', `<canvas id="myChart"></canvas>`);
        starStatBox.insertAdjacentHTML('beforeend', `<canvas id="myChart2"></canvas>`);
    }
}

function refreshBlackbodyCurve() {
    if (!blackbodyChart) return;
    blackbodyChart.data.datasets[0].label = `Star Class: ${starClass}`;
    blackbodyChart.data.datasets[0].data = computeBlackbodySeries(starTemp);
    blackbodyChart.update();
    resizeBothCharts();
}

function scheduleChartColorRefresh() {
    if (chartColorRefreshTimer) {
        clearTimeout(chartColorRefreshTimer);
    }
    chartColorRefreshTimer = setTimeout(() => {
        chartColorRefreshTimer = null;
        if (!lifespanChart || !blackbodyChart) return;
        lifespanChart.update();
        blackbodyChart.update();
        resizeBothCharts();
    }, STAR_CHART_COLOR_DELAY_MS);
}

function initChartsIfNeeded() {
    ensureChartCanvases();
    if (!lifespanChart) createLifespanChart();
    if (!blackbodyChart) createBlackbodyChart();
}

function init() {
    for (let i = 1; i <= 3; i++) {
        header.style.setProperty(`--x${i}`, `${Math.random() * 70}%`);
        header.style.setProperty(`--y${i}`, `${Math.random() * 70}%`);
    }
    const initialIndex = slider ? Number(slider.value) || 0 : 0;
    applyWarpDefaults();
    applyStarSpec(initialIndex);
    initHologramBeamLayout();
    initHolographicMain();
    initChartsIfNeeded();
    initChartTabs();
    refreshBlackbodyCurve();
    scheduleChartColorRefresh();
}

function endLife(letter) {
    if (EXPLOSION_CLASSES.has(letter)) {
        if (stellarRemnant) {
            resetStellarRemnant();
            void stellarRemnant.offsetWidth;
            if (letter === 'B') {
                stellarRemnant.classList.add('stellar-remnant--neutron');
            } else {
                stellarRemnant.classList.add('stellar-remnant--blackhole');
                applyBlackHoleWarp();
            }
            stellarRemnant.classList.add('stellar-remnant--active');
        }
        star.classList.add('explosion');
        body.classList.add('shake');
        setTimeout(() => body.classList.remove('shake'), 900);
    } else if (PLANETARY_NEBULA_CLASSES.has(letter)) {
        star.classList.add('planetary-nebula', `planetary-nebula--${letter}`);
    } else {
        star.classList.add('slow-fade');
    }
}

document.addEventListener('DOMContentLoaded', init);

slider.addEventListener('input', (event) => {
    const index = Number(event.target.value);
    applyStarSpec(index);
    initChartsIfNeeded();
    initChartTabs();
    refreshBlackbodyCurve();
    scheduleChartColorRefresh();
});

explodeStar.addEventListener('click', () => endLife(starClass));
