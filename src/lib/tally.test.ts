import { describe, expect, it } from 'vitest';
import {
	hasTallyEntry,
	readStoredTallyValue,
	readTallyValue,
	summarizeTally
} from './tally';

describe('readTallyValue', () => {
	it.each([
		['  ', { value: 0, valid: true }],
		['12', { value: 12, valid: true }],
		['-1', { value: 0, valid: false }],
		['1.5', { value: 0, valid: false }],
		['Infinity', { value: 0, valid: false }]
	])('parses %j', (input, expected) => {
		expect(readTallyValue(input)).toEqual(expected);
	});
});

describe('hasTallyEntry', () => {
	it('marks entries with a positive duration', () => {
		expect(hasTallyEntry({ hours: '0', minutes: '1' })).toBe(true);
		expect(hasTallyEntry({ hours: '0', minutes: '0' })).toBe(false);
	});

	it('does not count invalid input', () => {
		expect(hasTallyEntry({ hours: '2.5', minutes: '0' })).toBe(false);
	});
});

describe('summarizeTally', () => {
	it('adds durations, rolls excess minutes into hours, and counts nonempty entries', () => {
		expect(
			summarizeTally([
				{ hours: '1', minutes: '75' },
				{ hours: '0', minutes: '30' },
				{ hours: '', minutes: '' }
			])
		).toEqual({ minutes: 165, count: 2, invalid: false });
	});

	it('excludes invalid values and reports invalid input', () => {
		expect(
			summarizeTally([
				{ hours: '2', minutes: '0' },
				{ hours: '1.5', minutes: '30' }
			])
		).toEqual({ minutes: 150, count: 2, invalid: true });
	});
});

describe('readStoredTallyValue', () => {
	it('preserves string and numeric values while discarding unsupported values', () => {
		expect(readStoredTallyValue('04')).toBe('04');
		expect(readStoredTallyValue(4)).toBe('4');
		expect(readStoredTallyValue(null)).toBe('');
		expect(readStoredTallyValue({ hours: 4 })).toBe('');
	});
});
