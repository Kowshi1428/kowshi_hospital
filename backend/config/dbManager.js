const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/db_fallback.json");

// Ensure data folder exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Default initial state matching seed data
const defaultState = {
  users: [],
  patients: [],
  doctors: [],
  appointments: [],
  wards: [],
  pharmacy: [],
  billing: [],
  laboratory: [],
  activities: []
};

// Load state from file
const loadData = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultState, null, 2), "utf8");
      return defaultState;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading fallback JSON database, resetting...");
    return defaultState;
  }
};

// Save state to file
const saveData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing fallback JSON database:", err);
  }
};

let isConnected = false;

const setConnected = (status) => {
  isConnected = status;
  console.log(`Database engine connected to: ${status ? "MongoDB Atlas" : "Local JSON Fallback Store"}`);
};

const getConnected = () => isConnected;

// Helper to evaluate MongoDB queries in local database JSON store
function evaluateQuery(item, query) {
  for (const key in query) {
    const queryVal = query[key];
    if (queryVal === undefined) continue;

    const itemVal = item[key];

    // Handle operator objects e.g., { $gte: ... }
    if (queryVal !== null && typeof queryVal === 'object' && !Array.isArray(queryVal) && !(queryVal instanceof Date)) {
      for (const op in queryVal) {
        const opVal = queryVal[op];
        if (op === '$gte') {
          if (new Date(itemVal) < new Date(opVal)) return false;
        } else if (op === '$lte') {
          if (new Date(itemVal) > new Date(opVal)) return false;
        } else if (op === '$gt') {
          if (new Date(itemVal) <= new Date(opVal)) return false;
        } else if (op === '$lt') {
          if (new Date(itemVal) >= new Date(opVal)) return false;
        } else if (op === '$ne') {
          if (itemVal === opVal) return false;
        } else if (op === '$in') {
          if (Array.isArray(opVal) && !opVal.includes(itemVal)) return false;
        }
      }
    } else {
      // Basic strict equality
      if (itemVal !== queryVal) {
        return false;
      }
    }
  }
  return true;
}

// Wrap model operations
const createFallbackModel = (collectionName) => {
  const getCollection = () => {
    const db = loadData();
    return db[collectionName] || [];
  };

  const setCollection = (list) => {
    const db = loadData();
    db[collectionName] = list;
    saveData(db);
  };

  return {
    find: async (query = {}) => {
      let list = getCollection();
      if (Object.keys(query).length > 0) {
        list = list.filter(item => evaluateQuery(item, query));
      }
      return list;
    },
    findOne: async (query = {}) => {
      const list = getCollection();
      return list.find(item => evaluateQuery(item, query)) || null;
    },
    findById: async (id) => {
      const list = getCollection();
      return list.find(item => item._id === id || item.id === id) || null;
    },
    create: async (data) => {
      const list = getCollection();
      const newItem = {
        _id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      };
      list.push(newItem);
      setCollection(list);
      return newItem;
    },
    findOneAndUpdate: async (query, update, options = {}) => {
      const list = getCollection();
      const index = list.findIndex(item => evaluateQuery(item, query));

      if (index === -1) return null;

      const updated = {
        ...list[index],
        ...(update.$set || update),
        updatedAt: new Date().toISOString()
      };
      list[index] = updated;
      setCollection(list);
      return updated;
    },
    findOneAndDelete: async (query) => {
      const list = getCollection();
      const index = list.findIndex(item => evaluateQuery(item, query));

      if (index === -1) return null;

      const deleted = list[index];
      list.splice(index, 1);
      setCollection(list);
      return deleted;
    },
    insertMany: async (items) => {
      const list = getCollection();
      const formatted = items.map(item => ({
        _id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...item
      }));
      setCollection([...list, ...formatted]);
      return formatted;
    },
    deleteMany: async (query = {}) => {
      if (Object.keys(query).length === 0) {
        const len = getCollection().length;
        setCollection([]);
        return { deletedCount: len };
      }
      const list = getCollection();
      const remaining = list.filter(item => !evaluateQuery(item, query));
      const deletedCount = list.length - remaining.length;
      setCollection(remaining);
      return { deletedCount };
    },
    countDocuments: async (query = {}) => {
      let list = getCollection();
      if (Object.keys(query).length > 0) {
        list = list.filter(item => evaluateQuery(item, query));
      }
      return list.length;
    }
  };
};

module.exports = {
  setConnected,
  getConnected,
  createFallbackModel,
  loadData,
  saveData
};
