# Callsite

Get clean, standardized stack traces from V8 Error objects


ESM:
```javascript
import StackTrace from 'es-modules/distributed-systems/stack-trace/1.0.0+/index.mjs';
```


NPM:
```javascript
import StackTrace from '@distributed-systems/stack-trace';

```


### API

**Stack Frame format returned from the library**
```javascript
[{
    name: 'new Cls',
    source: 'stack-trace/test/200.000-stack-parser.mjs',
    line: 52,
    column: 27 
}, {
    name: null,
    source: 'stack-trace/test/200.000-stack-parser.mjs',
    line: 56,
    column: 13 
}, {
    name: 'section.test',
    source: 'stack-trace/test/200.000-stack-parser.mjs',
    line: 57,
    column: 11 
}, {
    name: 'Promise',
    source: 'section-tests/src/SectionExecutor.mjs',
    line: 162,
    column: 41 
}, { 
    name: 'new Promise', 
    source: null, 
    line: null, 
    column: null 
},{
    name: 'SectionExecutor.executeTests',
    source: 'section-tests/src/SectionExecutor.mjs',
    line: 157,
    column: 23 
}]

```

**Get a Stack-Trace**
```javascript
const st = new StackTrace();
const err = new Error('I want a structured stack trace!');

// gets a structured stack from the error passed in
const trace = st.getStack(err); 

```


**Get a Stack-Trace with a base directory removed from the file paths**
```javascript
const st = new StackTrace();
const err = new Error('I want a structured stack trace!');

// if a frame has a file in the directory defined in the variable below, 
// the portion defined here will be removed from its path 
const baseDir = '/home/ee';

// gets a structured stack from the error passed in
const trace = st.getStack(err, baseDir); 

```






TBD: node 12 can be used with --async-stack-traces



