const service = require("../services/companyService");

const getCompanies = async (req, res) => {

  const result = await service.listCompanies(req.query);
  res.status(200).json({ success: true, ...result });
};

const getCompanyById = async (req, res) => {
  const company = await service.getCompany(req.params.id);
  res.json({ success: true, company });
};

const addCompany = async (req, res) => {
  const company = await service.createCompany(req.body, req.file);
  res.status(201).json({ success: true, message: "Company created", company });
};

const updateCompany = async (req, res) => {
  const updated = await service.updateCompany(req.params.id, req.body, req.file);
  res.json({ success: true, message: "Company updated", company: updated });
};

const deleteCompany = async (req, res) => {
  await service.deleteCompany(req.params.id);
  res.json({ success: true, message: "Company deleted" });
};

module.exports = {
  getCompanies,
  getCompanyById,
  addCompany,
  updateCompany,
  deleteCompany,
};


