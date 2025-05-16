const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title } = req.body;

    const projectCount = await Project.countDocuments({ userId });
    if (projectCount >= 4) {
      return res.status(400).json({ error: 'Project limit reached (max 4 projects)' });
    }

    const project = new Project({ userId, title });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ userId });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};
