import prisma from '../lib/prisma.js';

export const getAllContacts = async () => {
  return await prisma.contact.findMany({
    include: { company: true }
  });
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
