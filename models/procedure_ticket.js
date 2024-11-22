import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class ProcedureTicket extends Model {
    static associate(models) {
      ProcedureTicket.belongsTo(models.Procedure, { foreignKey: 'procedure_id' });
      ProcedureTicket.belongsTo(models.ProcedureRoom, { foreignKey: 'procedure_room_id' });
      ProcedureTicket.belongsTo(models.Tour, { foreignKey: 'tour_id' });
      ProcedureTicket.belongsTo(models.Staff, { foreignKey: 'staff_id' });

    }
  }
  ProcedureTicket.init({
    ticket_procedure_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    procedure_id: DataTypes.INTEGER,
    procedure_room_id: DataTypes.INTEGER,
    staff_id: DataTypes.INTEGER,
    date_procedure: DataTypes.DATE,
    tour_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ProcedureTicket',
    tableName: 'procedure_ticket',
    timestamps: false, // Отключение временных меток
  });
  return ProcedureTicket;
};
