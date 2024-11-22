import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class ProcedureRoom extends Model {
    static associate(models) {
      ProcedureRoom.hasMany(models.ProcedureTicket, { foreignKey: 'procedure_room_id' });
    }
  }
  ProcedureRoom.init({
    room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    location: DataTypes.STRING,
    service_type: DataTypes.STRING,
    occupancy_status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'ProcedureRoom',
    tableName: 'procedure_room',
    timestamps: false, // Отключение временных меток
  });
  return ProcedureRoom;
};
