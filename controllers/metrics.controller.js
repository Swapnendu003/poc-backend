const TestResult = require('../models/testResult.model');
const Repository = require('../models/repository.model');
const mongoose = require('mongoose');

exports.getMetricsSummary = async (req, res) => {
  try {
    const statusCounts = await TestResult.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    const totalRepositories = await Repository.countDocuments();
    
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const last7DaysTests = await TestResult.countDocuments({
      executedAt: { $gte: last7Days }
    });
    
    const avgDuration = await TestResult.aggregate([
      {
        $group: {
          _id: null,
          averageDuration: { $avg: '$duration' }
        }
      }
    ]);

    const formattedStatusCounts = {};
    statusCounts.forEach(item => {
      formattedStatusCounts[item._id] = item.count;
    });
    
    const totalTests = Object.values(formattedStatusCounts).reduce((acc, count) => acc + count, 0);
    
    const passRate = totalTests > 0 
      ? ((formattedStatusCounts.passed || 0) / totalTests * 100).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalRepositories,
        totalTests,
        testsByStatus: formattedStatusCounts,
        passRate,
        testsLast7Days: last7DaysTests,
        averageDuration: avgDuration.length ? avgDuration[0].averageDuration : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

exports.getRepositoryTests = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 20, status, sort = 'executedAt', order = 'desc' } = req.query;

    const query = { repositoryId: new mongoose.Types.ObjectId(id) };
    
    if (status) {
      query.status = status;
    }

    const sortOption = {};
    sortOption[sort] = order === 'desc' ? -1 : 1;

    const tests = await TestResult.find(query)
      .sort(sortOption)
      .limit(parseInt(limit))
      .populate('repositoryId', 'name url');

    const statusCounts = await TestResult.aggregate([
      {
        $match: { repositoryId: new mongoose.Types.ObjectId(id) }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStatusCounts = {};
    statusCounts.forEach(item => {
      formattedStatusCounts[item._id] = item.count;
    });
    
    res.status(200).json({
      success: true,
      count: tests.length,
      statusCounts: formattedStatusCounts,
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

exports.getTimeSeriesMetrics = async (req, res) => {
  try {
    const { period = '7d', repositoryId } = req.query;
    
    const endDate = new Date();
    const startDate = new Date();
    
    switch(period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }
    
    const matchQuery = {
      executedAt: { $gte: startDate, $lte: endDate }
    };
    
    if (repositoryId) {
      matchQuery.repositoryId = new mongoose.Types.ObjectId(repositoryId);
    }
    let groupIdFormat;
    let dateFormat;
    
    if (period === '24h') {
      groupIdFormat = { 
        year: { $year: '$executedAt' }, 
        month: { $month: '$executedAt' }, 
        day: { $dayOfMonth: '$executedAt' }, 
        hour: { $hour: '$executedAt' } 
      };
      dateFormat = '%Y-%m-%d %H:00';
    } else {
      groupIdFormat = { 
        year: { $year: '$executedAt' }, 
        month: { $month: '$executedAt' }, 
        day: { $dayOfMonth: '$executedAt' } 
      };
      dateFormat = '%Y-%m-%d';
    }
    
    const sortStage = period === '24h' 
      ? { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 }
      : { '_id.year': 1, '_id.month': 1, '_id.day': 1 };

    const timeSeriesData = await TestResult.aggregate([
      {
        $match: matchQuery
      },
      {
        $group: {
          _id: {
            date: groupIdFormat,
            status: '$status'
          },
          count: { $sum: 1 },
          avgDuration: { $avg: '$duration' }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          metrics: { 
            $push: { 
              status: '$_id.status', 
              count: '$count',
              avgDuration: '$avgDuration'
            } 
          },
          totalCount: { $sum: '$count' },
          overallAvgDuration: { $avg: '$avgDuration' }
        }
      },
      {
        $sort: sortStage
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: dateFormat,
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: '$_id.day',
                  hour: period === '24h' ? '$_id.hour' : 0
                }
              }
            }
          },
          metrics: 1,
          totalCount: 1,
          overallAvgDuration: 1
        }
      }
    ]);
    
    const formattedData = timeSeriesData.map(entry => {
      const result = {
        date: entry.date,
        total: entry.totalCount,
        avgDuration: entry.overallAvgDuration
      };
      
      entry.metrics.forEach(metric => {
        result[metric.status] = metric.count;
      });
      
      return result;
    });
    
    res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};