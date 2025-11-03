const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema({
  module_name: { type: String, required: true },  // works for both module/submodule
  icon: { type: String },
  path: { type: String },
  key: { type: String },
  position: { type: String, unique: true },
  
  // self-reference for hierarchy
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Module", default: null },
}, { timestamps: true });

module.exports = mongoose.model("Module", ModuleSchema);
