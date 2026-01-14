// ===== INTERNATIONALIZATION (i18n) SYSTEM =====
// Поддержка: Узбекский (uz), Русский (ru), Английский (en)

const translations = {
    // ===== UZBEK (DEFAULT) =====
    uz: {
        // Common
        appName: "Sign",
        appSubtitle: "Fuqarolar portali",
        language: "Til",

        // Navigation
        nav: {
            home: "Bosh sahifa",
            reports: "Murojaatlar",
            analytics: "Tahlil",
            profile: "Profil",
            simple: "Oddiy",
            geek: "Tahlil"
        },

        // Gamification
        gamification: {
            level: "Daraja",
            points: "Ball",
            xp: "XP",
            streak: "kun",
            levelNames: {
                1: "Boshlang'ich",
                2: "Havaskor",
                3: "Faol Fuqaro",
                4: "Mutaxassis",
                5: "Ekspert"
            }
        },

        // Wizard Steps
        wizard: {
            step1: "Muammo",
            step2: "Joylashuv",
            step3: "Rasm",
            step4: "Kategoriya",

            // Step 1
            describeIssue: "Muammoni aytib bering",
            describeHint: "Gapiring yoki yozing - biz tushunib olamiz",
            pressAndSpeak: "Bosing va gapiring",
            or: "yoki",
            writeProblem: "Muammoni yozing... Masalan: Yo'lda katta chuqur bor",
            aiAnalyzed: "AI tahlil qildi:",
            confirm: "Ha, to'g'ri",
            nextStep: "Keyingi qadam",
            next: "Keyingi",
            next: "Keyingi",
            back: "Orqaga",
            edit: "✏️ Tahrirlash",
            retry: "🔄 Qayta yozish",

            // Step 2
            shareLocation: "Joylashuvni ulashing",
            locationHint: "Muammo qayerda ekanini bilishimiz kerak",
            shareLocationBtn: "Joylashuvni ulashish",
            detecting: "Aniqlanmoqda...",
            geoportalData: "Geoportal ma'lumotlari",
            detected: "Aniqlandi",
            autoCategory: "Kategoriya avtomatik tanlanadi:",
            noObjectFound: "Yaqin atrofda ro'yxatdagi obyekt topilmadi",
            selectManually: "Kategoriyani keyingi qadamda o'zingiz tanlaysiz",

            // Step 3
            takePhoto: "Rasmga oling",
            photoHint: "Muammoning rasmini yuboring",
            camera: "Rasmga olish",
            gallery: "Galereyadan",
            photoUploaded: "Rasm yuklandi",

            // Step 4
            selectCategory: "Kategoriyani tanlang",
            categoryHint: "Muammo qaysi soha bilan bog'liq?",
            submit: "Yuborish"
        },

        // Categories
        categories: {
            school: "Maktab",
            clinic: "Klinika",
            road: "Yo'l",
            water: "Suv",
            kindergarten: "Bog'cha",
            sport: "Sport"
        },

        // Status
        status: {
            resolved: "Hal qilindi",
            inProgress: "Jarayonda",
            pending: "Kutilmoqda",
            total: "Jami"
        },

        // Success
        success: {
            sent: "Murojaatingiz yuborildi!",
            reportNumber: "Murojaat raqami:",
            category: "Kategoriya:",
            estimatedResponse: "Taxminiy javob:",
            days: "kun",
            xpEarned: "XP olindi!",
            newReport: "Yangi murojaat"
        },

        // Reports
        reports: {
            myReports: "Mening murojaatlarim",
            count: "ta",
            viewOnMap: "Xaritada ko'rish"
        },

        // Leaderboard
        leaderboard: {
            title: "Reyting",
            topCitizens: "Top Fuqarolar",
            you: "Siz",
            yourAchievements: "Sizning yutuqlaringiz"
        },

        // Profile
        profile: {
            title: "Profil",
            name: "Ism",
            logout: "Chiqish"
        },

        // Analytics / Geek Mode
        analytics: {
            title: "Tahlil",
            filters: "Filtrlar",
            all: "Hammasi",
            region: "Hudud",
            allRegions: "Barcha hududlar",
            byCategory: "Kategoriya bo'yicha",
            heatmap: "Issiqlik xaritasi",
            showHeatmap: "Issiqlik xaritasini ko'rsatish",
            low: "Kam",
            medium: "O'rtacha",
            high: "Ko'p",
            monthlyTrend: "Oylik trend",
            totalReports: "Jami murojaatlar"
        },

        // Toast messages
        toast: {
            success: "Muvaffaqiyat!",
            error: "Xatolik!",
            locationReceived: "Joylashuv qabul qilindi",
            photoUploaded: "Rasm yuklandi",
            reportSent: "Murojaat yuborildi"
        },

        // Achievements
        achievements: {
            title: "Yangi yutuq!",
            firstReport: "Birinchi murojaat",
            photographer: "Fotograf",
            navigator: "Navigator",
            streak7: "7 kun streak",
            top10: "Top 10",
            reports100: "100 murojaat",
            continue: "Davom etish"
        },

        // Bot specific
        bot: {
            online: "bot • online",
            typeMessage: "Xabar yozing...",
            location: "Joylashuv",
            photo: "Rasm",
            category: "Kategoriya",
        },

        // Dashboard
        dashboard: {
            nav: {
                dashboard: "Dashboard",
                reports: "Murojaatlar",
                map: "Xarita",
                analytics: "Tahlil",
                users: "Foydalanuvchilar",
                settings: "Sozlamalar"
            },
            header: {
                searchPlaceholder: "Qidirish...",
                gov: "GOV"
            },
            time: {
                today: "Bugun",
                week: "Hafta",
                month: "Oy",
                year: "Yil"
            },
            stats: {
                total: "Jami murojaatlar",
                pending: "Kutilmoqda",
                inProgress: "Jarayonda",
                resolved: "Hal qilindi"
            },
            charts: {
                dynamics: "Murojaatlar dinamikasi",
                submitted: "Kelgan",
                resolved: "Hal qilindi",
                byCategory: "Kategoriya bo'yicha",
                total: "Jami"
            },
            table: {
                title: "So'nggi murojaatlar",
                viewAll: "Barchasini ko'rish",
                cols: {
                    id: "ID",
                    report: "Murojaat",
                    category: "Kategoriya",
                    address: "Manzil",
                    date: "Sana",
                    status: "Holat",
                    actions: "Amallar"
                }
            },
            export: "Export"
        }
    },

    // ===== RUSSIAN =====
    ru: {
        // Common
        appName: "Sign",
        appSubtitle: "Портал граждан",
        language: "Язык",

        // Navigation
        nav: {
            home: "Главная",
            reports: "Обращения",
            analytics: "Аналитика",
            profile: "Профиль",
            simple: "Простой",
            geek: "Аналитика"
        },

        // Gamification
        gamification: {
            level: "Уровень",
            points: "Баллы",
            xp: "XP",
            streak: "дней",
            levelNames: {
                1: "Новичок",
                2: "Любитель",
                3: "Активный гражданин",
                4: "Специалист",
                5: "Эксперт"
            }
        },

        // Wizard Steps
        wizard: {
            step1: "Проблема",
            step2: "Локация",
            step3: "Фото",
            step4: "Категория",

            describeIssue: "Опишите проблему",
            describeHint: "Говорите или пишите - мы поймём",
            pressAndSpeak: "Нажмите и говорите",
            or: "или",
            writeProblem: "Опишите проблему... Например: На дороге большая яма",
            aiAnalyzed: "AI проанализировал:",
            confirm: "Да, верно",
            nextStep: "Следующий шаг",
            next: "Далее",
            next: "Далее",
            back: "Назад",
            edit: "✏️ Редактировать",
            retry: "🔄 Переписать",

            shareLocation: "Поделитесь геолокацией",
            locationHint: "Нам нужно знать где находится проблема",
            shareLocationBtn: "Отправить геолокацию",
            detecting: "Определяем...",
            geoportalData: "Данные геопортала",
            detected: "Обнаружено",
            autoCategory: "Категория выбрана автоматически:",
            noObjectFound: "Объект из базы не найден поблизости",
            selectManually: "Выберите категорию на следующем шаге",

            takePhoto: "Сделайте фото",
            photoHint: "Отправьте фото проблемы",
            camera: "Камера",
            gallery: "Галерея",
            photoUploaded: "Фото загружено",

            selectCategory: "Выберите категорию",
            categoryHint: "К какой сфере относится проблема?",
            submit: "Отправить"
        },

        // Categories
        categories: {
            school: "Школа",
            clinic: "Клиника",
            road: "Дорога",
            water: "Вода",
            kindergarten: "Детсад",
            sport: "Спорт"
        },

        // Status
        status: {
            resolved: "Решено",
            inProgress: "В работе",
            pending: "Ожидает",
            total: "Всего"
        },

        // Success
        success: {
            sent: "Ваше обращение отправлено!",
            reportNumber: "Номер обращения:",
            category: "Категория:",
            estimatedResponse: "Примерный ответ:",
            days: "дней",
            xpEarned: "XP получено!",
            newReport: "Новое обращение"
        },

        // Reports
        reports: {
            myReports: "Мои обращения",
            count: "шт",
            viewOnMap: "Посмотреть на карте"
        },

        // Leaderboard
        leaderboard: {
            title: "Рейтинг",
            topCitizens: "Топ граждан",
            you: "Вы",
            yourAchievements: "Ваши достижения"
        },

        // Profile
        profile: {
            title: "Профиль",
            name: "Имя",
            logout: "Выйти"
        },

        // Analytics
        analytics: {
            title: "Аналитика",
            filters: "Фильтры",
            all: "Все",
            region: "Регион",
            allRegions: "Все регионы",
            byCategory: "По категориям",
            heatmap: "Тепловая карта",
            showHeatmap: "Показать тепловую карту",
            low: "Мало",
            medium: "Средне",
            high: "Много",
            monthlyTrend: "Месячный тренд",
            totalReports: "Всего обращений"
        },

        // Toast
        toast: {
            success: "Успешно!",
            error: "Ошибка!",
            locationReceived: "Геолокация получена",
            photoUploaded: "Фото загружено",
            reportSent: "Обращение отправлено"
        },

        // Achievements
        achievements: {
            title: "Новое достижение!",
            firstReport: "Первое обращение",
            photographer: "Фотограф",
            navigator: "Навигатор",
            streak7: "7 дней подряд",
            top10: "Топ 10",
            reports100: "100 обращений",
            continue: "Продолжить"
        },

        // Bot
        bot: {
            online: "бот • онлайн",
            typeMessage: "Введите сообщение...",
            location: "Локация",
            photo: "Фото",
            category: "Категория",
            status: "Статус"
        },

        // Dashboard
        dashboard: {
            nav: {
                dashboard: "Дашборд",
                reports: "Обращения",
                map: "Карта",
                analytics: "Аналитика",
                users: "Пользователи",
                settings: "Настройки"
            },
            header: {
                searchPlaceholder: "Поиск...",
                gov: "GOV"
            },
            time: {
                today: "Сегодня",
                week: "Неделя",
                month: "Месяц",
                year: "Год"
            },
            stats: {
                total: "Всего обращения",
                pending: "Ожидают",
                inProgress: "В процессе",
                resolved: "Решено"
            },
            charts: {
                dynamics: "Динамика обращений",
                submitted: "Поступило",
                resolved: "Решено",
                byCategory: "По категориям",
                total: "Всего"
            },
            table: {
                title: "Последние обращения",
                viewAll: "Смотреть все",
                cols: {
                    id: "ID",
                    report: "Обращение",
                    category: "Категория",
                    address: "Адрес",
                    date: "Дата",
                    status: "Статус",
                    actions: "Действия"
                }
            },
            export: "Экспорт"
        }
    },

    // ===== ENGLISH =====
    en: {
        // Common
        appName: "Sign",
        appSubtitle: "Citizens Portal",
        language: "Language",

        // Navigation
        nav: {
            home: "Home",
            reports: "Reports",
            analytics: "Analytics",
            profile: "Profile",
            simple: "Simple",
            geek: "Analytics"
        },

        // Gamification
        gamification: {
            level: "Level",
            points: "Points",
            xp: "XP",
            streak: "days",
            levelNames: {
                1: "Beginner",
                2: "Amateur",
                3: "Active Citizen",
                4: "Specialist",
                5: "Expert"
            }
        },

        // Wizard Steps
        wizard: {
            step1: "Issue",
            step2: "Location",
            step3: "Photo",
            step4: "Category",

            describeIssue: "Describe the issue",
            describeHint: "Speak or type - we'll understand",
            pressAndSpeak: "Press and speak",
            or: "or",
            writeProblem: "Describe the problem... Example: There's a big pothole on the road",
            aiAnalyzed: "AI analyzed:",
            confirm: "Yes, correct",
            nextStep: "Next step",
            next: "Next",
            next: "Next",
            back: "Back",
            edit: "✏️ Edit",
            retry: "🔄 Rewrite",

            shareLocation: "Share your location",
            locationHint: "We need to know where the problem is",
            shareLocationBtn: "Share location",
            detecting: "Detecting...",
            geoportalData: "Geoportal data",
            detected: "Detected",
            autoCategory: "Category selected automatically:",
            noObjectFound: "No registered object found nearby",
            selectManually: "Select category in the next step",

            takePhoto: "Take a photo",
            photoHint: "Send a photo of the problem",
            camera: "Camera",
            gallery: "Gallery",
            photoUploaded: "Photo uploaded",

            selectCategory: "Select category",
            categoryHint: "Which area is the problem related to?",
            submit: "Submit"
        },

        // Categories
        categories: {
            school: "School",
            clinic: "Clinic",
            road: "Road",
            water: "Water",
            kindergarten: "Kindergarten",
            sport: "Sport"
        },

        // Status
        status: {
            resolved: "Resolved",
            inProgress: "In Progress",
            pending: "Pending",
            total: "Total"
        },

        // Success
        success: {
            sent: "Your report has been sent!",
            reportNumber: "Report number:",
            category: "Category:",
            estimatedResponse: "Estimated response:",
            days: "days",
            xpEarned: "XP earned!",
            newReport: "New report"
        },

        // Reports
        reports: {
            myReports: "My Reports",
            count: "pcs",
            viewOnMap: "View on map"
        },

        // Leaderboard
        leaderboard: {
            title: "Leaderboard",
            topCitizens: "Top Citizens",
            you: "You",
            yourAchievements: "Your achievements"
        },

        // Profile
        profile: {
            title: "Profile",
            name: "Name",
            logout: "Logout"
        },

        // Analytics
        analytics: {
            title: "Analytics",
            filters: "Filters",
            all: "All",
            region: "Region",
            allRegions: "All regions",
            byCategory: "By category",
            heatmap: "Heatmap",
            showHeatmap: "Show heatmap",
            low: "Low",
            medium: "Medium",
            high: "High",
            monthlyTrend: "Monthly trend",
            totalReports: "Total reports"
        },

        // Toast
        toast: {
            success: "Success!",
            error: "Error!",
            locationReceived: "Location received",
            photoUploaded: "Photo uploaded",
            reportSent: "Report sent"
        },

        // Achievements
        achievements: {
            title: "New achievement!",
            firstReport: "First report",
            photographer: "Photographer",
            navigator: "Navigator",
            streak7: "7 day streak",
            top10: "Top 10",
            reports100: "100 reports",
            continue: "Continue"
        },

        // Bot
        bot: {
            online: "bot • online",
            typeMessage: "Type a message...",
            location: "Location",
            photo: "Photo",
            category: "Category",
            status: "Status"
        },

        // Dashboard
        dashboard: {
            nav: {
                dashboard: "Dashboard",
                reports: "Reports",
                map: "Map",
                analytics: "Analytics",
                users: "Users",
                settings: "Settings"
            },
            header: {
                searchPlaceholder: "Search...",
                gov: "GOV"
            },
            time: {
                today: "Today",
                week: "Week",
                month: "Month",
                year: "Year"
            },
            stats: {
                total: "Total reports",
                pending: "Pending",
                inProgress: "In progress",
                resolved: "Resolved"
            },
            charts: {
                dynamics: "Reports dynamics",
                submitted: "Submitted",
                resolved: "Resolved",
                byCategory: "By category",
                total: "Total"
            },
            table: {
                title: "Recent reports",
                viewAll: "View all",
                cols: {
                    id: "ID",
                    report: "Report",
                    category: "Category",
                    address: "Address",
                    date: "Date",
                    status: "Status",
                    actions: "Actions"
                }
            },
            export: "Export"
        }
    }
};

// ===== I18N CLASS =====
class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('lang') || 'uz';
        this.listeners = [];
    }

    // Get current language
    getLang() {
        return this.currentLang;
    }

    // Set language
    setLang(lang) {
        if (translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('lang', lang);
            this.notifyListeners();
            this.updateDOM();
        }
    }

    // Get translation by key path (e.g., "nav.home")
    t(keyPath) {
        const keys = keyPath.split('.');
        let value = translations[this.currentLang];

        for (const key of keys) {
            if (value && value[key] !== undefined) {
                value = value[key];
            } else {
                // Fallback to Uzbek
                value = translations['uz'];
                for (const k of keys) {
                    if (value && value[k] !== undefined) {
                        value = value[k];
                    } else {
                        return keyPath; // Return key if not found
                    }
                }
                break;
            }
        }

        return value;
    }

    // Add listener for language changes
    onLanguageChange(callback) {
        this.listeners.push(callback);
    }

    // Notify all listeners
    notifyListeners() {
        this.listeners.forEach(cb => cb(this.currentLang));
    }

    // Update all DOM elements with data-i18n attribute
    updateDOM() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);

            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.textContent = translation;
            }
        });

        // Update data-i18n-placeholder for inputs
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });
    }

    // Create language switcher HTML
    createSwitcher(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="lang-switcher">
                <button class="lang-btn ${this.currentLang === 'uz' ? 'active' : ''}" data-lang="uz">UZ</button>
                <button class="lang-btn ${this.currentLang === 'ru' ? 'active' : ''}" data-lang="ru">RU</button>
                <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
            </div>
        `;

        container.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setLang(btn.dataset.lang);
                container.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
}

// Global instance
// Global instance
window.i18n = new I18n();
// Make translations available globally if needed
window.translations = translations;

// Add missing bot messages here to avoid wiping class
translations.uz.bot.messages = {
    locationReceived: "✅ Joylashuvingiz qabul qilindi! Endi muammoning rasmini yuboring 📸",
    pleaseShareLocation: "⚠️ Iltimos, avval joylashuvingizni ulashing!",
    sendingPhoto: "📷 Rasm yubormoqchiman",
    photoSent: "Muammo rasmi yuborildi",
    photoReceived: "📸 Rasm qabul qilindi! Endi kategoriyani tanlang 👇",
    categorySelected: "kategoriyasi tanlandi",
    categoryAccepted: "kategoriyasi qabul qilindi!",
    needLocationAndPhoto: "Murojaat yuborish uchun joylashuv va rasmni ham yuboring.",
    reportSuccess: "🎉 Murojaatingiz muvaffaqiyatli yuborildi!",
    reportInfo: "📋 Murojaat raqami: #",
    region: "📍 Hudud: Buxoro",
    estimate: "⏱️ Taxminiy ko'rib chiqish: 3-5 kun",
    useButtons: "Yana murojaat yubormoqchi bo'lsangiz, quyidagi tugmalardan foydalaning 👇",
    msgReceived: "Xabaringiz qabul qilindi! Muammo xabar qilish uchun quyidagi tugmalardan foydalaning 👇",
    recording: "🎤 Ovozli xabar yozilmoqda... Gapirib boring!",
    voiceMsg: "🎤 Ovozli xabar (0:05)",
    aiCheck: "🤖 AI xabaringizni tahlil qildi:\n\n\"Mahallada yo'l chuqurlari bor, mashinalar o'ta olmayapti.\"\n\nBu to'g'rimi?",
    sharingLocation: "📍 Joylashuvimni ulashmoqchiman",
    locationShared: "Joylashuv ulashildi"
};

translations.ru.bot.messages = {
    locationReceived: "✅ Геолокация получена! Теперь отправьте фото проблемы 📸",
    pleaseShareLocation: "⚠️ Пожалуйста, сначала отправьте геолокацию!",
    sendingPhoto: "📷 Хочу отправить фото",
    photoSent: "Фото проблемы отправлено",
    photoReceived: "📸 Фото получено! Теперь выберите категорию 👇",
    categorySelected: "категория выбрана",
    categoryAccepted: "категория принята!",
    needLocationAndPhoto: "Для отправки обращения нужны геолокация и фото.",
    reportSuccess: "🎉 Ваше обращение успешно отправлено!",
    reportInfo: "📋 Номер обращения: #",
    region: "📍 Регион: Бухара",
    estimate: "⏱️ Примерное время рассмотрения: 3-5 дней",
    useButtons: "Если хотите отправить еще обращение, используйте кнопки ниже 👇",
    msgReceived: "Сообщение получено! Используйте кнопки ниже для отправки проблемы 👇",
    recording: "🎤 Запись голосового сообщения... Говорите!",
    voiceMsg: "🎤 Голосовое сообщение (0:05)",
    aiCheck: "🤖 AI проанализировал ваше сообщение:\n\n\"На дороге ямы, машины не могут проехать.\"\n\nЭто верно?",
    sharingLocation: "📍 Хочу поделиться геолокацией",
    locationShared: "Геолокация отправлена"
};

translations.en.bot.messages = {
    locationReceived: "✅ Location received! Now please send a photo of the issue 📸",
    pleaseShareLocation: "⚠️ Please share your location first!",
    sendingPhoto: "📷 I want to send a photo",
    photoSent: "Issue photo sent",
    photoReceived: "📸 Photo received! Now select a category 👇",
    categorySelected: "category selected",
    categoryAccepted: "category accepted!",
    needLocationAndPhoto: "We need location and photo to submit a report.",
    reportSuccess: "🎉 Your report has been successfully submitted!",
    reportInfo: "📋 Report number: #",
    region: "📍 Region: Bukhara",
    estimate: "⏱️ Estimated review: 3-5 days",
    useButtons: "To send another report, use the buttons below 👇",
    msgReceived: "Message received! Use buttons below to report an issue 👇",
    recording: "🎤 Recording voice message... Please speak!",
    voiceMsg: "🎤 Voice message (0:05)",
    aiCheck: "🤖 AI analyzed your message:\n\n\"There are potholes on the road, cars cannot pass.\"\n\nIs this correct?",
    sharingLocation: "📍 I want to share my location",
    locationShared: "Location shared"
};

// Export for modules (if using ES modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { i18n, translations };
}
