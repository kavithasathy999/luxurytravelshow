import React, { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";

function StallPricing() {
  const [zones, setZones] = useState([]);
  const [activeZone, setActiveZone] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState(null); 
  const navigate = useNavigate();

  const fetchZones = () => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/zones`)
      .then(res => setZones(res.data))
      .catch(() => toast.error("Error fetching zones"));
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const updatePrice = (stallId, price) => {
    setLoadingId(true);
    axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/update-stall-price/${stallId}`, {
      price
    })
      .then(() => {
        toast.success("Price Updated Successfully");
        fetchZones();
      })
      .catch(() => toast.error("Update failed"))
      .finally(() => setLoadingId(false));
  };

  return (
    <div className="container" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <ToastContainer position="top-right" autoClose={1500} />
      <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        <h2 className="text-dark fw-bold m-0">Assign Stalls Price</h2>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-left me-1"></i> Back
        </button>
      </div>
      <div className="position-relative mb-4">
        <input type="text" placeholder="Search for a zone..." className="form-control" 
          style={{ height: "65px", fontSize: "16px", paddingRight: "45px" }}
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())} 
        />
        <i className="fas fa-search" style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", color: "#888", pointerEvents: "none" }}></i>
      </div>
      {zones.filter(zone => zone.name.toLowerCase().includes(searchTerm)).filter(zone => activeZone === null || activeZone === zone.id)
        .map(zone => (
          <div key={zone.id} className="mb-4">
            <div className="card mb-3 border-0"
              style={{
                cursor: "pointer",
                borderRadius: "16px",
                boxShadow: activeZone === zone.id
                  ? "0 10px 30px rgba(0,0,0,0.1)"
                  : "0 4px 12px rgba(0,0,0,0.05)",
                transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
                background: activeZone === zone.id ? "#ffffff" : "#fdfdfd",
                borderLeft: activeZone === zone.id ? "5px solid #0d6efd" : "5px solid transparent"
              }}
              onClick={() => setActiveZone(activeZone === zone.id ? null : zone.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = activeZone === zone.id
                  ? "0 10px 30px rgba(0,0,0,0.1)"
                  : "0 4px 12px rgba(0,0,0,0.05)";
              }}
            >
              <div className="card-body d-flex justify-content-between align-items-center py-4 px-4">
                <div>
                  <h4 className="fw-bold m-0 text-dark">Zone {zone.name}</h4>
                </div>
                <div style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "50%", 
                  background: "#f8f9fa",
                  color: "#333",
                  display: "grid", 
                  placeItems: "center",
                  transition: "0.3s"
                }}>
                  <i className="fas fa-chevron-right" style={{ fontSize: "14px", transform: activeZone === zone.id ? "rotate(90deg)" : "rotate(0deg)", transition: "0.3s" }}></i>
                </div>
              </div>
            </div>
            {activeZone === zone.id && (
              <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "16px" }}>
                <table className="table table-bordered mb-0"> 
                  <thead style={{ backgroundColor: "#f8f9fa" }}>
                    <tr>
                      <th className="py-3 ps-4 text-dark small fw-bold">STALL NO</th>
                      <th className="py-3 text-dark small fw-bold">STATUS</th>
                      <th className="py-3 text-dark small fw-bold">PRICE (₹)</th>
                      <th className="py-3 pe-4 text-center text-dark small fw-bold" style={{ width: "120px" }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="border-top-0">
                    {zone.stalls
                      .slice()
                      .sort((a, b) => parseInt(a.stall_no) - parseInt(b.stall_no))
                      .map(stall => (
                        <tr key={stall.id} style={{ verticalAlign: "middle" }}>
                          <td className="py-3 ps-4 fw-bold text-dark" style={{fontSize: "14px"}}>{stall.stall_no}</td>
                          <td className="py-3">
                            <span className={`badge ${stall.isBooked ? "bg-light text-danger" : "bg-light text-success"}`} style={{ borderRadius: "6px", padding: "6px 10px", fontSize: "14px" }}>
                              {stall.isBooked ? "Booked" : "Available"}
                            </span>
                          </td>
                          <td className="py-3" style={{ width: "200px" }}>
                            <div className="input-group input-group-sm">
                              <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "8px 0 0 8px" }}>₹</span>
                              <input
                                type="number"
                                min="0"
                                step="1"
                                defaultValue={parseInt(stall.price) || 0}
                                onChange={(e) => {
                                  let value = parseInt(e.target.value) || 0;
                                  if (value < 0) value = 0;
                                  stall.tempPrice = value;
                                  e.target.value = value;
                                }}
                                className="form-control border-start-0"
                                style={{ borderRadius: "0 8px 8px 0", fontWeight: "600", fontSize: "14px" }}
                              />
                            </div>
                          </td>
                          <td className="py-3 pe-4 text-center">
                            <button
                              className="btn btn-primary btn-sm shadow-sm"
                              style={{ 
                                borderRadius: "8px", 
                                fontWeight: "600", 
                                fontSize: "14px",
                                minWidth: "90px", 
                                height: "34px",   
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                              disabled={loadingId === stall.id} 
                              onClick={() => updatePrice(stall.id, stall.tempPrice ?? stall.price)}
                            >
                              {loadingId === stall.id ? (
                                <span className="spinner-border spinner-border-sm"></span>
                              ) : (
                                "Update"
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

export default StallPricing;