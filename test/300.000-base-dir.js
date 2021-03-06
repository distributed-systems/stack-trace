import section from '../es-modules/distributed-systems/section-tests/1.0.0+/index.js';
import assert from 'assert';
import StackTrace from '../StackTrace.js';
import path from 'path';



section('Base Dir', (section) => {
    section.test('Remove path parts', async () => {
        await (async () => {
            const a = function() {
                throw new Error('Function Fail!');
            };

            a();
        })().catch((err) => {
            const baseDir = path.dirname(path.dirname(new URL(import.meta.url).pathname));
            const stack = new StackTrace().getStack(err, baseDir);

            assert(stack);
            assert(stack.length > 2);
            assert.equal(stack[0].source, 'test/300.000-base-dir.js');
        });
    });
});
