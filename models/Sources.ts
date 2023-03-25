import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';

import { Templates } from './Templates';
import { Fields } from './Fields';

export class Sources extends Model {}

Sources.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true 
  },
  templateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Templates,
      key: 'id'
    },
  },
  fieldId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Fields,
      key: 'id'
    },
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'sources',
  tableName: 'sources'
});

