import { calculateAverageAge, calculatePriceWithDiscount, calculatePriceWithTax, calculateStatistics } from '../calculators';

describe("calculatePriceWithDiscount", () => {

    // Happy path -> test de casos perfectos
    test('Debe calcular el precio con descuento correctamente', () => {
        // Arrange
        const precioBase = 100;
        const descuento = 20;
    
        // Act
        const resultado = calculatePriceWithDiscount(precioBase, descuento);
    
        // Assert
        expect(resultado).toBe(80);
    });

    it('Debe retornar el precio original con descuento 0%', () => {
        const precioBase = 100;
        const descuento = 0;
        const resultado = calculatePriceWithDiscount(precioBase, descuento);

        expect(resultado).toBe(100);
    });

    it('Debe retornar 0 con descuento del 100%', () => {
        const precioBase = 100;
        const descuento = 100;
        const resultado = calculatePriceWithDiscount(precioBase, descuento);

        expect(resultado).toBe(0);
        expect(
            calculatePriceWithDiscount(100, 100)
        ).toBe(0);
    });

    it('Debe calcular descuentos de precios con decimales correctamente', () => {
        const precioBase = 99.99;
        const descuento = 10;
        const resultado = calculatePriceWithDiscount(precioBase, descuento);
        expect(resultado).toBe(89.99);
        expect(resultado).toBeCloseTo(89.99, 6); // Nos permite trabajar con decimales por aproximación.
    });

    it('Debe lanzar una excepción si el precio es negativo', () => {
        const precioBase = -10;
        const descuento = 10;

        expect(() => {
            calculatePriceWithDiscount(precioBase, descuento)
        }).toThrow('El precio base debe ser un número positivo');
    });

    it('Debe lanzar un error si el descuento es negativo', () => {
        const precioBase = 100;
        const descuento = -10;

        expect(() => {
            calculatePriceWithDiscount(precioBase, descuento)
        }).toThrow('El porcentaje de descuento debe estar entre 0 y 100');
    });

    // Edge cases -> test de valores absurdos o no evidentes
    // Precio es 0
    it('Debe retornar 0 si el precio base es 0', () => {
        const precioBase = 0;
        const descuento = 20;

        const resultado = calculatePriceWithDiscount(precioBase, descuento);
        expect(resultado).toBe(0);
    });

    // Precio es NaN
    it('Debe lanzar una excepcion si el precio es NaN', () => {
        const precioBase = NaN;
        const descuento = 20;

        expect( () => {
            calculatePriceWithDiscount(precioBase, descuento)
        }).toThrow('El precio base debe ser un número positivo');
    });

});

describe('calculatePriceWithTax', () => {

    it('Debe calcular el precio con impuestos correctamente para 100 y 21%', () => {
        const precioBase = 100;
        const impuesto = 21;
        const resultado = calculatePriceWithTax(precioBase, impuesto);
        expect(resultado).toBe(121);
    });

    it('Debe aplicar un 21% como impuesto por defecto', () => {
        const precioBase = 100;
        const resultado = calculatePriceWithTax(precioBase);
        expect(resultado).toBe(121);
    });

    it.todo('Debe lanzar error si el porcentaje de impuesto es negativo')
});

describe('calculateAverageAge', () => {

    // TEST 1: Caso feliz
    test.todo('debe calcular la edad promedio correctamente');

    // TEST 3: EDGE CASE - Array vacío
    test.todo('debe lanzar error si el array está vacío');

    // EDGE CASE: filtro de valores
    it('Debe filtrar los valoes inválidos y calcular con los válidos', () => {
        const edges = [20, null, 30, 'diez', 40];
        const resultado = calculateAverageAge(edges);
        expect(resultado).toBe(30);
    });

    // EDGE CASE - null
    test.todo('debe lanzar error si se pasa null');

});

describe('calculateStatistics', () => {

    it('Debe calcular las estadísticas correctamente', () => {
        const numeros = [10, 20, 30, 40, 50];
        const resutado = calculateStatistics(numeros);
        expect.assertions(6);
        expect(resutado).toHaveProperty('min', 10);
        expect(resutado).toHaveProperty('max', 50);
        expect(resutado).toHaveProperty('average', 30);
        expect(resutado).toHaveProperty('sum', 150);
        expect(resutado).toHaveProperty('count');
        expect(resutado).not.toHaveProperty('total');
    });

    // Una sola aserción
    it('Debe retornar un objeto con todas las estadísticas', () => {
        const numeros = [10, 20, 30, 40, 50];
        const resutado = calculateStatistics(numeros);
        expect.assertions(1);
        //expect(resutado).toHaveProperty('count');
        expect(resutado).toEqual({ // toBe -> === / toEqual -> comparación profunda
            min: 10,
            max: 50,
            average: 30,
            sum: 150,
            count: 5
        });
    });

});