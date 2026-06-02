const WORKER_BASE = 'http://localhost:5000/api/workers';

// Register new worker (with optional profile photo)
export async function workerSignup(formData) {
  const res = await fetch(`${WORKER_BASE}/signup`, {
    method: 'POST',
    body: formData, // formData should include optional photo
    credentials: 'include', // Recommended for CORS consistency
  });
  return res.json();
}

// Login worker
export async function workerLogin(credentials) {
  const res = await fetch(`${WORKER_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include', // Recommended if using cookies (or future use)
  });
  return res.json();
}

// Get worker profile using JWT token
export async function getWorkerProfile(token) {
  const res = await fetch(`${WORKER_BASE}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include', // ✅ Needed for authenticated CORS requests
  });
  return res.json();
}

// Update worker profile (name, phone, city, photo)
export async function updateWorkerProfile(token, formData) {
  const res = await fetch(`${WORKER_BASE}/profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include', // ✅ Needed for authenticated CORS requests
    body: formData,
  });
  return res.json();
}

// Get all workers (public route)
export async function getAllWorkers() {
  const res = await fetch(`${WORKER_BASE}/all`, {
    credentials: 'include', // Optional but safe for CORS behavior
  });
  return res.json();
}

export async function updateWorkerLocation(token, payload) {
  // Send EXACT coordinates - no transformation, no conversion
  console.log('📍 Sending EXACT location to server:', payload);

  const attemptJsonEndpoint = async () => {
    const res = await fetch(`${WORKER_BASE}/location`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        latitude: payload.latitude,  // Send exactly as received
        longitude: payload.longitude, // Send exactly as received
        accuracy: payload.accuracy
      }),
    });
    if (res.ok) {
      const data = await res.json();
      console.log('📍 Server stored location:', data);
      return data;
    }
    throw new Error(`location endpoint error: ${res.status}`);
  };

  const attemptProfileEndpoint = async () => {
    const formData = new FormData();
    // Send exact values
    formData.append('locationLat', payload.latitude);
    formData.append('locationLng', payload.longitude);
    if (payload.accuracy) {
      formData.append('locationAccuracy', payload.accuracy);
    }

    console.log('📍 Sending via FormData (fallback):', payload);

    const res = await fetch(`${WORKER_BASE}/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData,
    });

    if (!res.ok) {
      const message = await res.text();
      throw new Error(message || 'Failed to update location');
    }

    const data = await res.json();
    if (data.worker) {
      return {
        msg: data.msg || 'Live location updated',
        location: {
          latitude: data.worker.locationLat != null ? Number(data.worker.locationLat) : null,
          longitude: data.worker.locationLng != null ? Number(data.worker.locationLng) : null,
          accuracy: data.worker.locationAccuracy != null ? Number(data.worker.locationAccuracy) : null,
          updatedAt: data.worker.locationUpdatedAt,
        },
      };
    }
    return data;
  };

  try {
    return await attemptJsonEndpoint();
  } catch (err) {
    console.warn('JSON location endpoint failed, falling back to profile route:', err.message);
    return attemptProfileEndpoint();
  }
}

export async function getWorkerLiveLocation(workerId) {
  const attemptDirectEndpoint = async () => {
    const res = await fetch(`${WORKER_BASE}/${workerId}/location`, {
      credentials: 'include',
    });

    if (res.status === 204) return {};
    if (res.ok) {
      return res.json();
    }
    throw new Error(`location endpoint error: ${res.status}`);
  };

  const attemptAllEndpoint = async () => {
    const res = await fetch(`${WORKER_BASE}/all`, {
      credentials: 'include',
    });
    if (!res.ok) return {};

    const workers = await res.json();
    const worker = workers.find((w) => w._id === workerId);
    if (!worker || worker.locationLat == null || worker.locationLng == null) {
      return {};
    }

    return {
      workerId: worker._id,
      location: {
        latitude: Number(worker.locationLat),
        longitude: Number(worker.locationLng),
        accuracy: worker.locationAccuracy != null ? Number(worker.locationAccuracy) : null,
        updatedAt: worker.locationUpdatedAt,
      },
    };
  };

  try {
    return await attemptDirectEndpoint();
  } catch (err) {
    console.warn('Direct live location endpoint failed, using /all fallback:', err.message);
    return attemptAllEndpoint();
  }
}