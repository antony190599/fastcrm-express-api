// ...existing code...

// Replace the findAll or getTemplates method with this non-paginated version
exports.findAll = async (req, res) => {
  try {
    const templates = await prisma.template.findMany();
    
    return res.status(200).json({
      success: true,
      data: templates
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving templates",
      error: error.message
    });
  }
};
// ...existing code...