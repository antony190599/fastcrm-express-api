const prisma = require('../prismaClient');

// ...existing code...

// Replace the findAll or getCompanies method with this non-paginated version
exports.findAll = async (req, res) => {
  try {
    const companies = await prisma.company.findMany();
    
    return res.status(200).json({
      success: true,
      data: companies
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving companies",
      error: error.message
    });
  }
};

// ...existing code...