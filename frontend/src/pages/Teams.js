import React, { useState, useEffect } from 'react';
import { teamAPI, employeeAPI, assignmentAPI } from '../services/api';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAssignment, setShowAssignment] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [assignmentData, setAssignmentData] = useState({ employee_id: '', team_id: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTeams();
    loadEmployees();
  }, []);

  const loadTeams = async () => {
    try {
      const response = await teamAPI.getAll();
      setTeams(response.data);
    } catch (error) {
      alert('Failed to load teams');
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (error) {
      alert('Failed to load employees');
    }
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingTeam) {
        await teamAPI.update(editingTeam.id, formData);
      } else {
        await teamAPI.create(formData);
      }
      
      setShowForm(false);
      setEditingTeam(null);
      setFormData({ name: '', description: '' });
      loadTeams();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save team');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await assignmentAPI.assign(assignmentData);
      setShowAssignment(false);
      setAssignmentData({ employee_id: '', team_id: '' });
      loadTeams(); // Reload to see updated members
      alert('Employee assigned to team successfully');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to assign employee');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await teamAPI.delete(id);
        loadTeams();
      } catch (error) {
        alert('Failed to delete team');
      }
    }
  };

  const handleRemoveMember = async (teamId, employeeId) => {
    if (window.confirm('Remove employee from team?')) {
      try {
        await assignmentAPI.unassign({ employee_id: employeeId, team_id: teamId });
        loadTeams();
      } catch (error) {
        alert('Failed to remove employee from team');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teams</h1>
        <div className="space-x-3">
          <button
            onClick={() => setShowAssignment(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Assign to Team
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Team
          </button>
        </div>
      </div>

      {/* Teams List */}
      <div className="grid gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{team.name}</h3>
                {team.description && <p className="text-gray-600 mt-1">{team.description}</p>}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setEditingTeam(team);
                    setFormData({ name: team.name, description: team.description || '' });
                    setShowForm(true);
                  }}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTeam(team.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Team Members ({team.members?.length || 0})</h4>
              {team.members && team.members.length > 0 ? (
                <div className="space-y-2">
                  {team.members.map((member) => (
                    <div key={member.id} className="flex justify-between items-center py-2 border-b">
                      <span>
                        {member.first_name} {member.last_name} ({member.position})
                      </span>
                      <button
                        onClick={() => handleRemoveMember(team.id, member.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No members in this team</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Team Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingTeam ? 'Edit Team' : 'Add Team'}
            </h2>
            
            <form onSubmit={handleTeamSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Team Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded mt-1"
                  rows="3"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTeam(null);
                    setFormData({ name: '', description: '' });
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingTeam ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Assign Employee to Team</h2>
            
            <form onSubmit={handleAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee</label>
                <select
                  required
                  value={assignmentData.employee_id}
                  onChange={(e) => setAssignmentData({...assignmentData, employee_id: e.target.value})}
                  className="w-full p-2 border rounded mt-1"
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Team</label>
                <select
                  required
                  value={assignmentData.team_id}
                  onChange={(e) => setAssignmentData({...assignmentData, team_id: e.target.value})}
                  className="w-full p-2 border rounded mt-1"
                >
                  <option value="">Select Team</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignment(false);
                    setAssignmentData({ employee_id: '', team_id: '' });
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Assigning...' : 'Assign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;