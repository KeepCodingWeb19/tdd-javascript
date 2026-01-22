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

    // 5. TEST 5: Validación - número demasiado corto
    // 61234567 -> Debe devolver una excepción con un número de 8 digitos.
    it('Debe lanzar una excepción si el numero tiene menos de 9 dígitos', () => {
        const phoneNumber = '61234567';
        expect(() => {
            formatPhoneNumber(phoneNumber)
        }).toThrow('El número de teléfono debe tener 9 dígitos');
    });

    /**
   * TEST 6: Validación - número demasiado largo
   */
  test('debe lanzar error si el número tiene más de 9 dígitos (sin prefijo)', () => {
    const phoneNumber = '61234567891';
    expect(() => {
        formatPhoneNumber(phoneNumber)
    }).toThrow('El número de teléfono debe tener 9 dígitos');
  });

  // TEST 7: Debe poder admitir varios tipos de prefijos: +34, 0034 o 34
  test('Debe poder admitir varios tipos de prefijos: +34, 0034 o 34', () => {
    expect(
        formatPhoneNumber('+34612345678')
    ).toBe('+34 612 345 678')
    expect(
        formatPhoneNumber('0034612345678')
    ).toBe('+34 612 345 678')
    expect(
        formatPhoneNumber('34612345678')
    ).toBe('+34 612 345 678')
  });

  // Test 8: Debe validar correctamente los numeros reales
  // En españa empiezan por 6, 7, 8, 9
  it('Debe validar numeraciones españolas', () => {
    expect( () => {
        formatPhoneNumber('212345678')
    }
    ).toThrow('El número de telefono debe empezar por 6, 7, 8 o 9');
    expect( () => {
        formatPhoneNumber('312345678')
    }
    ).toThrow('El número de telefono debe empezar por 6, 7, 8 o 9');
    expect( () => {
        formatPhoneNumber('412345678')
    }
    ).toThrow('El número de telefono debe empezar por 6, 7, 8 o 9');
    expect( () => {
        formatPhoneNumber('512345678')
    }
    ).toThrow('El número de telefono debe empezar por 6, 7, 8 o 9');

  });

})