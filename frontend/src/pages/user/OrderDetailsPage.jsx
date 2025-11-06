import React from "react";
import { FaBox, FaTruck, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";

const styles = {
  trackerContainer: {
    backgroundColor: "#1f2937",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #374151",
    color: "#f9fafb",
  },
  timeline: {
    position: "relative",
    paddingLeft: "25px",
  },
  timelineLine: {
    position: "absolute",
    left: "10px",
    top: "0",
    bottom: "0",
    width: "2px",
    backgroundColor: "#4b5563",
  },
  timelineItem: {
    marginBottom: "20px",
    position: "relative",
  },
  statusDot: {
    position: "absolute",
    left: "-18px",
    top: "0",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#6b7280",
    border: "2px solid #1f2937",
    zIndex: 10,
  },
  activeDot: {
    backgroundColor: "#3b82f6",
    width: "16px",
    height: "16px",
    left: "-20px",
    top: "-2px",
    boxShadow: "0 0 10px rgba(59,130,246,0.7)",
  },
  statusText: {
    fontWeight: "600",
    fontSize: "16px",
    margin: "0 0 4px 0",
  },
  timestampText: {
    fontSize: "14px",
    color: "#9ca3af",
    margin: "0",
  },
  locationText: {
    fontSize: "14px",
    color: "#d1d5db",
    margin: "4px 0 0 0",
  },
  icon: {
    marginRight: "8px",
  },
};

const OrderStatusTracker = ({ statusUpdates = [] }) => {
  const sortedUpdates = [...statusUpdates].reverse();
  const latestStatus = sortedUpdates[0]?.status || "";

  // Choose the correct icon for each status
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <FaHourglassHalf style={{ ...styles.icon, color: "#facc15" }} />;
      case "shipped":
        return <FaTruck style={{ ...styles.icon, color: "#3b82f6" }} />;
      case "delivered":
        return <FaCheckCircle style={{ ...styles.icon, color: "#10b981" }} />;
      default:
        return <FaBox style={{ ...styles.icon, color: "#9ca3af" }} />;
    }
  };

  return (
    <div style={styles.trackerContainer}>
      <h3 style={{ marginBottom: "15px", color: "#60a5fa" }}>📍 Order Tracking</h3>
      <div style={styles.timeline}>
        <div style={styles.timelineLine}></div>

        {sortedUpdates.map((update, index) => {
          const isActive = index === 0;
          const isDelivered = update.status.toLowerCase() === "delivered";

          let dotStyle = styles.statusDot;
          if (isActive) {
            dotStyle = {
              ...dotStyle,
              ...styles.activeDot,
              backgroundColor: isDelivered ? "#10b981" : "#3b82f6",
            };
          }

          return (
            <div key={index} style={styles.timelineItem}>
              <div style={dotStyle}></div>
              <p
                style={{
                  ...styles.statusText,
                  color: isActive ? "#e5e7eb" : "#d1d5db",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {getStatusIcon(update.status)} {update.status}
              </p>
              <p style={styles.timestampText}>
                {new Date(update.timestamp).toLocaleString()}
              </p>
              {update.location && (
                <p style={styles.locationText}>
                  <strong>Location:</strong> {update.location}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTracker;
