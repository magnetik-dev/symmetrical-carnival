<svelte:options runes />

<script lang="ts">
    import Sidebar from "$lib/components/Sidebar.svelte";
    import BackToTop from "$lib/components/BackToTop.svelte";

  // use shared entry type declared globally
  type Entry = App.Entry;

  let search = $state('');
  let entries = $state<Entry[]>([]);

  let { data } = $props<{ entries: Entry[]; book: string }>();
  
  // local rune for the selected book; initialize from load data
  // svelte-ignore state_referenced_locally
  let book = $state(data.book);

  const cyberOptions = [
    { value: 'ca-itf4-all', label: 'CA-ITF4 Quizes' },
    { value: 'pc14-final', label: 'PC14 Final Quiz' },
    { value: 'pc24-final', label: 'PC24 Final Quiz' },
    { value: 'nwpo-exam1', label: 'NWPO Exam 1' },
    { value: 'nwpo-exam2', label: 'NWPO Exam 2' },
    { value: 'wndx-mid-term', label: 'WNDX Mid-Term' },
    { value: 'wndx-final', label: 'WNDX Final Exam' },
    { value: 'ca-clodp-module-quiz', label: 'CA-CLODP Module Quizes' },
    { value: 'ca-clodp-final', label: 'CA-CLODP Final Exam' },
    { value: 'ca-serpl-quiz-1', label: 'CA-SERPL Quiz 1' },
    { value: 'ca-serpl-quiz-2', label: 'CA-SERPL Quiz 2' },
    { value: 'ca-serpl-quiz-3', label: 'CA-SERPL Quiz 3' },
    { value: 'ca-serpl-final', label: 'CA-SERPL Final Exam' }

  ];
  const dataOptions = [
        { value: 'dtant-module-quiz', label: 'DTANT Module Quiz' },
    { value: 'dtant-final', label: 'DTANT Final Exam' }
  ];
  const digitalDesignOptions = [
    { value: 'dgmkf-color-theory', label: 'Color Theory' },
    { value: 'dgmkf-quizes-all', label: 'DGMKF Quizes' }
  ];

  const bookOptions = cyberOptions.concat(dataOptions)
                            .concat(digitalDesignOptions);

  $effect(() => {
    entries = data.entries;
    // keep rune in sync if the page load ever changes (rare)
    book = data.book; 
    search = ''; // reset search on new data load
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
            <div class="column is-narrow">
                <!-- drawer start -->
                <Sidebar>
                    <p class="menu-label">Cyber Security</p>
                    <ul class="menu-list">
                        {#each cyberOptions as option}
                        <li>
                            <a href="/quiz?book={option.value}" class="has-text-primary">{option.label}</a>
                        </li>
                        {/each}
                    </ul>
                    <p class="menu-label">Data Analytics</p>
                    <ul class="menu-list">
                        {#each dataOptions as option}
                        <li>
                            <a href="/quiz?book={option.value}" class="has-text-primary">{option.label}</a>
                        </li>
                        {/each}
                    </ul>
                    <p class="menu-label">Digital Design</p>
                    <ul class="menu-list">
                        {#each digitalDesignOptions as option}
                        <li>
                            <a href="/quiz?book={option.value}" class="has-text-primary">{option.label}</a>
                        </li>
                        {/each}
                    </ul>
                </Sidebar>
                <!-- end of drawer -->
            </div>
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
            <div class="column is-narrow is-hidden">
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
        <p class="has-text-size-5 has-text-centered has-text-weight-bold is-hidden-touch">
            <span class="tag is-info is-dark ">{bookOptions.find(opt => opt.value === book)?.label || 'All Books'}</span> 
            <span class="tag is-primary is-dark">{filtered.length} result{filtered.length > 1 ? 's' : ''}</span>
        </p>
        {#each filtered as item, i (item.query)}
            <hr>
            <div class="columns is-vcentered">
                <div class="column is-8">
                    <span class="is-size-5">{item.query}</span>
                </div>
                <div class="column has-background-info-dark has-text-centered is-rounded box is-shadowless">
                    <span class="is-size-5 has-text-primary">{item.response}</span>
                </div>
            </div>
            {/each}
        {/if}
    </div>
</section>

<BackToTop />
