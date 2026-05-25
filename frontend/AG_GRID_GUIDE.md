# AG Grid with FastAPI - Implementation Guide

This guide shows how to fetch records from FastAPI and display them in AG Grid React components.

## Setup

### 1. Installation
AG Grid dependencies are already in `package.json`:
```json
{
  "dependencies": {
    "ag-grid-community": "^29.0.0",
    "ag-grid-react": "^29.0.0",
    "axios": "^1.7.0"
  }
}
```

Install if needed:
```bash
npm install ag-grid-community ag-grid-react
```

### 2. API Service

The API service (`src/services/api.js`) handles communication with FastAPI:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
});

export const getRecords = async (limit = 100) => {
  const response = await api.get("/records", { params: { limit } });
  return Array.isArray(response.data) ? response.data : response.data.records || [];
};

export const getRecord = (recordId) =>
  api.get(`/records/${recordId}`).then((response) => response.data);
```

## Components

### 1. Basic RecordsTable Component

The `RecordsTable` component is used in the main App for displaying records in a list:

```javascript
import { RecordsTable } from "./components/RecordsTable";

// Usage in App.jsx
<RecordsTable 
  records={records} 
  selectedId={selectedRecordId} 
  onSelect={setSelectedRecordId} 
/>
```

**Features:**
- Single row selection
- Column filtering and sorting
- Pagination (10 rows per page)
- Pinned ID column
- Resizable columns
- Auto-height for wrapped text

**Column Configuration:**
- ID (pinned left)
- Skill ID
- Validation Of
- Marks (numeric)
- Time to Solve (numeric)
- Comments (wrapped text)
- Variation

### 2. RecordsGrid Component (Standalone)

A standalone component that fetches and displays records without external data dependency:

```javascript
import { RecordsGrid } from "./components/RecordsGrid";

// Usage
<RecordsGrid />
```

**Features:**
- Auto-fetches records on mount
- Loading and error states
- Refresh button
- Export to CSV
- Multiple row selection
- 20 rows per page pagination
- Shows timestamps (created_at, updated_at)

### 3. RecordsGridAdvanced Component

Advanced component with row grouping, aggregation, and column visibility toggle:

```javascript
import { RecordsGridAdvanced } from "./components/RecordsGridAdvanced";

// Usage
<RecordsGridAdvanced />
```

**Features:**
- Row grouping by skillid
- Checkbox selection with header checkbox
- Average aggregation for marks
- Column visibility toggle (show/hide timestamps)
- Auto-size columns
- Clear filters button
- Shows selected row count
- Custom cell renderers for null values

## Custom Hooks

### useRecords Hook

Fetch records with automatic loading and error handling:

```javascript
import { useRecords } from "./hooks/useRecords";

function MyComponent() {
  const { records, loading, error, refresh } = useRecords(100);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      {/* Display records */}
    </div>
  );
}
```

### useSingleRecord Hook

Fetch a single record by ID:

```javascript
import { useSingleRecord } from "./hooks/useRecords";

function RecordDetail({ recordId }) {
  const { record, loading, error } = useSingleRecord(recordId);

  if (!record) return <p>Select a record</p>;
  
  return <div>{record.skillid}: {record.comments}</div>;
}
```

## Usage Examples

### Example 1: Basic List with Selection

```javascript
import { useState } from "react";
import { RecordsTable } from "./components/RecordsTable";
import { useRecords } from "./hooks/useRecords";

function RecordsList() {
  const { records } = useRecords();
  const [selectedId, setSelectedId] = useState(null);

  return (
    <RecordsTable 
      records={records} 
      selectedId={selectedId} 
      onSelect={setSelectedId} 
    />
  );
}
```

### Example 2: Standalone Grid with Refresh

```javascript
import { RecordsGrid } from "./components/RecordsGrid";

function Dashboard() {
  return (
    <div className="dashboard">
      <RecordsGrid />
    </div>
  );
}
```

### Example 3: Custom Grid Configuration

```javascript
import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { useRecords } from "./hooks/useRecords";

function CustomRecordsGrid() {
  const { records, loading } = useRecords();

  const columnDefs = useMemo(() => [
    { field: "id", headerName: "ID", width: 70 },
    { 
      field: "skillid", 
      headerName: "Skill", 
      flex: 1,
      filterParams: { filterOptions: ["contains"] }
    },
    { 
      field: "marks", 
      type: "numericColumn",
      aggFunc: "avg"
    },
  ], []);

  return (
    <div className="ag-theme-alpine" style={{ height: "400px" }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={records}
        pagination={true}
        paginationPageSize={15}
      />
    </div>
  );
}
```

## AG Grid Configuration Options

### Column Definition

```javascript
const columnDef = {
  field: "skillid",              // Data field name
  headerName: "Skill ID",        // Display name
  width: 150,                    // Fixed width
  flex: 1,                       // Flexible width (0-1 scale)
  minWidth: 100,                 // Minimum width
  sortable: true,                // Enable sorting
  filter: "agTextColumnFilter",  // Filter type
  resizable: true,               // Allow resize
  pinned: "left",                // Pin column (left/right)
  wrapText: true,                // Wrap text in cells
  autoHeight: true,              // Auto height for wrapped text
  valueFormatter: (params) => {  // Format cell value
    return params.value ? params.value.toUpperCase() : "";
  },
  cellStyle: {                   // Style cell
    textAlign: "center"
  }
};
```

### Grid Options

```javascript
const gridOptions = {
  rowSelection: "single",           // "single" or "multiple"
  pagination: true,                 // Enable pagination
  paginationPageSize: 20,           // Rows per page
  domLayout: "autoHeight",          // "autoHeight", "normal", "print"
  animateRows: true,                // Animate row changes
  enableBrowserTooltips: true,      // Show native tooltips
  suppressRowClickSelection: false,  // Click row to select
  rowBuffer: 10,                    // Buffer for virtual scrolling
  defaultColDef: {                  // Default for all columns
    resizable: true,
    sortable: true,
    filter: true
  }
};
```

### Filter Types

```javascript
"agTextColumnFilter"     // Text filter
"agNumberColumnFilter"   // Number filter
"agDateColumnFilter"     // Date filter
"agSetColumnFilter"      // Multi-select filter
```

## Styling

AG Grid CSS is imported in components:

```javascript
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
```

Available themes:
- `ag-theme-alpine` (light, default)
- `ag-theme-alpine-dark`
- `ag-theme-balham`
- `ag-theme-balham-dark`
- `ag-theme-material`
- `ag-theme-quartz`

## Performance Tips

1. **Memoize column definitions** - Use `useMemo()` to prevent recreating columns
2. **Virtual scrolling** - AG Grid handles large datasets with built-in virtualization
3. **Pagination** - Use pagination for datasets > 1000 rows
4. **Row buffering** - Set `rowBuffer` for smoother scrolling
5. **Lazy loading** - For very large datasets, implement server-side pagination

## FastAPI Integration

The backend provides:

```python
# GET /api/records - List all records
# Parameters: limit (default: 100)
# Response: Array of Record objects

# GET /api/records/{record_id} - Get single record
# Response: Record object

# PUT /api/records/{record_id} - Update record
# Body: { persona, skillid?, marks?, ... }
# Response: Updated Record object
```

Record model:
```python
class Record:
    id: int
    skillid: str
    validation_of: str
    marks: Optional[int]
    timeToSolve: Optional[int]
    comments: Optional[str]
    variation: Optional[str]
    created_at: datetime
    updated_at: datetime
```

## Common Tasks

### Export Records to CSV
```javascript
const handleExport = () => {
  gridApi.exportDataAsCsv({
    fileName: "records.csv"
  });
};
```

### Get Selected Rows
```javascript
const handleGetSelected = () => {
  const selected = gridApi.getSelectedRows();
  console.log(selected);
};
```

### Clear All Filters
```javascript
const handleClearFilters = () => {
  gridApi.setFilterModel(null);
};
```

### Auto-Size Columns
```javascript
const handleAutoSize = () => {
  gridApi.autoSizeAllColumns();
};
```

### Refresh Data
```javascript
const handleRefresh = async () => {
  const data = await getRecords();
  gridApi.setRowData(data);
};
```

## Troubleshooting

**Grid not showing:**
- Ensure the container has a defined height
- Check CSS imports for AG Grid
- Verify `rowData` is an array

**Columns not sorting/filtering:**
- Set `sortable: true` and `filter: true` on column definitions
- Use correct filter type for data (agNumberColumnFilter for numbers, etc.)

**Performance issues:**
- Reduce displayed rows with pagination
- Use `rowBuffer` for virtual scrolling
- Memoize column definitions and row data

**API connection errors:**
- Check `VITE_API_BASE_URL` environment variable
- Verify FastAPI CORS configuration allows frontend URL
- Check browser Network tab for request/response details
