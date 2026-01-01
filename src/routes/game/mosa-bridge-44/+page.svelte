<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, scale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { gameProgress } from "$lib/stores/gameStore";

    let visible = $state(false);
    // let isMosa = $derived($gameProgress.player?.avatar === "mosa");
    let isMosa = true; // Access restriction lifted by user request

    onMount(() => {
        visible = true;
    });

    async function handleNext() {
        // Go to the defense game
        goto("/game/mosa-bridge-44/defense");
    }
</script>

<div class="mosa-mission-page" in:fade>
    <div class="bridge-background"></div>

    <div class="content-panel glass-panel">
        {#if !isMosa}
            <div class="access-denied" in:fly={{ y: 20 }}>
                <h1>TOEGANG GEWEIGERD</h1>
                <p>Deze missie is specifiek voor <strong>Lord Mosa</strong>.</p>
                <div class="avatar-hint">🌊</div>
                <button class="return-btn" onclick={() => goto("/game")}>
                    TERUG NAAR DASHBOARD
                </button>
            </div>
        {:else}
            <div class="mission-briefing" in:fly={{ y: 20 }}>
                <div class="mission-tag">MISSIE: WYCK - SERVAASBRUG</div>
                <h1>LORD MOSA, ACTIE!</h1>

                <div class="story-box">
                    <p>
                        De elitaire aliens die aan Stella zijn ontsnapt, zijn
                        gesignaleerd in Wyck. De superhelden hebben de
                        achtervolging ingezet!
                    </p>
                    <div class="urgent-update">
                        🚨 <strong>VISUELE BEVESTIGING:</strong> De aliens
                        steken op dit moment de <strong>Servaasbrug</strong> over
                        richting de binnenstad!
                    </div>
                    <p>
                        Lord Mosa, jij bent de enige die ze bij de Maas kan
                        onderscheppen. Gebruik je krachten om de brug te bewaken
                        en de oversteek te blokkeren.
                    </p>
                </div>

                <div class="objectives">
                    <div class="obj-card">
                        <span class="icon">🌉</span>
                        <div class="text">
                            <strong>LOCATIE:</strong>
                            <span>Sint Servaasbrug, Maastricht</span>
                        </div>
                    </div>
                    <div class="obj-card">
                        <span class="icon">🛡️</span>
                        <div class="text">
                            <strong>OPDRACHT:</strong>
                            <span>Blokkeer de vluchtweg over het water.</span>
                        </div>
                    </div>
                </div>

                <button class="action-btn" onclick={handleNext}>
                    BEWAAK DE BRUG 🌊
                </button>
            </div>
        {/if}
    </div>
</div>

<style>
    .mosa-mission-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        background: #020617;
        position: relative;
        overflow: hidden;
    }

    .bridge-background {
        position: absolute;
        inset: 0;
        background: linear-gradient(
                to bottom,
                rgba(2, 6, 23, 0.8),
                rgba(2, 6, 23, 0.4)
            ),
            url("https://images.unsplash.com/photo-1590001155093-fa2744820907?auto=format&fit=crop&q=80&w=2000"); /* Placeholder for bridge visual */
        background-size: cover;
        background-position: center;
        opacity: 0.3;
        filter: grayscale(0.5) blue-shift(0.2);
    }

    .content-panel {
        max-width: 650px;
        width: 100%;
        padding: 3rem 2.5rem;
        background: rgba(7, 89, 133, 0.15);
        backdrop-filter: blur(12px);
        border: 2px solid #0ea5e9;
        box-shadow: 0 0 50px rgba(14, 165, 233, 0.2);
        z-index: 1;
        border-radius: 32px;
        text-align: center;
    }

    .mission-tag {
        font-family: "Orbitron", sans-serif;
        color: #7dd3fc;
        font-size: 0.85rem;
        letter-spacing: 3px;
        margin-bottom: 1rem;
        text-transform: uppercase;
    }

    h1 {
        font-family: "Orbitron", sans-serif;
        font-size: 2.5rem;
        color: white;
        margin-bottom: 2rem;
        text-shadow: 0 0 20px rgba(14, 165, 233, 0.5);
    }

    .story-box {
        background: rgba(0, 0, 0, 0.3);
        padding: 2rem;
        border-radius: 20px;
        text-align: left;
        margin-bottom: 2rem;
        border-left: 4px solid #0ea5e9;
    }

    p {
        color: #e0f2fe;
        line-height: 1.7;
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
    }

    .urgent-update {
        background: rgba(224, 242, 254, 0.1);
        padding: 1rem;
        border-radius: 12px;
        color: white;
        border: 1px dashed #0ea5e9;
        margin-bottom: 1.5rem;
    }

    .objectives {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 2.5rem;
    }

    .obj-card {
        background: rgba(14, 165, 233, 0.1);
        padding: 1.2rem;
        border-radius: 16px;
        display: flex;
        align-items: center;
        gap: 1rem;
        text-align: left;
        border: 1px solid rgba(14, 165, 233, 0.2);
    }

    .obj-card .icon {
        font-size: 2rem;
    }

    .obj-card .text {
        display: flex;
        flex-direction: column;
    }

    .obj-card strong {
        font-size: 0.75rem;
        color: #7dd3fc;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .obj-card span {
        color: white;
        font-weight: 600;
        font-size: 0.95rem;
    }

    .action-btn {
        width: 100%;
        padding: 1.5rem;
        background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
        color: white;
        border: none;
        border-radius: 16px;
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        font-size: 1.4rem;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 10px 25px rgba(14, 165, 233, 0.3);
        letter-spacing: 2px;
    }

    .action-btn:hover {
        transform: scale(1.02) translateY(-5px);
        box-shadow: 0 20px 40px rgba(14, 165, 233, 0.5);
    }

    .access-denied {
        padding: 2rem;
    }

    .access-denied h1 {
        color: #ef4444;
    }

    .avatar-hint {
        font-size: 5rem;
        margin: 2rem 0;
        animation: wave 2s ease-in-out infinite;
    }

    .return-btn {
        background: transparent;
        color: #94a3b8;
        border: 1px solid #334155;
        padding: 1rem 2rem;
        border-radius: 12px;
        cursor: pointer;
        font-family: "Orbitron", sans-serif;
    }

    @keyframes wave {
        0%,
        100% {
            transform: translateY(0) rotate(0);
        }
        50% {
            transform: translateY(-20px) rotate(10deg);
        }
    }

    @media (max-width: 600px) {
        .objectives {
            grid-template-columns: 1fr;
        }
        h1 {
            font-size: 1.8rem;
        }
    }
</style>
