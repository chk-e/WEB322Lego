/********************************************************************************
 * WEB322 – Assignment 04 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy: *
 * hOps://www.senecacollege.ca/about/policies/academic-integrity-policy.html *
 * Name: Excel Chok Student ID: 138830229 Date: 17 April 2024 *
 * Published URL: https://gorgeous-tick-sarong.cyclic.app
 * ********************************************************************************/

const express = require("express");
const legoData = require("./modules/legoSets");
const path = require("path");

const app = express();
const port = 8080;

app.set("view engine", "ejs");

legoData
  .initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Initialization failed:", error);
  });

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.render("home", { page: "/" });
});

app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

app.get("/lego/sets", (req, res) => {
  const theme = req.query.theme;
  if (theme) {
    legoData
      .getSetsByTheme(theme)
      .then((foundSets) => {
        // Render the "sets.ejs" view with the Lego sets data
        res.render("sets", { sets: foundSets, page: "/lego/sets" });
      })
      .catch((error) => {
        res.status(404).send(error);
      });
  } else {
    legoData
      .getAllSets()
      .then((allSets) => {
        // Render the "sets.ejs" view with all Lego sets data
        res.render("sets", { sets: allSets, page: "/lego/sets" });
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  }
});

app.get("/lego/sets/:setNum", async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.setNum);
    if (set) {
      res.render("set", { set: set, page: "" });
    } else {
      res.status(404).render("404", { message: "Set not found" });
    }
  } catch (error) {
    res.status(404).render("404", { message: error });
  }
});

app.use(express.urlencoded({ extended: true }));

app.get("/lego/addSet", async (req, res) => {
  try {
    const themes = await legoData.getAllThemes();
    res.render("addSet", { themes: themes });
  } catch (error) {
    res.status(500).render("500", {
      message: `I'm sorry, but we have encountered the following error: ${error}`,
    });
  }
});

app.post("/lego/addSet", async (req, res) => {
  try {
    const setData = req.body;
    await legoData.addSet(setData);
    res.redirect("/lego/sets");
  } catch (error) {
    res.status(500).render("500", {
      message: `I'm sorry, but we have encountered the following error: ${error}`,
    });
  }
});

app.get("/lego/editSet/:num", async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.num);
    const themes = await legoData.getAllThemes();
    res.render("editSet", { themes: themes, set: set });
  } catch (error) {
    res.status(404).render("404", { message: error });
  }
});

app.post("/lego/editSet", async (req, res) => {
  try {
    const setNum = req.body.set_num;
    const setData = req.body;
    await legoData.editSet(setNum, setData);
    res.redirect("/lego/sets");
  } catch (error) {
    res.status(500).render("500", {
      message: `I'm sorry, but we have encountered the following error: ${error}`,
    });
  }
});

app.get("/lego/deleteSet/:num", async (req, res) => {
  try {
    const setNum = req.params.num;
    await legoData.deleteSet(setNum);
    res.redirect("/lego/sets");
  } catch (error) {
    res.status(500).render("500", {
      message: `I'm sorry, but we have encountered the following error: ${error}`,
    });
  }
});

app.use((req, res) => {
  res.status(404).render("404", {
    message: "I'm sorry, we're unable to find what you're looking for",
  });
});
