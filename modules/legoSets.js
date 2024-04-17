const setData = require("../data/setData.json");
const themeData = require("../data/themeData.json");
require("dotenv").config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize("Lego", "Week11_owner", "DgpE8IfWkR4s", {
  host: "ep-fragrant-butterfly-a5qb869e.us-east-2.aws.neon.tech",
  dialect: "postgres",
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

const Theme = sequelize.define(
  "Theme",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true, // use "id" as a primary key
      autoIncrement: true, // automatically increment the value
    },
    name: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

const Set = sequelize.define(
  "Set",
  {
    set_num: {
      type: Sequelize.STRING,
      primaryKey: true, // use "set_num" as a primary key
    },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    img_url: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
    tableName: "sets", // specify the correct table name
  }
);

Set.belongsTo(Theme, { foreignKey: "theme_id" });

function initialize() {
  return new Promise(async (resolve, reject) => {
    try {
      // Synchronize Sequelize models with the database schema
      await sequelize.sync();

      // Check if there are any themes in the database
      const themes = await Theme.findAll();
      if (themes.length === 0) {
        // Populate themes from themeData if database is empty
        for (const theme of themeData) {
          await Theme.create({ name: theme.name });
        }
        console.log("Themes initialized in database.");
      }

      // Check if there are any sets in the database
      const sets = await Set.findAll();
      if (sets.length === 0) {
        // Populate sets from setData if database is empty
        for (const set of setData) {
          const yearInt = parseInt(set.year, 10);
          if (!isNaN(yearInt)) {
            await Set.create({
              set_num: set.set_num,
              name: set.name,
              year: yearInt,
              theme_id: set.theme_id,
              num_parts: set.num_parts,
              img_url: set.img_url,
            });
          }
        }
        console.log("Sets initialized in database.");
      }

      resolve(); // Resolve the promise when initialization is complete
    } catch (err) {
      reject(err.message); // Reject with error message if any error occurs
    }
  });
}

function getAllSets() {
  return new Promise(async (resolve, reject) => {
    let sets = await Set.findAll({ include: [Theme] });
    resolve(sets);
  });
}

function getSetByNum(setNum) {
  return new Promise(async (resolve, reject) => {
    let foundSet = await Set.findAll({
      include: [Theme],
      where: { set_num: setNum },
    });

    if (foundSet.length > 0) {
      resolve(foundSet[0]);
    } else {
      reject("Unable to find requested set");
    }
  });
}

function getSetsByTheme(theme) {
  return new Promise(async (resolve, reject) => {
    let foundSets = await Set.findAll({
      include: [Theme],
      where: {
        "$Theme.name$": {
          [Sequelize.Op.iLike]: `%${theme}%`,
        },
      },
    });

    if (foundSets.length > 0) {
      resolve(foundSets);
    } else {
      reject("Unable to find requested sets");
    }
  });
}

function getAllThemes() {
  return new Promise(async (resolve, reject) => {
    let themes = await Theme.findAll();
    resolve(themes);
  });
}

function addSet(setData) {
  return new Promise(async (resolve, reject) => {
    try {
      await Set.create(setData);
      resolve();
    } catch (err) {
      reject(err.errors[0].message);
    }
  });
}

function editSet(set_num, setData) {
  return new Promise(async (resolve, reject) => {
    try {
      await Set.update(setData, { where: { set_num: set_num } });
      resolve();
    } catch (err) {
      reject(err.errors[0].message);
    }
  });
}

function deleteSet(set_num) {
  return new Promise(async (resolve, reject) => {
    try {
      await Set.destroy({
        where: { set_num: set_num },
      });
      resolve();
    } catch (err) {
      reject(err.errors[0].message);
    }
  });
}

module.exports = {
  initialize,
  getAllSets,
  getSetByNum,
  getSetsByTheme,
  getAllThemes,
  addSet,
  editSet,
  deleteSet,
};
