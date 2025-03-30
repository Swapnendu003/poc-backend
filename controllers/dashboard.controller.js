const DashboardConfig = require('../models/dashboardConfig.model');

exports.getDashboardConfig = async (req, res) => {
  try {
    const { userId } = req.query;
    let query = userId ? { userId } : { isDefault: true };
    let dashboardConfig = await DashboardConfig.findOne(query);

    if (!dashboardConfig && userId) {
      dashboardConfig = await DashboardConfig.findOne({ isDefault: true });
    }

    if (!dashboardConfig) {
      return res.status(200).json({
        success: true,
        data: {
          name: 'Default Dashboard',
          widgets: []
        }
      });
    }

    res.status(200).json({
      success: true,
      data: dashboardConfig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

exports.updateDashboardConfig = async (req, res) => {
  try {
    const { userId } = req.query;
    const { name, widgets, description } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    let dashboardConfig = await DashboardConfig.findOne({ userId });

    if (!dashboardConfig) {
      dashboardConfig = new DashboardConfig({
        name: name || 'My Dashboard',
        description: description || '',
        userId,
        widgets: widgets || [],
        isDefault: false
      });
    } else {
      dashboardConfig.name = name || dashboardConfig.name;
      dashboardConfig.description = description || dashboardConfig.description;
      dashboardConfig.widgets = widgets || dashboardConfig.widgets;
    }

    await dashboardConfig.save();

    res.status(200).json({
      success: true,
      data: dashboardConfig
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

exports.createDefaultDashboard = async (req, res) => {
  try {
    const existingDefault = await DashboardConfig.findOne({ isDefault: true });

    if (existingDefault) {
      return res.status(400).json({
        success: false,
        error: 'Default dashboard already exists'
      });
    }

    const defaultDashboard = new DashboardConfig({
      name: 'Default Dashboard',
      description: 'System default dashboard configuration',
      isDefault: true,
      widgets: [
        {
          type: 'metric',
          title: 'Test Pass Rate',
          dataSource: 'metrics/summary',
          position: { x: 0, y: 0, w: 3, h: 1 },
          config: { metricKey: 'passRate', suffix: '%' }
        },
        {
          type: 'metric',
          title: 'Total Tests',
          dataSource: 'metrics/summary',
          position: { x: 3, y: 0, w: 3, h: 1 },
          config: { metricKey: 'totalTests' }
        },
        {
          type: 'chart',
          title: 'Test Results Trend',
          dataSource: 'metrics/time-series',
          position: { x: 0, y: 1, w: 6, h: 2 },
          config: { 
            chartType: 'line',
            period: '7d',
            keys: ['passed', 'failed', 'skipped', 'error']
          }
        },
        {
          type: 'chart',
          title: 'Test Status Distribution',
          dataSource: 'metrics/summary',
          position: { x: 6, y: 0, w: 3, h: 2 },
          config: { 
            chartType: 'pie',
            dataKey: 'testsByStatus'
          }
        },
        {
          type: 'table',
          title: 'Recent Failed Tests',
          dataSource: 'custom',
          position: { x: 0, y: 3, w: 12, h: 2 },
          config: { 
            endpoint: '/api/metrics/repositories/:repoId/tests',
            params: { status: 'failed', limit: 10 },
            columns: ['testName', 'executedAt', 'duration', 'errorMessage']
          }
        }
      ]
    });

    await defaultDashboard.save();

    res.status(201).json({
      success: true,
      data: defaultDashboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};