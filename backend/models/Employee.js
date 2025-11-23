const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  position: {
    type: DataTypes.STRING
  },
  department: {
    type: DataTypes.STRING
  },
  hire_date: {
    type: DataTypes.DATE
  },
  organization_id: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'employees',
  timestamps: true
});

module.exports = Employee;