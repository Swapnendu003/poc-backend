const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

/**
 * @swagger
 * /api/dashboard/config:
 *   get:
 *     summary: Get dashboard configuration
 *     description: Retrieve dashboard configuration for the current user or the default dashboard
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID to get specific dashboard configuration
 *     responses:
 *       200:
 *         description: Dashboard configuration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DashboardConfig'
 *       500:
 *         description: Server error
 */
router.get('/config', dashboardController.getDashboardConfig);

/**
 * @swagger
 * /api/dashboard/config:
 *   put:
 *     summary: Update dashboard configuration
 *     description: Update or create dashboard configuration for a user
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID for dashboard configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My Custom Dashboard"
 *               description:
 *                 type: string
 *                 example: "Custom dashboard for tracking specific metrics"
 *               widgets:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [chart, metric, table, status]
 *                       example: "chart"
 *                     title:
 *                       type: string
 *                       example: "Test Pass Rate Trend"
 *                     dataSource:
 *                       type: string
 *                       example: "metrics/time-series"
 *                     position:
 *                       type: object
 *                       properties:
 *                         x:
 *                           type: number
 *                           example: 0
 *                         y:
 *                           type: number
 *                           example: 0
 *                         w:
 *                           type: number
 *                           example: 6
 *                         h:
 *                           type: number
 *                           example: 2
 *                     config:
 *                       type: object
 *                       example: {
 *                         "chartType": "line",
 *                         "period": "7d",
 *                         "keys": ["passed", "failed"]
 *                       }
 *     responses:
 *       200:
 *         description: Dashboard configuration updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DashboardConfig'
 *       400:
 *         description: Validation error or missing user ID
 *       500:
 *         description: Server error
 */
router.put('/config', dashboardController.updateDashboardConfig);

/**
 * @swagger
 * /api/dashboard/config/default:
 *   post:
 *     summary: Create default dashboard
 *     description: Create a system default dashboard configuration (admin only)
 *     tags: [Dashboard]
 *     responses:
 *       201:
 *         description: Default dashboard created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DashboardConfig'
 *       400:
 *         description: Default dashboard already exists
 *       500:
 *         description: Server error
 */
router.post('/config/default', dashboardController.createDefaultDashboard);

module.exports = router;