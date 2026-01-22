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
    createAgent: mockCreateAgent,
    deleteAgent: mockDeleteAgent
}));
const mockCreateAgent = jest.fn();
const mockDeleteAgent = jest.fn();

// TODO: Mockear Morgan
jest.unstable_mockModule('morgan', () => ({
    default: () => (req, res, next) => {
        next();
    }
}));


const { default: app } = await import('../../app.js');


describe('Agents Page - Integration Test', () => {

    // Evaluar que contiene un formulario
    it('Debe renderizar la página de new-agent con GET /agents/new', async () => {
        expect.assertions(2);

        const response = await request(app)
            .get('/agents/new');

        expect(response.status).toBe(200);
        expect(response.text).toContain('<form');
    });

    // Crear el mock
    // Crear el agente
    // Redirige correctamente
    it('Debe crear un agente con POST /agents/new', async () => {
        expect.assertions(4);
        const agentData = {
            name: 'John Doe',
            age: 25
        };

        mockCreateAgent.mockResolvedValue({
            ...agentData,
            _id: 'agent123',
            owner: 1
        });

        const response = await request(app)
            .post('/agents/new')
            .send(agentData);

        expect(response.header.location).toBe('/');
        expect(response.status).toBe(302);
        expect(mockCreateAgent).toHaveBeenCalledWith({
            ...agentData,
            owner: 1
        });
        expect(mockCreateAgent).toHaveBeenCalledTimes(1);

    });


    it('Debe eliminar un agente con GET /agents/delete/:agentId',  async () => {
        expect.assertions(2);
        const agentId = '507f1f77bcf86cd799439011';

        mockDeleteAgent.mockResolvedValue(true);

        const response = await request(app)
            .get(`/agents/delete/${agentId}`);

        expect(response.header.location).toBe('/');
        expect(mockDeleteAgent).toHaveBeenCalledTimes(1);

    });

    describe('TDD edit agent', () => {

        // Debe recibir un objectId por paràmetro.
        // Debe devolver un error si el objectId no es válido.
        // Debe verificar el owner del agente
        // Debe crear un agente llamando al servicio (no es necesario implementar).
        // Debe devolver el agente creado.

    });
});