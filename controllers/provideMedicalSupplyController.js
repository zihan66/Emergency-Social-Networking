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
          name: req.body.name
      };
      const newMedicalSupply = await MedicalSupply.create(medicalSupply);
      //io.emit("newMedicalSupply", )
      console.log("newMedicalSupply",newMedicalSupply);
      res.status(201).json({newMedicalSupply});

    } catch (error) {
      res.status(500).json({ error });
    }
  }
  static async getUserMedicalSupply(req, res){
      console.log("getUserMedicalSupply!!!");
      //const query = req.query ;
      //console.log(query);
      const params = req.params
      try {
        const result = await MedicalSupply.findMedicalSupplyByProvider(params.provider);
        console.log("result",result);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error });
      }
  }
  static async getAllMedicalSupply(req, res){
    try {
      const result = await MedicalSupply.findAllMedicalSupply();
      console.log("result",result);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
}
  static async deleteUserMedicalSupply(req, res){
    const params = req.params ;
    console.log(params);
    console.log("22222222222");
    try {
      const result = await MedicalSupply.deleteMedicalSupplyById(params.medicalSupplyId);
      console.log("result",result);
      res.status(200).json();
    } catch (error) {
      res.status(500).json({ error });
    }
}
}
module.exports = provideMedicalSupplyController;
