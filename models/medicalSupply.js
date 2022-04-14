const mongoose = require("mongoose");
// establish database connection
const medicalSupplySchema = new mongoose.Schema({
  name: { type: String, trim: true },
  provider: { type: String },
  isReserved: { type: Boolean, default: false },
  receiver: { type: String, default: null },
  isDeleted: { type: Boolean, default: false },
});

medicalSupplySchema.statics.findMedicalSupplyByProvider = async function (
  username
) {
  console.log("username", username);
  //const medicalSupply = await this.find({ provider: username}, {isDeleted:false},);
  //   const medicalSupply = await this.find({
  //     $and: [{ provider: username }, { isDeleted: false }],
  //   });
  const medicalSupply = await this.find({
    provider: username,
    isDeleted: false,
  });
  return medicalSupply;
};

medicalSupplySchema.statics.findAllMedicalSupply = async function () {
  const allMedicalSupply = await this.find({ isDeleted: false }).sort({
    name: 1,
  });
  return allMedicalSupply;
};

medicalSupplySchema.statics.deleteMedicalSupplyById = async function (id) {
  console.log("id", id);
  const medicalSupply = await this.updateOne({ _id: id }, { isDeleted: true });
  return medicalSupply;
};

medicalSupplySchema.statics.updateMedicalSupplyToReserved = async function (
  id,
  receiver
) {
  console.log("id", id);
  const medicalSupply = await this.updateOne(
    { _id: id },
    { isReserved: true, receiver: receiver }
  );
  return medicalSupply;
};

medicalSupplySchema.statics.updateMedicalSupplyToNotReserved = async function (
  id
) {
  console.log("id", id);
  const medicalSupply = await this.updateOne(
    { _id: id },
    { isReserved: false, receiver: null }
  );
  return medicalSupply;
};

medicalSupplySchema.statics.findMedicalSupplyByName = async function (
  searchContent
) {
  console.log("MedicalSupplyname", searchContent);
  const medicalSupply = await this.find({
    name: { $regex: searchContent },
    isDeleted: false,
  });
  return medicalSupply;
};
const MedicalSupply = mongoose.model("MedicalSupply", medicalSupplySchema);
module.exports = MedicalSupply;
