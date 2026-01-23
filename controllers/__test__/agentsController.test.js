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
    deleteAgent: mockDeleteAgent,
    getAgentsByOwner: mockGetAgentsByOwner,
    updateAgent: mockUpdateAgent,
}));
const mockCreateAgent = jest.fn();
const mockDeleteAgent = jest.fn();
const mockGetAgentsByOwner = jest.fn();
const mockUpdateAgent = jest.fn();

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
        it('Debe recibir un objectId por paràmetro', async () => {
            expect.assertions(1);

            const agentId = '507f1f77bcf86cd799439011';

            mockGetAgentsByOwner.mockResolvedValue([{
                _id: agentId,
                name: 'John Doe',
                age: 25,
                owner: 1
            }]);

            const response = await request(app)
                .put(`/agents/edit/${agentId}`);
            
            expect(response.status).toBe(200);
        });

        // Debe devolver un error si el objectId no es válido.
        it('Debe devolver un error si el objectId no es válido', async () => {
            expect.assertions(1);

            const agentId = 'invalid-agent-id';

            const response = await request(app)
                .put(`/agents/edit/${agentId}`);
            
            expect(response.status).toBe(400);
        });

        // Debe verificar el owner del agente
        it('Debe verificar el owner del agente', async () => {
            expect.assertions(2);

            const agentId = '507f1f77bcf86cd799439011';

            mockGetAgentsByOwner.mockResolvedValue([{
                _id: agentId,
                name: 'John Doe',
                age: 25,
                owner: 1
            }]);

            const response = await request(app)
                .put(`/agents/edit/${agentId}`);
            // Pasar un owner distinto a nuestra sesión, y eso nos deuvelve un 403;

            expect(mockGetAgentsByOwner).toHaveBeenCalledTimes(1);
            expect(mockGetAgentsByOwner).toHaveBeenCalledWith(1);
            // Verificar que se esta llamando a una funcion del servicio
        });

        // Si no encuentra ningun agente, devuelve un 404
        it('Si no encuentra ningun agente, devuelve un 404', async () => {
            expect.assertions(1);

            const agentId = '507f1f77bcf86cd799439011';

            mockGetAgentsByOwner.mockResolvedValue([]);

            const response = await request(app)
                .put(`/agents/edit/${agentId}`);
            // Pasar un owner distinto a nuestra sesión, y eso nos deuvelve un 403;

            expect(response.status).toBe(404);
        });

        // Debe crear un agente llamando al servicio (no es necesario implementar).
        it('Debe crear un agente llamando a agentService', async () => {

            const agentId = '507f1f77bcf86cd799439011';
            const updateData = {
                name: 'John Nieve',
                age: 19
            };

            mockGetAgentsByOwner.mockResolvedValue([{
                _id: agentId,
                name: 'John Doe',
                age: 25,
                owner: 1
            }]);

            const response = await request(app)
                .put(`/agents/edit/${agentId}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(mockUpdateAgent).toHaveBeenCalledTimes(1);
            expect(mockUpdateAgent).toHaveBeenCalledWith(agentId, 1, updateData);

        });
        
        // Debe devolver el agente creado.
        it('Debe devolver el agente creado', async () => {

            const agentId = '507f1f77bcf86cd799439011';
            const updateData = {
                name: 'John Nieve',
                age: 19
            };

            mockGetAgentsByOwner.mockResolvedValue([{
                _id: agentId,
                name: 'John Doe',
                age: 25,
                owner: 1
            }]);


            mockUpdateAgent.mockResolvedValue({
                _id: agentId,
                name: 'John Doe',
                age: 25,
                owner: 1
            });

            const response = await request(app)
                .put(`/agents/edit/${agentId}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                _id: agentId,
                name: 'John Doe',
                age: 25,
                owner: 1
            });

        });

    });
});