import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database/index';

import { SourceFieldValues } from './SourceFieldValues';

export class Sources extends Model {
  id: undefined;
  name: unknown;
}

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
