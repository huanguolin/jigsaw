// get one number form [start, end)
export function random (start, end) {
    var range = end - start - 1;
    return Math.round(Math.random() * range) + start;
}