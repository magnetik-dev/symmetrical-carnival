<svelte:options runes />

<script lang="ts">
    import Sidebar from "$lib/components/Sidebar.svelte";
    import BackToTop from "$lib/components/BackToTop.svelte";

    // Receive loaded data from page load
    let { data } = $props();

    let search = $state('');

    // Reactive reference to the flat students list from the loaded data
    let students = $derived(data.students || []);

    // Derived rune to filter students based on the search query
    let filteredStudents = $derived(
        students.filter((student: any) => {
            const term = search.toLowerCase().trim();
            if (!term) return true;
            return (
                (student.student_number && student.student_number.toLowerCase().includes(term)) ||
                (student.name && student.name.toLowerCase().includes(term)) ||
                (student.profile && student.profile.toLowerCase().includes(term)) ||
                (student.batch_name && student.batch_name.toLowerCase().includes(term)) ||
                (student.lead_name && student.lead_name.toLowerCase().includes(term))
            );
        })
    );
</script>

<section class="section">
    <div class="container">

        <!-- Level Stats Section -->
        <nav class="level mb-2" style="align-items: flex-start">
            <div class="level-item has-text-centered box is-shadowless has-background-primary-dark p-5 mx-2">
                <div>
                    <p class="heading has-text-weight-medium pb-4 has-text-grey-light">Students</p>
                    <p class="is-size-1 has-text-weight-bold has-text-white">{data.stats.studentsCount}</p>
                </div>
            </div>
            <div class="level-item has-text-centered box is-shadowless has-background-primary-dark p-5 mx-2">
                <div>
                    <p class="heading has-text-weight-medium pb-4 has-text-grey-light">Batches</p>
                    <p class="is-size-1 has-text-weight-bold has-text-white">{data.stats.batchesCount}</p>
                </div>
            </div>
            <div class="level-item has-text-centered box is-shadowless has-background-primary-dark p-5 mx-2">
                <div>
                    <p class="heading has-text-weight-medium pb-4 has-text-grey-light">Programs</p>
                    <p class="is-size-1 has-text-weight-bold has-text-white">{data.stats.programsCount}</p>
                </div>
            </div>
            <div class="level-item has-text-centered box is-shadowless has-background-primary-dark p-5 mx-2">
                <div>
                    <p class="heading has-text-weight-medium pb-4 has-text-grey-light">Leads</p>
                    <p class="is-size-1 has-text-weight-bold has-text-white">{data.stats.leadsCount}</p>
                </div>
            </div>
        </nav>

       

        <!-- Student Records Table -->
        <div class="box is-shadowless has-background-dark">
            <!-- Search Input Field -->
            <div class="box is-shadowless has-background-dark">
                <div class="field">
                    <p class="control has-icons-right">
                        <input 
                            id="search" 
                            type="text" 
                            placeholder="Search students by name, ID, profile, batch, or lead channel..."
                            class="input is-large is-rounded is-primary"
                            bind:value={search} 
                        />
                        {#if search}
                            <button 
                                class="icon is-right is-clickable delete is-large mt-3 mr-3"
                                onclick={() => search = ''}
                                title="Clear search"
                                style="background-color: transparent;"
                                aria-label="Clear search"
                            ></button>
                        {/if}
                    </p>
                </div>
            </div>
            <div class="level mb-4">
                <div class="level-left">
                    <div class="level-item">
                        <h2 class="title is-4 mb-0">Students</h2>
                    </div>
                </div>
                <div class="level-right">
                    <div class="level-item">
                        <span class="tag is-primary is-medium">
                            Showing {filteredStudents.length} of {students.length} Students
                        </span>
                    </div>
                </div>
            </div>

            <div class="table-container">
                <table class="table is-striped is-hoverable is-fullwidth">
                    <thead>
                        <tr>
                            <th class="has-text-grey">Student Number</th>
                            <th class="has-text-grey">Name</th>
                            <th class="has-text-grey">Profile</th>
                            <th class="has-text-grey">Batch</th>
                            <th class="has-text-grey">Referred By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each filteredStudents as student}
                            <tr>
                                <td class="has-text-weight-semibold is-size-4">{student.student_number}</td>
                                <td class="is-size-4">{student.name}</td>
                                <td>
                                    {#if student.profile}
                                        <span class="is-size-4">{student.profile}</span>
                                    {:else}
                                        <span class="has-text-grey-light">N/A</span>
                                    {/if}
                                </td>
                                <td>
                                    {#if student.batch_name}
                                        <span class="tag is-warning is-size-6">{student.batch_name}</span>
                                    {:else}
                                        <span class="has-text-grey-light">N/A</span>
                                    {/if}
                                </td>
                                <td>
                                    {#if student.lead_name}
                                        <span class="tag is-error is-size-6">{student.lead_name}</span>
                                    {:else}
                                        <span class="has-text-grey-light">N/A</span>
                                    {/if}
                                </td>
                            </tr>
                        {:else}
                            <tr>
                                <td colspan="5" class="has-text-centered py-6">
                                    <div class="content has-text-grey">
                                        <p class="is-size-5 mb-1">No records found</p>
                                        <p class="is-size-7">Try adjusting your search criteria or add new entries to the registry.</p>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</section>

<BackToTop />
