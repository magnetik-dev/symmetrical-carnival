<svelte:options runes />

<script lang="ts">
    import { onMount } from 'svelte';

    // Destructure the properties directly from the $props() rune
    let { statName, statValue } = $props();

    onMount(() => {
		// This is now safe from SSR errors
		const card = document.querySelector('.spotlight') as HTMLElement | null;

		if (card) {
			card.addEventListener('mousemove', (e: MouseEvent) => {
				const rect = card.getBoundingClientRect();
				card.style.setProperty('--x', `${e.clientX - rect.left}px`);
				card.style.setProperty('--y', `${e.clientY - rect.top}px`);
			});
		}
	});
</script>

<div class="level-item spotlight has-text-centered p-3 mx-2 box is-shadowless">
    <div>
        <p class="heading has-text-weight-medium is-size-5 pb-4 has-text-grey-light">
            {statName}
        </p>
        <p class="is-size-1 has-text-weight-bold has-text-white">
            {statValue}
        </p>
    </div>
</div>

<style>
.spotlight {
    cursor: pointer;
    transition: border-color 0.3s ease;
    position: relative;
    overflow: hidden;
    background-color: #003830;
}

.spotlight::before { 
    content: '';
    /* Fixed the spelling of transparent here 👇 */
    background: radial-gradient(
        circle,
        rgba(8, 182, 217, 0.20) 0%,
        transparent 65% 
    );
    position: absolute;
    width: 300px;
    height: 300px;
    
    /* Fallback to center of the element if JS hasn't loaded yet */
    top: var(--y, 50%);
    left: var(--x, 50%);
    
    transform: translate(-50%, -50%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1; /* Ensures it stays visible above background colors */
}

.spotlight:hover::before {
    opacity: 1;
}
</style>
