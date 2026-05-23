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
            <a class="navbar-item is-size-2 is-size-4-mobile title mb-0" href="/">
                Symmetrical Carnival
            </a>

            <button 
                class="navbar-burger has-text-primary {isActive ? 'is-active' : ''}" 
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
                                    <i class="fa fa-user"></i>
                                    {user.email}
                                </span>
                            </p>
                            <span class="control">
                                <form action="/logout" method="POST">
                                    <button class="button is-warning is-small">
                                        <i class="fa fa-sign-out mr-2"></i>
                                        Logout
                                    </button>
                                </form>
                            </span>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</nav>
