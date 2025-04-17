const prisma = require('../prismaClient');

// ...existing code...

// Replace the findAll or getContacts method with this non-paginated version
exports.findAll = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany();
    
    return res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving contacts",
      error: error.message
    });
  }
};

// ...existing code...