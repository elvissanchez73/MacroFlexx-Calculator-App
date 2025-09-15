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
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-label="dumbbell" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="30" width="10" height="20" rx="2" fill="#222" />
              <rect x="65" y="30" width="10" height="20" rx="2" fill="#222" />
              <rect x="15" y="35" width="50" height="10" rx="2" fill="#666" />
            </svg>
          </span>
          {appName}
        </h1>
        <p>Nutrition Macros Calculator</p>
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
            <img alt="pfp" src="https://media.licdn.com/dms/image/v2/D4E03AQHE27HiC-xsJg/profile-displayphoto-crop_800_800/B4EZgzSjEDHgAQ-/0/1753207157962?e=1759363200&v=beta&t=athYR_EHSpgRFjO9OCsSbz4I6zZ2Rd3BTxbx3JXSMG4"/>
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