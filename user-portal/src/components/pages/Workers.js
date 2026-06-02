import React, { useEffect, useState } from "react";
import { getProfile } from "../../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../pages/Navbar";


function Workers() {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [profile, setProfile] = useState({});
  const [busyWorkers, setBusyWorkers] = useState({});
  const [filters, setFilters] = useState({
    location: "",
    workType: "",
    maxSalary: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    (async () => {
      const res = await getProfile(token);
      if (res._id) {
        setProfile(res);
      } else {
        localStorage.removeItem("token");
        navigate("/login");
      }
    })();
  }, [navigate]);

  useEffect(() => {
    fetch("http://localhost:5000/api/workers/all")
      .then((res) => res.json())
      .then((data) => {
        setWorkers(data);

        // 🚀 Check for selectedService from localStorage
        const stored = localStorage.getItem("selectedService");
        if (stored) {
          const service = JSON.parse(stored);
          const filtered = data.filter((worker) =>
            (worker.skills || [worker.workType]).includes(service.name)
          );
          setFilters((prev) => ({ ...prev, workType: service.name }));
          setFilteredWorkers(filtered);

          // ✅ Defer removal to prevent dropdown flicker
          setTimeout(() => {
            localStorage.removeItem("selectedService");
          }, 30000);
        } else {
          setFilteredWorkers(data);
        }
      })
      .catch((err) => console.error("Error fetching workers:", err));
  }, []);

  const handleBookNow = (workerId) => {
    alert(`Booked worker with ID: ${workerId}`);
    setBusyWorkers((prev) => ({ ...prev, [workerId]: true }));

    setTimeout(() => {
      setBusyWorkers((prev) => {
        const updated = { ...prev };
        delete updated[workerId];
        return updated;
      });
    }, 15000); // 15 seconds
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);

    const filtered = workers.filter((worker) => {
      const locationMatch = !updated.location || worker.location?.toLowerCase().includes(updated.location.toLowerCase()) || worker.city?.toLowerCase().includes(updated.location.toLowerCase());
      const workTypeMatch = !updated.workType || (worker.skills || [worker.workType]).includes(updated.workType);
      const salaryMatch = !updated.maxSalary || worker.salaryPerDay <= parseInt(updated.maxSalary);
      return locationMatch && workTypeMatch && salaryMatch;
    });

    setFilteredWorkers(filtered);
  };

  const uniqueLocations = [...new Set(workers.map(w => w.location || w.city).filter(Boolean))];
  const uniqueWorkTypes = [...new Set(workers.flatMap(w => w.skills || [w.workType]).filter(Boolean))];

  return (
    <>
      <Navbar profile={profile} onLogout={() => {
        localStorage.removeItem("token");
        navigate("/login");
      }} />

      <div className="container mt-4">
        <h2 className="mb-4 text-center">All Available Workers</h2>

        {/* Filter Panel */}
        <div className="card p-3 mb-4 shadow-sm">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Location</label>
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">All</option>
                {uniqueLocations.map((loc, i) => (
                  <option key={i} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Work Type</label>
              <select
                name="workType"
                value={filters.workType}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">All</option>
                {uniqueWorkTypes.map((type, i) => (
                  <option key={i} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Max Salary</label>
              <input
                type="number"
                name="maxSalary"
                value={filters.maxSalary}
                onChange={handleFilterChange}
                className="form-control"
                placeholder="e.g. 1000"
              />
            </div>
          </div>
        </div>

        {/* Worker Cards */}
        <div className="row">
          {filteredWorkers.length > 0 ? filteredWorkers.map((worker) => (
            <div className="col-md-4 mb-4" key={worker._id}>
              <div className="card h-100 shadow-sm p-3" style={{ borderRadius: "12px" }}>
                <div className="d-flex align-items-center mb-3">
                  {worker.photo ? (
                    <img
                      src={`data:image/jpeg;base64,${worker.photo}`}
                      alt={worker.name}
                      className="rounded-circle me-3"
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: "60px", height: "60px", fontSize: "0.8rem" }}
                    >
                      No Photo
                    </div>
                  )}
                  <div>
                    <h6 className="mb-0">{worker.name}</h6>
                    <div className="text-muted small">
                      ⭐ {worker.rating || "4.8"} &nbsp;•&nbsp; {worker.distance || "2.9"} miles
                    </div>
                    <div className="text-muted small">
                      📍 {worker.location || worker.city || "Unknown location"}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  {(worker.skills || [worker.workType]).map((skill, i) => (
                    <span key={i} className="badge bg-light text-dark me-2 mb-1">{skill}</span>
                  ))}
                </div>

                <p className={`fw-bold mb-1 ${busyWorkers[worker._id] ? "text-danger" : "text-success"}`}>
                  ● {busyWorkers[worker._id] ? "Busy" : "Available Now"}
                </p>

                <h5 className="fw-bold mb-3">₹{worker.salaryPerDay}/day</h5>

                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-success w-50 me-2"
                    onClick={() => handleBookNow(worker._id)}
                    disabled={busyWorkers[worker._id]}
                  >
                    {busyWorkers[worker._id] ? "Booked" : "Book Now"}
                  </button>
                  <button
                    className="btn btn-outline-secondary w-50"
                    onClick={() => {
                      localStorage.setItem("contactWorker", JSON.stringify(worker));
                      navigate("/contact");
                    }}
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center text-muted">No workers match the selected filters.</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Workers;
