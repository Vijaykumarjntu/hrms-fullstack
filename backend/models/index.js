const sequelize = require('../db');

// Import all models
const User = require('./User');
const Organization = require('./Organization');
const Employee = require('./Employee');
const Team = require('./Team');
const EmployeeTeam = require('./EmployeeTeam');
const AuditLog = require('./AuditLog');

// Define all models in an object
const models = {
  User,
  Organization,
  Employee,
  Team,
  EmployeeTeam,
  AuditLog
};

// Set up relationships
Organization.hasMany(User, { 
  foreignKey: 'organization_id',
  as: 'users'
});
User.belongsTo(Organization, { 
  foreignKey: 'organization_id',
  as: 'organization'
});

Organization.hasMany(Employee, { 
  foreignKey: 'organization_id',
  as: 'employees'
});
Employee.belongsTo(Organization, { 
  foreignKey: 'organization_id',
  as: 'organization'
});

Organization.hasMany(Team, { 
  foreignKey: 'organization_id',
  as: 'teams'
});
Team.belongsTo(Organization, { 
  foreignKey: 'organization_id',
  as: 'organization'
});

// Many-to-many relationship between Employees and Teams
Employee.belongsToMany(Team, { 
  through: EmployeeTeam,
  foreignKey: 'employee_id',
  otherKey: 'team_id',
  as: 'teams'
});

Team.belongsToMany(Employee, { 
  through: EmployeeTeam,
  foreignKey: 'team_id',
  otherKey: 'employee_id',
  as: 'members'
});

// Audit log relationships
AuditLog.belongsTo(Organization, { 
  foreignKey: 'organization_id',
  as: 'organization'
});

AuditLog.belongsTo(User, { 
  foreignKey: 'user_id',
  as: 'user'
});

User.hasMany(AuditLog, {
  foreignKey: 'user_id',
  as: 'auditLogs'
});

Organization.hasMany(AuditLog, {
  foreignKey: 'organization_id',
  as: 'auditLogs'
});

// Export all models
module.exports = {
  sequelize,
  ...models
};