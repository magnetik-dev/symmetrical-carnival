<svelte:options runes />

<script lang="ts">
  interface Entry {
    query: string;
    response: string;
  }

  let search = $state('');
  let entries = $state<Entry[]>([]);

  let { data } = $props<{ entries: Entry[] }>();
  let { book } = data;

  $effect(() => {
    entries = data.entries;
  });

  let filtered = $derived(
    search
      ? entries.filter((item) =>
          item.query.toLowerCase().includes(search.toLowerCase())
        )
      : entries
  );
</script>

<div class="container">
        
    <div class="columns is-vcentered">
        <div class="column">
            <h1 class="title is-size-1">Book: {book}</h1>
        </div>
        <div class="column is-narrow">
            <select class="input is-info"
            onchange={(e) => {
                const b = (e.currentTarget as HTMLSelectElement).value;
                window.location.search = `?book=${b}`;
            }}>
            <option value="book1" selected={book === 'book1'}>PC14 Final Quiz</option>
            <option value="book2" selected={book === 'book2'}>Test Option</option>
            </select>
        </div>
    </div>

    <div class="columns is-vcentered">
        <div class="column is-narrow">
            <label for="search" class="label is-size-2">Search</label>
        </div>
        <div class="column">
            <input id="search" type="text" placeholder="Type to search..."
                class="input is-large is-rounded is-primary"
                bind:value={search} />
        </div>
    </div>

    {#if filtered.length === 0}
        <p>No results.</p>
    {:else}
    {#each filtered as item, i (item.query)}
        <hr>
        <div class="columns is-vcentered">
            <div class="column is-8">
                <strong class="is-size-5">{i+1}. {item.query}</strong>
            </div>
            <div class="column has-background-info-dark">
                <span class="is-size-4 has-text-primary">{item.response}</span>
            </div>
        </div>
        {/each}
    {/if}
</div>
