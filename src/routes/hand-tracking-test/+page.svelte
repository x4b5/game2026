<script lang="ts">
    import HandTracker from "$lib/components/HandTracker.svelte";
    import { type HandLandmarkerResult } from "@mediapipe/tasks-vision";

    let handData = $state<HandLandmarkerResult | null>(null);
    let pinchDistance = $state(0);
    let isPinching = $derived(pinchDistance < 0.05);
    let tracker: any = $state();

    function handleResults(results: HandLandmarkerResult) {
        handData = results;
        if (results.landmarks && results.landmarks.length > 0) {
            const hand = results.landmarks[0];
            const thumbTip = hand[4];
            const indexTip = hand[8];
            // Calculate distance (simple Euclidean in normalized 0-1 coords)
            const dx = thumbTip.x - indexTip.x;
            const dy = thumbTip.y - indexTip.y;
            pinchDistance = Math.sqrt(dx * dx + dy * dy);
        } else {
            pinchDistance = 1;
        }
    }
</script>

<div class="page-container">
    <h1>Hand Tracking Test</h1>
    <p>
        Enable the camera and hold your hand up. Pinch your index finger and
        thumb together to interact.
    </p>

    <div class="controls">
        <button class="btn" onclick={() => tracker?.enableCam()}
            >Toggle Camera</button
        >
    </div>

    <div class="demo-area">
        <HandTracker
            bind:this={tracker}
            onResults={handleResults}
            showDebug={true}
        />

        <div class="stats">
            <h2>Stats</h2>
            {#if handData?.landmarks?.length}
                <p>Hands detected: {handData.landmarks.length}</p>
                <p>Pinch Distance: {pinchDistance.toFixed(3)}</p>
                <div class="indicator" class:active={isPinching}>
                    {isPinching ? "👌 PINCHED!" : "✋ OPEN"}
                </div>
            {:else}
                <p>No hands detected</p>
            {/if}
        </div>
    </div>

    <!-- Visual feedback box -->
    <div class="interaction-zone">
        <div
            class="box"
            style:background-color={isPinching ? "#ef4444" : "#3b82f6"}
            style:transform={isPinching ? "scale(0.9)" : "scale(1)"}
        >
            {isPinching ? "Active!" : "Idle"}
        </div>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        background: #0f172a;
    }

    .page-container {
        padding: 2rem;
        color: white;
        background: #0f172a;
        min-height: 100vh;
        font-family: "Inter", sans-serif;
    }

    .controls {
        margin: 1rem 0;
    }

    .btn {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
    }
    .btn:hover {
        background: #2563eb;
    }

    .demo-area {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        margin-top: 2rem;
        background: rgba(255, 255, 255, 0.05);
        padding: 2rem;
        border-radius: 12px;
    }

    .stats {
        min-width: 200px;
    }

    .indicator {
        font-size: 2rem;
        font-weight: bold;
        color: #94a3b8;
        margin-top: 1rem;
        transition: color 0.2s;
    }
    .indicator.active {
        color: #4ade80;
    }

    .interaction-zone {
        margin-top: 2rem;
        display: flex;
        justify-content: center;
    }

    .box {
        width: 200px;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        font-size: 1.5rem;
        font-weight: bold;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
</style>
