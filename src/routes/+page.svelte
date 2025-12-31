<script lang="ts">
    import { onMount } from "svelte";

    let mounted = $state(false);

    onMount(() => {
        mounted = true;
    });
</script>

<svelte:head>
    <title>Game 2026 | Welkom</title>
</svelte:head>

<div class="hero {mounted ? 'animate-fade-in' : ''}">
    <div class="badge">Nieuwe Ervaring</div>
    <h1>Interactieve <span>Game 2026</span></h1>
    <p class="description">
        Scan de QR-code om direct te beginnen met spelen. Geen downloads nodig,
        start direct in je browser voor een meeslepende ervaring.
    </p>

    <div class="cta-group">
        <a href="/game" class="btn btn-primary">
            Start Handmatig
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg
            >
        </a>
        <button class="btn btn-secondary"> Hoe werkt het? </button>
    </div>

    <div class="features-grid">
        <div class="feature-card glass-panel">
            <div class="icon">📱</div>
            <h3>QR Toegang</h3>
            <p>Scan en speel direct vanaf je smartphone.</p>
        </div>
        <div class="feature-card glass-panel">
            <div class="icon">⚡</div>
            <h3>Snel & Licht</h3>
            <p>Geen installatie vereist, draait soepel in elke browser.</p>
        </div>
        <div class="feature-card glass-panel">
            <div class="icon">🎮</div>
            <h3>Interactief</h3>
            <p>Beleef een unieke game-ervaring op locatie.</p>
        </div>
    </div>
</div>

<style>
    .hero {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 4rem 1rem;
        opacity: 0;
    }

    .hero.animate-fade-in {
        opacity: 1;
    }

    .badge {
        background: rgba(99, 102, 241, 0.15);
        color: var(--primary);
        padding: 0.5rem 1rem;
        border-radius: 99px;
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 2rem;
        border: 1px solid rgba(99, 102, 241, 0.3);
    }

    h1 {
        font-size: clamp(2.5rem, 8vw, 4.5rem);
        line-height: 1.1;
        margin-bottom: 1.5rem;
        max-width: 800px;
    }

    h1 span {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .description {
        font-size: 1.25rem;
        color: var(--text-muted);
        max-width: 600px;
        margin-bottom: 3rem;
    }

    .cta-group {
        display: flex;
        gap: 1rem;
        margin-bottom: 5rem;
    }

    .btn {
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .btn-primary {
        background: var(--primary);
        color: white;
        box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
    }

    .btn-primary:hover {
        background: var(--primary-hover);
        transform: translateY(-2px);
        box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.5);
    }

    .btn-secondary {
        background: var(--glass);
        border: 1px solid var(--glass-border);
        color: white;
    }

    .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        width: 100%;
    }

    .feature-card {
        padding: 2rem;
        text-align: left;
        transition: transform 0.3s ease;
    }

    .feature-card:hover {
        transform: translateY(-5px);
    }

    .icon {
        font-size: 2rem;
        margin-bottom: 1.5rem;
    }

    h3 {
        margin-bottom: 0.75rem;
        font-size: 1.25rem;
    }

    p {
        color: var(--text-muted);
    }

    @media (max-width: 640px) {
        .cta-group {
            flex-direction: column;
            width: 100%;
        }
        .btn {
            width: 100%;
            justify-content: center;
        }
    }
</style>
