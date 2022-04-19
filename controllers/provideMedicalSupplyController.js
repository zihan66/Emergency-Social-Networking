require("dotenv").config();
const jwt = require("jsonwebtoken");
const socket = require("../socket");
const MedicalSupply = require("../models/medicalSupply");
class provideMedicalSupplyController {
  static async postMedicalSupply(req, res) {
    try {
      const io = socket.getInstance();
      const medicalSupply = {
        provider: req.body.provider,
        name: req.body.name,
      };
      const newMedicalSupply = await MedicalSupply.create(medicalSupply);
      io.emit("postNewMedicalSupply", newMedicalSupply);
      res.status(201).json({ newMedicalSupply });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
  static async getUserMedicalSupply(req, res) {
    const params = req.params;
    try {
      const result = await MedicalSupply.findMedicalSupplyByProvider(
        params.provider
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
  //   static async getAllMedicalSupply(req, res){
  //     try {
  //       const result = await MedicalSupply.findAllMedicalSupply();
  //       console.log("result",result);
  //       res.status(200).json(result);
  //     } catch (error) {
  //       res.status(500).json({ error });
  //     }
  // }
  static async deleteUserMedicalSupply(req, res) {
    const io = socket.getInstance();
    const params = req.params;
    try {
      const result = await MedicalSupply.deleteMedicalSupplyById(
        params.medicalSupplyId
      );
      const emitData = { id: params.medicalSupplyId };
      io.emit("deleteMedicalSupply", emitData);
      res.status(200).json();
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
module.exports = provideMedicalSupplyController;
