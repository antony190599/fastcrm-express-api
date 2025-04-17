import * as companyService from '../services/companyService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import { toCompanyDto, toCompanyDtoList } from '../dtos/companyDto.js';

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await companyService.getAllCompanies();
    const companyDtos = toCompanyDtoList(companies);
    res.json(successResponse(companyDtos, 'Companies fetched successfully'));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse('Error fetching companies', [error.message]));
  }
};

export const getCompanyById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const company = await companyService.getCompanyById(id);
    
    if (!company) {
      return res.status(404).json(errorResponse('Company not found'));
    }
    
    const companyDto = toCompanyDto(company);
    res.json(successResponse(companyDto, 'Company fetched successfully'));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse('Error fetching company', [error.message]));
  }
};

export const createCompany = async (req, res) => {
  const { name, ruc, industry, website, address } = req.body;
  
  try {
    const company = await companyService.createCompany({
      name,
      ruc,
      industry,
      website,
      address
    });
    
    const companyDto = toCompanyDto(company);
    res.status(201).json(successResponse(companyDto, 'Company created successfully'));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse('Error creating company', [error.message]));
  }
};

export const updateCompany = async (req, res) => {
  const { id } = req.params;
  const { name, ruc, industry, website, address } = req.body;
  
  try {
    const company = await companyService.updateCompany(id, {
      name,
      ruc,
      industry,
      website,
      address
    });
    
    const companyDto = toCompanyDto(company);
    res.json(successResponse(companyDto, 'Company updated successfully'));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse('Error updating company', [error.message]));
  }
};

export const deleteCompany = async (req, res) => {
  const { id } = req.params;
  
  try {
    await companyService.deleteCompany(id);
    
    res.json(successResponse(null, 'Company deleted successfully'));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse('Error deleting company', [error.message]));
  }
};