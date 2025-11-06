import express from "express";
import {
  registerCompany,
  loginCompany,
  getOpportunities,
  addOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getQualifiedApplicants,
} from "../controllers/companyController.js";

const router = express.Router();

// -------------------- Auth --------------------
router.post("/register", registerCompany);
router.post("/login", loginCompany);

// -------------------- Opportunities --------------------
router.get("/opportunities", getOpportunities);
router.post("/opportunities", addOpportunity);
router.patch("/opportunities/:id", updateOpportunity);
router.delete("/opportunities/:id", deleteOpportunity);

// -------------------- Applicants --------------------
router.get("/applicants/:opportunityId", getQualifiedApplicants); // filtered applicants for the job

export default router;
