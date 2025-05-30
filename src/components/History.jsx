import React, { useEffect, useState, useCallback } from 'react';

const PAGE_SIZE = 10;

const History = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('gca-history') || '[]');
      setItems(data.reverse());
    } catch (error) {
      console.error("Failed to parse history data:", error);
      setItems([]);
    }
  }, []);

  const clearHistory = async () => {
    if (window.confirm('Are you sure you want to clear the history?')) {
      setClearing(true);
      setTimeout(() => {
        localStorage.removeItem('gca-history');
        setItems([]);
        setCurrentPage(1);
        setClearing(false);
      }, 500);
    }
  };

  const deleteItem = (index) => {
    if (!window.confirm('Delete this history item?')) return;
    const newItems = [...items];
    newItems.splice(index, 1);
    localStorage.setItem('gca-history', JSON.stringify(newItems.slice().reverse()));
    setItems(newItems);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert("Copied to clipboard!"))
      .catch(err => console.error("Failed to copy:", err));
  };

  const filteredItems = items.filter(
    item =>
      item.input?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.response?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredItems.length / PAGE_SIZE);
  const paginatedItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const exportToJSON = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    downloadFile(url, 'history.json');
  };

  const exportToCSV = () => {
    const headers = ['Type', 'Timestamp', 'Prompt', 'Response'];
    const rows = items.map(item => [
      item.type || 'N/A',
      new Date(item.timestamp)?.toLocaleString(),
      `"${item.input?.replace(/"/g, '""')}"`,
      `"${item.response?.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    downloadFile(url, 'history.csv');
  };

  const downloadFile = (url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const showModal = (title, content) => {
    setModalContent({ title, content });
  };

  const closeModal = useCallback(() => setModalContent(null), []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closeModal]);

  const onModalClick = (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
  };

  return (
    <div
      style={{
        padding: '1rem',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: darkMode ? '#121212' : '#f4f4f4',
        color: darkMode ? '#ffffff' : '#000000',
        minHeight: '100vh',
        boxSizing: 'border-box',
        maxWidth: '100vw',
      }}
    >
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Prompt History</h2>

      <div
        style={{
          marginBottom: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search history..."
          aria-label="Search history"
          style={{
            flexGrow: 1,
            minWidth: '200px',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            maxWidth: '400px',
          }}
        />
        <button
          onClick={toggleDarkMode}
          aria-pressed={darkMode}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: darkMode ? '#333' : '#ddd',
            color: darkMode ? '#fff' : '#000',
            flexShrink: 0,
          }}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {items.length > 0 && (
        <div
          style={{
            marginBottom: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'flex-start',
          }}
        >
          <button
            onClick={exportToJSON}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: '#007bff',
              color: '#fff',
            }}
          >
            Export JSON
          </button>
          <button
            onClick={exportToCSV}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: '#28a745',
              color: '#fff',
            }}
          >
            Export CSV
          </button>
          <button
            onClick={clearHistory}
            disabled={clearing}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: 'none',
              cursor: clearing ? 'not-allowed' : 'pointer',
              backgroundColor: '#dc3545',
              color: '#fff',
              opacity: clearing ? 0.7 : 1,
            }}
          >
            {clearing ? 'Clearing...' : 'Clear History'}
          </button>
        </div>
      )}

      {filteredItems.length === 0 ? (
        <p>No matching history found.</p>
      ) : (
        <>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {paginatedItems.map((item, idx) => {
              const realIndex = (currentPage - 1) * PAGE_SIZE + idx;
              return (
                <li
                  key={realIndex}
                  style={{
                    border: '1px solid #ccc',
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
                    position: 'relative',
                    wordBreak: 'break-word',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '200px',
                  }}
                >
                  <button
                    onClick={() => deleteItem(realIndex)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'transparent',
                      border: 'none',
                      color: 'red',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      lineHeight: '1',
                    }}
                    aria-label="Delete history item"
                  >
                    &times;
                  </button>

                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Type:</strong> {item.type || 'N/A'}
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Date:</strong> {new Date(item.timestamp)?.toLocaleString()}
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Prompt:</strong> {item.input?.slice(0, 120) || 'N/A'}
                    {item.input?.length > 120 && '...'}
                    <button
                      onClick={() => showModal('Full Prompt', item.input)}
                      style={{
                        marginLeft: '0.5rem',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        padding: '0.2rem 0.5rem',
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => copyToClipboard(item.input)}
                      style={{
                        marginLeft: '0.3rem',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        padding: '0.2rem 0.5rem',
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <div>
                    <strong>Response:</strong> {item.response?.slice(0, 120) || 'N/A'}
                    {item.response?.length > 120 && '...'}
                    <button
                      onClick={() => showModal('Full Response', item.response)}
                      style={{
                        marginLeft: '0.5rem',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        padding: '0.2rem 0.5rem',
                      }}
                    >
                      View
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {pageCount > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginTop: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '0.5rem 1rem',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                Previous
              </button>
              <span style={{ alignSelf: 'center' }}>
                Page {currentPage} of {pageCount}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, pageCount))}
                disabled={currentPage === pageCount}
                style={{
                  padding: '0.5rem 1rem',
                  cursor: currentPage === pageCount ? 'not-allowed' : 'pointer',
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {modalContent && (
        <div
          id="modal-overlay"
          onClick={onModalClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '1rem',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '1rem 1.5rem',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxSizing: 'border-box',
            }}
          >
            <h3 id="modal-title" style={{ marginTop: 0 }}>{modalContent.title}</h3>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{modalContent.content}</pre>
            <button
              onClick={closeModal}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#007bff',
                color: 'black',
                fontSize: '1rem',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
