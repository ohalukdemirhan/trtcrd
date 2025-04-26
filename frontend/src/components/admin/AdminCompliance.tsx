import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ComplianceTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  isActive: boolean;
  lastUpdated: string;
}

const AdminCompliance: React.FC = () => {
  const [templates, setTemplates] = useState<ComplianceTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<ComplianceTemplate | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('/api/v1/admin/compliance/templates');
        setTemplates(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch compliance templates');
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleToggleTemplate = async (id: string, isActive: boolean) => {
    try {
      await axios.patch(`/api/v1/admin/compliance/templates/${id}`, { isActive });
      setTemplates(templates.map(template =>
        template.id === id ? { ...template, isActive } : template
      ));
    } catch (err) {
      setError('Failed to update template status');
    }
  };

  const handleSaveTemplate = async (template: ComplianceTemplate) => {
    try {
      if (template.id) {
        await axios.put(`/api/v1/admin/compliance/templates/${template.id}`, template);
      } else {
        await axios.post('/api/v1/admin/compliance/templates', template);
      }
      
      const response = await axios.get('/api/v1/admin/compliance/templates');
      setTemplates(response.data);
      setEditingTemplate(null);
    } catch (err) {
      setError('Failed to save template');
    }
  };

  if (loading) return <div className="p-4">Loading compliance templates...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Compliance Templates</h2>
        <button
          onClick={() => setEditingTemplate({
            id: '',
            name: '',
            description: '',
            content: '',
            isActive: true,
            lastUpdated: new Date().toISOString()
          })}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Template
        </button>
      </div>

      <div className="grid gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{template.name}</h3>
                <p className="text-gray-600">{template.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={template.isActive}
                    onChange={(e) => handleToggleTemplate(template.id, e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
                <button
                  onClick={() => setEditingTemplate(template)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date(template.lastUpdated).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Template Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">
              {editingTemplate.id ? 'Edit Template' : 'New Template'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSaveTemplate(editingTemplate);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({
                      ...editingTemplate,
                      name: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={editingTemplate.description}
                    onChange={(e) => setEditingTemplate({
                      ...editingTemplate,
                      description: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    value={editingTemplate.content}
                    onChange={(e) => setEditingTemplate({
                      ...editingTemplate,
                      content: e.target.value
                    })}
                    rows={6}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompliance; 