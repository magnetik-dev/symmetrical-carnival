<script lang="ts">
	// 1. Define the shape of your data
	interface QuizSet {
		query: string;
		response: string;
	}

	const createInitialState = (): QuizSet[] => [];

	let questions = $state<QuizSet[]>(createInitialState());
	let currentQuery = $state('');
	let currentResponse = $state('');
	let copyStatus = $state('Copy JSON');

	let jsonOutput = $derived(JSON.stringify(questions, null, 2));

	function addSet() {
		if (currentQuery.trim() && currentResponse.trim()) {
			questions.push({
				query: currentQuery.trim(),
				response: currentResponse.trim()
			});
			currentQuery = '';
			currentResponse = '';
		}
	}

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(jsonOutput);
			copyStatus = 'Copied!';
			setTimeout(() => (copyStatus = 'Copy JSON'), 2000);
		} catch (err) {
			copyStatus = 'Error copying';
		}
	}

	// 3. Explicitly type the index as a number
	function removeSet(index: number) {
		questions.splice(index, 1);
	}


    function clearSet(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) {
		// Clear the current input fields
		currentQuery = '';
		currentResponse = '';
		questions = createInitialState(); // Reset the questions array to its initial state
    }
</script>
<div class="container section">
	<h1 class="title">JSON Generator</h1>

	<div class="box">
		<div class="field">
			<label class="label" for="query">Question</label>
			<div class="control">
				<textarea 
					id="query" 
					class="textarea is-medium is-primary" 
					bind:value={currentQuery} 
					placeholder="e.g., What is the purpose of a CSS Reset?">
				</textarea>
			</div>
		</div>

		<div class="field">
			<label class="label" for="response">Answer</label>
			<div class="control">
				<textarea 
					id="response" 
					class="textarea is-medium is-primary" 
					bind:value={currentResponse} 
					placeholder="e.g., To ensure consistent styling across different browsers.">
				</textarea>
			</div>
		</div>

		<div class="columns">
			<div class="column is-half is-narrow">
				<div class="control">
			<button 
				class="button is-info" 
				onclick={addSet} 
				disabled={!currentQuery || !currentResponse}>
				Add to List ({questions.length})
			</button>
		</div>

			</div>
			<div class="column is-half is-narrow has-text-right">
						<div class="control">
			<button 
				class="button is-danger" 
				onclick={clearSet}>
				Clear Input
			</button>
		</div>
			</div>
		</div>
	</div>

	<div class="columns">
		<div class="column is-one-third">
			<h2 class="title is-4">Current Sets</h2>
			{#if questions.length === 0}
				<p class="has-text-grey">No questions added yet.</p>
			{:else}
				<div class="content">
					{#each questions as item, i}
						<div class="notification is-dark is-flex is-justify-content-space-between is-align-items-center mb-2">
							<span class="is-size-7 has-text-weight-semibold">
								{item.query.substring(0, 40)}...
							</span>
							<button class="delete" aria-label="delete" onclick={() => removeSet(i)}></button>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<div class="column">
			<div class="level mb-2">
				<div class="level-left">
					<h2 class="title is-4 mb-0">JSON Output</h2>
				</div>
				<div class="level-right">
					<button class="button is-small is-success" onclick={copyToClipboard}>
						{copyStatus}
					</button>
				</div>
			</div>
			
			<div class="box has-background-black-ter">
				<pre class="has-background-black-ter has-text-success p-0" style="border: none;"><code>{jsonOutput}</code></pre>
			</div>
		</div>
	</div>
</div>

<style>
	/* Overriding Bulma pre for a cleaner code look */
	pre {
		white-space: pre-wrap;
		word-break: break-all;
	}
</style>