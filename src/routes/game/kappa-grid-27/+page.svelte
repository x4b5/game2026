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
            origin: "Geboren met de gave om de Maas te beheersen.",
            imgIdle: "/heroes/lord-mosa.png",
            imgAction: "/heroes/lord-mosa.png",
            color: "#3b82f6",
            playerNumber: 1,
        },
        {
            id: "stella",
            name: "Stella",
            power: "🎭 De Mestreechter Geis",
            origin: "Is op mysterieuze wijze gemuteerd tijdens de Vastelaovend.",
            imgIdle: "/heroes/stella.png",
            imgAction: "/heroes/stella.png",
            color: "#ef4444",
            playerNumber: 2,
        },
        {
            id: "the-minck",
            name: "The Minck",
            power: "🔥 De Vlammende Waker",
            origin: "Ontstaan uit de eeuwige vlam van Jan Pieter Minckeleers.",
            imgIdle: "/heroes/the-minck.png",
            imgAction: "/heroes/the-minck.png",
            color: "#06b6d4",
            playerNumber: 3,
        },
    ];

    let selectedHero = $state<string | null>(null);
    let heroName = $state("");
    let playerNumber = $state(1);
    let isStarting = $state(false);
    let mounted = $state(false);

    let briefingText =
        "Systeem geactiveerd... Verbinding maken met satellieten over Maastricht... Aliens hebben strategische punten bezet. Jouw missie: infiltreer hun netwerk, los de raadsels op en verdrijf de indringers uit onze stad!";
    let displayedBriefing = $state("");

    // Multiplayer State
    let takenHeroes = $state<Set<string>>(new Set());
    let deviceId = $state("");

    onMount(() => {
        mounted = true;
        soundManager.init();

        // Typewriter effect
        let i = 0;
        const speed = 40;
        const type = () => {
            if (i < briefingText.length) {
                displayedBriefing += briefingText.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        setTimeout(type, 1000); // Start after 1s delay

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
                playerNumber = hero.playerNumber;
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
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&family=Tektur:wght@400;900&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<div class="welcome-page" class:mounted>
    <!-- Animated Background -->
    <div class="animated-bg"></div>
    <div class="cyber-grid"></div>
    <div class="scanline-overlay"></div>
    <div class="particles">
        {#each Array(30) as _, i}
            <div class="particle" style:--i={i}></div>
        {/each}
    </div>

    <!-- HUD Decorations -->
    <div class="hud-overlay">
        <div class="hud-corner top-left"></div>
        <div class="hud-corner top-right"></div>
        <div class="hud-corner bottom-left"></div>
        <div class="hud-corner bottom-right"></div>
        <div class="data-stream-left">
            <span>SIG: 100%</span>
            <span>LAT: 50.8513</span>
            <span>LON: 5.6910</span>
        </div>
        <div class="data-stream-right">
            <span>AUTH: GRANTED</span>
            <span>VER: 2.0.26</span>
            <span>SEC: ALPHA</span>
        </div>
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
                <div class="title-wrapper">
                    <span class="line1">ALIEN INVASION</span>
                    <span class="line2">Maastricht</span>
                </div>
            </h1>
            <div class="subtitle">
                De stad wordt aangevallen door buitenaardse krachten. Jullie
                zijn lokale superhelden en worden nu als agenten ingezet om
                Maaastricht te bevrijden.
            </div>
        </div>

        <!-- Mission Brief -->
        <div class="mission-brief glass-panel has-corners">
            <div class="corner tl"></div>
            <div class="corner tr"></div>
            <div class="corner bl"></div>
            <div class="corner br"></div>
            <h2>🎯 DE BRIEFING</h2>
            <div class="typewriter-content">
                {displayedBriefing}
                <span class="cursor">_</span>
            </div>
        </div>
    </div>

    <!-- Avatar Selection -->
    <div class="selection-section">
        <h2 class="section-title">KIES JE AGENT</h2>

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
                        <div class="player-id-badge">P{hero.playerNumber}</div>
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
                        <div class="hero-origin">{hero.origin}</div>
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
</div>

<style>
    :global(body) {
        font-family: "Rajdhani", sans-serif;
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
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
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
        left: calc(var(--i) * 3.3%);
        animation: fall linear infinite;
        animation-duration: calc(8s + var(--i) * 0.5s);
        animation-delay: calc(var(--i) * -0.3s);
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    }

    /* Cyber Grid Overlay */
    .cyber-grid {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(
                rgba(59, 130, 246, 0.05) 1px,
                transparent 1px
            ),
            linear-gradient(
                90deg,
                rgba(59, 130, 246, 0.05) 1px,
                transparent 1px
            );
        background-size: 50px 50px;
        perspective: 1000px;
        z-index: -1.5;
        animation: gridFade 4s ease-in-out infinite alternate;
    }

    @keyframes gridFade {
        from {
            opacity: 0.3;
        }
        to {
            opacity: 0.6;
        }
    }

    /* Scanline Effect */
    .scanline-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(59, 130, 246, 0.1) 50%,
            transparent 100%
        );
        background-size: 100% 10px;
        animation: scanlineScroll 10s linear infinite;
        pointer-events: none;
        z-index: 1000;
        opacity: 0.2;
    }

    @keyframes scanlineScroll {
        from {
            transform: translateY(-100%);
        }
        to {
            transform: translateY(100%);
        }
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
        font-size: clamp(15rem, 85vw, 65rem);
        font-weight: 950;
        letter-spacing: -20px;
        filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.4));
        line-height: 1;
        margin-bottom: 2.5rem;
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .title-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        width: 100%;
        max-width: 100%;
        position: relative;
    }

    .line1,
    .line2 {
        display: block;
        width: 100%;
        text-align: center;
        font-weight: 900;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        word-wrap: break-word;
        position: relative;
    }

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
            transparent 0%,
            rgba(255, 255, 255, 0.2) 50%,
            transparent 100%
        );
        background-size: 100% 200%;
        animation: holo-scan 2s linear infinite;
        pointer-events: none;
        mix-blend-mode: overlay;
    }

    .line1 {
        position: relative;
        background: linear-gradient(135deg, #ffffff, #93c5fd, #3b82f6);
        background-size: 200% 200%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation:
            glitch 0.3s infinite,
            signal-flicker 2s infinite;
        text-shadow:
            0 0 20px rgba(255, 255, 255, 0.8),
            -4px 0 rgba(255, 0, 255, 0.7),
            4px 0 rgba(0, 255, 255, 0.7);
        filter: drop-shadow(0 0 25px rgba(255, 255, 255, 0.4));
    }

    @keyframes glitch {
        0% {
            transform: translate(0) skew(0deg);
            clip-path: inset(0% 0 0% 0);
        }
        10% {
            transform: translate(-15px, 5px) skew(-10deg);
            clip-path: inset(10% 0 80% 0);
        }
        20% {
            transform: translate(15px, -5px) skew(10deg);
            clip-path: inset(80% 0 10% 0);
        }
        30% {
            transform: translate(-10px, 0) skew(0deg);
            clip-path: inset(30% 0 30% 0);
        }
        40% {
            transform: translate(10px, 0) skew(0deg);
            clip-path: inset(0% 0 0% 0);
        }
        100% {
            transform: translate(0) skew(0deg);
            clip-path: inset(0% 0 0% 0);
        }
    }

    @keyframes signal-flicker {
        0%,
        19%,
        21%,
        23%,
        25%,
        54%,
        56%,
        100% {
            opacity: 1;
            filter: brightness(1.2) contrast(1.2);
        }
        20%,
        22%,
        24%,
        55% {
            opacity: 0.2;
            filter: brightness(4) contrast(3) grayscale(1);
            transform: scaleY(1.5) skewX(20deg);
        }
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
        background: linear-gradient(135deg, #ffffff, #fca5a5, #ef4444);
        background-size: 200% 200%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation:
            glitch-alt 0.4s infinite reverse,
            signal-flicker 1.5s infinite;
        text-shadow:
            0 0 20px rgba(255, 255, 255, 0.8),
            -4px 0 rgba(0, 255, 255, 0.7),
            4px 0 rgba(255, 0, 255, 0.7);
        filter: drop-shadow(0 0 25px rgba(255, 255, 255, 0.4));
    }

    @keyframes glitch-alt {
        0% {
            transform: translate(0);
            clip-path: inset(0% 0 0% 0);
        }
        15% {
            transform: translate(20px, -10px);
            clip-path: inset(40% 0 40% 0);
        }
        30% {
            transform: translate(-20px, 10px);
            clip-path: inset(10% 0 85% 0);
        }
        45% {
            transform: translate(10px, 10px);
            clip-path: inset(85% 0 5% 0);
        }
        100% {
            transform: translate(0);
        }
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
        padding: 2.5rem;
        margin-top: 2rem;
        backdrop-filter: blur(20px);
        position: relative;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(59, 130, 246, 0.3);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }

    .has-corners .corner {
        position: absolute;
        width: 20px;
        height: 20px;
        border: 2px solid #3b82f6;
        filter: drop-shadow(0 0 5px #3b82f6);
    }

    .corner.tl {
        top: -2px;
        left: -2px;
        border-right: none;
        border-bottom: none;
    }
    .corner.tr {
        top: -2px;
        right: -2px;
        border-left: none;
        border-bottom: none;
    }
    .corner.bl {
        bottom: -2px;
        left: -2px;
        border-right: none;
        border-top: none;
    }
    .corner.br {
        bottom: -2px;
        right: -2px;
        border-left: none;
        border-top: none;
    }

    .typewriter {
        color: var(--text-muted);
        line-height: 1.7;
        font-family: "Courier New", Courier, monospace;
        letter-spacing: 0.5px;
        overflow: hidden;
        border-right: 2px solid #3b82f6;
        white-space: wrap;
        margin: 0 auto;
        animation: blink-caret 0.75s step-end infinite;
    }

    @keyframes blink-caret {
        from,
        to {
            border-color: transparent;
        }
        50% {
            border-color: #3b82f6;
        }
    }

    .typewriter {
        animation:
            typing 3.5s steps(40, end) forwards,
            blink-caret 0.75s step-end infinite;
        max-width: fit-content;
    }

    @keyframes typing {
        from {
            width: 0;
        }
        to {
            width: 100%;
        }
    }

    .mission-brief h2 {
        margin-bottom: 1.5rem;
        color: #3b82f6;
        font-size: 1.5rem;
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        letter-spacing: 3px;
        text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
    }

    /* Selection Section */
    .selection-section {
        margin-bottom: 2.5rem;
    }

    .section-title {
        text-align: center;
        margin-bottom: 2rem;
        font-size: 3rem;
        font-family: "Tektur", sans-serif;
        font-weight: 400;
        letter-spacing: -2px;
        background: linear-gradient(135deg, #a855f7, #ec4899, #f472b6);
        background-size: 200% 200%;
        -webkit-background-clip: text;
        background-clip: text;
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
        padding: 1.25rem;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid transparent;
        position: relative;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.03);
    }

    .hero-card:hover {
        transform: translateY(-12px) scale(1.05);
        box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.6),
            0 0 20px var(--hero-color);
        background: rgba(255, 255, 255, 0.05);
    }

    .hero-card.selected {
        border-color: var(--hero-color);
        box-shadow: 0 0 50px var(--hero-color);
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-5px) scale(1.02);
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
        margin-bottom: 1rem;
        border-radius: 12px;
        overflow: hidden;
        background: radial-gradient(
            circle at center,
            rgba(59, 130, 246, 0.1),
            #050510
        );
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.9);
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

    .player-id-badge {
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 0.2rem 0.6rem;
        border-radius: 4px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 0.7rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
        z-index: 5;
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
        color: var(--hero-color) !important;
        opacity: 0.9;
        margin-top: 0.2rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
    }

    .hero-origin {
        font-family: "Inter", sans-serif !important;
        font-size: 0.7rem !important;
        color: rgba(255, 255, 255, 0.6) !important;
        margin-top: 0.5rem;
        line-height: 1.3;
        font-style: italic;
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
        .welcome-page {
            padding-top: 4rem;
        }

        .title {
            font-size: clamp(1.4rem, 6vw, 2.2rem);
        }

        .line1 {
            font-size: 0.95em;
        }

        .line2 {
            font-size: 0.8em;
        }

        .subtitle {
            font-size: 1rem;
        }

        .mission-brief {
            padding: 1.25rem;
            margin-top: 1.5rem;
        }

        .mission-brief h2 {
            font-size: 1.5rem;
        }

        .section-title {
            font-size: 1.8rem;
        }

        .hero-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
        }

        .start-button {
            padding: 1.5rem;
            font-size: 1.2rem;
        }

        .hero-name {
            font-size: 0.9rem !important;
        }

        .hero-power {
            font-size: 0.7rem !important;
        }
    }

    /* HUD Elements */
    .hud-overlay {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 100;
    }

    .hud-corner {
        position: absolute;
        width: 100px;
        height: 100px;
        border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .hud-corner.top-left {
        top: 20px;
        left: 20px;
        border-right: none;
        border-bottom: none;
    }
    .hud-corner.top-right {
        top: 20px;
        right: 20px;
        border-left: none;
        border-bottom: none;
    }
    .hud-corner.bottom-left {
        bottom: 20px;
        left: 20px;
        border-right: none;
        border-top: none;
    }
    .hud-corner.bottom-right {
        bottom: 20px;
        right: 20px;
        border-left: none;
        border-top: none;
    }

    .data-stream-left,
    .data-stream-right {
        position: absolute;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-family: monospace;
        font-size: 0.7rem;
        color: rgba(59, 130, 246, 0.4);
        letter-spacing: 2px;
    }

    .data-stream-left {
        bottom: 150px;
        left: 40px;
        transform: rotate(-90deg);
        transform-origin: left bottom;
    }
    .data-stream-right {
        bottom: 150px;
        right: 40px;
        transform: rotate(90deg);
        transform-origin: right bottom;
    }

    @media (max-width: 768px) {
        .hud-overlay {
            display: none;
        }
    }
</style>
