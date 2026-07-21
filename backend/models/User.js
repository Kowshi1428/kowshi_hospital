const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { getConnected, createFallbackModel } = require("../config/dbManager");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
}, { timestamps: true });

UserSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const MongooseUser = mongoose.model("User", UserSchema);
const fallback = createFallbackModel("users");

module.exports = {
  find: (query) => getConnected() ? MongooseUser.find(query) : fallback.find(query),
  findOne: async (query) => {
    if (getConnected()) {
      return MongooseUser.findOne(query);
    }
    const user = await fallback.findOne(query);
    if (user && !user.comparePassword) {
      user.comparePassword = async function(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
      };
    }
    return user;
  },
  create: async (data) => {
    if (getConnected()) {
      const item = new MongooseUser(data);
      return await item.save();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    return await fallback.create({
      ...data,
      password: hashedPassword
    });
  },
  deleteMany: (query) => getConnected() ? MongooseUser.deleteMany(query) : fallback.deleteMany(query)
};
