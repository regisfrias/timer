<script lang="ts">
  import './global.css'
  import Nav from './lib/nav.svelte'
</script>

<svelte:head>
	<title>Working Hours Timer</title>
</svelte:head>

<main class="wrapper">
  <slot />
</main>

<Nav />
