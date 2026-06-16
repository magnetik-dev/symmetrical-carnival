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
        transition: transform 0.2s ease;
    }

    .back-to-top:hover {
        transform: scale(1.05);
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

    @media (prefers-reduced-motion: reduce) {
        .back-to-top {
            transition: none;
        }
        .back-to-top:hover {
            transform: none;
        }
    }

    .back-to-top:hover .icon {
        animation: microFloat 0.8s ease-in-out infinite alternate;
    }

    @keyframes microFloat {
        0% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(-4px); /* Tiny upward float */
        }
    }
</style>
