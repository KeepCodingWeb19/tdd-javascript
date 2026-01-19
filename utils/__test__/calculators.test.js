import { calculatePriceWithDiscount } from '../calculators';

describe("calculatePriceWithDiscount", () => {

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

    it.todo('Debe lanzar un error si el descuento es negativo');
});