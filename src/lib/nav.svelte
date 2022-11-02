<nav>
  <ul class="wrapper">
    <li><a href="/about">About</a></li>
    <li><a href="/">Timer</a></li>
    <li><a href="/privacy">Privacy</a></li>
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
</style>
