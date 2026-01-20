import { formatPhoneNumber } from '../phoneFormatter';
// Vamos a crear la función phoneFormatter siguiendo TDD

describe('formatPhoneNumber', () => {

    // 1: Debe formatear un número de 9 dígitos sin prefijo (happy path)
    // Si recibe como parámetro de entrada 612345678 debe devover +34 612 345 678
    it('Debe formatear un número de 9 dígitos sin prefijo', () => {
        const phoneNumber = '612345678';
        const phoneNumber2 = '612345679'

        expect(
            formatPhoneNumber(phoneNumber)
        ).toBe('+34 612 345 678');
        expect(
            formatPhoneNumber(phoneNumber2)
        ).toBe('+34 612 345 679');
    });
    
    
    // 2: Debe formatear un número que ya tiene prefijo +34
    // Si recibe +34612345678 debe devolver +34 612 345 678
    it('Debe formatear un número que ya tiene prefijo +34', () => {
        const phoneNumber = '+34612345678';
        expect(
            formatPhoneNumber(phoneNumber)
        ).toBe('+34 612 345 678');
    });
    
    // 3: Debe eliminar espacios del número de entrada ' 612345678' debe devolver +34 612 345 678
    it('Debe eliminar espacios del número de entrada', () => {
        const phoneNumber = ' 612345678';

        expect(
            formatPhoneNumber(phoneNumber)
        ).toBe('+34 612 345 678');
    });

    // 4. Debe eliminar guiones del número de entrada
    // '612-345-678' -> '+34 612 345 678'
    it('debe eliminar guiones, espacios, y carácteres especiales del número de entrada', () => {
        const phoneNumber = '612-345-678'
        const phoneNumber2 = '612 345 678'

        expect(
            formatPhoneNumber(phoneNumber)
        ).toBe('+34 612 345 678');
        expect(
            formatPhoneNumber(phoneNumber2)
        ).toBe('+34 612 345 678');
    });

})