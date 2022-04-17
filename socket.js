const { Server } = require("socket.io");

class Socket {
  constructor() {}

  setServer(server) {
    this.io = new Server(server);
    this.hasName = {};
    this.io.on("connection", (socket) => {
      const username = socket.handshake.auth.username;
      this.hasName[username] = socket.id;
      console.log("this.hasName", this.hasName);
    });
  }

  getInstance() {
    return this.io;
  }
}

socketInstance = new Socket();

module.exports = socketInstance;
