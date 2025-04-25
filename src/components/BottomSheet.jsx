import React, { useEffect, useState } from "react";
import "./BottomSheet.css"; // अगर आपके पास custom styles हैं

const BottomSheet = ({ selectedBus, stops, crossedStops, nextStop, etaToNext, distanceToNext }) => {
  const [sheetOpen, setSheetOpen] = useState(true);
  const [eta, setEta] = useState(etaToNext);
  const [distance, setDistance] = useState(distanceToNext);
  const [localCrossedStops, setLocalCrossedStops] = useState([]);

  useEffect(() => {
    const storedEta = localStorage.getItem(`etaToNext_${selectedBus}`);
    const storedDistance = localStorage.getItem(`distanceToNext_${selectedBus}`);
    const storedCrossedStops = localStorage.getItem(`crossedStops_${selectedBus}`);

    if (!etaToNext && storedEta) setEta(storedEta);
    else setEta(etaToNext);

    if (!distanceToNext && storedDistance) setDistance(storedDistance);
    else setDistance(distanceToNext);

    if (storedCrossedStops) {
      try {
        setLocalCrossedStops(JSON.parse(storedCrossedStops));
      } catch (e) {
        console.error("Error parsing crossed stops from localStorage:", e);
      }
    }
  }, [selectedBus, etaToNext, distanceToNext]);

  const finalCrossedStops = crossedStops.length ? crossedStops : localCrossedStops;

  return (
    <div
      style={{
        position: "fixed",
        bottom: sheetOpen ? 0 : "-300px",
        left: 0,
        right: 0,
        backgroundColor: "#222",
        color: "white",
        padding: "16px",
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
        boxShadow: "0px -4px 10px rgba(0,0,0,0.3)",
        transition: "bottom 0.3s ease-in-out",
        maxHeight: "40vh",
        overflowY: "auto",
        zIndex: 999,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <button
          onClick={() => setSheetOpen(!sheetOpen)}
          style={{
            backgroundColor: "#444",
            border: "none",
            padding: "6px 20px",
            borderRadius: "20px",
            color: "white",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          {sheetOpen ? "↓" : "↑"} Stops Info
        </button>
        <h3>Bus {selectedBus}</h3>
        {nextStop && (
          <div style={{ marginBottom: "10px" }}>
            <strong>Next Stop:</strong> {nextStop.name} <br />
            <strong>ETA:</strong> {eta} min | <strong>Distance:</strong> {distance} km
          </div>
        )}
      </div>

      <div>
        {stops.map((stop, index) => {
          const crossed = finalCrossedStops.includes(index);
          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: crossed ? "green" : "white",
                  marginRight: "10px",
                }}
              />
              <div>
                {stop.name}
                {crossed && <span style={{ marginLeft: "10px", color: "lightgreen" }}>✔ Crossed</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BottomSheet;
