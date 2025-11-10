
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
//import MathGlobe from './3D/MathGlobe.jsx'
import './HomePage.css'

function HomePage() {
  const navigate = useNavigate()

  const teamMembers = [
    { name: "xyz", roll: "Roll No. 1" },
    { name: "yzx", roll: "Roll No. 2" },
    { name: "zxy", roll: "Roll No. 3" }
  ]

  return (
    <motion.div 
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      
      
      <div className="home-content">
        <motion.h1 
          className="home-heading"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Numerical Methods Assignment
        </motion.h1>

        <motion.div 
          className="team-info"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h3>Presented by:</h3>
          {teamMembers.map((member, idx) => (
            <p key={idx}>{member.name} - {member.roll}</p>
          ))}
        </motion.div>

        <motion.button 
          className="dive-in-btn"
          onClick={() => navigate('/assignments')}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          whileHover={{ scale: 1.08, y: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          Dive In
        </motion.button>
      </div>
    </motion.div>
  )
}

export default HomePage
