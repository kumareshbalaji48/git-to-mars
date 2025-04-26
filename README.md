# 🚀 Space Mission Fuel Optimizer  
**Team Name**: GIT TO MARS  
**GitHub Repo URL**: [https://github.com/kumareshbalaji48/spaceroutex]  

---

## 🛰 Project Overview  
"Optimizing fuel is the first step to extending the stars’ reach."  

A browser-based tool to calculate the most fuel-efficient path for space missions using the **Held-Karp TSP Algorithm**. Features cyberpunk aesthetics and animated 3D route visualization.  

---

## 🚀 Get Started  

### 📦 Prerequisites  
- Modern web browser (Chrome/Firefox)  
- Local web server (choose one):  
  - VS Code Live Server Extension  
  - Node.js `http-server`  
  - Python HTTP Server  

---

## 🔧 Installation & Running  


### Option 1 : Node.js http-server  
```sh
mkdir file-name

cd file-name

git clone https://github.com/your-username/your-repo-name.git

code .

cd kvgce-hackwise-problem3

npm install -g http-server

http-server

# Access at http://localhost:8080

📁 Project Structure

bash
space-mission-optimizer/
├── index.html            # Main HTML file
├── styles.css            # Cyberpunk-styled CSS
├── script.js             # TSP logic + animations
├── waypoints.txt         # Sample input file
├── background.mp4        # Space-themed video background
└── README.md             

```
---

### 🌟 Features

Feature	Description
🗂 Waypoint Upload	Accepts 3D coordinates via .txt file (5-15 waypoints)
🧠 Optimal Route	Held-Karp Algorithm for minimal fuel consumption
📊 Visualization	Animated SVG with pulsating waypoints & spaceship trail
💾 Route Export	Download optimized path as .txt file
🧪 Sample Input File

---

### sample-input.txt
1 0.0 0.0 0.0
2 150.0 0.0 0.0
3 0.0 150.0 0.0
4 0.0 0.0 150.0
5 100.0 100.0 100.0
6 -150.0 0.0 0.0
7 0.0 -150.0 0.0
8 -100.0 -100.0 -100.0
9 200.0 200.0 0.0
10 -200.0 -200.0 200.0

### sample-output.txt
Optimal Route
1 → 7 → 8 → 6 → 10 → 4 → 5 → 3 → 9 → 2

Total Fuel Cost
1886.77 units

---

### 🛠 Troubleshooting

Problem	Solution
Animation not visible	Clear browser cache via DevTools (F12)
UI not scrolling	Verify overflow-y: auto in CSS
Changes not reflected	Restart local server after edits

---

### 🌌 Technologies

Technology	Purpose
HTML5/CSS3	Base structure & cyberpunk UI
JavaScript	TSP logic & animations
Held-Karp Algorithm	Dynamic programming optimization

---

### 🧭 How to Use

1-Upload waypoints.txt
2-Enter Start Node ID
3-Click Calculate Optimal Path
4-Watch visualization
5-Download route via Download Path

---
