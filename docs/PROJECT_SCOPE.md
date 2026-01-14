# 📋 Sign — Project Scope

<div align="center">

**Digital Platform for Citizen Infrastructure Feedback**  
*Connecting 37 Million Citizens to 21,000+ Infrastructure Objects*

**Team:** Sign | **Event:** IDEATHON 2026

</div>

---

## 🎯 Executive Summary

**Sign** is a Progressive Web App (PWA) that enables citizens of Uzbekistan to report infrastructure issues and track their resolution. The platform integrates with the national Geoportal (geoasr.uz) to automatically identify nearby infrastructure objects and streamline the reporting process.

---

## 📊 Problem Statement

### Uzbekistan Infrastructure Scale (2025)

| Indicator | Value |
|:----------|:------|
| 👥 Population | **37+ million** |
| 🏫 Schools | **10,943** |
| 🏥 Hospitals | **1,972** |
| 🛣️ Roads | **42,400 km** |
| 👨‍🎓 Students | **6.8 million** |
| 💧 Water Systems | **1,000+** |

### Current Challenges

| Problem | Impact |
|:--------|:-------|
| Bureaucratic complexity | Low citizen participation |
| No feedback loop | Citizens don't know request status |
| Isolated Geoportal data | Citizens can't access infrastructure info |
| No engagement incentive | Minimal reporting activity |

> **50%+ of state budget** allocated to social policy with minimal citizen feedback

---

## 💡 Solution Overview

### Core Features

| Feature | Description |
|:--------|:------------|
| 📝 **4-Step Wizard** | Describe → Location → Photo → Category |
| 📍 **Geoportal Integration** | Auto-detect nearest infrastructure |
| 🎮 **Gamification** | XP, levels, achievements, leaderboards |
| 🌐 **Multi-language** | Uzbek, Russian, English |
| 📊 **Analytics Dashboard** | Statistics, trends, map visualization |

---

## 📱 Platform Interfaces

### 1. PWA Mobile App

| Mode | Target Users | Features |
|:-----|:-------------|:---------|
| 📱 **Simple** | Elderly, beginners | Step-by-step wizard, large buttons |
| 📊 **Analytics** | Tech-savvy | Map, filters, statistics |

### 2. Telegram Bot UI
- Chat-based interaction
- Quick action buttons
- Real-time status updates

### 3. Admin Dashboard
- Request management
- Statistics & charts
- Map visualization
- User management

---

## 🗺️ Geoportal Integration

### Data Source: geoasr.uz

The platform integrates with Uzbekistan's national Geoportal to provide real infrastructure data.

### Current Implementation

| Feature | Status |
|:--------|:-------|
| CSV data loading (21,000+ objects) | ✅ Implemented |
| Nearest object detection by GPS | ✅ Implemented |
| Category auto-suggestion | ✅ Implemented |
| Object info display | ✅ Implemented |

### Data Structure

```csv
_uid, project_id, object_type, name, lat, lon, 
region_id, region_name_uz, year, sector, status
```

### Object Types Covered

| Type | Count | Example |
|:-----|:------|:--------|
| 🏫 school | 10,943 | Maktab №45 |
| 🏥 clinic | 1,972 | Qishloq vrachlik punkti |
| 💧 water | 1,000+ | Suv ta'minoti tarmog'i |
| ⚽ sport | 500+ | Sport maydoni |
| 🛣️ road | 42,400 km | Yo'l ta'miri |

---

## 🆕 Planned Geoportal Features

### Phase 1: Enhanced Data Integration

| Feature | Description | Priority |
|:--------|:------------|:---------|
| 🔄 **Real-time API Sync** | Live data from geoasr.uz instead of static CSV | High |
| 📊 **Object History** | Track all reports per infrastructure object | High |
| 🔍 **Advanced Search** | Search by name, region, status, year | Medium |

### Phase 2: Analytics & Insights

| Feature | Description | Priority |
|:--------|:------------|:---------|
| 📈 **Trend Analysis** | Problem patterns by region/category over time | High |
| 🗺️ **Heatmap** | Visualize problem concentration areas | High |
| 📉 **Performance Metrics** | Resolution time by category/region | Medium |

### Phase 3: Smart Features

| Feature | Description | Priority |
|:--------|:------------|:---------|
| 🔔 **Proximity Alerts** | Notify users of nearby reported issues | Medium |
| 🤖 **AI Categorization** | Auto-categorize based on description | Medium |
| 🗂️ **PPP/FDI Linking** | Connect reports to investment projects | Low |

---

## 🛠️ Technical Architecture

### Stack

| Component | Technology |
|:----------|:-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| PWA | Service Worker, Web App Manifest |
| Maps | Leaflet.js + OpenStreetMap |
| Data | CSV (current) → REST API (planned) |
| i18n | Custom localization system |
| Hosting | Static hosting (GitHub Pages/Vercel) |

### Project Structure

```
Real-Holat/
├── assets/icons/     # App icons
├── css/              # Stylesheets
├── js/               # JavaScript modules
├── data/             # Geoportal CSV data
├── docs/             # Documentation
├── index.html        # Telegram Bot UI
├── pwa.html          # PWA Interface
├── dashboard.html    # Admin Dashboard
└── manifest.json     # PWA Manifest
```

---

## 🎮 Gamification System

| Element | Description |
|:--------|:------------|
| ⭐ **XP Points** | Earned for every action |
| 🏅 **Levels** | Beginner → Expert progression |
| 🏆 **Achievements** | Special rewards for milestones |
| 📊 **Leaderboard** | Regional/national rankings |
| 🔥 **Streak** | Daily activity bonuses |

### XP Rewards

| Action | XP |
|:-------|:---|
| Submit report | +50 |
| Add photo | +20 |
| Share location | +15 |
| Report resolved | +100 |
| 7-day streak | +50 |

---

## 👥 Target Audience

| Segment | Size | Need |
|:--------|:-----|:-----|
| 🏠 Citizens | 37M | Easy way to report issues |
| 🏛️ Government | 14 regions | Structured data for decisions |
| 📊 Analysts | 100+ orgs | Visualization & insights |

### Market Opportunity

| Investment Type | Amount (2025) |
|:----------------|:--------------|
| PPP Projects | **$4.5 Billion** |
| FDI Target | **$43 Billion** |
| ADB Projects | **$3.5 Billion** |

---

## 📅 Roadmap

### ✅ Phase 1: MVP (Current)
- [x] PWA with 4-step wizard
- [x] Telegram Bot UI
- [x] Geoportal CSV integration (21,000+ objects)
- [x] Multi-language support (UZ/RU/EN)
- [x] Gamification system
- [x] Admin Dashboard

### 🔜 Phase 2: Backend (Q2 2026)
- [ ] REST API (Node.js/Python)
- [ ] PostgreSQL database
- [ ] User authentication (Telegram OAuth)
- [ ] Geoportal real-time API integration

### 🔮 Phase 3: Scale (Q3 2026)
- [ ] Mobile apps (React Native)
- [ ] Push notifications
- [ ] Government services integration
- [ ] AI-powered categorization
- [ ] Advanced analytics dashboard

---

## 👨‍💻 Team

| Role | Responsibility |
|:-----|:---------------|
| Frontend Developer | UI/UX, PWA, Telegram Bot |
| Data Engineer | Geoportal integration |
| Designer | UI Design, User Experience |

---

## 📞 Contacts

**GitHub:** [Sign Repository](https://github.com/sign-app)  
**Demo:** [Sign PWA](../pwa.html)  
**Telegram:** @SignBot

---

<div align="center">

*Prepared for IDEATHON 2026*

**Sign** — The Voice of Citizens in Improving Social Infrastructure

</div>
