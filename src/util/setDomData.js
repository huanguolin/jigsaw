export function setDomData (node, key, value) {
    var attrKey = 'data-' + key;
    var attrVal = JSON.stringify(value);
    node.setAttribute(attrKey, attrVal);
}