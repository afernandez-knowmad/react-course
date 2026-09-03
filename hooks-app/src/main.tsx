import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { FoscusScreen } from './useRef/FoscusScreen'
// import { HooksApp } from './HooksApp.tsx'
// import { TrafficLight } from './useState/TrafficLight.tsx'
// import { TrafficLightWithEffect } from './useEffect/TrafficLightWithEffect.tsx'
// import { TrafficLightWithHook } from './useEffect/TrafficLightWithHook.tsx'
// import { PokemonPage } from './examples/Pokemon.page.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <TrafficLight /> */}
    <FoscusScreen />
  </StrictMode>,
)
