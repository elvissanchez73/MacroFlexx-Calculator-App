# MacroFlexx Calculator App

MacroFlexx es una aplicacion web construida con React y Vite que ayuda a calcular macros nutricionales segun informacion personal, habitos de entrenamiento y metas de fitness. La app guia al usuario por un flujo de varios pasos y termina con resultados de macros y sugerencias de comida.

## Resumen

MacroFlexx fue creada como una calculadora enfocada en fitness para personas que quieren un punto de partida mas claro para planificar su nutricion. El usuario ingresa datos personales, responde preguntas sobre entrenamiento, selecciona una meta y recibe una guia de macros que puede apoyar aumento muscular, perdida de grasa o progreso general.

## Funcionalidades

- Flujo de calculadora en multiples pasos
- Formulario de informacion personal
- Evaluacion de entrenamiento
- Seleccion de meta fitness
- Calculo de resultados de macros
- Pantalla de sugerencias de comida
- Interfaz responsive construida con React
- Estilos personalizados con CSS
- Enlace de apoyo en Ko-fi
- Configuracion de desarrollo con Vite

## Tecnologias

- React
- Vite
- JavaScript
- CSS
- Lucide React
- ESLint

## Estructura Del Proyecto

```text
src/
- App.jsx                         # Estado principal de la app y navegacion por pasos
- App.css                         # Estilos principales
- main.jsx                        # Punto de entrada de React
- index.css                       # Estilos globales

src/components/
- PersonalInfoForm.jsx            # Recopila informacion personal del usuario
- TrainingAssessment.jsx          # Recopila informacion de entrenamiento
- GoalSelection.jsx               # Permite seleccionar una meta fitness
- FoodSuggestions.jsx             # Muestra sugerencias de comida basadas en resultados
```

## Flujo De La App

```text
Pantalla de bienvenida
↓
Formulario de informacion personal
↓
Evaluacion de entrenamiento
↓
Seleccion de meta
↓
Resultados de macros / Sugerencias de comida
```

## Requisitos

- Node.js
- npm

## Instalacion

Clona el repositorio:

```bash
git clone https://github.com/elvissanchez73/MacroFlexx-Calculator-App.git
```

Entra a la carpeta del proyecto:

```bash
cd MacroFlexx-Calculator-App
```

Instala las dependencias:

```bash
npm install
```

## Ejecutar Localmente

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Luego abre la URL local que aparece en la terminal, normalmente:

```text
http://localhost:5173
```

## Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Crea el build de produccion
npm run preview  # Previsualiza el build de produccion
npm run lint     # Ejecuta ESLint
```

## Lo Que Aprendi

- Construir una aplicacion React de multiples pasos
- Manejar datos de formularios con estado de componentes
- Pasar datos entre componentes padre e hijo
- Crear componentes reutilizables
- Disenar una interfaz enfocada en fitness con CSS
- Usar Vite para desarrollo rapido con React

## Mejoras Futuras

- Agregar perfiles persistentes de usuario
- Guardar resultados localmente o en un backend
- Agregar graficas para visualizar macros
- Mejorar las sugerencias de comida con planes mas estructurados
- Agregar pruebas para la logica de calculo
- Desplegar la app con Vercel o Netlify

## Autor

Construido por [Elvis J. Sanchez Robles](https://github.com/elvissanchez73).
