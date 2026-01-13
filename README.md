# Real Holat - Citizen Reporting Platform 🇺🇿

**Real Holat** is a digital platform designed to help citizens report social infrastructure issues (such as road defects, water supply problems, school repairs, etc.) directly to the authorities. It features a gamified experience to encourage active citizenship.

## 🚀 Features

- **📱 Two Interfaces**:
  - **Telegram Web App UI** (`index.html`): A familiar chat-based interface.
  - **PWA Mobile App** (`pwa.html`): A dedicated mobile web app with a step-by-step wizard.
- **🗺️ Geoportal Integration**:
  - Automatically detects nearby infrastructure objects (Schools, Clinics, etc.) using `geoportal_data.csv`.
  - Calculates distance and suggests the correct category automatically.
- **🎮 Gamification**:
  - Earn **XP** and **Points** for every report.
  - Level up from "New User" to "National Hero".
  - Leaderboards and achievements.
- **🌍 Multi-language Support**:
  - Full support for **Uzbek**, **Russian**, and **English**.
- **📊 Analytics**:
  - "Geek Mode" in PWA provides detailed stats and heatmaps.
  - `dashboard.html` for a desktop admin view.

## 📂 Project Structure

- **`index.html`**: The main entry point for the Telegram Web App simulation.
- **`pwa.html`**: The Progressive Web App (PWA) interface.
- **`dashboard.html`**: Statistics and administration dashboard.
- **`app.js`**: Logic for the Chat UI.
- **`pwa-app.js`**: Logic for the PWA, including Wizard and Geoportal handling.
- **`i18n.js`**: Localization engine.
- **`geoportal_data.csv`**: Database of infrastructure objects (Lat/Lon).
- **`manifest.json`**: Configuration for PWA installation.

## 🛠️ How to Run

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/real-holat.git
    ```
2.  **Run a Local Server**:
    *   Because the app loads data from a CSV file (`geoportal_data.csv`), you **cannot** just double-click the HTML files. You must serve them via HTTP.
    *   **VS Code**: Right-click `index.html` and select "Open with Live Server".
    *   **Python**:
        ```bash
        python -m http.server
        ```
    *   **Node.js**:
        ```bash
        npx http-server
        ```
3.  **Open in Browser**:
    *   Go to `http://localhost:8000` (or the port shown in your terminal).

## 📸 Screenshots

*(Add screenshots of your app here)*

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)
