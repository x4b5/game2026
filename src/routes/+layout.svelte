<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<div class="app-container">
  <main>
    {@render children()}
  </main>
</div>

<style>
  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent),
                radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.1), transparent);
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
</style>
