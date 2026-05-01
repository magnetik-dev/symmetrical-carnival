<script lang="ts">
    let { data, form } = $props();
</script>

<section class="section">
    <div class="container">
        <div class="columns is-centered">
            <div class="column is-4">
                <div class="box">
                    <h1 class="title has-text-centered">Symmetrical Carnival</h1>

                    {#if form?.error}
                        <div class="notification is-danger is-light">
                            {form.error}
                        </div>
                    {/if}

                    {#if form?.success}
                        <div class="notification is-success is-light">
                            {form.success}
                        </div>
                    {/if}

                    <form method="POST">
                        <div class="field">
                            <label class="label" for="email">Email</label>
                            <div class="control has-icons-left">
                                <input class="input" type="email" id="email" name="email" placeholder="e.g. alex@example.com" required>
                                <span class="icon is-small is-left">
                                    <i class="fas fa-envelope"></i>
                                </span>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label" for="password">Password</label>
                            <div class="control has-icons-left">
                                <input class="input" type="password" id="password" name="password" placeholder="********" required>
                                <span class="icon is-small is-left">
                                    <i class="fas fa-lock"></i>
                                </span>
                            </div>
                        </div>

                        <div class="field is-grouped is-grouped-centered mt-5">
                            <div class="control">
                                <button class="button is-primary" formaction="?/login">Login</button>
                            </div>
                            <div class="control">
                                <button class="button is-light" formaction="?/signup">Sign up</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
