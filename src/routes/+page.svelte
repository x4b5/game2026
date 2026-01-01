<script lang="ts">
    import { onMount } from "svelte";

    let mounted = $state(false);

    onMount(() => {
        mounted = true;
    });
</script>

<svelte:head>
    <title>Game 2026 | Start</title>
</svelte:head>

<div class="hero {mounted ? 'animate-fade-in' : ''}">
    <div class="badge">Missie Start</div>
    <h1>ALTIJD <span>KLAAR</span></h1>

    <div class="cta-group">
        <a href="/game/kappa-grid-27" class="btn btn-primary">
            Start ALIEN INVASION Maastricht
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg
            >
        </a>
    </div>
</div>

<style>
    .hero {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        min-height: 80vh;
        padding: 2rem;
        opacity: 0;
        transition: opacity 1s ease-out;
    }

    .hero.animate-fade-in {
        opacity: 1;
    }

    .badge {
        background: rgba(99, 102, 241, 0.15);
        color: var(--primary);
        padding: 0.5rem 1.5rem;
        border-radius: 99px;
        font-size: 1rem;
        font-weight: 700;
        margin-bottom: 2rem;
        border: 1px solid rgba(99, 102, 241, 0.3);
        letter-spacing: 2px;
        text-transform: uppercase;
    }

    h1 {
        font-size: clamp(3rem, 12vw, 6rem);
        line-height: 1;
        margin-bottom: 3rem;
        font-family: "Orbitron", sans-serif;
        font-weight: 950;
    }

    h1 span {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .cta-group {
        display: flex;
        width: 100%;
        max-width: 500px;
    }

    .btn {
        width: 100%;
        padding: 1.5rem 2rem;
        border-radius: 16px;
        font-weight: 800;
        font-size: 1.25rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .btn-primary {
        background: var(--primary);
        color: white;
        box-shadow: 0 10px 30px -5px rgba(99, 102, 241, 0.5);
        border: none;
        cursor: pointer;
        text-decoration: none;
    }

    .btn-primary:hover {
        background: var(--primary-hover);
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.6);
    }

    @media (max-width: 640px) {
        h1 {
            font-size: clamp(2.5rem, 15vw, 4rem);
        }
    }
</style>
