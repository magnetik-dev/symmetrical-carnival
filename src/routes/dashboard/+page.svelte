<svelte:options runes />

<script lang="ts">
    import Sidebar from "$lib/components/Sidebar.svelte";
    import BackToTop from "$lib/components/BackToTop.svelte";

    let search = $state('');
</script>

<section class="section">
    <div class="container">

        <div class="columns is-vcentered">

            <div class="column">

                <!-- level start -->
                <nav class="level" style="align-items: flex-start">
                    <div class="level-item has-text-centered  box is-shadowless has-background-primary-dark p-5">
                        <div>
                        <p class="heading has-text-weight-medium pb-4">Students</p>
                        <p class="is-size-1 has-text-weight-bold has-text-white">50</p>
                        </div>
                    </div>
                    <div class="level-item has-text-centered box is-shadowless has-background-primary-dark p-5">
                        <div>
                        <p class="heading has-text-weight-medium pb-4">Batches</p>
                        <p class="is-size-1 has-text-weight-bold has-text-white">8</p>
                        </div>
                    </div>
                    <div class="level-item has-text-centered box is-shadowless has-background-primary-dark p-5">
                        <div>
                        <p class="heading has-text-weight-medium pb-4">Courses</p>
                        <p class="is-size-1 has-text-weight-bold has-text-white">4</p>
                        </div>
                    </div>
                    <div class="level-item has-text-centered box is-shadowless has-background-primary-dark p-5">
                        <div>
                        <p class="heading has-text-weight-medium pb-4">Leads</p>
                        <p class="is-size-1 has-text-weight-bold has-text-white">3</p>
                        </div>
                    </div>
                </nav>
                <!-- level end -->

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
        </div>

        Body
    </div>
</section>

<BackToTop />
