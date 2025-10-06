import QRCode from 'qrcode';

export const generateQRCode = async (data) => {
    return QRCode.toDataURL(data);
} 