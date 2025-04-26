🚀 Space Mission Fuel Optimizer
Team Name: GIT TO MARS
"We didn’t just go to Mars. We optimized our path to get there."

Welcome to the Space Mission Fuel Optimizer – a browser-based application that calculates the most fuel-efficient path for a space mission using the Held-Karp TSP Algorithm. Designed with a cyberpunk aesthetic, this tool helps mission planners reduce interplanetary travel costs while providing an immersive animated visualization of the optimal route.

🛰 Project Overview
“Optimizing fuel is the first step to extending the stars’ reach.”

The Space Mission Fuel Optimizer enables users to:

Upload 3D coordinates of interstellar waypoints.

Visualize the optimal traversal path.

Minimize fuel usage using dynamic programming.

Enjoy an animated cyberpunk-inspired space route visualization.

📁 Project Structure
bash
Copy
Edit
space-mission-optimizer/
├── index.html            # Main HTML file
├── styles.css            # Cyberpunk-styled CSS
├── script.js             # TSP logic + animations
├── waypoints.txt         # Sample input file
├── background.mp4        # Optimized space-themed video background
└── README.md             # You're reading it!
🌌 Technologies Used

Technology	Purpose
HTML5	Base structure
CSS3	Neon-styled visuals
JavaScript	TSP logic + interactivity
SVG	Animated space route
MP4	Background aesthetic
Held-Karp Algorithm	Dynamic programming for TSP
🔧 Get Started
Prerequisites
A modern web browser (Chrome, Firefox, etc.)

A local web server:

VS Code Live Server Extension

Node.js http-server

Python’s http.server

📦 Installation & Running
Option 1: VS Code + Live Server
Open the project folder in VS Code.

Install the Live Server extension.

Right-click index.html → Open with Live Server.

The app runs at http://127.0.0.1:5500.

Option 2: Node.js http-server
Ensure you have Node.js installed.

sh
Copy
Edit
npm install -g http-server
cd space-mission-optimizer
http-server
Access at: http://localhost:8080

Option 3: Python HTTP Server
sh
Copy
Edit
cd space-mission-optimizer
python -m http.server
Access at: http://localhost:8000

📌 Features Overview
🗂 Upload Waypoints
Accepts .txt file with format: ID X Y Z (5–15 waypoints)

🧠 Optimal Route Calculation
Uses Held-Karp (Dynamic Programming) to determine the most fuel-efficient path

📊 Display Output

Waypoints Table

Optimal Path Sequence

Total Fuel Cost

3D Distance Matrix

🔮 Cyberpunk Visualization

Neon grid layout

Pulsating waypoints

Real-time path lines

Rotating spaceship with fading trail

Tracking dot for live simulation

💾 Download Route
Save the calculated path as .txt for mission logs or analysis

🧪 Sample Input Format (waypoints.txt)
txt
Copy
Edit
1 0 0 0
2 10 0 0
3 10 10 0
4 0 10 0
5 5 5 5
🧭 How to Use
Upload a .txt file with interstellar waypoints.

Enter the Start Node ID.

Click Calculate Optimal Path.

Watch the animated space journey.

Click Download Path to save the output.

🛠 Troubleshooting

Problem	Solution
Animation not visible	Open DevTools (F12) → Clear Site Data
UI not scrolling	Ensure styles.css has overflow-y: auto
Changes not reflected	Restart the local server after file edits
🌟 Future Enhancements
Real-time user-uploaded background video integration

Audio effects for spacecraft movement

Support for fuel variations (e.g., gravity drag)

Mobile-optimized UI version

👥 Team Credits
Team Name: GIT TO MARS
Developers: [Add team member names here]
Focus Areas: Frontend Engineering, Algorithm Design, Visual UI/UX

📫 Contact
For questions, feedback, or collaboration opportunities:
📧 contact@gittomars.dev

📚 Learn More
Held-Karp Algorithm - Wikipedia

Dynamic Programming Explained

SVG Animation Guide
