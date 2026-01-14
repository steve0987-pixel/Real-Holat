// ===== SHARED UTILITIES =====
// Common functions used across app.js and pwa-app.js

// ===== CSV PARSING =====

/**
 * Parse a CSV line with proper quote handling
 * @param {string} line - CSV line to parse
 * @returns {string[]} Array of values
 */
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

/**
 * Parse European number format (40,29767385 → 40.29767385)
 * @param {string} str - Number string with comma decimal separator
 * @returns {number|null} Parsed float or null
 */
function parseEuropeanNumber(str) {
    if (!str) return null;
    const clean = str.replace(/"/g, '').trim().replace(',', '.');
    return parseFloat(clean);
}

// ===== GEOLOCATION UTILITIES =====

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in meters
 */
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

    return R * c;
}

/**
 * Find nearest object from geoportal data
 * @param {Array} geoportalData - Array of geoportal objects
 * @param {number} userLat - User latitude
 * @param {number} userLon - User longitude
 * @param {number} maxDistance - Maximum search radius in meters (default: 100)
 * @returns {Object|null} Nearest object with distance property or null
 */
function findNearestGeoportalObject(geoportalData, userLat, userLon, maxDistance = 100) {
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

// ===== GEOPORTAL DATA LOADING =====

// Type mapping from CSV format to internal format
const GEOPORTAL_TYPE_MAPPING = {
    'suv': 'water',
    'road': 'road',
    'ssv': 'clinic',
    'maktab': 'school',
    'bogcha': 'kindergarten',
    'sport': 'sport'
};

/**
 * Load and parse Geoportal CSV data
 * @param {string} csvPath - Path to CSV file
 * @param {number} limit - Maximum number of records to load (default: 500)
 * @returns {Promise<Array>} Array of geoportal objects
 */
async function loadGeoportalCSV(csvPath = 'data/geoportal_data.csv', limit = 500) {
    try {
        const response = await fetch(csvPath);
        const csvText = await response.text();

        const lines = csvText.split('\n');
        const data = [];

        // Parse CSV starting from line 3 (index 2)
        for (let i = 2; i < lines.length && data.length < limit; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = parseCSVLine(line);
            if (values.length < 14) continue;

            const uid = parseInt(values[0]) || i;
            const objectType = GEOPORTAL_TYPE_MAPPING[values[3]] || values[3];
            const name = values[4] || `Obyekt #${uid}`;

            const lat = parseEuropeanNumber(values[5]);
            const lon = parseEuropeanNumber(values[6]);

            if (!lat || !lon || isNaN(lat) || isNaN(lon)) continue;

            data.push({
                _uid: uid,
                object_type: objectType,
                name: name,
                lat: lat,
                lon: lon,
                region_id: parseInt(values[7]) || 1706,
                region_name_uz: values[8] || 'Buxoro',
                year: parseInt(values[9]) || 2024,
                sector: values[10] || '',
                status: values[13] || 'Tender',
                distance: 0
            });
        }

        console.log(`Geoportal: Loaded ${data.length} objects from CSV`);
        return data;
    } catch (error) {
        console.error('Geoportal CSV load error:', error);
        return getGeoportalFallbackData();
    }
}

/**
 * Get fallback data when CSV loading fails
 * @returns {Array} Fallback geoportal objects
 */
function getGeoportalFallbackData() {
    return [
        { _uid: 1, object_type: 'school', name: 'Maktab №45', lat: 40.2976, lon: 64.4058, region_name_uz: 'Buxoro', year: 2025, status: 'Tender' },
        { _uid: 2, object_type: 'road', name: "Olmazor ko'chasi", lat: 40.7414, lon: 64.3427, region_name_uz: 'Buxoro', year: 2021, status: 'Qurilish' },
        { _uid: 3, object_type: 'clinic', name: 'Markaziy poliklinika', lat: 40.2093, lon: 64.3536, region_name_uz: 'Buxoro', year: 2018, status: 'Rejalashtirilgan' },
        { _uid: 4, object_type: 'kindergarten', name: "Bog'cha №12", lat: 40.3521, lon: 64.4892, region_name_uz: 'Buxoro', year: 2024, status: 'Yakunlangan' },
        { _uid: 5, object_type: 'water', name: "Suv ta'minoti", lat: 40.2845, lon: 64.4123, region_name_uz: 'Buxoro', year: 2025, status: 'Tender' },
    ];
}

// ===== CATEGORY/TYPE INFORMATION =====

const CATEGORY_INFO = {
    school: { name: 'Maktab', icon: 'school', xp: 50, color: '#f093fb' },
    clinic: { name: 'Klinika', icon: 'hospital', xp: 50, color: '#4facfe' },
    road: { name: "Yo'l", icon: 'road', xp: 40, color: '#fa709a' },
    water: { name: 'Suv', icon: 'droplet', xp: 40, color: '#30cfd0' },
    kindergarten: { name: "Bog'cha", icon: 'child', xp: 50, color: '#fed6e3' },
    sport: { name: 'Sport', icon: 'futbol', xp: 45, color: '#e74c3c' }
};

/**
 * Get category icon name
 * @param {string} category - Category key
 * @returns {string} Font Awesome icon name
 */
function getCategoryIcon(category) {
    return CATEGORY_INFO[category]?.icon || 'circle';
}

/**
 * Get category display name
 * @param {string} category - Category key
 * @returns {string} Display name
 */
function getCategoryName(category) {
    return CATEGORY_INFO[category]?.name || category;
}

// ===== STATUS UTILITIES =====

const STATUS_INFO = {
    resolved: { name: 'Hal qilindi', icon: 'check-circle', color: '#4fae4e' },
    progress: { name: 'Jarayonda', icon: 'spinner', color: '#f5a623' },
    pending: { name: 'Kutilmoqda', icon: 'clock', color: '#7d8b99' }
};

/**
 * Get status display text
 * @param {string} status - Status key
 * @returns {string} Display text
 */
function getStatusText(status) {
    return STATUS_INFO[status]?.name || status;
}

// Export for use in module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        parseCSVLine,
        parseEuropeanNumber,
        calculateDistance,
        findNearestGeoportalObject,
        loadGeoportalCSV,
        getGeoportalFallbackData,
        getCategoryIcon,
        getCategoryName,
        getStatusText,
        CATEGORY_INFO,
        STATUS_INFO,
        GEOPORTAL_TYPE_MAPPING
    };
}
