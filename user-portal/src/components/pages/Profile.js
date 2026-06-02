import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../../api';
import { useNavigate } from 'react-router-dom';
import '../style/Profile.css';
import Navbar from './Navbar';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    photo: null,
    photoPreview: null,
  });

  const navigate = useNavigate(); // ✅ Define only once

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await getProfile(token);
      if (res._id) {
        setProfile(res);
        setFormData({
          name: res.name || '',
          email: res.email || '',
          city: res.city || '',
          photo: null,
          photoPreview: res.photo
            ? `data:image/jpeg;base64,${res.photo}`
            : null,
        });
      } else {
        localStorage.removeItem("token");
        navigate("/login");
      }
    })();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photoPreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('name', formData.name);
    form.append('city', formData.city);
    if (formData.photo) {
      form.append('photo', formData.photo);
    }

    const res = await updateProfile(token, form);

    if (res.user && res.user._id) {
      const updated = res.user;
      setProfile(updated);
      setEditing(false);
      setFormData({
        name: updated.name || '',
        email: updated.email || '',
        city: updated.city || '',
        photo: null,
        photoPreview: updated.photo
          ? `data:image/jpeg;base64,${updated.photo}`
          : null,
      });
    } else {
      alert('Failed to update profile');
    }
  };

  return (
    <>
      <Navbar profile={profile} onLogout={handleLogout} />
      <div className="profile-container">
        <h2 className="profile-title">Your Profile</h2>

        <div style={{ textAlign: 'center' }}>
          {formData.photoPreview ? (
            <img
              src={formData.photoPreview}
              alt="Profile"
              className="profile-avatar"
            />
          ) : (
            <div className="profile-avatar-placeholder" />
          )}
        </div>

        <div className="input-group">
          <label className="input-label">Name:</label>
          {editing ? (
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
            />
          ) : (
            <p>{profile?.name}</p>
          )}
        </div>

        <div className="input-group">
          <label className="input-label">Email:</label>
          {editing ? (
            <input
              name="email"
              value={formData.email}
              disabled
              className="input-field disabled"
            />
          ) : (
            <p>{profile?.email}</p>
          )}
        </div>

        <div className="input-group">
          <label className="input-label">City:</label>
          {editing ? (
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="input-field"
            />
          ) : (
            <p>{profile?.city || 'N/A'}</p>
          )}
        </div>

        {editing && (
          <div className="input-group">
            <label className="input-label">Profile Photo:</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </div>
        )}

        <div className="button-group">
          {editing ? (
            <>
              <button onClick={handleSave} className="btn btn-save">Save</button>
              <button onClick={() => setEditing(false)} className="btn btn-cancel">Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="btn btn-edit">Edit</button>
          )}
        </div>
      </div>
    </>
  );
}
