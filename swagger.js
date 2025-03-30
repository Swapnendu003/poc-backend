const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Keploy Dashboard API',
      version: '1.0.0',
      description: 'API documentation for Keploy Dashboard with Metrics and Charts',
      contact: {
        name: 'Keploy GSoC Team'
      },
      servers: [
        {
          url: 'http://localhost:5000',
          description: 'Development server'
        }
      ]
    },
    components: {
      schemas: {
        Repository: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Repository unique ID'
            },
            name: {
              type: 'string',
              description: 'Repository name'
            },
            url: {
              type: 'string',
              description: 'Repository URL'
            },
            description: {
              type: 'string',
              description: 'Repository description'
            },
            owner: {
              type: 'string',
              description: 'Repository owner'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'error'],
              description: 'Repository status'
            },
            lastSyncTime: {
              type: 'string',
              format: 'date-time',
              description: 'Last time repository was synced'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        TestResult: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Test result unique ID'
            },
            repositoryId: {
              type: 'string',
              description: 'ID of the repository this test belongs to'
            },
            testName: {
              type: 'string',
              description: 'Name of the test'
            },
            status: {
              type: 'string',
              enum: ['passed', 'failed', 'skipped', 'error'],
              description: 'Test status'
            },
            duration: {
              type: 'number',
              description: 'Test duration in milliseconds'
            },
            errorMessage: {
              type: 'string',
              description: 'Error message if test failed'
            },
            commitId: {
              type: 'string',
              description: 'Commit ID associated with this test run'
            },
            commitMessage: {
              type: 'string',
              description: 'Commit message associated with this test run'
            },
            branch: {
              type: 'string',
              description: 'Branch name where test was executed'
            },
            executedBy: {
              type: 'string',
              description: 'User or system that executed the test'
            },
            executedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the test was executed'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        DashboardConfig: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Dashboard config unique ID'
            },
            name: {
              type: 'string',
              description: 'Dashboard name'
            },
            description: {
              type: 'string',
              description: 'Dashboard description'
            },
            isDefault: {
              type: 'boolean',
              description: 'Whether this is the default dashboard'
            },
            userId: {
              type: 'string',
              description: 'ID of user who owns this dashboard'
            },
            widgets: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['chart', 'metric', 'table', 'status'],
                    description: 'Widget type'
                  },
                  title: {
                    type: 'string',
                    description: 'Widget title'
                  },
                  dataSource: {
                    type: 'string',
                    description: 'Data source endpoint'
                  },
                  position: {
                    type: 'object',
                    properties: {
                      x: { type: 'number' },
                      y: { type: 'number' },
                      w: { type: 'number' },
                      h: { type: 'number' }
                    },
                    description: 'Widget position and size'
                  },
                  config: {
                    type: 'object',
                    description: 'Widget specific configuration'
                  }
                }
              },
              description: 'Dashboard widgets'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs
};