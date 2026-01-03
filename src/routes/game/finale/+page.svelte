<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, scale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { soundManager } from "$lib/utils/SoundManager";

    let visible = $state(false);

    onMount(() => {
        visible = true;
        soundManager.startAmbientMusic(); // Re-use ambient or silence
        setTimeout(() => {
            soundManager.playWin();
        }, 500);
    });
</script>

<div class="finale-page">
    <div class="bg-gradient"></div>
    <div class="particles"></div>

    {#if visible}
        <div class="container">
            <h1
                class="main-title"
                in:fly={{ y: -50, duration: 1000, delay: 200 }}
            >
                MISSIE VOLTOOID
            </h1>

            <div
                class="news-ticker-box"
                in:fly={{ x: -50, duration: 800, delay: 1200 }}
            >
                <div class="badge">BREAKING NEWS</div>
                <div class="ticker-text">
                    ALIENVLOOT VERLAAT DAMPKRING • RUST WEERGEKEERD IN
                    MAASTRICHT • CARNAVAL GAAT DOOR
                </div>
            </div>

            <div class="hero-card" in:fade={{ duration: 1000, delay: 2500 }}>
                <div class="medal">🏅</div>
                <h2>Dank aan onze Helden</h2>
                <div class="story-text">
                    <p>Beste Superhelden,</p>
                    <p>
                        Dankzij jullie snelle handelen is de dreiging afgewend.
                        De kennis is veiliggesteld, de bruggen zijn bewaakt en
                        de aliens zijn verjaagd (of naar de kroeg gestuurd).
                    </p>
                    <p class="highlight">
                        Maastricht is jullie eeuwig dankbaar.
                    </p>
                </div>
            </div>

            <div class="actions" in:scale={{ duration: 500, delay: 5000 }}>
                <button class="primary-btn" onclick={() => goto("/")}>
                    TERUG NAAR BASIS
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    :global(body) {
        margin: 0;
        background: #0f172a;
    }

    .finale-page {
        min-height: 100vh;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
        color: white;
        font-family: "Inter", sans-serif;
    }

    .bg-gradient {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle at center,
            #1e3a8a 0%,
            #0f172a 70%,
            #000000 100%
        );
        z-index: -2;
    }

    /* Simple CSS Particles */
    .particles {
        position: absolute;
        inset: 0;
        background-image: radial-gradient(#ffffff 1px, transparent 1px);
        background-size: 50px 50px;
        opacity: 0.1;
        z-index: -1;
        animation: drift 20s linear infinite;
    }
    @keyframes drift {
        0% {
            background-position: 0 0;
        }
        100% {
            background-position: 50px 50px;
        }
    }

    .container {
        max-width: 800px;
        padding: 2rem;
        text-align: center;
        z-index: 10;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        align-items: center;
    }

    .main-title {
        font-family: "Orbitron", sans-serif;
        font-size: clamp(2.5rem, 8vw, 5rem);
        font-weight: 900;
        letter-spacing: 4px;
        margin: 0;
        background: linear-gradient(to right, #fbbf24, #d97706, #fbbf24);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 30px rgba(251, 191, 36, 0.3);
        animation: shine 3s linear infinite;
    }

    @keyframes shine {
        0% {
            background-position: 0%;
        }
        100% {
            background-position: 200%;
        }
    }

    .news-ticker-box {
        background: rgba(255, 255, 255, 0.1);
        border-left: 4px solid #ef4444;
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 600px;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    .badge {
        background: #ef4444;
        color: white;
        padding: 0.5rem 1rem;
        font-weight: 800;
        font-size: 0.9rem;
        text-transform: uppercase;
        animation: pulse-red 2s infinite;
    }
    @keyframes pulse-red {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0.8;
        }
        100% {
            opacity: 1;
        }
    }

    .ticker-text {
        padding: 0.5rem 1rem;
        white-space: nowrap;
        overflow: hidden;
        font-family: monospace;
        text-transform: uppercase;
        color: #fca5a5;
        font-weight: 600;
        flex: 1;
        text-align: left;
    }

    .hero-card {
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 3rem;
        width: 100%;
        max-width: 600px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    }

    .medal {
        font-size: 4rem;
        margin-bottom: 1rem;
        filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.5));
        animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    h2 {
        font-size: 2rem;
        margin-bottom: 1.5rem;
        color: white;
        font-family: "Orbitron", sans-serif;
    }

    .story-text p {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #cbd5e1;
        margin-bottom: 1rem;
    }

    .story-text .highlight {
        font-size: 1.3rem;
        color: #38bdf8;
        font-weight: 700;
        margin-top: 2rem;
    }

    .primary-btn {
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: white;
        border: none;
        padding: 1rem 3rem;
        border-radius: 99px;
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
        font-family: "Orbitron", sans-serif;
    }

    .primary-btn:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 0 30px rgba(37, 99, 235, 0.6);
        background: linear-gradient(135deg, #3b82f6, #2563eb);
    }
</style>
