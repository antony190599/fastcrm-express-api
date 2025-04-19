import prisma from '../lib/prisma.js';

export const getAllContacts = async (orderBy, pagination) => {
  // Define ordering options based on the orderBy parameter
  let orderOptions = [];
  
  if (orderBy === 'company') {
    // For company ordering, we need to use the correct format for orderBy with relations
    orderOptions = [
      { company: { name: 'asc' } },
      { lastName: 'asc' },
      { firstName: 'asc' }
    ];
  } else {
    // Default ordering by lastName and firstName
    orderOptions = [
      { lastName: 'asc' },
      { firstName: 'asc' }
    ];
  }
  
  // Get total count for pagination
  const total = await prisma.contact.count();
  
  // Get paginated contacts
  const contacts = await prisma.contact.findMany({
    include: { company: true },
    orderBy: orderOptions,
    skip: pagination.skip,
    take: pagination.limit
  });
  
  return { contacts, total };
};

export const getContactById = async (id) => {
  return await prisma.contact.findUnique({
    where: { id },
    include: { company: true }
  });
};

export const createContact = async (contactData) => {
  const { firstName, lastName, email, phone, title, companyId } = contactData;
  
  return await prisma.contact.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      title,
      ...(companyId && { company: { connect: { id: companyId } } })
    },
    include: { company: true }
  });
};

export const updateContact = async (id, contactData) => {
  const { firstName, lastName, email, phone, title, companyId } = contactData;
  
  return await prisma.contact.update({
    where: { id },
    data: {
      firstName,
      lastName,
      email,
      phone,
      title,
      ...(companyId && { company: { connect: { id: companyId } } }),
      ...(!companyId && { companyId: null })
    },
    include: { company: true }
  });
};

export const deleteContact = async (id) => {
  return await prisma.contact.delete({
    where: { id }
  });
};