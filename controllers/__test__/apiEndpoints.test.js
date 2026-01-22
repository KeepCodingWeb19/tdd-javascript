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
        const ENDPOINT = '/api/agents/statistics';

        beforeEach(() => {
            // Para cada uno de los test, entramos con los mocks limpios
            jest.resetAllMocks();
            jest.clearAllMocks();
        });

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
                .get(ENDPOINT);

            // ASSERT
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            // Siempre que comparamos objetos hacemos una comparación profunda.
            expect(response.body.data).toEqual(mockStats);
        });

        /**
         * TEST 2: Caso sin agentes
         * 
         * EDGE CASE: ¿Qué pasa cuando el usuario no tiene agentes?
         */
        it('Debe devolver estadísticas vacías si el usuario no tiene agentes', async () => {
            expect.assertions(2);
            const emptyStats = {
                count: 0,
                averageAge: 0,
                oldest: null,
                youngest: null
            };
            mockGetAgentStatistics.mockResolvedValue(emptyStats);

            const response = await request(app)
                .get(ENDPOINT);

            expect(response.body.success).toBe(true);
            expect(response.body.data.count).toBe(0);
        });

        /**
         * TEST 3: Error del servicio
         * 
         * CONCEPTO: Los tests también deben cubrir errores
         */
        test('Debe manejar los errores del servidor correctamente (500)', async () => {
            expect.assertions(1);
            
            mockGetAgentStatistics.mockRejectedValue(
                new Error('Database error')
            );

            const response = await request(app)
                .get(ENDPOINT);

            expect(response.status).toBe(500);

        });

        test('Debe devolver un 200', async () => {
            expect.assertions(1);

            const response = await request(app).get(ENDPOINT);

            expect(response.status).toBe(200);
        });

    });

    // describe('POST /api/calculate/price', () => {


    // });

});