<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, slide, scale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import GameContainer from "$lib/components/GameContainer.svelte";

    let gameContainer: any;
    let currentQuestionIndex = $state(0);
    let score = $state(0);
    let gamePhase = $state<"intro" | "quiz" | "result">("intro");
    let selectedOption = $state<number | null>(null);
    let showFeedback = $state(false);
    let lastAnswerCorrect = $state(false);

    const questions = [
        {
            q: "Maastricht was eeuwenlang 'Tweeherig'. Welke twee machthebbers deelden de soevereiniteit over de stad?",
            options: [
                "De Koning van Spanje & de Paus",
                "De Hertog van Brabant & de Prins-bisschop van Luik",
                "De Graaf van Vlaanderen & de Keizer",
                "De Stadhouder & de Staten-Generaal",
            ],
            correct: 1,
        },
        {
            q: "In 1673 sneuvelde een wereldberoemde Franse kapitein-luitenant van de musketiers bij de Tongersepoort. Wie was dit?",
            options: ["Athos", "Porthos", "D'Artagnan", "Cyrano de Bergerac"],
            correct: 2,
        },
        {
            q: "Wat is de naam van de oudste stadspoort van Nederland (bouwjaar ca. 1229), te vinden in Maastricht?",
            options: [
                "Onze Lieve Vrouwepoort",
                "De Helpoort",
                "Sint Pieterspoort",
                "De Gevangenpoort",
            ],
            correct: 1,
        },
        {
            q: "In welk iconisch gebouw aan de Maas werd in 1991-1992 het Verdrag van Maastricht onderhandeld en getekend?",
            options: [
                "Het Stadhuis op de Markt",
                "Het Gouvernement (Provinciehuis)",
                "Het Dinghuis",
                "De Jezuïetenkerk",
            ],
            correct: 1,
        },
        {
            q: "Maastricht beschikt over een uniek stelsel van droge vestingwerken (de Hoge Fronten). Hoe heet de beroemde linie die tussen 1772 en 1777 werd aangelegd?",
            options: [
                "De Linie van Orange",
                "De Linie van Du Moulin",
                "De Vesting van Vauban",
                "De Linie van Menno van Coehoorn",
            ],
            correct: 1,
        },
        {
            q: "Welke beroemde violist, geboren in Maastricht, is bekend van zijn concerten op het Vrijthof?",
            options: [
                "Janine Jansen",
                "André Rieu",
                "Wibi Soerjadi",
                "Herman van Veen",
            ],
            correct: 1,
        },
        {
            q: "Hoe heet de bekende grot met mergelgangen onder de Sint-Pietersberg?",
            options: [
                "De Grotten van Han",
                "De Zonneberg grotten",
                "De Valkenburg grotten",
                "De Cannerberg grotten",
            ],
            correct: 1,
        },
        {
            q: "Welke rivier stroomt door Maastricht?",
            options: ["De Rijn", "De Maas", "De Schelde", "De Geul"],
            correct: 1,
        },
        {
            q: "De Onze-Lieve-Vrouwebasiliek in Maastricht heeft een bijzondere status. Welke unieke eigenschap heeft deze kerk?",
            options: [
                "Het is de enige Romaanse kerk in Nederland",
                "Het bezit een fragment van het Heilig Kruis",
                "Het heeft de oudste werkende kerkklok van Europa",
                "Het is gebouwd op de resten van een Romeinse tempel",
            ],
            correct: 3,
        },
        {
            q: "In 1764 werd in Maastricht een belangrijk fossiel ontdekt. Welk prehistorisch dier werd gevonden in de Sint-Pietersberg?",
            options: [
                "Een mammoet",
                "Een Mosasaurus",
                "Een pteranodon",
                "Een wolharige neushoorn",
            ],
            correct: 1,
        },
    ];

    function startQuiz() {
        gamePhase = "quiz";
        currentQuestionIndex = 0;
        score = 0;
        selectedOption = null;
        showFeedback = false;
    }

    function handleOptionClick(index: number) {
        if (showFeedback) return;

        selectedOption = index;
        lastAnswerCorrect = index === questions[currentQuestionIndex].correct;
        if (lastAnswerCorrect) score++;

        showFeedback = true;

        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                selectedOption = null;
                showFeedback = false;
            } else {
                finishQuiz();
            }
        }, 1500);
    }

    function finishQuiz() {
        gamePhase = "result";
        if (score >= 5) {
            gameContainer?.win(score * 1000);
        } else {
            gameContainer?.lose();
        }
    }

    function handleReset() {
        gamePhase = "intro";
        currentQuestionIndex = 0;
        score = 0;
        selectedOption = null;
        showFeedback = false;
    }
</script>

<svelte:head>
    <title>Sint Pieter // SECURITY CLEARANCE</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin="anonymous"
    />
    <link
        href="https://fonts.googleapis.com/css2?family=Audiowide&family=Chakra+Petch:wght@400;700&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<div class="safe-page">
    <div class="animated-bg"></div>
    <div class="scanline-overlay"></div>
    <div class="vignette"></div>

    <GameContainer
        bind:this={gameContainer}
        gameId="sint-pieter-safe"
        title="🔐 DE KLUIS VAN SINT PIETER"
        onReset={handleReset}
    >
        <div class="game-content">
            {#if gamePhase === "intro"}
                <div class="cyber-card briefing" in:fly={{ y: 20 }}>
                    <!-- Decoration -->
                    <div class="deco-bar top"></div>

                    <div class="icon-header">
                        <div class="vault-icon">🔒</div>
                        <div class="scan-ring"></div>
                    </div>

                    <h2 class="glitch-text">IDENTITEITSCONTROLE</h2>
                    <p class="mission-text">
                        De kluis is beveiligd met een bio-metrische
                        Maastricht-check. Beantwoord 10 vragen over de stad.
                        <br /><br />
                        <span class="highlight">VEREISTE:</span> Minimaal
                        <strong>5 correcte antwoorden</strong> om het beveiligingsprotocol
                        te doorbreken.
                    </p>
                    <button class="primary-btn" onclick={startQuiz}>
                        <div class="btn-content">START DECODERING</div>
                        <div class="btn-glitch"></div>
                    </button>
                </div>
            {:else if gamePhase === "quiz"}
                <div class="quiz-container">
                    <div class="quiz-header glass-panel">
                        <div class="progress-info">
                            <span class="label">PROGRESSIE</span>
                            <span class="value"
                                >{currentQuestionIndex + 1} / {questions.length}</span
                            >
                        </div>
                        <div class="score-tracking">
                            <span class="label">DATA</span>
                            <span class="value">{score}</span>
                        </div>
                        <div class="progress-bar">
                            <div
                                class="fill"
                                style:width="{(currentQuestionIndex /
                                    questions.length) *
                                    100}%"
                            ></div>
                        </div>
                    </div>

                    <div
                        class="question-card cyber-box"
                        in:scale={{ duration: 300 }}
                    >
                        <!-- Corners -->
                        <div class="corner tl"></div>
                        <div class="corner tr"></div>
                        <div class="corner bl"></div>
                        <div class="corner br"></div>

                        <h3>{questions[currentQuestionIndex].q}</h3>

                        <div class="options-grid">
                            {#each questions[currentQuestionIndex].options as option, i}
                                <button
                                    class="option-btn"
                                    class:selected={selectedOption === i}
                                    class:correct={showFeedback &&
                                        i ===
                                            questions[currentQuestionIndex]
                                                .correct}
                                    class:wrong={showFeedback &&
                                        selectedOption === i &&
                                        i !==
                                            questions[currentQuestionIndex]
                                                .correct}
                                    disabled={showFeedback}
                                    onclick={() => handleOptionClick(i)}
                                >
                                    <span class="letter-box"
                                        >{String.fromCharCode(65 + i)}</span
                                    >
                                    <span class="text">{option}</span>
                                </button>
                            {/each}
                        </div>

                        {#if showFeedback}
                            <div
                                class="feedback-msg"
                                in:slide
                                class:success={lastAnswerCorrect}
                            >
                                <span class="feedback-icon"
                                    >{lastAnswerCorrect ? "✅" : "❌"}</span
                                >
                                {lastAnswerCorrect
                                    ? "CORRECT! TOEGANG VERLEEND"
                                    : "FOUT! DATA CORRUPT"}
                            </div>
                        {/if}
                    </div>
                </div>
            {:else if gamePhase === "result"}
                <div class="cyber-card result-card" in:fly={{ y: 20 }}>
                    <div class="deco-bar top"></div>
                    <div class="deco-bar bottom"></div>

                    {#if score >= 5}
                        <div class="result-header success">
                            <div class="result-icon">🔓</div>
                            <div class="result-glow"></div>
                        </div>
                        <h2 class="glitch-text">TOEGANG VERLEEND</h2>
                        <div class="score-display">
                            <span class="big-score">{score}</span>
                            <span class="total">/ {questions.length}</span>
                        </div>
                        <p class="mission-text">
                            Biometrische scan succesvol. De kluis is geopend.
                            <strong class="highlight"
                                >De viool is veiliggesteld.</strong
                            >
                        </p>
                        <button
                            class="primary-btn success"
                            onclick={() => goto("/game/sint-pieter/victory")}
                        >
                            <div class="btn-content">GA VERDER</div>
                            <div class="btn-glitch"></div>
                        </button>
                    {:else}
                        <div class="result-header fail">
                            <div class="result-icon">🚫</div>
                        </div>
                        <h2 class="glitch-text fail">TOEGANG GEWEIGERD</h2>
                        <p class="mission-text">
                            Onvoldoende kennis gedetecteerd. Score: {score}/{questions.length}.
                            Probeer het opnieuw.
                        </p>
                        <button class="primary-btn retry" onclick={handleReset}>
                            <div class="btn-content">OPNIEUW PROBEREN</div>
                        </button>
                    {/if}
                </div>
            {/if}
        </div>
    </GameContainer>
</div>

<style>
    /* Global Overrides */
    :global(body) {
        background-color: #030712;
        color: #e2e8f0;
        font-family: "Rajdhani", sans-serif;
    }

    .safe-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        position: relative;
        overflow: hidden;
    }

    /* Background Effects */
    .animated-bg {
        position: absolute;
        inset: 0;
        background: radial-gradient(
                circle at 50% 100%,
                rgba(251, 191, 36, 0.1) 0%,
                transparent 70%
            ),
            linear-gradient(rgba(20, 20, 20, 0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 20, 20, 0.8) 1px, transparent 1px);
        background-size:
            100% 100%,
            40px 40px,
            40px 40px;
        z-index: -2;
        animation: bg-pulse 8s ease-in-out infinite;
    }

    .vignette {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle at center,
            transparent 40%,
            #000 100%
        );
        z-index: 5;
        pointer-events: none;
    }

    .game-content {
        max-width: 700px;
        width: 100%;
        margin: 0 auto;
        position: relative;
        z-index: 20;
    }

    .cyber-card {
        background: rgba(10, 10, 15, 0.95);
        border: 1px solid rgba(251, 191, 36, 0.4);
        padding: 3rem;
        position: relative;
        text-align: center;
        box-shadow: 0 0 50px rgba(251, 191, 36, 0.1);
        clip-path: polygon(
            20px 0,
            100% 0,
            100% calc(100% - 20px),
            calc(100% - 20px) 100%,
            0 100%,
            0 20px
        );
    }

    .deco-bar {
        position: absolute;
        height: 4px;
        background: #fbbf24;
        width: 100px;
    }
    .deco-bar.top {
        top: 0;
        left: 0;
    }
    .deco-bar.bottom {
        bottom: 0;
        right: 0;
    }

    .icon-header {
        position: relative;
        display: inline-block;
        margin-bottom: 2rem;
    }

    .vault-icon {
        font-size: 4rem;
        position: relative;
        z-index: 2;
    }

    .scan-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100px;
        height: 100px;
        border: 2px dashed #fbbf24;
        border-radius: 50%;
        animation: spin 10s linear infinite;
        opacity: 0.5;
    }

    h2 {
        font-family: "Orbitron", sans-serif;
        color: #fff;
        margin-bottom: 1.5rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 1.8rem;
    }

    .glitch-text.fail {
        color: #ef4444;
    }

    .mission-text {
        color: #94a3b8;
        line-height: 1.6;
        margin-bottom: 2rem;
        font-size: 1.1rem;
        font-family: "Share Tech Mono", monospace;
    }

    .highlight {
        color: #fbbf24;
    }

    .primary-btn {
        width: 100%;
        padding: 1.2rem;
        background: #fbbf24;
        color: #000;
        border: none;
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        font-size: 1.1rem;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        clip-path: polygon(
            10px 0,
            100% 0,
            100% calc(100% - 10px),
            calc(100% - 10px) 100%,
            0 100%,
            0 10px
        );
    }

    .btn-content {
        position: relative;
        z-index: 2;
    }

    .btn-glitch {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            45deg,
            transparent 5%,
            rgba(255, 255, 255, 0.3) 5%,
            rgba(255, 255, 255, 0.3) 10%,
            transparent 10%
        );
        animation: glitch-anim 2s infinite linear;
    }

    .primary-btn:hover {
        transform: translateY(-2px);
        background: #f59e0b;
        box-shadow: 0 0 30px rgba(251, 191, 36, 0.4);
    }

    .quiz-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .quiz-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        position: relative;
        clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px);
    }

    .progress-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        width: 100%;
        background: #333;
    }

    .progress-bar .fill {
        height: 100%;
        background: #fbbf24;
        transition: width 0.3s;
    }

    .label {
        font-family: "Share Tech Mono", monospace;
        font-size: 0.7rem;
        color: #64748b;
        display: block;
    }

    .value {
        font-family: "Orbitron", sans-serif;
        color: #fbbf24;
        font-size: 1.1rem;
    }

    .question-card.cyber-box {
        background: rgba(15, 20, 30, 0.9);
        border: 1px solid rgba(59, 130, 246, 0.2);
        padding: 2.5rem;
        min-height: 400px;
        position: relative;
    }

    .corner {
        position: absolute;
        width: 10px;
        height: 10px;
        border: 2px solid #3b82f6;
    }
    .corner.tl {
        top: 0;
        left: 0;
        border-right: none;
        border-bottom: none;
    }
    .corner.tr {
        top: 0;
        right: 0;
        border-left: none;
        border-bottom: none;
    }
    .corner.bl {
        bottom: 0;
        left: 0;
        border-right: none;
        border-top: none;
    }
    .corner.br {
        bottom: 0;
        right: 0;
        border-left: none;
        border-top: none;
    }

    h3 {
        color: white;
        font-size: 1.3rem;
        margin-bottom: 2rem;
        line-height: 1.4;
        text-align: center;
        font-family: "Rajdhani", sans-serif;
        font-weight: 600;
    }

    .options-grid {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }

    .option-btn {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.2rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #cbd5e1;
        text-align: left;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
    }

    .option-btn:hover:not(:disabled) {
        background: rgba(59, 130, 246, 0.1);
        border-color: #3b82f6;
        padding-left: 1.5rem;
    }

    .option-btn.selected {
        background: rgba(251, 191, 36, 0.1);
        border-color: #fbbf24;
        color: #fbbf24;
    }

    .option-btn.correct {
        background: rgba(34, 197, 94, 0.2);
        border-color: #22c55e;
        color: #4ade80;
    }

    .option-btn.wrong {
        background: rgba(239, 68, 68, 0.2);
        border-color: #ef4444;
        color: #f87171;
    }

    .letter-box {
        width: 30px;
        height: 30px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 0.8rem;
    }

    .option-btn.selected .letter-box {
        border-color: #fbbf24;
        color: #fbbf24;
    }
    .option-btn.correct .letter-box {
        border-color: #22c55e;
        color: #22c55e;
    }

    .feedback-msg {
        margin-top: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 1rem;
        color: #ef4444;
        padding: 1rem;
        background: rgba(239, 68, 68, 0.05);
        border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .feedback-msg.success {
        color: #4ade80;
        background: rgba(34, 197, 94, 0.05);
        border-color: #22c55e;
    }

    .result-header {
        position: relative;
        display: inline-block;
        margin-bottom: 2rem;
    }

    .result-icon {
        font-size: 5rem;
        position: relative;
        z-index: 2;
    }

    .result-glow {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle,
            rgba(74, 222, 128, 0.4),
            transparent 70%
        );
        z-index: 1;
        animation: pulse 2s infinite;
    }

    .score-display {
        margin: 1rem 0;
        font-family: "Orbitron", sans-serif;
    }

    .big-score {
        font-size: 4rem;
        font-weight: 900;
        color: #4ade80;
    }
    .total {
        font-size: 1.5rem;
        color: #94a3b8;
    }

    .primary-btn.success {
        background: #22c55e;
        color: white;
    }

    .primary-btn.retry {
        background: transparent;
        border: 1px solid #ef4444;
        color: #ef4444;
    }
    .primary-btn.retry:hover {
        background: rgba(239, 68, 68, 0.1);
    }

    @keyframes spin {
        from {
            transform: translate(-50%, -50%) rotate(0deg);
        }
        to {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }
    @keyframes pulse {
        0%,
        100% {
            opacity: 0.6;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.1);
        }
    }
    @keyframes glitch-anim {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(-2px, 2px);
        }
        40% {
            transform: translate(-2px, -2px);
        }
        60% {
            transform: translate(2px, 2px);
        }
        80% {
            transform: translate(2px, -2px);
        }
        100% {
            transform: translate(0);
        }
    }

    @keyframes bg-pulse {
        0%,
        100% {
            opacity: 0.8;
        }
        50% {
            opacity: 1;
        }
    }

    @media (max-width: 480px) {
        .cyber-card,
        .question-card {
            padding: 1.5rem;
        }
        h2 {
            font-size: 1.5rem;
        }
    }
</style>
