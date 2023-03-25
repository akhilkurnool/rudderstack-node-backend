import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';

import { Sources } from './Sources';

export class Templates extends Model {}

Templates.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true 
  }
}, {
  sequelize,
  modelName: 'templates',
  tableName: 'templates'
});


Templates.hasMany(Sources, {
  foreignKey: {
    name: 'templateId',
    allowNull: false
  }
})