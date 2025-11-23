const express = require('express');
const { AuditLog, User } = require('./models');
const authenticate = require('./middleware');

const router = express.Router();

// Get audit logs for organization
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const logs = await AuditLog.findAndCountAll({
      where: { organization_id: req.user.organization_id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['email']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      logs: logs.rows,
      total: logs.count,
      page: parseInt(page),
      totalPages: Math.ceil(logs.count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;