import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';

import { SourceFieldValues } from './SourceFieldValues';

export class Sources extends Model {}

Sources.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true 
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'sources',
  tableName: 'sources'
});

Sources.hasMany(SourceFieldValues, {
  foreignKey: {
    name: 'sourceId',
    allowNull: false
  }
})