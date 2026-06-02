import React, { useEffect, useState } from 'react';
import { getWorkerProfile, updateWorkerProfile } from '../../../workerApi';
import { useNavigate } from 'react-router-dom';
import '../../style/Profile.css';
import Navbar from '../Navbar'; // ✅ Make sure the path is correct

async function geocodeAddressBackend(address) {
  const res = await fetch('http://localhost:5000/api/workers/geocode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address }),
  });
  if (!res.ok) throw new Error('Backend geocode failed');
  return await res.json(); // { latitude, longitude, display_name }
}

export default function WorkerProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [liveLocation, setLiveLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    workType: '',
    salaryPerDay: '',
    photo: null,
    photoPreview: null,
    location: '',
  });

  const [manualLocationInput, setManualLocationInput] = useState(profile?.location || '');
  const [manualLocationStatus, setManualLocationStatus] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('workerToken');
      if (!token) return navigate('/workerlogin');

      const res = await getWorkerProfile(token);
      if (res._id) {
        setProfile(res);
        if (res.locationLat != null && res.locationLng != null) {
          setLiveLocation({
            latitude: res.locationLat,
            longitude: res.locationLng,
            accuracy: res.locationAccuracy,
            updatedAt: res.locationUpdatedAt,
          });
        }
        setFormData({
          name: res.name || '',
          phone: res.phone || '',
          city: res.city || '',
          workType: res.workType || '',
          salaryPerDay: res.salaryPerDay || '',
          photo: null,
          photoPreview: res.photo ? `data:image/jpeg;base64,${res.photo}` : null,
          location: res.location || '',
        });
      } else {
        localStorage.removeItem('workerToken');
        navigate('/workerlogin');
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    setManualLocationInput(profile?.location || '');
  }, [profile?.location]);

  const handleLogout = () => {
    localStorage.removeItem('workerToken');
    navigate('/workerlogin');
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
    const token = localStorage.getItem('workerToken');
    const form = new FormData();
    form.append('name', formData.name);
    form.append('phone', formData.phone);
    form.append('city', formData.city);
    form.append('workType', formData.workType);
    form.append('salaryPerDay', formData.salaryPerDay);
    if (formData.photo) {
      form.append('photo', formData.photo);
    }
    if ('location' in formData) form.append('location', formData.location);

    const res = await updateWorkerProfile(token, form);
    if (res.worker && res.worker._id) {
      const updated = res.worker;
      setProfile(updated);
      setEditing(false);
      if (updated.locationLat != null && updated.locationLng != null) {
        setLiveLocation({
          latitude: updated.locationLat,
          longitude: updated.locationLng,
          accuracy: updated.locationAccuracy,
          updatedAt: updated.locationUpdatedAt,
        });
      }
      setFormData({
        name: updated.name || '',
        phone: updated.phone || '',
        city: updated.city || '',
        workType: updated.workType || '',
        salaryPerDay: updated.salaryPerDay || '',
        photo: null,
        photoPreview: updated.photo ? `data:image/jpeg;base64,${updated.photo}` : null,
        location: updated.location || '',
      });
    } else {
      alert('Failed to update profile');
    }
  };

  const handleManualLocationSave = async () => {
    setManualLocationStatus('Geocoding address...');
    try {
      const geocode = await geocodeAddressBackend(manualLocationInput);
      if (!geocode) {
        setManualLocationStatus('Could not geocode this address. Please check spelling or try a nearby main road/city.');
        return;
      }
      setManualLocationStatus('Saving with coordinates...');
      const token = localStorage.getItem('workerToken');
      // Save manual location string AND lat/lng to backend
      const form = new FormData();
      form.append('location', manualLocationInput);
      form.append('locationLat', geocode.latitude);
      form.append('locationLng', geocode.longitude);
      const res = await updateWorkerProfile(token, form);
      if (res.worker && res.worker._id) {
        setProfile(res.worker);
        setManualLocationStatus('Saved and live location set from address!');
        setLiveLocation({
          latitude: geocode.latitude,
          longitude: geocode.longitude,
          accuracy: null,
          updatedAt: new Date()
        });
      } else {
        setManualLocationStatus('Failed to save.');
      }
    } catch (err) {
      setManualLocationStatus('Could not geocode or save location. Try a broader address.');
    }
    setTimeout(() => setManualLocationStatus(''), 2500);
  };

  const formatLatLng = (value) =>
    typeof value === 'number' && Number.isFinite(value) ? value.toFixed(6) : '—';

  return (
    <>
      <Navbar profile={profile} onLogout={handleLogout} />
      
      <div className="profile-container">
        <h2 className="profile-title">Worker Profile</h2>

        <div style={{ textAlign: 'center' }}>
          {formData.photoPreview ? (
            <img src={formData.photoPreview} alt="Profile" className="profile-avatar" />
          ) : (
            <div className="profile-avatar-placeholder" />
          )}
        </div>

        {editing ? (
          <>
            <div className="input-group">
              <label className="input-label">Name:</label>
              <input name="name" value={formData.name} onChange={handleChange} className="input-field" />
            </div>
            <div className="input-group">
              <label className="input-label">Phone:</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className="input-field" />
            </div>
            <div className="input-group">
              <label className="input-label">City:</label>
              <input name="city" value={formData.city} onChange={handleChange} className="input-field" />
            </div>
            <div className="input-group">
              <label className="input-label">Work Type:</label>
              <input name="workType" value={formData.workType} onChange={handleChange} className="input-field" />
            </div>
            <div className="input-group">
              <label className="input-label">Salary/Day (₹):</label>
              <input
                name="salaryPerDay"
                type="number"
                value={formData.salaryPerDay}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Profile Photo:</label>
              <input type="file" accept="image/*" onChange={handlePhotoChange} />
            </div>
            <div className="input-group">
              <label className="input-label">Manual Location (Address):</label>
              <input name="location" value={formData.location} onChange={handleChange} className="input-field" placeholder="Enter your address or area" />
            </div>
            <div style={{ marginTop: '1rem' }}>
              <button onClick={handleSave} className="btn btn-save">Save</button>
              <button onClick={() => setEditing(false)} className="btn btn-cancel">Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {profile?.name}</p>
            <p><strong>Email:</strong> {profile?.email}</p>
            <p><strong>Phone:</strong> {profile?.phone}</p>
            <p><strong>City:</strong> {profile?.city}</p>
            <p><strong>Work Type:</strong> {profile?.workType}</p>
            <p><strong>Salary/Day:</strong> ₹{profile?.salaryPerDay}</p>
            <p><strong>Manual Location:</strong> {profile?.location || <span className="text-muted">Not set</span>}</p>
            <div className="manual-location-quick-update" style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Type your address or area"
                value={manualLocationInput}
                onChange={e => setManualLocationInput(e.target.value)}
                style={{ maxWidth: 320, marginRight: 8 }}
              />
              <button className="btn btn-save" onClick={handleManualLocationSave} style={{ padding: '0.5rem 1.2rem' }}>
                Save Manual Location
              </button>
              {manualLocationStatus && (
                <span style={{ marginLeft: 10, fontWeight: 'bold', color: manualLocationStatus==='Saved!'?'green':'#d9534f' }}>
                  {manualLocationStatus}
                </span>
              )}
            </div>
            <div style={{ marginTop: '1rem' }}>
              <button onClick={() => setEditing(true)} className="btn btn-edit">Edit</button>
            </div>
          </>
        )}

        <div className="live-location-card">
          <h4>Live Location Sharing</h4>
          {liveLocation?.latitude != null && liveLocation?.longitude != null ? (
            <>
              <p><strong>Latitude:</strong> {formatLatLng(liveLocation.latitude)}</p>
              <p><strong>Longitude:</strong> {formatLatLng(liveLocation.longitude)}</p>
              {liveLocation.updatedAt && (
                <p><strong>Last updated:</strong> {new Date(liveLocation.updatedAt).toLocaleString()}</p>
              )}
              {liveLocation.accuracy && (
                <p><strong>Accuracy:</strong> ±{Math.round(liveLocation.accuracy)} meters</p>
              )}
              <a
                href={`https://www.google.com/maps?q=${liveLocation.latitude},${liveLocation.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: '#0d6efd',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}
              >
                📍 Verify on Google Maps
              </a>
            </>
          ) : (
            <p className="text-muted">You have not shared your live location yet.</p>
          )}
          {/* Removed locationStatus display as it's no longer a state variable */}
          <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.75rem', padding: '0.5rem', background: '#f8f9fa', borderRadius: '6px' }}>
            <strong>💡 Important for DYNAMIC location:</strong>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.25rem' }}>
              <li><strong>Enable GPS</strong> on your device (not just WiFi location)</li>
              <li><strong>Allow location permission</strong> when browser asks</li>
              <li><strong>Move to a different location</strong> and click again to verify it's dynamic</li>
              <li><strong>Use outdoors</strong> for best GPS accuracy</li>
              <li>Each click captures your <strong>CURRENT</strong> location, not a cached one</li>
            </ul>
            <p style={{ marginTop: '0.5rem', color: '#d9534f', fontWeight: 'bold', fontSize: '0.9rem' }}>
              ⚠️ If you see the same coordinates every time, GPS might not be enabled. Check your device settings.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
