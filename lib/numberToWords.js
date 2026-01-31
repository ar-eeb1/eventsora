export const numberToIndianWords = (num) => {
    if (!num || isNaN(num)) return '';

    const a = [
        '', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ',
        'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '
    ];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const regex = /^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/;

    const getLT20 = (n) => a[Number(n)];
    const get20Plus = (n) => b[n[0]] + ' ' + a[n[1]];

    function numWords(input) {
        const num = Number(input);
        if (isNaN(num)) return '';
        if (num === 0) return '';
        if (num < 20) return getLT20(num);
        if (num < 100) return get20Plus(input.toString());
        if (num < 1000) return getLT20(Math.floor(num / 100)) + 'hundred ' + numWords(num % 100);
        if (num < 100000) return numWords(Math.floor(num / 1000)) + 'thousand ' + numWords(num % 1000);
        if (num < 10000000) return numWords(Math.floor(num / 100000)) + 'lakh ' + numWords(num % 100000);
        return numWords(Math.floor(num / 10000000)) + 'crore ' + numWords(num % 10000000);
    }

    // Handle decimals if needed, but for "3 lakh" type output usually integers are preferred. 
    // We will stick to integer part for simplicity as requested "3 lakh".
    return numWords(Math.floor(num)).trim().replace(/\s+/g, ' ');
}
