import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';

import { Fields } from './Fields';
import { Sources } from './Sources';
import { TemplatesFieldsAssoc } from './TemplatesFieldsAssoc';

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

Templates.belongsToMany(Fields, { 
  through: TemplatesFieldsAssoc,
  foreignKey: 'templateId',
  otherKey: 'fieldId',
  as: 'fields',
});

Templates.hasMany(Sources, {
  foreignKey: {
    name: 'templateId',
    allowNull: false
  }
})