import Callsite from './Callsite.mjs';


/**
 * An attempt at standardizing error stack traces
 * 
 * V8 Dcos: https://v8.dev/docs/stack-trace-api
 */
export default class StackTrace {


    /**
     * set up the parser
     *
     * @param      {Object}  arg1          options object
     * @param      {string}  arg1.baseDir  if a stack contains a file in this
     *                                     directory it gets stripped from it
     */
    constructor({
        baseDir,
    } = {}) {
        this.baseDir = baseDir;
    }


    /**
     * returns a structured stack trace for v8 errors
     *
     * @param      {Error}            err     the error to get the stack from
     * @return     {Array<Callsite>}  The stack.
     */
    getStack(err) {
        if (!(err instanceof Error)) {
            throw new Error(`Cannot get stack from non Error!`);
        }

        return this.getV8StackFrames(err);
    }




    /**
     * gets v8 callsite objects if possible, reverse engineers them as good as
     * possible from the stack string otherwise
     *
     * @param      {Error}  err     The error
     * @return     {Array}   stack frames
     */
    getV8StackFrames(err) {
        // try to get the structured v8 stack trace. That may be impossible if a
        // user already has accessed the stack property before this method was
        // called. V8 converts the structured stack trace into a string when its
        // accessed first.
        
        // backup the original function, and place a custom one
        const originalFunction = Error.prepareStackTrace;
        Error.prepareStackTrace = (originalFunction, stack) => stack;

        // get stack
        const frames = err.stack;

        // restore original function
        Error.prepareStackTrace = originalFunction;


        // if the stack is a string, try to reverse engineer it as far as possible
        if (typeof frames === 'string') {
            return this.convertV8StringStack(frames);
        } else {
            return frames.map(frame => {
                let name;

                if (frame.isConstructor()) {
                    name = `new ${frame.getFunctionName()}`;
                } else {
                    if (frame.getTypeName()) {
                        if (frame.getFunctionName() === frame.getMethodName()) {
                            name = `${frame.getTypeName()}.${frame.getMethodName()}`;
                        } else {
                            name = `${frame.getFunctionName()} as ${frame.getTypeName()}.${frame.getMethodName()}`;
                        }
                    } else if (frame.getFunctionName()) {
                        name = frame.getFunctionName();
                    }
                }


                if (frame.isEval()) {
                    const locationResult = /\((?<location>[^\)\()]+:\d+:\d+)\)/i.exec(frame.getEvalOrigin());
                    const locationString = locationResult && locationResult.groups && locationResult.groups.location;
                    const location = this.convertStringLocation(locationString);

                    return new Callsite({
                        name: name,
                        source: location && location.source,
                        line: location && location.line,
                        column: location && location.column,
                        baseDir: this.baseDir,
                    });
                } else {
                    return new Callsite({
                        name: name,
                        source: frame.getFileName(),
                        line: frame.getLineNumber(),
                        column: frame.getColumnNumber(),
                        baseDir: this.baseDir,
                    });
                }                
            });
        }
    }




    /**
     * convert a string location to a source, line and column
     *
     * @param      {string}       locationString  The location string
     * @return     {object|null}  object containing the location information
     */
    convertStringLocation(locationString) {
        const locationResult = /^(?<source>[^\)\()]+):(?<line>\d+):(?<column>\d+)$/i.exec(locationString);
        return locationResult && locationResult.groups;
    }




    /**
     * convert a v8 stringified stack frame to a structured stack
     *
     * @param      {string}    frame   stack frame
     * @return     {Callsite}  Callsite object
     */
    convertV8StringStackFrame(frame) {
        let nameString;

        // if the frame is result of an eval call, strip all unused information from it
        if (frame.startsWith('eval')) {
            const locationResult = /\((?<location>[^\)\()]+:\d+:\d+)\)/i.exec(frame);
            frame = locationResult && locationResult.groups && locationResult.groups.location;
            nameString = 'eval';
        }


        const regexpParts = /^(?<name>.+) \((?<source>[^\)]+)\)$/i.exec(frame);
        let location;

        if (regexpParts) {
            const { name, source } = regexpParts.groups;

            // try to get location
            location = this.convertStringLocation(source);

            // trim name
            nameString = name.trim();
        } else {
            location = this.convertStringLocation(frame);
            if (!location) console.log(`Failed to parse frame: ${frame}`);
        }

        return new Callsite({
            name: nameString,
            source: location ? location.source : null,
            line: location ? location.line : null,
            column: location ? location.column : null,
            baseDir: this.baseDir,
        });
    }




    /**
     * convert a stringified stack to a structured stack
     *
     * @param      {string}           stack   the string stack
     * @return     {Array<Callsite>}  the structured stack
     */
    convertV8StringStack(stack) {
        // get single frames. Frame 0 is the error message. remove it.
        // trim each line, remote the 'at' at the beginning of each line
        const frames = stack
            .split(/\n/g)
            .slice(1)
            .map(frame => frame.trim().slice(3));


        return frames.map(frame => this.convertV8StringStackFrame(frame));
    }
}
