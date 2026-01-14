// ===== Mock Data =====
const mockReports = [
    { id: 1234, title: 'Yo\'l chuqurlari', category: 'road', address: 'Olmazor ko\'chasi, 45', coords: '40.2976, 64.4058', date: '12-yan 2026, 14:32', user: 'Aziz K.', level: 3, status: 'pending', description: 'Yo\'lda katta chuqur bor, mashinalar o\'ta olmayapti.' },
    { id: 1235, title: 'Suv ta\'minoti muammosi', category: 'water', address: 'Navoi ko\'chasi, 12', coords: '40.3102, 64.3845', date: '12-yan 2026, 11:15', user: 'Nilufar M.', level: 5, status: 'progress', description: 'Uch kundan beri suv yo\'q.' },
    { id: 1236, title: 'Maktab ta\'miri', category: 'school', address: 'Talaba ko\'chasi, 8', coords: '40.3521, 64.4892', date: '11-yan 2026, 16:45', user: 'Sardor T.', level: 4, status: 'resolved', description: 'Maktab derazalari singan.' },
    { id: 1237, title: 'Poliklinika jihozlari', category: 'clinic', address: 'Sog\'lom ko\'chasi, 3', coords: '40.2093, 64.3536', date: '11-yan 2026, 09:20', user: 'Zarina K.', level: 2, status: 'pending', description: 'Poliklinikada jihoz yetishmaydi.' },
    { id: 1238, title: 'Ko\'cha yoritish', category: 'road', address: 'Mustaqillik shoh ko\'chasi', coords: '40.2845, 64.4123', date: '10-yan 2026, 18:00', user: 'Bobur A.', level: 6, status: 'progress', description: 'Ko\'cha chiroqlari ishlamayapti.' },
    { id: 1239, title: 'Kanalizatsiya tiqildi', category: 'water', address: 'Bog\'iston ko\'chasi, 22', coords: '40.2654, 64.4567', date: '10-yan 2026, 14:10', user: 'Gulnora S.', level: 3, status: 'resolved', description: 'Kanalizatsiya tiqilib qoldi.' }
];

// ===== State =====
// ===== State =====
let currentReportId = null;
let dashboardMap = null; // Map instance

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderDashboardTable();
    renderReportsGrid();
    initModal();
    initDateFilters();
    initModal();
    initDateFilters();
    initDashI18n(); // Инициализация i18n Dashboard

    // Refresh map if we start on map page (unlikely but safe)
    if (document.getElementById('page-map').classList.contains('active')) {
        initDashboardMap();
    }
});

// ===== i18n Initialization Dashboard =====
function initDashI18n() {
    const langSwitcher = document.querySelector('.lang-switcher-dashboard');
    if (langSwitcher && typeof i18n !== 'undefined') {
        const switcherBtns = langSwitcher.querySelectorAll('.lang-btn-dash');

        // Helper to update active button UI
        const updateActiveBtn = (lang) => {
            switcherBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });
        };

        // Set initial active button
        updateActiveBtn(i18n.getLang());

        switcherBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                i18n.setLang(lang);
                updateActiveBtn(lang);
            });
        });

        // Trigger initial DOM update
        i18n.updateDOM();
    }
}

// ===== Navigation =====
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            switchPage(page);
        });
    });

    // Mobile menu toggle
    document.getElementById('menu-toggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });
}

function switchPage(page) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });

    // Update pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.toggle('active', p.id === `page-${page}`);
    });

    // Initialize/Refresh Map if switching to map page
    if (page === 'map') {
        setTimeout(() => {
            initDashboardMap();
            if (dashboardMap) {
                dashboardMap.invalidateSize();
            }
        }, 100);
    }
}

// ===== Map Initialization =====
function initDashboardMap() {
    if (dashboardMap) return; // Already initialized

    const mapContainer = document.getElementById('dashboard-map');
    if (!mapContainer) return;

    // Uzb coordinates
    dashboardMap = L.map('dashboard-map').setView([41.2995, 69.2401], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(dashboardMap);

    // Add markers from mockReports
    mockReports.forEach(report => {
        if (report.coords) {
            const [lat, lng] = report.coords.split(',').map(c => parseFloat(c.trim()));
            if (!isNaN(lat) && !isNaN(lng)) {
                const marker = L.marker([lat, lng]).addTo(dashboardMap);
                marker.bindPopup(`
                    <b>#${report.id} - ${report.title}</b><br>
                    ${report.category} | ${report.status}<br>
                    ${report.address}
                `);
            }
        }
    });
}

// ===== Date Filters =====
function initDateFilters() {
    document.querySelectorAll('.date-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showToast(i18n.t('toast.success'));
        });
    });
}

// ===== Dashboard Table =====
function renderDashboardTable() {
    const tbody = document.getElementById('reports-table');
    tbody.innerHTML = mockReports.slice(0, 5).map(report => `
        <tr>
            <td class="table-id">#${report.id}</td>
            <td>${report.title}</td>
            <td><span class="category-badge ${report.category}"><i class="fas fa-${getCategoryIcon(report.category)}"></i> ${getCategoryName(report.category)}</span></td>
            <td>${report.address}</td>
            <td>${report.date.split(',')[0]}</td>
            <td><span class="status-badge ${report.status}">${getStatusName(report.status)}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view" onclick="openReportModal(${report.id})"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit" onclick="openReportModal(${report.id})"><i class="fas fa-edit"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ===== Reports Grid =====
function renderReportsGrid() {
    const grid = document.getElementById('reports-grid');
    grid.innerHTML = mockReports.map(report => `
        <div class="report-card" onclick="openReportModal(${report.id})">
            <div class="report-photo">
                <i class="fas fa-${getCategoryIcon(report.category)}"></i>
            </div>
            <div class="report-content">
                <div class="report-title">${report.title}</div>
                <div class="report-address"><i class="fas fa-map-marker-alt"></i> ${report.address}</div>
                <div class="report-meta">
                    <span class="report-date">${report.date.split(',')[0]}</span>
                    <span class="status-badge ${report.status}">${getStatusName(report.status)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== Modal =====
function initModal() {
    document.getElementById('modal-close').addEventListener('click', closeModal);

    document.getElementById('report-modal').addEventListener('click', (e) => {
        if (e.target.id === 'report-modal') closeModal();
    });

    // Status buttons
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const newStatus = btn.dataset.status;
            updateReportStatus(currentReportId, newStatus);
        });
    });

    // Send response
    document.getElementById('send-response').addEventListener('click', sendResponse);
}

function openReportModal(id) {
    currentReportId = id;
    const report = mockReports.find(r => r.id === id);

    if (!report) return;

    document.getElementById('modal-id').textContent = report.id;
    document.getElementById('modal-category').textContent = getCategoryName(report.category);
    document.getElementById('modal-category').className = `category-badge ${report.category}`;
    document.getElementById('modal-address').textContent = report.address;
    document.getElementById('modal-coords').textContent = report.coords;
    document.getElementById('modal-date').textContent = report.date;
    document.getElementById('modal-user').textContent = `${report.user} (Level ${report.level})`;
    document.getElementById('modal-description').textContent = report.description;

    // Highlight current status
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.status === report.status);
    });

    document.getElementById('report-modal').classList.add('show');
}

function closeModal() {
    document.getElementById('report-modal').classList.remove('show');
    document.getElementById('response-text').value = '';
}

function updateReportStatus(id, status) {
    const report = mockReports.find(r => r.id === id);
    if (report) {
        report.status = status;
        renderDashboardTable();
        renderReportsGrid();
        showToast(i18n.t('toast.success'));
        closeModal();
    }
}

function sendResponse() {
    const response = document.getElementById('response-text').value.trim();

    if (!response) {
        showToast('Iltimos, javob matnini kiriting');
        return;
    }

    showToast(i18n.t('toast.success'));
    closeModal();
}

// ===== Helpers =====
function getCategoryIcon(category) {
    const icons = {
        road: 'road',
        water: 'faucet',
        school: 'school',
        clinic: 'hospital',
        sport: 'futbol',
        kindergarten: 'child'
    };
    return icons[category] || 'folder';
}

function getCategoryName(category) {
    if (typeof i18n !== 'undefined') {
        return i18n.t(`categories.${category}`);
    }
    const names = {
        road: "Yo'l",
        water: "Suv",
        school: "Maktab",
        clinic: "Klinika",
        sport: "Sport",
        kindergarten: "Bog'cha"
    };
    return names[category] || category;
}

function getStatusName(status) {
    if (typeof i18n !== 'undefined') {
        return i18n.t(`status.${status}`);
    }
    const names = {
        pending: "Kutilmoqda",
        progress: "Jarayonda",
        resolved: "Hal qilindi"
    };
    return names[status] || status;
}

function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = message;
    toast.classList.add('show');

    setTimeout(() => toast.classList.remove('show'), 3000);
}
