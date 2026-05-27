<script lang="ts">
    import type { User } from '@supabase/supabase-js';
    
    let { user } = $props<{ user: User | null }>();
    let isActive = $state(false);
    let dropdownActive = $state(false);

    function toggleMenu() {
        isActive = !isActive;
    }

    function toggleDropdown() {
        dropdownActive = !dropdownActive;
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
                        <div class="dropdown {dropdownActive ? 'is-active' : ''}">
                            <div class="dropdown-trigger">
                                <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" aria-expanded={dropdownActive} onclick={toggleDropdown}>
                                    <span>
                                        <i class="icon is-small fa fa-user"></i>
                                        {user.email}
                                        <i class="icon is-small fa fa-chevron-down"></i>
                                    </span>
                                </button>
                            </div>
                            <div class="dropdown-menu" id="dropdown-menu" role="menu">
                                <div class="dropdown-content">
                                    <div class="dropdown-item">
                                        <form action="/logout" method="POST">
                                            <button class="is-borderless is-fullwidth" type="submit">
                                                <i class="fa fa-sign-out mr-2"></i>
                                                Logout
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</nav>
