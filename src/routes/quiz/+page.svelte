<svelte:options runes />

<script lang="ts">
  // use shared entry type declared globally
  type Entry = App.Entry;

  let search = $state('');
  let entries = $state<Entry[]>([]);

  let { data } = $props<{ entries: Entry[]; book: string }>();

  // local rune for the selected book; initialize from load data
  // svelte-ignore state_referenced_locally
  let book = $state(data.book);

  const bookOptions = [
    { value: 'ca-itf4-1', label: 'CA-ITF4 Quiz 1' },
    { value: 'ca-itf4-2', label: 'CA-ITF4 Quiz 2' },
    { value: 'ca-itf4-3', label: 'CA-ITF4 Quiz 3' },
    { value: 'ca-itf4-f', label: 'CA-ITF4 Final Quiz' },
    { value: 'pc14-final', label: 'PC14 Final Quiz' },
    { value: 'pc24-final', label: 'PC24 Final Quiz' },
    { value: 'nwpo-exam1', label: 'NWPO Exam 1' },
    { value: 'nwpo-exam2', label: 'NWPO Exam 2' },
    { value: 'wndx-mid-term', label: 'WNDX Mid-Term Exam' },
    { value: 'wndx-final', label: 'WNDX Final Exam' },
    { value: 'ca-clodp-module-quiz', label: 'CA-CLODP Module Quiz' },
    { value: 'ca-clodp-final', label: 'CA-CLODP Final Exam' },
    { value: 'dtant-module-quiz', label: 'DTANT Module Quiz' },
    { value: 'dtant-final', label: 'DTANT Final Exam' }
  ];

  $effect(() => {
    entries = data.entries;
    // keep rune in sync if the page load ever changes (rare)
    book = data.book;
  });

  let filtered = $derived(
    search
      ? entries.filter((item) =>
          item.query.toLowerCase().includes(search.toLowerCase())
        )
      : entries
  );
</script>

<section class="section">
    <div class="container">
            
        <div class="columns is-vcentered">
            <div class="column">
                <div class="field">
                    <p class="control has-icons-right">
                        <input id="search" type="text" placeholder="Type to search..."
                            class="input is-large is-rounded is-primary"
                            bind:value={search} />
                        {#if search}
                        <button 
                            class="icon is-right is-clickable"
                            onclick={() => search = ''}
                            title="Clear search">
                            <span class="is-size-3 has-text-white">&times;</span>
                        </button>
                        {/if}
                    </p>
                </div>
            </div>
            <div class="column is-narrow">
                <select class="input is-info is-medium" id="book-select" bind:value={book}
                    onchange={() => {
                        window.location.search = `?book=${book}`;
                    }}>
                    {#each bookOptions as option}
                        <option value={option.value}>{option.label}</option>
                    {/each}
                </select>
            </div>
        </div>

        {#if filtered.length === 0}
            <p class="has-text-centered has-text-info is-size-3 ">No results found</p>
        {:else}
        {#each filtered as item, i (item.query)}
            <hr>
            <div class="columns is-vcentered">
                <div class="column is-8">
                    <span class="is-size-5">{i+1}. {item.query}</span>
                </div>
                <div class="column has-background-info-dark has-text-centered">
                    <span class="is-size-4 has-text-primary">{item.response}</span>
                </div>
            </div>
            {/each}
        {/if}
    </div>
</section>
