// ✅ FINAL VERSION - MapComponent.jsx with Reverse Mode Support
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import haversine from "haversine-distance";
import { getDatabase, ref, onValue, set, get, remove } from "firebase/database";
import { initializeApp } from "firebase/app";
import BottomSheet from "./BottomSheet";
import busIconImg from "../assets/bus-stop.png";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBZEdKIXhLCxbmkTnS_xfNR490-jKlf9yw",
  authDomain: "my-collage-bus-tracker-964e8.firebaseapp.com",
  databaseURL: "https://my-collage-bus-tracker-964e8-default-rtdb.firebaseio.com",
  projectId: "my-collage-bus-tracker-964e8",
  storageBucket: "my-collage-bus-tracker-964e8.appspot.com",
  messagingSenderId: "127234319162",
  appId: "1:127234319162:web:b1965e4abaa5ec0fe26603",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const MapComponent = () => {
  const [selectedBus, setSelectedBus] = useState("101");
  const [crossedStops, setCrossedStops] = useState([]);
  const [nextStop, setNextStop] = useState(null);
  const [distanceToNext, setDistanceToNext] = useState(null);
  const [etaToNext, setEtaToNext] = useState(null);
  // const [reverse, setReverse] = useState(null);
  const [reverse, setReverse] = useState(() => {
    return localStorage.getItem("reverseMode") === "true";
  });

  const mapRef = useRef(null);
  const routingRef = useRef(null);
  const busMarkerRef = useRef(null);
  const markerGroupRef = useRef(null);
  const currentStopIndexRef = useRef(0);
  const manitGateCrossedRef = useRef(false);
  const approachingStopRef = useRef(null);
  const crossedFetchedRef = useRef(false);
  const routeControlRef = useRef(null);

  const bus101Stops = [
    { lat: 23.217883940082572, lng: 77.4056126070792, name: "MANIT GATE" },
    { lat: 23.237493644198405, lng: 77.40106552863337, name: "ROSHANPURA SQUARE" },
    { lat: 23.255608322309183, lng: 77.39859373642582, name: "KAMLA PARK ROAD" },
    { lat: 23.264794941124965, lng: 77.38083701795655, name: "KOHEFIZA SQUARE" },
    { lat: 23.272809976494436, lng: 77.37020054239919, name: "LALGHATI SQAURE" },
    { lat: 23.274183057840972, lng: 77.35787572587991, name: "HALALPURA" },
    { lat: 23.270678893274773, lng: 77.33365800162316, name: "SANT HINDARAM" },
    { lat: 23.278501935686304, lng: 77.3337703005592, name: "BAIRAGARH" },
    { lat: 23.279860095934165, lng: 77.34384117716303, name: "ANCHAVATI COLONY" },
    { lat:23.310765109765725, lng: 77.36185866457134, name: "RGPV" },
  ];

  const bus102Stops = [
    { lat: 23.217883940082572, lng: 77.4056126070792, name: "MANIT GATE" },
    { lat: 23.22117260222136,   lng:77.40370792701171 ,name: "MANIT square" },
    { lat: 23.22467133927969,  lng: 77.40208911319817, name: "TULSI NAGAR" },
    { lat:23.226978628481756,  lng:77.40914853627423,   name: "2nd stop"},
    { lat: 23.23135107787127, lng: 77.41897393824748, name: "SHIVAJI NAGAR" },
    { lat: 23.231088634906328, lng: 77.43253482077027, name: "MP NAGAR" },
    { lat: 23.240235261598517, lng: 77.42289717469222, name: "ARERA HILLS" },
    { lat: 23.252707541322973, lng: 77.41389676964619, name: "JAHANGIRABAD" },
    { lat: 23.24804148287806, lng: 77.43149047389336, name: "OLD SUBHASH NAGAR" },
    { lat: 23.251952047973347, lng: 77.43091951938048, name: "NEW SUBHASH NAGAR" },
    { lat: 23.25910522393857, lng: 77.43149047389336, name: "ASHOKA GARDEN" },
    { lat: 23.26495162779652, lng: 77.4233056574509, name: "KRISHNA CAMPUS" },
    { lat: 23.264905602067927, lng: 77.41344757452178, name: "NAVBHAR COLONY" },
    { lat: 23.267436185272977, lng: 77.41435658883637, name: "BHOPAL JUNCTION" },
  ];

  const originalStops = selectedBus === "101" ? bus101Stops : bus102Stops;
  const stops = reverse ? [...originalStops].reverse() : originalStops;

  const busRef = ref(db, `busLocations/${selectedBus}`);
  const crossedStopsRef = ref(db, `crossedStops/${selectedBus}${reverse ? "_rev" : ""}`);

  const fetchCrossed = async () => {
    const snapshot = await get(crossedStopsRef);
    const data = snapshot.val();
    if (data?.manitGateCrossed) {
      manitGateCrossedRef.current = true;
      setCrossedStops(data.list || []);
      currentStopIndexRef.current = (data.list?.slice(-1)[0] || 0) + 1;
    } else {
      setCrossedStops([]);
      manitGateCrossedRef.current = false;
      currentStopIndexRef.current = 0;
    }
    crossedFetchedRef.current = true;
  };

  useEffect(() => {
    crossedFetchedRef.current = false;
    fetchCrossed();
    approachingStopRef.current = null;

    // 🧼 Clean old marker/routes
    busMarkerRef.current?.remove();
    busMarkerRef.current = null;
    markerGroupRef.current?.clearLayers();
    routeControlRef.current?.remove();
  }, [selectedBus, reverse]);

  useEffect(() => {
    const map = mapRef.current || L.map("map").setView([23.23, 77.41], 13);
    if (!mapRef.current) {
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
      mapRef.current = map;
    }

    markerGroupRef.current?.clearLayers();
    routingRef.current?.remove();
    busMarkerRef.current?.remove();

    const markerGroup = L.layerGroup();
    stops.forEach((stop, i) => {
      const marker = L.circleMarker([stop.lat, stop.lng], {
        radius: 8,
        color: crossedStops.includes(i) ? "green" : "white",
        fillColor: crossedStops.includes(i) ? "green" : "white",
        fillOpacity: 1,
        weight: 2,
      }).bindPopup(`<b>${stop.name}</b>`);
      markerGroup.addLayer(marker);
    });
    markerGroup.addTo(map);
    markerGroupRef.current = markerGroup;

    routingRef.current = L.Routing.control({
      waypoints: stops.map((s) => L.latLng(s.lat, s.lng)),
      lineOptions: { styles: [{ color: "black", weight: 4 }] },
      createMarker: () => null,
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
    }).addTo(map);
  }, [selectedBus, crossedStops, reverse]);

  
  useEffect(() => {
    if (!mapRef.current) return;
  
    const map = mapRef.current;
    let userMarker;
  
    const showUserLocation = () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
  
          const userLatLng = L.latLng(latitude, longitude);
  
          userMarker = L.circleMarker(userLatLng, {
            radius: 10,
            color: "blue",
            fillColor: "blue",
            fillOpacity: 1,
          })
            .bindPopup("You are here")
            .addTo(map);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    };
  
    showUserLocation();
  
    // हर 30 सेकंड में location update
    const interval = setInterval(() => {
      if (userMarker) userMarker.remove();
      showUserLocation();
    }, 30000);
  
    return () => {
      clearInterval(interval);
      if (userMarker) userMarker.remove();
    };
  }, []);
  
  
  useEffect(() => {
    const unsubscribe = onValue(busRef, (snapshot) => {
      if (!crossedFetchedRef.current) return;
      const busData = snapshot.val();
      if (!busData?.lat || !busData?.lng) return;

      const currentLatLng = [busData.lat, busData.lng];
      if (!busMarkerRef.current) {
        const busIcon = L.icon({
          iconUrl: busIconImg,
          iconSize: [35, 35],
          iconAnchor: [17, 34],
        });
        busMarkerRef.current = L.marker(currentLatLng, { icon: busIcon }).addTo(mapRef.current);
        mapRef.current.setView(currentLatLng, 15);
      } else {
        busMarkerRef.current.setLatLng(currentLatLng);
      }

      const firstStop = stops[0];
      const distFromFirst = haversine(currentLatLng, [firstStop.lat, firstStop.lng]) / 1000;

      if (!manitGateCrossedRef.current && distFromFirst < 0.2) {
        manitGateCrossedRef.current = true;
        const updated = [0];
        setCrossedStops(updated);
        currentStopIndexRef.current = 1;
        set(crossedStopsRef, {
          list: updated,
          manitGateCrossed: true,
        });
        return;
      }

      if (!manitGateCrossedRef.current) return;

      const nextIndex = currentStopIndexRef.current;
      const next = stops[nextIndex];
      if (next) {
        const router = L.Routing.control({
          waypoints: [L.latLng(busData.lat, busData.lng), L.latLng(next.lat, next.lng)],
          createMarker: () => null,
          addWaypoints: false,
          routeWhileDragging: false,
        });

        router.on("routesfound", function (e) {
          const route = e.routes[0];
          const dist = route.summary.totalDistance / 1000;
          const eta = route.summary.totalTime / 60;

          setNextStop(next);
          setDistanceToNext(dist.toFixed(2));
          setEtaToNext(eta.toFixed(1));

          if (dist < 0.165 && approachingStopRef.current !== nextIndex) {
            approachingStopRef.current = nextIndex;
          }

          if (approachingStopRef.current === nextIndex && dist > 0.2) {
            const updated = [...crossedStops, nextIndex];
            setCrossedStops(updated);
            currentStopIndexRef.current = nextIndex + 1;
            set(crossedStopsRef, {
              list: updated,
              manitGateCrossed: true,
            });
            approachingStopRef.current = null;
          }
        });

        router.addTo(mapRef.current);
        setTimeout(() => mapRef.current.removeControl(router), 3000);
      }
    });

    return () => unsubscribe();
  }, [selectedBus, crossedStops, reverse]);

  const handleResetStops = async () => {
    await remove(crossedStopsRef);
    setCrossedStops([]);
    currentStopIndexRef.current = 0;
    manitGateCrossedRef.current = false;
    approachingStopRef.current = null;
    setNextStop(null);
    setEtaToNext(null);
    setDistanceToNext(null);
    fetchCrossed();
  };

  return (
    <div>
      <div style={{ padding: "10px" }}>
        <button onClick={() => setSelectedBus("101")}>Bus 101</button>
        <button onClick={() => setSelectedBus("102")}>Bus 102</button>
        <button onClick={handleResetStops} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>
          Reset Stops
        </button>
        {/* <label style={{ marginLeft: "20px" }}>
          <input type="checkbox" checked={reverse} onChange={(e) => setReverse(e.target.checked)} />
          Reverse Route
        </label> */}

<label style={{ marginLeft: "20px" }}>
  <input
    type="checkbox"
    checked={reverse}
    onChange={(e) => {
      setReverse(e.target.checked);
      localStorage.setItem("reverseMode", e.target.checked);
    }}
  />
  Reverse Route
</label>

      </div>

      <div id="map" style={{ height: "75vh", width: "100%" }}></div>

      <BottomSheet
        selectedBus={selectedBus}
        stops={stops}
        crossedStops={crossedStops}
        nextStop={nextStop}
        etaToNext={etaToNext}
        distanceToNext={distanceToNext}
      />
    </div>
  );
};

export default MapComponent;
