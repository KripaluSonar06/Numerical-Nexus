import { useNavigate } from 'react-router-dom'
import './BreadCrumb.css'

export default function BreadCrumb({ items = [] }) {
  const navigate = useNavigate()

  return (
    <div className="breadcrumb">
      {items.map((item, idx) => (
        <div key={idx} className="breadcrumb-item">
          <button
            onClick={() => item.path && navigate(item.path)}
            className={item.path ? 'breadcrumb-link' : 'breadcrumb-text'}
          >
            {item.label}
          </button>
          {idx < items.length - 1 && <span className="breadcrumb-separator">/</span>}
        </div>
      ))}
    </div>
  )
}
