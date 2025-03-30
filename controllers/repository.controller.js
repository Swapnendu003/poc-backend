const Repository = require('../models/repository.model');

exports.getAllRepositories = async (req, res) => {
  try {
    const repositories = await Repository.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: repositories.length,
      data: repositories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};


exports.getRepositoryById = async (req, res) => {
  try {
    const repository = await Repository.findById(req.params.id);
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        error: 'Repository not found'
      });
    }

    res.status(200).json({
      success: true,
      data: repository
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

exports.createRepository = async (req, res) => {
  try {
    const repository = await Repository.create(req.body);
    
    res.status(201).json({
      success: true,
      data: repository
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error',
        message: error.message
      });
    }
  }
};

exports.updateRepository = async (req, res) => {
  try {
    const repository = await Repository.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        error: 'Repository not found'
      });
    }

    res.status(200).json({
      success: true,
      data: repository
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};


exports.deleteRepository = async (req, res) => {
  try {
    const repository = await Repository.findByIdAndDelete(req.params.id);
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        error: 'Repository not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};