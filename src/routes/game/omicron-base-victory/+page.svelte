<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { goto } from "$app/navigation";

    let visible = $state(false);

    onMount(() => {
        visible = true;
    });
</script>

<div class="victory-page" in:fade={{ duration: 1000 }}>
    <div class="content-card glass-panel">
        <div class="success-badge">MISSIE VOLTOOID</div>
        <h1>OMICRON BASE GEVONDEN</h1>

        <div class="intel-report">
            <p in:fly={{ y: 20, duration: 800, delay: 500 }}>
                Het is gelukt! Door de wapens van de aliens te verbranden is hun
                aanval gestopt voordat deze begon.
            </p>
            <p in:fly={{ y: 20, duration: 800, delay: 1500 }}>
                De data die we hebben onderschept heeft ons naar hun geheime
                hoofdkwartier geleid: **Omicron Base**.
            </p>
            <p in:fly={{ y: 20, duration: 800, delay: 2500 }}>
                Alle agenten worden nu opgeroepen voor de finale confrontatie.
            </p>
        </div>

        <button class="next-btn" onclick={() => goto("/game")}>
            GA NAAR DASHBOARD
        </button>
    </div>
</div>

<style>
    .victory-page {
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .content-card {
        max-width: 600px;
        width: 100%;
        padding: 3rem;
        background: rgba(0, 0, 0, 0.7);
        border: 2px solid #22c55e;
        box-shadow: 0 0 40px rgba(34, 197, 94, 0.2);
        text-align: center;
    }

    .success-badge {
        display: inline-block;
        background: #22c55e;
        color: white;
        padding: 0.4rem 1.2rem;
        border-radius: 4px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 0.8rem;
        margin-bottom: 1.5rem;
    }

    h1 {
        font-family: "Orbitron", sans-serif;
        font-size: 2.2rem;
        color: white;
        margin-bottom: 2rem;
        letter-spacing: 2px;
    }

    .intel-report {
        color: #cbd5e1;
        font-size: 1.1rem;
        line-height: 1.7;
        margin-bottom: 3rem;
    }

    .intel-report p {
        margin-bottom: 1.5rem;
    }

    .next-btn {
        width: 100%;
        padding: 1.2rem;
        background: #22c55e;
        color: white;
        border: none;
        border-radius: 8px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .next-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3);
    }
</style>
