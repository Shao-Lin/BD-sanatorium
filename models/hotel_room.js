import { Model, DataTypes } from 'sequelize';
export default (sequelize) => {
  class HotelRoom extends Model {
    static associate(models) {
      HotelRoom.hasMany(models.Tour, { foreignKey: 'room_id' });
    }
  }
  HotelRoom.init({
    room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    room_type: DataTypes.STRING,
    price: DataTypes.NUMERIC,
    booking_status: DataTypes.BOOLEAN,
    occupancy_status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'HotelRoom',
    tableName: 'hotel_room',
    timestamps: false,
  });
  return HotelRoom;
};
