import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faSearch, faChevronLeft, faChevronRight, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function DataTable({ title, columns, data, actions, onRowClick, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);
  const perPage = 10;

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = row[col.key];
        return val && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, columns]);

  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortCol] ?? '';
      const bVal = b[sortCol] ?? '';
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filtered, sortCol, sortDir]);

  const totalPages = Math.ceil(sorted.length / perPage);
  const pageData = sorted.slice(page * perPage, (page + 1) * perPage);

  const handleSort = (key) => {
    if (sortCol === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(key);
      setSortDir('asc');
    }
  };

  const renderCell = (row, col) => {
    if (col.render) return col.render(row[col.key], row);
    return row[col.key];
  };

  return (
    <div className="data-table-container">
      <div className="data-table-header">
        <div className="data-table-title">{title}</div>
        <div className="data-table-actions">
          <div className="data-table-search-wrapper" style={{ position: 'relative' }}>
            <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: '0.8rem' }} />
            <input
              type="text"
              className="data-table-search"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              style={{ paddingLeft: '32px' }}
            />
          </div>
          {actions}
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} onClick={() => handleSort(col.key)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {col.label}
                  <span style={{ width: '12px', display: 'inline-block' }}>
                    {sortCol === col.key && (
                      <FontAwesomeIcon icon={sortDir === 'asc' ? faSortUp : faSortDown} />
                    )}
                  </span>
                </div>
              </th>
            ))}
            {(onEdit || onDelete) && <th style={{ width: '100px' }}>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)} style={{ textAlign: 'center', padding: '32px' }}>
                Nenhum registro encontrado
              </td>
            </tr>
          ) : (
            pageData.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col) => (
                  <td key={col.key}>{renderCell(row, col)}</td>
                ))}
                {(onEdit || onDelete) && (
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {onEdit && (
                        <button 
                          className="btn btn-sm btn-ghost" 
                          onClick={() => onEdit(row)}
                          title="Editar"
                        >
                          <FontAwesomeIcon icon={faEdit} style={{ color: 'var(--color-primary-light)' }} />
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          className="btn btn-sm btn-ghost" 
                          onClick={() => {
                            if (window.confirm('Tem certeza que deseja deletar este registro?')) {
                              onDelete(row);
                            }
                          }}
                          title="Deletar"
                        >
                          <FontAwesomeIcon icon={faTrash} style={{ color: 'var(--color-danger)' }} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="data-table-footer">
        <span>
          Mostrando {pageData.length} de {sorted.length} registros
        </span>
        <div className="data-table-pagination">
          <button
            className="pagination-btn"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`pagination-btn ${page === i ? 'active' : ''}`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="pagination-btn"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );
}
