const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metrics.controller');

/**
 * @swagger
 * /api/metrics/summary:
 *   get:
 *     summary: Get metrics summary
 *     description: Retrieve overall metrics summary including test pass rates and counts
 *     tags: [Metrics]
 *     responses:
 *       200:
 *         description: Metrics summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRepositories:
 *                       type: number
 *                       example: 6
 *                     totalTests:
 *                       type: number
 *                       example: 450
 *                     testsByStatus:
 *                       type: object
 *                       properties:
 *                         passed:
 *                           type: number
 *                           example: 375
 *                         failed:
 *                           type: number
 *                           example: 45
 *                         skipped:
 *                           type: number
 *                           example: 20
 *                         error:
 *                           type: number
 *                           example: 10
 *                     passRate:
 *                       type: string
 *                       example: "83.33"
 *                     testsLast7Days:
 *                       type: number
 *                       example: 120
 *                     averageDuration:
 *                       type: number
 *                       example: 523
 *       500:
 *         description: Server error
 */
router.get('/summary', metricsController.getMetricsSummary);

/**
 * @swagger
 * /api/metrics/repositories/{id}/tests:
 *   get:
 *     summary: Get repository tests
 *     description: Retrieve test results for a specific repository
 *     tags: [Metrics]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Repository ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of results to return
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [passed, failed, skipped, error]
 *         description: Filter by test status
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: executedAt
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Repository test results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 20
 *                 statusCounts:
 *                   type: object
 *                   properties:
 *                     passed:
 *                       type: number
 *                       example: 75
 *                     failed:
 *                       type: number
 *                       example: 15
 *                     skipped:
 *                       type: number
 *                       example: 5
 *                     error:
 *                       type: number
 *                       example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TestResult'
 *       500:
 *         description: Server error
 */
router.get('/repositories/:id/tests', metricsController.getRepositoryTests);

/**
 * @swagger
 * /api/metrics/time-series:
 *   get:
 *     summary: Get time-series metrics
 *     description: Retrieve time-series data for charts based on specified period
 *     tags: [Metrics]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [24h, 7d, 30d, 90d]
 *           default: 7d
 *         description: Time period for data
 *       - in: query
 *         name: repositoryId
 *         schema:
 *           type: string
 *         description: Filter by repository ID
 *     responses:
 *       200:
 *         description: Time-series metrics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "2025-03-25"
 *                       total:
 *                         type: number
 *                         example: 45
 *                       passed:
 *                         type: number
 *                         example: 38
 *                       failed:
 *                         type: number
 *                         example: 5
 *                       skipped:
 *                         type: number
 *                         example: 2
 *                       error:
 *                         type: number
 *                         example: 0
 *                       avgDuration:
 *                         type: number
 *                         example: 532
 *       500:
 *         description: Server error
 */
router.get('/time-series', metricsController.getTimeSeriesMetrics);

module.exports = router;