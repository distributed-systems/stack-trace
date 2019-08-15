

export default class Callsite {


    /**
     * set up the callsite
     *
     * @param      {Object}  arg1              options object
     * @param      {string}  arg1.source       filename, aka source
     * @param      {string}  arg1.name         name of function, method and so on
     * @param      {number}  arg1.startLine    The start line
     * @param      {number}  arg1.startColumn  The start column
     * @param      {number}  arg1.endLine      The end line
     * @param      {number}  arg1.endColumn    The end column
     */
    constructor({
        source = null,
        name = null,
        line = null,
        column = null,
        baseDir,
    }) {
        Object.defineProperty(this, 'name', {
            value: name,
            enumerable: true,
        });

        if (baseDir && source && source.startsWith(`file://${baseDir}/`)) {
            source = source.slice(`file://${baseDir}/`.length);
        } 

        Object.defineProperty(this, 'source', {
            value: source,
            enumerable: true,
        });

        Object.defineProperty(this, 'line', {
            value: line,
            enumerable: true,
        });

        Object.defineProperty(this, 'column', {
            value: column,
            enumerable: true,
        });
    }
}
