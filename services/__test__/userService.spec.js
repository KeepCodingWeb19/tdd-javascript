import { createUser } from '../userService';


describe('createUser', () => {

    it('Debe lanzar una excepción si el email no es válido', async () => {

        const userData = {
            email: 'email-invalido',
            password: 'Password123'
        };

        expect.assertions(1);
        await expect(createUser(userData)).rejects.toThrow('El email no tiene un formato válido');
    });

    it.todo('Debe lanzar error si la contraseña no es válida');
});