import { useState } from 'react'
import './FoodSuggestions.css'

function FoodSuggestions({ personalInfo, trainingInfo, macroResults }) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')


  // Get OpenAI API key from Vite env
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  // Generate AI food suggestions
  const generateSuggestions = async () => {
    if (!macroResults) return

    setLoading(true)
    setError(null)

    try {
      // Create a detailed prompt for OpenAI
      const prompt = createPrompt(personalInfo, trainingInfo, macroResults)
      
      console.log('Sending prompt to OpenAI:', prompt)


      // Use fetch to call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a nutrition expert who provides specific, practical food recommendations based on macro targets. Always respond in valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 800,
          temperature: 0.7
        })
      })

      if (!response.ok) throw new Error('OpenAI API error: ' + response.status)
      const data = await response.json()
      const aiResponse = data.choices[0].message.content
      console.log('OpenAI Response:', aiResponse)

      // Parse the AI response
      const parsedSuggestions = parseAIResponse(aiResponse)
      setSuggestions(parsedSuggestions)

    } catch (err) {
      console.error('OpenAI API Error:', err)
      setError(`Failed to get AI suggestions: ${err.message}`)
      
      // Fallback to static suggestions if API fails
      setSuggestions(getFallbackSuggestions())
    } finally {
      setLoading(false)
    }
  }

  // Create a detailed prompt for the AI
  const createPrompt = (personal, training, macros) => {
    return `
Create food suggestions for a person with these details:
- ${personal.age} year old ${personal.gender}
- ${personal.weight} lbs, ${personal.feet}'${personal.inches}"
- Goal: ${macros.goalName}
- Training: ${training.weightTraining} gym, ${training.cardio} cardio per week
- Daily targets: ${macros.calories} calories, ${macros.protein}g protein, ${macros.carbs}g carbs, ${macros.fats}g fats

Please provide 5 food suggestion categories in this EXACT JSON format:
{
  "suggestions": [
    {
      "category": "High Protein Breakfast",
      "foods": ["food1", "food2", "food3"],
      "macros": "Brief macro info",
      "tips": "Practical tip"
    }
  ]
}

Categories should include:
1. High Protein options for their ${macros.protein}g target
2. Pre-workout meals for their training
3. Post-workout recovery foods
4. Healthy snacks that fit their macros
5. Complete meal ideas for their goal

Focus on whole foods, be specific with food names, and consider their ${macros.goalName} goal.
`
  }

  // Parse AI response (handle potential JSON issues)
  const parseAIResponse = (response) => {
    try {
      // Clean up the response (remove markdown formatting if present)
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      const parsed = JSON.parse(cleanResponse)
      return parsed.suggestions || []
    } catch (err) {
      console.error('Failed to parse AI response:', err)
      
      // Try to extract suggestions manually if JSON parsing fails
      return extractSuggestionsManually(response)
    }
  }

  // Manual extraction if JSON parsing fails
  const extractSuggestionsManually = (response) => {
    // Simple fallback - look for patterns in the response
    const lines = response.split('\n')
    const suggestions = []
    
    let currentCategory = null
    let currentFoods = []
    
    lines.forEach(line => {
      if (line.includes('category') || line.includes('Category')) {
        if (currentCategory) {
          suggestions.push({
            category: currentCategory,
            foods: currentFoods,
            macros: "AI-generated suggestions",
            tips: "Follow your macro targets"
          })
        }
        currentCategory = line.replace(/[^a-zA-Z\s]/g, '').trim()
        currentFoods = []
      } else if (line.includes('-') || line.includes('•')) {
        const food = line.replace(/[-•]/g, '').trim()
        if (food) currentFoods.push(food)
      }
    })
    
    return suggestions
  }

  // Fallback suggestions if API fails
  const getFallbackSuggestions = () => {
    const { protein, carbs, fats, goalName } = macroResults
    
    return [
      {
        category: "High Protein Sources",
        foods: ["Chicken breast", "Greek yogurt", "Eggs", "Protein powder", "Salmon"],
        macros: `Target: ${protein}g protein`,
        tips: "Spread protein intake throughout the day"
      },
      {
        category: "Complex Carbs",
        foods: ["Oatmeal", "Brown rice", "Sweet potato", "Quinoa"],
        macros: `Target: ${carbs}g carbs`,
        tips: "Time carbs around workouts for energy"
      },
      {
        category: "Healthy Fats",
        foods: ["Avocado", "Almonds", "Olive oil", "Fatty fish"],
        macros: `Target: ${fats}g fats`,
        tips: "Include fats for hormone production"
      }
    ]
  }

  // Filter suggestions by category
  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category.toLowerCase().includes(selectedCategory))

  const categories = [
    { value: 'all', label: 'All Suggestions' },
    { value: 'protein', label: 'High Protein' },
    { value: 'pre', label: 'Pre-Workout' },
    { value: 'post', label: 'Post-Workout' },
    { value: 'snack', label: 'Snacks' },
    { value: 'meal', label: 'Complete Meals' }
  ]

  return (
    <div className="food-suggestions">
      <div className="suggestions-header">
        <h2>🤖 AI Food Suggestions</h2>
        <p>Personalized recommendations based on your macro targets and goals</p>
        
        {macroResults && (
          <div className="macro-summary">
            <span>🎯 {macroResults.goalName}</span>
            <span>🔥 {macroResults.calories} cal</span>
            <span>🥩 {macroResults.protein}g protein</span>
            <span>🍞 {macroResults.carbs}g carbs</span>
            <span>🥑 {macroResults.fats}g fats</span>
          </div>
        )}
      </div>

      <div className="suggestions-controls">
        <button 
          onClick={generateSuggestions}
          disabled={loading || !macroResults}
          className="generate-btn"
        >
          {loading ? '🤖 AI is thinking...' : '✨ Get AI Food Suggestions'}
        </button>

        {suggestions.length > 0 && (
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
          <p>Showing fallback suggestions instead.</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="suggestions-grid">
          {filteredSuggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-card">
              <h3 className="suggestion-title">{suggestion.category}</h3>
              
              <div className="foods-list">
                {suggestion.foods.map((food, foodIndex) => (
                  <span key={foodIndex} className="food-item">
                    {food}
                  </span>
                ))}
              </div>
              
              {suggestion.macros && (
                <p className="macro-info">{suggestion.macros}</p>
              )}
              
              {suggestion.tips && (
                <p className="tips">{suggestion.tips}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && suggestions.length === 0 && !error && (
        <div className="empty-state">
          <p>Click the button above to get personalized AI food suggestions!</p>
        </div>
      )}

      <div className="ai-info">
        <p>💡 <strong>Powered by OpenAI GPT-3.5</strong></p>
        <p>Suggestions are AI-generated and should be combined with professional nutrition advice.</p>
      </div>
    </div>
  )
}

export default FoodSuggestions