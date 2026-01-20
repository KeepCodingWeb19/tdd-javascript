export function formatPhoneNumber(phoneNumber) {

    let cleaned = phoneNumber.trim();

    cleaned = cleaned.replace(/[\s-()]/g, '');
    
    cleaned = cleaned.replace('+34', '');

    return `+34 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
}