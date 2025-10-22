class ConjugationQuiz {
    constructor(scene) {
        this.scene = scene;
        this.isActive = false;
        this.currentQuiz = null;
        this.callback = null;

        // French verbs database
        this.verbs = [
            {
                infinitive: 'FAIRE (to do/make)',
                conjugations: {
                    'je': 'fais',
                    'tu': 'fais',
                    'il/elle': 'fait',
                    'nous': 'faisons',
                    'vous': 'faites',
                    'ils/elles': 'font'
                }
            },
            {
                infinitive: 'LANCER (to throw)',
                conjugations: {
                    'je': 'lance',
                    'tu': 'lances',
                    'il/elle': 'lance',
                    'nous': 'lançons',
                    'vous': 'lancez',
                    'ils/elles': 'lancent'
                }
            },
            {
                infinitive: 'ATTAQUER (to attack)',
                conjugations: {
                    'je': 'attaque',
                    'tu': 'attaques',
                    'il/elle': 'attaque',
                    'nous': 'attaquons',
                    'vous': 'attaquez',
                    'ils/elles': 'attaquent'
                }
            },
            {
                infinitive: 'DÉFENDRE (to defend)',
                conjugations: {
                    'je': 'défends',
                    'tu': 'défends',
                    'il/elle': 'défend',
                    'nous': 'défendons',
                    'vous': 'défendez',
                    'ils/elles': 'défendent'
                }
            },
            {
                infinitive: 'COMBATTRE (to fight)',
                conjugations: {
                    'je': 'combats',
                    'tu': 'combats',
                    'il/elle': 'combat',
                    'nous': 'combattons',
                    'vous': 'combattez',
                    'ils/elles': 'combattent'
                }
            },
            {
                infinitive: 'JOUER (to play)',
                conjugations: {
                    'je': 'joue',
                    'tu': 'joues',
                    'il/elle': 'joue',
                    'nous': 'jouons',
                    'vous': 'jouez',
                    'ils/elles': 'jouent'
                }
            }
        ];
    }

    showQuiz(onCorrect, onIncorrect) {
        if (this.isActive) return; // Already showing a quiz

        this.isActive = true;
        this.onCorrect = onCorrect;
        this.onIncorrect = onIncorrect;

        // Pick random verb and pronoun
        const verb = Phaser.Utils.Array.GetRandom(this.verbs);
        const pronouns = Object.keys(verb.conjugations);
        const pronoun = Phaser.Utils.Array.GetRandom(pronouns);
        const correctAnswer = verb.conjugations[pronoun];

        this.currentQuiz = {
            verb: verb,
            pronoun: pronoun,
            correctAnswer: correctAnswer
        };

        // Get all possible answers (correct + 2 wrong from same verb)
        const allAnswers = Object.values(verb.conjugations);
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
        const panel = this.scene.add.rectangle(0, 0, 500, 300, 0x2a2a4a);
        panel.setStrokeStyle(4, 0xffaa00);

        // Title
        const title = this.scene.add.text(0, -120, 'CONJUGATE TO CAST!', {
            fontSize: '28px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#ffaa00'
        }).setOrigin(0.5);

        // Verb infinitive
        const verbText = this.scene.add.text(0, -80, this.currentQuiz.verb.infinitive, {
            fontSize: '20px',
            fontFamily: 'Arial',
            fontStyle: 'italic',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Question
        const question = this.scene.add.text(0, -40, `${this.currentQuiz.pronoun} _____`, {
            fontSize: '32px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#ffff00'
        }).setOrigin(0.5);

        this.quizContainer.add([panel, title, verbText, question]);

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
                if (this.onCorrect) this.onCorrect();
            });
        } else {
            // Wrong answer - flash red
            bg.setFillStyle(0xff0000);
            buttonText.setText('✗ ' + selectedAnswer);

            this.scene.time.delayedCall(500, () => {
                bg.setFillStyle(0x4444ff);
                buttonText.setText(selectedAnswer);
                if (this.onIncorrect) this.onIncorrect();
            });
        }
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
    }
}
