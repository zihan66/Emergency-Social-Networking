const moment = require("moment");
const Event = require("../models/event");
const socket = require("../socket");
class EventController {
  static async createNewEvent(req, res) {
    try {
      const { title, location, host, type, details } = req.body;
      const currentEvent = {
        title,
        startTime: moment().format(),
        location,
        host,
        type,
        details,
        participants: [host],
      };
      const io = socket.getInstance();
      await Event.create(currentEvent, (err, event) => {
        io.sockets.emit("newEvent", event);
      });
      res.location("/publicEvent");
      res.status(201).json();
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async unjoin(req, res) {
    try {
      const username = req.query.username;
      const eventId = req.params.eventId;
      const event = await Event.findOne({ _id: eventId });
      if (!event) {
        res.status(403).json({ error: "The Event doesn't exist" });
        return;
      }
      if (event.host === username) {
        res.status(403).json({ error: "You are the host of the event!" });
        return;
      }
      await Event.leaveEvent(eventId, username);
      res.status(200).json({});
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async join(req, res) {
    try {
      const username = req.query.username;
      const eventId = req.params.eventId;
      const event = await Event.findOne({ _id: eventId });
      if (!event) {
        res.status(403).json({ error: "The event doesn't exist" });
        return;
      }
      await Event.joinEvent(eventId, username);
      res.status(200).json({});
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async deleteEvent(req, res) {
    try {
      const eventId = req.params.eventId;
      const event = await Event.findOne({ _id: eventId });
      if (!event) {
        res.status(403).json({ error: "The event doesn't exist" });
        return;
      }
      await Event.deleteOne({ _id: eventId });
      res.status(200).json();
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async getPublicEvent(req, res) {
    try {
      const events = await Event.findAllUnexpiredEvent();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

module.exports = EventController;
