const Queue = require("../utils/Queue");
const db = require("../config/db");
const Pumps = require("./initGpio");
const Users = require("../utils/Users");
const { cancelCommand } = require("../middleware/commands");

const prepareCocktail = (index, recipe) => {
    return new Promise((resolve) => {
        if (index < recipe.length) {
            db.query(
                "SELECT * FROM slots WHERE drink_id = ?",
                [recipe[index].drink_id],
                (err, slots) => {
                    if (err) {
                        return;
                    }
                    console.log("Slot: " + slots[0]);
                    Pumps[slots[0].id - 1].writeSync(1);
                    setTimeout(() => {
                        Pumps[slots[0].id - 1].writeSync(0);
                        return resolve(prepareCocktail(++index, recipe));
                    }, recipe[index].qty);
                }
            );
        } else return resolve();
    });
};

function launchPreparation(socket, io) {
    console.log("socketID: " + socket.id)
    console.log("UUID: " + Users.getUuid(socket.id));
    if (Queue.queue[0].uuid != Users.getUuid(socket.id) || !Queue.waitingCup) {
        socket.emit("unauthorized");
        return;
    }
    Queue.waitingCup = false;
    socket.emit("preparing");
    db.query(
        "SELECT * FROM cocktails WHERE id = ?",
        [Queue.queue[0].cocktail_id],
        (err, cocktails) => {
            if (err) {
                return;
            }
            var cocktail = cocktails[0];
            var recipe = JSON.parse(JSON.parse(cocktail.recipe));
            console.log(recipe)
            prepareCocktail(0, recipe).then(() => {
                console.log("Preparation finished");
                socket.emit("finished");
                Queue.waitRemovingCup = true;
            });
            console.log(cocktail);
        }
    );
}

module.exports = launchPreparation;
