import { useState } from 'react'
import './FoodSuggestions.css'

function FoodSuggestions({ personalInfo, trainingInfo, macroResults }) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  // New state for enhanced features
  const [availableFoods, setAvailableFoods] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [rerollCount, setRerollCount] = useState(0)

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  // Original generate suggestions function
  const generateSuggestions = async () => {
    if (!macroResults) return

    setLoading(true)
    setError(null)

    try {
      const prompt = createPrompt(personalInfo, trainingInfo, macroResults)
      console.log('Sending prompt to OpenAI:', prompt)

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
          temperature: 0.8 // Moderate creativity for variety
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a few minutes.')
        } else if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI API key.')
        } else {
          throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
        }
      }

      const data = await response.json()
      const aiResponse = data.choices[0].message.content
      console.log('OpenAI Response:', aiResponse)

      const parsedSuggestions = parseAIResponse(aiResponse)
      setSuggestions(parsedSuggestions)

    } catch (err) {
      console.error('OpenAI API Error:', err)
      setError(err.message)
      setSuggestions(getFallbackSuggestions())
    } finally {
      setLoading(false)
    }
  }

  // Enhanced prompt creation with available foods
  const createPrompt = (personal, training, macros) => {
    const availableFoodsText = availableFoods.trim() ? `
    
IMPORTANT: The user has these foods available: ${availableFoods}
Please PRIORITIZE these foods in your suggestions and show specific ways to use them to meet the macro targets.
If possible, build meal ideas around these available ingredients.
    ` : ''

    return `
${availableFoodsText}

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
${availableFoods.trim() ? 'Remember to incorporate the available foods listed above wherever possible.' : ''}
`
  }

  // Chat functionality
  const sendChatMessage = async () => {
    if (!chatInput.trim() || !macroResults) return

    const userMessage = chatInput.trim()
    setChatInput('')
    setChatLoading(true)

    // Add user message to chat
    const newMessages = [...chatMessages, { role: 'user', content: userMessage }]
    setChatMessages(newMessages)

    try {
      const chatPrompt = createChatPrompt(userMessage, availableFoods, macroResults, newMessages.slice(-6)) // Last 6 messages for context

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
              content: 'You are a helpful nutrition assistant. Provide practical, specific advice about food and macro planning. Keep responses concise but helpful.'
            },
            {
              role: 'user',
              content: chatPrompt
            }
          ],
          max_tokens: 400,
          temperature: 0.7
        })
      })

      if (!response.ok) throw new Error('Failed to get chat response')

      const data = await response.json()
      const aiResponse = data.choices[0].message.content

      // Add AI response to chat
      setChatMessages([...newMessages, { role: 'assistant', content: aiResponse }])

    } catch (err) {
      console.error('Chat Error:', err)
      setChatMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Sorry, I had trouble responding. Please try again.' 
      }])
    } finally {
      setChatLoading(false)
    }
  }

  const createChatPrompt = (userQuestion, foods, macros, recentMessages) => {
    const context = recentMessages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n')

    return `
User's macro targets: ${macros.calories} calories, ${macros.protein}g protein, ${macros.carbs}g carbs, ${macros.fats}g fats
User's goal: ${macros.goalName}
Available foods: ${foods || 'Not specified'}

Recent conversation:
${context}

Current question: ${userQuestion}

Please provide helpful, specific advice about nutrition and meal planning based on their goals and available foods.
`
  }

  // Reroll function
  const rerollSuggestions = () => {
    setRerollCount(prev => prev + 1)
    generateSuggestions(true)
  }

  // All your existing helper functions remain the same
  const parseAIResponse = (response) => {
    try {
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      const parsed = JSON.parse(cleanResponse)
      return parsed.suggestions || []
    } catch (err) {
      console.error('Failed to parse AI response:', err)
      return extractSuggestionsManually(response)
    }
  }

  const extractSuggestionsManually = (response) => {
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
        {/* Available Foods Input - Always Visible */}
        <div className="available-foods-section">
          <div className="foods-input-container">
            <label htmlFor="foods">Foods I have available (optional):</label>
            <input
              id="foods"
              type="text"
              value={availableFoods}
              onChange={(e) => setAvailableFoods(e.target.value)}
              placeholder="e.g., chicken, rice, broccoli, eggs..."
              className="foods-input"
            />
          </div>
        </div>

        {/* Main Generate Button */}
        <button 
          onClick={() => generateSuggestions(false)}
          disabled={loading || !macroResults}
          className="generate-btn"
        >
          {loading ? '🤖 AI is thinking...' : '✨ Get AI Food Suggestions'}
        </button>

        {/* Chat Toggle - Always Visible */}
        <button 
          onClick={() => setShowChat(!showChat)}
          className="chat-toggle-btn"
        >
          {showChat ? '📋 Hide Nutrition Chat' : '💬 Ask AI About Nutrition'}
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

      {/* Chat Interface - Can be toggled */}
      {showChat && (
        <div className="chat-interface">
          <div className="chat-header">
            <h3>Ask About Your Nutrition</h3>
            <p>Ask specific questions about meal planning, portions, timing, and substitutions!</p>
          </div>

          <div className="chat-messages">
            {chatMessages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="message assistant">
                <div className="message-content typing">AI is typing...</div>
              </div>
            )}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Ask about meal ideas, portions, timing, substitutions..."
              className="chat-input"
              disabled={chatLoading}
            />
            <button 
              onClick={sendChatMessage}
              disabled={!chatInput.trim() || chatLoading}
              className="send-btn"
            >
              Send
            </button>
          </div>
        </div>
      )}

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