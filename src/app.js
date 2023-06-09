const express = require("express"); //requires express module
const socket = require("socket.io"); //requires socket.io module
const fileUpload = require('express-fileupload');
const app = express();
var PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const mdns = require('mdns');
const Gpio = require('onoff').Gpio;
const {
    v4: uuidv4,
  } = require('uuid');


const { initSlots } = require("./middleware/init");
const { commandHandler } = require("./handlers/command.handler");
const launchPreparation = require("./bartender/launchPreparation");
const cupRemoved = require("./handlers/cupRemoved.handler");

const server = app.listen(PORT); //hosts server on localhost:3000
server.maxConnections = 20;
const io = socket(server);

const router = require("./routes");
const Queue = require("./utils/Queue");
const Users = require("./utils/Users");
const { startNewCommand, cancelCommand } = require("./middleware/commands");

// Used to help applications to auto-discover this server
const ad = mdns.createAdvertisement(mdns.tcp('http'), 3000, {
    name: 'circlebar'
});

// Start the advertisement
ad.start();

initSlots();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(fileUpload());

app.use("/", router);

let glassInput = new Gpio(18, 'in', 'both')
let glassValue = glassInput.readSync();

glassInput.watch(function (err, value) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Glass: " + value);
    glassValue = value;
    io.sockets.emit("glass", value);
    
    console.log(value, Queue.isWorking, Queue.waitRemovingCup)
    if (value == 0 && Queue.isWorking && Queue.waitRemovingCup)
        cancelCommand(0, io);
});

console.log("Server is running");

io.sockets.on("connection", (socket) => {
    console.log("New socket connection: " + socket.id);

    socket.on("addr", (data) => {
        console.log("addr: " + data);
        if (data == null) {
            console.log("Address empty")
            let newUuid = uuidv4();

            Users.add({ uuid: newUuid, socket_id: socket.id })
            Users.print()
            socket.emit("setAddr", newUuid);
        } else {
            console.log("Address not empty")
            let user = Users.getByUuid(data);
            console.log(user)

            console.log(data);
            if (user != null) {
                //Users.remove(user);
                //user.socket_id = socket.id;
                //Users.add(user);
                //console.log("Expected: " + socket.id, "Got: " + Users.getSocketId(data))
            } else {
                Users.add({ uuid: data, socket_id: socket.id });
            }
        }
    });

    commandHandler(socket, io);
    socket.on("ready", () => { launchPreparation(socket, io) });
    socket.on("cancel", () => {
        let uuid = Users.getUuid(socket.id);

        Queue.queue.forEach((item, index) => {
            if (item.uuid == uuid) {
                cancelCommand(index, io);
            }
        });
    });

    socket.on("glass", () => {
        socket.emit("glass", glassValue);
    })

    socket.on("disconnect", () => {
        console.log("User disconnected: " + socket.id);
        let user = Users.getBySocketId(socket.id);

        if (user) {
            let uuid = user.uuid;

            Queue.queue.forEach((item, index) => {
                if (item.uuid == uuid) {
                    cancelCommand(index, io);
                }
            });
        }
    });

    socket.emit("addr");
});

// socket.broadcast.to(socketid).emit("command"); to send to an individual client
