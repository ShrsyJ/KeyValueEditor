/**
 * Example showing how to use different grid components
 * This file is for reference only - not part of the main app
 */

import { useState } from "react";
import { RecordsTable } from "./components/RecordsTable";
import { RecordsGrid } from "./components/RecordsGrid";
import { RecordsGridAdvanced } from "./components/RecordsGridAdvanced";
import { useRecords } from "./hooks/useRecords";

/**
 * EXAMPLE 1: Simple App with RecordsTable (Current Setup)
 */
export function AppWithRecordsTable() {
  const { records } = useRecords();
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Key-Value Editor</h1>
      </header>
      <main className="app-main">
        <section className="panel">
          <h2>Records</h2>
          <RecordsTable
            records={records}
            selectedId={selectedRecordId}
            onSelect={setSelectedRecordId}
          />
        </section>
      </main>
    </div>
  );
}

/**
 * EXAMPLE 2: Tabbed Interface with Multiple Grid Views
 */
export function AppWithTabbedGrids() {
  const [activeTab, setActiveTab] = useState("table");

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Records Dashboard</h1>
        <div className="tabs">
          <button
            className={`tab ${activeTab === "table" ? "active" : ""}`}
            onClick={() => setActiveTab("table")}
          >
            Table View
          </button>
          <button
            className={`tab ${activeTab === "grid" ? "active" : ""}`}
            onClick={() => setActiveTab("grid")}
          >
            Full Grid
          </button>
          <button
            className={`tab ${activeTab === "advanced" ? "active" : ""}`}
            onClick={() => setActiveTab("advanced")}
          >
            Analytics
          </button>
        </div>
      </header>

      <main className="app-main">
        {activeTab === "table" && (
          <SimpleTableView />
        )}
        {activeTab === "grid" && (
          <RecordsGrid />
        )}
        {activeTab === "advanced" && (
          <RecordsGridAdvanced />
        )}
      </main>
    </div>
  );
}

/**
 * EXAMPLE 3: Side-by-Side with Editor
 */
export function AppWithGridAndEditor() {
  const { records, loading, error } = useRecords();
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleSelectRecord = (recordId) => {
    setSelectedRecordId(recordId);
    const record = records.find((r) => r.id === recordId);
    setSelectedRecord(record);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Key-Value Editor</h1>
      </header>
      <main className="app-main">
        <section className="panel panel-left">
          <h2>Records</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          <RecordsTable
            records={records}
            selectedId={selectedRecordId}
            onSelect={handleSelectRecord}
          />
        </section>

        <section className="panel panel-right">
          <h2>Editor</h2>
          {selectedRecord ? (
            <div className="record-editor">
              <p>
                <strong>Skill ID:</strong> {selectedRecord.skillid}
              </p>
              <p>
                <strong>Validation Of:</strong> {selectedRecord.validation_of}
              </p>
              <p>
                <strong>Marks:</strong> {selectedRecord.marks || "-"}
              </p>
              <p>
                <strong>Comments:</strong> {selectedRecord.comments || "-"}
              </p>
              {/* Add actual editor form here */}
            </div>
          ) : (
            <p className="placeholder">Select a record to edit</p>
          )}
        </section>
      </main>
    </div>
  );
}

/**
 * EXAMPLE 4: Standalone Records Grid Page
 */
export function RecordsPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>All Records</h1>
        <p>Manage all records from FastAPI</p>
      </header>
      <div className="page-content">
        <RecordsGrid />
      </div>
    </div>
  );
}

/**
 * EXAMPLE 5: Records Page with Search and Filters
 */
export function AdvancedRecordsPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Records Analytics</h1>
        <p>Grouped view with aggregation</p>
      </header>
      <div className="page-content">
        <RecordsGridAdvanced />
      </div>
    </div>
  );
}

/**
 * EXAMPLE 6: Using with Custom API Calls
 */
import { getRecords } from "./services/api";

export function RecordsWithCustomFetch() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  React.useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const data = await getRecords();
        // Filter records locally
        const filtered = data.filter(
          (record) =>
            record.skillid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.validation_of
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
        );
        setRecords(filtered);
      } catch (error) {
        console.error("Failed to fetch records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [searchTerm]);

  return (
    <div className="records-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <RecordsGrid records={records} />
      )}
    </div>
  );
}

/**
 * Helper Component: Simple Table View
 */
function SimpleTableView() {
  const { records, loading, error } = useRecords();
  const [selectedId, setSelectedId] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <RecordsTable
      records={records}
      selectedId={selectedId}
      onSelect={setSelectedId}
    />
  );
}

/**
 * CSS CLASSES FOR EXAMPLES
 * Add these to your styles.css or ag-grid.css
 */
const exampleStyles = `
.tabs {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  border-bottom: 2px solid #e0e0e0;
}

.tab {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
}

.tab:hover {
  color: #333;
}

.tab.active {
  color: #007bff;
  border-bottom-color: #007bff;
}

.search-bar {
  margin-bottom: 1rem;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.record-editor {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
}

.record-editor p {
  margin: 0.5rem 0;
}

.placeholder {
  text-align: center;
  color: #999;
  padding: 2rem;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
}

.page-content {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
`;

export default AppWithRecordsTable;
