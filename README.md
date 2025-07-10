# 🎉 Welcome to Executive Dashboard Frontend! 🚀

**AJH Bread & Beans Executive Dashboard**  
*Your one-stop shop for visualizing sales, crew, and menu data in style!*

---

## 📖 Background

This project is a modern, visually appealing executive dashboard for AJH Bread & Beans, built with React and powered by Chart.js for beautiful data visualizations. It’s designed to help you track sales, manage menu stock, and monitor your crew—all in one place.  
Whether you’re a manager, a data enthusiast, or just love dashboards, you’ll feel right at home!

---

## 🖥️ Features

- 📊 **Sales Charts**: Interactive, real-time sales data with Chart.js.
- 🏆 **Best Sellers**: See what’s flying off the shelves.
- 👨‍🍳 **Crew List**: Keep tabs on your team.
- 🍔 **Menu Stock**: Never run out of your best items.
- 🗂️ **Category & Stats Filters**: Slice and dice your data.
- 🖼️ **Beautiful UI**: Custom styles, icons, and a logo to match your brand.

---

## 🚦 Quickstart Guide

### 1. **Clone the Repo**

```bash
git clone https://github.com/your-username/Executive-Dashboard-Frontend.git
cd Executive-Dashboard-Frontend
```

### 2. **Install Dependencies**

We use **Yarn** for package management. If you don’t have it, [install Yarn](https://classic.yarnpkg.com/en/docs/install/).

```bash
yarn install
```

### 3. **Run the App**

```bash
yarn start
```
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- The app will auto-reload as you make changes.

### 4. **Build for Production**

```bash
yarn build
```
- Output goes to the `build/` folder, ready for deployment.

### 5. **Run Tests**

```bash
yarn test
```
- Launches the test runner in interactive watch mode.

---

## 🛠️ Project Structure

```
src/
  ├── App.jsx                # Main app entry
  ├── index.js, index.css    # App bootstrap & global styles
  ├── assets/                # Images, icons, fonts
  └── components/
        └── Dashboard/       # All dashboard features
              ├── BestSellers/
              ├── CategoryFilter/
              ├── CrewList/
              ├── Header/
              ├── MenuStock/
              ├── OrderList/
              ├── SalesChart/
              ├── Sidebar/
              ├── StatsCards/
              └── StatsFilter/
```

- **Logo**: `src/assets/images/logo.png`
- **Custom styles**: Each component has its own `.module.css` file.

---

## ⚙️ Configuration & Environment

- **No custom environment variables required out of the box!**
- If you want to add API endpoints or secrets, create a `.env` file in the root (see [Create React App docs](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables)).

---

## 🧑‍💻 For Developers

- **React 19** and **Chart.js 4** for modern, fast UI.
- Modular component structure for easy extension.
- All dependencies are listed in `package.json`.

---

## 📝 License

MIT License © 2025 Jhon Harold Rueda

---

## 💡 Tips & Fun Facts

- The dashboard is designed for a coffee & bread shop, but you can adapt it for any business!
- The sidebar features a logout icon and your brand’s logo for a professional touch.
- All UI is responsive and looks great on big screens.

---

## ❓ FAQ

**Q: Do I need a backend?**  
A: This is a frontend-only project. You can connect it to any backend you like!

**Q: Can I use npm instead of yarn?**  
A: Sure! Just swap `yarn` for `npm` in the commands.

---

## 🥳 Happy Dashboarding!

---

**Ready to get started? Clone, install, and run! If you have questions, open an issue or reach out.**
