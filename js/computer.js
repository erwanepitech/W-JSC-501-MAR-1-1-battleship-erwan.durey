/*jslint browser this */
/*global _, player */

(function (global) {
    "use strict";

    var computer = _.assign({}, player, {
        grid: [],
        tries: [],
        fleet: [],
        game: null,
        count: 0,
        lastPos: [],
        state: 3,
        setGame: function (g) {
            this.game = g;
        },
        play: function (difficult) {
            var self = this;
            var x;
            var y;
            console.log("dificult = " + difficult);
            function getRandomY(mini = 0, maxi = 9) {
                mini = Math.ceil(mini);
                maxi = Math.floor(maxi);
                let result = Math.floor(Math.random() * (maxi - mini + 1)) + mini;
                return result;
            }
            function createArrayOfNumber(start, end) {
                let myArray = [];
                for (let i = start; i <= end; i++) {
                    myArray.push(i);
                }
                return myArray;
            }

            let numbersArray = createArrayOfNumber(0, 9);

            function generateY() {
                let randomIndex = getRandomY(0, numbersArray.length - 1);
                let randomNumber = numbersArray[randomIndex];
                numbersArray.splice(randomIndex, 1);
                return randomNumber;
            }
            function getRandomX(min = 0, max = 9) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            // x = getRandomX();
            // y = generateY();
            var timer = 2000;

            // EASY MODE
            if (difficult == 0) {
                x = getRandomX();
                y = generateY();
                if (self.tries[x][y] === 0) {
                    setTimeout(function () {
                        self.game.fire(this, x, y, function (hasSucced) {
                            self.tries[x][y] = hasSucced;
                            const fire = new Audio("assets/shoot.mp3");
                            fire.play();
                        });
                    }, timer);
                } else {
                    timer = 500
                    self.play(difficult);
                }

                //HARD MODE
            } else {
                
                if (self.state === 1) {

                    //si x != 0 et 9
                    if (self.lastPos[self.count - 1][0] !== 0 && self.lastPos[self.count - 1][0] !== 9) {
                        //si la case de droite est libre on incrémente X
                        if (self.tries[self.lastPos[self.count - 1][0] + 1][self.lastPos[self.count - 1][1]] === 0) {
                            x = self.lastPos[self.count - 1][0] + 1;
                            y = self.lastPos[self.count - 1][1];
                        //sinon, si la case de gauche est libre on désincrémente X
                        } else if (self.tries[self.lastPos[self.count - 1][0] - 1][self.lastPos[self.count - 1][1]] === 0) {
                            x = self.lastPos[self.count - 1][0] - 1;
                            y = self.lastPos[self.count - 1][1];
                        //si ni gauche ni droite dispo, on check au dessus et en dessous 
                        } else {
                            if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] - 1] === 0) {
                                x = self.lastPos[0][0];
                                y = self.lastPos[0][1] - 1;
                            } else  if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] + 1] === 0) {
                                x = self.lastPos[0][0];
                                y = self.lastPos[0][1] + 1;
                            //si Y != 0 et 9
                            } else if (self.lastPos[self.count - 1][1] !== 0 && self.lastPos[self.count - 1][1] !== 9) {
                                //si la case du dessus est libre on incrémente Y et on passe en state4
                                if (self.tries[self.lastPos[self.count - 1][0]][self.lastPos[self.count - 1][1] + 1] === 0) {
                                    x = self.lastPos[self.count - 1][0];
                                    y = self.lastPos[self.count - 1][1] + 1;
                                    self.state = 4;
                                //sinon, si la case du dessous est libre on désincrémente Y et on passe en state4
                                } else if (self.tries[self.lastPos[self.count - 1][0]][self.lastPos[self.count - 1][1] - 1] === 0) {
                                    x = self.lastPos[self.count - 1][0];
                                    y = self.lastPos[self.count - 1][1] - 1;
                                    self.state = 4;
                                    self.count = 0;
                                    self.lastPos = [];
                                //sinon on repart en random
                                } else {
                                    x = getRandomX();
                                    self.lastPos = []; 
                                    self.count = 0;
                                    self.state = 3;
                                    y = generateY();
                                }
                            //si Y = 0
                            } else if (self.lastPos[self.count - 1][1] === 0) {
                                //si la case du dessous est libre on désincrémente Y et on passe en state 4
                                if (self.tries[self.lastPos[self.count - 1][0]][self.lastPos[self.count - 1][1] - 1] === 0) {
                                    x = self.lastPos[self.count - 1][0];
                                    y = self.lastPos[self.count - 1][1] - 1;
                                    self.state = 4;
                                    self.count = 0;
                                    self.lastPos = [];
                                //sinon on repart en random
                                } else {
                                    x = getRandomX();
                                    self.lastPos = [];
                                    self.count = 0;
                                    self.state = 3;
                                    y = generateY(); 
                                }
                            //si Y = 9
                            } else if (self.lastPos[self.count - 1][1] === 0) {
                                //si la case du dessus est libre on incrémente Y et on passe en state4
                                if (self.tries[self.lastPos[self.count - 1][0]][self.lastPos[self.count - 1][1] + 1] === 0) {
                                    x = self.lastPos[self.count - 1][0];
                                    y = self.lastPos[self.count - 1][1] + 1;
                                    self.state = 4;
                                    self.count = 0;
                                    self.lastPos = [];
                                //sinon on repart en random
                                } else {
                                    x = getRandomX();
                                    self.lastPos = [];
                                    self.count = 0;
                                    self.state = 3;
                                    y = generateY(); 
                                }
                            } else {
                                x = getRandomX();
                                y = generateY();
                                self.lastPos = [];
                                self.count = 0;
                                self.state = 3;
                            }
                        }
                    //si x = 0
                    } else if (self.lastPos[self.count - 1][0] == 0) {
                        //si la case de droite est libre on incrémente X
                        if (self.tries[self.lastPos[self.count - 1][0] + 1][self.lastPos[self.count - 1][1]] === 0) {
                            x = self.lastPos[self.count - 1][0] + 1;
                            y = self.lastPos[self.count - 1][1];    
                        //si droite pas dispo, on check au dessus et en dessous 
                        } else {
                            if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] - 1] === 0) {
                                x = self.lastPos[0][0];
                                y = self.lastPos[0][1] - 1;
                            } else  if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] + 1] === 0) {
                                x = self.lastPos[0][0];
                                y = self.lastPos[0][1] + 1;
                            //si Y != 0 et 9
                            } else if (self.lastPos[self.count - 1][1] !== 0 && self.lastPos[self.count - 1][1] !== 9) {
                                //si la case du dessus est libre on incrémente Y et on passe en state4
                                if (self.tries[self.lastPos[self.count - 1][0]][self.lastPos[self.count - 1][1] + 1] === 0) {
                                    x = self.lastPos[self.count - 1][0];
                                    y = self.lastPos[self.count - 1][1] + 1;
                                    self.state = 4;
                                    self.count = 0;
                                    self.lastPos = [];
                                //sinon, si la case du dessous est libre on désincrémente Y et on passe en state4
                                } else if (self.tries[self.lastPos[self.count - 1][0]][self.lastPos[self.count - 1][1] - 1] === 0) {
                                    x = self.lastPos[self.count - 1][0];
                                    y = self.lastPos[self.count - 1][1] - 1;
                                    self.state = 4;
                                    self.count = 0;
                                    self.lastPos = [];
                                //sinon on repart en random
                                } else {
                                    x = getRandomX();
                                    self.lastPos = []; 
                                    self.count = 0;
                                    self.state = 3;
                                    y = generateY();
                                }
                            //si Y = 0
                            } else if (self.lastPos[self.count - 1][1] === 0) {
                                //si la case du dessous est libre on désincrémente Y et on passe en state 4
                                if (self.tries[self.lastPos[self.count - 1][0]][self.lastPos[self.count - 1][1] - 1] === 0) {
                                    x = self.lastPos[self.count - 1][0];
                                    y = self.lastPos[self.count - 1][1] - 1;
                                    self.state = 4;
                                    self.count = 0;
                                    self.lastPos = [];
                                //sinon on repart en random
                                } else {
                                    x = getRandomX();
                                    self.lastPos = [];
                                    self.count = 0;
                                    self.state = 3;
                                    y = generateY(); 
                                }
                            //si Y = 9
                            } else if (self.lastPos[self.count - 1][1] === 0) {
                                //si la case du dessus est libre on incrémente Y et on passe en state4
                                if (self.tries[self.lastPos[self.count - 1][0]][self.lastPos[self.count - 1][1] + 1] === 0) {
                                    x = self.lastPos[self.count - 1][0];
                                    y = self.lastPos[self.count - 1][1] + 1;
                                    self.state = 4;
                                    self.count = 0;
                                    self.lastPos = [];
                                //sinon on repart en random
                                } else {
                                    x = getRandomX();
                                    self.lastPos = [];
                                    self.count = 0;
                                    self.state = 3;
                                    y = generateY(); 
                                }
                            }
                        }

                    //si x = 9
                    } else if (self.lastPos[self.count - 1][0] == 9) {
                        //si la case de gauche est libre on incrémente
                        if (self.tries[self.lastPos[self.count - 1][0] - 1][self.lastPos[self.count - 1][1]] === 0) {
                            x = self.lastPos[self.count - 1][0] - 1;
                            y = self.lastPos[self.count - 1][1];
                        //si gauche pas dispo on check au dessus et en dessous
                        } else {
                            if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] - 1] === 0) {
                                x = self.lastPos[0][0];
                                y = self.lastPos[0][1] - 1;
                            } else  if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] + 1] === 0) {
                                x = self.lastPos[0][0];
                                y = self.lastPos[0][1] + 1;
                            //si Y != 0 et 9
                            } else if (self.lastPos[self.count - 1][1] !== 0 && self.lastPos[self.count - 1][1] !== 9) {
                                //si la case du dessus est libre on incrémente Y et on passe en state4
                                if (self.tries[self.lastPos[self.count - 1][0]][self.lastPos[self.count - 1][1] + 1] === 0) {
                                    x = self.lastPos[self.count - 1][0];
                                    y = self.lastPos[self.count - 1][1] + 1;
                                    self.state = 4;
                                    self.count = 0;
                                    self.lastPos = [];
                                //sinon, si la case du dessous est libre on désincrémente Y et on passe en state4
                                } else if (self.tries[self.lastPos[self.count - 1][0]][self.lastPos[self.count - 1][1] - 1] === 0) {
                                    x = self.lastPos[self.count - 1][0];
                                    y = self.lastPos[self.count - 1][1] - 1;
                                    self.state = 4;
                                    self.count = 0;
                                    self.lastPos = [];
                                //sinon on repart en random
                                } else {
                                    x = getRandomX();
                                    self.lastPos = []; 
                                    self.count = 0;
                                    self.state = 3;
                                    y = generateY();
                                }
                            //si Y = 0
                            } else if (self.lastPos[self.count - 1][1] === 0) {
                                //si la case du dessous est libre on désincrémente Y et on passe en state 4
                                if (self.tries[self.lastPos[self.count - 1][0]][self.lastPos[self.count - 1][1] - 1] === 0) {
                                    x = self.lastPos[self.count - 1][0];
                                    y = self.lastPos[self.count - 1][1] - 1;
                                    self.state = 4;
                                    self.count = 0;
                                    self.lastPos = [];
                                //sinon on repart en random
                                } else {
                                    x = getRandomX();
                                    self.lastPos = [];
                                    self.count = 0;
                                    self.state = 3;
                                    y = generateY(); 
                                }
                            //si Y = 9
                            } else if (self.lastPos[self.count - 1][1] === 0) {
                                //si la case du dessus est libre on incrémente Y et on passe en state4
                                if (self.tries[self.lastPos[self.count - 1][0]][self.lastPos[self.count - 1][1] + 1] === 0) {
                                    x = self.lastPos[self.count - 1][0];
                                    y = self.lastPos[self.count - 1][1] + 1;
                                    self.state = 4;
                                    self.count = 0;
                                    self.lastPos = [];
                                //sinon on repart en random
                                } else {
                                    x = getRandomX();
                                    self.lastPos = [];
                                    self.count = 0;
                                    self.state = 3;
                                    y = generateY(); 
                                }
                            }
                        }    
                    }

                // STATE 2
                } else if (self.state === 2) {

                    //si 1erx != de 0 et 9
                    if (self.lastPos[0][0] !== 0 && self.lastPos[0][0] !== 9) {
                        //si la case de droite est libre on la joue, puis on vide tableau + count pour repartir en last x+1
                        if (self.tries[self.lastPos[0][0] + 1][self.lastPos[0][1]] === 0) {
                            x = self.lastPos[0][0] + 1;
                            y = self.lastPos[0][1];
                            self.lastPos = [];
                            // self.count = 0;
                        //si la case de gauche est libre on la joue, puis on vide tableau + count pour repartir en last x-1
                        } else if (self.tries[self.lastPos[0][0] - 1][self.lastPos[0][1]] === 0) {
                            x = self.lastPos[0][0] - 1;
                            y = self.lastPos[0][1];
                            self.lastPos = [];
                            // self.count = 0;
                        //si ni gauche ni droite libre on repart en random
                        } else {
                            if (self.count <= 2) {
                                //si case au dessous de premier x libre on la joue et on passe en state4
                                if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] + 1] === 0) {
                                    if (self.lastPos[0][1] > 0) {
                                        var array = [self.lastPos[0][0], self.lastPos[0][1] - 1];
                                        self.lastPos = [];
                                        self.count  = 1;
                                        self.lastPos.push(array);
                                        x = self.lastPos[0][0];
                                        y = self.lastPos[0][1] + 1;
                                        self.state = 4;
                                    } else {
                                        // self.lastPos = [];
                                        x = self.lastPos[0][0];
                                        y = self.lastPos[0][1] + 1;
                                        self.state = 4;
                                    }
                                //si case au dessus de premier x libre on la joue et on passe en state4
                                } else if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] - 1] === 0) {
                                    if (self.lastPos[0][1] < 9) {
                                        var array = [self.lastPos[0][0], self.lastPos[0][1] + 1];
                                        self.lastPos = [];
                                        self.count  = 1;
                                        self.lastPos.push(array);
                                        x = self.lastPos[0][0];
                                        y = self.lastPos[0][1] - 1;
                                        self.state = 4;
                                    } else {
                                        // self.lastPos = [];
                                        x = self.lastPos[0][0];
                                        y = self.lastPos[0][1] - 1;
                                        self.state = 4;
                                    }
                                    // self.count = 0;
                                } else {
                                    x = getRandomX();
                                    y = generateY();
                                    self.lastPos = [];
                                    self.count = 0;
                                    self.state = 3;
                                }
                            } else {
                                x = getRandomX();
                                y = generateY();
                                self.lastPos = [];
                                self.count = 0;
                                self.state = 3;
                            }
                        }

                    //si 1erx = 0
                    } else if (self.lastPos[0][0] == 0) {
                        //si la case de droite est libre on la joue, puis on vide tableau + count pour repartir en last x+1
                        if (self.tries[self.lastPos[0][0] + 1][self.lastPos[0][1]] === 0) {
                            x = self.lastPos[0][0] + 1;
                            y = self.lastPos[0][1];
                            self.lastPos = [];
                            // self.count = 0;
                        //sinon coup random
                        } else {
                            if (self.count <= 2) {
                                //si case au dessous de premier x libre on la joue et on passe en state4
                                if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] + 1] === 0) {
                                    if (self.lastPos[0][1] > 0) {
                                        var array = [self.lastPos[0][0], self.lastPos[0][1] - 1];
                                        self.lastPos = [];
                                        self.count  = 1;
                                        self.lastPos.push(array);
                                        x = self.lastPos[0][0];
                                        y = self.lastPos[0][1] + 1;
                                        self.state = 4; 
                                    } else {
                                        // self.lastPos = [];
                                        x = self.lastPos[0][0];
                                        y = self.lastPos[0][1] + 1;
                                        self.state = 4;
                                    }
                                    // self.count = 0;
                                //si case au dessus de premier x libre on la joue et on passe en state4
                                } else if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] - 1] === 0) {
                                    if (self.lastPos[0][1] < 9) {
                                        var array = [self.lastPos[0][0], self.lastPos[0][1] + 1];
                                        self.lastPos = [];
                                        self.count  = 1;
                                        self.lastPos.push(array);
                                        x = self.lastPos[0][0];
                                        y = self.lastPos[0][1] - 1;
                                        self.state = 4;
                                    } else {
                                        // self.lastPos = [];
                                        x = self.lastPos[0][0];
                                        y = self.lastPos[0][1] - 1;
                                        self.state = 4;
                                    }
                                    // self.count = 0;
                                } else {
                                    x = getRandomX();
                                    y = generateY();
                                    self.lastPos = [];
                                    self.count = 0;
                                    self.state = 3;
                                }
                            } else {
                                x = getRandomX();
                                y = generateY();
                                self.lastPos = [];
                                self.count = 0;
                                self.state = 3;
                            }
                        }

                    //si 1erx = 9
                    } else if (self.lastPos[0][0] == 9) {
                        //si la case de gauche est libre on la joue, puis on vide tableau + count pour repartir en last x-1
                        if (self.tries[self.lastPos[0][0] - 1][self.lastPos[0][1]] === 0) {
                            x = self.lastPos[0][0] - 1;
                            y = self.lastPos[0][1];
                            self.lastPos = [];
                        //sinon coup random
                        } else {
                            if (self.count <= 2) {
                                //si case au dessous de premier x libre on la joue et on passe en state4
                                if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] + 1] === 0) {
                                    if (self.lastPos[0][1] > 0) {
                                        var array = [self.lastPos[0][0], self.lastPos[0][1] - 1];
                                        self.lastPos = [];
                                        self.count  = 1;
                                        self.lastPos.push(array);
                                        x = self.lastPos[0][0];
                                        y = self.lastPos[0][1] + 1;
                                        self.state = 4;
                                    } else {
                                        // self.lastPos = [];
                                        x = self.lastPos[0][0];
                                        y = self.lastPos[0][1] + 1;
                                        self.state = 4;
                                    }
                                //si case au dessus de premier x libre on la joue et on passe en state4
                                } else if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] - 1] === 0) {
                                    if (self.lastPos[0][1] < 9) {
                                        var array = [self.lastPos[0][0], self.lastPos[0][1] + 1];
                                        self.lastPos = [];
                                        self.count  = 1;
                                        self.lastPos.push(array);
                                        x = self.lastPos[0][0];
                                        y = self.lastPos[0][1] - 1;
                                        self.state = 4;
                                    } else {
                                        // self.lastPos = [];
                                        x = self.lastPos[0][0];
                                        y = self.lastPos[0][1] - 1;
                                        self.state = 4; 
                                    }
                                } else {
                                    x = getRandomX();
                                    y = generateY();
                                    self.lastPos = [];
                                    self.count = 0;
                                    self.state = 3;
                                }
                            } else {
                                x = getRandomX();
                                y = generateY();
                                self.lastPos = [];
                                self.count = 0;
                                self.state = 3;
                            }
                        }
                    }
                    
                //STATE 4 
                } else if (self.state === 4) {
                    //si Y != de 0 et 9
                    if (self.lastPos[0][1] !== 0 && self.lastPos[0][1] !== 9) {
                        //si la case de dessous est libre on la joue et on part en state5
                        if (self.tries[self.lastPos[self.count - 1][0]][self.lastPos[self.count - 1][1] + 1] === 0) {
                            x = self.lastPos[self.count - 1][0];
                            y = self.lastPos[self.count - 1][1] + 1;
                        //si la case de dessus est libre on la joue et on incrémente
                        } else if (self.tries[self.lastPos[self.count - 1][0]][self.lastPos[self.count - 1][1] - 1] === 0) {
                            x = self.lastPos[self.count - 1][0];
                            y = self.lastPos[self.count - 1][1] - 1;
                        //si ni dessus ni dessous libre on repart en random
                        } else if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] - 1] === 0) {
                            x = self.lastPos[0][0];
                            y = self.lastPos[0][1] - 1;
                        } else if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] + 1] === 0) {
                            x = self.lastPos[0][0];
                            y = self.lastPos[0][1] + 1;
                        } else {
                            x = getRandomX();
                            y = generateY();
                            self.lastPos = [];
                            self.count = 0;
                            self.state = 3;
                        }

                    //si Y = 0
                    } else if (self.lastPos[0][1] == 0) {
                        //si la case du dessus est libre on la joue et on part en state 5
                        if (self.tries[self.lastPos[self.count - 1][0]][self.lastPos[self.count - 1][1] - 1] === 0) {
                            x = self.lastPos[0][0];
                            y = self.lastPos[0][1] - 1;
                        } else if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] - 1] === 0) {
                            x = self.lastPos[0][0];
                            y = self.lastPos[0][1] - 1;
                        //sinon coup random
                        } else {
                            x = getRandomX();
                            y = generateY();
                            self.lastPos = [];
                            self.count = 0;
                            self.state = 3;
                        }

                    //si Y = 9
                    } else if (self.lastPos[0][1] == 9) {
                        //si la case du dessus est libre on la joue et on part en state 5
                        if (self.tries[self.lastPos[self.count - 1][0]][self.lastPos[self.count - 1][1] + 1] === 0) {
                            x = self.lastPos[0][0];
                            y = self.lastPos[0][1] + 1;
                        } else if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] + 1] === 0) {
                            x = self.lastPos[0][0];
                            y = self.lastPos[0][1] + 1;
                        //sinon coup random
                        } else {
                            x = getRandomX();
                            y = generateY();
                            self.lastPos = [];
                            self.count = 0;
                            self.state = 3;
                        }
                    }
                    
                //STATE 5 
                } else if (self.state === 5) {
                    //si 1erY != de 0 et 9
                    if (self.lastPos[0][1] !== 0 && self.lastPos[0][1] !== 9) {
                        //si la case de dessous est libre on la joue et on part en state5
                        if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] + 1] === 0) {
                            x = self.lastPos[0][0];
                            y = self.lastPos[0][1] + 1;
                            self.lastPos = [];
                            self.count = 0;
                        //si la case de dessus est libre on la joue et on part en state 5
                        } else if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] - 1] === 0) {
                            x = self.lastPos[0][0];
                            y = self.lastPos[0][1] - 1;
                            self.lastPos = [];
                            self.count = 0;
                        //si ni dessus ni dessous libre on repart en random
                        } else {
                            x = getRandomX();
                            y = generateY();
                            self.lastPos = [];
                            self.count = 0;
                            self.state = 3;
                        }

                    //si 1erY = 0
                    } else if (self.lastPos[0][1] == 0) {
                        //si la case du dessus est libre on la joue et on part en state 5
                        if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] - 1] === 0) {
                            x = self.lastPos[0][0];
                            y = self.lastPos[0][1] - 1;
                            self.lastPos = [];
                            self.count = 0;
                        //sinon coup random
                        } else {
                            x = getRandomX();
                            y = generateY();
                            self.lastPos = [];
                            self.count = 0;
                            self.state = 3;
                        }

                    //si 1erY = 9
                    } else if (self.lastPos[0][1] == 9) {
                        //si la case du dessus est libre on la joue et on part en state 5
                        if (self.tries[self.lastPos[0][0]][self.lastPos[0][1] + 1] === 0) {
                            x = self.lastPos[0][0];
                            y = self.lastPos[0][1] + 1;
                            self.lastPos = [];
                            self.count = 0;
                        //sinon coup random
                        } else {
                            x = getRandomX();
                            y = generateY();
                            self.lastPos = [];
                            self.count = 0;
                            self.state = 3;
                        }
                    }
                // STATE 3
                } else {
                    x = getRandomX();
                    y = generateY();
                    self.lastPos = [];
                    self.count = 0;
                    self.state = 3;
                }

                if (self.tries[x][y] === 0 ) {

                    setTimeout(function () {
                        self.game.fire(this, x, y, function (hasSucced) {
                            self.tries[x][y] = hasSucced;
                            const fire = new Audio("assets/shoot.mp3");
                            fire.play();
                            //si on touche
                            if (hasSucced) {
                                if (self.state === 3) {
                                    self.count++;
                                    var array = [x, y];
                                    self.lastPos.push(array);
                                    self.state = 1;
                                } else if (self.state === 2) {
                                    self.count++;
                                    var array = [x, y];
                                    self.lastPos.push(array);
                                    self.state = 2;
                                } else  if (self.state === 4) {
                                    self.count++;
                                    var array = [x, y];
                                    self.lastPos.push(array);
                                    self.state = 4;
                                } else if (self.state === 5) {
                                    self.count++;
                                    var array = [x, y];
                                    self.lastPos.push(array);
                                    self.state = 5;                                
                                } else {
                                    self.count++;
                                    var array = [x, y];
                                    self.lastPos.push(array);
                                    self.state = 1;
                                }
                            //si on rate
                            } else {
                                if (self.state === 1) {
                                    self.count++;
                                    var array = [x, y];
                                    self.lastPos.push(array);
                                    self.state = 2;
                                } else if (self.state === 2) {
                                    if (self.count <= 2) {
                                        self.count = 0;
                                        self.lastPos = [];
                                        self.count++;
                                        var array = [x + 1, y];
                                        self.lastPos.push(array);
                                        self.state = 4;  
                                    } else {
                                        self.count = 0;
                                        self.lastPos = [];
                                        self.state = 3;
                                    }
                                } else if (self.state === 4) {
                                    self.count++;
                                    var array = [x, y];
                                    self.lastPos.push(array);
                                    self.state = 5;
                                } else {
                                    self.count = 0;
                                    self.lastPos = [];
                                    self.state = 3;
                                }
                            }
                            console.log(self.lastPos);
                            console.log("count = " + self.count);
                            console.log("state = " + self.state);
                        });
                    }, timer);
                } else {
                    timer = 500
                    self.play(difficult);
                }
            }
        },
        isShipOk: function (callback) {

            function getRandomY(mini = 0, maxi = 9) {
                mini = Math.ceil(mini);
                maxi = Math.floor(maxi);
                let result = Math.floor(Math.random() * (maxi - mini + 1)) + mini;
                return result;
            }
            function createArrayOfNumber(start, end) {
                let myArray = [];
                for (let i = start; i <= end; i++) {
                    myArray.push(i);
                }
                return myArray;
            }
            let numbersArray = createArrayOfNumber(0, 9);
            function generateY() {
                let randomIndex = getRandomY(0, numbersArray.length - 1);
                let randomNumber = numbersArray[randomIndex];
                numbersArray.splice(randomIndex, 1);
                return randomNumber;
            }

            this.fleet.forEach(function (ship) {
                var min;
                var max;

                if (ship.dom.classList.item(2) == "rotate") {
                    if (ship.life == 5) {
                        min = 2;
                        max = 7;
                    } else if (ship.life == 4) {
                        min = 1;
                        max = 7;
                    } else if (ship.life == 3) {
                        min = 1;
                        max = 8;
                    }
                } else {
                    if (ship.life == 5) {
                        min = 2;
                        max = 7;
                    } else if (ship.life == 4) {
                        min = 2;
                        max = 8;
                    } else if (ship.life == 3) {
                        min = 1;
                        max = 8;
                    }
                }

                function getRandomX(min, max) {
                    min = Math.ceil(min);
                    max = Math.floor(max);
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }

                var bool = false;
                var x = getRandomX(min, max);
                var y = generateY(min, max);

                if (ship.dom.classList.item(2) == "rotate") {

                    if (ship.life == 5 && y > 1 && y < 8) {
                        if (this.grid[y - 2][x] == 0 && this.grid[y - 1][x] == 0 && this.grid[y][x] == 0 && this.grid[y + 1][x] == 0 && this.grid[y + 2][x] == 0) {
                            this.grid[y - 2][x] = ship.getId();
                            this.grid[y - 1][x] = ship.getId();
                            this.grid[y][x] = ship.getId();
                            this.grid[y + 1][x] = ship.getId();
                            this.grid[y + 2][x] = ship.getId();
                        }
                    } else if (ship.life == 4 && y > 0 && y < 8) {
                        if (this.grid[y - 2][x] == 0 && this.grid[y - 1][x] == 0 && this.grid[y][x] == 0 && this.grid[y + 1][x] == 0) {
                            this.grid[y - 1][x] = ship.getId();
                            this.grid[y][x] = ship.getId();
                            this.grid[y + 1][x] = ship.getId();
                            this.grid[y + 2][x] = ship.getId();
                        }

                    } else if (ship.life == 3 && y > 0 && y < 9) {
                        if (this.grid[y - 1][x] == 0 && this.grid[y][x] == 0 && this.grid[y + 1][x] == 0) {
                            this.grid[y - 1][x] = ship.getId();
                            this.grid[y][x] = ship.getId();
                            this.grid[y + 1][x] = ship.getId();
                        }

                    }

                    if (ship.life == 5) {
                        for (let i = 0; i < ship.life + 1; i++) {
                            if (this.grid[i][x] != 0 &&
                                this.grid[i][x] == ship.getId() &&
                                this.grid[i][x] == this.grid[i + 1][x] &&
                                this.grid[i][x] == this.grid[i + 2][x] &&
                                this.grid[i][x] == this.grid[i + 3][x] &&
                                this.grid[i][x] == this.grid[i + 4][x]) {
                                bool = true;
                            }
                        }
                    } else if (ship.life == 4) {
                        for (let i = 0; i < 8; i++) {
                            if (this.grid[i][x] != 0 &&
                                this.grid[i][x] == ship.getId() &&
                                this.grid[i][x] == this.grid[i - 1][x] &&
                                this.grid[i][x] == this.grid[i + 1][x] &&
                                this.grid[i][x] == this.grid[i + 2][x]) {
                                bool = true;
                            }
                        }
                    } else if (ship.life == 3) {
                        for (let i = 0; i < 9; i++) {
                            if (this.grid[i][x] != 0 &&
                                this.grid[i][x] == ship.getId() &&
                                this.grid[i][x] == this.grid[i - 1][x] &&
                                this.grid[i][x] == this.grid[i + 1][x]) {
                                bool = true;
                            }
                        }
                    }

                } else {
                    if (ship.life == 5 && x > 1 && x < 8) {
                        if (this.grid[y][x - 2] == 0 && this.grid[y][x - 1] == 0 && this.grid[y][x] == 0 && this.grid[y][x + 1] == 0 && this.grid[y][x + 2] == 0) {
                            this.grid[y][x - 2] = ship.getId();
                            this.grid[y][x - 1] = ship.getId();
                            this.grid[y][x] = ship.getId();
                            this.grid[y][x + 1] = ship.getId();
                            this.grid[y][x + 2] = ship.getId();
                        }
                    } else if (ship.life == 4 && x > 1 && x < 9) {
                        if (this.grid[y][x - 2] == 0 && this.grid[y][x - 1] == 0 && this.grid[y][x] == 0 && this.grid[y][x + 1] == 0) {
                            this.grid[y][x - 2] = ship.getId();
                            this.grid[y][x - 1] = ship.getId();
                            this.grid[y][x] = ship.getId();
                            this.grid[y][x + 1] = ship.getId();
                        }

                    } else if (ship.life == 3 && x > 0 && x < 9) {
                        if (this.grid[y][x - 1] == 0 && this.grid[y][x] == 0 && this.grid[y][x + 1] == 0) {
                            this.grid[y][x - 1] = ship.getId();
                            this.grid[y][x] = ship.getId();
                            this.grid[y][x + 1] = ship.getId();
                        }

                    }

                    if (ship.life == 5) {
                        for (let i = 0; i < ship.life + 1; i++) {
                            if (this.grid[y][i] != 0 &&
                                this.grid[y][i] == ship.getId() &&
                                this.grid[y][i] == this.grid[y][i + 1] &&
                                this.grid[y][i] == this.grid[y][i + 2] &&
                                this.grid[y][i] == this.grid[y][i + 3] &&
                                this.grid[y][i] == this.grid[y][i + 4]) {
                                bool = true;
                            }
                        }
                    } else if (ship.life == 4) {
                        for (let i = 0; i < 8; i++) {
                            if (this.grid[y][i] != 0 &&
                                this.grid[y][i] == ship.getId() &&
                                this.grid[y][i] == this.grid[y][i + 1] &&
                                this.grid[y][i] == this.grid[y][i + 2] &&
                                this.grid[y][i] == this.grid[y][i + 3]) {
                                bool = true;
                            }
                        }
                    } else if (ship.life == 3) {
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

            }, this);

            setTimeout(function () {
                callback();
            }, 500);
        },

        renderTries: function (grid) {
            this.tries.forEach(function (row, line) {
                row.forEach(function (val, col) {
                    var node = grid.querySelector(".row:nth-child(" + (col + 1) + ") .cell:nth-child(" + (line + 1) + ")");
                    if (val === true) {
                        setTimeout(function () {
                            // node.style.backgroundColor = "#e60019";
                            node.style.backgroundColor = "#EF6330";
                        }, 1500);
                    } else if (val === false) {
                        setTimeout(function () {
                            node.style.backgroundColor = "#aeaeae";
                        }, 1500)
                    }
                });
            });
        }
    });

    global.computer = computer;

}(this));