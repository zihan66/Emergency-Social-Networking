require("dotenv").config();
const jwt = require("jsonwebtoken");
const socket = require("../socket");
const MedicalSupply = require("../models/medicalSupply");
class reserveMedicalSupplyController {
  static async getAllMedicalSupply(req, res) {
    console.log("getAllMedicalSupply!!!!!!!");

    try {
      const result = await MedicalSupply.findAllMedicalSupply();
      console.log("result", result);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async updateMedicalSupplyIsReserved(req, res) {
    const body = req.body;
    console.log("body", body);
    console.log("params medicalSupplyId", req.params.medicalSupplyId);
    try {
      const io = socket.getInstance();
      const id = req.params.medicalSupplyId;
      const receiver = body.username;

      if (body.isReserved === true) {
        const result = await MedicalSupply.updateMedicalSupplyToReserved(
          id,
          receiver
        );
        const emitData = { id: id, receiver: receiver };
        io.emit("reserved", emitData);
      } else if (body.isReserved === false) {
        const result = await MedicalSupply.updateMedicalSupplyToNotReserved(
          req.params.medicalSupplyId
        );
        const emitData = { id: id };
        io.emit("cancelReservation", emitData);
      }

      res.status(200).json();
    } catch (error) {
      res.status(500).json({ error });
    }
  }

}
module.exports = reserveMedicalSupplyController;
