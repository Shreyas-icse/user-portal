import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../api";
import { getWorkerLiveLocation } from "../../workerApi";
import Navbar from "./Navbar";

function ContactPage() {
  const [worker, setWorker] = useState(null);
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewInput, setReviewInput] = useState("");
  const [reviews, setReviews] = useState([]);
  const [profile, setProfile] = useState(null);
  const [liveLocation, setLiveLocation] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await getProfile(token);
      if (res._id) {
        setProfile(res);
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

  useEffect(() => {
    const stored = localStorage.getItem("contactWorker");
    if (stored) {
      const parsed = JSON.parse(stored);
      setWorker(parsed);

      const savedReviews =
        JSON.parse(localStorage.getItem(`reviews_${parsed._id}`)) || [];
      setReviews(savedReviews);
    }
  }, []);

  const handleReviewSubmit = () => {
    if (!reviewInput) return alert("Please enter a review.");

    const newReview = {
      id: Date.now(),
      rating: ratingInput,
      comment: reviewInput,
      name: `User${Math.floor(Math.random() * 1000)}`,
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${worker._id}`, JSON.stringify(updatedReviews));
    setReviewInput("");
    setRatingInput(5);
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return worker?.rating || "4.8";
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    return avg.toFixed(1);
  };

  const workerId = useMemo(() => worker?._id, [worker]);

  useEffect(() => {
    if (!workerId) return;
    let isMounted = true;

    (async () => {
      try {
        const latest = await getWorkerLiveLocation(workerId);
        if (!isMounted) return;
        if (latest.location) {
          setLiveLocation(latest.location);
          setLocationStatus(
            latest.location.updatedAt
              ? `Live location shared at ${new Date(latest.location.updatedAt).toLocaleString()}`
              : "Live location available."
          );
        } else {
          setLiveLocation(null);
          setLocationStatus("Live location not shared yet.");
        }
      } catch (err) {
        console.error("Fetching live location failed", err);
        if (isMounted) setLocationStatus("Unable to fetch live location right now.");
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [workerId]);

  const handleTrackClick = async () => {
    if (!workerId) return;
    const fallbackDestination = worker?.location || worker?.city;

    setTrackLoading(true);
    setLocationStatus("📍 Fetching worker's live location...");
    
    try {
      const latest = await getWorkerLiveLocation(workerId);
      
      if (latest.location?.latitude && latest.location?.longitude) {
        const { latitude, longitude, accuracy, updatedAt } = latest.location;
        const lat = Number(latitude);
        const lng = Number(longitude);
        
        // Verify coordinates are valid
        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          throw new Error("Invalid coordinates received");
        }

        setLiveLocation(latest.location);
        
        // Get employer's city (origin) from profile.city
        const employerOrigin = profile?.city ? encodeURIComponent(profile.city) : 'My+Location';
        // Use 'origin=' + employerOrigin in Google Maps direction links, for both live coordinates and fallback/address.
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${employerOrigin}&destination=${lat},${lng}`;
        window.open(mapsUrl, "_blank", "noopener,noreferrer");
        
        const timeAgo = updatedAt 
          ? new Date(updatedAt).toLocaleString()
          : "just now";
        
        const accuracyText = accuracy 
          ? ` (Accuracy: ±${Math.round(accuracy)}m)`
          : "";
        
        setLocationStatus(
          `✅ Using worker's live location: ${lat.toFixed(6)}, ${lng.toFixed(6)}${accuracyText} | Shared: ${timeAgo}`
        );
        return;
      }

      // Fallback to registered address
      if (fallbackDestination) {
        const employerOrigin = profile?.city ? encodeURIComponent(profile.city) : 'My+Location';
        window.open(
          `https://www.google.com/maps/dir/?api=1&origin=${employerOrigin}&destination=${encodeURIComponent(fallbackDestination)}`,
          "_blank",
          "noopener,noreferrer"
        );
        setLocationStatus("⚠️ Worker has not shared a live location yet. Showing manual address or city instead.");
        alert("Worker has not shared a live location yet. Showing manual address/city instead.");
      } else {
        setLocationStatus("❌ Worker has not shared any location yet.");
        alert("Worker has not shared any location yet.");
      }
    } catch (err) {
      console.error("Track click error", err);
      setLocationStatus(`❌ Error: ${err.message || "Unable to fetch live location"}`);
      
      if (fallbackDestination) {
        const employerOrigin = profile?.city ? encodeURIComponent(profile.city) : 'My+Location';
        window.open(
          `https://www.google.com/maps/dir/?api=1&origin=${employerOrigin}&destination=${encodeURIComponent(fallbackDestination)}`,
          "_blank",
          "noopener,noreferrer"
        );
        alert("Unable to fetch live location. Showing manual address/city instead.");
      } else {
        alert("Unable to fetch live location for this worker.");
      }
    } finally {
      setTrackLoading(false);
    }
  };

  const handleTranslatorClick = () => {
    window.open(
      "https://translate.google.com/?sl=auto&tl=en&op=translate",
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (!worker) {
    return <p className="text-center mt-5">No worker selected to contact.</p>;
  }

  const {
    name = "Worker",
    phone,
    email,
    location,
    city,
    photo,
    skills,
    workType,
    salaryPerDay,
  } = worker;

  return (
    <>
      <Navbar profile={profile} onLogout={handleLogout} />
      <div className="container mt-5 mb-5">
        <h2 className="mb-4 text-center">Contact {name}</h2>
        <div className="card p-4 shadow" style={{ borderRadius: "12px" }}>
          <div className="d-flex align-items-center mb-3">
            {photo ? (
              <img
                src={`data:image/jpeg;base64,${photo}`}
                alt={name}
                className="rounded-circle me-3"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: "80px", height: "80px", fontSize: "0.9rem" }}
              >
                No Photo
              </div>
            )}
            <div>
              <h4 className="mb-1">{name}</h4>
              <p className="mb-0 text-muted">⭐ {calculateAverageRating()} / 5</p>
              <p className="mb-0 text-muted">
                📍 {location || city || "Unknown location"}
              </p>
            </div>
          </div>

          <p><strong>Phone:</strong> {phone || "N/A"}</p>
          <p><strong>Email:</strong> {email || "N/A"}</p>
          <p><strong>Skills:</strong> {(skills || [workType]).join(", ")}</p>
          <p><strong>Salary:</strong> ₹{salaryPerDay}/day</p>
          <a href="https://youtu.be/dQw4w9WgXcQ?si=EoVaywP0ztbChvzd" target="_blank" rel="noreferrer">View Video &gt;&gt;</a>

          <div className="d-flex flex-wrap gap-3 mt-4">
            <a href={`tel:${phone}`} className="btn btn-outline-primary">📞 Call</a>
            <a href={`http://127.0.0.1:5500/sms/index.html`} className="btn btn-outline-secondary">📧 Email</a>
            <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" className="btn btn-outline-success">💬 WhatsApp</a>
            <button
              type="button"
              className="btn btn-outline-info"
              onClick={handleTrackClick}
              disabled={trackLoading}
            >
              {trackLoading ? "Locating..." : "📍 Track"}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={handleTranslatorClick}>
              🗣️ Translator
            </button>
          </div>
          {locationStatus && (
            <p className="text-muted small mt-2">{locationStatus}</p>
          )}
          {liveLocation?.latitude != null && liveLocation?.longitude != null && (
            <p className="text-muted small mb-0">
              Lat: {liveLocation.latitude.toFixed(5)}, Lng: {liveLocation.longitude.toFixed(5)}
              {liveLocation.accuracy && (
                <> (±{Math.round(liveLocation.accuracy)} m)</>
              )}
            </p>
          )}
        </div>

        <div className="card p-4 shadow mt-4" style={{ borderRadius: "12px" }}>
          <h5 className="mb-3">Leave a Rating & Review</h5>
          <div className="mb-3 d-flex align-items-center">
            <label className="me-2">Rating:</label>
            <select
              value={ratingInput}
              onChange={(e) => setRatingInput(Number(e.target.value))}
              className="form-select w-auto"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <textarea
            className="form-control mb-3"
            rows="3"
            placeholder="Write your review here..."
            value={reviewInput}
            onChange={(e) => setReviewInput(e.target.value)}
          ></textarea>
          <button className="btn btn-primary" onClick={handleReviewSubmit}>
            Submit Review
          </button>
        </div>

        {reviews.length > 0 && (
          <div className="card p-4 shadow mt-4" style={{ borderRadius: "12px" }}>
            <h5 className="mb-3">User Reviews ({reviews.length})</h5>
            {reviews.map((rev) => (
              <div key={rev.id} className="border-bottom pb-2 mb-2">
                <p className="mb-1 fw-bold">{rev.name}</p>
                <p className="mb-1">⭐ {rev.rating}</p>
                <p className="mb-0 text-muted">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </>
  );
}

export default ContactPage;
