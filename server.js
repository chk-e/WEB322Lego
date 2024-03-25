/********************************************************************************
 * WEB322 – Assignment 04 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy: *
 * hOps://www.senecacollege.ca/about/policies/academic-integrity-policy.html *
 * Name: Excel Chok Student ID: 138830229 Date: 25 March 2024 *
 * Published URL: https://gorgeous-tick-sarong.cyclic.app
 * ********************************************************************************/

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
// Uses ejs
app.set("view engine", "ejs");

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
    res.render("home");
  });

  // Route for "/about"
  app.get("/about", (req, res) => {
    // Send the about.html file as a response
    res.render("about");
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
        res.render("sets", { sets: allSets });
      }
    } catch (error) {
      // If any errors occurred, return the error message with the "404" status code
      res.status(404).render("404", {
        message: "No set found for the specified sets.",
      });
    }
  });

  // Route for "/lego/sets/num-demo"
  app.get("/lego/sets/:setNum", async (req, res) => {
    // Extract the set number from the URL params
    const setNum = req.params.setNum;

    // Fetch the Lego set by set number
    let specificSet = await legoData.getSetByNum(setNum);

    // Check if the set exists
    if (specificSet) {
      // If the set exists, render the "set.ejs" file with the set data
      res.render("set", { set: specificSet });
    } else {
      // If the set does not exist, render a 404 page
      res.status(404).render("404", {
        message: "No set found for the specified set.",
      });
    }
  });

  // Route for handling 404 errors
  app.use((req, res) => {
    res.status(404).render("404", { message: "Page not found" });
  });
};

// Start the server after ensuring initialization
startServer();
