import React, { useMemo } from 'react'
import { Routes ,BrowserRouter,Navigate,Route} from 'react-router-dom'
import { themeSettings } from '../theme'
import { useSelector } from 'react-redux'
import { createTheme } from "@mui/material/styles";
import { CssBaseline ,ThemeProvider} from '@mui/material'
import Home from './scenes/homePage'

const App = () => {
  const mode=useSelector((state)=>state.mode);
  const theme=useMemo(()=>createTheme(themeSettings(mode)),[mode] );
  return (
    <div className='app'>
     < BrowserRouter>
  < ThemeProvider theme={theme}> 
  <CssBaseline/>
 
  <Routes>
      <Route path='/' element={<Home/>}/>
      </Routes>
      </ThemeProvider>
      </ BrowserRouter>
    </div>
  )
}

export default App
