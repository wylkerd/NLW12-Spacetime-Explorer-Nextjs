import { styled } from 'nativewind'
import { ImageBackground } from 'react-native'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import blurBg from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripes.svg' // Impotacoes SVG virao componentes com a lib react-native-svg-transformer
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

// Hack de estilo para componentes nao nativos do React Native
// Permite que eu use o Nativewind + Tailwind no compoente de SVG
const StyleStripes = styled(Stripes)

export default function Layout() {
  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  // So mostrara a interface depois que as fontes carregarem
  if (!hasLoadedFonts) {
    return <SplashScreen />
  }

  return (
    <ImageBackground
      source={blurBg}
      className="relative flex-1 bg-gray-900"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      {/* Stripes */}
      <StyleStripes className="absolute left-2" />
      <StatusBar style="light" translucent />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' }, // Herda o background deste layout
        }}
      />
    </ImageBackground>
  )
}
