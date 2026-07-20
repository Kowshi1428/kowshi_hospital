const { getConnected, createFallbackModel } = require("./dbManager");

class FallbackQuery {
  constructor(promise) {
    this.promise = promise;
    this.sortFields = null;
    this.limitCount = null;
  }

  sort(sortObj) {
    this.sortFields = sortObj;
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  select(fields) {
    return this;
  }

  async then(onFulfilled, onRejected) {
    try {
      let data = await this.promise;
      
      // Perform local sorting if specified
      if (this.sortFields) {
        const keys = Object.keys(this.sortFields);
        data = [...data].sort((a, b) => {
          for (const key of keys) {
            const dir = this.sortFields[key];
            const valA = a[key] !== undefined ? a[key] : '';
            const valB = b[key] !== undefined ? b[key] : '';
            
            if (valA < valB) return dir === -1 ? 1 : -1;
            if (valA > valB) return dir === -1 ? -1 : 1;
          }
          return 0;
        });
      }

      // Perform local slice limit if specified
      if (this.limitCount !== null) {
        data = data.slice(0, this.limitCount);
      }

      return onFulfilled ? onFulfilled(data) : data;
    } catch (err) {
      if (onRejected) {
        return onRejected(err);
      }
      throw err;
    }
  }
}

function wrapModel(mongooseModel, collectionName) {
  const fallback = createFallbackModel(collectionName);

  // ModelInstance represents a constructable class allowing instantiating with 'new'
  class ModelInstance {
    constructor(data = {}) {
      this.data = data;
      
      // Mirror the fields on the root object so properties can be accessed directly (e.g. item.name)
      Object.assign(this, data);

      // Apply schema defaults if fallback is active
      if (!getConnected()) {
        const paths = mongooseModel.schema.paths;
        for (const pathName in paths) {
          if (this[pathName] === undefined && paths[pathName].defaultValue !== undefined) {
            const def = paths[pathName].defaultValue;
            this[pathName] = typeof def === 'function' ? def() : def;
          }
        }
      }
    }

    async save() {
      // Gather properties set on this instance (including any mutated fields)
      const dataToSave = {};
      
      // Filter out functions and private properties
      for (const key in this) {
        if (typeof this[key] !== 'function' && key !== 'data') {
          dataToSave[key] = this[key];
        }
      }

      if (getConnected()) {
        const item = new mongooseModel(dataToSave);
        const savedItem = await item.save();
        
        // Sync generated fields like _id, createdAt
        Object.assign(this, savedItem.toObject ? savedItem.toObject() : savedItem);
        return this;
      } else {
        const savedItem = await fallback.create(dataToSave);
        Object.assign(this, savedItem);
        return this;
      }
    }
  }

  // Define static Mongoose-like collection queries
  ModelInstance.find = (query) => {
    if (getConnected()) {
      return mongooseModel.find(query);
    }
    return new FallbackQuery(fallback.find(query));
  };

  ModelInstance.findOne = (query) => {
    if (getConnected()) {
      return mongooseModel.findOne(query);
    }
    return fallback.findOne(query);
  };

  ModelInstance.findById = (id) => {
    if (getConnected()) {
      return mongooseModel.findById(id);
    }
    return fallback.findById(id);
  };

  ModelInstance.create = async (data) => {
    // Wrap create to also apply defaults if using fallback
    let dataToSave = { ...data };
    if (!getConnected()) {
      const paths = mongooseModel.schema.paths;
      for (const pathName in paths) {
        if (dataToSave[pathName] === undefined && paths[pathName].defaultValue !== undefined) {
          const def = paths[pathName].defaultValue;
          dataToSave[pathName] = typeof def === 'function' ? def() : def;
        }
      }
    }

    if (getConnected()) {
      const item = new mongooseModel(dataToSave);
      return await item.save();
    }
    return await fallback.create(dataToSave);
  };

  ModelInstance.findOneAndUpdate = (query, update, options) => {
    return getConnected() 
      ? mongooseModel.findOneAndUpdate(query, update, { new: true, ...options }) 
      : fallback.findOneAndUpdate(query, update, options);
  };

  ModelInstance.findOneAndDelete = (query) => {
    return getConnected() ? mongooseModel.findOneAndDelete(query) : fallback.findOneAndDelete(query);
  };

  ModelInstance.insertMany = (items) => {
    let itemsToSave = items;
    if (!getConnected()) {
      const paths = mongooseModel.schema.paths;
      itemsToSave = items.map(item => {
        let copy = { ...item };
        for (const pathName in paths) {
          if (copy[pathName] === undefined && paths[pathName].defaultValue !== undefined) {
            const def = paths[pathName].defaultValue;
            copy[pathName] = typeof def === 'function' ? def() : def;
          }
        }
        return copy;
      });
    }
    return getConnected() ? mongooseModel.insertMany(itemsToSave) : fallback.insertMany(itemsToSave);
  };

  ModelInstance.deleteMany = (query) => {
    return getConnected() ? mongooseModel.deleteMany(query) : fallback.deleteMany(query);
  };

  ModelInstance.countDocuments = (query) => {
    if (getConnected()) {
      return mongooseModel.countDocuments(query);
    }
    return fallback.countDocuments(query);
  };

  return ModelInstance;
}

module.exports = wrapModel;
