const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const EmployeeTeam = sequelize.define('EmployeeTeam', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  employee_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  team_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  assigned_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'employee_teams',
  timestamps: false
});

module.exports = EmployeeTeam;