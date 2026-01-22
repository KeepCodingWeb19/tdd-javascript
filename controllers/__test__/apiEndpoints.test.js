import { jest } from '@jest/globals';

import request from 'supertest';


jest.unstable_mockModule('../../lib/sessionManager.js', () => {
    return {
        middleware: (req, res, next) => {
            req.session = { userId: 1 };
            // Imprescindible llamar a next() cuando mockeamos middlewares
            // return res.status(201).json(); 
            next();
        },
        useSessionInViews: (req, res, next) => {
            res.locals.session = req.session || {};
            next();
        },
        guard: (req, res, next) => next(),
    }
});

jest.unstable_mockModule('../../services/agentService.js', () => ({
    getAgentStatistics: mockGetAgentStatistics,
}))
const mockGetAgentStatistics = jest.fn();

// El import de APP siempre justo antes de los tests
const { default: app } = await import('../../app.js');

describe('API Endpoints - Test de Integración', () => {


    describe('GET /api/agents/statistics', () => {


        /**
         * Test 1: Happy Path - Obtener estadísticas correctamente
         */
        it('Debe devolver las estadísticas del usuario autenticado', async () => {
            expect.assertions(3);    
            // Patrón AAA
        
            // ARRANGE
            const mockStats = {
                count: 3,
                averageAge: 30,
                oldest: { name: 'John', age: 28 },
                youngest: { name: 'Alice', age: 21 }
            };
            mockGetAgentStatistics.mockResolvedValue(mockStats);

            // ACT
            const response = await request(app)
                .get('/api/agents/statistics');

            // ASSERT
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            // Siempre que comparamos objetos hacemos una comparación profunda.
            expect(response.body.data).toEqual(mockStats);
        });
    });

});