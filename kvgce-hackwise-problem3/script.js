// Let everyone know we're loading the latest script with strict waypoint rules
console.log("Loading script.js version: 2025-04-26-v6 (strict 5-15 waypoints)");

// These global variables hold our mission data
let waypoints = []; // List of waypoints with ID, x, y, z coordinates
let optimalPath = []; // The best path found by the TSP solver
let totalFuelCost = 0; // Total fuel cost of the optimal path
let distanceMatrix = []; // Matrix of distances between waypoints

// Grab all the HTML elements we need to interact with the user
const fileInput = document.getElementById("waypointsFile"); // File input for waypoints.txt
const fileInfo = document.getElementById("fileInfo"); // Shows selected file info
const processButton = document.getElementById("processButton"); // Button to start processing
const processingIndicator = document.getElementById("processing"); // Loading spinner
const errorMessage = document.getElementById("errorMessage"); // Error message box
const resultsSection = document.getElementById("resultsSection"); // Results display area
const waypointsTable = document.getElementById("waypointsTable"); // Table for waypoint data
const pathVisualization = document.getElementById("pathVisualization"); // Shows the optimal path
const fuelCostElement = document.getElementById("fuelCost"); // Displays total fuel cost
const downloadButton = document.getElementById("downloadButton"); // Button to download path.txt
const startFromNodeInput = document.getElementById("startFromNode"); // Input for starting node ID
const distancesTable = document.getElementById("distancesTable"); // Distance matrix table
const distancesHeader = document.getElementById("distancesHeader"); // Distance matrix header
const animationCanvas = document.getElementById("animationCanvas"); // Canvas for the animation

// Set up event listeners to respond to user actions
fileInput.addEventListener("change", handleFileSelection); // When a file is selected
processButton.addEventListener("click", processWaypoints); // When the process button is clicked
downloadButton.addEventListener("click", downloadPathFile); // When the download button is clicked

// Handle when the user picks a file
function handleFileSelection(event) {
  const file = event.target.files[0]; // Get the selected file
  if (!file) return; // No file? Bail out
  if (file.name.endsWith(".txt")) {
    // Check if it's a .txt file
    fileInfo.textContent = `File selected: ${file.name} (${formatFileSize(
      file.size
    )})`; // Show file name and size
    processButton.disabled = false; // Enable the process button
    hideError(); // Clear any error messages
  } else {
    showError("Please select a .txt file"); // Show error for non-.txt files
    processButton.disabled = true; // Disable the process button
  }
}

// Convert file size to a readable format (bytes, KB, MB)
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
}

// Show an error message to the user and reset everything
function showError(message) {
  errorMessage.textContent = message; // Set the error text
  errorMessage.style.display = "block"; // Show the error box
  processingIndicator.style.display = "none"; // Hide the loading spinner
  resultsSection.style.display = "none"; // Hide the results
  // Clear global data to avoid using old or invalid data
  waypoints = [];
  optimalPath = [];
  distanceMatrix = [];
  totalFuelCost = 0;
  console.error("Error displayed:", message); // Log the error
}

// Hide the error message box
function hideError() {
  errorMessage.style.display = "none"; // Make the error box invisible
}

// Main function to process the uploaded waypoints file
function processWaypoints() {
  const file = fileInput.files[0]; // Get the selected file
  if (!file) {
    showError("Please select a file first"); // No file? Show error
    return;
  }
  // Reset globals to start fresh
  waypoints = [];
  optimalPath = [];
  distanceMatrix = [];
  totalFuelCost = 0;
  processingIndicator.style.display = "flex"; // Show the loading spinner
  hideError(); // Clear any old errors
  const reader = new FileReader(); // Create a file reader
  reader.onload = function (e) {
    const fileContent = e.target.result; // Get the file content
    console.log("[processWaypoints] Raw file content:", fileContent); // Log raw content for debugging
    try {
      waypoints = parseWaypoints(fileContent); // Parse the file
      console.log(
        `[processWaypoints] Parsed ${waypoints.length} waypoints:`,
        waypoints
      );
      // Check waypoint count immediately and stop if invalid
      if (waypoints.length < 5) {
        console.error(
          `Validation failed: Only ${waypoints.length} waypoints (need ≥ 5)`
        );
        showError(
          `At least 5 waypoints are required (found ${waypoints.length})`
        );
        processingIndicator.style.display = "none";
        return; // Exit early
      }
      if (waypoints.length > 15) {
        console.error(
          `Validation failed: ${waypoints.length} waypoints (max 15)`
        );
        showError(`Maximum 15 waypoints supported (found ${waypoints.length})`);
        processingIndicator.style.display = "none";
        return; // Exit early
      }
      distanceMatrix = calculateDistanceMatrix(waypoints); // Build distance matrix
      const startNodeId = parseInt(startFromNodeInput.value); // Get starting node ID
      const startNodeIndex = waypoints.findIndex((wp) => wp.id === startNodeId); // Find its index
      if (startNodeIndex === -1) {
        showError(`Start node ID ${startNodeId} not found in waypoints`);
        processingIndicator.style.display = "none";
        return; // Exit early
      }
      const result = solveTSP(distanceMatrix, startNodeIndex); // Solve the TSP
      optimalPath = result.path; // Store the optimal path
      totalFuelCost = result.cost; // Store the total cost
      displayResults(); // Show the results in the UI
      processingIndicator.style.display = "none"; // Hide the spinner
      resultsSection.style.display = "block"; // Show the results
    } catch (error) {
      showError("Error: " + error.message); // Show any errors
      processingIndicator.style.display = "none"; // Hide the spinner
    }
  };
  reader.onerror = function () {
    showError("Error reading the file"); // Handle file reading errors
    processingIndicator.style.display = "none";
  };
  reader.readAsText(file); // Read the file as text
}

// Parse the waypoints file into a list of objects
function parseWaypoints(fileContent) {
  const lines = fileContent.split("\n"); // Split file into lines
  const waypointsData = []; // Array to store waypoints
  console.log("[parseWaypoints] Starting parsing...");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) {
      // Skip empty or comment lines
      console.log(`[parseWaypoints] Skipping line ${i + 1}: ${line}`);
      continue;
    }
    const parts = line.trim().split(/\s+/); // Split line into parts
    if (parts.length !== 4) {
      // Must have exactly 4 parts (ID, x, y, z)
      console.warn(`[parseWaypoints] Invalid format at line ${i + 1}: ${line}`);
      continue;
    }
    const id = parseInt(parts[0]); // Parse ID
    const x = parseFloat(parts[1]); // Parse x coordinate
    const y = parseFloat(parts[2]); // Parse y coordinate
    const z = parseFloat(parts[3]); // Parse z coordinate
    if (isNaN(id) || isNaN(x) || isNaN(y) || isNaN(z)) {
      // Check for valid numbers
      console.warn(`[parseWaypoints] Invalid data at line ${i + 1}: ${line}`);
      continue;
    }
    waypointsData.push({ id, x, y, z }); // Add valid waypoint
    console.log(
      `[parseWaypoints] Parsed line ${i + 1}: ID=${id}, x=${x}, y=${y}, z=${z}`
    );
  }
  console.log(
    `[parseWaypoints] Total waypoints parsed: ${waypointsData.length}`
  );
  return waypointsData;
}

// Build a matrix of distances between all waypoints
function calculateDistanceMatrix(waypoints) {
  const n = waypoints.length; // Number of waypoints
  const matrix = Array(n)
    .fill()
    .map(() => Array(n).fill(0)); // Create empty matrix
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue; // Distance to self is 0
      const wp1 = waypoints[i]; // First waypoint
      const wp2 = waypoints[j]; // Second waypoint
      const dx = wp2.x - wp1.x; // Difference in x
      const dy = wp2.y - wp1.y; // Difference in y
      const dz = wp2.z - wp1.z; // Difference in z
      matrix[i][j] = Math.sqrt(dx * dx + dy * dy + dz * dz); // Euclidean distance
    }
  }
  return matrix; // Return the distance matrix
}

// Solve the TSP to find the shortest path
function solveTSP(distMatrix, startNode) {
  return dynamicProgrammingTSP(distMatrix, startNode); // Use dynamic programming
}

// Use dynamic programming to solve the TSP
function dynamicProgrammingTSP(distMatrix, startNode) {
  const n = distMatrix.length; // Number of waypoints
  const memo = Array(n)
    .fill()
    .map(() => Array(1 << n).fill(null)); // Memoization table
  const nextCity = Array(n)
    .fill()
    .map(() => Array(1 << n).fill(-1)); // Track next city
  const allVisited = (1 << n) - 1; // Bitmask for all waypoints visited

  // Recursive function to find the minimum cost
  function tsp(pos, visited) {
    if (visited === allVisited) {
      // All waypoints visited?
      return distMatrix[pos][startNode] || Infinity; // Return to start
    }
    if (memo[pos][visited] !== null) {
      // Already computed?
      return memo[pos][visited]; // Use cached result
    }
    let minCost = Infinity; // Track minimum cost
    let bestNext = -1; // Track best next waypoint
    for (let i = 0; i < n; i++) {
      if (!(visited & (1 << i))) {
        // If waypoint i is not visited
        const cost = distMatrix[pos][i] + tsp(i, visited | (1 << i)); // Try visiting i
        if (cost < minCost) {
          // Better path found?
          minCost = cost; // Update minimum cost
          bestNext = i; // Update best next waypoint
        }
      }
    }
    memo[pos][visited] = minCost; // Cache the result
    nextCity[pos][visited] = bestNext; // Store the next waypoint
    return minCost; // Return the minimum cost
  }

  // Start solving from the initial node
  const initialVisited = 1 << startNode; // Mark start node as visited
  const cost = tsp(startNode, initialVisited); // Compute minimum cost
  if (cost === Infinity) {
    throw new Error("No valid path found"); // No path possible
  }

  // Reconstruct the optimal path
  const path = [startNode]; // Start with the initial node
  let current = startNode; // Current position
  let visited = initialVisited; // Current visited nodes
  while (visited !== allVisited) {
    // Until all nodes are visited
    const next = nextCity[current][visited]; // Get next waypoint
    if (next === -1) break; // No more waypoints
    path.push(next); // Add to path
    visited |= 1 << next; // Mark as visited
    current = next; // Move to next waypoint
  }
  path.push(startNode); // Return to start

  return { path, cost }; // Return the path and cost
}

// Update the UI with the results
function displayResults() {
  // Show waypoints in a table
  const tbody = waypointsTable.querySelector("tbody");
  tbody.innerHTML = ""; // Clear old data
  waypoints.forEach((wp) => {
    const row = document.createElement("tr"); // Create a new row
    row.innerHTML = `
            <td>${wp.id}</td>
            <td>${wp.x.toFixed(2)}</td>
            <td>${wp.y.toFixed(2)}</td>
            <td>${wp.z.toFixed(2)}</td>
        `; // Add waypoint data
    tbody.appendChild(row); // Add row to table
  });

  // Show the optimal path with arrows
  pathVisualization.innerHTML = ""; // Clear old path
  for (let i = 0; i < optimalPath.length; i++) {
    const waypointIndex = optimalPath[i]; // Get waypoint index
    const waypoint = waypoints[waypointIndex]; // Get waypoint data
    const waypointNode = document.createElement("span"); // Create node element
    waypointNode.className = "waypoint-node"; // Style it
    waypointNode.textContent = waypoint.id; // Show ID
    pathVisualization.appendChild(waypointNode); // Add to path
    if (i < optimalPath.length - 1) {
      // Not the last node?
      const arrow = document.createElement("span"); // Create arrow
      arrow.className = "waypoint-arrow"; // Style it
      arrow.innerHTML = "→"; // Add arrow symbol
      pathVisualization.appendChild(arrow); // Add to path
    }
  }

  // Show the total fuel cost
  fuelCostElement.textContent = totalFuelCost.toFixed(2); // Display cost

  // Show the distance matrix
  displayDistanceMatrix();

  // Kick off the animation
  startAnimation();
}

// Display the distance matrix in a table
function displayDistanceMatrix() {
  const header = distancesHeader; // Table header
  const tbody = distancesTable.querySelector("tbody"); // Table body
  header.innerHTML = "<th></th>"; // Clear header
  tbody.innerHTML = ""; // Clear body
  waypoints.forEach((wp) => {
    const th = document.createElement("th"); // Create header cell
    th.textContent = `ID ${wp.id}`; // Show waypoint ID
    header.appendChild(th); // Add to header
  });
  for (let i = 0; i < waypoints.length; i++) {
    const row = document.createElement("tr"); // Create row
    const headerCell = document.createElement("td"); // Create header cell
    headerCell.textContent = `ID ${waypoints[i].id}`; // Show waypoint ID
    headerCell.style.fontWeight = "bold"; // Make it bold
    row.appendChild(headerCell); // Add to row
    for (let j = 0; j < waypoints.length; j++) {
      const cell = document.createElement("td"); // Create cell
      cell.textContent = i === j ? "-" : distanceMatrix[i][j].toFixed(2); // Show distance or '-'
      row.appendChild(cell); // Add to row
    }
    tbody.appendChild(row); // Add row to table
  }
}

// Download the optimal path as a text file
function downloadPathFile() {
  const pathIds = optimalPath.map((index) => waypoints[index].id); // Get waypoint IDs
  const content = `${pathIds.join(" ")} ${totalFuelCost.toFixed(2)}`; // Format output
  const blob = new Blob([content], { type: "text/plain" }); // Create file
  const url = URL.createObjectURL(blob); // Create download link
  const a = document.createElement("a"); // Create anchor
  a.href = url; // Set link
  a.download = "path.txt"; // Set filename
  document.body.appendChild(a); // Add to DOM
  a.click(); // Trigger download
  setTimeout(() => {
    document.body.removeChild(a); // Clean up
    URL.revokeObjectURL(url); // Free memory
  }, 0);
}

// Start the animation to visualize the optimal path
function startAnimation() {
  console.log("Starting animation setup..."); // Log that we're setting up
  const canvas = animationCanvas; // Get the canvas
  if (!canvas) {
    console.error("Canvas element not found"); // No canvas? Log error
    showError("Canvas element not found"); // Show error to user
    return;
  }

  const ctx = canvas.getContext("2d"); // Get 2D drawing context
  if (!ctx) {
    console.error("Failed to get 2D context"); // No context? Log error
    showError("Canvas context initialization failed"); // Show error
    return;
  }

  // Set the canvas size for our cyberpunk graph
  canvas.width = 800; // 800 pixels wide
  canvas.height = 300; // 300 pixels tall
  console.log(`Canvas size set to ${canvas.width}x${canvas.height}`);

  // Load the rocket SVG for our animation
  const rocketImage = new Image();
  rocketImage.src = "rocket.svg"; // Path to rocket SVG
  rocketImage.onload = () => {
    console.log("Rocket SVG loaded"); // Log when loaded
  };
  rocketImage.onerror = () => {
    console.error("Failed to load rocket SVG"); // Log if it fails
  };

  // Make sure we have waypoints and a path to animate
  if (!waypoints.length || !optimalPath.length) {
    console.error("No waypoints or path data", { waypoints, optimalPath });
    showError("No waypoints or path data for animation");
    return;
  }
  console.log("Waypoints:", waypoints); // Log waypoints
  console.log("Optimal Path:", optimalPath); // Log path

  // Delay the animation slightly to ensure the DOM is ready
  setTimeout(() => {
    console.log("Animation delayed start");

    // Convert 3D waypoint coordinates to 2D canvas positions
    const xValues = waypoints.map((wp) => wp.x); // Get all x coordinates
    const yValues = waypoints.map((wp) => wp.y); // Get all y coordinates
    const xMin = Math.min(...xValues); // Find minimum x
    const xMax = Math.max(...xValues); // Find maximum x
    const yMin = Math.min(...yValues); // Find minimum y
    const yMax = Math.max(...yValues); // Find maximum y
    const padding = 50; // Add padding around the graph
    const width = canvas.width - 2 * padding; // Usable width
    const height = canvas.height - 2 * padding; // Usable height
    const scaleX = width / (xMax - xMin || 1); // Scale for x axis
    const scaleY = height / (yMax - yMin || 1); // Scale for y axis
    const scale = Math.min(scaleX, scaleY); // Use smaller scale to fit

    // Map waypoints to canvas coordinates
    const canvasPoints = waypoints.map((wp) => ({
      id: wp.id,
      x: padding + (wp.x - xMin) * scale, // Scale x position
      y: padding + (wp.y - yMin) * scale, // Scale y position
    }));

    console.log("Canvas points:", canvasPoints); // Log canvas positions

    // Set up animation variables
    let currentSegment = 0; // Current path segment
    let t = 0; // Interpolation factor (0 to 1)
    const speed = 0.008; // Animation speed
    let frameCount = 0; // Track frame number
    const trail = []; // Store rocket trail points
    const maxTrailLength = 15; // Number of trail points

    // Draw the cyberpunk grid background
    function drawGrid() {
      ctx.beginPath(); // Start drawing
      ctx.strokeStyle = "rgba(0, 247, 255, 0.1)"; // Faint cyan lines
      ctx.lineWidth = 1; // Thin lines
      // Draw vertical lines
      for (let x = 0; x <= canvas.width; x += 10) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      // Draw horizontal lines
      for (let y = 0; y <= canvas.height; y += 10) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke(); // Render the grid
    }

    // Main animation loop
    function draw() {
      frameCount++; // Increment frame count
      console.log(
        `Frame ${frameCount}: segment=${currentSegment}, t=${t.toFixed(3)}`
      );

      // Clear the canvas for a fresh frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the grid background
      drawGrid();

      // Draw the path edges
      ctx.lineWidth = 4; // Thick lines for edges
      for (let i = 0; i < optimalPath.length - 1; i++) {
        const start = canvasPoints[optimalPath[i]]; // Start point
        const end = canvasPoints[optimalPath[i + 1]]; // End point
        ctx.beginPath(); // Start new path
        ctx.strokeStyle = i === currentSegment ? "#ff00ff" : "#8b00ff"; // Pink for active, purple for others
        ctx.shadowBlur = i === currentSegment ? 15 : 0; // Glow for active segment
        ctx.shadowColor = "#ff00ff"; // Pink glow
        ctx.moveTo(start.x, start.y); // Start at first point
        ctx.lineTo(end.x, end.y); // Draw to second point
        ctx.stroke(); // Render the line
      }
      ctx.shadowBlur = 0; // Reset glow

      // Draw the waypoint nodes
      const pulse = Math.sin(performance.now() / 500) * 2; // Pulse effect (±2px)
      canvasPoints.forEach((point) => {
        ctx.beginPath(); // Start new circle
        ctx.arc(point.x, point.y, 8 + pulse, 0, 2 * Math.PI); // Draw pulsing circle
        ctx.fillStyle = "#00f7ff"; // Cyan fill
        ctx.shadowBlur = 10; // Glow effect
        ctx.shadowColor = "#00f7ff"; // Cyan glow
        ctx.fill(); // Render circle
        ctx.font = "12px Orbitron"; // Cyberpunk font
        ctx.fillStyle = "#e0e0e0"; // Light gray text
        ctx.textAlign = "center"; // Center text
        ctx.textBaseline = "bottom"; // Text above node
        ctx.fillText(point.id, point.x, point.y - 12); // Draw ID
      });
      ctx.shadowBlur = 0; // Reset glow

      // Animate the rocket along the path
      if (currentSegment < optimalPath.length - 1) {
        const start = canvasPoints[optimalPath[currentSegment]]; // Current segment start
        const end = canvasPoints[optimalPath[currentSegment + 1]]; // Current segment end
        const x = start.x + (end.x - start.x) * t; // Interpolate x position
        const y = start.y + (end.y - start.y) * t; // Interpolate y position

        // Update the rocket's trail
        trail.push({ x, y }); // Add current position
        if (trail.length > maxTrailLength) {
          trail.shift(); // Remove oldest point
        }

        // Draw the trail
        ctx.shadowBlur = 10; // Glow for trail
        ctx.shadowColor = "#ff00ff"; // Pink glow
        trail.forEach((point, index) => {
          const alpha = (index + 1) / trail.length; // Fade older points
          const radius = (3 * (index + 1)) / trail.length; // Taper from 3px to 1px
          ctx.beginPath(); // Start new circle
          ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI); // Draw trail point
          ctx.fillStyle = `rgba(255, 0, 255, ${alpha * 0.7})`; // Pink with fading opacity
          ctx.fill(); // Render point
        });
        ctx.shadowBlur = 0; // Reset glow

        // Draw the rocket with rotation
        try {
          ctx.save(); // Save canvas state
          const dx = end.x - start.x; // Direction x
          const dy = end.y - start.y; // Direction y
          const angle = Math.atan2(dy, dx); // Calculate angle
          ctx.translate(x, y); // Move to rocket position
          ctx.rotate(angle); // Rotate to face direction
          ctx.drawImage(rocketImage, -20, -20, 40, 40); // Draw rocket (40x40px, centered)
          ctx.restore(); // Restore canvas state
        } catch (e) {
          console.warn("SVG rendering failed, using circle", e); // Log if SVG fails
          ctx.beginPath(); // Start new circle
          ctx.arc(x, y, 15, 0, 2 * Math.PI); // Draw fallback circle
          ctx.fillStyle = "#ff00ff"; // Pink fill
          ctx.fill(); // Render circle
        }

        t += speed; // Move along the segment
        if (t >= 1) {
          // Reached the end of the segment?
          t = 0; // Reset interpolation
          currentSegment++; // Move to next segment
        }
      } else {
        currentSegment = 0; // Loop back to start
        t = 0; // Reset interpolation
        trail.length = 0; // Clear trail
      }

      requestAnimationFrame(draw); // Keep animating
    }

    // Start the animation loop
    try {
      console.log("Starting animation loop");
      draw(); // Begin drawing frames
    } catch (error) {
      console.error("Animation loop error:", error); // Log any errors
      showError("Animation failed to start"); // Show error to user
    }
  }, 100); // Delay start by 100ms
}
