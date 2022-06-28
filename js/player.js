/*jslint browser this */
/*global _, shipFactory, player, utils */

(function (global) {
    "use strict";

    var ship = { dom: { parentNode: { removeChild: function () { } } } };

    var player = {
        grid: [],
        tries: [],
        fleet: [],
        game: null,
        activeShip: 0,
        battlecount: 0,
        destroycount: 0,
        subcount: 0,
        smallcount: 0,
        init: function () {
            // créé la flotte
            this.fleet.push(shipFactory.build(shipFactory.TYPE_BATTLESHIP));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_DESTROYER));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SUBMARINE));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SMALL_SHIP));

            // créé les grilles
            this.grid = utils.createGrid(10, 10);
            this.tries = utils.createGrid(10, 10);
        },
        setGame: function (g) {
            this.game = g;
        },
        isShipOk: function (callback) {
            var i = 0;
            var j;
            // console.log(this.fleet);

            this.fleet.forEach(function (ship, i) {
                j = 0;
                while (j < ship.life) {
                    this.grid[i][j] = ship.getId();
                    j += 1;
                }
            }, this);

            setTimeout(function () {
                callback();
            }, 500);
        },
        play: function (col, line) {
            // appel la fonction fire du game, et lui passe une calback pour récupérer le résultat du tir
            if (this.tries[line][col] === 0) {
                const fire = new Audio("assets/shoot.mp3");
                fire.play();
                this.game.fire(this, col, line, _.bind(function (hasSucced) {
                    this.tries[line][col] = hasSucced;
                }, this));
            } else {
                const empty = new Audio("assets/empty.mp3");
                empty.play();
                var msg = "Vous ne pouvez pas tirer deux foix sur la même case !"
                utils.info(msg)
            }
        },
        // quand il est attaqué le joueur doit dire si il a un bateaux ou non à l'emplacement choisi par l'adversaire
        receiveAttack: function (col, line, callback) {
            var succeed = false;
            var shipId;
            var sunkedShip;

            if (this.grid[line][col] !== 0) {
                shipId = this.grid[line][col];
                succeed = true;
                this.grid[line][col] = 0;
            }

            if (shipId == 1) {
                sunkedShip = document.querySelector(".battleship");
                this.battlecount++;
            } else if (shipId == 2) {
                sunkedShip = document.querySelector(".destroyer");
                this.destroycount++;
            } else if (shipId == 3) {
                sunkedShip = document.querySelector(".submarine");
                this.subcount++;
            } else if (shipId == 4) {
                sunkedShip = document.querySelector(".small-ship");
                this.smallcount++;
            }

            if (this.battlecount == 5) {
                sunkedShip.classList.add("sunk");
                this.battlecount = 0;
            }
            if (this.destroycount == 5) {
                sunkedShip.classList.add("sunk");
                this.destroycount = 0;
            }
            if (this.subcount == 4) {
                sunkedShip.classList.add("sunk");
                this.subcount = 0;
            }
            if (this.smallcount == 3) {
                sunkedShip.classList.add("sunk");
                this.smallcount = 0;
            }

            callback.call(undefined, succeed);
        },
        setActiveShipPosition: function (x, y) {
            // positionement des bateux avec verification de sortie de grille
            var ship = this.fleet[this.activeShip];
            var bool = false;

            if (ship.dom.classList.item(2) == "rotate") {

                if (ship.getLife() == 5 && y > 1 && y < 8) {
                    if (this.grid[y - 2][x] == 0 && this.grid[y - 1][x] == 0 && this.grid[y][x] == 0 && this.grid[y + 1][x] == 0 && this.grid[y + 2][x] == 0) {
                        this.grid[y - 2][x] = ship.getId();
                        this.grid[y - 1][x] = ship.getId();
                        this.grid[y][x] = ship.getId();
                        this.grid[y + 1][x] = ship.getId();
                        this.grid[y + 2][x] = ship.getId();
                    }
                } else if (ship.getLife() == 4 && y > 0 && y < 8) {
                    console.log(y);
                    if (this.grid[y - 1][x] == 0 && this.grid[y][x] == 0 && this.grid[y + 1][x] == 0 && this.grid[y + 2][x] == 0) {
                        this.grid[y - 1][x] = ship.getId();
                        this.grid[y][x] = ship.getId();
                        this.grid[y + 1][x] = ship.getId();
                        this.grid[y + 2][x] = ship.getId();
                    }

                } else if (ship.getLife() == 3 && y > 0 && y < 9) {
                    if (this.grid[y - 1][x] == 0 && this.grid[y][x] == 0 && this.grid[y + 1][x] == 0) {
                        this.grid[y - 1][x] = ship.getId();
                        this.grid[y][x] = ship.getId();
                        this.grid[y + 1][x] = ship.getId();
                    }

                }

                if (ship.getLife() == 5) {
                    for (let i = 0; i < ship.getLife() + 1; i++) {
                        if (this.grid[i][x] != 0 &&
                            this.grid[i][x] == ship.getId() &&
                            this.grid[i][x] == this.grid[i + 1][x] &&
                            this.grid[i][x] == this.grid[i + 2][x] &&
                            this.grid[i][x] == this.grid[i + 3][x] &&
                            this.grid[i][x] == this.grid[i + 4][x]) {
                            bool = true;
                        }
                    }
                } else if (ship.getLife() == 4) {
                    if (y >= 0 && y < 7) {
                        for (let i = 0; i < 8; i++) {
                            if (this.grid[i][x] != 0 &&
                                this.grid[i][x] == ship.getId() &&
                                this.grid[i][x] == this.grid[i + 1][x] &&
                                this.grid[i][x] == this.grid[i + 2][x] &&
                                this.grid[i][x] == this.grid[i + 3][x]) {
                                bool = true;
                            }
                        }
                    } else {
                        for (let i = 0; i < 8; i++) {
                            if (this.grid[i][x] != 0 &&
                                this.grid[i][x] == ship.getId() &&
                                this.grid[i][x] == this.grid[i + 1][x] &&
                                this.grid[i][x] == this.grid[i + 2][x] &&
                                this.grid[i][x] == this.grid[i + 3][x]) {
                                bool = true;
                            }
                        }
                    }
                } else if (ship.getLife() == 3) {
                    for (let i = 0; i < 8; i++) {
                        console.log(this.grid[i][x]);
                        if (this.grid[i][x] != 0 &&
                            this.grid[i][x] == ship.getId() &&
                            this.grid[i][x] == this.grid[i + 1][x] &&
                            this.grid[i][x] == this.grid[i + 2][x]) {
                            bool = true;
                        }
                    }
                }

            } else {
                if (ship.getLife() == 5 && x > 1 && x < 8) {
                    if (this.grid[y][x - 2] == 0 && this.grid[y][x - 1] == 0 && this.grid[y][x] == 0 && this.grid[y][x + 1] == 0 && this.grid[y][x + 2] == 0) {
                        this.grid[y][x - 2] = ship.getId();
                        this.grid[y][x - 1] = ship.getId();
                        this.grid[y][x] = ship.getId();
                        this.grid[y][x + 1] = ship.getId();
                        this.grid[y][x + 2] = ship.getId();
                    }
                } else if (ship.getLife() == 4 && x > 1 && x < 9) {
                    if (this.grid[y][x - 2] == 0 && this.grid[y][x - 1] == 0 && this.grid[y][x] == 0 && this.grid[y][x + 1] == 0) {
                        this.grid[y][x - 2] = ship.getId();
                        this.grid[y][x - 1] = ship.getId();
                        this.grid[y][x] = ship.getId();
                        this.grid[y][x + 1] = ship.getId();
                    }

                } else if (ship.getLife() == 3 && x > 0 && x < 9) {
                    if (this.grid[y][x - 1] == 0 && this.grid[y][x] == 0 && this.grid[y][x + 1] == 0) {
                        this.grid[y][x - 1] = ship.getId();
                        this.grid[y][x] = ship.getId();
                        this.grid[y][x + 1] = ship.getId();
                    }

                }

                if (ship.getLife() == 5) {
                    for (let i = 0; i < ship.getLife() + 1; i++) {
                        if (this.grid[y][i] != 0 &&
                            this.grid[y][i] == ship.getId() &&
                            this.grid[y][i] == this.grid[y][i + 1] &&
                            this.grid[y][i] == this.grid[y][i + 2] &&
                            this.grid[y][i] == this.grid[y][i + 3] &&
                            this.grid[y][i] == this.grid[y][i + 4]) {
                            bool = true;
                        }
                    }
                } else if (ship.getLife() == 4) {
                    for (let i = 0; i < 8; i++) {
                        if (this.grid[y][i] != 0 &&
                            this.grid[y][i] == ship.getId() &&
                            this.grid[y][i] == this.grid[y][i + 1] &&
                            this.grid[y][i] == this.grid[y][i + 2] &&
                            this.grid[y][i] == this.grid[y][i + 3]) {
                            bool = true;
                        }
                    }
                } else if (ship.getLife() == 3) {
                    for (let i = 0; i < 9; i++) {
                        if (this.grid[y][i] != 0 &&
                            this.grid[y][i] == ship.getId() &&
                            this.grid[y][i] == this.grid[y][i + 1] &&
                            this.grid[y][i] == this.grid[y][i + 2]) {
                            bool = true;
                        }
                    }
                }
            }
            // console.log(this.grid);

            if (bool) {
                return true;
            }
        },
        clearPreview: function () {
            if (ship.dom.parentNode) {
                ship.dom.parentNode.removeChild(ship.dom);
            }
        },
        resetShipPlacement: function () {
            this.clearPreview();

            this.activeShip = 0;
            this.grid = utils.createGrid(10, 10);
        },
        activateNextShip: function () {
            if (this.activeShip < this.fleet.length - 1) {
                this.activeShip += 1;
                return true;
            } else {
                return false;
            }
        },
        renderTries: function (grid, e) {
            
            console.log(this.tries);
            // var gif = e.target;
            
            this.tries.forEach(function (row, rid) {
                row.forEach(function (val, col) {
                    var node = grid.querySelector(".row:nth-child(" + (rid + 1) + ") .cell:nth-child(" + (col + 1) + ")");
                    if (val === true) {
                        const myTimeout = setTimeout(function () {
                            var explode = '<img src="assets/explode.gif" alt="explode" style="width: 58px; height: 58px;">';
                            node.innerHTML = explode;
                        }, 1500);
                        setTimeout(function () {
                            node.innerHTML = "";
                            node.style.backgroundColor = "#e60019";
                            clearTimeout(myTimeout);
                        }, 3000);
                    } else if (val === false) {
                        // debugger;
                        const myTimeout = setTimeout(function () {
                            var fail = '<img src="assets/plouf.gif" alt="fail" style="width: 58px; height: 58px;">';
                            node.innerHTML = fail; 
                        }, 1500);
                        setTimeout(function () {
                            node.innerHTML = "";
                            node.style.backgroundColor = "#aeaeae";
                            clearTimeout(myTimeout);
                        }, 3000);
                    } else {

                    }
                });
            });
        },
        renderShips: function () {
        }
    };

    global.player = player;

}(this));