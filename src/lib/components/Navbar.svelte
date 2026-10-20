<script lang="ts">
	import type { User } from "@supabase/supabase-js";

	let { user, profile } = $props<{ user: User | null; profile: App.Profile | null }>();
	let isActive = $state(false);

	function closeMenu() {
		isActive = false;
	}
</script>

<nav class="navbar is-dark has-shadow" aria-label="Main navigation">
	<div class="container">
		<div class="navbar-brand">
			<a
				class="navbar-item is-size-4 is-size-5-mobile has-text-weight-bold has-text-primary"
				href="/"
				onclick={closeMenu}
			>
				Symmetrical Carnival
			</a>

			<button
				class={["navbar-burger", { "is-active": isActive }]}
				type="button"
				aria-label={isActive ? "Close navigation menu" : "Open navigation menu"}
				aria-expanded={isActive}
				aria-controls="main-navbar-menu"
				onclick={() => (isActive = !isActive)}
			>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
			</button>
		</div>

		<div class={["navbar-menu", { "is-active": isActive }]} id="main-navbar-menu">
			<div class="navbar-start">
				{#if user}
					<a class="navbar-item has-text-weight-semibold" href="/dashboard" onclick={closeMenu}>
						<span>Dashboard</span>
					</a>
					<a class="navbar-item has-text-weight-semibold" href="/quiz" onclick={closeMenu}>
						<span>Quiz</span>
					</a>
					<a class="navbar-item has-text-weight-semibold" href="/generator" onclick={closeMenu}>
						<span>Generator</span>
					</a>
					<a class="navbar-item has-text-weight-semibold" href="/tally" onclick={closeMenu}>
						<span>Tally</span>
					</a>
				{/if}
			</div>

			{#if user}
				<div class="navbar-end">
					<div class="navbar-item">
						<div class="dropdown is-hoverable is-right">
							<div class="dropdown-trigger">
								<button
									class="button is-dark is-small"
									type="button"
									aria-haspopup="true"
									aria-controls="account-dropdown-menu"
								>
									<span class="icon is-small"><i class="fa fa-user" aria-hidden="true"></i></span>
									<span class="is-hidden-touch">{user.email}</span>
									<span class="is-hidden-desktop">Account</span>
									{#if profile?.role}
										<span class="tag is-primary is-light ml-2">{profile.role.toUpperCase()}</span>
									{/if}
									<span class="icon is-small"><i class="fa fa-chevron-down" aria-hidden="true"></i></span>
								</button>
							</div>
							<div class="dropdown-menu" id="account-dropdown-menu" role="menu">
								<div class="dropdown-content">
									<div class="dropdown-item">
										<form action="/logout" method="POST" class="p-0 m-0">
											<button class="button is-ghost is-fullwidth has-text-danger" type="submit">
												<span class="icon"><i class="fa fa-sign-out" aria-hidden="true"></i></span>
												<span>Logout</span>
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</nav>
