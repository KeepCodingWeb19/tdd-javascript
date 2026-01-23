import { jest } from '@jest/globals';

export const mockSessionManager = (userId = 1) => {
    jest.unstable_mockModule('../../lib/sessionManager.js', () => {
        return {
            middleware: (req, res, next) => {
                req.session = { userId: userId };
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
};

export const mockAgentService = () => {
    const mockCreateAgent = jest.fn();
    const mockDeleteAgent = jest.fn();
    const mockGetAgentsByOwner = jest.fn();
    const mockUpdateAgent = jest.fn();
    jest.unstable_mockModule('../../services/agentService.js', () => ({
        createAgent: mockCreateAgent,
        deleteAgent: mockDeleteAgent,
        getAgentsByOwner: mockGetAgentsByOwner,
        updateAgent: mockUpdateAgent,
    }));
    return { mockCreateAgent, mockDeleteAgent, mockGetAgentsByOwner, mockUpdateAgent };
};