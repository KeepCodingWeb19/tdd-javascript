import { jest } from '@jest/globals';

import request from 'supertest';


jest.unstable_mockModule('../../lib/sessionManager.js', () => {
    return {
        middleware: (req, res, next) => {
            req.session = { userId: undefined };
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

// Import dinámico en ESM para poder mocker
// const importApp = await import('../../app.js');
// const app = importApp.default;
const { default: app } = await import('../../app.js');

// Test de integración.
// App -> url sirve una ruta en concreto.
// Middleware se aplica correctamente
// Una petición contola correctamente sus errores

describe('Test de Index', () => {

    let response;
    beforeAll( async () => {
        response = await request(app).get('/');
    });

    it("Debe devolver un 200 al visitar la home", () => {
        expect.assertions(1); 
        expect(response.status).toBe(200);
    }, 15000);

    it("Debe devolver siempre un documento html al visitar la home", () => {
        expect.assertions(2);

        expect(response.text).toContain('<!DOCTYPE html>');
        expect(response.headers['content-type']).toContain('text/html');

    });
})