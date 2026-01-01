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
    let weaponsDestroyed = $state(0);
    let gameActive = $state(false);
    let currentId = 0;
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

    function destroyWeapon(id: number) {
        if (!gameActive) return;

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

                <div class="battlefield">
                    {#each weapons as weapon (weapon.id)}
                        <button
                            class="alien-weapon {weapon.type}"
                            style:left="{weapon.x}%"
                            style:top="{weapon.y}%"
                            onclick={() => destroyWeapon(weapon.id)}
                            in:scale
                        >
                            <div class="weapon-icon">
                                {weapon.type === "cannon" ? "🛰️" : "🔫"}
                            </div>
                            <div class="fire-effect"></div>
                        </button>
                    {/each}

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
    }

    .fire-effect {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle, #fb923c 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.2s;
    }

    .alien-weapon:active .fire-effect {
        opacity: 0.6;
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

    .instruction {
        text-align: center;
        color: #fb923c;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 0.9rem;
        letter-spacing: 1px;
    }
</style>
