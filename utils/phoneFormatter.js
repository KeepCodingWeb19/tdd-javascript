export function formatPhoneNumber(phoneNumber) {

    let cleaned = phoneNumber.trim();


    cleaned = cleaned.replace(/[\s-()]/g, '');
    
    if (cleaned.startsWith('+34')) {
        cleaned = cleaned.substring(3);
    }

    if (cleaned.startsWith('0034')) {
        cleaned = cleaned.substring(4);
    }

    if (cleaned.startsWith('34') && cleaned.length > 9) {
        cleaned = cleaned.substring(2);
    }

    if (cleaned.length !== 9) {
        throw new Error('El número de teléfono debe tener 9 dígitos');
    }

    if (
        !cleaned.startsWith(6) &&
        !cleaned.startsWith(7) &&
        !cleaned.startsWith(8) &&
        !cleaned.startsWith(9)
    ) {
        throw new Error('El número de telefono debe empezar por 6, 7, 8 o 9');
    }

    return `+34 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
}