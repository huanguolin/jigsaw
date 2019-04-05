
export function setFilesToInput(input, files) {
    Object.defineProperty(input, 'files', {
        value: files,
        writeable: false,
    });
}