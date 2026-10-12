// Live render full-stack serverless backend core endpint URL Target 
const API_ENDPOINT="https://ayur-prakriti-app.onrender.com";

// ==========================================================================
// PRAKRITI AI NUTRITION PLATFORM — CONSOLIDATED SCRIPT
// One section-switcher, one quiz engine, one compile step. No dead code.
// ==========================================================================

// --------------------------------------------------------------------------
// 1. SECTION / TAB NAVIGATION
// --------------------------------------------------------------------------
window.showSection = function (sectionId) {
    const sectionIds = ['shloka-section', 'dosha-section', 'quiz-section', 'nadi-section', 'vision-section'];
    sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    const targetId = sectionId.includes('-section') ? sectionId : `${sectionId}-section`;
    const activeTarget = document.getElementById(targetId);
    if (!activeTarget) {
        console.warn('[showSection] target not found:', targetId);
        return;
    }
    activeTarget.style.display = 'block';

    if (targetId === 'quiz-section') {
        initQuiz();
    }

    if (targetId === 'vision-section') {
        bindCameraButton();
    }
};

// --------------------------------------------------------------------------
// 2. DIET DATABASE
// --------------------------------------------------------------------------
const prakritiDietDatabase = {
    vata: {
        title: "Vata Balancing Nutritional Protocol 💨",
        consume: ["Warm, cooked meals", "Healthy fats (ghee, sesame oil)", "Sweet, sour, and salty tastes", "Avocados, bananas, warm milk, oats"],
        avoid: ["Raw vegetables & cold salads", "Dry crackers & popcorn", "Bitter & astringent tastes", "Iced drinks & frozen food"]
    },
    pitta: {
        title: "Pitta Balancing Nutritional Protocol 🔥",
        consume: ["Cooling, refreshing foods", "Sweet, bitter, and astringent tastes", "Coconut water, ghee, cucumbers, melons, cilantro", "Soaked almonds & basmati rice"],
        avoid: ["Pungent, sour, and overly salty items", "Chilli peppers, garlic, raw onions, heavy vinegar", "Deep-fried or fermented foods"]
    },
    kapha: {
        title: "Kapha Balancing Nutritional Protocol 🌱",
        consume: ["Light, warm, dry, stimulating foods", "Pungent, bitter, and astringent tastes", "Warm ginger tea, leafy greens, quinoa, apples", "Black pepper, turmeric, cumin"],
        avoid: ["Heavy, cold, oily, or overly sweet items", "Excessive dairy, cheese, refined sugar, ice cream", "Salty, oily fried foods"]
    },
    "vata-pitta": {
        title: "Dual-Dosha Vata-Pitta Management Protocol 💨🔥",
        consume: ["Warm but non-spicy cooked dishes", "Nourishing, grounding oils like ghee", "Sweet fruits, sweet potatoes, mung dal, zucchini"],
        avoid: ["Raw, dry items", "Hot chillies, vinegar, fermented food", "Caffeine and heavy dry nightshades"]
    },
    "pitta-kapha": {
        title: "Dual-Dosha Pitta-Kapha Management Protocol 🔥🌱",
        consume: ["Cool, fresh, but dry and light meals", "Bitter leafy greens, lentils, broccoli, non-sweet apples", "Turmeric, fennel, small amounts of ginger"],
        avoid: ["Heavy oils, deep-fried foods, heavy dairy", "Sour, hot, highly spicy, or fermented foods"]
    },
    "vata-kapha": {
        title: "Dual-Dosha Vata-Kapha Management Protocol 💨🌱",
        consume: ["Warm, light, cooked, and well-spiced meals", "Bitter and pungent items, quinoa, warm barley water", "Black pepper, cinnamon, cardamom"],
        avoid: ["Cold food, iced drinks, raw frozen items", "Heavy sweets, excessive fats, high-mucus dairy"]
    }
};

// --------------------------------------------------------------------------
// 3. QUIZ QUESTIONS
// --------------------------------------------------------------------------
const quizQuestions = [
    {
        id: 1,
        question: "Select the option that best maps your everyday digestion:",
        options: [
            { text: "Highly variable appetite with gas or bloating.", points: { vata: 2, pitta: 0, kapha: 0 } },
            { text: "Sharp, intense hunger that demands hot meals immediately.", points: { vata: 0, pitta: 2, kapha: 0 } },
            { text: "Slow, heavy digestion but consistent endurance.", points: { vata: 0, pitta: 0, kapha: 2 } }
        ]
    },
    {
        id: 2,
        question: "🌡️ THERMAL PROFILE: How does your body react to weather shifts?",
        options: [
            { text: "Highly intolerant to cold, dry drafts.", points: { vata: 2, pitta: 0, kapha: 0 } },
            { text: "Highly intolerant to heat waves and sun exposure.", points: { vata: 0, pitta: 2, kapha: 0 } },
            { text: "Intolerant to cold, damp, humid air; handles dry weather fine.", points: { vata: 0, pitta: 0, kapha: 2 } }
        ]
    },
    {
        id: 3,
        question: "🫀 NADI CHECK: Place two fingers on your radial artery wrist for 1 minute. Your pulse rate is closest to:",
        options: [
            { text: "Fast, irregular (80–95+ BPM).", points: { vata: 2, pitta: 0, kapha: 0 } },
            { text: "Sharp, bounding (70–80 BPM).", points: { vata: 0, pitta: 2, kapha: 0 } },
            { text: "Slow, deep, steady (60–70 BPM).", points: { vata: 0, pitta: 0, kapha: 2 } }
        ]
    },
    {
        id: 4,
        question: "🌊 Do you experience mucus congestion, morning fluid retention, or swelling?",
        options: [
            { text: "Rarely — I default to dryness, stiff joints, cracking sounds.", points: { vata: 2, pitta: 0, kapha: 0 } },
            { text: "Moderately — I get skin flushing, heat rashes, acid reflux.", points: { vata: 0, pitta: 2, kapha: 0 } },
            { text: "Highly — I retain water, get congested, swell easily.", points: { vata: 0, pitta: 0, kapha: 2 } }
        ]
    },
    {
        id: 5,
        question: "🌡️ Even in mild weather, how does your body run temperature-wise?",
        type: "slider",
        min: 1,
        max: 10,
        default: 5,
        minText: "1: Cold-sensitive / dry chills (Vata/Kapha)",
        maxText: "10: Runs hot / flushes easily (Pitta)"
    }
];

// --------------------------------------------------------------------------
// 4. QUIZ STATE
// --------------------------------------------------------------------------
let currentQuizIndex = 0;
let quizAnswers = {}; // { [questionIndex]: {type:'checkbox', selectedIndexes:[...]} | {type:'slider', value:n} }

function resetQuiz() {
    currentQuizIndex = 0;
    quizAnswers = {};
}

function initQuiz() {
    const slot = document.getElementById('quiz-container-slot');
    if (!slot) return;

    resetQuiz();

    slot.innerHTML = `
        <div style="width: 100%; background: #e0ebd8; height: 8px; border-radius: 4px; margin-bottom: 25px; overflow: hidden;">
            <div id="quiz-progress-bar" style="background: #2e7d32; height: 100%; width: 0%; transition: width 0.4s ease;"></div>
        </div>
        <div id="dynamic-question-box"></div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
            <button class="nav-btn" id="quiz-prev-btn" style="padding: 8px 18px; border-radius: 20px;" onclick="changeQuizQuestion(-1)">Previous</button>
            <span id="quiz-counter-text" style="font-weight: 600; color: #666; font-size: 0.9rem;"></span>
            <button class="nav-btn nav-btn-active" id="quiz-next-btn" style="padding: 8px 18px; border-radius: 20px; background-color: #2e7d32; color: white;" onclick="changeQuizQuestion(1)">Next Question</button>
        </div>
    `;

    renderActiveQuestion();
}

function renderActiveQuestion() {
    const idx = currentQuizIndex;
    const total = quizQuestions.length;
    const qBox = document.getElementById('dynamic-question-box');
    const progressBar = document.getElementById('quiz-progress-bar');
    const counterText = document.getElementById('quiz-counter-text');
    const nextBtn = document.getElementById('quiz-next-btn');
    const prevBtn = document.getElementById('quiz-prev-btn');
    if (!qBox) return;

    progressBar.style.width = `${((idx + 1) / total) * 100}%`;
    counterText.textContent = `Question ${idx + 1} of ${total}`;
    prevBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';
    nextBtn.textContent = idx === total - 1 ? "Compile Profile" : "Next Question";

    const currentQ = quizQuestions[idx];
    const savedAnswer = quizAnswers[idx];

    let html = `
        <div style="background: #f4f9f4; padding: 25px; border-radius: 8px; border-left: 5px solid #2e7d32; text-align: left; min-height: 180px;">
            <p style="font-weight: 600; color: #1b5e20; margin-bottom: 15px; font-size: 1.05rem;">${idx + 1}. ${currentQ.question}</p>
    `;

    if (currentQ.type === 'slider') {
        const val = savedAnswer ? savedAnswer.value : currentQ.default;
        html += `
            <div style="margin: 15px 0;">
                <input type="range" id="quiz-range-input" min="${currentQ.min}" max="${currentQ.max}" value="${val}"
                       style="width: 100%; accent-color: #2e7d32; cursor: pointer;"
                       oninput="document.getElementById('slider-live-value').textContent = this.value">
                <div style="display:flex; justify-content:space-between; font-size:11px; color:#666; margin-top:8px; font-family: monospace;">
                    <span>${currentQ.minText}</span><span>${currentQ.maxText}</span>
                </div>
                <div style="margin-top: 15px; text-align:center; font-weight: 700; color: #2e7d32; font-size: 1.2rem;">
                    Selected: <span id="slider-live-value">${val}</span>
                </div>
            </div>
        `;
    } else {
        currentQ.options.forEach((option, optIdx) => {
            const checked = savedAnswer && savedAnswer.selectedIndexes.includes(optIdx) ? 'checked' : '';
            html += `
                <label style="display: flex; align-items: center; margin: 12px 0; padding: 10px; border-radius: 6px; background: rgba(255,255,255,0.6); cursor: pointer;">
                    <input type="checkbox" data-opt-idx="${optIdx}" style="margin-right: 12px; transform: scale(1.1); accent-color: #2e7d32;" ${checked}>
                    <span>${option.text}</span>
                </label>
            `;
        });
    }

    html += `</div>`;
    qBox.innerHTML = html;
}

function captureCurrentAnswer() {
    const idx = currentQuizIndex;
    const currentQ = quizQuestions[idx];

    if (currentQ.type === 'slider') {
        const input = document.getElementById('quiz-range-input');
        quizAnswers[idx] = { type: 'slider', value: parseInt(input.value, 10) };
        return true;
    }

    const checked = document.querySelectorAll('#dynamic-question-box input[type="checkbox"]:checked');
    if (checked.length === 0) {
        alert('Please select at least one option.');
        return false;
    }
    const selectedIndexes = Array.from(checked).map(cb => parseInt(cb.dataset.optIdx, 10));
    quizAnswers[idx] = { type: 'checkbox', selectedIndexes };
    return true;
}

window.changeQuizQuestion = function (direction) {
    if (!captureCurrentAnswer()) return; // block advancing on empty checkbox question

    const total = quizQuestions.length;

    if (direction === 1 && currentQuizIndex === total - 1) {
        compileProfile();
        return;
    }

    const nextIdx = currentQuizIndex + direction;
    if (nextIdx >= 0 && nextIdx < total) {
        currentQuizIndex = nextIdx;
        renderActiveQuestion();
    }
};

// --------------------------------------------------------------------------
// 5. SCORE CALCULATION + COMPILE
// --------------------------------------------------------------------------
function computeDoshaScores() {
    const scores = { vata: 0, pitta: 0, kapha: 0 };

    quizQuestions.forEach((q, idx) => {
        const answer = quizAnswers[idx];
        if (!answer) return;

        if (answer.type === 'slider') {
            const val = answer.value;
            if (val >= 6) {
                scores.pitta += (val - 5) * 0.4;
            } else {
                scores.vata += (5 - val) * 0.2;
                scores.kapha += (5 - val) * 0.2;
            }
        } else {
            const weight = 2 / answer.selectedIndexes.length;
            answer.selectedIndexes.forEach(optIdx => {
                const points = q.options[optIdx].points;
                scores.vata += points.vata * weight;
                scores.pitta += points.pitta * weight;
                scores.kapha += points.kapha * weight;
            });
        }
    });

    return scores;
}

function calculatePrakritiBlueprint(scores) {
    const sorted = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    const primary = sorted[0];
    const secondary = sorted[1];

    const qualityMap = {
        vata: "VATA (Variable / Dry Quality) 💨",
        pitta: "PITTA (Moderate / Teekshna Heat) 🔥",
        kapha: "KAPHA (Structural / Stable Ojas) 🌱"
    };

    if (scores.vata === scores.pitta && scores.pitta === scores.kapha && scores.vata > 0) {
        return {
            summary: "✨ Perfect Three-Dosha (Sama) Balance ✨",
            lookupKey: null // no direct diet entry for tridoshic; fall back to primary below
        };
    }

    if (scores[secondary] >= scores[primary] * 0.8 && scores[secondary] > 0) {
        let lookupKey = `${primary}-${secondary}`;
        if (!prakritiDietDatabase[lookupKey]) lookupKey = `${secondary}-${primary}`;
        return {
            summary: `🚨 Dual-Dosha Constitution: ${primary.toUpperCase()}-${secondary.toUpperCase()}`,
            lookupKey
        };
    }

    return {
        summary: `Dominant constitution: ${qualityMap[primary]}`,
        lookupKey: primary
    };
}

function compileProfile() {
    const scores = computeDoshaScores();
    const result = calculatePrakritiBlueprint(scores);
    const activePlan = prakritiDietDatabase[result.lookupKey] || prakritiDietDatabase.vata;

    const slot = document.getElementById('quiz-container-slot');
    if (!slot) return;

    slot.innerHTML = `
        <div style="background: #eef5ee; padding: 25px; border-radius: 12px; border-left: 6px solid #4c8f4c; text-align: left;">
            <h2 style="color: #2c3e2c; margin-top: 0;">🌿 Analysis Complete</h2>
            <p style="font-size: 15px; line-height: 1.5;"><strong>${result.summary}</strong></p>
            <p style="color: #666; font-size: 12px; font-family: monospace; background: #e2ede2; padding: 8px; border-radius: 4px;">
                Vata: ${scores.vata.toFixed(1)} | Pitta: ${scores.pitta.toFixed(1)} | Kapha: ${scores.kapha.toFixed(1)}
            </p>
            <hr style="border: 0; border-top: 1px dashed #4c8f4c; margin: 20px 0;">
            <h3 style="color: #4c8f4c; margin-top: 0;">🥗 ${activePlan.title}</h3>
            <div style="display: flex; flex-direction: column; gap: 15px; margin-top: 15px;">
                <div style="background: #ffffff; padding: 15px; border-radius: 8px; border-top: 3px solid #4caf50;">
                    <h4 style="color: #4caf50; margin-top: 0;">🌟 Foods to Prioritize:</h4>
                    <ul style="padding-left: 15px; font-size: 13px; color: #333; line-height: 1.5; margin: 0;">
                        ${activePlan.consume.map(f => `<li style="margin-bottom:6px;">${f}</li>`).join('')}
                    </ul>
                </div>
                <div style="background: #ffffff; padding: 15px; border-radius: 8px; border-top: 3px solid #ff5722;">
                    <h4 style="color: #ff5722; margin-top: 0;">⚠️ Foods to Avoid/Limit:</h4>
                    <ul style="padding-left: 15px; font-size: 13px; color: #333; line-height: 1.5; margin: 0;">
                        ${activePlan.avoid.map(f => `<li style="margin-bottom:6px;">${f}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div style="text-align:center; margin-top:20px;">
                <button class="nav-btn" onclick="initQuiz()">Retake Quiz</button>
            </div>
        </div>
    `;
}

// --------------------------------------------------------------------------
// 6. COMPUTER VISION / CAMERA CAPTURE
// --------------------------------------------------------------------------
function bindCameraButton() {
    const scanBtn = document.getElementById('scan-plant-core-btn');
    if (!scanBtn) return;
    // Clear any previously attached listeners to avoid duplicate bindings
    const freshBtn = scanBtn.cloneNode(true);
    scanBtn.parentNode.replaceChild(freshBtn, scanBtn);
    freshBtn.addEventListener('click', triggerCameraCapture);
}

async function triggerCameraCapture() {
    const scanButton = document.getElementById('scan-plant-core-btn');
    const resultDisplay = document.getElementById('taxonomy-display-panel');
    if (!resultDisplay) return;

    resultDisplay.innerText = "Requesting camera access...";
    if (scanButton) scanButton.disabled = true;

    let mediaStream = null;
    let video = null;

    // Safety net: if metadata never arrives (stalled stream), don't hang forever.
    const timeout = (ms) => new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Camera stream timed out — try again.')), ms)
    );

    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment", width: 1280, height: 720 }
        });

        // The video element MUST be attached to the DOM (hidden is fine) and
        // marked muted + playsinline, or many mobile browsers (iOS Safari in
        // particular) never actually start decoding frames — play() just
        // hangs forever with no error. That's the "permission granted, then
        // nothing happens" symptom.
        video = document.createElement('video');
        video.setAttribute('playsinline', ''); // prevents iOS auto-fullscreen
        video.muted = true;
        video.autoplay = true;
        video.style.position = 'fixed';
        video.style.top = '-9999px';
        video.style.width = '1px';
        video.style.height = '1px';
        video.srcObject = mediaStream;
        document.body.appendChild(video);

        const metadataReady = new Promise((resolve) => {
            video.onloadedmetadata = () => resolve();
        });

        await Promise.race([metadataReady, timeout(8000)]);
        await video.play();

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

        mediaStream.getTracks().forEach(track => track.stop());
        video.remove();

        canvas.toBlob((blob) => {
            if (blob) {
                scanPlantCore(blob);
            } else {
                resultDisplay.innerText = "Could not capture frame — please try again.";
            }
            if (scanButton) scanButton.disabled = false;
        }, 'image/jpeg', 0.95);

    } catch (error) {
        console.error("[Camera] Capture failed:", error);
        resultDisplay.innerText = `Camera capture failed: ${error.message || 'unknown error'}. Check permissions and try again.`;
        if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
        if (video) video.remove();
        if (scanButton) scanButton.disabled = false;
    }
}
window.triggerCameraCapture = triggerCameraCapture;

// Points at your Flask server's /api/scan-plant route (see your scan_plant_endpoint).
// Change this to your real deployed URL once it's not running on localhost.
const SCAN_PLANT_API_URL = "https://ayur-prakriti-app.onrender.com";

async function scanPlantCore(blob) {
    const resultDisplay = document.getElementById('taxonomy-display-panel');
    if (!resultDisplay) return;

    const previewUrl = URL.createObjectURL(blob);
    resultDisplay.innerHTML = `
        <p>Analyzing image...</p>
        <img src="${previewUrl}" style="max-width:200px; border-radius:8px; margin-top:10px;">
    `;

    const formData = new FormData();
    formData.append('image', blob, 'scan.jpg');

    try {
        const response = await fetch(SCAN_PLANT_API_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errBody = await response.json().catch(() => ({}));
            throw new Error(errBody.error || `Server returned ${response.status}`);
        }

        const data = await response.json();

        resultDisplay.innerHTML = `
            <img src="${previewUrl}" style="max-width:200px; border-radius:8px; margin-bottom:12px;">
            <div style="text-align:left; background:#f4f9f4; padding:15px; border-radius:8px; font-size:13px; line-height:1.6;">
                <p><strong>Species:</strong> ${data.plant_identity ?? 'Unknown'}</p>
                <p><strong>Phyllotaxy:</strong> ${data.phyllotaxy ?? '—'}</p>
                <p><strong>Inflorescence:</strong> ${data.inflorescence ?? '—'}</p>
                <p><strong>Trichomes:</strong> ${data.trichomes ?? '—'}</p>
                <p><strong>Venation:</strong> ${data.venation ?? '—'}</p>
                <p><strong>Bract status:</strong> ${data.bract_status ?? '—'}</p>
                ${data.medicinal_value ? `<p><strong>Notes:</strong> ${data.medicinal_value}</p>` : ''}
            </div>
        `;
    } catch (error) {
        console.error('[scanPlantCore] request failed:', error);
        resultDisplay.innerHTML = `
            <img src="${previewUrl}" style="max-width:200px; border-radius:8px; margin-bottom:12px;">
            <p style="color:#c0392b;">Analysis failed: ${error.message}. Is your Render cloud web service live and awake??</p>
        `;
    }
}

// --------------------------------------------------------------------------
// 7. FLIPBOOK (Nadi Pariksha tab)
// --------------------------------------------------------------------------
let currentActiveBookPage = 1;
const totalAvailableBookPages = 3;

window.turnBookPage = function (direction) {
    const activePage = document.getElementById("book-page-" + currentActiveBookPage);
    if (activePage) {
        activePage.style.display = 'none';
        activePage.classList.remove('active');
    }

    currentActiveBookPage += direction;
    if (currentActiveBookPage < 1) currentActiveBookPage = 1;
    if (currentActiveBookPage > totalAvailableBookPages) currentActiveBookPage = totalAvailableBookPages;

    const nextPage = document.getElementById("book-page-" + currentActiveBookPage);
    if (nextPage) {
        nextPage.style.display = "block";
        nextPage.classList.add('active');
    }
};

// --------------------------------------------------------------------------
// 8. 3D FLIP CARD (Shloka tab)
// --------------------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
    const flipCard = document.querySelector(".flip-card-inner");
    if (!flipCard) return;

    flipCard.addEventListener("mouseenter", () => flipCard.style.transform = "rotateY(180deg)");
    flipCard.addEventListener("mouseleave", () => flipCard.style.transform = "rotateY(0deg)");
    flipCard.addEventListener("click", () => {
        flipCard.style.transform = flipCard.style.transform === "rotateY(180deg)" ? "rotateY(0deg)" : "rotateY(180deg)";
    });
});

window.addEventListener("DOMContentLoaded", () => {
    console.log("Prakriti platform ready.");
});
