<svelte:options runes />

<script lang="ts">

  // use shared entry type declared globally
  type Entry = App.Entry;

  let search = $state('');
  let entries = $state<Entry[]>([]);

  let { data } = $props<{ entries: Entry[]; book: string }>();

  // local rune for the selected book; initialize from load data
  let book = $state(data.book);

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
                <h1 class="title is-size-1">Symmetrical Carnival</h1>
            </div>
            <div class="column is-narrow">
                <select class="input is-info is-medium" id="book-select"
                    onchange={(e) => {
                        const b = (e.currentTarget as HTMLSelectElement).value;
                        window.location.search = `?book=${b}`;
                    }}>
                    <option value="ca-itf4-1" selected={data.book === 'ca-itf4-1'}>CA-ITF4 Quiz 1</option>
                    <option value="ca-itf4-2" selected={data.book === 'ca-itf4-2'}>CA-ITF4 Quiz 2</option>
                    <option value="ca-itf4-3" selected={data.book === 'ca-itf4-3'}>CA-ITF4 Quiz 3</option>
                    <option value="ca-itf4-f" selected={data.book === 'ca-itf4-f'}>CA-ITF4 Final Quiz</option>
                    <option value="pc24-final" selected={data.book === 'pc24-final'}>PC24 Final Quiz</option>
                    <option value="pc14-final" selected={data.book === 'pc14-final'}>PC14 Final Quiz</option>
                    <option value="nwpo-exam1" selected={data.book === 'nwpo-exam1'}>NWPO Exam 1</option>
                    <option value="nwpo-exam2" selected={data.book === 'nwpo-exam2'}>NWPO Exam 2</option>
                </select>
            </div>
        </div>

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

        {#if filtered.length === 0}
            <p class="has-text-centered has-text-info">No results found</p>
        {:else}
        {#each filtered as item, i (item.query)}
            <hr>
            <div class="columns is-vcentered">
                <div class="column is-8">
                    <strong class="is-size-5">{i+1}. {item.query}</strong>
                </div>
                <div class="column has-background-info-dark has-text-centered">
                    <span class="is-size-4 has-text-primary">{item.response}</span>
                </div>
            </div>
            {/each}
        {/if}
    </div>
</section>
