const mongoose = require("mongoose");
const moment = require("moment");
const eventSchema = new mongoose.Schema({
  title: { type: String },
  location: { type: String },
  startTime: { type: String },
  host: { type: String },
  participants: { type: [String] },
  details: { type: String },
  type: { type: String },
});

eventSchema.statics.findAllUnexpiredEvent = async function () {
  const events = await this.find({});
  const unexpiredEvents = events.filter((event) => {
    const { startTime } = event;
    const now = moment().format();
    return moment(startTime).isSameOrAfter(now);
  });
  return unexpiredEvents;
};

eventSchema.statics.findEventByHost = async function (username) {
  if (!username) return undefined;
  const res = await this.find({ host: username });
  return res;
};

eventSchema.statics.leaveEvent = async function (eventId, username) {
  if (!eventId) return;
  await this.updateOne({ _id: eventId }, { $pull: { participants: username } });
  return;
};

eventSchema.statics.joinEvent = async function (eventId, username) {
  if (!eventId) return;
  await this.updateOne({ _id: eventId }, { $push: { participants: username } });
  return;
};

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
