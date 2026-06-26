<svelte:options runes />

<script lang="ts">
    import { onMount } from "svelte";
    import { registryCache } from "$lib/state.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import BackToTop from "$lib/components/BackToTop.svelte";

    // Receive layout data containing profile info
    let { data } = $props();

    let search = $state('');

    // Form state variables
    let showModal = $state(false);
    let studentNumber = $state('');
    let studentName = $state('');
    let studentAltName = $state('');
    let studentEmail = $state('');
    let studentProfile = $state('');
    let studentStatus = $state('ACTIVE');
    let studentNotes = $state('');
    let studentBatchId = $state('');
    let studentReferedBy = $state('');
    let studentPassword = $state('');
    let formError = $state<string | null>(null);
    let formSuccess = $state(false);
    let isSubmitting = $state(false);

    // Load data on component mount (reads from sessionStorage cache first, then fetches if empty)
    onMount(() => {
        registryCache.loadData();
    });

    // Reactive reference to the flat students list from the cache store
    let students = $derived(registryCache.students);

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

    // Handle form submission
    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        
        if (!studentNumber || !studentName || !studentEmail || !studentPassword) {
            formError = 'Please fill out all required fields (Student Number, Name, Email, and Password).';
            return;
        }

        isSubmitting = true;
        formError = null;
        formSuccess = false;

        const studentData = {
            student_number: studentNumber.trim(),
            name: studentName.trim(),
            alt_name: studentAltName.trim() || null,
            email: studentEmail.trim(),
            profile: studentProfile.trim() || null,
            status: studentStatus,
            notes: studentNotes.trim() || null,
            batch_id: studentBatchId || null,
            refered_by: studentReferedBy || null
        };

        const result = await registryCache.addStudent(studentData, studentPassword);

        isSubmitting = false;

        if (result.success) {
            formSuccess = true;
            // Reset form fields
            studentNumber = '';
            studentName = '';
            studentAltName = '';
            studentEmail = '';
            studentProfile = '';
            studentStatus = 'ACTIVE';
            studentNotes = '';
            studentBatchId = '';
            studentReferedBy = '';
            studentPassword = '';
            
            setTimeout(() => {
                showModal = false;
                formSuccess = false;
            }, 1500);
        } else {
            formError = result.error || 'An error occurred while adding the student.';
        }
    };
</script>

<section class="section">
    <div class="container">

        <!-- Level Stats Section -->
        <nav class="level" style="align-items: flex-start">
            <div class="level-item glow-on-hover has-text-centered box has-background-primary-dark p-3 mx-2">
                <div>
                    <p class="heading has-text-weight-medium is-size-5 pb-4 has-text-grey-light">Students</p>
                    <p class="is-size-1 has-text-weight-bold has-text-white">
                        {registryCache.isLoading && !registryCache.isLoaded ? '...' : registryCache.stats.studentsCount}
                    </p>
                </div>
            </div>
            <div class="level-item has-text-centered box glow-on-hover has-background-primary-dark p-3 mx-2">
                <div>
                    <p class="heading has-text-weight-medium is-size-5 pb-4 has-text-grey-light">Batches</p>
                    <p class="is-size-1 has-text-weight-bold has-text-white">
                        {registryCache.isLoading && !registryCache.isLoaded ? '...' : registryCache.stats.batchesCount}
                    </p>
                </div>
            </div>
            <div class="level-item has-text-centered box glow-on-hover has-background-primary-dark p-3 mx-2">
                <div>
                    <p class="heading has-text-weight-medium is-size-5 pb-4 has-text-grey-light">Courses</p>
                    <p class="is-size-1 has-text-weight-bold has-text-white">
                        {registryCache.isLoading && !registryCache.isLoaded ? '...' : registryCache.stats.programsCount}
                    </p>
                </div>
            </div>
            <div class="level-item has-text-centered box glow-on-hover has-background-primary-dark p-3 mx-2">
                <div>
                    <p class="heading has-text-weight-medium is-size-5 pb-4 has-text-grey-light">Leads</p>
                    <p class="is-size-1 has-text-weight-bold has-text-white">
                        {registryCache.isLoading && !registryCache.isLoaded ? '...' : registryCache.stats.leadsCount}
                    </p>
                </div>
            </div>
        </nav>

        <!-- Error Notification -->
        {#if registryCache.error}
            <div class="notification is-danger is-light">
                <button class="delete" onclick={() => registryCache.error = null} aria-label="Dismiss error"></button>
                <strong>Error:</strong> {registryCache.error}
            </div>
        {/if}

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
                            disabled={registryCache.isLoading && !registryCache.isLoaded}
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
                        &nbsp;
                    </div>
                </div>
                <div class="level-right">
                    <div class="level-item">
                        <!-- Add Student Button (Admin Only) -->
                        {#if data.profile?.role === 'admin'}
                            <button 
                                class="button is-success is-small is-rounded mr-3" 
                                onclick={() => { showModal = true; formError = null; formSuccess = false; }}
                                title="Add new student record"
                            >
                                <i class="fa fa-plus mr-2" aria-hidden="true"></i>
                                <span>Add Student</span>
                            </button>
                        {/if}
                        <!-- Manual Refresh Button -->
                        <button 
                            class="button is-primary is-darker is-small is-rounded mr-3 {registryCache.isLoading ? 'is-loading' : ''}" 
                            onclick={() => registryCache.loadData(true)}
                            title="Force refresh from database"
                            disabled={registryCache.isLoading}
                        >
                            <i class="fa fa-refresh mr-2" aria-hidden="true"></i>
                            <span>Refresh</span>
                        </button>
                        <span class="tag is-primary is-light is-medium">
                            Showing {filteredStudents.length} of {students.length} Students
                        </span>
                    </div>
                </div>
            </div>

            <div class="table-container">
                <table class="table is-striped is-hoverable is-fullwidth">
                    <thead>
                        <tr>
                            <th class="has-text-grey is-size-4">Student Number</th>
                            <th class="has-text-grey is-size-4">Name</th>
                            <th class="has-text-grey is-size-4">Profile</th>
                            <th class="has-text-grey is-size-4">Batch</th>
                            <th class="has-text-grey is-size-4">Referred By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#if registryCache.isLoading && !registryCache.isLoaded}
                            <tr>
                                <td colspan="5" class="has-text-centered py-6">
                                    <progress class="progress is-small is-primary" max="100">Loading</progress>
                                    <p class="has-text-grey is-size-7 mt-2">Loading registry data from Supabase...</p>
                                </td>
                            </tr>
                        {:else}
                            {#each filteredStudents as student}
                                <tr class="is-size-4">
                                    <td class="has-text-weight-semibold">{student.student_number}</td>
                                    <td>{student.name}</td>
                                    <td>
                                        {#if student.profile}
                                            <span class="has-text-grey-light">{student.profile}</span>
                                        {:else}
                                            <span class="has-text-grey-light">N/A</span>
                                        {/if}
                                    </td>
                                    <td>
                                        {#if student.batch_name}
                                            <span class="tag is-info">{student.batch_name}</span>
                                        {:else}
                                            <span class="has-text-grey-light">N/A</span>
                                        {/if}
                                    </td>
                                    <td>
                                        {#if student.lead_name}
                                            <span class="tag is-success is-light">{student.lead_name}</span>
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
                        {/if}
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</section>

<!-- Add Student Modal (Only accessible/rendered for admin users) -->
{#if data.profile?.role === 'admin'}
    <div class="modal {showModal ? 'is-active' : ''}">
        <div class="modal-background" onclick={() => { if (!isSubmitting) showModal = false; }} role="button" tabindex="0" onkeydown={(e) => e.key === 'Escape' && !isSubmitting && (showModal = false)}></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Add Student Record</p>
                <button class="delete" aria-label="close" onclick={() => { if (!isSubmitting) showModal = false; }}></button>
            </header>
            <section class="modal-card-body">
                {#if formError}
                    <div class="notification is-danger is-light">
                        <button class="delete" onclick={() => formError = null} aria-label="Dismiss error"></button>
                        <strong>Error:</strong> {formError}
                    </div>
                {/if}

                {#if formSuccess}
                    <div class="notification is-success is-light">
                        <strong>Success:</strong> Student record created and credentials encrypted successfully!
                    </div>
                {/if}

                <form onsubmit={handleSubmit}>
                    <div class="columns">
                        <div class="column is-half">
                                                <!-- Student Number -->
                            <div class="field">
                                <label class="label" for="student-number">Student Number <span class="has-text-danger">*</span></label>
                                <div class="control">
                                    <input 
                                        id="student-number"
                                        class="input" 
                                        type="text" 
                                        placeholder="e.g. STU12345" 
                                        bind:value={studentNumber} 
                                        required 
                                        disabled={isSubmitting || formSuccess}
                                    />
                                </div>
                            </div>

                        </div>
                        <div class="column is-half">
                            <!-- Email -->
                            <div class="field">
                                <label class="label" for="student-email">Email Address <span class="has-text-danger">*</span></label>
                                <div class="control">
                                    <input 
                                        id="student-email"
                                        class="input" 
                                        type="email" 
                                        placeholder="e.g. jane.doe@example.com" 
                                        bind:value={studentEmail} 
                                        required 
                                        disabled={isSubmitting || formSuccess}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column is-half">
                            <!-- Name -->
                            <div class="field">
                                <label class="label" for="student-name">Full Name <span class="has-text-danger">*</span></label>
                                <div class="control">
                                    <input 
                                        id="student-name"
                                        class="input" 
                                        type="text" 
                                        placeholder="e.g. Jane Doe" 
                                        bind:value={studentName} 
                                        required 
                                        disabled={isSubmitting || formSuccess}
                                    />
                                </div>
                            </div>                           
                        </div>
                        <div class="column is-half">
                            <!-- Alternate Name -->
                            <div class="field">
                                <label class="label" for="student-alt-name">Alternate Name (Optional)</label>
                                <div class="control">
                                    <input 
                                        id="student-alt-name"
                                        class="input" 
                                        type="text" 
                                        placeholder="e.g. J. Doe" 
                                        bind:value={studentAltName} 
                                        disabled={isSubmitting || formSuccess}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column is-half">
                    <!-- Password -->
                    <div class="field">
                        <label class="label" for="student-password">Password <span class="has-text-danger">*</span></label>
                        <div class="control">
                            <input 
                                id="student-password"
                                class="input" 
                                type="password" 
                                placeholder="Enter student portal password" 
                                bind:value={studentPassword} 
                                required 
                                disabled={isSubmitting || formSuccess}
                            />
                        </div>
                    </div>
                        </div>
                        <div class="column is-half">
                    <!-- Profile Link/Text -->
                    <div class="field">
                        <label class="label" for="student-profile">Profile (Optional)</label>
                        <div class="control">
                            <input 
                                id="student-profile"
                                class="input" 
                                type="text" 
                                placeholder="Browser@System" 
                                bind:value={studentProfile} 
                                disabled={isSubmitting || formSuccess}
                            />
                        </div>
                    </div>
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column is-half">
                    <!-- Batch Dropdown (Cached) -->
                    <div class="field">
                        <label class="label" for="student-batch">Batch / Cohort (Optional)</label>
                        <div class="control">
                            <div class="select is-fullwidth">
                                <select id="student-batch" bind:value={studentBatchId} disabled={isSubmitting || formSuccess}>
                                    <option value="">-- Select Batch --</option>
                                    {#each registryCache.batchesList as batch}
                                        <option value={batch.id}>{batch.batch_name || 'Unnamed Batch'}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    </div>

                        </div>
                        <div class="column is-half">
                    <!-- Referred By / Lead Dropdown (Cached) -->
                    <div class="field">
                        <label class="label" for="student-referred">Referred By / Lead Source (Optional)</label>
                        <div class="control">
                            <div class="select is-fullwidth">
                                <select id="student-referred" bind:value={studentReferedBy} disabled={isSubmitting || formSuccess}>
                                    <option value="">-- Select Lead Source --</option>
                                    {#each registryCache.leadsList as lead}
                                        <option value={lead.id}>{lead.lead_name}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    </div>

                        </div>
                    </div>









                    <!-- Hidden submit button so hitting enter submits the form -->
                    <button type="submit" class="is-hidden" aria-label="Submit Form" disabled={isSubmitting || formSuccess}></button>
                </form>
            </section>
            <footer class="modal-card-foot">
                <button 
                    type="button" 
                    class="button is-success {isSubmitting ? 'is-loading' : ''}" 
                    onclick={handleSubmit}
                    disabled={isSubmitting || formSuccess}
                >
                    Save Student
                </button>
                <button 
                    type="button" 
                    class="button" 
                    onclick={() => { if (!isSubmitting) showModal = false; }}
                    disabled={isSubmitting || formSuccess}
                >
                    Cancel
                </button>
            </footer>
        </div>
    </div>
{/if}

<BackToTop />

<style>
.glow-on-hover {
  /* Smooth transition for when the mouse enters AND leaves the box */
  transition: box-shadow 0.6s ease, transform 0.6s ease;
  box-shadow: none;
}

.glow-on-hover:hover {
  /* Adjust the color (#00d1b2) to match your specific Bulma primary color */
  box-shadow: 0 0 20px 5px rgba(0, 209, 178, 0.4);
  
  /* Optional: slightly lifts the box for a more dynamic interactive feel */
  transform: translateY(-2px); 
}
</style>
