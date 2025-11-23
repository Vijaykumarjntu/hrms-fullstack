const express = require('express');
const { Employee, Team, EmployeeTeam, AuditLog } = require('./models');
const authenticate = require('./middleware');

const router = express.Router();

// Assign employee to team
router.post('/assign', authenticate, async (req, res) => {
  try {
    const { employee_id, team_id } = req.body;

    // Verify employee and team belong to organization
    const employee = await Employee.findOne({
      where: { id: employee_id, organization_id: req.user.organization_id }
    });
    const team = await Team.findOne({
      where: { id: team_id, organization_id: req.user.organization_id }
    });

    if (!employee || !team) {
      return res.status(404).json({ error: 'Employee or Team not found' });
    }

    // Assign employee to team
    const assignment = await EmployeeTeam.create({
      employee_id,
      team_id
    });

    // Audit log
    await AuditLog.create({
      action: 'employee_assigned_to_team',
      resource_type: 'assignment',
      resource_id: assignment.id,
      organization_id: req.user.organization_id,
      user_id: req.user.id,
      details: {
        employee_name: `${employee.first_name} ${employee.last_name}`,
        team_name: team.name,
        employee_id,
        team_id
      }
    });

    res.status(201).json({ 
      message: 'Employee assigned to team successfully',
      assignment 
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Employee is already in this team' });
    }
    res.status(400).json({ error: error.message });
  }
});

// Remove employee from team
router.post('/unassign', authenticate, async (req, res) => {
  try {
    const { employee_id, team_id } = req.body;

    const assignment = await EmployeeTeam.findOne({
      where: { employee_id, team_id },
      include: [
        { model: Employee, as: 'Employee' },
        { model: Team, as: 'Team' }
      ]
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    await assignment.destroy();

    // Audit log
    await AuditLog.create({
      action: 'employee_removed_from_team',
      resource_type: 'assignment',
      resource_id: assignment.id,
      organization_id: req.user.organization_id,
      user_id: req.user.id,
      details: {
        employee_name: `${assignment.Employee.first_name} ${assignment.Employee.last_name}`,
        team_name: assignment.Team.name,
        employee_id,
        team_id
      }
    });

    res.json({ message: 'Employee removed from team successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get team members
router.get('/team/:teamId/members', authenticate, async (req, res) => {
  try {
    const { teamId } = req.params;
    
    const team = await Team.findOne({
      where: { id: teamId, organization_id: req.user.organization_id },
      include: [{
        model: Employee,
        as: 'members'
      }]
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json(team.members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get employee teams
router.get('/employee/:employeeId/teams', authenticate, async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const employee = await Employee.findOne({
      where: { id: employeeId, organization_id: req.user.organization_id },
      include: [{
        model: Team,
        as: 'teams'
      }]
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee.teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;