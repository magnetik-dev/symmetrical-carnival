<svelte:options runes />

<script lang="ts">
	import { onMount } from "svelte";

	type Entry = {
		hours: string;
		minutes: string;
	};

	type StoredEntry = {
		h?: unknown;
		m?: unknown;
	};

	const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	const storageKey = "hours-tally-v1";

	let entries = $state<Entry[]>(days.map(() => ({ hours: "", minutes: "" })));
	let savedAt = $state("");
	let storageBlocked = $state(false);
	let restoreWarning = $state(false);

	function readValue(value: string) {
		const trimmed = value.trim();
		if (trimmed === "") return { value: 0, valid: true };

		const parsed = Number(trimmed);
		const valid = Number.isFinite(parsed) && parsed >= 0 && Number.isInteger(parsed);
		return { value: valid ? parsed : 0, valid };
	}

	function hasEntry(entry: Entry) {
		const hours = readValue(entry.hours);
		const minutes = readValue(entry.minutes);
		return hours.value * 60 + minutes.value > 0;
	}

	const summary = $derived.by(() => {
		let minutes = 0;
		let count = 0;
		let invalid = false;

		for (const entry of entries) {
			const hours = readValue(entry.hours);
			const entryMinutes = readValue(entry.minutes);
			const total = hours.value * 60 + entryMinutes.value;

			minutes += total;
			if (total > 0) count++;
			if (!hours.valid || !entryMinutes.valid) invalid = true;
		}

		return { minutes, count, invalid };
	});

	const hoursTotal = $derived(Math.floor(summary.minutes / 60));
	const minutesRemainder = $derived(summary.minutes % 60);

	const note = $derived(
		summary.invalid
			? "Use whole, non-negative numbers. Highlighted fields aren't counted."
			: storageBlocked
				? "This browser isn't allowing saves, so entries will clear when you close the page."
				: restoreWarning
					? "Previous saved entries could not be read."
					: savedAt
						? `Saved on this device at ${savedAt}.`
						: "Minutes over 59 roll into hours automatically."
	);

	function persistEntries() {
		try {
			localStorage.setItem(
				storageKey,
				JSON.stringify(entries.map(({ hours, minutes }) => ({ h: hours, m: minutes })))
			);
			savedAt = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
			storageBlocked = false;
		} catch {
			storageBlocked = true;
			savedAt = "";
		}
	}

	function readStoredValue(value: unknown) {
		return typeof value === "string" || typeof value === "number" ? String(value) : "";
	}

	onMount(() => {
		try {
			const saved = localStorage.getItem(storageKey);
			if (saved !== null) {
				const parsed: unknown = JSON.parse(saved);
				if (Array.isArray(parsed)) {
					entries = days.map((_, index) => {
						const stored: StoredEntry | null =
							typeof parsed[index] === "object" && parsed[index] !== null
								? (parsed[index] as StoredEntry)
								: null;
						return {
							hours: readStoredValue(stored?.h),
							minutes: readStoredValue(stored?.m)
						};
					});
				} else if (parsed !== null) {
					restoreWarning = true;
				}
			}
		} catch {
			restoreWarning = true;
		}

		persistEntries();
	});

	function updateEntry(index: number, field: keyof Entry, value: string) {
		entries[index][field] = value;
		persistEntries();
	}

	function clearEntries() {
		entries = days.map(() => ({ hours: "", minutes: "" }));
		persistEntries();
		document.getElementById("h0")?.focus();
	}
</script>

<svelte:head>
	<title>Hours Tally</title>
</svelte:head>

<section class="section">
	<div class="container">
		<div class="columns is-centered">
			<div class="column is-8-tablet is-6-desktop is-5-widescreen">

				<section class="box has-background-dark is-shadowless mb-5" aria-live="polite">
					<p class="heading has-text-primary">Running total</p>
					<p class="title is-1 has-text-primary mb-4">
						{hoursTotal}:{String(minutesRemainder).padStart(2, "0")}<span class="is-size-5 ml-2">h</span>
					</p>
					<div class="tags">
						<span class="tag is-primary is-light">{(summary.minutes / 60).toFixed(2)} decimal hours</span>
						<span class="tag is-info is-light">{summary.minutes.toLocaleString()} minutes</span>
						<span class="tag is-dark">{summary.count} of 7 entries</span>
					</div>
				</section>

				<section
					class="box has-background-dark is-shadowless tally-rows"
					aria-label="Time entries"
				>
					{#each entries as entry, index (days[index])}
						<div
							class={["tally-row", { "has-entry": hasEntry(entry) }]}
						>
							<div class="tally-day has-text-weight-medium">{days[index]}</div>
							<div>
								<div class="field has-addons m-0 p-0">
									<div class="control">
										<input
											id={`h${index}`}
											class={[
												"input is-small",
												readValue(entry.hours).valid ? "is-primary" : "is-danger"
											]}
											style="width: 3rem"
											type="number"
											inputmode="numeric"
											min="0"
											step="1"
											placeholder="0"
											aria-label={`${days[index]} hours`}
											aria-invalid={!readValue(entry.hours).valid}
											value={entry.hours}
											oninput={(event) => updateEntry(index, "hours", event.currentTarget.value)}
										/>
									</div>
									<div class="control">
										<span class="button is-static is-small">h</span>
									</div>
								</div>
							</div>
							<div class="tally-colon has-text-grey">:</div>
							<div>
								<div class="field has-addons mb-0">
									<div class="control">
										<input
											id={`m${index}`}
											class={[
												"input is-small",
												readValue(entry.minutes).valid ? "is-primary" : "is-danger"
											]}
											style="width: 3rem"
											type="number"
											inputmode="numeric"
											min="0"
											step="1"
											placeholder="00"
											aria-label={`${days[index]} minutes`}
											aria-invalid={!readValue(entry.minutes).valid}
											value={entry.minutes}
											oninput={(event) => updateEntry(index, "minutes", event.currentTarget.value)}
										/>
									</div>
									<div class="control">
										<span class="button is-static is-small">m</span>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</section>

				<div class="level is-mobile mt-5">
					<div class="level-left">
						<p
							class={[
								"help",
								{ "has-text-danger": summary.invalid || storageBlocked || restoreWarning }
							]}
						>
							{note}
						</p>
					</div>
					<div class="level-right">
						<button class="button is-danger is-light" type="button" onclick={clearEntries}>
							Clear all
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.tally-rows {
		padding: 0;
		border: 1px solid var(--app-line);
		border-radius: 14px;
		overflow: hidden;
	}

	.tally-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto auto auto;
		align-items: center;
		gap: 6px;
		margin: 0;
		padding: 10px 16px;
		border-top: 1px solid var(--app-line);
	}

	.tally-row:first-child {
		border-top: 0;
	}

	.tally-day {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.tally-colon {
		padding-inline: 0.25rem;
	}

	.tally-row.has-entry {
		background: linear-gradient(90deg, var(--app-accent-soft), transparent 70%);
	}

	@media (max-width: 420px) {
		.tally-row {
			gap: 8px;
			padding: 8px 12px;
		}
	}
</style>
