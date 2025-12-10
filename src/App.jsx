import { useState } from 'react'
import './App.css'
// STEP 1: Import your component
import PersonalInfoForm from './components/PersonalInfoForm'
import TrainingAssessment from './components/TrainingAssessment'
import GoalSelection from './components/GoalSelection'
import FoodSuggestions from './components/FoodSuggestions'

function App() {
  const [appName] = useState('MacroFlexx Calculator')
  const [currentStep, setCurrentStep] = useState('welcome')
  const [personalData, setPersonalData] = useState(null)
  const [trainingData, setTrainingData] = useState(null)
  const [finalResults, setFinalResults] = useState(null)




   // NEW: Function to receive data from PersonalInfoForm
  const handlePersonalDataSubmit = (data) => {
    console.log('📝 Received personal data:', data)
    setPersonalData(data)
    setCurrentStep('training') // Move to next step
  }
  
  const handleTrainingAssessmentSubmit = (data) => {
    console.log('📝 Received training data:', data)
    setTrainingData(data)
    setCurrentStep('goal') // Move to next step
  }
   const handleGoalSubmit = (results) => {
    console.log('📝 Received goals with results:', results)
    setFinalResults(results)
    setCurrentStep('suggestions') // Move to next step
  }


  return (
    <div className="app">
      <header className="app-header">
        <h1>
          {/* Dumbbell SVG Icon - made much bigger */}
          <span style={{ verticalAlign: 'middle', marginRight: 20 }}>
  <img 
    src="/firedumbell.png" 
    alt="dumbbell with fire" 
    style={{ width: '80px', height: '80px' }}
  />
</span>
          {appName}
        </h1>
        <p>🔥 Fuel Your Goals, Track Your Macros, Get Ripped 💪</p>
        <div style={{ marginTop: '1rem' }}>
          <a 
            href="https://ko-fi.com/elvissanchez7311" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #ff5f6d 0%, #ffc371 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '25px',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'transform 0.2s ease',
              boxShadow: '0 4px 15px rgba(255, 95, 109, 0.3)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            ☕ Support Me!
          </a>
        </div>
      </header>
      
      <main className="main-content">
        {/* STEP 2: Show different content based on currentStep */}
        {currentStep === 'welcome' && (
          <div className="container">
            <h2>Welcome to Your Ripped Future! 💪</h2>
              <p>Calculate your macros based on your weight and muscle building goals🔥</p>
            
            <div className="progress-steps">
              <div className="step">
                <span className="step-number">1</span>
                <span className="step-text">Personal Info Form</span>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <span className="step-text">Training Assessment</span>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <span className="step-text">Goal Selection</span>
              </div>
              <div className="step">
                <span className="step-number">4</span>
                <span className="step-text">Macro Results</span>
              </div>
              <div className="step">
                <span className="step-number">5</span>
                <span className="step-text">AI Food Suggestions</span>
              </div>
            </div>

            <button 
              className="get-started-btn"
              onClick={() => setCurrentStep('personal-info')}
            >
              Let's Get Started!
            </button>

        <div className="about"> 
          <small>Created by</small>
          <a href="https://www.linkedin.com/in/elvis-sanchez-robles-6b35871a9" target="_blank" rel="noopener noreferrer"> 
            <img alt="pfp" src="me.jpeg"/>
            <p>Elvis Sánchez Robles</p>
            <i className="fa-brands fa-linkedin"></i>
          </a>
        </div>
          </div>
        )}

        {/*Passing or Receiving Data*/}

        {currentStep === 'personal-info' && (
          <PersonalInfoForm onSubmit={handlePersonalDataSubmit} />
        )}

        {currentStep === 'training' && (
        <TrainingAssessment 
          personalInfo={personalData}
          onSubmit={handleTrainingAssessmentSubmit} 
        />
      )}

         {currentStep === 'goal' && (
          <GoalSelection 
            personalInfo={personalData}
            trainingInfo={trainingData}  
            onComplete={handleGoalSubmit}
          />
        )}

        {currentStep === 'suggestions' && (
          <FoodSuggestions 
            personalInfo={personalData}
            trainingInfo={trainingData} 
            macroResults={finalResults} 
          />
        )}

      </main>
    </div>
  )
}

export default App