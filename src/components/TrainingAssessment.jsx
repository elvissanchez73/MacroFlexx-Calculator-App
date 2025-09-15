import { useState } from 'react'
import './TrainingAssessment.css'
// LESSON 1: React Components are just JavaScript functions that return JSX
function TrainingForm({ personalInfo,onSubmit }) {
  // LESSON 2: useState Hook - This is how we store changing data in React
  // useState returns an array: [currentValue, functionToUpdateValue]
  const [trainingData, setTrainingData] = useState({
   weightTraining: '',
    cardio: ''
  })

  const handleInputChange = (event) => {
    // event.target is the input element that triggered this function
    const { name, value } = event.target // Destructuring assignment
    
   
    setTrainingData({
      ...trainingData,     // Copy all existing properties
      [name]: value    // Update just the property that changed
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault() // Prevent page reload
    console.log('Training Frequency submitted with data:', trainingData)
    onSubmit(trainingData)

    
  }

  const isFormValid = trainingData.weightTraining && trainingData.cardio

  return (
    <div className="training-form">
      <h2>📋 Exercise Frequency Form</h2>
      {/* NEW: Use props data */}
      {personalInfo && (
        <p>👋 Hi {personalInfo.name}! Now let's assess your training.</p>
      )}
      <p>Next, we need to know how many times per week you do weight lifting and cardio</p>

      <form onSubmit={handleSubmit}>
        {/* LESSON 6: Form inputs in React */}
        
       

        {/* Weight Training Frequency Selection */}
        <div className="training-group">
          <label htmlFor="weightTraining">How many times per week you weight lift?</label>
          <select
            id="weightTraining"
            name="weightTraining"
            value={trainingData.weightTraining}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Interval</option>
            <option value="0-1 days">0-1 days per week</option>
            <option value="2-3 days">2-3 days per week</option>
            <option value="4-5 days">4-5 days per week</option>
            <option value="6-7 days">6-7 days per week</option>
          </select>
        </div>

         {/* Cardio Training Frequency Selection */}
        <div className="training-group">
          <label htmlFor="cardio">How many times per week you do cardio sessions?</label>
          <select
            id="cardio"
            name="cardio"
            value={trainingData.cardio}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Interval</option>
            <option value="0-1">0-1 days per week</option>
            <option value="2-3">2-3 days per week</option>
            <option value="4-5">4-5 days per week</option>
            <option value="6-7">6-7 days per week</option>
          </select>
        </div>


        {/* LESSON 8: Dynamic button text and disabled state */}
        <button 
          type="submit" 
          className="submit-btn"
          disabled={!isFormValid}
        >
          {isFormValid ? '✅ Continue to Goal Selection' : '📝 Fill out the form'}
        </button>
      </form>
    </div>
  )
}

export default TrainingForm