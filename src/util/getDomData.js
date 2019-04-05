export function getDomData (node, key) {
    var attrKey = 'data-' + key;
    var val = node.getAttribute(attrKey);
    return JSON.parse(val);
}