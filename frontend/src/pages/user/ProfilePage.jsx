import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { AuthContext } from "../../contexts/AuthContext";

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    mobile: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ Fetch user profile
  useEffect(() => {
    if (!user?.token) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setFormData({
          name: data.name || "",
          email: data.email || "",
          gender: data.gender || "",
          dateOfBirth: data.dateOfBirth || "",
          mobile: data.mobile || "",
          address: data.address || "",
        });

        setProfileImage(data.profileImage || null);
      } catch (err) {
        console.error("❌ Fetch profile failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // ✅ Input Change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  // ✅ Image Preview
  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setProfileImage(URL.createObjectURL(selectedFile));
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    const enteredDate = new Date(formData.dateOfBirth);

    if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "📱 Mobile number must be exactly 10 digits.";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "📅 Please enter your date of birth.";
    } else if (enteredDate > today) {
      newErrors.dateOfBirth = "🚫 Date of birth cannot be in the future.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Save updated profile
  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.token) return;
    if (!validateForm()) return;

    const form = new FormData();
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));
    if (file) form.append("profileImage", file);

    try {
      const { data } = await api.put("/api/user/profile", form, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({
        name: data.name || "",
        email: data.email || "",
        gender: data.gender || "",
        dateOfBirth: data.dateOfBirth || "",
        mobile: data.mobile || "",
        address: data.address || "",
      });

      setProfileImage(data.profileImage || null);
      setUser({ ...user, ...data });
      setEditing(false);
      setMessage("✅ Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("❌ Update failed:", err.response?.data || err);
      setMessage("❌ Profile update failed. Try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        position: "relative",
        maxWidth: "900px",
        margin: "50px auto",
        padding: "30px 40px",
        background: "#0f0f0f",
        borderRadius: "12px",
        color: "#fff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}
    >
      {/* ✅ Floating Message */}
      {message && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            background: message.includes("✅") ? "#10b981" : "#ef4444",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
          }}
        >
          {message}
        </div>
      )}

      {/* ❌ Close */}
      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "25px",
          background: "transparent",
          color: "#facc15",
          border: "none",
          fontSize: "26px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        onMouseOver={(e) => (e.target.style.color = "#ef4444")}
        onMouseOut={(e) => (e.target.style.color = "#facc15")}
      >
        ✖
      </button>

      <h2
        style={{
          textAlign: "center",
          fontSize: "26px",
          fontWeight: "bold",
          color: "#facc15",
          marginBottom: "25px",
        }}
      >
        My Account
      </h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <form onSubmit={handleSave}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
            {/* 🖼 Profile Image */}
            <div style={{ flex: "0 0 220px", textAlign: "center" }}>
              <img
                src={
                  profileImage?.startsWith("blob:")
                    ? profileImage
                    : profileImage
                    ? profileImage.startsWith("/uploads/")
                      ? `http://localhost:5000${profileImage}`
                      : profileImage
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Profile"
                style={{
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  border: "3px solid #facc15",
                  objectFit: "cover",
                }}
              />
              {editing && (
                <label
                  style={{
                    display: "block",
                    marginTop: "10px",
                    background: "#facc15",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: "#111",
                  }}
                >
                  📸 Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>

            {/* 🧾 Info Fields */}
            <div style={{ flex: 1, minWidth: "350px" }}>
              {[
                "name",
                "email",
                "gender",
                "dateOfBirth",
                "mobile",
                "address",
              ].map((field) => (
                <div key={field} style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "600",
                    }}
                  >
                    {field === "dateOfBirth"
                      ? "Date of Birth"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                    :
                  </label>

                  {field === "gender" ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      disabled={!editing}
                      style={inputStyle}
                    >
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  ) : field === "address" ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!editing}
                      style={{ ...inputStyle, height: "70px" }}
                    />
                  ) : field === "dateOfBirth" ? (
                    // 🗓️ Custom calendar-style date input
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      disabled={!editing}
                      style={{
                        ...inputStyle,
                        cursor: editing ? "pointer" : "not-allowed",
                      }}
                      max={new Date().toISOString().split("T")[0]}
                      onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                    />
                  ) : (
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                      disabled={field === "email" || !editing}
                      style={inputStyle}
                    />
                  )}

                  {errors[field] && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "13px",
                        marginTop: "5px",
                      }}
                    >
                      {errors[field]}
                    </p>
                  )}
                </div>
              ))}

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setEditing(!editing)}
                  style={btnYellow}
                >
                  ✏️ {editing ? "Cancel" : "Edit Profile"}
                </button>

                {editing && (
                  <button type="submit" style={btnGreen}>
                    💾 Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

// ✅ Shared Styles
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #444",
  background: "#1a1a1a",
  color: "#fff",
  fontSize: "15px",
};

const btnYellow = {
  background: "#facc15",
  color: "#111",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const btnGreen = {
  background: "#10b981",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default ProfilePage;
