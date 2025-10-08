import QRCode from 'qrcode';

export const generateQRCode = async (data) => {
    try {
        const dataURL = await QRCode.toDataURL(data);
        console.log('QR Code generated successfully:', dataURL.substring(0, 50) + '...');
        return dataURL;
    } catch (err) {
        console.error('QR Code generation error:', err);
        throw new Error('Failed to generate QR code');
    }
}

export const generateQRCodeCallback = (data) => {
    return new Promise((resolve, reject) => {
        QRCode.toDataURL(data, (err, dataURL) => {
            if (err) {
                console.error('QR Code generation error:', err);
                reject(err);
            } else {
                console.log('QR Code generated successfully');
                resolve(dataURL);
            }
        });
    });
}