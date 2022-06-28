/*jslint browser this */
/*global _, player, computer, utils */

(function () {
    "use strict";

    var game = {
        PHASE_GAME_OVER: "PHASE_GAME_OVER",
        PHASE_INIT_OPPONENT: "PHASE_INIT_OPPONENT",
        PHASE_INIT_PLAYER: "PHASE_INIT_PLAYER",
        PHASE_PLAY_OPPONENT: "PHASE_PLAY_OPPONENT",
        PHASE_PLAY_PLAYER: "PHASE_PLAY_PLAYER",
        PHASE_WAITING: "waiting",

        currentPhase: "",
        phaseOrder: [],
        // garde une référence vers l'indice du tableau phaseOrder qui correspond à la phase de jeu pour le joueur humain
        playerTurnPhaseIndex: 2,

        // garde une référence vers les noeuds correspondant du dom
        grid: null,
        miniGrid: null,

        // liste des joueurs
        players: [],

        // l'interface utilisateur doit-elle être bloquée ?
        waiting: false,

        countOver1: 0,
        countOver2: 0,

        // lancement du jeu
        init: function (currentPlayer, dificult) {
            this.dificult = dificult;
            // initialisation
            this.grid = document.querySelector(".board .main-grid");
            this.miniGrid = document.querySelector(".left .mini-grid");

            // défini l'ordre des phase de jeu
            if (currentPlayer == 1) {
                this.phaseOrder = [
                    this.PHASE_INIT_PLAYER,
                    this.PHASE_INIT_OPPONENT,
                    this.PHASE_PLAY_PLAYER,
                    this.PHASE_PLAY_OPPONENT,
                    this.PHASE_GAME_OVER
                ];
            } else {
                this.phaseOrder = [
                    this.PHASE_INIT_OPPONENT,
                    this.PHASE_INIT_PLAYER,
                    this.PHASE_PLAY_OPPONENT,
                    this.PHASE_PLAY_PLAYER,
                    this.PHASE_GAME_OVER
                ];
            }
            this.playerTurnPhaseIndex = 1;

            // initialise les joueurs
            this.setupPlayers();

            // ajoute les écouteur d'événement sur la grille
            this.addListeners();

            // c'est parti !
            this.goNextPhase();
        },
        setupPlayers: function () {
            // donne aux objets player et computer une réference vers l'objet game
            player.setGame(this);
            computer.setGame(this);

            // todo : implémenter le jeu en réseaux
            this.players = [player, computer];

            this.players[0].init();
            this.players[1].init();
        },
        goNextPhase: function () {
            // récupération du numéro d'index de la phase courante
            var ci = this.phaseOrder.indexOf(this.currentPhase);
            var self = this;
            if (ci !== this.phaseOrder.length - 1) {
                this.currentPhase = this.phaseOrder[ci + 1];
            } else {
                this.currentPhase = this.phaseOrder[0];
            }

            switch (this.currentPhase) {
                case this.PHASE_GAME_OVER:
                    // detection de la fin de partie
                    if (!this.gameIsOver()) {
                        // le jeu n'est pas terminé on recommence un tour de jeu
                        this.currentPhase = this.phaseOrder[
                            this.playerTurnPhaseIndex
                        ];
                        self.goNextPhase();
                    } else {
                        this.currentPhase = this.phaseOrder[4];
                        this.wait();
                        if (this.countOver1 >= 17) {
                            utils.info("Partie terminée l'IA a gagné !");
                        } else if (this.countOver2 >= 17) {
                            utils.info("Partie terminée, Player a gagné !")
                        }
                        break;
                    }
                    break;
                case this.PHASE_INIT_PLAYER:
                    utils.info("Placez vos bateaux");
                    break;
                case this.PHASE_INIT_OPPONENT:
                    this.wait();
                    utils.info("En attente de votre adversaire");
                    this.players[1].isShipOk(function () {
                        self.stopWaiting();
                        self.goNextPhase();
                    });
                    break;
                case this.PHASE_PLAY_PLAYER:
                    if (!this.gameIsOver()) {
                        setTimeout(function () {
                            utils.info("A vous de jouer, choisissez une case !");
                        }, 1500);
                    } else {
                        this.currentPhase = this.phaseOrder[
                            4
                        ];
                        console.log(this.currentPhase);
                        self.goNextPhase();
                    }
                    // console.log(this.currentPhase);
                    break;

                case this.PHASE_PLAY_OPPONENT:
                    if (!this.gameIsOver()) {
                        setTimeout(function () {
                            utils.info("A votre adversaire de jouer...");
                        }, 1500);
                        this.players[1].play();
                    } else {
                        self.goNextPhase();
                    }
                    break;
            }
        },
        gameIsOver: function () {  

            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    if (computer.tries[i][j] === true) {
                        this.countOver1 += 1;
                    } 
                    if (player.tries[i][j] === true) {
                        this.countOver2 += 1;
                    } 
                }
            }
            if (this.countOver1 >= 17) { 
                return true;
            } else if (this.countOver2 >= 17) {
                return true;
            } else {
                this.countOver1 = 0;
                this.countOver2 = 0;
                return false;
            }
            
        },
        getPhase: function () {
            if (this.waiting) {
                return this.PHASE_WAITING;
            }
            return this.currentPhase;
        },
        // met le jeu en mode "attente" (les actions joueurs ne doivent pas être pris en compte si le jeu est dans ce mode)
        wait: function () {
            this.waiting = true;
        },
        // met fin au mode mode "attente"
        stopWaiting: function () {
            this.waiting = false;
        },
        addListeners: function () {
            // on ajoute des acouteur uniquement sur la grid (délégation d'événement)
            this.grid.addEventListener(
                "mousemove", _.bind(this.handleMouseMove, this)
            );
            this.grid.addEventListener(
                "click", _.bind(this.handleClick, this)
            );
            this.grid.addEventListener(
                "contextmenu", _.bind(this.handleContext, this)
            );
            this.grid.addEventListener(
                "click", _.bind(this.handleShoot, this)
            );
        },
        handleMouseMove: function (e) {
            if (this.currentPhase === this.PHASE_INIT_PLAYER) {
                // on est dans la phase de placement des bateau
                var ship = this.players[0].fleet[this.players[0].activeShip];
                if (this.getPhase() === this.PHASE_INIT_PLAYER && e.target.classList.contains("cell")) {
                    // si on a pas encore affiché (ajouté aux DOM) ce bateau
                    if (!ship.dom.parentNode) {
                        this.grid.appendChild(ship.dom);
                        // passage en arrière plan pour ne pas empêcher la capture des événements sur les cellules de la grille
                        ship.dom.style.zIndex = -1;
                    }
                    // décalage visuelle, le point d'ancrage du curseur est au milieu du bateau
                    ship.dom.style.top = (utils.eq(e.target.parentNode)) * utils.CELL_SIZE - (600 + this.players[0].activeShip * 60) + "px";
                    ship.dom.style.left = utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE + "px";
                    if (ship.dom.classList.item(1) == 3 && ship.dom.classList.item(2) == "rotate") {
                        ship.dom.style.top = ((utils.eq(e.target.parentNode)) * utils.CELL_SIZE - (600 + this.players[0].activeShip * 60) + 30) + "px";
                        ship.dom.style.left = (utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE) + 30 + "px";
                    }
                }
            }
        },
        handleClick: function (e) {
            // self garde une référence vers "this" en cas de changement de scope
            var self = this;
            // console.log(e);
            // si on a cliqué sur une cellule (délégation d'événement)
            if (e.target.classList.contains("cell")) {
                // si on est dans la phase de placement des bateau
                if (this.getPhase() === this.PHASE_INIT_PLAYER) {
                    // on enregistre la position du bateau, si cela se passe bien (la fonction renvoie true) on continue
                    if (this.players[0].setActiveShipPosition(utils.eq(e.target), utils.eq(e.target.parentNode))) {
                        // et on passe au bateau suivant (si il n'y en plus la fonction retournera false)
                        if (!this.players[0].activateNextShip()) {
                            this.wait();
                            utils.confirm("Confirmez le placement ?", function () {
                                // si le placement est confirmé
                                self.stopWaiting();
                                self.renderMiniMap();
                                self.players[0].clearPreview();
                                self.goNextPhase();
                            }, function () {
                                self.stopWaiting();
                                // sinon, on efface les bateaux (les positions enregistrées), et on recommence
                                self.players[0].resetShipPlacement();
                            });
                        }
                    }
                    // si on est dans la phase de jeu (du joueur humain)
                } else if (this.getPhase() === this.PHASE_PLAY_PLAYER) {
                    this.players[0].play(utils.eq(e.target), utils.eq(e.target.parentNode));
                }
            }
        },
        handleContext: function (e) {
            e.preventDefault();
            if (this.currentPhase === this.PHASE_INIT_PLAYER) {
                var ship = this.players[0].fleet[this.players[0].activeShip];
                if (ship.dom.classList.item(2) == "rotate") {
                    ship.dom.classList.remove("rotate");
                } else {
                    ship.dom.classList.add("rotate");
                }
                ship.dom.style.top = (utils.eq(e.target.parentNode)) * utils.CELL_SIZE - (600 + this.players[0].activeShip * 60) + "px";
                ship.dom.style.left = utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE + "px";
                if (ship.dom.classList.item(1) == 3 && ship.dom.classList.item(2) == "rotate") {
                    ship.dom.style.top = ((utils.eq(e.target.parentNode)) * utils.CELL_SIZE - (600 + this.players[0].activeShip * 60) + 30) + "px";
                    ship.dom.style.left = (utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE) + 30 + "px";
                }
            }
        },
        handleShoot: function (e) {
            var self = this;
            if (self.currentPhase === self.PHASE_PLAY_PLAYER) {
                self.renderMap(e)
            }
        },
        // fonction utlisée par les objets représentant les joueurs (ordinateur ou non)
        // pour placer un tir et obtenir de l'adversaire l'information de réusssite ou non du tir
        fire: function (from, line, col, callback) {
            var self = this;
            var msg = "";

            // determine qui est l'attaquant et qui est attaqué
            var target = (this.players.indexOf(from) === 0
                ? this.players[1]
                : this.players[0]);

            if (this.currentPhase === this.PHASE_PLAY_OPPONENT) {
                msg += "Votre adversaire vous a... ";
            }

            this.wait();
            // on demande à l'attaqué si il a un bateaux à la position visée
            // le résultat devra être passé en paramètre à la fonction de callback (3e paramètre)
            target.receiveAttack(line, col, function (hasSucceed) {
                if (hasSucceed) {
                    msg += "Touché !";
                    const hited = new Audio("assets/hit.wav");
                    setTimeout(function () {
                        hited.play();
                        utils.info(msg);
                    }, 1500);
                } else if (hasSucceed == false) {
                    msg += "Manqué...";
                    const splashed = new Audio("assets/splash.wav");
                    setTimeout(function () {
                        splashed.play();
                        utils.info(msg);

                    }, 1500);
                }

                // on invoque la fonction callback (4e paramètre passé à la méthode fire)
                // pour transmettre à l'attaquant le résultat de l'attaque
                callback(hasSucceed);
                if (self.currentPhase === self.PHASE_PLAY_OPPONENT) {
                    self.renderMap();
                }
                // on fait une petite pause avant de continuer...
                // histoire de laisser le temps au joueur de lire les message affiché
                setTimeout(function () {
                    self.stopWaiting();
                    self.goNextPhase();
                }, 1500);
            });

        },
        renderMap: function (e) {
            if (this.currentPhase === this.PHASE_PLAY_PLAYER) {
                this.players[0].renderTries(this.grid, e);
            } else {
                this.players[1].renderTries(this.miniGrid);
            }
        },
        renderMiniMap: function () {
            var div = document.getElementsByClassName("div_ship");
            var array = [];
            for (var i = div.length >>> 0; i--;) {
                array[i] = div[i];
            }
            array.forEach(element => {
                this.miniGrid.appendChild(element);
            });
        },
    };

    // // point d'entrée
    (function chosePlayer() {
        var btn = document.getElementById("apply")
        var chose = document.querySelector("#player")
        var dificult = document.querySelector("#dificult")
        var setiings = document.querySelector(".settings")
        btn.addEventListener("click", function () {
            if (chose.value == 0) {
                if (dificult.value == 0) {
                    game.init(1, 0);
                } else {
                    game.init(1, 1);
                }
            } else if (chose.value == 1) {
                if (dificult.value == 0) {
                    game.init(2, 0);
                } else {
                    game.init(2, 1);
                }
            } else {
                function getRandomX(min = 0, max = 1) {
                    min = Math.ceil(min);
                    max = Math.floor(max);
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
                if (dificult.value == 0) {
                    game.init(getRandomX(), 0);
                } else {
                    game.init(getRandomX(), 1);
                }
            }
            setiings.hidden = true
        })
    })()

    // // point d'entrée
    // document.addEventListener("DOMContentLoaded", function () {
    //     game.init();
    // });

}());