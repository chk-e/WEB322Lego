/********************************************************************************
 * WEB322 – Assignment 03 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html *
 * Name: Excel Chok Student ID: 138830229 Date: 18 March 2024 *
 * Published URL: https://gorgeous-tick-sarong.cyclic.app *
 ********************************************************************************/

// Requires path for legoSets module
const legoData = require("./modules/legoSets");
// Requires express module
const express = require("express");
// Obtains app object
const app = express();
// Assigns a port
const port = process.env.PORT || 8080;
// Assignment 3: Mark public folder as static
app.use(express.static("public"));
// Require path
const path = require("path");

// Function to start server
const startServer = async () => {
  try {
    // Makes sure initialize() function is executed first before app.listen, awaits for promise in initialize()
    await legoData.initialize();
    // Calls to function for different configured routes
    configureRoutes();
    // Starts server with .listen()
    app.listen(port, () =>
      console.log(`Server listening on: http://localhost:${port}`)
    );
  } catch (error) {
    console.error("Initialization failed:", error);
  }
};

// Function to configure different routes
let configureRoutes = () => {
  // Route for "/"
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
  });

  // Route for "/about"
  app.get("/about", (req, res) => {
    // Send the about.html file as a response
    res.sendFile(path.join(__dirname, "views", "about.html"));
  });

  // Route for "/lego/sets"
  app.get("/lego/sets", async (req, res) => {
    try {
      // Check if there is a "theme" query present ...
      if (req.query.theme) {
        // ... If there is a theme parameter, fetch sets by theme
        let themeSets = await legoData.getSetsByTheme(req.query.theme);
        res.send(themeSets);
      } else {
        // ... If there is no theme parameter, fetch all sets
        let allSets = await legoData.getAllSets();
        res.send(allSets);
      }
    } catch (error) {
      // If any errors occurred, return the error message with the "404" status code
      res.status(404).send(`Error: ${error.message}`);
    }
  });

  // Route for "/lego/sets/num-demo"
  app.get("/lego/sets/:setNum", async (req, res) => {
    try {
      // Extract the set number from the URL params
      const setNum = req.params.setNum;

      // Fetch the Lego set by set number
      let specificSet = await legoData.getSetByNum(setNum);

      // Check if the set exists
      if (specificSet) {
        // If the set exists, send it as a response
        res.send(specificSet);
      } else {
        // If the set does not exist, return a 404 error
        res.status(404).send(`Lego set with set_num ${setNum} not found.`);
      }
    } catch (error) {
      // If any errors occurred, return the error message with the "404" status code
      res.status(404).send(`Error: ${error.message}`);
    }
  });

  // Route for handling 404 errors
  app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  });
};

// Start the server after ensuring initialization
startServer();
