/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import { formatterFactory } from '../src/dateFormat';

const reusableTestdate = new Date('5/1/2017, 4:30:09 PM');

const testFormatRunner = (
	testFormat: string,
	options?: { [key: string]: (d: Date) => string },
	context?: Date
): string => formatterFactory(testFormat, options)(context ?? reusableTestdate);

test('function is exported', (t) => {
	t.is(typeof formatterFactory, 'function', 'exports a function');
});

test('when called, it also returns a function', (t) => {
	t.is(typeof formatterFactory(''), 'function', 'returns a function');
});

test('does nothing if no match', (t) => {
	t.is(testFormatRunner('foo'), 'foo');
});

test('no replace without braces', (t) => {
	t.is(testFormatRunner('HH'), 'HH');
});

test('braces edge case', (t) => {
	t.is(testFormatRunner('{MM}DD{YY}'), '05DD17');
});

test('returns numerical month', (t) => {
	t.is(testFormatRunner('{MM}'), '05');
});

test('returns partial year', (t) => {
	t.is(testFormatRunner('{YY}'), '17');
});
test('returns full year', (t) => {
	t.is(testFormatRunner('{YYYY}'), '2017');
});
test('returns full hours (24hrs)', (t) => {
	t.is(testFormatRunner('{HH}'), '16');
});

test('returns padded minutes', (t) => {
	t.is(testFormatRunner('{mm}'), '30');
});

test('returns seconds', (t) => {
	t.is(testFormatRunner('{ss}'), '09');
});
test('default milliseconds', (t) => {
	t.is(testFormatRunner('{fff}'), '000');
});
test('milliseconds non-zero', (t) => {
	t.is(testFormatRunner('{fff}', {}, new Date(1_559_607_289_771)), '771');
});

test('time formatted string', (t) => {
	t.is(testFormatRunner('[{HH}:{mm}:{ss}]'), '[16:30:09]');
});

test('formatted date string', (t) => {
	t.is(
		testFormatRunner('The date is {MM}/{DD}/{YYYY}!'),
		'The date is 05/01/2017!',
		'returns formatted date string'
	);
});

test('all default options', (t) => {
	t.is(
		testFormatRunner('Created on: [{YY}   {YYYY}-{MM}-{DD} ~ {HH}:{mm}:{ss}.{fff}]'),
		'Created on: [17   2017-05-01 ~ 16:30:09.000]'
	);
});

test('custom adds new options', (t) => {
	const options = { EX: (_: Date) => 'example' };
	t.is(testFormatRunner('{EX}', options), 'example');
});

test('Custom can override default', (t) => {
	const options = { MM: (_: Date) => 'example' };
	t.is(testFormatRunner('{MM}', options), 'example');
});

test("custom doesn't leak", (t) => {
	const options = { MM: (_: Date) => 'example' };
	testFormatRunner('{MM}', options);
	t.is(testFormatRunner('{MM}'), '05');
});

test('error on incorrect submission', (t) => {
	t.plan(2);
	try {
		testFormatRunner('{NaN}');
	} catch (error) {
		t.true(error instanceof TypeError);
		if (error instanceof TypeError) {
			t.is(error.message, 'Undefined key in format: NaN');
		}
	}
});
