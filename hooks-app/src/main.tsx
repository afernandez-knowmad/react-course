import {
  StrictMode,
  //Suspense 
} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from 'sonner';
import { ProfessionalApp } from './useContext/ProfessionalApp';
// import { ClientInformation } from './use-suspense/ClientInformation.tsx';
// import { getUserAction } from './use-suspense/api/get-user.action.ts';

// import { InstagromApp } from './useOptimistic/InstagromApp.tsx'
// import { MemoCounter } from './memos/MemoCounter.tsx'
// import { MemoHook } from './memos/MemoHook.tsx'
// import { ScrambleWords } from './useReducer/ScrambleWords.tsx'
// import { TasksApp } from './useReducer/TasksApp.tsx'
// import { FoscusScreen } from './useRef/FoscusScreen'
// import { HooksApp } from './HooksApp.tsx'
// import { TrafficLight } from './useState/TrafficLight.tsx'
// import { TrafficLightWithEffect } from './useEffect/TrafficLightWithEffect.tsx'
// import { TrafficLightWithHook } from './useEffect/TrafficLightWithHook.tsx'
// import { PokemonPage } from './examples/Pokemon.page.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <TrafficLight /> */}
    <Toaster />
    <ProfessionalApp />
    {/* <Suspense fallback={
      <div className='bg-gradient flex flex-col'>
        <h1>Cargando</h1>
      </div>
    }>
      <ClientInformation getUser={getUserAction(1000)} />
    </Suspense> */}
  </StrictMode>,
)
