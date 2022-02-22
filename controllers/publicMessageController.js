class PublicMessageController {
  static createNewPublicMessage(req, res) {
    console.log(11);
    const io = req.app.get("socketio");
    console.log(io);
    io.sockets.emit("publicMessage", { content: "hello" });
    res.status(201).json({});
  }
}

module.exports = PublicMessageController;
