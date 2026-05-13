<script>
	let { children } = $props(); // 'children' is the Svelte 5 way to handle slots
	
	let isOpen = $state(false); // Reactive state rune

	const toggleMenu = () => {
		isOpen = !isOpen;
	};
</script>

<!-- The Toggle Button -->
<button 
	class="button is-primary is-dark menu-trigger" 
	onclick={toggleMenu}
	aria-label="Toggle navigation"
>
	<span>☰</span>
</button>

<!-- The Side Navigation -->

<aside class="menu side-nav {isOpen ? 'is-active' : ''} has-background-black-bis">
    <button onclick={toggleMenu}  class="button has-text-danger has-background-dark is-rounded side-nav-close is-clickable" title="Close menu" aria-label="Close Menu">
        <span class="fa fa-close" ></span>
    </button>
	<div class="menu-content-wrapper">
		{@render children?.()}
	</div>
</aside>

<!-- Overlay -->
{#if isOpen}
	<div 
		class="nav-overlay" 
		onclick={toggleMenu} 
		onkeydown={(e) => e.key === 'Escape' && toggleMenu()} 
		role="button" 
		tabindex="0"
	></div>
{/if}

<style>
	.menu-trigger {
		z-index: 20; /* Below the navbar (30) but above content */
	}

	.side-nav {
		position: fixed;
		top: 0;
		left: -280px; /* Slightly wider for better breathing room */
		width: 280px;
		height: 100vh;
		background-color: white;
		z-index: 2500;
		padding: 2rem 1.5rem;
		box-shadow: 5px 0 15px rgba(0, 0, 0, 0.05);
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		overflow-y: auto;
        border-right: 1px solid #0fb398;
	}

    .side-nav-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        padding: 0.5rem;
    }

	/* Use transform for better performance than 'left' */
	.side-nav.is-active {
		transform: translateX(280px);
	}

	.nav-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(2px); /* Modern touch */
		z-index: 999;
	}

	/* Bulma adjustment: Ensure links look good in a narrow sidebar */
	:global(.menu-list a) {
		border-radius: 6px;
	}
</style>
