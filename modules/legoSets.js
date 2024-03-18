const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];

// Initialize function adds copies of all setData objects with themes into sets array
let initialize = () => {
  // Creates a promise
  return new Promise((resolve, reject) => {
    try {
      // Iterates through each object in setData
      setData.forEach((object) => {
        // .find() to look for matches between theme_id between setData and themeData
        let objectThemed = themeData.find(
          (theme) => theme.id === object.theme_id
        );
        // If the theme is found, .find() did not return undefined, ...
        if (objectThemed) {
          let setThemed = {
            // ... Spread syntax is used to shallow copy all key and value pairs ...
            ...object,
            // ... Adds new key-value pair ...
            theme: objectThemed.name,
          };
          // ...Pushes modified object with theme into sets []
          sets.push(setThemed);
        }
      });
      // If codes in try block is completed, calls to resolve ...
      resolve();
    } catch (error) {
      // ... If not completed, calls to reject
      reject(error);
    }
  });
};

// Function that returns the completed sets []
let getAllSets = () => {
  // Creates a promise
  return new Promise((resolve, reject) => {
    try {
      // If sets [] now populated with objects, return it as resolve
      resolve(sets);
    } catch (error) {
      // ... If not completed, calls to reject
      reject(error);
    }
  });
};

// Function that returns a specific set by setNum
let getSetByNum = (setNum) => {
  // Creates a promise
  return new Promise((resolve, reject) => {
    try {
      // Uses .find() to find matching setNum
      let specificSet = sets.find((set) => set.set_num === setNum);
      // If set is found, return it as resolve
      if (specificSet) {
        resolve(specificSet);
      } else {
        // If not, returns an error message as reject
        reject(new Error(`Number "${setNum}" not found.`));
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Function that returns a specific set(s) by theme
let getSetsByTheme = (theme) => {
  // Creates a promise
  return new Promise((resolve, reject) => {
    try {
      // Filters out sets [], convert theme to lowercase for both in sets and in argument, find the matching theme
      let filteredSets = sets.filter((set) =>
        set.theme.toLowerCase().includes(theme.toLowerCase())
      );
      // If matching theme is found, array size is not = 0
      if (filteredSets.length !== 0) {
        // Return new sets [] with matching themes
        resolve(filteredSets);
      } else {
        // If array size = 0, rejects with an error message
        reject(new Error(`Theme with "${theme}" not found.`));
      }
    } catch (error) {
      reject(error);
    }
  });
};

// //Testing
// initialize();
// console.log(getAllSets());
// console.log(getSetByNum("003-1"));
// console.log(getSetsByTheme("book"));

// Object literal shorthand for exporting modules
module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };
