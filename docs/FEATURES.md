# 🚀 Sign — Feature Roadmap

## Geoportal Integration Features

---

## 📊 Current Implementation

| Feature | Status | Description |
|---------|:------:|-------------|
| 🗺️ CSV Data Loading | ✅ | Load 30,000+ objects from `geoportal_data.csv` |
| 📍 Nearest Object Detection | ✅ | Find closest infrastructure by GPS |
| 🏷️ Auto-Category Suggestion | ✅ | Suggest category based on object type |
| 🌐 Multi-language | ✅ | UZ/RU/EN support |

---

## 🆕 Planned Features

### Phase 1: Enhanced Object Display

| Feature | Priority | Description |
|---------|:--------:|-------------|
| 💰 **Budget Transparency** | 🔴 High | Show committed/spent amounts (UZS/USD) |
| 📈 **Project Status** | 🔴 High | Display: Tender, Qurilish, Tugallangan |
| 🏦 **Funding Source** | 🔴 High | Show: World Bank, ADB, EBRD, State Budget |
| 📅 **Construction Year** | 🟡 Medium | Display planned/actual year |
| 🏢 **Source Type** | 🟡 Medium | IFI / BYUDJET / HOMIY indicator |

### Phase 2: Analytics Dashboard

| Feature | Priority | Description |
|---------|:--------:|-------------|
| 📊 **Regional Statistics** | 🔴 High | Problems by region (Buxoro, Andijon, etc.) |
| 🗺️ **Heatmap** | 🔴 High | Visualize problem concentration areas |
| 📈 **Trend Analysis** | 🟡 Medium | Monthly/yearly problem patterns |
| 💵 **Investment Tracking** | 🟡 Medium | Track PPP/FDI project progress |
| 🎯 **Category Breakdown** | 🟡 Medium | Reports by: Ta'lim, Yo'l, Suv, Sog'liq |

### Phase 3: Smart Features

| Feature | Priority | Description |
|---------|:--------:|-------------|
| 🔔 **Proximity Alerts** | 🟡 Medium | Notify users of nearby issues |
| 🤖 **AI Categorization** | 🟢 Low | Auto-categorize from description |
| 📸 **Photo Analysis** | 🟢 Low | Detect problem type from image |
| 🔗 **PPP/FDI Linking** | 🟢 Low | Connect reports to investment projects |

---

## 📦 Geoportal Data Fields

### Available Data (from geoasr.uz)

| Field | Type | Example | Use Case |
|-------|:----:|---------|----------|
| `object_type` | Text | `maktab`, `road`, `suv`, `ssv` | Category mapping |
| `name` | Text | Object name | Display to user |
| `lat`, `lon` | Number | `40.29767`, `64.40581` | GPS matching |
| `region_name_uz` | Text | `Buxoro`, `Andijon` | Regional filtering |
| `year` | Number | `2018-2025` | Timeline tracking |
| `sector` | Text | `Ta'lim`, `Yo'l`, `Suv` | Sector analytics |
| `status` | Text | `Tender`, `Qurilish/ta'mir` | Progress tracking |
| `source_type` | Text | `IFI`, `BYUDJET`, `HOMIY` | Funding type |
| `source_name` | Text | `Jahon banki`, `ADB` | Investor tracking |
| `committed_uzs` | Number | `18,922,932,614` | Budget display |
| `spent_uzs` | Number | `732,362,090` | Spending tracking |
| `committed_usd` | Number | `1,005,078` | International format |

### Object Types Mapping

| `object_type` | Category | Icon | Count |
|---------------|----------|:----:|------:|
| `maktab` | 🏫 School | `fa-school` | ~8,000 |
| `ssv` | 🏥 Healthcare | `fa-hospital` | ~6,000 |
| `road` | 🛣️ Road | `fa-road` | ~9,000 |
| `suv` | 💧 Water | `fa-droplet` | ~7,000 |

### Project Statuses

| Status | Meaning | Color |
|--------|---------|:-----:|
| `Tender` | 📋 Bidding phase | 🟡 Yellow |
| `Rejalashtirilgan` | 📅 Planned | 🔵 Blue |
| `Qurilish/ta'mir` | 🏗️ Under construction | 🟠 Orange |
| `Tugallangan` | ✅ Completed | 🟢 Green |

### Funding Sources

| `source_name` | Full Name | Type |
|---------------|-----------|------|
| `Jahon banki` | World Bank | IFI |
| `ADB` | Asian Development Bank | IFI |
| `EBRD` | European Bank | IFI |
| `IsDB` | Islamic Development Bank | IFI |
| `AIIB` | Asian Infrastructure Investment Bank | IFI |
| `O'zR Davlat byudjeti` | State Budget | BYUDJET |

---

## 🎯 Feature Implementation Ideas

### 1. Object Detail Card
```
┌─────────────────────────────────────┐
│ 🏫 Maktab #45                       │
│ ─────────────────────────────────── │
│ 📍 Buxoro region                    │
│ 📅 Year: 2024                       │
│ 📊 Status: Qurilish/ta'mir          │
│ 🏦 Funded by: World Bank            │
│ 💰 Budget: $1,005,078               │
│ 📈 Spent: 7% ($69,605)              │
└─────────────────────────────────────┘
```

### 2. Regional Statistics
```
┌─────────────────────────────────────┐
│ 📊 Buxoro Region Stats              │
│ ─────────────────────────────────── │
│ 🏫 Schools: 2,341 reports           │
│ 🛣️ Roads: 1,892 reports             │
│ 💧 Water: 987 reports               │
│ 🏥 Healthcare: 654 reports          │
│ ─────────────────────────────────── │
│ 📈 Total investment: $4.5B          │
└─────────────────────────────────────┘
```

### 3. Budget Progress Bar
```
Budget: $1,005,078
Spent:  $69,605 (7%)
[████░░░░░░░░░░░░░░░░] 7%
```

---

## 🔧 Technical Notes

### Data Coverage

| Region | Objects | % of Total |
|--------|--------:|:----------:|
| Buxoro | ~8,500 | 28% |
| Andijon | ~4,200 | 14% |
| Navoiy | ~3,800 | 12% |
| Qoraqalpog'iston | ~3,500 | 11% |
| Others | ~10,000 | 35% |

### Performance Considerations

- CSV file: **5MB** (~30,000 rows)
- Recommendation: Load first 500-1000 objects for mobile
- Future: Implement server-side filtering via API

---

*Document created for Sign — IDEATHON 2026*
