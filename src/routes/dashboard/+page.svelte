<svelte:options runes />

<script lang="ts">
    import { onMount } from "svelte";
    import { registryCache } from "$lib/state.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import BackToTop from "$lib/components/BackToTop.svelte";

    // Receive layout data containing profile info
    let { data } = $props();
    let search = $state("");

    const isAdmin = $derived(data.profile?.role === "admin");

    // Form state variables
    let showModal = $state(false);
    let studentNumber = $state("");
    let studentName = $state("");
    let studentAltName = $state("");
    let studentEmail = $state("");
    let studentProfile = $state("");
    let studentStatus = $state("ACTIVE");
    let studentNotes = $state("");
    let studentBatchId = $state("");
    let studentReferedBy = $state("");
    let studentPassword = $state("");
    let studentFees = $state("");
    let formError = $state<string | null>(null);
    let formSuccess = $state(false);
    let isSubmitting = $state(false);

    let showPaymentModal = $state(false);
    let paymentStudent = $state<any>(null);
    let paymentAmount = $state("");
    let paymentDate = $state(new Date().toISOString().split("T")[0]);
    let paymentFormError = $state<string | null>(null);
    let paymentFormSuccess = $state(false);
    let isSavingPayment = $state(false);

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
                (student.student_number &&
                    student.student_number.toLowerCase().includes(term)) ||
                (student.name && student.name.toLowerCase().includes(term)) ||
                (student.profile &&
                    student.profile.toLowerCase().includes(term)) ||
                (student.batch_name &&
                    student.batch_name.toLowerCase().includes(term)) ||
                (student.lead_name &&
                    student.lead_name.toLowerCase().includes(term))
            );
        }),
    );

    // Handle form submission
    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        if (
            !studentNumber ||
            !studentName ||
            !studentEmail ||
            !studentPassword ||
            !studentFees
        ) {
            formError =
                "Please fill out all required fields (Student Number, Name, Email, and Password).";
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
            fees_total: studentFees.trim(),
            batch_id: studentBatchId || null,
            refered_by: studentReferedBy || null,
        };

        const result = await registryCache.addStudent(
            studentData,
            studentPassword,
        );

        isSubmitting = false;

        if (result.success) {
            formSuccess = true;
            // Reset form fields
            studentNumber = "";
            studentName = "";
            studentAltName = "";
            studentEmail = "";
            studentProfile = "";
            studentStatus = "ACTIVE";
            studentNotes = "";
            studentBatchId = "";
            studentReferedBy = "";
            studentPassword = "";
            studentFees = "";

            setTimeout(() => {
                showModal = false;
                formSuccess = false;
            }, 1500);
        } else {
            formError =
                result.error || "An error occurred while adding the student.";
        }
    };

    const openPaymentModal = (student: any) => {
        paymentStudent = student;
        paymentAmount = "";
        paymentDate = new Date().toISOString().split("T")[0];
        paymentFormError = null;
        paymentFormSuccess = false;
        isSavingPayment = false;
        showPaymentModal = true;
    };

    const handlePaymentSubmit = async (e: Event) => {
        e.preventDefault();

        if (!paymentAmount || !paymentDate) {
            paymentFormError = "Please enter both the payment amount and date.";
            return;
        }

        isSavingPayment = true;
        paymentFormError = null;
        paymentFormSuccess = false;

        // Placeholder for the actual persistence call.
        console.log("Submitting Payment");
        const paymentData = {
            student_number: paymentStudent?.student_number,
            amount_paid: paymentAmount,
            payment_date: paymentDate + "T00:00:00.000Z",
        };

        const result = await registryCache.recordPayment(paymentData);

        isSavingPayment = false;

        if (result.success) {
            paymentFormSuccess = true;
            // Reset form fields
            paymentAmount = "";
            paymentDate = "";
            paymentStudent = null;

            setTimeout(() => {
                showPaymentModal = false;
                paymentFormSuccess = false;
            }, 1500);
        } else {
            formError =
                result.error || "An error occurred while recording the payment.";
        }

    };
</script>

<section class="section">
    <div class="container">
        <!-- Level Stats Section -->
        <nav class="level" style="align-items: flex-start">
            <div
                class="level-item glow-on-hover has-text-centered box has-background-primary-dark p-3 mx-2">
                <div>
                    <p
                        class="heading has-text-weight-medium is-size-5 pb-4 has-text-grey-light">
                        Students
                    </p>
                    <p class="is-size-1 has-text-weight-bold has-text-white">
                        {registryCache.isLoading && !registryCache.isLoaded
                            ? "..."
                            : registryCache.stats.studentsCount}
                    </p>
                </div>
            </div>
            <div
                class="level-item has-text-centered box glow-on-hover has-background-primary-dark p-3 mx-2">
                <div>
                    <p
                        class="heading has-text-weight-medium is-size-5 pb-4 has-text-grey-light">
                        Batches
                    </p>
                    <p class="is-size-1 has-text-weight-bold has-text-white">
                        {registryCache.isLoading && !registryCache.isLoaded
                            ? "..."
                            : registryCache.stats.batchesCount}
                    </p>
                </div>
            </div>
            <div
                class="level-item has-text-centered box glow-on-hover has-background-primary-dark p-3 mx-2">
                <div>
                    <p
                        class="heading has-text-weight-medium is-size-5 pb-4 has-text-grey-light">
                        Courses
                    </p>
                    <p class="is-size-1 has-text-weight-bold has-text-white">
                        {registryCache.isLoading && !registryCache.isLoaded
                            ? "..."
                            : registryCache.stats.programsCount}
                    </p>
                </div>
            </div>
            <div class="level-item has-text-centered box glow-on-hover has-background-primary-dark p-3 mx-2">
                <div>
                    <p
                        class="heading has-text-weight-medium is-size-5 pb-4 has-text-grey-light">
                        Leads
                    </p>
                    <p class="is-size-1 has-text-weight-bold has-text-white">
                        {registryCache.isLoading && !registryCache.isLoaded
                            ? "..."
                            : registryCache.stats.leadsCount}
                    </p>
                </div>
            </div>
        </nav>

        <!-- Error Notification -->
        {#if registryCache.error}
            <div class="notification is-danger is-light">
                <button
                    class="delete"
                    onclick={() => (registryCache.error = null)}
                    aria-label="Dismiss error"></button>
                <strong>Error:</strong>
                {registryCache.error}
            </div>
        {/if}

        <!-- Student Records Table -->
        <div class="box is-shadowless has-background-dark">
            <!-- Search Input Field -->
            <div class="box is-shadowless has-background-dark px-0">
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
                                onclick={() => (search = "")}
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
                    <div class="level-item">&nbsp;</div>
                </div>
                <div class="level-right">
                    <div class="level-item">
                        <!-- Add Student Button (Admin Only) -->
                        {#if isAdmin}
                            <button
                                class="button is-primary is-darker is-small is-rounded mr-3"
                                onclick={() => {
                                    showModal = true;
                                    formError = null;
                                    formSuccess = false;
                                }}
                                title="Add new student record">
                                <i class="fa fa-plus mr-2" aria-hidden="true"></i>
                                <span>Add Student</span>
                            </button>
                        {/if}
                        <!-- Manual Refresh Button -->
                        <button
                            class="button is-primary is-darker is-small is-rounded mr-3 {registryCache.isLoading
                                ? 'is-loading'
                                : ''}"
                            onclick={() => registryCache.loadData(true)}
                            title="Force refresh from database"
                            disabled={registryCache.isLoading}>
                            <i class="fa fa-refresh mr-2" aria-hidden="true"></i>
                            <span>Refresh</span>
                        </button>
                        <span class="tag is-secondary is-medium">
                            Showing {filteredStudents.length} of {students.length}
                            Students
                        </span>
                    </div>
                </div>
            </div>

            <div class="table-container">
                <table class="table is-striped is-hoverable is-fullwidth">
                    <thead>
                        <tr>
                            <th class="has-text-grey is-size-4">Student</th>
                            <th class="has-text-grey is-size-4">Profile</th>
                            <th class="has-text-grey is-size-4">Batch</th>
                            <th class="has-text-grey is-size-4">Reference</th>
                            {#if isAdmin}
                                <th class="has-text-grey is-size-4">Payment</th>
                            {/if}
                        </tr>
                    </thead>
                    <tbody>
                        {#if registryCache.isLoading && !registryCache.isLoaded}
                            <tr>
                                <td colspan="5" class="has-text-centered py-6">
                                    <progress
                                        class="progress is-small is-primary"
                                        max="100">Loading</progress>
                                    <p class="has-text-grey is-size-7 mt-2">
                                        Loading registry data from Supabase...
                                    </p>
                                </td>
                            </tr>
                        {:else}
                            {#each filteredStudents as student}
                                <tr class="is-size-5">
                                    <td>
                                        <span class="is-size-4 has-text-weight-bold">
                                            {student.name}
                                        </span>
                                        <br>
                                        <span class="is-size-6 has-text-grey-light">
                                            {student.student_number}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="has-text-grey-light">{student.profile}</span>
                                    </td>
                                    <td>
                                        {#if student.batch_name}
                                            <span class="tag is-info is-size-6 is-hoverable">{student.batch_name}</span>
                                        {:else}
                                            <span class="has-text-grey-light is-size-6">N/A</span>
                                        {/if}
                                    </td>
                                    <td>
                                        {#if student.lead_name}
                                            <span class="tag is-warning is-size-6 is-hoverable">{student.lead_name}</span>
                                        {:else}
                                            <span class="has-text-grey-light is-size-6">N/A</span>
                                        {/if}
                                        {#if isAdmin}
                                            <br>
                                            <span class="tag is-success is-size-6 mt-2"> {student.payment_status || 'NA'} </span>
                                        {/if}
                                    </td>
                                    {#if isAdmin}
                                        <td>
                                            <div>
                                                <div class="is-flex is-justify-content-space-between is-size-7 mb-1">
                                                    <span class="has-text-success">Paid: ${student.fees_paid || 0}</span>
                                                    <span class="has-text-grey">Total: ${student.fees_total}</span>
                                                </div>
                                                <progress class="progress is-success is-small mb-1" value="{student.fees_paid || 0}" max="{student.fees_total || 1250}" title="Remaining: ${student.fees_remaining}">
                                                </progress>
                                            </div>
                                            <button
                                                type="button"
                                                class="button is-small is-link is-rounded mt-4 is-fullwidth"
                                                onclick={() => openPaymentModal(student)}
                                                title="Record payment for this student">
                                                <i class="fa fa-money mr-2" aria-hidden="true"></i>
                                                Record Payment
                                            </button>
                                        </td>
                                    {/if}
                                </tr>
                            {:else}
                                <tr>
                                    <td
                                        colspan="5"
                                        class="has-text-centered py-6">
                                        <div class="content has-text-grey">
                                            <p class="is-size-5 mb-1">
                                                No records found
                                            </p>
                                            <p class="is-size-7">
                                                Try adjusting your search
                                                criteria or add new entries to
                                                the registry.
                                            </p>
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
{#if isAdmin}
    <div class="modal {showModal ? 'is-active' : ''}">
        <div
            class="modal-background"
            onclick={() => {
                if (!isSubmitting) showModal = false;
            }}
            role="button"
            tabindex="0"
            onkeydown={(e) =>
                e.key === "Escape" && !isSubmitting && (showModal = false)}
        ></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Add Student Record</p>
                <button
                    class="delete"
                    aria-label="close"
                    onclick={() => {
                        if (!isSubmitting) showModal = false;
                    }}
                ></button>
            </header>
            <section class="modal-card-body">
                {#if formError}
                    <div class="notification is-danger is-light">
                        <button
                            class="delete"
                            onclick={() => (formError = null)}
                            aria-label="Dismiss error"
                        ></button>
                        <strong>Error:</strong>
                        {formError}
                    </div>
                {/if}

                {#if formSuccess}
                    <div class="notification is-success is-light">
                        <strong>Success:</strong> Student record created and credentials
                        encrypted successfully!
                    </div>
                {/if}

                <form onsubmit={handleSubmit}>
                    <div class="columns">
                        <div class="column is-half">
                            <!-- Student Number -->
                            <div class="field">
                                <label class="label" for="student-number">
                                    Student Number 
                                    <span class="has-text-danger">*</span>
                                </label>
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
                                <label class="label" for="student-email">
                                    Email Address 
                                    <span class="has-text-danger">*</span>
                                </label>
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
                                <label class="label" for="student-name">Full Name 
                                    <span class="has-text-danger">*</span>
                                </label>
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
                                <label class="label" for="student-password">Password 
                                    <span class="has-text-danger">*</span>
                                </label>
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
                                        <select
                                            id="student-batch"
                                            bind:value={studentBatchId}
                                            disabled={isSubmitting ||
                                                formSuccess}>
                                            <option value="">-- Select Batch --</option>
                                            {#each registryCache.batchesList as batch}
                                                <option value={batch.id}>
                                                    {batch.batch_name || "Unnamed Batch"}
                                                    </option                                                >
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
                                        <select
                                            id="student-referred"
                                            bind:value={studentReferedBy}
                                            disabled={isSubmitting ||
                                                formSuccess}>
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

                    <div class="columns">
                        <div class="column is-half">
                            <div class="field">
                                <label class="label" for="student-fees">Total Fees</label>
                                <div class="control">
                                    <input
                                        id="student-fees"
                                        class="input"
                                        type="text"
                                        placeholder="1250"
                                        bind:value={studentFees}
                                        disabled={isSubmitting || formSuccess}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Hidden submit button so hitting enter submits the form -->
                    <button
                        type="submit"
                        class="is-hidden"
                        aria-label="Submit Form"
                        disabled={isSubmitting || formSuccess}
                    ></button>
                </form>
            </section>
            <footer class="modal-card-foot">
                <button
                    type="button"
                    class="button mr-2 is-success {isSubmitting
                        ? 'is-loading'
                        : ''}"
                    onclick={handleSubmit}
                    disabled={isSubmitting || formSuccess}
                >
                    Save Student
                </button>
                <button
                    type="button"
                    class="button"
                    onclick={() => {
                        if (!isSubmitting) showModal = false;
                    }}
                    disabled={isSubmitting || formSuccess}
                >
                    Cancel
                </button>
            </footer>
        </div>
    </div>
{/if}

{#if isAdmin}
    <div class="modal {showPaymentModal ? 'is-active' : ''}">
        <div
            class="modal-background"
            onclick={() => {
                if (!isSavingPayment) showPaymentModal = false;
            }}
            role="button"
            tabindex="0"
            onkeydown={(e) =>
                e.key === "Escape" && !isSavingPayment && (showPaymentModal = false)
            }
        ></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                    Record Payment for {paymentStudent?.name || "student"} ({paymentStudent?.student_number})
                </p>
                <button
                    class="delete"
                    aria-label="close"
                    onclick={() => {
                        if (!isSavingPayment) showPaymentModal = false;
                    }}
                ></button>
            </header>
            <section class="modal-card-body">
                {#if paymentFormError}
                    <div class="notification is-danger is-light">
                        <button
                            class="delete"
                            onclick={() => (paymentFormError = null)}
                            aria-label="Dismiss error"
                        ></button>
                        <strong>Error:</strong>
                        {paymentFormError}
                    </div>
                {/if}

                {#if paymentFormSuccess}
                    <div class="notification is-success is-light">
                        <strong>Success:</strong> Payment recorded successfully.
                    </div>
                {/if}

                <form onsubmit={handlePaymentSubmit}>
                    <div class="field">
                        <label class="label" for="payment-amount">Amount</label>
                        <div class="control">
                            <input
                                id="payment-amount"
                                class="input"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="e.g. 2500"
                                bind:value={paymentAmount}
                                required
                                disabled={isSavingPayment || paymentFormSuccess}
                            />
                        </div>
                    </div>

                    <div class="field">
                        <label class="label" for="payment-date">Date</label>
                        <div class="control">
                            <input
                                id="payment-date"
                                class="input"
                                type="date"
                                bind:value={paymentDate}
                                required
                                disabled={isSavingPayment || paymentFormSuccess}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        class="is-hidden"
                        aria-label="Submit Payment"
                        disabled={isSavingPayment || paymentFormSuccess}
                    ></button>
                </form>
            </section>
            <footer class="modal-card-foot">
                <button
                    type="button"
                    class="button mr-2 is-success {isSavingPayment ? 'is-loading' : ''}"
                    onclick={handlePaymentSubmit}
                    disabled={isSavingPayment || paymentFormSuccess}>
                    Save Payment
                </button>
                <button
                    type="button"
                    class="button"
                    onclick={() => {
                        if (!isSavingPayment) showPaymentModal = false;
                    }}
                    disabled={isSavingPayment || paymentFormSuccess}>
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
        transition:
            box-shadow 0.6s ease,
            transform 0.6s ease;
        box-shadow: none;
    }

    .glow-on-hover:hover {
        /* Adjust the color (#00d1b2) to match your specific Bulma primary color */
        box-shadow: 0 0 20px 5px rgba(0, 209, 178, 0.4);

        /* Optional: slightly lifts the box for a more dynamic interactive feel */
        transform: translateY(-2px);
    }
</style>
