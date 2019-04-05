export function partEqual (keys, objA, objB) {
    var i, key;
    for (i = 0; i < keys.length; i++) {
        key = keys[i];
        if (objA[key] !== objB[key]) return false;
    }
    return true;
}