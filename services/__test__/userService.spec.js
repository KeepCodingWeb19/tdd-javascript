import { jest } from '@jest/globals'; 

import { createUser } from '../userService';
import User from '../../models/User.js';

jest.mock('../../models/User.js');
User.findOne = jest.fn();
User.findById = jest.fn();
User.hashPassword = jest.fn();
// En un modelo, para poder acceder a los métodos estáticos
// Debemos mockear su prototipo, no los métodos en si.
User.prototype.save = jest.fn();

const mockInstanceUser = {
    comparePassword: jest.fn().mockResolvedValue(true),
    addLoginRecord: jest.fn(),
    save: jest.fn().mockResolvedValue(true)
}

// jest.mock('../../utils/formatters.js', () => {
//     return {
//         formatEmail: jest.fn(),
//     }
// })

describe('createUser', () => {

    // Objeto base de usuario
    const userData = {};
    beforeEach(() => {
        userData.email = 'email@example.com';
        userData.password = 'Password123';
    })

    it('Debe lanzar una excepción si el email no es válido', async () => {
        userData.email = 'email-invalido';

        expect.assertions(1);
        await expect(createUser(userData)).rejects.toThrow('El email no tiene un formato válido');
    });

    it('Debe lanzar error si la contraseña no es válida', async () => {
        userData.password = '123';

        expect.assertions(1);
        await expect(createUser(userData))
            .rejects.toThrow('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
    });

    // Mocks
    it('Debe lanzar un error si el usuario ya existe', async () => {
        const existingUser = {
            email: 'existing@ejemplo.com'
        };

        User.findOne.mockResolvedValueOnce(existingUser);
        const spy = jest.spyOn(User, 'findOne');

        await expect(createUser(userData))
            .rejects.toThrow('Ya existe un usuario con ese email');
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith({ email: 'email@example.com' })

    });

    test('debe llamar a formatEmail con el email proporcionado', async () => {
        const userData = {
            email: ' Test@Ejemplo.cOM',
            password: 'Password1234'
        }

        // Se esta llamando correctamente formatEmail?
        // const spy = jest.spyOn(createUser, 'formatEmail');

        User.findOne.mockResolvedValueOnce(null);
        User.hashPassword.mockResolvedValueOnce(userData.password);
        User.prototype.save.mockResolvedValueOnce({});

        await createUser(userData);
        expect(User.prototype.save).toHaveBeenCalled();

        // El resultado es correcto? test@ejemplo.com
    }, 10000); // Timeout de 10s
});