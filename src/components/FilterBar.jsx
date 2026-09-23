import { CATEGORIES } from '../lib/categories.js'

export default function FilterBar({
  query,
  onQueryChange,
  selectedCategories,
  onToggleCategory,
  onClearCategories,
  counts,
  total,
}) {
  return (
    <>
      <label className="search">
        <span className="search__label">Search services</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Try “meals”, “wifi” or “youth”"
        />
      </label>

      <div className="chips" role="group" aria-label="Filter by category">
        <button
          type="button"
          className="chip"
          aria-pressed={selectedCategories.length === 0}
          onClick={onClearCategories}
        >
          All <span className="chip__count">{total}</span>
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            className="chip"
            style={{ '--chip-color': category.color }}
            aria-pressed={selectedCategories.includes(category.id)}
            onClick={() => onToggleCategory(category.id)}
          >
            <span className="chip__dot" aria-hidden="true" />
            {category.label} <span className="chip__count">{counts[category.id] ?? 0}</span>
          </button>
        ))}
      </div>
    </>
  )
}
