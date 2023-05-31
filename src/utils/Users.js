class Users {
    static list = [];

    static add(user) {
        Users.list.push(user);
    }

    static remove(user) {
        Users.list = Users.list.filter((u) => u.uuid != user.uuid);
    }

    static get(socket_id) {
        return Users.list.find((u) => u.socket_id == socket_id);
    }

    static getByUuid(uuid) {
        return Users.list.find((u) => u.uuid == uuid);
    }

    static getBySocketId(socket_id) {
        return Users.list.find((u) => u.socket_id == socket_id);
    }

    static print() {
        console.log(Users.list);
    }

    static size() {
        return Users.list.length;
    }

    static isEmpty() {
        return Users.size() === 0;
    }

    static clear() {
        Users.list = [];
    }

    static getUuid(socket_id) {
        return Users.list.find((u) => u.socket_id == socket_id).uuid;
    }

    static getSocketId(uuid) {
        return Users.list.find((u) => u.uuid == uuid).socket_id;
    }

    static getSocketIds() {
        return Users.list.map((u) => u.socket_id);
    }

    static getUuids() {
        return Users.list.map((u) => u.uuid);
    }
}

module.exports = Users
