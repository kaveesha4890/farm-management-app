import { useApp } from '../state/AppContext';
import { useState } from 'react';

export default function ReportsPage() {
  const { tunnels, plots, crops, harvests } = useApp();

  //Filter states
  const [selectedTunnel, setSelectedTunnel] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");

  // Combine data
  const rows = crops.map((crop) => {
    const tunnel = tunnels.find((t) => t.id === crop.tunnelId);
    const plot = plots.find((p) => p.id === crop.plotId);
    const relatedHarvests = harvests.filter((h) => h.cropId === crop.id);

    const totalHarvestQty = relatedHarvests.reduce((sum, h) => sum + h.quantity, 0);

    return {
      tunnel: tunnel?.name || '-',
      plot: plot?.name || '-',
      cropName: crop.name,
      plantingDate: crop.plantingDate,
      predictedYield: crop.predictedYield,
      numPlants: crop.numPlants,
      status: crop.status,
      totalHarvestQty,
    };
  });

  const filteredRows = rows.filter((r)=>{
    const tunnelMatch = selectedTunnel ? r.tunnel === selectedTunnel : true;
    const cropMatch = selectedCrop ? r.cropName === selectedCrop : true;
    return tunnelMatch && cropMatch;
  });

  return (
    <div className="container">
      <h1 className="page-title">All Records Report</h1>
      <p className="text-muted">A summary of all tunnels, plots, and crop performance.</p>

<div className="filters-row row" style={{ marginBottom: '16px' }}>
  {/* Tunnel Filter */}
  <div className="col">
    <select
      value={selectedTunnel}
      onChange={(e) => setSelectedTunnel(e.target.value)}
      className="select"
    >
      <option value="">All Tunnels</option>
      {tunnels.map((t) => (
        <option key={t.id} value={t.name}>
          {t.name}
        </option>
      ))}
    </select>
  </div>

  {/* Crop Filter */}
  <div className="col">
    <select
      value={selectedCrop}
      onChange={(e) => setSelectedCrop(e.target.value)}
      className="select"
    >
      <option value="">All Crops</option>
      {crops.map((c) => (
        <option key={c.id} value={c.name}>
          {c.name}
        </option>
      ))}
    </select>
  </div>

  {/* Reset Button */}
  <div className="col" style={{ flex: '0 0 auto' }}>
    <button
      onClick={() => {
        setSelectedTunnel('');
        setSelectedCrop('');
      }}
      className="btn secondary"
    >
      Reset Filters
    </button>
  </div>
</div>

      <div className="table-container card">
        <table className="table">
          <thead>
            <tr>
              <th>Tunnel</th>
              <th>Plot</th>
              <th>Crop Name</th>
              <th>Planting Date</th>
              <th>Number of Crops</th>
              <th>Predicted Yield</th>
              <th>Total Harvest</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length > 0 ? (
              filteredRows.map((r, i) => (
                <tr key={i}>
                  <td>{r.tunnel}</td>
                  <td>{r.plot}</td>
                  <td>{r.cropName}</td>
                  <td>{r.plantingDate}</td>
                  <td>{r.numPlants}</td>
                  <td>{r.predictedYield}</td>
                  <td>{r.totalHarvestQty}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        r.status === 'Completed'
                          ? 'available'
                          : r.status === 'Planted'
                          ? 'planted'
                          : ''
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-muted" style={{ textAlign: 'center', padding: '20px' }}>
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
