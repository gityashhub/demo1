import { useState, useEffect } from 'react';
import { freelancerAPI, pricingAPI, projectAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/ProfileManage.css';

const MyProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [packages, setPackages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [editMode, setEditMode] = useState({
    profile: false,
    package: null,
    project: null
  });
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [packagesRes, projectsRes] = await Promise.all([
        pricingAPI.getByFreelancer(user._id),
        projectAPI.getByFreelancer(user._id)
      ]);
      
      setPackages(packagesRes.data);
      setProjects(projectsRes.data);

      try {
        const profileRes = await freelancerAPI.getProfile(user._id);
        setProfile(profileRes.data);
      } catch (error) {
        console.log('No profile yet');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      if (profile) {
        await freelancerAPI.updateProfile(formData);
        alert('Profile updated successfully!');
      } else {
        await freelancerAPI.createProfile(formData);
        alert('Profile created successfully!');
      }
      await fetchData();
      setEditMode({ ...editMode, profile: false });
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handlePackageSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode.package === 'new') {
        await pricingAPI.create(formData);
        alert('Package created successfully!');
      } else {
        await pricingAPI.update(editMode.package, formData);
        alert('Package updated successfully!');
      }
      await fetchData();
      setEditMode({ ...editMode, package: null });
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()),
        images: formData.images ? formData.images.split(',').map(i => i.trim()) : []
      };

      if (editMode.project === 'new') {
        await projectAPI.create(projectData);
        alert('Portfolio item created successfully!');
      } else {
        await projectAPI.update(editMode.project, projectData);
        alert('Portfolio item updated successfully!');
      }
      await fetchData();
      setEditMode({ ...editMode, project: null });
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeletePackage = async (id) => {
    if (!confirm('Delete this package?')) return;
    try {
      await pricingAPI.delete(id);
      await fetchData();
      alert('Package deleted successfully!');
    } catch (error) {
      alert('Failed to delete package');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Delete this portfolio item?')) return;
    try {
      await projectAPI.delete(id);
      await fetchData();
      alert('Portfolio item deleted successfully!');
    } catch (error) {
      alert('Failed to delete portfolio item');
    }
  };

  return (
    <div className="profile-manage-container">
      <h1>Manage Profile</h1>

      <section className="manage-section">
        <div className="section-header">
          <h2>Freelancer Profile</h2>
          <button className="btn-primary" onClick={() => {
            setEditMode({ ...editMode, profile: true });
            setFormData(profile || { specialization: '', skills: [], experience: 0, description: '' });
          }}>
            {profile ? 'Edit Profile' : 'Create Profile'}
          </button>
        </div>

        {editMode.profile ? (
          <form onSubmit={handleProfileSubmit} className="edit-form">
            <div className="form-group">
              <label>Specialization *</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                required
                placeholder="e.g., Web Developer, Designer"
              />
            </div>
            
            <div className="form-group">
              <label>Skills * (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()) })}
                required
                placeholder="JavaScript, React, Node.js"
              />
            </div>
            
            <div className="form-group">
              <label>Years of Experience *</label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                required
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                placeholder="Tell clients about yourself..."
              />
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setEditMode({ ...editMode, profile: false })}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        ) : profile ? (
          <div className="profile-display">
            <p><strong>Specialization:</strong> {profile.specialization}</p>
            <p><strong>Skills:</strong> {profile.skills.join(', ')}</p>
            <p><strong>Experience:</strong> {profile.experience} years</p>
            <p><strong>Description:</strong> {profile.description}</p>
          </div>
        ) : (
          <p className="empty-text">No profile created yet</p>
        )}
      </section>

      <section className="manage-section">
        <div className="section-header">
          <h2>Pricing Packages</h2>
          <button className="btn-primary" onClick={() => {
            setEditMode({ ...editMode, package: 'new' });
            setFormData({ title: '', description: '', price: 0, deliveryDays: 1 });
          }}>
            Add Package
          </button>
        </div>

        {editMode.package && (
          <form onSubmit={handlePackageSubmit} className="edit-form">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Price ($) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label>Delivery Days *</label>
              <input
                type="number"
                value={formData.deliveryDays}
                onChange={(e) => setFormData({ ...formData, deliveryDays: parseInt(e.target.value) })}
                required
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
              />
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setEditMode({ ...editMode, package: null })}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        )}

        <div className="items-list">
          {packages.map(pkg => (
            <div key={pkg._id} className="item-card">
              <h3>{pkg.title}</h3>
              <p className="price">${pkg.price}</p>
              <p>{pkg.description}</p>
              <p className="delivery">📦 {pkg.deliveryDays} days delivery</p>
              <div className="item-actions">
                <button className="btn-secondary" onClick={() => {
                  setEditMode({ ...editMode, package: pkg._id });
                  setFormData(pkg);
                }}>Edit</button>
                <button className="btn-danger" onClick={() => handleDeletePackage(pkg._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="manage-section">
        <div className="section-header">
          <h2>Portfolio</h2>
          <button className="btn-primary" onClick={() => {
            setEditMode({ ...editMode, project: 'new' });
            setFormData({ title: '', description: '', images: '', tags: '' });
          }}>
            Add Portfolio Item
          </button>
        </div>

        {editMode.project && (
          <form onSubmit={handleProjectSubmit} className="edit-form">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
              />
            </div>
            
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Web, Design, React"
              />
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setEditMode({ ...editMode, project: null })}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        )}

        <div className="items-list">
          {projects.map(project => (
            <div key={project._id} className="item-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tags">
                {project.tags.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
              <div className="item-actions">
                <button className="btn-secondary" onClick={() => {
                  setEditMode({ ...editMode, project: project._id });
                  setFormData({ ...project, tags: project.tags.join(', ') });
                }}>Edit</button>
                <button className="btn-danger" onClick={() => handleDeleteProject(project._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MyProfile;
