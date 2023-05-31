const Queue = require("../utils/Queue");

function cupRemoved() {
    var socket = this;
    var uuid = Users.getUuid(socket.id);

    if (
        (Queue.size() > 0 && Queue.queue[0].uuid != uuid) ||
        !Queue.waitRemovingCup
    ) {
        socket.emit("unauthorized");
        return;
    }
    Queue.waitRemovingCup = false;
    console.log("Cup removed");
    socket.emit("finished");
    Queue.dequeue();
    if (Queue.queue.length > 0) {
        Queue.waitingCup = true;
        socket.broadcast.to(Users.getSocketId(Queue.queue[0].uuid)).emit("ready");
    } else {
        Queue.isWorking = false;
    }
}

module.exports = cupRemoved;
