# Callsite

get clean v8 stacktraces for errors



node 12 can be used with --async-stack-traces


notes:
getThis: returns the value of this
getFunction: returns the current function

getTypeName: returns the type of this as a string. This is the name of the function stored in the constructor field of this, if available, otherwise the object’s [[Class]] internal property.
getFunctionName: returns the name of the current function, typically its name property. If a name property is not available an attempt is made to infer a name from the function’s context.
getMethodName: returns the name of the property of this or one of its prototypes that holds the current function

getFileName: if this function was defined in a script returns the name of the script
getLineNumber: if this function was defined in a script returns the current line number
getColumnNumber: if this function was defined in a script returns the current column number

getEvalOrigin: if this function was created using a call to eval returns a string representing the location where eval was called

isToplevel: is this a top-level invocation, that is, is this the global object?
isEval: does this call take place in code defined by a call to eval?
isNative: is this call in native V8 code?
isConstructor: is this a constructor call?
isAsync: is this an async call (i.e. await or Promise.all())?
isPromiseAll: is this an async call to Promise.all()?
getPromiseIndex: returns the index of the promise element that was followed in Promise.all() for async stack traces, or null if the CallSite is not a Promise.all()




Stack
[
    name: ''
    source: ''
    span: {
        startPosition: {
            line, 
            column
        }, 
        endPosition: {
            line, 
            column
        }
    }
]

 at Type.name (myscript.js, line:column::line:column)


at Type.functionName [as methodName] (location)
at new functionName (location)
at Type.name (location)
at functionName [as methodName] (location)

fileName:lineNumber:columnNumber
eval at position
eval at Bar.z (myscript.js:10:3)
native
unknown location