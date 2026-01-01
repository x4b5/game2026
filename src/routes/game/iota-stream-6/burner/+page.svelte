<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, scale } from "svelte/transition";
    import { gameProgress } from "$lib/stores/gameStore";
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { soundManager } from "$lib/utils/SoundManager";

    let gameContainer: any;
    let weapons = $state<
        { id: number; x: number; y: number; type: string; hp: number }[]
    >([]);
    let explosions = $state<{ id: number; x: number; y: number }[]>([]);
    let weaponsDestroyed = $state(0);
    let isShaking = $state(false);
    let gameActive = $state(false);
    let currentId = 0;
    let explosionId = 0;
    let accessDenied = $state(false);

    const TARGET_WEAPONS = 15;
    let spawnTimer: any;
    let updateTimer: any;

    onMount(() => {
        // Hero check
        if ($gameProgress.player?.avatar !== "the-minck") {
            accessDenied = true;
            return;
        }

        gameActive = true;
        startGame();

        return () => {
            clearInterval(spawnTimer);
            clearInterval(updateTimer);
        };
    });

    function startGame() {
        spawnTimer = setInterval(spawnWeapon, 1200);
        updateTimer = setInterval(updateWeapons, 50);
    }

    function spawnWeapon() {
        if (!gameActive) return;

        const weapon = {
            id: currentId++,
            x: 10 + Math.random() * 80,
            y: -10,
            type: Math.random() > 0.5 ? "cannon" : "blaster",
            hp: 1,
        };
        weapons = [...weapons, weapon];
    }

    function updateWeapons() {
        if (!gameActive) return;

        weapons = weapons
            .map((w) => ({
                ...w,
                y: w.y + 1.5,
            }))
            .filter((w) => {
                if (w.y > 100) {
                    // Weapon reached Maastricht! (Lose condition maybe? For now just filter)
                    return false;
                }
                return true;
            });
    }

    function destroyWeapon(id: number, x: number, y: number) {
        if (!gameActive) return;

        // Add explosion
        const newExplosion = { id: explosionId++, x, y };
        explosions = [...explosions, newExplosion];

        // Screen shake
        isShaking = true;
        setTimeout(() => (isShaking = false), 200);

        // Remove explosion after animation
        setTimeout(() => {
            explosions = explosions.filter((e) => e.id !== newExplosion.id);
        }, 600);

        weapons = weapons.filter((w) => {
            if (w.id === id) {
                weaponsDestroyed++;
                soundManager.playSuccess();

                if (weaponsDestroyed >= TARGET_WEAPONS) {
                    gameActive = false;
                    clearInterval(spawnTimer);
                    clearInterval(updateTimer);
                    gameContainer?.win(weaponsDestroyed * 200);
                }
                return false;
            }
            return true;
        });
    }
</script>

<div class="burner-page">
    {#if accessDenied}
        <div class="denied-overlay" in:fade>
            <div class="denied-card glass-panel">
                <div class="warning-icon">🚫</div>
                <h1>TOEGANG GEWEIGERD</h1>
                <p>
                    Deze missie vereist pyrokinetische vermogens. Alleen <strong
                        >The Minck</strong
                    > kan dit alien-arsenaal vernietigen.
                </p>
                <button class="back-btn" onclick={() => history.back()}>
                    TERUG
                </button>
            </div>
        </div>
    {:else}
        <GameContainer
            bind:this={gameContainer}
            gameId="iota-burner"
            title="🔥 The Minck: Weapon Burner"
        >
            <div class="burner-game">
                <div class="objective-header">
                    <div class="stat">
                        <span class="label">WAPENS VERNIETIGD</span>
                        <span class="value"
                            >{weaponsDestroyed}/{TARGET_WEAPONS}</span
                        >
                    </div>
                </div>

                <div class="battlefield" class:shaking={isShaking}>
                    <div class="heat-haze"></div>
                    <div
                        class="fire-aura"
                        style:opacity={0.1 +
                            (weaponsDestroyed / TARGET_WEAPONS) * 0.4}
                    ></div>

                    {#each weapons as weapon (weapon.id)}
                        <button
                            class="alien-weapon {weapon.type}"
                            style:left="{weapon.x}%"
                            style:top="{weapon.y}%"
                            onclick={() =>
                                destroyWeapon(weapon.id, weapon.x, weapon.y)}
                            in:scale
                        >
                            <div class="weapon-icon">
                                {weapon.type === "cannon" ? "🛰️" : "🔫"}
                            </div>
                            <div class="fire-glow"></div>
                        </button>
                    {/each}

                    {#each explosions as exp (exp.id)}
                        <div
                            class="vfx-explosion"
                            style:left="{exp.x}%"
                            style:top="{exp.y}%"
                        >
                            <div class="fireball"></div>
                            <div class="sparks">
                                {#each Array(8) as _, j}
                                    <div
                                        class="spark-line"
                                        style:--angle="{j * 45}deg"
                                    ></div>
                                {/each}
                            </div>
                        </div>
                    {/each}

                    <div class="fire-particles">
                        {#each Array(15) as _, i}
                            <div
                                class="particle"
                                style:left="{Math.random() * 100}%"
                                style:animation-delay="{Math.random() * 3}s"
                                style:--drift="{(Math.random() - 0.5) * 50}px"
                            ></div>
                        {/each}
                    </div>

                    <div class="ground-defense">
                        <div class="fire-base"></div>
                    </div>
                </div>

                <div class="instruction">
                    TICK OP DE WAPENS OM ZE TE VERBRANDEN!
                </div>
            </div>
        </GameContainer>
    {/if}
</div>

<style>
    .burner-page {
        min-height: 80vh;
        display: flex;
        flex-direction: column;
    }

    /* Denied Screen */
    .denied-overlay {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .denied-card {
        max-width: 450px;
        text-align: center;
        padding: 3rem;
        background: rgba(239, 68, 68, 0.1);
        border: 2px solid #ef4444;
        box-shadow: 0 0 30px rgba(239, 68, 68, 0.2);
    }

    .warning-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }

    .denied-card h1 {
        font-family: "Orbitron", sans-serif;
        color: #ef4444;
        margin-bottom: 1.5rem;
    }

    .denied-card p {
        color: #e2e8f0;
        line-height: 1.6;
        margin-bottom: 2rem;
    }

    .back-btn {
        background: #ef4444;
        color: white;
        border: none;
        padding: 0.8rem 2rem;
        border-radius: 8px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        cursor: pointer;
    }

    /* Game Styles */
    .burner-game {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
    }

    .objective-header {
        margin-bottom: 1.5rem;
    }

    .stat {
        background: rgba(251, 146, 60, 0.1);
        border: 1px solid #fb923c;
        padding: 1rem;
        border-radius: 12px;
        text-align: center;
    }

    .label {
        display: block;
        font-size: 0.8rem;
        color: #fb923c;
        margin-bottom: 0.2rem;
    }

    .value {
        font-family: "Orbitron", sans-serif;
        font-size: 1.5rem;
        color: white;
        font-weight: 900;
    }

    .battlefield {
        position: relative;
        height: 500px;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 20px;
        overflow: hidden;
        border: 2px solid rgba(251, 146, 60, 0.3);
        margin-bottom: 1.5rem;
    }

    .alien-weapon {
        position: absolute;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    }

    .weapon-icon {
        font-size: 2.5rem;
        filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.5));
        position: relative;
        z-index: 2;
    }

    .fire-glow {
        position: absolute;
        inset: -10px;
        background: radial-gradient(
            circle,
            rgba(251, 146, 60, 0.6) 0%,
            transparent 70%
        );
        opacity: 0.4;
        animation: glow-pulse 0.5s infinite alternate;
    }

    @keyframes glow-pulse {
        from {
            transform: scale(0.9);
            opacity: 0.3;
        }
        to {
            transform: scale(1.2);
            opacity: 0.6;
        }
    }

    .alien-weapon:active .weapon-icon {
        filter: brightness(2) contrast(1.5) drop-shadow(0 0 20px #fb923c);
        transform: scale(0.8);
    }

    /* Visual Effects */
    .vfx-explosion {
        position: absolute;
        width: 100px;
        height: 100px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 20;
    }

    .fireball {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle,
            #fff 0%,
            #fbbf24 30%,
            #fb923c 60%,
            transparent 100%
        );
        border-radius: 50%;
        animation: explode 0.5s ease-out forwards;
    }

    @keyframes explode {
        0% {
            transform: scale(0.1);
            opacity: 1;
        }
        40% {
            transform: scale(1.5);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }

    .sparks {
        position: absolute;
        inset: 0;
    }

    .sparks::before,
    .sparks::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 4px;
        height: 4px;
        background: #fff;
        box-shadow: 0 0 10px #fb923c;
        border-radius: 50%;
        transform-origin: center;
        animation: scatter 0.6s ease-out forwards;
    }

    @keyframes scatter {
        0% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 0px #fb923c;
        }
        100% {
            transform: translate(
                    calc(-100px + 200px * var(--rand, 0.5)),
                    calc(-100px + 200px * var(--rand2, 0.5))
                )
                scale(0);
            box-shadow: 0 0 20px #fb923c;
        }
    }

    .heat-haze {
        position: absolute;
        inset: 0;
        background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        opacity: 0.1;
        mix-blend-mode: overlay;
        animation: haze 4s linear infinite;
        pointer-events: none;
    }

    @keyframes haze {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(-200px);
        }
    }

    .fire-particles {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .particle {
        position: absolute;
        bottom: -10px;
        width: 3px;
        height: 3px;
        background: #fb923c;
        border-radius: 50%;
        filter: blur(1px);
        animation: rise 2s linear infinite;
    }

    @keyframes rise {
        0% {
            transform: translateY(0) scale(1);
            opacity: 0;
        }
        20% {
            opacity: 0.8;
        }
        100% {
            transform: translateY(-500px)
                translateX(calc(-20px + 40px * var(--drift, 0.5))) scale(0);
            opacity: 0;
        }
    }

    .ground-defense {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: linear-gradient(
            to top,
            rgba(239, 68, 68, 0.4),
            transparent
        );
    }

    .fire-base {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 20px;
        background: #fb923c;
        filter: blur(10px);
        animation: flicker 0.1s infinite alternate;
    }

    @keyframes flicker {
        from {
            opacity: 0.7;
            transform: scaleY(1);
        }
        to {
            opacity: 1;
            transform: scaleY(1.2);
        }
    }

    .battlefield.shaking {
        animation: shake 0.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }

    @keyframes shake {
        10%,
        90% {
            transform: translate3d(-1px, 0, 0);
        }
        20%,
        80% {
            transform: translate3d(2px, 0, 0);
        }
        30%,
        50%,
        70% {
            transform: translate3d(-4px, 0, 0);
        }
        40%,
        60% {
            transform: translate3d(4px, 0, 0);
        }
    }

    .fire-aura {
        position: absolute;
        inset: 0;
        box-shadow: inset 0 0 50px #fb923c;
        pointer-events: none;
        z-index: 5;
        mix-blend-mode: color-dodge;
        transition: opacity 0.5s ease;
    }

    .spark-line {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 2px;
        background: #fff;
        transform: translate(-50%, -50%) rotate(var(--angle)) translateX(10px);
        animation: spark-out 0.4s ease-out forwards;
    }

    @keyframes spark-out {
        0% {
            width: 0;
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0);
        }
        100% {
            width: 40px;
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--angle))
                translateX(30px);
        }
    }

    @keyframes rise {
        0% {
            transform: translateY(0) scale(1);
            opacity: 0;
        }
        20% {
            opacity: 0.8;
        }
        100% {
            transform: translateY(-500px) translateX(var(--drift)) scale(0);
            opacity: 0;
        }
    }

    .instruction {
        text-align: center;
        color: #fb923c;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 0.9rem;
        letter-spacing: 1px;
        margin-top: 1rem;
    }
</style>
