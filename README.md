# 🧠 MindGrid Sudoku

A modern, responsive Sudoku game designed for focused, satisfying puzzle solving.

Choose between **6×6 and 9×9 grids**, pick your difficulty, and solve at your own pace with smart hints, notes, streaks, statistics, and **Puzzle Pulse** — a subtle companion that keeps you motivated without getting in the way.

## ✨ Features

* 🔢 **6×6 & 9×9 Sudoku** — Choose the grid size that suits you
* 🎯 **Multiple Difficulties** — Easy, Medium, Hard, and Expert
* 💡 **Hints** — Get a nudge when you're stuck
* ✏️ **Notes Mode** — Add pencil marks while solving
* ✨ **Puzzle Pulse** — Contextual feedback based on your progress
* 🔥 **Solving Streaks** — Track consecutive correct moves
* ❤️ **Mistake Tracking** — Keep an eye on your remaining chances
* ⏱️ **Timer** — Track your solving time
* 📊 **Statistics** — Games played, completed, best times, streaks, and more
* 💾 **Local Progress** — Your statistics and settings persist locally
* 📱 **Mobile First** — Designed for phones, tablets, and desktop
* ⌨️ **Keyboard Support** — Play comfortably on desktop
* 🎉 **Completion Experience** — Celebrate every solved puzzle

## 🎮 How to Play

Choose your:

**Grid Size**

* 6×6 — numbers 1–6
* 9×9 — numbers 1–9

Then choose your difficulty:

* Easy
* Medium
* Hard
* Expert

Fill every cell so that each number appears exactly once in every row, column, and region.

You can use **Notes** to keep track of possible candidates and **Hints** when you need a little help.

## ✨ Puzzle Pulse

MindGrid includes a small contextual companion called **Puzzle Pulse**.

Rather than filling the screen with statistics and instructions, Puzzle Pulse provides short, encouraging observations based on how you're playing.

For example:

> 🌟 Perfect start — keep the streak alive!

> 🔥 You're on a roll!

> 🎯 Halfway there — keep going!

> 🧠 Take your time. Accuracy beats speed.

> 🏆 Almost there — finish strong!

Puzzle Pulse never reveals the solution or tells you exactly what to play unless you explicitly use a hint.

## 📱 Responsive Design

MindGrid is designed to feel great on any screen.

### Mobile

* Touch-friendly controls
* Responsive square Sudoku board
* Dedicated number keypad
* No horizontal scrolling
* Comfortable portrait experience

### Desktop

* Mouse interaction
* Keyboard controls
* Larger game layout
* Optimized information panel

## 🧩 Grid Sizes

### 6×6

A faster, more approachable Sudoku format using numbers **1–6**.

Great for:

* Quick sessions
* Beginners
* Mobile play
* Daily challenges

### 9×9

The classic Sudoku experience using numbers **1–9**.

Great for:

* Longer sessions
* Advanced solving
* Challenging puzzles
* Experienced players

## 🛠️ Tech Stack

MindGrid is built with modern web technologies:

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Lucide React**
* **Motion**
* **Canvas Confetti**

The game runs primarily in the browser and uses local storage for persistent game statistics and settings.

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/VIJESHG/mind-grid-sudoku.git
cd mind-grid-sudoku
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run TypeScript checks:

```bash
npm run lint
```

## 📂 Project Structure

```text
mind-grid-sudoku/
├── public/
├── src/
│   ├── components/
│   ├── game/
│   ├── hooks/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

> The exact structure may evolve as the project grows.

## 🗺️ Roadmap

Some ideas planned for future versions:

* [ ] Daily Sudoku
* [ ] Zen Mode
* [ ] Personal Bests
* [ ] Achievements
* [ ] Additional visual themes
* [ ] Puzzle replay
* [ ] Ghost mode
* [ ] Solving style insights
* [ ] More game modes
* [ ] Installable PWA
* [ ] Sudoku learning mode

## 🤝 Contributing

Contributions, ideas, and improvements are welcome.

If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the game
5. Open a pull request

## 📄 License

MindGrid Sudoku is open source and available under the **MIT License**.

See [`LICENSE`](LICENSE) for details.

---

<p align="center">
  <strong>🧠 Think. Focus. Solve.</strong>
  <br />
  <sub>Built with care for people who enjoy a good puzzle.</sub>
</p>
