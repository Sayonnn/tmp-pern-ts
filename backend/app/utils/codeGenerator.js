

/**
 * Generate a random code
 * @param {number} length - The length of the code
 * @returns {string} The generated code
 */
export const generateCode = (length = 6) => {
    const numbers = "0123456789";
    let code = "";

    for(let i = 0; i < length; i++) {
        const randomNumber = Math.floor(Math.random() * numbers.length);
        code += numbers.charAt(randomNumber);
    }

    return code;
}