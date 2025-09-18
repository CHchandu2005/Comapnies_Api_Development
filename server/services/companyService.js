const AppError = require("../utils/errorHandler");
const cloudinary = require("../config/cloudinary");
const repo = require("../repositories/companyRepository");

const uploadToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "companies" },
      (error, result) => {
        if (error) return reject(new AppError("Image upload failed", 500));
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });

const buildQuery = ({ name, description, industry, location, sizeMin, sizeMax, foundedStart, foundedEnd, isActive }) => {
  const query = {};

  // Name/description search
  if (name || description) {
    const clauses = [];
    if (name) clauses.push({ name: { $regex: String(name), $options: 'i' } });
    if (description) clauses.push({ description: { $regex: String(description), $options: 'i' } });
    if (clauses.length > 0) query.$or = clauses;
  }

  // Industry: CSV list
  if (industry) {
    const industries = String(industry).split(',').map(s => s.trim()).filter(Boolean);
    if (industries.length > 0) query.industry = { $in: industries };
  }

  // Location: CSV multi-select
  if (location) {
    const locations = String(location).split(',').map(s => s.trim()).filter(Boolean);
    if (locations.length > 0) query.location = { $in: locations };
  }

  // Size (employees) range
  const minSize = sizeMin !== undefined && sizeMin !== '' ? Number(sizeMin) : undefined;
  const maxSize = sizeMax !== undefined && sizeMax !== '' ? Number(sizeMax) : undefined;
  if (minSize !== undefined || maxSize !== undefined) {
    const sizeClause = {};
    if (minSize !== undefined && !Number.isNaN(minSize)) sizeClause.$gte = minSize;
    if (maxSize !== undefined && !Number.isNaN(maxSize)) sizeClause.$lte = maxSize;
    if (Object.keys(sizeClause).length > 0) query.size = sizeClause;
  }

  // Founded year range
  const startYear = foundedStart !== undefined && foundedStart !== '' ? Number(foundedStart) : undefined;
  const endYear = foundedEnd !== undefined && foundedEnd !== '' ? Number(foundedEnd) : undefined;
  if (startYear !== undefined || endYear !== undefined) {
    const yearClause = {};
    if (startYear !== undefined && !Number.isNaN(startYear)) yearClause.$gte = startYear;
    if (endYear !== undefined && !Number.isNaN(endYear)) yearClause.$lte = endYear;
    if (Object.keys(yearClause).length > 0) query.foundedYear = yearClause;
  }

  // Active flag
  if (isActive !== undefined && isActive !== '') {
    if (isActive === 'true' || isActive === true) query.isActive = true;
    else if (isActive === 'false' || isActive === false) query.isActive = false;
  }

  return query;
};

const buildSortSpec = ({ sortName, sortFounded, sortSize, sort, order }) => {
  const sortSpec = {};
  if (sortName) sortSpec.name = sortName === 'desc' ? -1 : 1;
  if (sortFounded) sortSpec.foundedYear = sortFounded === 'desc' ? -1 : 1;
  if (sortSize) sortSpec.size = sortSize === 'desc' ? -1 : 1;
  if (Object.keys(sortSpec).length === 0 && sort) {
    const legacyField = String(sort).replace("-", "");
    sortSpec[legacyField] = order === "desc" ? -1 : 1;
  }
  return sortSpec;
};

const listCompanies = async (params) => {
  let { page = 1, limit = 10 } = params;
  page = Number(page) > 0 ? Number(page) : 1;
  limit = Number(limit) > 0 ? Number(limit) : 10;

  const query = buildQuery(params);
  // Debug: log filters and query
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('listCompanies params:', params);
    // eslint-disable-next-line no-console
    console.log('listCompanies query:', JSON.stringify(query));
  }
  const totalItems = await repo.countCompanies(query);
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const safePage = Math.min(page, totalPages);
  const skip = (safePage - 1) * limit;
  const sortSpec = buildSortSpec(params);

  const companies = await repo.findCompanies(query, sortSpec, skip, limit);
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('listCompanies totals:', { totalItems, totalPages, safePage, returned: companies.length });
  }
  return { companies, page: safePage, totalPages, totalItems, limit };
};

const getCompany = async (id) => {
  const company = await repo.findCompanyById(id);
  if (!company) throw new AppError("Company not found", 404);
  return company;
};

const createCompany = async (body, file) => {
  if (!body.name) throw new AppError("name is required", 400);

  let imageUrl = body.image;
  if (file) {
    try {
      imageUrl = await uploadToCloudinary(file.buffer);
    } catch (e) {
      imageUrl = imageUrl || "";
    }
  }

  // Normalize legacy fields if any
  const size = body.size ?? body.employeeCount;
  const location = body.location ?? body.headquarters;

  return repo.createCompany({
    name: body.name,
    industry: body.industry,
    location,
    size,
    foundedYear: body.foundedYear,
    isActive: body.isActive !== undefined ? body.isActive : true,
    description: body.description,
    image: imageUrl,
  });
};

const updateCompany = async (id, body, file) => {
  const updateData = { ...body };
  if (file) {
    const newImageUrl = await uploadToCloudinary(file.buffer);
    updateData.image = newImageUrl;
  }
  if (updateData.employeeCount !== undefined && updateData.size === undefined) {
    updateData.size = updateData.employeeCount;
    delete updateData.employeeCount;
  }
  if (updateData.headquarters !== undefined && updateData.location === undefined) {
    updateData.location = updateData.headquarters;
    delete updateData.headquarters;
  }
  const updated = await repo.updateCompanyById(id, updateData);
  if (!updated) throw new AppError("Company not found", 404);
  return updated;
};

const deleteCompany = async (id) => {
  const deleted = await repo.deleteCompanyById(id);
  if (!deleted) throw new AppError("Company not found", 404);
  return true;
};

module.exports = {
  listCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
};


