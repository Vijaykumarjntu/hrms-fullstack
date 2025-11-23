const express = require('express');
const { Employee, Organization, AuditLog } = require('./models');
const authenticate = require('./middleware');

const router = express.Router();

// Get all employees for organization
router.get('/', authenticate, async (req, res) => {
  try {
    const employees = await Employee.findAll({
      where: { organization_id: req.user.organization_id },
      order: [['createdAt', 'DESC']]
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new employee
router.post('/', authenticate, async (req, res) => {
  try {
    const { first_name, last_name, email, position, department, hire_date } = req.body;
    
    const employee = await Employee.create({
      first_name,
      last_name,
      email,
      position,
      department,
      hire_date,
      organization_id: req.user.organization_id
    });

    // Audit log
    await AuditLog.create({
      action: 'employee_created',
      resource_type: 'employee',
      resource_id: employee.id,
      organization_id: req.user.organization_id,
      user_id: req.user.id,
      details: { first_name, last_name, email }
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update employee
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({
      where: { id, organization_id: req.user.organization_id }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await employee.update(req.body);

    // Audit log
    await AuditLog.create({
      action: 'employee_updated',
      resource_type: 'employee',
      resource_id: employee.id,
      organization_id: req.user.organization_id,
      user_id: req.user.id,
      details: req.body
    });

    res.json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete employee
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({
      where: { id, organization_id: req.user.organization_id }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await employee.destroy();

    // Audit log
    await AuditLog.create({
      action: 'employee_deleted',
      resource_type: 'employee',
      resource_id: id,
      organization_id: req.user.organization_id,
      user_id: req.user.id,
      details: { employee_name: `${employee.first_name} ${employee.last_name}` }
    });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;