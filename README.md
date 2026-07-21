# MacroFlexx Calculator App

MacroFlexx is a React/Vite web app that helps users calculate nutrition macros based on personal information, training habits, and fitness goals. The app guides users through a multi-step flow and finishes with macro results and food suggestions.

## Overview

MacroFlexx was built as a fitness-focused calculator for people who want a clearer starting point for nutrition planning. Users enter personal data, answer training questions, choose a goal, and receive macro guidance that can support muscle gain, fat loss, or general fitness progress.

## Features

- Multi-step macro calculator flow
- Personal information form
- Training assessment step
- Goal selection step
- Macro result calculation
- Food suggestion screen
- Responsive React interface
- Custom visual styling with CSS
- Ko-fi support link
- Vite development setup

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Lucide React
- ESLint

## Project Structure

```text
src/
- App.jsx                         # Main app state and step navigation
- App.css                         # Main app styling
- main.jsx                        # React entry point
- index.css                       # Global styles

src/components/
- PersonalInfoForm.jsx            # Collects user body/personal data
- TrainingAssessment.jsx          # Collects training information
- GoalSelection.jsx               # Lets users choose a fitness goal
- FoodSuggestions.jsx             # Shows food suggestions based on results
```

## App Flow

```text
Welcome Screen
↓
Personal Info Form
↓
Training Assessment
↓
Goal Selection
↓
Macro Results / Food Suggestions
```

## Requirements

- Node.js
- npm

## Installation

Clone the repository:

```bash
git clone https://github.com/elvissanchez73/MacroFlexx-Calculator-App.git
```

Move into the project folder:

```bash
cd MacroFlexx-Calculator-App
```

Install dependencies:

```bash
npm install
```

## Run Locally

Start the development server:

```bash
npm run dev
```

Then open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## What I Learned

- Building a multi-step React app
- Managing form data with component state
- Passing data between parent and child components
- Creating reusable UI components
- Styling a fitness-focused interface with CSS
- Using Vite for fast React development

## Future Improvements

- Add persistent user profiles
- Save macro results locally or in a backend
- Add charts for macro breakdowns
- Improve food suggestions with more structured meal plans
- Add tests for calculation logic
- Deploy the app with Vercel or Netlify

## Author

Built by [Elvis J. Sanchez Robles](https://github.com/elvissanchez73).
