<svelte:options runes />

<script lang="ts">
    import { onMount } from 'svelte';

    let showButton = $state(false);

    onMount(() => {
        const handleScroll = () => {
            showButton = window.scrollY > 200;
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
</script>

{#if showButton}
    <button
        class="button is-primary is-rounded is-dark back-to-top"
        onclick={scrollToTop}
        title="Back to top"
    >
        <span class="icon">
            <i class="fa fa-arrow-up"></i>
        </span>
    </button>
{/if}

<style>
    .back-to-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 100;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 768px) {
        .back-to-top {
            bottom: 1rem;
            right: 1rem;
        }
    }
</style>
