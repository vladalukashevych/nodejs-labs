const assert = require('assert');
const {factorial} = require('./../src/utils/functions');

describe('Functions', function () {
    describe('factorial', function () {
        it('5! = 120', function () {
            assert.equal(factorial(5), 120);
        });
        it('6! = 720', function () {
            assert.equal(factorial(6), 720);
        });
        it('0! = 1', function () {
            assert.equal(factorial(0), 1);
        });
        it('-5! = null', function () {
            assert.equal(factorial(-5), null);
        });
        it('-6! = null', function () {
            assert.equal(factorial(-6), null);
        });
    });
});