const Company = require("../models/Company");

const findCompanies = (query, sortSpec, skip, limit) => {
  let q = Company.find(query);
  if (sortSpec && Object.keys(sortSpec).length > 0) {
    // Use case-insensitive, diacritic-insensitive collation for consistent A–Z/Z–A
    q = q.collation({ locale: 'en', strength: 2 }).sort(sortSpec);
  }
  return q.skip(skip).limit(limit);
};

const countCompanies = (query) => Company.countDocuments(query);

const findCompanyById = (id) => Company.findById(id);

const createCompany = (data) => new Company(data).save();

const updateCompanyById = (id, data) => Company.findByIdAndUpdate(id, data, { new: true });

const deleteCompanyById = (id) => Company.findByIdAndDelete(id);

module.exports = {
  findCompanies,
  countCompanies,
  findCompanyById,
  createCompany,
  updateCompanyById,
  deleteCompanyById,
};


