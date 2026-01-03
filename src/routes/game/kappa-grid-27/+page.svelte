<script lang="ts">
    import { goto } from "$app/navigation";
    import { gameProgress } from "$lib/stores/gameStore";
    import type { PlayerData } from "$lib/stores/gameStore";
    import { onMount } from "svelte";
    import { soundManager } from "$lib/utils/SoundManager";

    // Available superhero avatars
    const heroes = [
        {
            id: "lord-mosa",
            name: "Lord Mosa",
            power: "De Heerser van de Maas",
            origin: "Geboren met de gave om de Maas te beheersen.",
            imgIdle: "/heroes/lord-mosa.png",
            imgAction: "/heroes/lord-mosa-2.png",
            color: "#3b82f6",
            playerNumber: 1,
        },
        {
            id: "stella",
            name: "Stella",
            power: "De belichaming van de Mestreechter Geis",
            origin: "Op mysterieuze wijze betoverd tijdens de Vastelaovend.",
            imgIdle: "/heroes/stella.png",
            imgAction: "/heroes/stella-2.png",
            color: "#ef4444",
            playerNumber: 2,
        },
        {
            id: "the-minck",
            name: "The Minck",
            power: "De Vlammende Waker",
            origin: "Ontstaan uit de eeuwige vlam van Jan Pieter Minckeleers.",
            imgIdle: "/heroes/the-minck.png",
            imgAction: "/heroes/the-minck-2.png",
            color: "#06b6d4",
            playerNumber: 3,
        },
    ];

    // Player name inputs for each hero
    let playerNames: Record<string, string> = $state({
        "lord-mosa": "",
        stella: "",
        "the-minck": "",
    });

    let isStarting = $state(false);
    let mounted = $state(false);
    let addedPlayers = $state<string[]>([]); // Track which heroes have players
    let videoElement: HTMLVideoElement;

    let briefingText =
        'krrzt... #%&... SIGNAL UNSTABLE... /// REROUTING... SYSTEM ONLINE... ENCRYPTED FEED ESTABLISHED. Agent X: "Vijandige entiteiten hebben strategische sectoren in de stad overgenomen. Maastricht heeft in de geschiedenis vele belegeringen doorstaan. JULLIE MISSIE: Verdrijf de aliens en breng rust terug in Maastricht. Stel me niet teleur."';
    let displayedBriefing = $state("");
    let isStabilizing = $state(false); // Start false, trigger on briefing view

    onMount(() => {
        mounted = true;
        // Interference triggered by IntersectionObserver now

        soundManager.init().then(() => {
            soundManager.startAmbientMusic();
        });

        // Show briefing text immediately
        // displayedBriefing handled by typeWriter action now

        // Reset players when this page opens - it's the start of a new game
        gameProgress.reset();
        addedPlayers = [];

        return () => {
            soundManager.stopAmbientMusic();
        };
    });

    function addPlayer(heroId: string) {
        console.log("addPlayer called with heroId:", heroId);
        console.log("playerNames:", playerNames);

        const name = playerNames[heroId]?.trim();
        console.log("name:", name);

        if (!name) {
            soundManager.playError().catch(() => {});
            alert("Voer eerst een naam in!");
            return;
        }

        const hero = heroes.find((h) => h.id === heroId);
        if (!hero) {
            console.error("Hero not found:", heroId);
            return;
        }

        const playerData: PlayerData = {
            name: name,
            avatar: heroId,
            playerNumber: hero.playerNumber,
            joinedAt: Date.now(),
            isAdmin: name.toLowerCase() === "xavier",
        };

        console.log("Adding player:", playerData);
        gameProgress.addPlayer(playerData);
        addedPlayers = [...addedPlayers, heroId];
        console.log("addedPlayers:", addedPlayers);
        soundManager.playClick().catch(() => {});
    }

    function startMission() {
        if (addedPlayers.length === 0) {
            soundManager.playError();
            alert("Voeg minimaal 1 speler toe!");
            return;
        }

        isStarting = true;
        soundManager.playClick();
        soundManager.stopAmbientMusic();

        // Stop the video
        if (videoElement) {
            videoElement.pause();
        }

        // Navigate to next game after short delay
        setTimeout(() => {
            goto("/game/kappa-grid-27/challenge");
        }, 800);
    }

    function typeWriter(
        node: HTMLElement,
        { speed = 30, delay = 0, onStart = () => {} } = {},
    ) {
        const text = node.textContent?.trim() || "";
        node.textContent = "";

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        observer.disconnect();
                        setTimeout(() => {
                            onStart(); // Trigger interference/start callback
                            let i = 0;
                            const timer = setInterval(() => {
                                if (i < text.length) {
                                    node.textContent += text.charAt(i);
                                    i++;
                                } else {
                                    clearInterval(timer);
                                }
                            }, speed);
                        }, delay);
                    }
                });
            },
            { threshold: 0.1 },
        );

        observer.observe(node);

        return {
            destroy() {
                observer.disconnect();
            },
        };
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
        href="https://fonts.googleapis.com/css2?family=Audiowide&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&family=Tektur:wght@400;900&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<div class="welcome-page" class:mounted>
    <!-- Animated Background -->
    <div class="animated-bg"></div>
    <div class="cyber-grid"></div>
    <div class="scanline-overlay"></div>
    <div class="noise-overlay"></div>

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
            <div class="subtitle" use:typeWriter={{ speed: 20, delay: 300 }}>
                De stad wordt aangevallen door buitenaardse krachten. Jullie
                zijn lokale superhelden en worden nu als agenten ingezet om
                Maastricht te bevrijden.
            </div>
        </div>
        <div class="video-surveillance-container">
            <div class="rec-indicator">● REC</div>
            <div class="cam-info">CAM-2B // LIVE FEED</div>
            <video
                bind:this={videoElement}
                src="/alien-attack.mp4"
                class="hero-video-banner surveillance-mode"
                autoplay
                muted
                playsinline
                loop
            ></video>
            <img src="/wat-is-loos.png" alt="Intel" class="pip-overlay" />
            <div class="scanlines-video"></div>
        </div>
    </div>

    <!-- Avatar Selection -->
    <div class="selection-section">
        <h2 class="section-title">ASSEMBLE STRIKE TEAM</h2>
        <p class="section-subtitle">SELECT OPERATIVE // AUTHORIZE IDENTITY</p>

        <div class="hero-grid">
            {#each heroes as hero}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    class="hero-card glass-panel"
                    class:added={addedPlayers.includes(hero.id)}
                    class:ready={addedPlayers.includes(hero.id)}
                    style:--hero-color={hero.color}
                    onmouseenter={() => soundManager.playHover()}
                >
                    <div class="hero-image-container">
                        <img
                            src={addedPlayers.includes(hero.id)
                                ? hero.imgAction
                                : hero.imgIdle}
                            alt={hero.name}
                            class="hero-image"
                        />
                        {#if addedPlayers.includes(hero.id)}
                            <div class="ready-badge">READY</div>
                        {/if}
                    </div>
                    <div class="hero-info">
                        <div class="hero-name">{hero.name}</div>
                        <div class="hero-power">{hero.power}</div>
                        <div class="hero-origin">{hero.origin}</div>
                    </div>

                    {#if !addedPlayers.includes(hero.id)}
                        <div class="player-input">
                            <input
                                type="text"
                                bind:value={playerNames[hero.id]}
                                placeholder="ENTER CODENAME..."
                                maxlength="20"
                                onkeydown={(e) =>
                                    e.key === "Enter" && addPlayer(hero.id)}
                            />
                            <button
                                class="add-player-btn"
                                onclick={() => addPlayer(hero.id)}
                            >
                                CONFIRM DEPLOYMENT
                            </button>
                        </div>
                    {:else}
                        <div class="player-added">
                            <div class="player-label">AGENT:</div>
                            <span class="player-name">
                                {$gameProgress.players.find(
                                    (p) => p.avatar === hero.id,
                                )?.name}
                            </span>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>

    <!-- Mission Brief -->
    <div class="mission-brief glass-panel has-corners">
        <div class="corner tl"></div>
        <div class="corner tr"></div>
        <div class="corner bl"></div>
        <div class="corner br"></div>
        <h2>BRIEFING AGENT X</h2>
        <div class="briefing-content" class:signal-interference={isStabilizing}>
            <div class="agent-portrait">
                <img src="/heroes/agent-x.png" alt="Agent X" />
                <div class="scan-line"></div>
            </div>
            <div class="typewriter-content">
                <span
                    use:typeWriter={{
                        speed: 15,
                        delay: 500,
                        onStart: () => {
                            isStabilizing = true;
                            setTimeout(() => {
                                isStabilizing = false;
                            }, 2500);
                        },
                    }}>{briefingText}</span
                >
                <span class="cursor">_</span>
            </div>
        </div>
    </div>

    <!-- Start Button -->
    <div class="start-section">
        <button
            class="start-button"
            class:active={addedPlayers.length > 0}
            class:loading={isStarting}
            onclick={startMission}
            disabled={addedPlayers.length === 0 || isStarting}
        >
            {#if isStarting}
                🚀 Missie Start...
            {:else}
                START MISSIE ({addedPlayers.length} speler{addedPlayers.length !==
                1
                    ? "s"
                    : ""})
            {/if}
        </button>
    </div>
</div>

<style>
    :global(body) {
        font-family: "Rajdhani", sans-serif;
        font-weight: 600;
        background-color: #0f172a;
    }

    .noise-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 900;
        opacity: 0.05;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    .welcome-page {
        min-height: 100vh;
        padding: 1rem;
        padding-top: 3rem;
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
        background: radial-gradient(circle at center, #1e1b4b 0%, #000000 100%);
        box-shadow: inset 0 0 100px #000;
        z-index: -2;
        animation: bg-alarm-pulse 4s infinite alternate;
    }

    @keyframes bg-alarm-pulse {
        0% {
            box-shadow: inset 0 0 100px #000;
        }
        100% {
            box-shadow: inset 0 0 150px rgba(220, 38, 38, 0.3);
        } /* Red alarm glow */
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
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        top: -10px;
        left: calc(var(--i) * 3.3%);
        animation: fall linear infinite;
        animation-duration: calc(6s + var(--i) * 0.4s);
        animation-delay: calc(var(--i) * -0.3s);
        box-shadow:
            0 0 10px rgba(255, 255, 255, 0.8),
            0 0 20px rgba(59, 130, 246, 0.6),
            0 0 30px rgba(139, 92, 246, 0.4);
    }

    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }

    /* Cyber Grid Overlay */
    .cyber-grid {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(
                rgba(59, 130, 246, 0.08) 2px,
                transparent 2px
            ),
            linear-gradient(
                90deg,
                rgba(59, 130, 246, 0.08) 2px,
                transparent 2px
            );
        background-size: 50px 50px;
        perspective: 1000px;
        z-index: -1.5;
        animation: gridPulse 6s ease-in-out infinite alternate;
    }

    @keyframes gridPulse {
        from {
            opacity: 0.4;
            transform: perspective(1000px) rotateX(60deg) scale(1);
        }
        to {
            opacity: 0.7;
            transform: perspective(1000px) rotateX(60deg) scale(1.1);
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
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0) 50%,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0.2)
        );
        background-size: 100% 4px;
        z-index: 1000;
        pointer-events: none;
        animation: scanlines 0.2s linear infinite;
        opacity: 0.15;
    }

    /* Vignette & CRT Curve */
    .scanline-overlay::before {
        content: " ";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: radial-gradient(
            rgba(18, 16, 16, 0) 50%,
            rgba(0, 0, 0, 0.45) 100%
        );
        background-size: 100% 100%;
        pointer-events: none;
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
        margin-bottom: 12rem;
    }

    .title-container {
        text-align: center;
        margin-bottom: 4rem;
    }

    .title {
        font-family: "Audiowide", cursive;
        font-size: clamp(2rem, 9vw, 5rem);
        font-weight: 950;
        letter-spacing: -1px;
        filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.4));
        line-height: 0.8;
        margin-bottom: 8rem;
        width: 100%;
        display: flex;
        justify-content: center;
        text-transform: uppercase;
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
        font-weight: 950;
        letter-spacing: -0.02em;
        text-transform: uppercase;
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
            transform: translate(0);
            text-shadow:
                -2px 0 #ff00c1,
                2px 0 #01ffff;
        }
        2%,
        64% {
            transform: translate(2px, 0) skew(0deg);
        }
        4%,
        60% {
            transform: translate(-2px, 0) skew(0deg);
        }
        62% {
            transform: translate(0, 0) skew(5deg);
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
            filter: brightness(3) contrast(2) grayscale(1);
            transform: scaleY(1.1) skewX(10deg);
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
        font-size: clamp(0.9rem, 4vw, 1.25rem);
        color: rgba(255, 255, 255, 0.8);
        font-weight: 500;
        max-width: 600px;
        margin: 0 auto 5rem auto;
        line-height: 1.5;
        padding: 0 1rem;
    }

    .hero-image-banner {
        display: block;
        width: 100%;
        max-width: 500px;
        height: auto;
        border-radius: 20px;
        margin: 2rem auto 0 auto;
        border: 3px solid rgba(59, 130, 246, 0.4);
        box-shadow:
            0 0 40px rgba(59, 130, 246, 0.3),
            0 10px 30px rgba(0, 0, 0, 0.5);
        animation: floatImage 4s ease-in-out infinite;
    }

    @keyframes floatImage {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    .video-surveillance-container {
        position: relative;
        max-width: 600px;
        margin: 8rem auto 8rem auto;
        border: 2px solid #334155;
        background: #000;
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
    }

    .hero-video-banner.surveillance-mode {
        display: block;
        width: 100%;
        height: auto;
        opacity: 0.8;
        filter: sepia(0.2) grayscale(0.4) contrast(1.2);
        box-shadow: none;
        border: none;
        margin: 0;
    }

    .rec-indicator {
        position: absolute;
        top: 15px;
        left: 20px;
        color: #ef4444;
        font-family: "Share Tech Mono", monospace;
        font-weight: bold;
        animation: blink 1s steps(1) infinite;
        z-index: 10;
        text-shadow: 0 0 5px #ef4444;
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    }

    .cam-info {
        position: absolute;
        bottom: 15px;
        right: 20px;
        color: rgba(255, 255, 255, 0.7);
        font-family: "Share Tech Mono", monospace;
        font-size: 0.8rem;
        z-index: 10;
    }

    .scanlines-video {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0) 50%,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0.2)
        );
        background-size: 100% 4px;
        pointer-events: none;
        z-index: 5;
    }

    .pip-overlay {
        position: absolute;
        bottom: 10px;
        left: 10px;
        width: 120px;
        height: auto;
        border: 1px solid #ef4444;
        z-index: 20;
        opacity: 0.9;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    }

    .mission-brief {
        padding: 4rem;
        margin-top: 12rem; /* Increased from 5rem */
        backdrop-filter: blur(20px);
        background: linear-gradient(
                180deg,
                rgba(6, 182, 212, 0.05) 0%,
                rgba(6, 182, 212, 0) 100%
            ),
            #0f172a;
        border: 4px solid #3b82f6;
        box-shadow:
            0 0 40px rgba(59, 130, 246, 0.3),
            inset 0 0 100px rgba(0, 0, 0, 0.9);
        border-radius: 4px;
        position: relative;
        overflow: hidden;
        clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 30px),
            calc(100% - 30px) 100%,
            0 100%
        );
    }

    /* Scanning Laser Effect */
    /* Scanning Laser Effect */
    .mission-brief::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            to bottom,
            transparent,
            rgba(59, 130, 246, 0.1) 50%,
            transparent
        );
        background-size: 100% 200%;
        animation: scan-briefing 4s linear infinite;
        pointer-events: none;
        mix-blend-mode: overlay;
    }

    @keyframes scan-briefing {
        0% {
            background-position: 0% 0%;
        }
        100% {
            background-position: 0% 200%;
        }
    }

    .briefing-content {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
        margin-top: 1rem;
        position: relative;
    }

    .signal-interference {
        animation: heavy-glitch 0.2s infinite;
        filter: blur(2px) grayscale(100%) contrast(200%);
        opacity: 0.7;
    }

    @keyframes heavy-glitch {
        0% {
            transform: translate(0, 0);
            clip-path: inset(0 0 0 0);
        }
        20% {
            transform: translate(-5px, 2px);
            clip-path: inset(10% 0 40% 0);
        }
        40% {
            transform: translate(5px, -2px);
            clip-path: inset(40% 0 10% 0);
        }
        60% {
            transform: translate(-2px, 5px);
            clip-path: inset(80% 0 5% 0);
        }
        80% {
            transform: translate(2px, -5px);
            clip-path: inset(5% 0 60% 0);
        }
        100% {
            transform: translate(0, 0);
            clip-path: inset(0 0 0 0);
        }
    }

    .agent-portrait {
        flex-shrink: 0;
        width: 180px;
        height: 180px;
        border: 2px solid #3b82f6;
        border-radius: 4px;
        overflow: hidden;
        position: relative;
        background: rgba(0, 0, 0, 0.5);
    }

    .agent-portrait img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: grayscale(100%) sepia(20%) hue-rotate(180deg) brightness(0.9);
        animation: image-glitch 4s infinite;
    }

    @keyframes image-glitch {
        0% {
            transform: translate(0);
            filter: grayscale(100%) sepia(20%) hue-rotate(180deg)
                brightness(0.9);
        }
        2% {
            transform: translate(-2px, 2px);
            filter: grayscale(100%) sepia(20%) hue-rotate(220deg)
                brightness(1.2);
        }
        4% {
            transform: translate(2px, -2px);
            filter: grayscale(0%) invert(100%);
        }
        5% {
            transform: translate(0);
            filter: grayscale(100%) sepia(20%) hue-rotate(180deg)
                brightness(0.9);
        }
        15% {
            transform: scale(1.02);
            opacity: 0.8;
        }
        16% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            filter: grayscale(100%) sepia(40%) hue-rotate(180deg) blur(2px);
        }
        52% {
            filter: grayscale(100%) sepia(20%) hue-rotate(180deg)
                brightness(0.9);
        }
        80% {
            transform: translate(1px, 0);
        }
        81% {
            transform: translate(-1px, 0);
        }
        82% {
            transform: translate(0);
        }
    }

    .agent-portrait .scan-line {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: rgba(59, 130, 246, 0.8);
        box-shadow: 0 0 10px #3b82f6;
        animation: scan-portrait 2s linear infinite;
    }

    @keyframes scan-portrait {
        0% {
            top: 0;
        }
        100% {
            top: 100%;
        }
    }

    /* Mobile adjustments */
    @media (max-width: 600px) {
        .briefing-content {
            flex-direction: column;
            align-items: center;
        }
    }

    .mission-brief::before {
        content: "TOP SECRET // CLASSIFIED EYES ONLY";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background: #3b82f6;
        color: #000;
        font-family: "Chakra Petch", sans-serif;
        font-weight: 800;
        font-size: 1rem;
        padding: 0.5rem 1rem;
        clip-path: polygon(0 0, 100% 0, 95% 100%, 0 100%);
        box-shadow: 0 5px 15px rgba(59, 130, 246, 0.5);
        z-index: 10;
        letter-spacing: 2px;
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

    @keyframes blink-caret {
        from,
        to {
            border-color: transparent;
        }
        50% {
            border-color: #3b82f6;
        }
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
        margin-top: 2rem;
        margin-bottom: 2rem;
        color: #fff;
        font-size: 2.5rem;
        font-family: "Audiowide", cursive;
        font-weight: 900;
        letter-spacing: 2px;
        text-transform: uppercase;
        border-bottom: 2px solid #3b82f6;
        display: inline-block;
        padding-bottom: 0.5rem;
        text-shadow: 0 0 10px #3b82f6;
    }

    @keyframes briefing-glitch {
        0% {
            transform: translate(0) skew(0deg);
            text-shadow: none;
            opacity: 1;
        }
        2% {
            transform: translate(-5px, 2px) skew(10deg);
            text-shadow:
                3px 0 #ff00c1,
                -3px 0 #01ffff;
            opacity: 0.8;
        }
        4% {
            transform: translate(5px, -2px) skew(-10deg);
            text-shadow:
                -3px 0 #ff00c1,
                3px 0 #01ffff;
            opacity: 0.8;
        }
        5% {
            opacity: 0;
        }
        6% {
            transform: translate(0) skew(0deg);
            text-shadow: none;
            opacity: 1;
        }
        10% {
            transform: translate(-2px, 0);
            opacity: 0.5;
        }
        11% {
            transform: translate(2px, 0);
            opacity: 1;
        }
        15% {
            transform: scale(1.1) skew(20deg);
            text-shadow:
                4px 0 #ff00c1,
                -4px 0 #01ffff;
            opacity: 0.6;
        }
        16% {
            transform: scale(1) skew(0deg);
            text-shadow: none;
            opacity: 1;
        }
        40% {
            opacity: 1;
        }
        41% {
            transform: translate(-10px, 0) skew(-20deg);
            opacity: 0;
        }
        42% {
            transform: translate(10px, 0) skew(20deg);
            opacity: 1;
        }
        43% {
            transform: translate(0) skew(0deg);
            opacity: 1;
        }
        50% {
            text-shadow:
                2px 2px #ff00c1,
                -2px -2px #01ffff;
        }
        52% {
            text-shadow: none;
        }
        65% {
            transform: translate(0);
            opacity: 1;
        }
        66% {
            transform: translate(5px, 5px) skew(30deg);
            opacity: 0.4;
        }
        67% {
            transform: translate(-5px, -5px) skew(-30deg);
            opacity: 1;
        }
        68% {
            transform: translate(0);
            opacity: 1;
        }
        80% {
            opacity: 0;
        }
        82% {
            opacity: 1;
        }
        95% {
            transform: skew(5deg);
        }
        96% {
            transform: skew(-5deg);
        }
        97% {
            transform: skew(0);
        }
        100% {
            transform: translate(0);
            text-shadow: none;
            opacity: 1;
        }
    }

    .typewriter-content {
        font-family: "Share Tech Mono", monospace;
        font-size: 1.25rem;
        line-height: 1.6;
        color: #22c55e;
        text-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
        min-height: 3rem;
        text-align: left;
        animation: briefing-glitch 5s infinite;
        position: relative;
        background: rgba(0, 0, 0, 0.3);
        padding: 1.5rem;
        border: 1px solid #22c55e;
        border-left: 4px solid #22c55e;
    }

    .cursor {
        display: inline-block;
        width: 8px;
        height: 1.2em;
        background: #33ff00;
        box-shadow: 0 0 5px #33ff00;
        margin-left: 2px;
        vertical-align: text-bottom;
        animation: blink-caret 1s step-end infinite;
    }

    @keyframes blink-cursor {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    }

    /* Selection Section */
    .selection-section {
        margin-bottom: 12rem; /* Increased from 5rem */
    }

    .section-title {
        text-align: center;
        margin-bottom: 5rem;
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
        gap: 3rem;
        margin-bottom: 5rem;
    }

    .hero-card {
        padding: 0;
        background: rgba(30, 41, 59, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        position: relative;
        transition: all 0.3s ease;
    }

    .hero-card::before {
        /* Tech corner accent top-right */
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 20px;
        border-top: 2px solid var(--hero-color);
        border-right: 2px solid var(--hero-color);
        z-index: 2;
    }

    .hero-card:hover {
        transform: translateY(-5px);
        border-color: var(--hero-color);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .hero-image-container {
        margin: 0;
        border-radius: 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.2),
            rgba(0, 0, 0, 0.8)
        );
    }

    .hero-info {
        padding: 1.5rem;
        background: rgba(15, 23, 42, 0.4);
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
        font-family: "Audiowide", cursive !important;
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
        margin-top: 10rem; /* Added space */
        margin-bottom: 6rem;
    }

    .start-button {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        display: block;
        padding: 1.5rem;
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(59, 130, 246, 0.5);
        color: #fff;
        font-size: 1.5rem;
        letter-spacing: 2px;
        text-transform: uppercase;
        font-family: "Audiowide", cursive;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
        opacity: 0.5;
        position: relative;
        overflow: hidden;
        clip-path: polygon(
            10% 0,
            100% 0,
            100% 70%,
            90% 100%,
            0 100%,
            0 30%
        ); /* Sci-fi shape */
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
        background: #2563eb;
        border-color: #60a5fa;
        box-shadow: 0 0 30px rgba(37, 99, 235, 0.5);
        opacity: 1;
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
        font-family: "Share Tech Mono", monospace;
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
    .name-input-container {
        margin-bottom: 2rem;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
        border-left: 4px solid #3b82f6;
    }

    .name-input-container label {
        font-family: "Orbitron", sans-serif;
        font-size: 0.8rem;
        color: #60a5fa;
        letter-spacing: 1px;
    }

    .name-input-container input {
        width: 100%;
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 1rem;
        border-radius: 8px;
        color: white;
        font-family: "Orbitron", sans-serif;
        font-size: 1.2rem;
        outline: none;
        transition: all 0.3s;
    }

    .name-input-container input:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
    }

    /* New Player Input Styling */
    .section-subtitle {
        font-family: "Inter", sans-serif;
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.6);
        margin-top: -1rem;
        margin-bottom: 2rem;
        text-align: center;
    }

    .hero-card.added {
        border-color: #22c55e;
        box-shadow:
            0 0 30px rgba(34, 197, 94, 0.6),
            0 0 60px rgba(34, 197, 94, 0.4),
            inset 0 0 30px rgba(34, 197, 94, 0.2);
        background: rgba(34, 197, 94, 0.1);
        animation: hero-activation 1s ease-out;
        position: relative;
        overflow: hidden;
    }

    .hero-card.added::before {
        content: "";
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
            45deg,
            transparent,
            rgba(34, 197, 94, 0.3),
            transparent
        );
        animation: sweep 1.5s ease-out;
    }

    .hero-card.added .hero-image {
        animation: power-up 0.8s ease-out;
        filter: brightness(1.3) drop-shadow(0 0 20px rgba(34, 197, 94, 0.8));
    }

    @keyframes hero-activation {
        0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 rgba(34, 197, 94, 0);
        }
        50% {
            transform: scale(1.05);
            box-shadow:
                0 0 50px rgba(34, 197, 94, 0.8),
                0 0 100px rgba(34, 197, 94, 0.6);
        }
        100% {
            transform: scale(1);
            box-shadow:
                0 0 30px rgba(34, 197, 94, 0.6),
                0 0 60px rgba(34, 197, 94, 0.4);
        }
    }

    @keyframes sweep {
        0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
        }
        100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
        }
    }

    @keyframes power-up {
        0% {
            transform: scale(0.9);
            filter: brightness(0.5) drop-shadow(0 0 0 rgba(34, 197, 94, 0));
        }
        50% {
            transform: scale(1.1);
            filter: brightness(1.5) drop-shadow(0 0 30px rgba(34, 197, 94, 1));
        }
        100% {
            transform: scale(1);
            filter: brightness(1.3) drop-shadow(0 0 20px rgba(34, 197, 94, 0.8));
        }
    }

    .added-badge {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: #22c55e;
        color: white;
        padding: 0.4rem 0.8rem;
        border-radius: 20px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 0.75rem;
        animation: scale-in 0.3s ease;
        z-index: 5;
        box-shadow: 0 0 15px rgba(34, 197, 94, 0.6);
    }

    .player-input {
        margin-top: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        width: 100%;
    }

    .player-input input {
        width: 100%;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(255, 255, 255, 0.2);
        padding: 1.2rem;
        border-radius: 12px;
        color: white;
        font-family: "Orbitron", sans-serif;
        font-size: 1.1rem;
        text-align: center;
        outline: none;
        transition: all 0.3s;
    }

    .player-input input:focus {
        border-color: var(--hero-color);
        box-shadow: 0 0 20px var(--hero-color);
        background: rgba(0, 0, 0, 0.7);
        transform: scale(1.02);
    }

    .player-input input::placeholder {
        color: rgba(255, 255, 255, 0.4);
        font-size: 0.95rem;
    }

    .add-player-btn {
        width: 100%;
        background: linear-gradient(
            135deg,
            var(--hero-color),
            var(--hero-color)
        );
        border: none;
        padding: 1rem;
        border-radius: 12px;
        color: white;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    .add-player-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 25px var(--hero-color);
        filter: brightness(1.2);
    }

    .add-player-btn:active {
        transform: translateY(0);
    }

    .player-added {
        margin-top: 1.5rem;
        padding: 1.2rem;
        background: rgba(34, 197, 94, 0.15);
        border: 2px solid #22c55e;
        border-radius: 12px;
        text-align: center;
        animation: pulse-success 0.6s ease-out;
    }

    @keyframes pulse-success {
        0% {
            transform: scale(0.95);
            opacity: 0;
        }
        50% {
            transform: scale(1.05);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    .ready-badge {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: #22c55e; /* Neon Green */
        color: #000;
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        font-size: 0.8rem;
        padding: 0.3rem 0.8rem;
        border-radius: 4px;
        box-shadow: 0 0 15px #22c55e;
        transform: rotate(-5deg);
        animation: badge-pulse 1s infinite alternate;
        z-index: 20;
    }

    @keyframes badge-pulse {
        from {
            transform: rotate(-5deg) scale(1);
            box-shadow: 0 0 10px #22c55e;
        }
        to {
            transform: rotate(-5deg) scale(1.1);
            box-shadow: 0 0 25px #22c55e;
        }
    }

    .player-label {
        font-family: "Rajdhani", sans-serif;
        font-size: 0.8rem;
        color: #86efac;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 0.2rem;
    }

    .player-name {
        font-family: "Orbitron", sans-serif;
        font-size: 1.4rem;
        font-weight: 700;
        color: #fff;
        text-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
        display: block;
        animation: glow-text 2s ease-in-out infinite;
    }

    @keyframes glow-text {
        0%,
        100% {
            text-shadow: 0 0 15px rgba(34, 197, 94, 0.6);
        }
        50% {
            text-shadow: 0 0 25px rgba(34, 197, 94, 0.9);
        }
    }
</style>
