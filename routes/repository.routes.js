const express = require('express');
const router = express.Router();
const repositoryController = require('../controllers/repository.controller');

/**
 * @swagger
 * /api/repositories:
 *   get:
 *     summary: Get all repositories
 *     description: Retrieve a list of all tracked repositories
 *     tags: [Repositories]
 *     responses:
 *       200:
 *         description: A list of repositories
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
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Repository'
 *       500:
 *         description: Server error
 */
router.get('/', repositoryController.getAllRepositories);

/**
 * @swagger
 * /api/repositories/{id}:
 *   get:
 *     summary: Get a repository by ID
 *     description: Retrieve a specific repository by its ID
 *     tags: [Repositories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Repository ID
 *     responses:
 *       200:
 *         description: Repository details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Repository'
 *       404:
 *         description: Repository not found
 *       500:
 *         description: Server error
 */
router.get('/:id', repositoryController.getRepositoryById);

/**
 * @swagger
 * /api/repositories:
 *   post:
 *     summary: Create a new repository
 *     description: Add a new repository to track
 *     tags: [Repositories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - url
 *               - owner
 *             properties:
 *               name:
 *                 type: string
 *                 example: "keploy-ui"
 *               url:
 *                 type: string
 *                 example: "https://github.com/keploy/ui"
 *               description:
 *                 type: string
 *                 example: "Keploy UI components"
 *               owner:
 *                 type: string
 *                 example: "keploy"
 *               status:
 *                 type: string
 *                 enum: [active, inactive, error]
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Repository created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Repository'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', repositoryController.createRepository);

/**
 * @swagger
 * /api/repositories/{id}:
 *   put:
 *     summary: Update a repository
 *     description: Update an existing repository by ID
 *     tags: [Repositories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Repository ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *               description:
 *                 type: string
 *               owner:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, error]
 *     responses:
 *       200:
 *         description: Repository updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Repository'
 *       404:
 *         description: Repository not found
 *       500:
 *         description: Server error
 */
router.put('/:id', repositoryController.updateRepository);

/**
 * @swagger
 * /api/repositories/{id}:
 *   delete:
 *     summary: Delete a repository
 *     description: Delete a repository and its associated data
 *     tags: [Repositories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Repository ID
 *     responses:
 *       200:
 *         description: Repository deleted successfully
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
 *                   example: {}
 *       404:
 *         description: Repository not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', repositoryController.deleteRepository);

module.exports = router;