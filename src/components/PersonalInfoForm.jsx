import { useState } from 'react'
import './PersonalInfoForm.css'
// LESSON 1: React Components are just JavaScript functions that return JSX
function PersonalInfoForm({ onSubmit }) {
  // LESSON 2: useState Hook - This is how we store changing data in React
  // useState returns an array: [currentValue, functionToUpdateValue]
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    feet: '',
    inches: '',
    weight: ''
  })

  // LESSON 3: Event Handlers - Functions that respond to user actions
  const handleInputChange = (event) => {
    // event.target is the input element that triggered this function
    const { name, value } = event.target // Destructuring assignment
    
    // In React, we NEVER mutate state directly
    // We create a new object with the spread operator
    setFormData({
      ...formData,     // Copy all existing properties
      [name]: value    // Update just the property that changed
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault() // Prevent page reload
    console.log('Form submitted with data:', formData)
     onSubmit(formData)
    // TODO: We'll pass this data to parent component later
  }

  // LESSON 4: Computed Values - Derived from state (like Vue computed)
  const isFormValid = formData.name && formData.age && formData.gender && 
                      formData.feet && formData.inches && formData.weight

  // LESSON 5: JSX Return - This looks like HTML but it's JavaScript
  return (
    <div className="personal-info-form">
      <h2>📋 Personal Information</h2>
      <p>Let's start with some basic information to calculate your macros</p>

      <form onSubmit={handleSubmit}>
        {/* LESSON 6: Form inputs in React */}
        
        {/* Name Input */}
        <div className="form-group">
          <label htmlFor="name">What's your name?</label>
          <input
            type="text"
            id="name"
            name="name"                    // This matches our state property
            value={formData.name}          // Controlled input - React controls the value
            onChange={handleInputChange}  // Function to call when input changes
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Age Input */}
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            placeholder="Your age"
            min="16"
            max="100"
            required
          />
        </div>

        {/* Gender Selection */}
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Height - Feet and Inches */}
        <div className="form-group">
          <label>Height</label>
          <div className="height-inputs">
            <div className="height-input">
              <input
                type="number"
                name="feet"
                value={formData.feet}
                onChange={handleInputChange}
                placeholder="5"
                min="3"
                max="8"
                required
              />
              <span>feet</span>
            </div>
            <div className="height-input">
              <input
                type="number"
                name="inches"
                value={formData.inches}
                onChange={handleInputChange}
                placeholder="10"
                min="0"
                max="11"
                required
              />
              <span>inches</span>
            </div>
          </div>
        </div>

        {/* Weight Input */}
        <div className="form-group">
          <label htmlFor="weight">Current Weight (lbs)</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="180"
            min="50"
            max="400"
            step="0.1"
            required
          />
        </div>

        {/* LESSON 7: Conditional Rendering with && operator */}
        {formData.name && (
          <div className="preview">
            <p>👋 Hi {formData.name}!</p>
          </div>
        )}

        {/* LESSON 8: Dynamic button text and disabled state */}
        <button 
          type="submit" 
          className="submit-btn"
          disabled={!isFormValid}
        >
          {isFormValid ? '✅ Continue to Training' : '📝 Fill out the form'}
        </button>
      </form>
    </div>
  )
}

export default PersonalInfoForm