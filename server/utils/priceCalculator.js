const Accessory = require("../models/Accessory");

const calculateTotalPrice = async (basePrice, accessories, isFullSet) => {
  let totalPrice = basePrice;

  if (isFullSet && accessories?.length) {
    const accessoryData = await Accessory.find({ _id: { $in: accessories }, stock: { $gt: 0 } });

    accessoryData.forEach(accessory => {
      const discount = accessory.discount > 0 ? accessory.price * (accessory.discount / 100) : 0;
      const finalPrice = accessory.price - discount;
      totalPrice += finalPrice;
    });
  }

  return totalPrice;
};

module.exports = calculateTotalPrice;
