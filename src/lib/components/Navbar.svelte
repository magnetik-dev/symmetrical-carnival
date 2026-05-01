<script lang="ts">
    import type { User } from '@supabase/supabase-js';
    
    let { user } = $props<{ user: User | null }>();
    let isActive = $state(false);

    function toggleMenu() {
        isActive = !isActive;
    }
</script>

<nav class="navbar is-dark" aria-label="main navigation">
    <div class="container">
        <div class="navbar-brand">
            <a class="navbar-item is-size-2 title mb-0" href="/">
                Symmetrical Carnival
            </a>

            <button 
                class="navbar-burger {isActive ? 'is-active' : ''}" 
                aria-label="menu" 
                aria-expanded="false" 
                onclick={toggleMenu}
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </button>
        </div>

        <div class="navbar-menu {isActive ? 'is-active' : ''}">
            <div class="navbar-start">
                {#if user}
                    <a class="navbar-item is-size-4" href="/quiz">
                        Quiz
                    </a>
                    <a class="navbar-item is-size-4" href="/generator">
                        Generator
                    </a>
                {/if}
            </div>

            <div class="navbar-end">
                <div class="navbar-item">
                    {#if user}
                        <div class="field is-grouped">
                            <p class="control">
                                <span class="has-text-primary is-light mr-3">
                                    {user.email}
                                </span>
                            </p>
                            <span class="control">
                                <form action="/logout" method="POST">
                                    <button class="button is-warning is-small">
                                        Logout
                                    </button>
                                </form>
                            </span>
                        </div>
                    {:else}
                        <div class="buttons">
                            <a class="button is-light" href="/">
                                Log in
                            </a>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</nav>
