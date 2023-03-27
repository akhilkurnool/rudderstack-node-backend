import { Model, DataTypes } from 'sequelize';
import { sequelize }  from '../database/index';

import { SourceFieldValues } from './SourceFieldValues';

export class Templates extends Model {
  name: unknown;
  id: any;
}

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

Templates.hasMany(SourceFieldValues, {
  foreignKey: {
    name: 'templateId',
    allowNull: false
  }
})