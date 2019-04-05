export function padStart (str, targetLen, padStr) {
    str = str + '';
    var len = str.length;
    targetLen = parseInt(targetLen);
    if (len >= targetLen) return str;
    
    padStr = typeof padStr === 'number' ? padStr : (padStr || ' ');
    var rest = targetLen - len;
    var pad = padStr + '';
    while (pad.length < rest) {
        pad += padStr;
    }
    return pad.slice(0, rest) + str;
}