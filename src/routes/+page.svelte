<svelte:options runes />

<script lang="ts">
  interface Entry {
    query: string;
    response: string;
  }

  let search = $state('');
  let entries = $state<Entry[]>([]);

  let { data } = $props<{ entries: Entry[] }>();

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

<section class="section">
    <div class="container">
            
        <div class="columns is-vcentered">
            <div class="column">
                <h1 class="title is-size-1">Symmetrical Carnival</h1>
            </div>
            <div class="column is-narrow">
                <select class="input is-info" id="book-select"
                onchange={(e) => {
                    const b = (e.currentTarget as HTMLSelectElement).value;
                    window.location.search = `?book=${b}`;
                }}>
                <option value="book4" selected={data.book === 'book4'}>02-CA-ITF4 Quiz 1</option>
                <option value="book1" selected={data.book === 'book2'}>02-CA-ITF4 Quiz 2</option>
                <option value="book2" selected={data.book === 'book5'}>02-CA-ITF4 Quiz 3</option>
                <option value="book5" selected={data.book === 'book3'}>02-CA-ITF4 Final Quiz</option>
                <option value="book3" selected={data.book === 'book1'}>03-PC14 Final Quiz</option>
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
