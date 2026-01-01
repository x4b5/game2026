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
        if (score >= 3) {
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

<div class="safe-page" in:fade>
    <GameContainer
        bind:this={gameContainer}
        gameId="sint-pieter-safe"
        title="🔐 DE KLUIS VAN SINT PIETER"
        onReset={handleReset}
    >
        <div class="game-content">
            {#if gamePhase === "intro"}
                <div class="card briefing" in:fly={{ y: 20 }}>
                    <div class="vault-icon">🔒</div>
                    <h2>Identiteitscontrole</h2>
                    <p>
                        De kluis is beveiligd met een bio-metrische
                        Maastricht-check. Beantwoord 5 vragen over de stad.
                        Minimaal <strong>3 goed</strong> om de kluis te openen en
                        de viool te bevrijden.
                    </p>
                    <button class="primary-btn" onclick={startQuiz}>
                        START DECODERING
                    </button>
                </div>
            {:else if gamePhase === "quiz"}
                <div class="quiz-container">
                    <div class="quiz-header">
                        <div class="progress-info">
                            VRAAG {currentQuestionIndex + 1} VAN {questions.length}
                        </div>
                        <div class="score-tracking">
                            GEVONDEN DATA: {score}
                        </div>
                    </div>

                    <div class="question-card" in:scale={{ duration: 300 }}>
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
                                    <span class="letter"
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
                                {lastAnswerCorrect
                                    ? "CORRECT! TOEGANG VERLEEND"
                                    : "FOUT! DATA CORRUPT"}
                            </div>
                        {/if}
                    </div>
                </div>
            {:else if gamePhase === "result"}
                <div class="card result-card" in:fly={{ y: 20 }}>
                    {#if score >= 3}
                        <div class="result-icon success">🔓</div>
                        <h2>TOEGANG VERLEEND</h2>
                        <p>
                            Je hebt {score} van de {questions.length} vragen goed
                            beantwoord. De kluis springt open... de viool is van
                            jou!
                        </p>
                        <button
                            class="primary-btn success"
                            onclick={() => goto("/game/sint-pieter/victory")}
                        >
                            GA VERDER
                        </button>
                    {:else}
                        <div class="result-icon failure">🔒</div>
                        <h2>TOEGANG GEWEIGERD</h2>
                        <p>
                            Slechts {score} van de {questions.length} vragen waren
                            correct. De kluis blijft potdicht. Probeer het opnieuw!
                        </p>
                        <button class="primary-btn retry" onclick={handleReset}>
                            OPNIEUW
                        </button>
                        <button
                            class="secondary-btn"
                            style="margin-top: 1rem; width: 100%;"
                            onclick={() => goto("/game/sint-pieter/victory")}
                        >
                            DOORGAAN
                        </button>
                    {/if}
                </div>
            {/if}
        </div>
    </GameContainer>
</div>

<style>
    .safe-page {
        min-height: 90vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .game-content {
        max-width: 600px;
        width: 100%;
        margin: 0 auto;
    }

    .card {
        background: rgba(0, 0, 0, 0.7);
        border: 1px solid rgba(251, 191, 36, 0.3);
        padding: 2.5rem;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 0 30px rgba(251, 191, 36, 0.1);
    }

    .vault-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }

    h2 {
        font-family: "Orbitron", sans-serif;
        color: #fbbf24;
        margin-bottom: 1.5rem;
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    p {
        color: #cbd5e1;
        line-height: 1.6;
        margin-bottom: 2rem;
        font-size: 1.1rem;
    }

    .primary-btn {
        width: 100%;
        padding: 1.2rem;
        background: #fbbf24;
        color: #000;
        border: none;
        border-radius: 12px;
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .primary-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(251, 191, 36, 0.3);
    }

    .quiz-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .quiz-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: "Orbitron", sans-serif;
        font-size: 0.8rem;
        color: #94a3b8;
        letter-spacing: 1px;
    }

    .score-tracking {
        color: #fbbf24;
    }

    .question-card {
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 2rem;
        border-radius: 24px;
        min-height: 400px;
    }

    h3 {
        color: white;
        font-size: 1.25rem;
        margin-bottom: 2rem;
        line-height: 1.4;
        text-align: center;
    }

    .options-grid {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .option-btn {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 1rem 1.5rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 14px;
        color: #cbd5e1;
        text-align: left;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .option-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateX(5px);
    }

    .option-btn.selected {
        border-color: #fbbf24;
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

    .letter {
        width: 32px;
        height: 32px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        color: white;
        font-size: 0.9rem;
    }

    .feedback-msg {
        margin-top: 2rem;
        text-align: center;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 0.9rem;
        color: #ef4444;
        padding: 1rem;
        border-radius: 8px;
        background: rgba(239, 68, 68, 0.1);
    }

    .feedback-msg.success {
        color: #22c55e;
        background: rgba(34, 197, 94, 0.1);
    }

    .result-icon {
        font-size: 5rem;
        margin-bottom: 1.5rem;
    }

    .primary-btn.success {
        background: #22c55e;
        color: white;
    }

    .primary-btn.retry {
        background: #ef4444;
        color: white;
    }

    @media (max-width: 480px) {
        .card,
        .question-card {
            padding: 1.5rem;
        }

        h1 {
            font-size: 1.5rem;
        }
        h3 {
            font-size: 1.1rem;
        }
    }
</style>
