import React, { useState, useEffect, useRef } from "react";
import {useNavigate} from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";

function Attractions() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [curatedList, setCuratedList] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const [editData, setEditData] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const curatedContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchCurated = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/curated/list`)
      .then((res) => res.json())
      .then((data) => {
        setCuratedList(Array.isArray(data) ? data : data.data || []);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCurated();
  }, []);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    let validFiles = [];
    let previewImages = [];
    const checkImageDimensions = (file) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          if (img.width === 400 && img.height === 250) {
            resolve(true);
          } else {
            resolve(false);
          }
        };
      });
    };

    const processFiles = async () => {
      for (let file of files) {
        const isValid = await checkImageDimensions(file);
        if (!isValid) {
          toast.error(`${file.name} is not 400 × 250 px`);
          continue;
        }
        validFiles.push(file);
        previewImages.push(URL.createObjectURL(file));
      }
      setImages(validFiles);
      setPreview(previewImages);
      if (validFiles.length === 0) {
        e.target.value = "";
      }
    };
    processFiles();
  };

  const handleUpload = () => {
    if (!title || !category || images.length === 0) {
      toast.info("Please fill all fields and select images");
      return;
    }
    setEditData(null);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
    const toastId = toast.loading("Uploading destination...");
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/curated/upload`, {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        await res.json().catch(() => null);
        toast.update(toastId, { render: "Image uploaded successfully", type: "success", isLoading: false, autoClose: 1000 });
        setTitle("");
        setCategory("");
        setImages([]);
        setPreview([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchCurated();
      })
      .catch((err) => {
        toast.update(toastId, { render: "Upload failed", type: "error", isLoading: false, autoClose: 1000 });
        console.log(err);
      });
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = (id) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/curated/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success(data.message);
        fetchCurated();
      })
      .catch((err) => console.error(err));
  };

  const openEditForm = (item) => {
    setEditData(item);
    setEditTitle(item.title);
    setEditCategory(item.category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = () => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/curated/update/${editData.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          category: editCategory,
        }),
      }
    )
    .then((res) => res.json())
    .then(() => {
      toast.success("Updated Successfully!");
      setEditData(null);
      fetchCurated();
    })
    .catch((err) => console.log(err));
  };

  return (
    <div className="curated-destinations-wrapper curated-destinations" style={{ 
      fontFamily: "'Montserrat', sans-serif",
      backgroundColor: "#fbfaff",
      minHeight: "100vh",
      width: "100%",
      maxWidth: "100%",
      padding: "30px",
      boxSizing: "border-box",
      overflowX: "hidden" 
    }}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');`}
      </style>

      <ToastContainer position="top-right" autoClose={1500} />
      
      <div className="d-flex justify-content-between align-items-center mb-2 w-100" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        <h2 className="text-dark fw-bold m-0">Attractions</h2>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-left me-1"></i> Back
        </button>
      </div>

      {editData && (
        <div className="card p-4 border-0 shadow-sm mb-4" style={{ borderRadius: "15px", background: "#ffffff", border: "1px solid #e0e0e0" }}>
          <h5 className="fw-bold mb-3" style={{ color: "#593983" }}>Edit Destination Details</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="fw-bold small text-muted text-uppercase mb-1">Title</label>
              <input
                className="form-control"
                style={{ borderRadius: "8px", fontFamily: "'Montserrat', sans-serif" }}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="fw-bold small text-muted text-uppercase mb-1">Category</label>
              <input
                className="form-control"
                style={{ borderRadius: "8px", fontFamily: "'Montserrat', sans-serif" }}
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
              />
            </div>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-success px-4 fw-bold" style={{ borderRadius: "8px" }} onClick={handleUpdate}>Save Changes</button>
            <button className="btn btn-light px-4 fw-bold" style={{ borderRadius: "8px", border: "1px solid #ddd" }} onClick={() => setEditData(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="card p-4 border-0 shadow-sm mb-5" style={{ borderRadius: "15px" }}>
        <h5 className="fw-bold mb-3">Add New Destination</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="fw-bold small text-dark text-uppercase mb-1">Destination Title</label>
            <input
              type="text"
              className="form-control"
              style={{ borderRadius: "8px", fontFamily: "'Montserrat', sans-serif" }}
              value={title}
              placeholder="e.g. Swiss Alps"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="fw-bold small text-dark text-uppercase mb-1">Category</label>
            <input
              type="text"
              className="form-control"
              style={{ borderRadius: "8px", fontFamily: "'Montserrat', sans-serif" }}
              value={category}
              placeholder="e.g. Adventure"
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="col-12 mb-4">
            <label className="fw-bold small text-dark text-uppercase mb-1">Images (3342 × 2131 px) <p className="small text-muted mb-0">(A file size below 5 MB is preferred)</p></label>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              className="form-control"
              style={{ borderRadius: "8px", fontFamily: "'Montserrat', sans-serif" }}
              onChange={handleImageSelect}
            />
          </div>
        </div>

        {preview.length > 0 && (
          <div className="d-flex gap-3 flex-wrap mb-4 p-3 bg-light rounded shadow-sm border">
            {preview.map((src, idx) => (
              <img key={idx} src={src} alt="preview" style={{ width: "100px", height: "65px", objectFit: "cover", borderRadius: "6px" }} />
            ))}
          </div>
        )}

        <button 
          className="btn text-white fw-bold py-2 px-5" 
          style={{ backgroundColor: "#593983", borderRadius: "8px", transition: "all 0.3s" }} 
          onClick={handleUpload}
        >
          Upload Image
        </button>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">Uploaded Gallery</h4>
        <span className="badge bg-white text-dark border px-3 py-2 fw-semibold" style={{ borderRadius: "8px" }}>{curatedList.length} Destinations</span>
      </div>

      <div
        ref={curatedContainerRef}
        className="curated-gallery"
        style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "20px",
        paddingRight: "5px",
        transform: "translateZ(0)", 
      }}
      >
        {Array.isArray(curatedList) && curatedList.map((item) => (
          <div
            key={item.id}
            className="curated-item"
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.03)",
              display: "flex",
              flexDirection: "column",
              padding: "12px",
              border: "1px solid #f0f0f0"
            }}
          >
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${item.filename}`}
              alt={item.title}
              loading="lazy"
              decoding="async"
              style={{
                width: "100%",
                height: "130px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "12px",
              }}
            />
            <div style={{ marginBottom: "15px" }}>
              <p className="fw-bold m-0 text-truncate" style={{ color: "#2d3436", fontSize: "14px" }}>{item.title}</p>
              <p className="text-dark m-0 text-truncate" style={{ fontSize: "12px", fontWeight: "500" }}>{item.category}</p>
            </div>

            <div className="w-100 d-flex flex-column gap-2 mt-auto">
              <button
                className="btn btn-outline-success btn-sm w-100 fw-bold"
                style={{ borderRadius: "6px", fontSize: "12px" }}
                onClick={() => openEditForm(item)}
              >
                Edit
              </button>
              <button
                className="btn btn-outline-danger btn-sm w-100 fw-bold"
                style={{ borderRadius: "6px", fontSize: "12px" }}
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {deleteId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start", 
            paddingTop: "50px",       
            zIndex: 9999
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              width: "450px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              overflow: "hidden",
              animation: "slideDown 0.3s ease-out" 
            }}
          >
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
              <h5 className="m-0 fw-bold" style={{ color: "#2d3436", fontSize: "1.1rem" }}>
                Are you sure you want to delete?
              </h5>
              <button 
                className="btn-close" 
                style={{ cursor: "pointer", fontSize: "0.8rem" }}
                onClick={() => setDeleteId(null)}
              ></button>
            </div>
            <div className="p-3 d-flex justify-content-end gap-2 border-top bg-light-subtle">
              <button
                className="btn fw-bold px-4"
                style={{ 
                    backgroundColor: "#6c757d", 
                    color: "white", 
                    borderRadius: "6px",
                    fontSize: "14px"
                }}
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="btn fw-bold px-4"
                style={{ 
                    backgroundColor: "#dc3545", 
                    color: "white", 
                    borderRadius: "6px",
                    fontSize: "14px"
                }}
                onClick={() => {
                  confirmDelete(deleteId);
                  setDeleteId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attractions;