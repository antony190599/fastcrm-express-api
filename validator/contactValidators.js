import { param, body, query } from "express-validator";

export const validateCreateContact = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").notEmpty().isEmail().withMessage("Valid email is required"),
  body("phone").optional().isString().withMessage("Phone must be a string"),
  body("title").optional().isString().withMessage("Title must be a string"),
  body("companyId")
    .notEmpty()
    .withMessage("Company ID is required")
    .isUUID()
    .withMessage("Invalid company ID format"),
];

export const validateUpdateContact = [
  param("id").isUUID().withMessage("Invalid contact ID"),
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").notEmpty().isEmail().withMessage("Valid email is required"),
  body("phone").optional().isString().withMessage("Phone must be a string"),
  body("title").optional().isString().withMessage("Title must be a string"),
  body("companyId")
    .notEmpty()
    .withMessage("Company ID is required")
    .isUUID()
    .withMessage("Invalid company ID format"),
];

export const validateGetContact = [
  param("id").isUUID().withMessage("Invalid contact ID"),
];

export const validateGetContacts = [
  query("orderBy")
    .optional()
    .isIn(['company', ''])
    .withMessage("orderBy must be 'company' if provided")
];
