export function getElemSize (el) {
    el = el.getBoundingClientRect();
    return {
        width: el.width,
        height: el.height
    }
}