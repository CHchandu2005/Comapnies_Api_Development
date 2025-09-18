const express = require("express");
const { 
  getCompanies,
  getCompanyById,
  addCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");
const upload = require("../middleware/upload");


const validate = require("../middleware/validate");
const { companyBodySchema, listQuerySchema, objectIdParamSchema } = require("../validation");
const router = express.Router();


router.get("/", validate(listQuerySchema, 'query'), getCompanies);
router.get("/:id", validate(objectIdParamSchema, 'params'), getCompanyById);

router.post("/", upload.single("image"), validate(companyBodySchema, 'body'), addCompany);
router.put("/:id", upload.single("image"), validate(objectIdParamSchema, 'params'), validate(companyBodySchema, 'body'), updateCompany);
router.delete("/:id", validate(objectIdParamSchema, 'params'), deleteCompany);

module.exports = router;


