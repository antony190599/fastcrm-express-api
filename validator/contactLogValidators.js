import { param, body, query } from "express-validator";

export const validateCreateContactLog = [
  body("contactId")
    .isUUID()
    .withMessage("Valid contact ID is required"),
  body("method")
    .isIn(["email", "whatsapp", "call", "meeting"])
    .withMessage("Method must be one of: email, whatsapp, call, meeting"),
  body("templateId")
    .optional()
    .isString()
    .withMessage("Template ID must be a string"),
  body("templateName")
    .optional()
    .isString()
    .withMessage("Template name must be a string"),
  body("messageId")
    .optional()
    .isString()
    .withMessage("Message ID must be a string"),
  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string"),
  body("status")
    .optional()
    .isIn(["success", "pending", "failed"])
    .withMessage("Status must be one of: success, pending, failed"),
];

export const validateUpdateContactLog = [
  param("id")
    .isUUID()
    .withMessage("Invalid contact log ID"),
  body("method")
    .optional()
    .isIn(["email", "whatsapp", "call", "meeting"])
    .withMessage("Method must be one of: email, whatsapp, call, meeting"),
  body("templateId")
    .optional()
    .isString()
    .withMessage("Template ID must be a string"),
  body("templateName")
    .optional()
    .isString()
    .withMessage("Template name must be a string"),
  body("messageId")
    .optional()
    .isString()
    .withMessage("Message ID must be a string"),
  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string"),
  body("status")
    .optional()
    .isIn(["success", "pending", "failed"])
    .withMessage("Status must be one of: success, pending, failed"),
];

export const validateGetContactLog = [
  param("id").isUUID().withMessage("Invalid contact log ID"),
];

export const validateGetContactLogs = [
  query("contactId")
    .optional()
    .isUUID()
    .withMessage("Invalid contact ID"),
  query("method")
    .optional()
    .isIn(["email", "whatsapp", "call", "meeting"])
    .withMessage("Invalid method"),
  query("status")
    .optional()
    .isIn(["success", "pending", "failed"])
    .withMessage("Invalid status"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
];
