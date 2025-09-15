import { useState } from 'react'
import './GoalSelection.css'

function GoalSelection({ personalInfo, trainingInfo, onComplete }) {
  const [selectedGoal, setSelectedGoal] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [macroResults, setMacroResults] = useState(null)

  // Handle goal selection
  const handleGoalChange = (event) => {
    setSelectedGoal(event.target.value)
    setShowResults(false) // Hide results when goal changes
  }

  // Handle form submission and macro calculation
  const handleSubmit = (event) => {
    event.preventDefault()
    if (!selectedGoal) return

    setIsCalculating(true)

    // Simulate calculation delay (remove this in real app)
    setTimeout(() => {
      const results = calculateMacros(personalInfo, trainingInfo, selectedGoal)
      setMacroResults(results)
      setShowResults(true)
      setIsCalculating(false)
    }, 1500)
  }

  // THE MAIN CALCULATION FUNCTION - Using your formulas!
  const calculateMacros = (personal, training, goal) => {
    console.log('🧮 Calculating macros with:', { personal, training, goal })

    // Step 1: Convert units
    const heightCm = (parseInt(personal.feet) * 12 + parseInt(personal.inches)) * 2.54
    const weightKg = parseFloat(personal.weight) / 2.205
    const age = parseInt(personal.age)

    console.log('📏 Conversions:', { heightCm, weightKg, age })

    // Step 2: Calculate BMR (Mifflin-St Jeor Equation)
    let bmr
    if (personal.gender === 'male') {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
    } else {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161
    }

    console.log('🔥 BMR:', bmr)

    // Step 3: Calculate activity level from training data
    const getDaysMidpoint = (range) => {
      const ranges = {
        '0-1': 0.5,
        '2-3': 2.5,
        '4-5': 4.5,
        '6-7': 6.5
      }
      return ranges[range] || 0
    }

    const gymDays = getDaysMidpoint(training.weightTraining)
    const cardioDays = getDaysMidpoint(training.cardio)
    const totalSessions = gymDays + cardioDays

    console.log('💪 Training analysis:', { gymDays, cardioDays, totalSessions })

    // Activity multiplier
    let activityMultiplier
    if (totalSessions <= 1.5) {
      activityMultiplier = 1.2 // Sedentary
    } else if (totalSessions <= 3.5) {
      activityMultiplier = 1.375 // Light
    } else if (totalSessions <= 5.5) {
      activityMultiplier = 1.55 // Moderate
    } else {
      activityMultiplier = 1.725 // Very Active
    }

    // Step 4: Calculate TDEE
    const tdee = bmr * activityMultiplier
    console.log('⚡ TDEE:', tdee)

    // Step 5: Adjust calories based on goal
    let targetCalories
    let proteinMultiplier
    let carbPercentage

    switch (goal) {
      case 'lose-weight':
        targetCalories = tdee - 500
        proteinMultiplier = 0.6
        carbPercentage = 0.25
        break
      case 'maintain':
        targetCalories = tdee
        proteinMultiplier = 0.8
        carbPercentage = 0.35
        break
      case 'recomp':
        targetCalories = tdee - 200
        proteinMultiplier = 0.9
        carbPercentage = 0.30
        break
      case 'bulk':
        targetCalories = tdee + 400
        proteinMultiplier = 1.1
        carbPercentage = 0.40
        break
      default:
        targetCalories = tdee
        proteinMultiplier = 0.8
        carbPercentage = 0.35
    }

    // Step 6: Calculate macros
    const protein = Math.round(parseFloat(personal.weight) * proteinMultiplier)
    const proteinCalories = protein * 4

    const carbCalories = targetCalories * carbPercentage
    const carbs = Math.round(carbCalories / 4)

    // Ensure minimum fat (20% of calories)
    const minFatCalories = targetCalories * 0.20
    const remainingCalories = targetCalories - proteinCalories - carbCalories
    const fatCalories = Math.max(remainingCalories, minFatCalories)
    const fats = Math.round(fatCalories / 9)

    // If fat was adjusted, recalculate carbs
    const actualFatCalories = fats * 9
    const finalCarbCalories = targetCalories - proteinCalories - actualFatCalories
    const finalCarbs = Math.round(finalCarbCalories / 4)

    const results = {
      goal: goal,
      goalName: getGoalName(goal),
      calories: Math.round(targetCalories),
      protein: protein,
      carbs: finalCarbs,
      fats: fats,
      // Additional info
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      activityLevel: getActivityLevel(activityMultiplier),
      proteinPercentage: Math.round((proteinCalories / targetCalories) * 100),
      carbPercentage: Math.round((finalCarbCalories / targetCalories) * 100),
      fatPercentage: Math.round((actualFatCalories / targetCalories) * 100)
    }

    console.log('📊 Final results:', results)
    return results
  }

  // Helper functions
  const getGoalName = (goal) => {
    const goals = {
      'lose-weight': 'Lose Weight',
      'maintain': 'Maintain Weight',
      'recomp': 'Lose Fat + Gain Muscle',
      'bulk': 'Gain Weight/Muscle'
    }
    return goals[goal] || 'Unknown Goal'
  }

const getActivityLevel = (multiplier) => {
  if (multiplier === 1.2) return 'Light'
  if (multiplier === 1.375) return 'Moderate'
  if (multiplier === 1.55) return 'Active'
  if (multiplier === 1.725) return 'Very Active'
  return 'Unknown'
}

  const handleContinue = () => {
    // Send complete results to App.jsx
    onComplete(macroResults)
  }

  return (
    <div className="goal-selection">
      <h2>🎯 What's Your Goal?</h2>
      
      {personalInfo && (
        <div className="user-summary">
          <p>👋 Hi <strong>{personalInfo.name}</strong>! Based on your info, let's set your nutrition goal.</p>
          <div className="summary-stats">
            <span>📏 {personalInfo.feet}'{personalInfo.inches}"</span>
            <span>⚖️ {personalInfo.weight} lbs</span>
            <span>🏋️ {trainingInfo?.weightTraining || 'No'} gym sessions</span>
            <span>🏃 {trainingInfo?.cardio || 'No'} cardio sessions</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="goal-options">
          <label className="goal-option">
            <input
              type="radio"
              name="goal"
              value="lose-weight"
              checked={selectedGoal === 'lose-weight'}
              onChange={handleGoalChange}
            />
            <div className="goal-card">
              <h3>🔥 Lose Weight</h3>
              <p>Focus on fat loss with moderate protein and lower carbs</p>
              <span className="goal-details">500 cal deficit • 0.6g protein/lb • 25% carbs</span>
            </div>
          </label>

          <label className="goal-option">
            <input
              type="radio"
              name="goal"
              value="maintain"
              checked={selectedGoal === 'maintain'}
              onChange={handleGoalChange}
            />
            <div className="goal-card">
              <h3>⚖️ Maintain Weight</h3>
              <p>Maintain current weight with balanced nutrition</p>
              <span className="goal-details">Maintenance calories • 0.8g protein/lb • 35% carbs</span>
            </div>
          </label>

          <label className="goal-option">
            <input
              type="radio"
              name="goal"
              value="recomp"
              checked={selectedGoal === 'recomp'}
              onChange={handleGoalChange}
            />
            <div className="goal-card">
              <h3>💪 Lose Fat + Gain Muscle</h3>
              <p>Body recomposition with high protein</p>
              <span className="goal-details">Small deficit • 0.9g protein/lb • 30% carbs</span>
            </div>
          </label>

          <label className="goal-option">
            <input
              type="radio"
              name="goal"
              value="bulk"
              checked={selectedGoal === 'bulk'}
              onChange={handleGoalChange}
            />
            <div className="goal-card">
              <h3>🚀 Gain Weight/Muscle</h3>
              <p>Muscle building with higher carbs for energy</p>
              <span className="goal-details">400 cal surplus • 1.1g protein/lb • 40% carbs</span>
            </div>
          </label>
        </div>

        <button 
          type="submit" 
          className="calculate-btn"
          disabled={!selectedGoal || isCalculating}
        >
          {isCalculating ? '🧮 Calculating Your Macros...' : '🎯 Calculate My Macros'}
        </button>
      </form>

      {/* Results Section */}
      {showResults && macroResults && (
        <div className="results-section">
          <h3>📊 Your Personalized Macro Plan</h3>
          <div className="goal-display">
            <h4>Goal: {macroResults.goalName}</h4>
            <p>Activity Level: {macroResults.activityLevel}</p>
          </div>

          <div className="macro-grid">
            <div className="macro-card calories">
              <div className="macro-icon">🔥</div>
              <div className="macro-info">
                <h4>Daily Calories</h4>
                <p className="macro-value">{macroResults.calories}</p>
                <span className="macro-detail">kcal per day</span>
              </div>
            </div>

            <div className="macro-card protein">
              <div className="macro-icon">🥩</div>
              <div className="macro-info">
                <h4>Protein</h4>
                <p className="macro-value">{macroResults.protein}g</p>
                <span className="macro-detail">{macroResults.proteinPercentage}% of calories</span>
              </div>
            </div>

            <div className="macro-card carbs">
              <div className="macro-icon">🍞</div>
              <div className="macro-info">
                <h4>Carbohydrates</h4>
                <p className="macro-value">{macroResults.carbs}g</p>
                <span className="macro-detail">{macroResults.carbPercentage}% of calories</span>
              </div>
            </div>

            <div className="macro-card fats">
              <div className="macro-icon">🥑</div>
              <div className="macro-info">
                <h4>Fats</h4>
                <p className="macro-value">{macroResults.fats}g</p>
                <span className="macro-detail">{macroResults.fatPercentage}% of calories</span>
              </div>
            </div>
          </div>

          <div className="additional-info">
            <p><strong>BMR:</strong> {macroResults.bmr} calories (what you burn at rest)</p>
            <p><strong>TDEE:</strong> {macroResults.tdee} calories (with activity included)</p>
          </div>

          <button onClick={handleContinue} className="continue-btn">
            ✅ Continue to Food Suggestions
          </button>
        </div>
      )}
    </div>
  )
}

export default GoalSelection