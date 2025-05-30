// src/components/Tabs.jsx
import React from "react";

export const Tabs = ({ activeTab, onChangeTab, tabs }) => (
  <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onChangeTab(tab)}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: activeTab === tab ? "#007bff" : "#444",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
      >
        {tab}
      </button>
    ))}
  </div>
);
