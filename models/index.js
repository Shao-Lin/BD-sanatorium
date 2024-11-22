import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config/config.json'), 'utf8'))[env];

const db = {};

// Создание подключения к базе данных
const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config,
  logging: false, // отключение логов
  define: {
    timestamps: false, // Отключение временных меток глобально
  },
});

// Импорт всех моделей
const initModels = async () => {
  const files = fs
    .readdirSync(__dirname)
    .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js');

  for (const file of files) {
    const module = await import(`file://${path.join(__dirname, file)}`);
    const model = module.default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }

  // Установка связей между моделями
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};

// Инициализация моделей
await initModels();

// Именованные экспорты для всех моделей
export const { Client, ProcedureTicket, ProcedureRoom, Staff, HotelRoom, Tour, Procedure } = db;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
