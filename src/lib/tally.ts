export interface TallyEntry {
	hours: string;
	minutes: string;
}

export function readTallyValue(value: string) {
	const trimmed = value.trim();
	if (trimmed === '') return { value: 0, valid: true };

	const parsed = Number(trimmed);
	const valid = Number.isFinite(parsed) && parsed >= 0 && Number.isInteger(parsed);
	return { value: valid ? parsed : 0, valid };
}

export function hasTallyEntry(entry: TallyEntry) {
	const hours = readTallyValue(entry.hours);
	const minutes = readTallyValue(entry.minutes);
	return hours.value * 60 + minutes.value > 0;
}

export function summarizeTally(entries: readonly TallyEntry[]) {
	let minutes = 0;
	let count = 0;
	let invalid = false;

	for (const entry of entries) {
		const hours = readTallyValue(entry.hours);
		const entryMinutes = readTallyValue(entry.minutes);
		const total = hours.value * 60 + entryMinutes.value;

		minutes += total;
		if (total > 0) count++;
		if (!hours.valid || !entryMinutes.valid) invalid = true;
	}

	return { minutes, count, invalid };
}

export function readStoredTallyValue(value: unknown) {
	return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
}
