import prisma from '../lib/prisma.js';

export const getAllCompanies = async () => {
  return await prisma.company.findMany({
    include: { contacts: true }
  });
};

export const getCompanyById = async (id) => {
  return await prisma.company.findUnique({
    where: { id },
    include: { contacts: true }
  });
};

export const createCompany = async (companyData) => {
  const { name, ruc, industry, website, address } = companyData;
  
  return await prisma.company.create({
    data: {
      name,
      ruc,
      industry,
      website,
      address
    }
  });
};

export const updateCompany = async (id, companyData) => {
  const { name, industry, website, address } = companyData;
  
  return await prisma.company.update({
    where: { id },
    data: {
      name,
      ruc,
      industry,
      website,
      address
    }
  });
};

export const deleteCompany = async (id) => {
  return await prisma.company.delete({
    where: { id }
  });
};