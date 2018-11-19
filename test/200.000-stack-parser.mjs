import section from '../es-modules/distributed-systems/section-tests/1.0.0+/index.mjs';
import assert from 'assert';
import StackTrace from '../index.mjs';



section('Stack-Parser', (section) => {
    section.test('Function', async () => {
        await (async () => {
            const a = function() {
                throw new Error('Function Fail!');
            };

            a();
        })().catch((err) => {
            const stack = new StackTrace().getStack(err);

            assert(stack);
            assert(stack.length > 2);
            assert(stack[0].source.endsWith('200.000-stack-parser.mjs'));
            assert.equal(stack[0].name, 'a');
            assert(stack[0].line > 0);
            assert(stack[0].line > 0);
        });
    });


    section.test('Promise.all', async () => {
        await (async () => {
            const array = Array.apply(null, { length: 10 }).map(async (v, i) => {
                if (i === 4) throw new Error('Prmise.all Fail!');
            });

            await Promise.all(array);
        })().catch((err) => {
            const stack = new StackTrace().getStack(err);

            assert(stack);
            assert(stack.length > 2);
            assert(stack[0].source.endsWith('200.000-stack-parser.mjs'));
            assert.equal(stack[0].name, 'Array.apply.map');
            assert(stack[0].line > 0);
            assert(stack[0].line > 0);
        });
    });


    section.test('new Class', async () => {
        await (async () => {
            const Cls = class {
                constructor() {
                    throw new Error('Constructor Fail!');
                }
            };

            new Cls();
        })().catch((err) => {
            const stack = new StackTrace().getStack(err);

            assert(stack);
            assert(stack.length > 2);
            assert(stack[0].source.endsWith('200.000-stack-parser.mjs'));
            assert.equal(stack[0].name, 'new Cls');
            assert(stack[0].line > 0);
            assert(stack[0].line > 0);
        });
    });


    section.test('Class Method', async () => {
        await (async () => {
            const Cls = class {
                doThings() {
                    throw new Error('donThings Fail!');
                }
            };

            new Cls().doThings();
        })().catch((err) => {
            const stack = new StackTrace().getStack(err);

            assert(stack);
            assert(stack.length > 2);
            assert(stack[0].source.endsWith('200.000-stack-parser.mjs'));
            assert.equal(stack[0].name, 'Cls.doThings');
            assert(stack[0].line > 0);
            assert(stack[0].line > 0);
        });
    });


    section.test('Eval', async () => {
        await (async () => {
            eval(`
                eval("throw new Error('eval Fail!');");
            `);
        })().catch((err) => {
            const stack = new StackTrace().getStack(err);

            assert(stack);
            assert(stack.length > 2);
            assert(stack[0].source.endsWith('200.000-stack-parser.mjs'));
            assert.equal(stack[0].name, 'eval');
            assert(stack[0].line > 0);
            assert(stack[0].line > 0);
        });
    });
});
