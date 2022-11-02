<script lang="ts">
  import { page } from '$app/stores'
  let route = $page.routeId?.replace('/', '')
</script>

<svelte:body class="{route}" />

<nav>
  <ul class="wrapper">
    <li class={`${route === 'about' ? 'current' : ''}`}><a href="/about">About</a></li>
    <li class={`${route === '' ? 'current' : ''}`}><a href="/">Timer</a></li>
    <li class={`${route === 'privacy' ? 'current' : ''}`}><a href="/privacy">Privacy</a></li>
  </ul>
</nav>

<style>
  nav {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--background_dark);
    font-size: 0.8rem;
    font-weight: 300;
    font-variation-settings: "wght" 300;
    flex-shrink: 0;
  }

  ul {
    display: flex;
    justify-content: space-between;
    list-style: none;
  }

  li a {
    display: block;
    padding: var(--padding_sm) 0;
    text-decoration: none;
    text-align: center;
    color: var(--gray);
  }

  li.current a {
    color: var(--white);
  }
</style>
