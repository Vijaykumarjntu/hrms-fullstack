const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resource_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resource_id: {
    type: DataTypes.UUID
  },
  details: {
    type: DataTypes.JSON
  },
  organization_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'audit_logs',
  timestamps: true,
  updatedAt: false // We only need createdAt for audit logs
});

module.exports = AuditLog;