<script lang="ts">
    import { goto } from "$app/navigation";
    import { gameProgress } from "$lib/stores/gameStore";
    import type { PlayerData } from "$lib/stores/gameStore";
    import { onMount } from "svelte";
    import { soundManager } from "$lib/utils/SoundManager";

    // Available superhero avatars with idle and action poses (limited to 3)
    const heroes = [
        {
            id: "lord-mosa",
            name: "Lord Mosa",
            power: "🌊 De Heerser van de Maas",
            imgIdle: "/heroes/lord-mosa.png",
            imgAction: "/heroes/lord-mosa.png",
            color: "#3b82f6",
        },
        {
            id: "stella",
            name: "Stella",
            power: "🎭 De belichaming van de Mestreechter Geis",
            imgIdle: "/heroes/stella.png",
            imgAction: "/heroes/stella.png",
            color: "#ef4444",
        },
        {
            id: "the-minck",
            name: "The Minck",
            power: "🔥 De vlammende waker van Maastricht",
            imgIdle: "/heroes/the-minck.png",
            imgAction: "/heroes/the-minck.png",
            color: "#06b6d4",
        },
    ];

    let selectedHero = $state<string | null>(null);
    let heroName = $state("");
    let playerNumber = $state(1);
    let isStarting = $state(false);
    let mounted = $state(false);

    // Multiplayer State
    let takenHeroes = $state<Set<string>>(new Set());
    let deviceId = $state("");

    onMount(() => {
        mounted = true;
        soundManager.init();

        // 1. Get or Create Device ID
        let storedId = localStorage.getItem("game2026_deviceId");
        if (!storedId) {
            storedId = crypto.randomUUID();
            localStorage.setItem("game2026_deviceId", storedId);
        }
        deviceId = storedId;

        // 2. Poll for hero status every 2 seconds
        const pollInterval = setInterval(fetchHeroStatus, 2000);
        fetchHeroStatus(); // Initial fetch

        // Determine player number based on existing local data
        const stored = localStorage.getItem("game2026_progress");
        if (stored) {
            const data = JSON.parse(stored);
            if (data.player) {
                // If we already have a hero, try to reclaim it (to sync server state)
                if (data.player.avatar) {
                    claimHero(data.player.avatar);
                }

                selectedHero = data.player.avatar;
                heroName = data.player.name;
                playerNumber = data.player.playerNumber;
            }
        }

        return () => clearInterval(pollInterval);
    });

    async function fetchHeroStatus() {
        try {
            const res = await fetch("/api/heroes");
            if (res.ok) {
                const data = await res.json();
                // takenHeroes contains all claimed IDs
                // We typically want to show them as taken unless *we* took them
                // But the UI logic is simpler if we just know what's taken globally.
                // We'll trust our local 'selectedHero' state to know if we have one.
                takenHeroes = new Set(data.taken);
            }
        } catch (e) {
            console.error("Polling error:", e);
        }
    }

    async function claimHero(heroId: string) {
        if (!deviceId) return false;

        try {
            const res = await fetch("/api/heroes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ heroId, deviceId }),
            });

            if (res.ok) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.error("Claim error:", e);
            return false;
        }
    }

    async function selectHero(heroId: string) {
        // Prevent selecting if already taken by someone else (and not by us)
        // Note: The UI should disable this, but safety check here
        if (takenHeroes.has(heroId) && selectedHero !== heroId) {
            soundManager.playError();
            alert("Deze held is al gekozen door iemand anders!");
            return;
        }

        // Attempt to claim
        const success = await claimHero(heroId);

        if (success) {
            selectedHero = heroId;
            soundManager.playClick();
            // Auto-set the hero name from the selected hero
            const hero = heroes.find((h) => h.id === heroId);
            if (hero) {
                heroName = hero.name;
            }
            // Refresh status immediately
            fetchHeroStatus();
        } else {
            soundManager.playError();
            alert("Helaas! Iemand anders was je net voor.");
            // Refresh logic to show lock
            fetchHeroStatus();
        }
    }

    function startMission() {
        if (!selectedHero) {
            soundManager.playError();
            return;
        }

        isStarting = true;
        soundManager.playClick();

        const playerData: PlayerData = {
            name: heroName.trim(),
            avatar: selectedHero,
            playerNumber: playerNumber,
            joinedAt: Date.now(),
        };

        gameProgress.setPlayer(playerData);

        // Navigate to next game after short delay
        setTimeout(() => {
            goto("/game/kappa-grid-27/challenge");
        }, 800);
    }
</script>

<svelte:head>
    <title>Maastricht Under Siege | Superhero Mission</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin="anonymous"
    />
    <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@400;600;700&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<div class="welcome-page" class:mounted>
    <!-- Animated Background -->
    <div class="animated-bg"></div>
    <div class="particles">
        {#each Array(20) as _, i}
            <div class="particle" style:--i={i}></div>
        {/each}
    </div>

    <!-- Alert Banner -->
    <div class="alert-banner">
        <div class="alert-content">
            🚨 <strong>URGENT:</strong> Maastricht is onder alien-beleg!
        </div>
    </div>

    <!-- Hero Section -->
    <div class="hero-section">
        <div class="title-container">
            <h1 class="title">
                <span class="line1">ALIEN INVANSION</span>
                <span class="line2">Maastricht</span>
            </h1>
            <div class="subtitle">
                De stad wordt aangevallen door buitenaardse krachten. Jij bent
                een superheld en Maastricht's enige hoop!
            </div>
        </div>

        <!-- Mission Brief -->
        <div class="mission-brief glass-panel">
            <h2>🎯 Jouw Missie</h2>
            <p>
                Scan QR-codes verspreid door het huis om aanwijzingen te
                verzamelen, puzzels op te lossen en de zwakke plekken van de
                aliens te ontdekken. Elke code brengt je dichter bij de
                bevrijding van Maastricht!
            </p>
        </div>
    </div>

    <!-- Avatar Selection -->
    <div class="selection-section">
        <h2 class="section-title">Kies Je Superheld</h2>

        <div class="hero-grid">
            {#each heroes as hero}
                <button
                    class="hero-card glass-panel"
                    class:selected={selectedHero === hero.id}
                    class:locked={takenHeroes.has(hero.id) &&
                        selectedHero !== hero.id}
                    style:--hero-color={hero.color}
                    onclick={() => selectHero(hero.id)}
                    disabled={takenHeroes.has(hero.id) &&
                        selectedHero !== hero.id}
                >
                    <div class="hero-image-container">
                        <img
                            src={selectedHero === hero.id
                                ? hero.imgAction
                                : hero.imgIdle}
                            alt={hero.name}
                            class="hero-image"
                            class:action-pose={selectedHero === hero.id}
                        />
                        {#if selectedHero === hero.id}
                            <div class="selected-badge">✓</div>
                        {/if}
                        {#if takenHeroes.has(hero.id) && selectedHero !== hero.id}
                            <div class="locked-overlay">
                                <span class="lock-icon">🔒</span>
                                <span class="lock-text">BEZET</span>
                            </div>
                        {/if}
                    </div>
                    <div class="hero-info">
                        <div class="hero-name">{hero.name}</div>
                        <div class="hero-power">{hero.power}</div>
                    </div>
                </button>
            {/each}
        </div>
    </div>

    <!-- Start Button -->
    <div class="start-section">
        <button
            class="start-button"
            class:active={selectedHero !== null}
            class:loading={isStarting}
            onclick={startMission}
            disabled={!selectedHero || isStarting}
        >
            {#if isStarting}
                🚀 Missie Start...
            {:else}
                START MISSIE
            {/if}
        </button>
    </div>

    <!-- Footer Info -->
    <div class="footer-info">
        <p>💡 Scan QR-codes om door het spel te navigeren</p>
        <p>👥 Tot 6 spelers kunnen samen spelen op hun eigen telefoon</p>
    </div>
</div>

<style>
    :global(body) {
        font-family: "Inter", sans-serif;
    }

    .welcome-page {
        min-height: 100vh;
        padding: 1rem;
        padding-top: 5rem;
        max-width: 900px;
        margin: 0 auto;
        opacity: 0;
        animation: fadeIn 0.8s ease forwards;
        position: relative;
        z-index: 1;
    }

    .welcome-page.mounted {
        opacity: 1;
    }

    /* Animated Background */
    .animated-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(-45deg, #0f172a, #1e1b4b, #312e81, #1e293b);
        background-size: 400% 400%;
        animation: gradientShift 15s ease infinite;
        z-index: -2;
    }

    @keyframes gradientShift {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    /* Floating Particles */
    .particles {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: -1;
        pointer-events: none;
    }

    .particle {
        position: absolute;
        width: 3px;
        height: 3px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        top: -10px;
        left: calc(var(--i) * 5%);
        animation: fall linear infinite;
        animation-duration: calc(10s + var(--i) * 1s);
        animation-delay: calc(var(--i) * -0.5s);
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    }

    @keyframes fall {
        to {
            top: 110vh;
            transform: translateX(calc(var(--i) * 10px));
        }
    }

    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }

    /* Alert Banner */
    .alert-banner {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #dc2626, #991b1b);
        padding: 1rem;
        text-align: center;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(220, 38, 38, 0.4);
        animation: pulse-banner 2s infinite;
    }

    @keyframes pulse-banner {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.85;
        }
    }

    .alert-content {
        color: white;
        font-size: 0.95rem;
        font-weight: 600;
        letter-spacing: 0.5px;
    }

    /* Hero Section */
    .hero-section {
        margin-bottom: 3rem;
    }

    .title-container {
        text-align: center;
        margin-bottom: 2rem;
    }

    .title {
        font-family: "Orbitron", sans-serif;
        font-size: clamp(3.5rem, 12vw, 6rem);
        line-height: 0.9;
        margin-bottom: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-weight: 900;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }

    .line1 {
        position: relative;
        background: linear-gradient(135deg, #60a5fa, #a78bfa, #3b82f6);
        background-size: 200% 200%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation:
            glow-blue 3s infinite,
            gradientMove 4s ease infinite;
        filter: drop-shadow(0 0 20px rgba(96, 165, 250, 0.7));
    }

    /* Green Alien Scanline Effect */
    .line1::after,
    .line2::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            to bottom,
            transparent 30%,
            rgba(0, 255, 0, 0.8) 50%,
            transparent 70%
        );
        background-size: 100% 200%;
        animation: alienScan 3s ease-in-out infinite;
        pointer-events: none;
        mix-blend-mode: color-dodge;
        opacity: 0.6;
    }

    /* Alien Slime Dripping Effect */
    .line1::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: radial-gradient(
                circle at 10% 0%,
                #4ade80 4px,
                transparent 5px
            ),
            radial-gradient(circle at 35% 0%, #22c55e 3px, transparent 4px),
            radial-gradient(circle at 60% 0%, #4ade80 5px, transparent 6px),
            radial-gradient(circle at 85% 0%, #22c55e 3px, transparent 4px);
        background-repeat: repeat-x;
        background-size: 100% 100%;
        filter: drop-shadow(0 2px 2px rgba(0, 255, 0, 0.4));
        animation: slimeDrip 4s ease-in infinite;
        pointer-events: none;
        opacity: 0.8;
        z-index: 10;
        mix-blend-mode: normal;
    }

    @keyframes slimeDrip {
        0% {
            transform: translateY(-5px);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        80% {
            opacity: 1;
        }
        100% {
            transform: translateY(120%);
            opacity: 0;
        }
    }

    .line2 {
        position: relative;
        background: linear-gradient(135deg, #f87171, #fbbf24, #ef4444);
        background-size: 200% 200%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation:
            glow-red 3s infinite,
            gradientMove 4s ease infinite reverse;
        filter: drop-shadow(0 0 20px rgba(248, 113, 113, 0.7));
    }

    @keyframes alienScan {
        0% {
            background-position: 0% 200%;
        }
        100% {
            background-position: 0% -100%;
        }
    }

    @keyframes gradientMove {
        0%,
        100% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
    }

    @keyframes glow-blue {
        0%,
        100% {
            filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
        }
        50% {
            filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.8));
        }
    }

    @keyframes glow-red {
        0%,
        100% {
            filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.5));
        }
        50% {
            filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.8));
        }
    }

    .subtitle {
        font-size: 1.25rem;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
        max-width: 600px;
        margin: 0 auto;
        line-height: 1.6;
    }

    .mission-brief {
        padding: 2rem;
        margin-top: 2rem;
        backdrop-filter: blur(20px);
        animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    .mission-brief h2 {
        margin-bottom: 1rem;
        color: #fbbf24;
        font-size: 1.75rem;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
    }

    .mission-brief p {
        color: var(--text-muted);
        line-height: 1.7;
    }

    /* Selection Section */
    .selection-section {
        margin-bottom: 2.5rem;
    }

    .section-title {
        text-align: center;
        margin-bottom: 2rem;
        font-size: 2.5rem;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        background: linear-gradient(135deg, #a855f7, #ec4899, #f472b6);
        background-size: 200% 200%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: gradientMove 4s ease infinite;
        text-shadow: 0 0 30px rgba(168, 85, 247, 0.5);
    }

    .hero-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .hero-card {
        padding: 1rem;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid transparent;
        position: relative;
        overflow: hidden;
    }

    .hero-card:hover {
        transform: translateY(-8px) scale(1.08) rotate(2deg);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
    }

    .hero-card.selected {
        border-color: var(--hero-color);
        box-shadow: 0 0 40px var(--hero-color);
        animation:
            pulse-selected 1.5s infinite,
            float 3s ease-in-out infinite;
        transform: translateY(-5px);
    }

    @keyframes pulse-selected {
        0%,
        100% {
            box-shadow: 0 0 20px var(--hero-color);
        }
        50% {
            box-shadow: 0 0 40px var(--hero-color);
        }
    }

    .hero-image-container {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        margin-bottom: 0.75rem;
        border-radius: 12px;
        overflow: hidden;
        background: #050510;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid rgba(255, 255, 255, 0.05);
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
    }

    .hero-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        filter: brightness(1.1) contrast(1.1)
            drop-shadow(0 0 10px rgba(255, 255, 255, 0.1));
    }

    .hero-image.action-pose {
        animation:
            actionPose 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
            scanline 0.2s linear 2;
        filter: brightness(1.3) contrast(1.2)
            drop-shadow(0 0 15px var(--hero-color));
    }

    @keyframes scanline {
        0% {
            filter: brightness(3) contrast(1.5) hue-rotate(90deg);
            opacity: 0.8;
        }
        100% {
            filter: brightness(1.1) contrast(1.1);
            opacity: 1;
        }
    }

    .hero-image.action-pose {
        animation: actionPose 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes actionPose {
        0% {
            transform: scale(0.8) rotate(-10deg);
            opacity: 0.5;
        }
        50% {
            transform: scale(1.15) rotate(5deg);
        }
        100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
        }
    }

    .hero-card:hover .hero-image {
        transform: scale(1.1);
    }

    .selected-badge {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: var(--hero-color);
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        font-weight: bold;
        animation: scale-in 0.3s ease;
    }

    @keyframes scale-in {
        from {
            transform: scale(0);
        }
        to {
            transform: scale(1);
        }
    }

    .hero-info {
        text-align: center;
    }

    .hero-name {
        font-family: "Orbitron", sans-serif !important;
        font-weight: 700 !important;
        font-size: 1.1rem !important;
        margin-top: 0.5rem;
        margin-bottom: 0.25rem;
        color: var(--hero-color) !important;
        text-transform: uppercase;
        letter-spacing: 1px;
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }

    .hero-power {
        font-family: "Orbitron", sans-serif !important;
        font-size: 0.8rem !important;
        color: rgba(255, 255, 255, 0.7) !important;
        margin-top: 0.2rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .hero-card:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        filter: grayscale(0.8);
    }

    .locked-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
        backdrop-filter: blur(2px);
    }

    .lock-icon {
        font-size: 2rem;
        margin-bottom: 0.2rem;
    }

    .lock-text {
        font-family: "Orbitron", sans-serif;
        color: #ef4444;
        font-weight: 700;
        letter-spacing: 2px;
    }

    .selected .hero-name {
        color: #fff;
        text-shadow: 0 0 10px var(--hero-color);
    }

    /* Start Button */
    .start-section {
        margin-bottom: 2rem;
    }

    .start-button {
        width: 100%;
        padding: 1.75rem 2.5rem;
        background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7);
        background-size: 200% 200%;
        border: none;
        border-radius: 20px;
        color: white;
        font-size: 1.5rem;
        font-weight: 700;
        font-family: "Orbitron", sans-serif;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
        opacity: 0.5;
        position: relative;
        overflow: hidden;
    }

    .start-button::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
        );
        transition: left 0.5s;
    }

    .start-button.active:hover::before {
        left: 100%;
    }

    .start-button.active {
        opacity: 1;
        box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
        animation: pulse-glow 2s infinite ease-in-out;
    }

    .start-button.active:hover:not(:disabled) {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 20px 50px rgba(99, 102, 241, 0.8);
        animation: pulse-glow 1s infinite ease-in-out; /* Faster pulse on hover */
    }

    @keyframes pulse-glow {
        0% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
            transform: scale(1);
        }
        50% {
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.9);
            transform: scale(1.02);
        }
        100% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
            transform: scale(1);
        }
    }

    .start-button.loading {
        animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }

    .start-button:disabled {
        cursor: not-allowed;
    }

    /* Footer */
    .footer-info {
        text-align: center;
        color: var(--text-muted);
        font-size: 0.875rem;
        line-height: 1.8;
    }

    /* Responsive */
    @media (max-width: 640px) {
        .hero-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .player-section {
            flex-direction: column;
        }

        .player-number {
            min-width: auto;
        }
    }
</style>
