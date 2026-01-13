// ===== State Management =====
// ===== State Management =====
const state = {
    userPoints: 1250,
    userXP: 650,
    maxXP: 1000,
    userLevel: 3,
    levelTitle: 'Faol Fuqaro',
    selectedCategory: null,
    locationShared: false,
    photoTaken: false,
    geoportalLoaded: false
};

// ===== GEOPORTAL DATA =====
let geoportalData = [];

// ===== LOAD CSV FROM FILE =====
async function loadGeoportalCSV() {
    try {
        const response = await fetch('geoportal_data.csv');
        const csvText = await response.text();

        // Parse CSV
        const lines = csvText.split('\n');
        // line 2 is headers

        // Mapping types (CSV -> our format)
        const typeMapping = {
            'suv': 'water',
            'road': 'road',
            'ssv': 'clinic',
            'maktab': 'school',
            'bogcha': 'kindergarten',
            'sport': 'sport'
        };

        geoportalData = [];
        // Start from line 3 (index 2)
        for (let i = 2; i < lines.length && geoportalData.length < 500; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = parseCSVLine(line);
            if (values.length < 14) continue;

            const uid = parseInt(values[0]) || i;
            const objectType = typeMapping[values[3]] || values[3];
            const name = values[4] || `Obyekt #${uid}`;

            const lat = parseEuropeanNumber(values[5]);
            const lon = parseEuropeanNumber(values[6]);

            if (!lat || !lon || isNaN(lat) || isNaN(lon)) continue;

            geoportalData.push({
                _uid: uid,
                object_type: objectType,
                name: name,
                lat: lat,
                lon: lon,
                distance: 0 // Will be calculated later
            });
        }
        console.log(`Geoportal: Loaded ${geoportalData.length} objects`);
        state.geoportalLoaded = true;
    } catch (error) {
        console.error('Geoportal CSV load error:', error);
        // Fallback data
        geoportalData = [
            { object_type: 'school', name: 'Maktab №45', lat: 40.2976, lon: 64.4058 },
            { object_type: 'road', name: 'Olmazor ko\'chasi', lat: 40.2974, lon: 64.4052 }, // Near the school
            { object_type: 'clinic', name: 'Markaziy poliklinika', lat: 40.2093, lon: 64.3536 }
        ];
        state.geoportalLoaded = true;
    }
}

function parseEuropeanNumber(str) {
    if (!str) return null;
    const clean = str.replace(/"/g, '').trim().replace(',', '.');
    return parseFloat(clean);
}

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

// ===== HAVERSINE FORMULA =====
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function findNearestGeoportalObject(userLat, userLon, maxDistance = 100) {
    let nearest = null;
    let minDistance = Infinity;

    geoportalData.forEach(obj => {
        const distance = calculateDistance(userLat, userLon, obj.lat, obj.lon);
        if (distance < minDistance && distance <= maxDistance) {
            minDistance = distance;
            nearest = { ...obj, distance: Math.round(distance) };
        }
    });

    return nearest;
}

// ===== DOM Elements =====
const chatContainer = document.getElementById('chat-container');
const categoryModal = document.getElementById('category-modal');
const statusModal = document.getElementById('status-modal');
const achievementToast = document.getElementById('achievement-toast');
const messageInput = document.getElementById('message-input');
const voiceBtn = document.getElementById('voice-btn');

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 1000);
    initializeChat();
    setupEventListeners();
    initI18n();
    loadGeoportalCSV();
});

// ===== i18n Initialization =====
function initI18n() {
    // Language switcher for bot
    const langSwitcher = document.getElementById('bot-lang-switcher');
    if (langSwitcher) {
        langSwitcher.querySelectorAll('.lang-btn-mini').forEach(btn => {
            // Set active based on current language
            if (btn.dataset.lang === i18n.getLang()) {
                langSwitcher.querySelectorAll('.lang-btn-mini').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }

            btn.addEventListener('click', () => {
                i18n.setLang(btn.dataset.lang);
                langSwitcher.querySelectorAll('.lang-btn-mini').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Clear chat and re-initialize with new language
                chatContainer.innerHTML = '';
                initializeChat();
            });
        });
    }

    // Update DOM with current language
    if (typeof i18n !== 'undefined') {
        i18n.updateDOM();
    }
}

function updateTime() {
    const now = new Date();
    document.getElementById('current-time').textContent =
        now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
}

function initializeChat() {
    // Get localized greeting messages
    const greetings = {
        uz: { welcome: "Assalomu alaykum! 👋 Men Real Holat botiman.", help: "Men sizga ijtimoiy infratuzilma muammolarini xabar qilishda yordam beraman. Quyidagi tugmalardan birini tanlang:" },
        ru: { welcome: "Здравствуйте! 👋 Я бот Real Holat.", help: "Я помогу вам сообщить о проблемах социальной инфраструктуры. Выберите одну из кнопок ниже:" },
        en: { welcome: "Hello! 👋 I'm Real Holat bot.", help: "I'll help you report social infrastructure issues. Choose one of the buttons below:" }
    };
    const lang = typeof i18n !== 'undefined' ? i18n.getLang() : 'uz';
    const msg = greetings[lang] || greetings.uz;

    addBotMessage(msg.welcome);
    setTimeout(() => {
        addBotMessage(msg.help);
    }, 800);
}

function setupEventListeners() {
    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', () => handleQuickAction(btn.dataset.action));
    });

    // Category selection
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => selectCategory(item.dataset.category));
    });

    // Close modals
    document.getElementById('close-category').addEventListener('click', () => {
        categoryModal.classList.remove('active');
    });
    document.getElementById('close-status').addEventListener('click', () => {
        statusModal.classList.remove('active');
    });

    // Send message
    document.getElementById('send-btn').addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Voice button
    voiceBtn.addEventListener('click', toggleVoiceRecording);

    // Modal backdrop click
    categoryModal.addEventListener('click', (e) => {
        if (e.target === categoryModal) categoryModal.classList.remove('active');
    });
    statusModal.addEventListener('click', (e) => {
        if (e.target === statusModal) statusModal.classList.remove('active');
    });

    // Attach button
    const attachBtn = document.getElementById('attach-btn');
    const fileInput = document.getElementById('photo-upload');

    if (attachBtn && fileInput) {
        attachBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                takePhoto(); // Reuse logic
            }
        });
    }
}

// ===== Quick Actions =====
function handleQuickAction(action) {
    switch (action) {
        case 'report':
            // Start new report - show category modal
            categoryModal.classList.add('active');
            break;
        case 'location':
            shareLocation();
            break;
        case 'photo':
            takePhoto();
            break;
        case 'category':
            categoryModal.classList.add('active');
            break;
        case 'status':
            statusModal.classList.add('active');
            break;
    }
}

function shareLocation() {
    addUserMessage("📍 " + i18n.t('bot.messages.sharingLocation'));

    showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();

        // Simulate location near a data point (or random)
        // Point #1 in CSV: 40.29767385, 64.40581629 (Suv)
        const userLat = 40.29767385 + (Math.random() * 0.0004 - 0.0002);
        const userLon = 64.40581629 + (Math.random() * 0.0004 - 0.0002);

        // Add location message
        const t = (k) => i18n.t(k);
        const locationHTML = `
            <div class="location-message">
                <div class="location-preview">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="location-info">
                    <strong>${t('bot.messages.locationShared')}</strong>
                    <div class="location-coords">${userLat.toFixed(4)}, ${userLon.toFixed(4)} (Buxoro)</div>
                </div>
            </div>
        `;
        chatContainer.insertAdjacentHTML('beforeend', locationHTML);
        scrollToBottom();

        state.locationShared = true;
        addXP(30);

        // Check Geoportal
        const nearest = findNearestGeoportalObject(userLat, userLon);

        setTimeout(() => {
            if (nearest) {
                const typeInfo = {
                    school: { icon: '🏫', name: 'Maktab' },
                    clinic: { icon: '🏥', name: 'Klinika' },
                    road: { icon: '🛣️', name: 'Yo\'l' },
                    water: { icon: '💧', name: 'Suv' },
                    kindergarten: { icon: '👶', name: 'Bog\'cha' },
                    sport: { icon: '⚽', name: 'Sport' }
                };
                const info = typeInfo[nearest.object_type] || { icon: '📍', name: 'Obyekt' };

                addBotMessage(`✅ Geoportal: <b>${nearest.name}</b> aniqlandi!\nMasofa: ~${nearest.distance} metr.\n\nKategoriya avtomatik tanlandi: ${info.name} ${info.icon}`);

                // Auto-select category logic (optional, but good for UX)
                // We'll just suggest it for now or we could enable state.selectedCategory
                state.selectedCategory = nearest.object_type;

                // Add quick action to confirm
                addQuickReplies([`Tasdiqlash: ${info.name}`, 'Boshqa tanlash']);
            } else {
                addBotMessage(i18n.t('bot.messages.locationReceived') + "\n(Yaqin atrofda Geoportal obyektlari topilmadi)");
            }
        }, 800);
    }, 1500);
}

function takePhoto() {
    if (!state.locationShared) {
        addBotMessage(i18n.t('bot.messages.pleaseShareLocation'));
        return;
    }

    addUserMessage("📷 " + i18n.t('bot.messages.sendingPhoto'));

    showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();

        const photoHTML = `
            <div class="photo-message">
                <div class="photo-preview">
                    <i class="fas fa-image"></i>
                </div>
                <div class="photo-caption">${i18n.t('bot.messages.photoSent')}</div>
            </div>
        `;
        chatContainer.insertAdjacentHTML('beforeend', photoHTML);
        scrollToBottom();

        state.photoTaken = true;
        addXP(20);

        setTimeout(() => {
            addBotMessage(i18n.t('bot.messages.photoReceived'));
            categoryModal.classList.add('active');
        }, 500);
    }, 2000);
}

function selectCategory(category) {
    const categories = {
        school: { name: "Maktab", icon: "🏫", xp: 50 },
        clinic: { name: "Klinika", icon: "🏥", xp: 50 },
        road: { name: "Yo'l", icon: "🛣️", xp: 40 },
        water: { name: "Suv", icon: "💧", xp: 40 },
        kindergarten: { name: "Bog'cha", icon: "👶", xp: 50 },
        sport: { name: "Sport", icon: "⚽", xp: 45 }
    };

    const cat = categories[category];
    state.selectedCategory = category;
    categoryModal.classList.remove('active');

    addUserMessage(`${cat.icon} ${cat.name} kategoriyasi tanlandi`);

    showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();
        addXP(cat.xp);

        addBotMessage(`✅ ${cat.name} ${i18n.t('bot.messages.categoryAccepted')}`);

        setTimeout(() => {
            if (state.locationShared && state.photoTaken) {
                completeReport(cat);
            } else {
                addBotMessage(i18n.t('bot.messages.needLocationAndPhoto'));
            }
        }, 800);
    }, 1000);
}

function completeReport(category) {
    showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();

        const t = (k) => i18n.t(k);
        const reportNum = Math.floor(Math.random() * 9000) + 1000;

        addBotMessage(`${t('bot.messages.reportSuccess')}\n\n${t('bot.messages.reportInfo')}${reportNum}\n${t('bot.messages.region')}\n🏷️ ${t('bot.category')}: ${category.name}\n${t('bot.messages.estimate')}`);

        // Show achievement
        showAchievement(t('achievements.firstReport'), 100);

        // Reset state for next report
        setTimeout(() => {
            state.locationShared = false;
            state.photoTaken = false;
            state.selectedCategory = null;

            addBotMessage(t('bot.messages.useButtons'));
        }, 2000);
    }, 1500);
}

// ===== Message Functions =====
function addBotMessage(text) {
    const time = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    const messageHTML = `
        <div class="message bot">
            ${text.replace(/\n/g, '<br>')}
            <div class="message-time">${time}</div>
        </div>
    `;
    chatContainer.insertAdjacentHTML('beforeend', messageHTML);
    scrollToBottom();
}

function addUserMessage(text) {
    const time = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    const messageHTML = `
        <div class="message user">
            ${text}
            <div class="message-time">${time} ✓✓</div>
        </div>
    `;
    chatContainer.insertAdjacentHTML('beforeend', messageHTML);
    scrollToBottom();
}

function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    addUserMessage(text);
    messageInput.value = '';

    // Bot response
    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        addBotMessage(i18n.t('bot.messages.msgReceived'));
    }, 1500);
}

function showTypingIndicator() {
    const typingHTML = `
        <div class="typing-indicator" id="typing">
            <span></span><span></span><span></span>
        </div>
    `;
    chatContainer.insertAdjacentHTML('beforeend', typingHTML);
    scrollToBottom();
}

function removeTypingIndicator() {
    const typing = document.getElementById('typing');
    if (typing) typing.remove();
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ===== Gamification =====
function addXP(amount) {
    state.userXP += amount;
    state.userPoints += amount;

    // Show XP reward
    const xpHTML = `
        <div class="xp-reward">
            <i class="fas fa-star"></i>
            <span>+${amount} XP</span>
        </div>
    `;
    chatContainer.insertAdjacentHTML('beforeend', xpHTML);
    scrollToBottom();

    // Level up check
    if (state.userXP >= state.maxXP) {
        levelUp();
    }

    updateGamificationUI();
}

function levelUp() {
    state.userLevel++;
    state.userXP = state.userXP - state.maxXP;
    state.maxXP = Math.floor(state.maxXP * 1.5);

    const levels = {
        1: "Yangi Foydalanuvchi",
        2: "Faol Ishtirokchi",
        3: "Faol Fuqaro",
        4: "Mahalla Yulduz",
        5: "Hudud Qahramoni",
        6: "Milliy Faol"
    };

    state.levelTitle = levels[state.userLevel] || `Daraja ${state.userLevel}`;

    showAchievement(`Daraja ${state.userLevel}: ${state.levelTitle}`, 200);
}

function updateGamificationUI() {
    const levelEl = document.getElementById('user-level');
    const titleEl = document.getElementById('level-title');
    const xpEl = document.getElementById('current-xp');
    const pointsEl = document.getElementById('user-points');
    const xpFillEl = document.getElementById('xp-fill');

    if (levelEl) levelEl.textContent = state.userLevel;
    if (titleEl) titleEl.textContent = state.levelTitle;
    if (xpEl) xpEl.textContent = state.userXP;
    if (pointsEl) pointsEl.textContent = state.userPoints.toLocaleString();

    if (xpFillEl) {
        const xpPercent = (state.userXP / state.maxXP) * 100;
        xpFillEl.style.width = `${xpPercent}%`;
    }
}

function showAchievement(name, xp) {
    document.getElementById('achievement-name').textContent = name;
    achievementToast.querySelector('.achievement-xp').textContent = `+${xp} XP`;
    achievementToast.classList.add('show');

    state.userXP += xp;
    state.userPoints += xp;
    updateGamificationUI();

    setTimeout(() => {
        achievementToast.classList.remove('show');
    }, 3000);
}

// ===== Voice Recording =====
let isRecording = false;

function toggleVoiceRecording() {
    isRecording = !isRecording;

    if (isRecording) {
        voiceBtn.classList.add('recording');
        addBotMessage(i18n.t('bot.messages.recording'));

        // Simulate recording
        setTimeout(() => {
            if (isRecording) {
                voiceBtn.classList.remove('recording');
                isRecording = false;

                addUserMessage(i18n.t('bot.messages.voiceMsg'));

                showTypingIndicator();
                setTimeout(() => {
                    removeTypingIndicator();
                    addBotMessage(i18n.t('bot.messages.aiCheck'));

                    // Quick reply buttons
                    addQuickReplies([
                        i18n.t('wizard.confirm'),
                        i18n.t('wizard.edit'),
                        i18n.t('wizard.retry')
                    ]);
                }, 2000);
            }
        }, 5000);
    } else {
        voiceBtn.classList.remove('recording');
    }
}

function addQuickReplies(replies) {
    const repliesHTML = `
        <div class="quick-replies" style="display: flex; gap: 8px; flex-wrap: wrap; align-self: flex-start; margin-top: 8px;">
            ${replies.map(r => `
                <button class="quick-reply-btn" onclick="handleQuickReply('${r}')" 
                    style="background: rgba(94,181,247,0.2); border: 1px solid var(--telegram-blue); 
                    border-radius: 16px; padding: 8px 14px; color: var(--telegram-blue); 
                    cursor: pointer; font-size: 12px;">
                    ${r}
                </button>
            `).join('')}
        </div>
    `;
    chatContainer.insertAdjacentHTML('beforeend', repliesHTML);
    scrollToBottom();
}

function handleQuickReply(reply) {
    // Remove quick replies
    document.querySelector('.quick-replies')?.remove();

    addUserMessage(reply);

    if (reply.includes('Ha')) {
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            addBotMessage("Ajoyib! Endi kategoriyani tanlang 👇");
            categoryModal.classList.add('active');
        }, 1000);
    }
}

// Make function global
window.handleQuickReply = handleQuickReply;
