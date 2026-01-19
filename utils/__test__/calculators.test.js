import { calculatePriceWithDiscount } from '../calculators';

test('Debe calcular el precio con descuento correctamente', () => {
    // Arrange
    const precioBase = 100;
    const descuento = 20;

    // Act
    const resultado = calculatePriceWithDiscount(precioBase, descuento);

    // Assert
    expect(resultado).toBe(80);
});