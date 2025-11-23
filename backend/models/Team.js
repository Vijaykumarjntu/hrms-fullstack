const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Team = sequelize.define('Team', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  organization_id: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'teams',
  timestamps: true
});

module.exports = Team;