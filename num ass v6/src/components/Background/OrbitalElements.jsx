import './OrbitalElements.css'

const symbols = ['Σ', 'π', '∫', 'e', 'Lₙ', '∞', '√', 'φ']

export default function OrbitalElements() {
  return (
    <div className="orbital-container">
      {symbols.map((symbol, i) => (
        <div 
          key={i}
          className="orbital-element"
          style={{
            '--delay': `${i * 0.5}s`,
            '--angle': `${(i / symbols.length) * 360}deg`
          }}
        >
          {symbol}
        </div>
      ))}
    </div>
  )
}
