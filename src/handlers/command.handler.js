const db = require("../config/db");
const Queue = require("../utils/Queue");
const { startNewCommand, cancelCommand } = require("../middleware/commands");
const Users = require("../utils/Users");

var nCommand = 0;

function commandHandler(socket, io)
{
    socket.on("command", (msg) => {
        var availableCocktails = [];
        var isAlreadyCommand = false;
        let uuid = Users.getUuid(socket.id);

        console.log("socketid: " + socket.id, "args: " + msg);
        Queue.queue.forEach((item) => {
            if (item.uuid == uuid) {
                isAlreadyCommand = true;
            }
        });
        // if (Queue.queue[0] && Queue.queue[0].socket_id == socket.id) {
        //     socket.emit("ready");
        //     return;
        // }
        if (isAlreadyCommand) {
            socket.emit("unauthorized");
            return;
        }

        db.query("SELECT * FROM slots", (err, slots) => {
            if (err) {
                return;
            }
            db.query("SELECT * FROM cocktails", (err, cocktails) => {
                if (err) {
                    return;
                }
                cocktails.forEach((cocktail) => {
                    let isAvailable = true;

                    cocktail.recipe = JSON.parse(cocktail.recipe);
                    cocktail.recipe.forEach((drink) => {
                        let isInStock = false;

                        slots.forEach((slot) => {
                            if (slot.drink_id == drink.drink_id) {
                                isInStock = true;
                            }
                        });
                        if (!isInStock) {
                            isAvailable = false;
                        }
                    });
                    if (isAvailable) {
                        availableCocktails.push(cocktail);
                    }
                });
                var isAvailable = false;
                availableCocktails.forEach((cocktail) => {
                    if (cocktail.id == msg) {
                        isAvailable = true;
                    }
                });
                if (!isAvailable) {
                    console.log("Cocktail not available");
                    socket.emit("unavailable");
                    return;
                }
                console.log(`Cocktail ${msg} added to queue`);
                Queue.print();
                Queue.enqueue({
                    uuid: uuid,
                    command_id: nCommand++,
                    cocktail_id: msg,
                });
                socket.emit("command", nCommand);
                if (nCommand >= 255) {
                    nCommand = 0;
                }
                if (!Queue.isWorking) {
                    startNewCommand(Users.getUuid(socket.id), io);
                }
            });
        });
    });
}

module.exports = {
    commandHandler
};
