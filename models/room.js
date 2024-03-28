const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema(
  {
    // name: String,
    name: {
      type: String,
      required: [true, '名稱必填'],
    },
    price: {
      type: Number,
      required: [true, '價格必填'],
    },
    rating: {
      type: Number,
      required: [true, '評分必填'],
    },
    // rating: Number,
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

const Room = mongoose.model('Room', roomSchema);
// 開頭字小寫
// 強制加上 s

module.exports = Room;
