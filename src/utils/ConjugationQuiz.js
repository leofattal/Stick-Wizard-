class ConjugationQuiz {
    constructor(scene) {
        this.scene = scene;
        this.isActive = false;
        this.currentQuiz = null;
        this.callback = null;

        // French verbs database with multiple tenses
        this.verbs = [
            {
                infinitive: 'FAIRE',
                english: 'to do/make',
                tenses: {
                    'présent': {
                        name: 'Present',
                        conjugations: {
                            'je': 'fais', 'tu': 'fais', 'il/elle': 'fait',
                            'nous': 'faisons', 'vous': 'faites', 'ils/elles': 'font'
                        }
                    },
                    'passé composé': {
                        name: 'Past (Passé Composé)',
                        conjugations: {
                            'je': 'ai fait', 'tu': 'as fait', 'il/elle': 'a fait',
                            'nous': 'avons fait', 'vous': 'avez fait', 'ils/elles': 'ont fait'
                        }
                    },
                    'imparfait': {
                        name: 'Imperfect',
                        conjugations: {
                            'je': 'faisais', 'tu': 'faisais', 'il/elle': 'faisait',
                            'nous': 'faisions', 'vous': 'faisiez', 'ils/elles': 'faisaient'
                        }
                    },
                    'futur': {
                        name: 'Future',
                        conjugations: {
                            'je': 'ferai', 'tu': 'feras', 'il/elle': 'fera',
                            'nous': 'ferons', 'vous': 'ferez', 'ils/elles': 'feront'
                        }
                    }
                }
            },
            {
                infinitive: 'LANCER',
                english: 'to throw',
                tenses: {
                    'présent': {
                        name: 'Present',
                        conjugations: {
                            'je': 'lance', 'tu': 'lances', 'il/elle': 'lance',
                            'nous': 'lançons', 'vous': 'lancez', 'ils/elles': 'lancent'
                        }
                    },
                    'passé composé': {
                        name: 'Past (Passé Composé)',
                        conjugations: {
                            'je': 'ai lancé', 'tu': 'as lancé', 'il/elle': 'a lancé',
                            'nous': 'avons lancé', 'vous': 'avez lancé', 'ils/elles': 'ont lancé'
                        }
                    },
                    'futur': {
                        name: 'Future',
                        conjugations: {
                            'je': 'lancerai', 'tu': 'lanceras', 'il/elle': 'lancera',
                            'nous': 'lancerons', 'vous': 'lancerez', 'ils/elles': 'lanceront'
                        }
                    }
                }
            },
            {
                infinitive: 'ATTAQUER',
                english: 'to attack',
                tenses: {
                    'présent': {
                        name: 'Present',
                        conjugations: {
                            'je': 'attaque', 'tu': 'attaques', 'il/elle': 'attaque',
                            'nous': 'attaquons', 'vous': 'attaquez', 'ils/elles': 'attaquent'
                        }
                    },
                    'passé composé': {
                        name: 'Past (Passé Composé)',
                        conjugations: {
                            'je': 'ai attaqué', 'tu': 'as attaqué', 'il/elle': 'a attaqué',
                            'nous': 'avons attaqué', 'vous': 'avez attaqué', 'ils/elles': 'ont attaqué'
                        }
                    },
                    'futur': {
                        name: 'Future',
                        conjugations: {
                            'je': 'attaquerai', 'tu': 'attaqueras', 'il/elle': 'attaquera',
                            'nous': 'attaquerons', 'vous': 'attaquerez', 'ils/elles': 'attaqueront'
                        }
                    }
                }
            },
            {
                infinitive: 'DÉFENDRE',
                english: 'to defend',
                tenses: {
                    'présent': {
                        name: 'Present',
                        conjugations: {
                            'je': 'défends', 'tu': 'défends', 'il/elle': 'défend',
                            'nous': 'défendons', 'vous': 'défendez', 'ils/elles': 'défendent'
                        }
                    },
                    'passé composé': {
                        name: 'Past (Passé Composé)',
                        conjugations: {
                            'je': 'ai défendu', 'tu': 'as défendu', 'il/elle': 'a défendu',
                            'nous': 'avons défendu', 'vous': 'avez défendu', 'ils/elles': 'ont défendu'
                        }
                    },
                    'futur': {
                        name: 'Future',
                        conjugations: {
                            'je': 'défendrai', 'tu': 'défendras', 'il/elle': 'défendra',
                            'nous': 'défendrons', 'vous': 'défendrez', 'ils/elles': 'défendront'
                        }
                    }
                }
            },
            {
                infinitive: 'COMBATTRE',
                english: 'to fight',
                tenses: {
                    'présent': {
                        name: 'Present',
                        conjugations: {
                            'je': 'combats', 'tu': 'combats', 'il/elle': 'combat',
                            'nous': 'combattons', 'vous': 'combattez', 'ils/elles': 'combattent'
                        }
                    },
                    'passé composé': {
                        name: 'Past (Passé Composé)',
                        conjugations: {
                            'je': 'ai combattu', 'tu': 'as combattu', 'il/elle': 'a combattu',
                            'nous': 'avons combattu', 'vous': 'avez combattu', 'ils/elles': 'ont combattu'
                        }
                    },
                    'futur': {
                        name: 'Future',
                        conjugations: {
                            'je': 'combattrai', 'tu': 'combattras', 'il/elle': 'combattra',
                            'nous': 'combattrons', 'vous': 'combattrez', 'ils/elles': 'combattront'
                        }
                    }
                }
            }
        ];
    }

    showQuiz(onCorrect, onIncorrect) {
        if (this.isActive) return; // Already showing a quiz

        this.isActive = true;
        this.onCorrect = onCorrect;
        this.onIncorrect = onIncorrect;

        // PAUSE THE GAME
        this.scene.physics.pause();
        this.scene.tweens.pauseAll();
        this.wasPaused = true;

        // Pick random verb, tense, and pronoun
        const verb = Phaser.Utils.Array.GetRandom(this.verbs);
        const tenseKeys = Object.keys(verb.tenses);
        const tenseKey = Phaser.Utils.Array.GetRandom(tenseKeys);
        const tense = verb.tenses[tenseKey];

        const pronouns = Object.keys(tense.conjugations);
        const pronoun = Phaser.Utils.Array.GetRandom(pronouns);
        const correctAnswer = tense.conjugations[pronoun];

        this.currentQuiz = {
            verb: verb,
            tense: tense,
            tenseKey: tenseKey,
            pronoun: pronoun,
            correctAnswer: correctAnswer
        };

        // Get all possible answers (correct + 2 wrong from same tense)
        const allAnswers = Object.values(tense.conjugations);
        const wrongAnswers = allAnswers.filter(ans => ans !== correctAnswer);

        // Pick 2 random wrong answers
        const shuffledWrong = Phaser.Utils.Array.Shuffle([...wrongAnswers]);
        const options = [correctAnswer, shuffledWrong[0], shuffledWrong[1]];

        // Shuffle options
        this.options = Phaser.Utils.Array.Shuffle(options);

        // Create UI
        this.createQuizUI();
    }

    createQuizUI() {
        // Dim background
        this.dimBackground = this.scene.add.rectangle(
            Constants.GAME_WIDTH / 2,
            Constants.GAME_HEIGHT / 2,
            Constants.GAME_WIDTH,
            Constants.GAME_HEIGHT,
            0x000000,
            0.7
        ).setDepth(1000);

        // Quiz container
        this.quizContainer = this.scene.add.container(Constants.GAME_WIDTH / 2, Constants.GAME_HEIGHT / 2);
        this.quizContainer.setDepth(1001);

        // Background panel
        const panel = this.scene.add.rectangle(0, 0, 500, 350, 0x2a2a4a);
        panel.setStrokeStyle(4, 0xffaa00);

        // Title
        const title = this.scene.add.text(0, -150, 'CONJUGATE TO CAST!', {
            fontSize: '28px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#ffaa00'
        }).setOrigin(0.5);

        // Verb infinitive
        const verbText = this.scene.add.text(0, -110, `${this.currentQuiz.verb.infinitive} (${this.currentQuiz.verb.english})`, {
            fontSize: '18px',
            fontFamily: 'Arial',
            fontStyle: 'italic',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Tense
        const tenseText = this.scene.add.text(0, -80, `Tense: ${this.currentQuiz.tense.name}`, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        // Question
        const question = this.scene.add.text(0, -40, `${this.currentQuiz.pronoun} _____`, {
            fontSize: '32px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#ffff00'
        }).setOrigin(0.5);

        this.quizContainer.add([panel, title, verbText, tenseText, question]);

        // Create answer buttons
        this.answerButtons = [];
        this.options.forEach((option, index) => {
            const y = 20 + (index * 60);
            const button = this.createAnswerButton(0, y, option, index);
            this.answerButtons.push(button);
        });
    }

    createAnswerButton(x, y, text, index) {
        const container = this.scene.add.container(x, y);
        container.setDepth(1001);

        // Button background
        const bg = this.scene.add.rectangle(0, 0, 300, 50, 0x4444ff);
        bg.setStrokeStyle(3, 0xffffff);

        // Button text
        const buttonText = this.scene.add.text(0, 0, text, {
            fontSize: '24px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        container.add([bg, buttonText]);
        this.quizContainer.add(container);

        // Make interactive
        bg.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                bg.setFillStyle(0x6666ff);
                container.setScale(1.05);
            })
            .on('pointerout', () => {
                bg.setFillStyle(0x4444ff);
                container.setScale(1);
            })
            .on('pointerdown', () => {
                container.setScale(0.95);
            })
            .on('pointerup', () => {
                this.checkAnswer(text, bg, buttonText);
            });

        // Add keyboard support (1, 2, 3)
        const key = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE + index);
        key.on('down', () => {
            this.checkAnswer(text, bg, buttonText);
        });

        return { container, bg, buttonText };
    }

    checkAnswer(selectedAnswer, bg, buttonText) {
        if (!this.isActive) return;

        const isCorrect = selectedAnswer === this.currentQuiz.correctAnswer;

        if (isCorrect) {
            // Correct answer - flash green
            bg.setFillStyle(0x00ff00);
            buttonText.setText('✓ ' + selectedAnswer);

            this.scene.time.delayedCall(500, () => {
                this.hideQuiz();
                // RESUME THE GAME
                if (this.wasPaused) {
                    this.scene.physics.resume();
                    this.scene.tweens.resumeAll();
                    this.wasPaused = false;
                }
                if (this.onCorrect) this.onCorrect();
            });
        } else {
            // Wrong answer - flash red and SHOW EXPLANATION
            bg.setFillStyle(0xff0000);
            buttonText.setText('✗ ' + selectedAnswer);

            this.scene.time.delayedCall(800, () => {
                // Show the correct answer and explanation
                this.showExplanation(selectedAnswer);
            });
        }
    }

    showExplanation(wrongAnswer) {
        // Clear the quiz UI
        if (this.quizContainer) {
            this.quizContainer.destroy();
        }

        // Create explanation panel
        this.quizContainer = this.scene.add.container(Constants.GAME_WIDTH / 2, Constants.GAME_HEIGHT / 2);
        this.quizContainer.setDepth(1001);

        // Background panel (larger for explanation)
        const panel = this.scene.add.rectangle(0, 0, 600, 400, 0x2a2a4a);
        panel.setStrokeStyle(4, 0xff0000);

        // Title
        const title = this.scene.add.text(0, -170, 'INCORRECT!', {
            fontSize: '32px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#ff0000'
        }).setOrigin(0.5);

        // Your answer
        const yourAnswer = this.scene.add.text(0, -120, `You answered: ${this.currentQuiz.pronoun} ${wrongAnswer}`, {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ff6666'
        }).setOrigin(0.5);

        // Correct answer
        const correctText = this.scene.add.text(0, -80, `Correct answer: ${this.currentQuiz.pronoun} ${this.currentQuiz.correctAnswer}`, {
            fontSize: '22px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#00ff00'
        }).setOrigin(0.5);

        // Explanation
        const explanation = this.getExplanation(wrongAnswer);
        const explanationText = this.scene.add.text(0, -20, explanation, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 550 }
        }).setOrigin(0.5);

        // Continue button
        const continueBtn = this.createContinueButton();

        this.quizContainer.add([panel, title, yourAnswer, correctText, explanationText, continueBtn]);
    }

    getExplanation(wrongAnswer) {
        const { verb, tense, tenseKey, pronoun, correctAnswer } = this.currentQuiz;

        let explanation = `For ${verb.infinitive} (${verb.english}) in ${tense.name}:\n\n`;

        // Tense-specific explanations
        if (tenseKey === 'passé composé') {
            explanation += `The passé composé uses avoir/être + past participle.\n`;
            explanation += `With "${pronoun}", you use: ${pronoun} ${correctAnswer}`;
        } else if (tenseKey === 'futur') {
            explanation += `The future tense uses the infinitive stem + endings.\n`;
            explanation += `For "${pronoun}": ${pronoun} ${correctAnswer}`;
        } else if (tenseKey === 'imparfait') {
            explanation += `The imperfect describes past habits or ongoing actions.\n`;
            explanation += `For "${pronoun}": ${pronoun} ${correctAnswer}`;
        } else {
            explanation += `In the present tense with "${pronoun}":\n`;
            explanation += `${pronoun} ${correctAnswer}`;
        }

        return explanation;
    }

    createContinueButton() {
        const container = this.scene.add.container(0, 130);

        const bg = this.scene.add.rectangle(0, 0, 200, 50, 0x4444ff);
        bg.setStrokeStyle(3, 0xffffff);

        const text = this.scene.add.text(0, 0, 'CONTINUE', {
            fontSize: '24px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        container.add([bg, text]);

        bg.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                bg.setFillStyle(0x6666ff);
                container.setScale(1.05);
            })
            .on('pointerout', () => {
                bg.setFillStyle(0x4444ff);
                container.setScale(1);
            })
            .on('pointerdown', () => {
                container.setScale(0.95);
            })
            .on('pointerup', () => {
                this.hideQuiz();
                // RESUME THE GAME
                if (this.wasPaused) {
                    this.scene.physics.resume();
                    this.scene.tweens.resumeAll();
                    this.wasPaused = false;
                }
                if (this.onIncorrect) this.onIncorrect();
            });

        return container;
    }

    hideQuiz() {
        this.isActive = false;

        if (this.dimBackground) {
            this.dimBackground.destroy();
            this.dimBackground = null;
        }

        if (this.quizContainer) {
            this.quizContainer.destroy();
            this.quizContainer = null;
        }

        this.answerButtons = [];
        this.currentQuiz = null;
        this.onCorrect = null;
        this.onIncorrect = null;

        console.log('🧹 Quiz cleaned up and ready for next cast');
    }
}
