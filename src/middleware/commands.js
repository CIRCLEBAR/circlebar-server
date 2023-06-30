const Queue = require("../utils/Queue");
const Users = require("../utils/Users");

function startNewCommand(uuid, io) {
    Queue.isWorking = true;
    Queue.waitingCup = true;
    console.log("Launching preparation...");
    let socketID = Users.getSocketId(uuid);
    console.log(socketID)
    let socket = io.sockets.sockets.get(socketID);
    socket.emit("ready");
    Queue.waitRemovingCup = false;
}

function cancelCommand(index, io) {
    Queue.queue.splice(index, 1);
    console.log("Command " + index + " cancelled.");
    if (index == 0) {
        Queue.isWorking = false;
        Queue.waitingCup = false;
        Queue.waitRemovingCup = true;
    }
    if (index == 0 && Queue.size() > 0) {
        startNewCommand(Queue.queue[0].uuid, io);
    }
}

module.exports = {
    startNewCommand,
    cancelCommand,
};
