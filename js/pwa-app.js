// ===== GEOPORTAL DATA FROM CSV =====
// Данные загружаются из CSV файла (данные от организаторов хакатона)

// Хранилище для Geoportal данных (загрузится из CSV)
let geoportalData = [];

// ===== LOAD CSV FROM FILE =====
async function loadGeoportalCSV() {
    try {
        const response = await fetch('data/geoportal_data.csv');
        const csvText = await response.text();

        // Parse CSV
        const lines = csvText.split('\n');
        const headers = lines[1].split(','); // Строка 2 - заголовки

        // Маппинг типов объектов (CSV → наш формат)
        const typeMapping = {
            'suv': 'water',
            'road': 'road',
            'ssv': 'clinic',       // sog'liqni saqlash vazirlik
            'maktab': 'school',
            'bogcha': 'kindergarten',
            'sport': 'sport'
        };

        // Парсим данные начиная со строки 3
        geoportalData = [];
        for (let i = 2; i < lines.length && geoportalData.length < 500; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Парсим CSV с учетом кавычек (lat и lon в кавычках с запятой)
            const values = parseCSVLine(line);
            if (values.length < 14) continue;

            // Индексы колонок из заголовков
            // _uid_,project_id,object_id,object_type,name,lat,lon,region_id,region_name_uz,year,sector,source_type,source_name,status
            const uid = parseInt(values[0]) || i;
            const objectType = typeMapping[values[3]] || values[3];
            const name = values[4] || `Obyekt #${uid}`;

            // Парсим lat/lon (европейский формат с запятой как разделитель)
            const lat = parseEuropeanNumber(values[5]);
            const lon = parseEuropeanNumber(values[6]);

            if (!lat || !lon || isNaN(lat) || isNaN(lon)) continue;

            const regionId = parseInt(values[7]) || 1706;
            const regionName = values[8] || 'Buxoro';
            const year = parseInt(values[9]) || 2024;
            const sector = values[10] || '';
            const status = values[13] || 'Tender';

            geoportalData.push({
                _uid: uid,
                object_type: objectType,
                name: name,
                lat: lat,
                lon: lon,
                region_id: regionId,
                region_name_uz: regionName,
                year: year,
                sector: sector,
                status: status
            });
        }

        console.log(`Загружено ${geoportalData.length} объектов из CSV`);
        return geoportalData;
    } catch (error) {
        console.error('Ошибка загрузки CSV (CORS или файл не найден):', error);
        // Используем данные из geoportal-sample.js если они загружены
        if (window.geoportalSample) {
            console.log('Использую данные из geoportal-sample.js (fallback)');
            geoportalData = window.geoportalSample;
        } else {
            geoportalData = getFallbackData();
        }
        return geoportalData;
    }
}

// Парсинг европейского числового формата (40,29767385 → 40.29767385)
function parseEuropeanNumber(str) {
    if (!str) return null;
    // Убираем кавычки и заменяем запятую на точку
    const clean = str.replace(/"/g, '').trim().replace(',', '.');
    return parseFloat(clean);
}

// Парсинг CSV строки с учетом кавычек
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

// Fallback данные если CSV не загрузится
function getFallbackData() {
    return [
        { _uid: 1, object_type: 'school', name: 'Maktab №45', lat: 40.2976, lon: 64.4058, region_name_uz: 'Buxoro', year: 2025, status: 'Tender' },
        { _uid: 2, object_type: 'road', name: 'Olmazor ko\'chasi', lat: 40.7414, lon: 64.3427, region_name_uz: 'Buxoro', year: 2021, status: 'Qurilish' },
        { _uid: 3, object_type: 'clinic', name: 'Markaziy poliklinika', lat: 40.2093, lon: 64.3536, region_name_uz: 'Buxoro', year: 2018, status: 'Rejalashtirilgan' },
        { _uid: 4, object_type: 'kindergarten', name: 'Bog\'cha №12', lat: 40.3521, lon: 64.4892, region_name_uz: 'Buxoro', year: 2024, status: 'Yakunlangan' },
        { _uid: 5, object_type: 'water', name: 'Suv ta\'minoti', lat: 40.2845, lon: 64.4123, region_name_uz: 'Buxoro', year: 2025, status: 'Tender' },
    ];
}

// Муляж пользовательских заявок
const mockReports = [
    { id: 1, title: 'Maktab #45 ta\'mir', category: 'school', date: '10-yan 2026', status: 'resolved' },
    { id: 2, title: 'Yo\'l chuqurlari', category: 'road', date: '08-yan 2026', status: 'progress' },
    { id: 3, title: 'Suv ta\'minoti', category: 'water', date: '05-yan 2026', status: 'pending' }
];

// ===== STATE =====
const state = {
    mode: 'simple',
    currentStep: 1,
    totalSteps: 4,

    // Gamification
    points: 1250,
    xp: 650,
    maxXP: 1000,
    level: 3,

    // Wizard data
    problemText: '',
    locationShared: false,
    locationData: null,
    photoTaken: false,
    selectedCategory: null,

    // Voice
    isRecording: false,

    // Map
    map: null,
    markers: [],
    heatmapActive: false,

    // Geoportal data loaded flag
    geoportalLoaded: false
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 PWA: DOMContentLoaded started');
    // 1. Initialize UI FIRST (Critical for interactivity)
    initPwaI18n();
    initModeSwitch();
    initWizard();
    initGeekMode();
    initNavigation();

    renderReports();
    updateGamificationUI();

    // 2. Load Data in Background (Do not block UI)
    loadGeoportalCSV().then(() => {
        state.geoportalLoaded = true;
        // Refresh map if active
        if (state.map) {
            filterMarkers();
        }
    });
});

// ===== i18n INITIALIZATION =====
function initPwaI18n() {
    if (typeof i18n === 'undefined') {
        console.warn('i18n not loaded yet');
        return;
    }

    // Language switcher - using direct selectors for PWA buttons
    const langButtons = document.querySelectorAll('.lang-btn-pwa');

    if (langButtons.length > 0) {
        console.log('PWA i18n: Found', langButtons.length, 'language buttons');

        // Set active based on current language
        langButtons.forEach(btn => {
            if (btn.dataset.lang === i18n.getLang()) {
                langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });

        // Add click handler
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const lang = btn.dataset.lang;
                console.log('PWA: Switching language to', lang);

                // Update active state
                langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Set language and update DOM
                i18n.setLang(lang);
            });
        });
    }

    // Update DOM with current language
    i18n.updateDOM();
}

// Make globally available for debugging
window.initPwaI18n = initPwaI18n;

// ===== BOTTOM NAVIGATION =====
function initNavigation() {
    console.log('🧭 InitNavigation called');
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('👇 Nav button clicked:', btn.dataset.tab);
            const tabId = btn.dataset.tab;
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    console.log('Switching to tab:', tabId);

    // 1. Update Buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // 2. Hide placeholder if visible
    const placeholder = document.getElementById('tab-placeholder');
    if (placeholder) placeholder.style.display = 'none';

    // 3. Get content areas
    const wizardSteps = document.querySelectorAll('.wizard-step');
    const reportsSection = document.getElementById('reports-section');

    if (tabId === 'home') {
        goToStep(state.currentStep);
        reportsSection.style.display = 'block';
    } else if (tabId === 'reports') {
        // Show reports with MAP
        wizardSteps.forEach(ws => ws.classList.remove('active'));
        reportsSection.style.display = 'none';
        showReportsWithMap();
    } else if (tabId === 'analytics') {
        // Show analytics with leaderboard
        wizardSteps.forEach(ws => ws.classList.remove('active'));
        reportsSection.style.display = 'none';
        showAnalyticsWithLeaderboard();
    } else if (tabId === 'profile') {
        wizardSteps.forEach(ws => ws.classList.remove('active'));
        reportsSection.style.display = 'none';
        showTabPlaceholder('profile');
    }
}

// ===== REPORTS TAB WITH MAP =====
function showReportsWithMap() {
    let placeholder = document.getElementById('tab-placeholder');
    if (!placeholder) {
        placeholder = document.createElement('div');
        placeholder.id = 'tab-placeholder';
        placeholder.className = 'tab-content-placeholder';
        document.querySelector('.simple-mode').appendChild(placeholder);
    }
    placeholder.style.display = 'block';

    const t = typeof i18n !== 'undefined' ? i18n.t.bind(i18n) : (k) => k;

    placeholder.innerHTML = `
        <div class="reports-map-container">
            <div class="reports-header">
                <h2><i class="fas fa-map-marked-alt"></i> ${t('reports.myReports')}</h2>
                <span class="reports-count">${mockReports.length} ${t('reports.count')}</span>
            </div>
            <div id="reports-map" style="height: 250px; border-radius: 16px; margin: 15px 0;"></div>
            <div class="reports-list-mini" id="reports-list-mini"></div>
        </div>
    `;

    // Initialize mini reports map
    setTimeout(() => {
        const reportsMap = L.map('reports-map').setView([40.30, 64.42], 11);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(reportsMap);

        // Add markers for mock reports
        mockReports.forEach((r, i) => {
            const lat = 40.30 + (Math.random() * 0.1 - 0.05);
            const lon = 64.42 + (Math.random() * 0.1 - 0.05);
            L.marker([lat, lon]).addTo(reportsMap).bindPopup(r.title);
        });

        // Render mini list
        const listContainer = document.getElementById('reports-list-mini');
        if (listContainer) {
            listContainer.innerHTML = mockReports.map(r => `
                <div class="report-mini-card">
                    <i class="fas fa-${getIcon(r.category)}"></i>
                    <div class="report-mini-info">
                        <strong>${r.title}</strong>
                        <span>${r.date}</span>
                    </div>
                    <span class="status-dot ${r.status}"></span>
                </div>
            `).join('');
        }
    }, 100);
}

// ===== ANALYTICS TAB WITH LEADERBOARD =====
function showAnalyticsWithLeaderboard() {
    let placeholder = document.getElementById('tab-placeholder');
    if (!placeholder) {
        placeholder = document.createElement('div');
        placeholder.id = 'tab-placeholder';
        placeholder.className = 'tab-content-placeholder';
        document.querySelector('.simple-mode').appendChild(placeholder);
    }
    placeholder.style.display = 'block';

    const t = typeof i18n !== 'undefined' ? i18n.t.bind(i18n) : (k) => k;

    placeholder.innerHTML = `
        <div class="analytics-container">
            <div class="analytics-header">
                <h2><i class="fas fa-chart-bar"></i> ${t('analytics.title')}</h2>
            </div>
            
            <!-- Leaderboard -->
            <div class="leaderboard-section">
                <h3><i class="fas fa-trophy"></i> ${t('leaderboard.topCitizens')}</h3>
                <div class="leaderboard-list-full">
                    <div class="leader-row gold">
                        <span class="rank">1</span>
                        <span class="name">Aziz K.</span>
                        <span class="points">4,850 XP</span>
                    </div>
                    <div class="leader-row silver">
                        <span class="rank">2</span>
                        <span class="name">Nilufar M.</span>
                        <span class="points">4,200 XP</span>
                    </div>
                    <div class="leader-row bronze">
                        <span class="rank">3</span>
                        <span class="name">Sardor T.</span>
                        <span class="points">3,800 XP</span>
                    </div>
                    <div class="leader-row current">
                        <span class="rank">47</span>
                        <span class="name">${t('leaderboard.you')}</span>
                        <span class="points">${state.points.toLocaleString()} XP</span>
                    </div>
                </div>
            </div>
            
            <!-- Stats -->
            <div class="analytics-stats">
                <div class="stat-box">
                    <span class="stat-value">${mockReports.length}</span>
                    <span class="stat-label">${t('reports.myReports')}</span>
                </div>
                <div class="stat-box">
                    <span class="stat-value">${state.level}</span>
                    <span class="stat-label">${t('gamification.level')}</span>
                </div>
                <div class="stat-box">
                    <span class="stat-value">${state.points}</span>
                    <span class="stat-label">${t('gamification.points')}</span>
                </div>
            </div>
        </div>
    `;
}

// ===== MODE SWITCHING =====
function initModeSwitch() {
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => switchMode(btn.dataset.mode));
    });
}

function switchMode(mode) {
    state.mode = mode;

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    document.getElementById('simple-mode').classList.toggle('active', mode === 'simple');
    document.getElementById('geek-mode').classList.toggle('active', mode === 'geek');

    if (mode === 'geek' && !state.map) {
        setTimeout(initMap, 100);
    }
}

// ===== STEP-BY-STEP WIZARD =====
function initWizard() {
    console.log('🧙 InitWizard called');
    // Voice button
    const voiceBtn = document.getElementById('voice-record-btn'); // Fixed ID
    if (voiceBtn) voiceBtn.addEventListener('click', toggleVoiceRecording);
    else console.error('❌ Voice btn not found');

    // Text input
    const issueText = document.getElementById('issue-text'); // Fixed ID
    if (issueText) {
        issueText.addEventListener('input', (e) => {
            const hasText = e.target.value.trim().length > 10;
            const nextBtn = document.getElementById('next-to-step-2');
            if (nextBtn) nextBtn.disabled = !hasText;
            if (hasText) {
                state.problemText = e.target.value.trim();
            }
        });
    } else {
        console.error('❌ Issue text input not found');
    }

    // Confirm problem from AI
    document.getElementById('confirm-problem').addEventListener('click', () => {
        document.getElementById('next-to-step-2').disabled = false;
        showToast('Muammo tasdiqlandi', '+25 XP');
        addXP(25);
    });

    // Step navigation
    document.getElementById('next-to-step-2').addEventListener('click', () => goToStep(2));
    document.getElementById('back-to-step-1').addEventListener('click', () => goToStep(1));
    document.getElementById('next-to-step-3').addEventListener('click', () => goToStep(3));
    document.getElementById('back-to-step-2').addEventListener('click', () => goToStep(2));
    document.getElementById('next-to-step-4').addEventListener('click', () => goToStep(4));
    document.getElementById('back-to-step-3').addEventListener('click', () => goToStep(3));

    // Location
    document.getElementById('share-location-btn').addEventListener('click', shareLocation);


    // Photo inputs
    document.getElementById('camera-input').addEventListener('change', handlePhotoSelect);
    document.getElementById('gallery-input').addEventListener('change', handlePhotoSelect);

    // Remove photo
    document.getElementById('remove-photo').addEventListener('click', removePhoto);

    // Categories
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => selectCategory(card.dataset.cat));
    });

    // Submit
    document.getElementById('submit-report').addEventListener('click', submitReport);

    // New report
    document.getElementById('new-report').addEventListener('click', resetWizard);
}

function goToStep(step) {
    console.log('👣 GoToStep called:', step);
    state.currentStep = step;

    // Update step indicators
    document.querySelectorAll('.step-item').forEach((item, index) => {
        const stepNum = index + 1;
        item.classList.remove('active', 'completed');
        if (stepNum < step) item.classList.add('completed');
        if (stepNum === step) item.classList.add('active');
    });

    document.querySelectorAll('.step-line').forEach((line, index) => {
        line.classList.remove('active', 'completed');
        if (index < step - 1) line.classList.add('completed');
    });

    // Show/hide steps
    document.querySelectorAll('.wizard-step').forEach(ws => ws.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');

    // Hide reports section during wizard
    document.getElementById('reports-section').style.display = step === 1 ? 'block' : 'none';
}

function toggleVoiceRecording() {
    const btn = document.getElementById('voice-record-btn');
    state.isRecording = !state.isRecording;

    if (state.isRecording) {
        btn.classList.add('recording');
        btn.innerHTML = '<i class="fas fa-stop"></i><div class="pulse-ring"></div>';

        // Simulate recording for 4 seconds
        setTimeout(() => {
            if (state.isRecording) {
                stopRecording();
            }
        }, 4000);
    } else {
        stopRecording();
    }
}

function stopRecording() {
    const btn = document.getElementById('voice-record-btn');
    state.isRecording = false;
    btn.classList.remove('recording');
    btn.innerHTML = '<i class="fas fa-microphone"></i><div class="pulse-ring"></div>';


    // Show AI analysis
    state.problemText = "Yo'lda katta chuqur bor, mashinalar o'ta olmayapti. Tezroq ta'mir qilish kerak.";
    document.getElementById('issue-text').value = state.problemText;

    const aiResponse = document.getElementById('ai-response');
    aiResponse.style.display = 'flex';
    document.getElementById('ai-result').textContent = `"${state.problemText}"`;

    showToast('AI tahlil qildi', 'Matnni tekshiring');
}

function shareLocation() {
    const btn = document.getElementById('share-location-btn');

    const preview = document.getElementById('location-preview');
    const detectedCard = document.getElementById('detected-object');
    const noObjectCard = document.getElementById('no-object-found');

    // Simulate getting location
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Aniqlanmoqda...</span>';

    setTimeout(() => {
        // Generate simulated location (near one of the Geoportal objects for demo)
        // Point #1 in CSV: 40.29767385, 64.40581629 (Suv)
        const simulatedLat = 40.29767385 + (Math.random() * 0.0004 - 0.0002);
        const simulatedLon = 64.40581629 + (Math.random() * 0.0004 - 0.0002);

        state.locationShared = true;
        state.locationData = {
            lat: simulatedLat,
            lon: simulatedLon,
            address: 'Buxoro, Shoxrud ko\'chasi'
        };

        btn.classList.add('done');
        btn.innerHTML = '<i class="fas fa-check"></i><span>Joylashuv aniqlandi</span>';

        preview.style.display = 'flex';
        document.getElementById('location-address').textContent = state.locationData.address;
        document.getElementById('location-coords').textContent =
            `${state.locationData.lat.toFixed(4)}, ${state.locationData.lon.toFixed(4)}`;

        // ===== FIND NEAREST GEOPORTAL OBJECT =====
        const nearestObject = findNearestGeoportalObject(simulatedLat, simulatedLon);

        if (nearestObject) {
            // Object found within radius - show detected card
            showDetectedObject(nearestObject);
            detectedCard.style.display = 'block';
            noObjectCard.style.display = 'none';

            // Auto-select category based on detected object
            state.detectedObject = nearestObject;
            state.selectedCategory = nearestObject.object_type;

            addXP(50); // Bonus XP for auto-detection
            showToast('Obyekt aniqlandi!', `${nearestObject.name} (~${nearestObject.distance}m)`);
        } else {
            // No object found - show message
            detectedCard.style.display = 'none';
            noObjectCard.style.display = 'flex';
            showToast('Joylashuv aniqlandi', '+30 XP');
        }

        document.getElementById('next-to-step-3').disabled = false;
        addXP(30);
    }, 1500);
}

// ===== HAVERSINE FORMULA - Calculate distance between two coordinates =====
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// ===== FIND NEAREST OBJECT FROM GEOPORTAL DATA =====
function findNearestGeoportalObject(userLat, userLon, maxDistance = 50) {
    let nearest = null;
    let minDistance = Infinity;

    geoportalData.forEach(obj => {
        const distance = calculateDistance(userLat, userLon, obj.lat, obj.lon);

        if (distance < minDistance && distance <= maxDistance) {
            minDistance = distance;
            nearest = {
                ...obj,
                distance: Math.round(distance)
            };
        }
    });

    return nearest;
}

// ===== SHOW DETECTED OBJECT IN UI =====
function showDetectedObject(obj) {
    const iconEl = document.getElementById('detected-icon');
    const nameEl = document.getElementById('detected-name');
    const typeEl = document.getElementById('detected-type');
    const distanceEl = document.getElementById('detected-distance');
    const autoCatEl = document.getElementById('auto-category');

    // Type names and icons
    const typeInfo = {
        school: { name: 'Ta\'lim muassasasi', icon: 'school', label: 'Maktab' },
        kindergarten: { name: 'Maktabgacha ta\'lim', icon: 'child', label: 'Bog\'cha' },
        clinic: { name: 'Tibbiyot muassasasi', icon: 'hospital', label: 'Klinika' },
        sport: { name: 'Sport inshootlari', icon: 'futbol', label: 'Sport' },
        road: { name: 'Yo\'l infratuzilmasi', icon: 'road', label: 'Yo\'l' },
        water: { name: 'Suv ta\'minoti', icon: 'droplet', label: 'Suv' }
    };

    const info = typeInfo[obj.object_type] || typeInfo.school;

    // Update icon
    iconEl.className = `detected-icon ${obj.object_type}`;
    iconEl.innerHTML = `<i class="fas fa-${info.icon}"></i>`;

    // Update text
    nameEl.textContent = obj.name;
    typeEl.textContent = info.name;
    distanceEl.textContent = `~${obj.distance} metr`;
    autoCatEl.textContent = info.label;
}

function handlePhotoSelect(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById('photo-preview');
            const img = document.getElementById('preview-img');

            img.src = e.target.result;
            preview.style.display = 'flex';

            state.photoTaken = true;
            document.querySelectorAll('.photo-btn').forEach(btn => btn.classList.add('done'));
            document.getElementById('next-to-step-4').disabled = false;

            addXP(20);
            showToast('Rasm yuklandi', '+20 XP');
        };
        reader.readAsDataURL(file);
    }
}

function removePhoto() {
    state.photoTaken = false;
    document.getElementById('photo-preview').style.display = 'none';
    document.getElementById('preview-img').src = '';
    document.getElementById('camera-input').value = '';
    document.getElementById('gallery-input').value = '';

    document.getElementById('next-to-step-4').disabled = true;
    document.querySelectorAll('.photo-btn').forEach(btn => btn.classList.remove('done'));
}

function selectCategory(category) {
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.cat === category);
    });

    state.selectedCategory = category;
    document.getElementById('submit-report').disabled = false;
}

function submitReport() {
    const categories = {
        school: { name: 'Maktab', xp: 50 },
        clinic: { name: 'Klinika', xp: 50 },
        road: { name: 'Yo\'l', xp: 40 },
        water: { name: 'Suv', xp: 40 },
        kindergarten: { name: 'Bog\'cha', xp: 50 },
        sport: { name: 'Sport', xp: 45 }
    };

    const cat = categories[state.selectedCategory];
    addXP(cat.xp);

    // Calculate total XP earned
    const totalXP = 25 + 30 + 20 + cat.xp; // text + location + photo + category

    // Show success
    document.querySelectorAll('.wizard-step').forEach(ws => ws.classList.remove('active'));
    document.getElementById('step-success').classList.add('active');

    document.getElementById('report-number').textContent = '#' + (Math.floor(Math.random() * 9000) + 1000);
    document.getElementById('report-category').textContent = cat.name;
    document.getElementById('total-xp').textContent = totalXP;

    // Show achievement
    setTimeout(() => {
        showAchievement('Birinchi murojaat', 100);
    }, 1000);
}

function resetWizard() {
    state.currentStep = 1;
    state.problemText = '';
    state.locationShared = false;
    state.photoTaken = false;
    state.selectedCategory = null;

    // Reset UI
    document.getElementById('issue-text').value = '';
    document.getElementById('ai-response').style.display = 'none';

    document.getElementById('location-preview').style.display = 'none';
    document.getElementById('photo-preview').style.display = 'none';
    document.getElementById('detected-object').style.display = 'none';
    document.getElementById('no-object-found').style.display = 'none';
    state.detectedObject = null;

    document.getElementById('share-location-btn').classList.remove('done');
    const t = typeof i18n !== 'undefined' ? i18n.t.bind(i18n) : (k) => k;
    document.getElementById('share-location-btn').innerHTML =
        `<i class="fas fa-location-arrow"></i><span>${t('wizard.shareLocationBtn')}</span>`;


    document.querySelectorAll('.photo-btn').forEach(btn => btn.classList.remove('done'));
    document.querySelectorAll('.category-card').forEach(card => card.classList.remove('selected'));

    document.getElementById('next-to-step-2').disabled = true;
    document.getElementById('next-to-step-3').disabled = true;
    document.getElementById('next-to-step-4').disabled = true;
    document.getElementById('submit-report').disabled = true;

    // Reset step indicators
    document.querySelectorAll('.step-item').forEach((item, index) => {
        item.classList.remove('active', 'completed');
        if (index === 0) item.classList.add('active');
    });
    document.querySelectorAll('.step-line').forEach(line => {
        line.classList.remove('active', 'completed');
    });

    // Show step 1
    document.querySelectorAll('.wizard-step').forEach(ws => ws.classList.remove('active'));
    document.getElementById('step-1').classList.add('active');
    document.getElementById('reports-section').style.display = 'block';
}

function renderReports() {
    const container = document.getElementById('simple-reports');
    container.innerHTML = mockReports.map(r => `
        <div class="report-card">
            <div class="report-icon ${r.category}">
                <i class="fas fa-${getIcon(r.category)}"></i>
            </div>
            <div class="report-info">
                <div class="report-title">${r.title}</div>
                <div class="report-date">${r.date}</div>
            </div>
            <div class="report-status ${r.status}">${getStatusText(r.status)}</div>
        </div>
    `).join('');
}

// ===== GEEK MODE - MAP WITH GEOASR DATA =====
function initGeekMode() {
    document.getElementById('toggle-filters').addEventListener('click', () => {
        document.querySelector('.filter-content').classList.toggle('hidden');
    });

    document.getElementById('heatmap-toggle').addEventListener('click', toggleHeatmap);

    document.getElementById('fab-new-report').addEventListener('click', () => {
        switchMode('simple');
    });

    // Filter chips
    document.querySelectorAll('.chip[data-filter]').forEach(chip => {
        chip.addEventListener('click', () => {
            chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            filterMarkers();
        });
    });

    document.querySelectorAll('.chip[data-status]').forEach(chip => {
        chip.addEventListener('click', () => {
            chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            filterMarkers();
        });
    });
}

function initMap() {
    // Initialize Leaflet map centered on Bukhara
    state.map = L.map('map').setView([40.30, 64.42], 11);

    // Dark map tiles (similar to screenshot)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO'
    }).addTo(state.map);

    // Add markers from geoasr data
    addGeoasrMarkers();

    // Update stats
    updateMapStats();
}

function addGeoasrMarkers() {
    // Icon colors matching geoasr.uz color scheme
    const iconConfig = {
        school: { color: '#f093fb', icon: 'school' },           // Pink
        kindergarten: { color: '#fed6e3', icon: 'child' },      // Light pink
        clinic: { color: '#4facfe', icon: 'hospital' },         // Blue
        sport: { color: '#e74c3c', icon: 'futbol' },            // Red (like geoasr)
        road: { color: '#fa709a', icon: 'road' },               // Orange-pink
        water: { color: '#30cfd0', icon: 'droplet' }            // Cyan
    };

    geoportalData.forEach(project => {
        const config = iconConfig[project.object_type] || iconConfig.school;

        // Create custom div icon (circular markers like geoasr.uz)
        const markerIcon = L.divIcon({
            className: 'custom-marker',
            html: `
                <div style="
                    background: ${config.color}; 
                    width: 32px; 
                    height: 32px; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    box-shadow: 0 3px 12px ${config.color}60;
                    border: 2px solid white;
                ">
                    <i class="fas fa-${config.icon}" style="color: white; font-size: 14px;"></i>
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        // Status mapping
        const statusMap = {
            'Tender': 'pending',
            'Rejalashtirilgan': 'pending',
            'Qurilish': 'progress',
            'Yakunlangan': 'resolved'
        };

        const marker = L.marker([project.lat, project.lon], { icon: markerIcon })
            .addTo(state.map)
            .bindPopup(`
                <div style="min-width: 220px; font-family: Inter, sans-serif;">
                    <h4 style="margin: 0 0 10px; color: #333; font-size: 15px;">${project.name}</h4>
                    <div style="font-size: 12px; color: #666; line-height: 1.6;">
                        <p style="margin: 4px 0;"><strong>Hudud:</strong> ${project.region_name_uz}</p>
                        <p style="margin: 4px 0;"><strong>Yil:</strong> ${project.year || 'N/A'}</p>
                        <p style="margin: 4px 0;"><strong>Holat:</strong> 
                            <span style="
                                display: inline-block;
                                padding: 2px 8px;
                                border-radius: 10px;
                                font-size: 11px;
                                background: ${project.status === 'Yakunlangan' ? '#e8f5e9' : project.status === 'Qurilish' ? '#fff3e0' : '#e3f2fd'};
                                color: ${project.status === 'Yakunlangan' ? '#4caf50' : project.status === 'Qurilish' ? '#ff9800' : '#2196f3'};
                            ">${project.status || 'N/A'}</span>
                        </p>
                        ${project.committed_uzs ? `<p style="margin: 4px 0;"><strong>Byudjet:</strong> ${(project.committed_uzs / 1e9).toFixed(1)} mlrd so'm</p>` : ''}
                    </div>
                </div>
            `);

        // Store data for filtering
        marker.projectData = {
            ...project,
            statusCategory: statusMap[project.status] || 'pending'
        };
        state.markers.push(marker);
    });
}

function filterMarkers() {
    const typeFilter = document.querySelector('.chip[data-filter].active')?.dataset.filter || 'all';
    const statusFilter = document.querySelector('.chip[data-status].active')?.dataset.status || 'all';

    let visibleCount = 0;
    let resolvedCount = 0;
    let progressCount = 0;

    state.markers.forEach(marker => {
        const project = marker.projectData;
        const typeMatch = typeFilter === 'all' || project.object_type === typeFilter;
        const statusMatch = statusFilter === 'all' || project.statusCategory === statusFilter;

        if (typeMatch && statusMatch) {
            marker.addTo(state.map);
            visibleCount++;
            if (project.statusCategory === 'resolved') resolvedCount++;
            if (project.statusCategory === 'progress') progressCount++;
        } else {
            state.map.removeLayer(marker);
        }
    });

    // Update floating stats
    document.getElementById('stat-total').textContent = visibleCount.toLocaleString();
    document.getElementById('stat-resolved').textContent = resolvedCount.toLocaleString();
    document.getElementById('stat-progress').textContent = (visibleCount - resolvedCount).toLocaleString();
}

function updateMapStats() {
    // Use geoasr stats for display
    document.getElementById('stat-total').textContent = '1,247';
    document.getElementById('stat-resolved').textContent = '892';
    document.getElementById('stat-progress').textContent = '355';
}

function toggleHeatmap() {
    const btn = document.getElementById('heatmap-toggle');
    state.heatmapActive = !state.heatmapActive;
    btn.classList.toggle('active', state.heatmapActive);
    btn.innerHTML = state.heatmapActive
        ? '<i class="fas fa-fire"></i> Issiqlik xaritasini yashirish'
        : '<i class="fas fa-fire"></i> Issiqlik xaritasini ko\'rsatish';

    showToast(state.heatmapActive ? 'Issiqlik xaritasi yoqildi' : 'Issiqlik xaritasi o\'chirildi');
}

// ===== GAMIFICATION =====
function addXP(amount) {
    state.xp += amount;
    state.points += amount;

    if (state.xp >= state.maxXP) {
        levelUp();
    }

    updateGamificationUI();
}

function levelUp() {
    state.level++;
    state.xp = state.xp - state.maxXP;
    state.maxXP = Math.floor(state.maxXP * 1.5);

    showAchievement(`Daraja ${state.level}!`, 200);
}

function updateGamificationUI() {
    const xpPercent = (state.xp / state.maxXP) * 100;

    // Simple mode
    document.getElementById('simple-level').textContent = state.level;
    document.getElementById('simple-points').textContent = state.points.toLocaleString();
    document.getElementById('current-xp').textContent = state.xp;
    document.getElementById('max-xp').textContent = state.maxXP;
    document.getElementById('xp-bar').style.width = `${xpPercent}%`;

    // Geek mode
    document.getElementById('geek-level').textContent = state.level;
    document.getElementById('geek-points').textContent = state.points.toLocaleString();
    document.getElementById('geek-xp-bar').style.width = `${xpPercent}%`;
}

// ===== HELPERS =====
function getIcon(category) {
    const icons = { school: 'school', clinic: 'hospital', road: 'road', water: 'droplet', kindergarten: 'child', sport: 'futbol' };
    return icons[category] || 'circle';
}

function getStatusText(status) {
    const texts = { resolved: 'Hal qilindi', progress: 'Jarayonda', pending: 'Kutilmoqda' };
    return texts[status] || status;
}

function showToast(title, message = '') {
    const toast = document.getElementById('toast');
    toast.querySelector('.toast-title').textContent = title;
    document.getElementById('toast-message').textContent = message;
    toast.classList.add('show');

    setTimeout(() => toast.classList.remove('show'), 3000);
}

function showAchievement(text, xp) {
    const popup = document.getElementById('achievement-popup');
    document.getElementById('achievement-text').textContent = text;
    popup.querySelector('.achievement-reward').textContent = `+${xp} XP`;
    popup.classList.add('show');

    state.xp += xp;
    state.points += xp;
    updateGamificationUI();

    document.getElementById('close-achievement').onclick = () => {
        popup.classList.remove('show');
    };
}

// ===== GEOASR DATA INTEGRATION GUIDE =====
/*
КАК ИНТЕГРИРОВАТЬ ДАННЫЕ ИЗ GEOASR.UZ:

1. ЧЕРЕЗ API (если есть):
   fetch('https://geoasr.uz/api/objects')
     .then(res => res.json())
     .then(data => {
       mockGeoasrData = data.objects;
       addGeoasrMarkers();
     });

2. ЧЕРЕЗ EXCEL ФАЙЛ (ваш метод):
   // Используйте библиотеку SheetJS (xlsx)
   // npm install xlsx
   
   import * as XLSX from 'xlsx';
   
   async function loadExcelData() {
     const response = await fetch('path/to/geoasr_data.xlsx');
     const buffer = await response.arrayBuffer();
     const workbook = XLSX.read(buffer, { type: 'array' });
     const sheet = workbook.Sheets[workbook.SheetNames[0]];
     const data = XLSX.utils.sheet_to_json(sheet);
     
     // Маппинг Excel колонок на наш формат:
     // _uid, project_id, object_type, name, lat, lon, 
     // region_id, region_name_uz, year, sector, status,
     // committed_uzs, spent_uzs
     
     return data.map(row => ({
       _uid: row._uid,
       object_type: mapObjectType(row.object_type), // suv -> water, etc.
       name: row.name,
       lat: parseFloat(row.lat),
       lon: parseFloat(row.lon),
       region_name_uz: row.region_name_uz,
       year: row.year,
       status: row.status,
       committed_uzs: row.committed_uzs
     }));
   }
   
   function mapObjectType(type) {
     const mapping = {
       'suv': 'water',
       'road': 'road', 
       'ssv': 'clinic', // sog'liqni saqlash vazirlik
       'maktab': 'school',
       'bogcha': 'kindergarten',
       'sport': 'sport'
     };
     return mapping[type] || type;
   }

3. ЧЕ
   РЕЗ GOOGLE SHEETS (ваша ссылка):
   const SHEET_ID = '1O8SuCBaipkIGzGci7umYYU4ODLbB3yXf';
   const API_KEY = 'YOUR_API_KEY';
   fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`)
     .then(res => res.json())
     .then(data => {
       const rows = data.values;
       const headers = rows[0];
       const objects = rows.slice(1).map(row => {
         const obj = {};
         headers.forEach((h, i) => obj[h] = row[i]);
         return obj;
       });
       // Use objects...
     });
*/
