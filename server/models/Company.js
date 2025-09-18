const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true, trim: true },
    industry: { type: String, required: true, index: true, trim: true },
    location: { type: String, required: true, index: true, trim: true },
    size: { type: Number, required: true, index: true, min: 0 },
    foundedYear: { type: Number, required: true, index: true },
    isActive: { type: Boolean, required: true, default: true, index: true },
    description: { type: String, required: true, index: true, trim: true },
    image: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
