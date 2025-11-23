const express = require('express');
const { Team, Employee, EmployeeTeam, AuditLog } = require('./models');
const authenticate = require('./middleware');

const router = express.Router();

// Get all teams with members
router.get('/', authenticate, async (req, res) => {
  try {
    const teams = await Team.findAll({
      where: { organization_id: req.user.organization_id },
      include: [{
        model: Employee,
        as: 'members',
        through: { attributes: [] } // Exclude junction table attributes
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new team
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const team = await Team.create({
      name,
      description,
      organization_id: req.user.organization_id
    });

    // Audit log
    await AuditLog.create({
      action: 'team_created',
      resource_type: 'team',
      resource_id: team.id,
      organization_id: req.user.organization_id,
      user_id: req.user.id,
      details: { name, description }
    });

    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update team
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findOne({
      where: { id, organization_id: req.user.organization_id }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    await team.update(req.body);

    // Audit log
    await AuditLog.create({
      action: 'team_updated',
      resource_type: 'team',
      resource_id: team.id,
      organization_id: req.user.organization_id,
      user_id: req.user.id,
      details: req.body
    });

    res.json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete team
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findOne({
      where: { id, organization_id: req.user.organization_id }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    await team.destroy();

    // Audit log
    await AuditLog.create({
      action: 'team_deleted',
      resource_type: 'team',
      resource_id: id,
      organization_id: req.user.organization_id,
      user_id: req.user.id,
      details: { team_name: team.name }
    });

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;