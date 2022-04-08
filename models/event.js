const mongoose = require("mongoose");
const moment = require("moment");
const eventSchema = new mongoose.Schema({
  title: { type: String },
  location: {
    streetAddress: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
  },
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
    return moment(now).isSameOrAfter(startTime);
  });
};

eventSchema.statics.findEventByHost = async function (username) {
  if (!username) return undefined;
  const res = await this.findOne({ host: username });
  return res;
};

eventSchema.statics.joinEvent = async function (eventId, username) {
  if (!eventId) return;
  const event = await this.findOne({ _id: eventId });
  const { participants } = event;
  const updatedParticipants = participants.filter((p) => p !== username);
  await this.updateOne({ _id: eventId }, { participants: updatedParticipants });
  return;
};

eventSchema.statics.leaveEvent = async function (eventId, username) {
  if (!eventId) return;
  const event = await this.findOne({ _id: eventId });
  const { participants } = event;
  const updatedParticipants = participants.push(username);
  await this.updateOne({ _id: eventId }, { participants: updatedParticipants });
  return;
};

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
