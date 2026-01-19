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

});