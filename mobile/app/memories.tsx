import { View, TouchableOpacity, ScrollView, Text, Image } from 'react-native'
import Icon from '@expo/vector-icons/Feather' // O Expo ja disponibiliza esta lib de icones
import { Link, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'

export default function Memories() {
  // hook nativo que retorna os tamanhos de areas seguras da tela (fora da Status bar, por exemplo)
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()

  async function signOut() {
    await SecureStore.deleteItemAsync('token')

    router.push('/')
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      {/* Header */}
      <View className="mt-4 flex-row items-center justify-between px-8">
        <NLWLogo />

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>

          {/* asChild faz o TouchableOpacity ou o que tiver dentro, se comportar como o Link */}
          <Link href="/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="mt-6 space-y-10">
        <View className="space-y-4">
          <View className="flex-row items-center gap-2">
            {/* Tracinho */}
            <View className="h-px w-5 bg-gray-50" />
            <Text className="font-body text-xs text-gray-100">
              12 de Abril, 2023
            </Text>
          </View>
          <View className="space-y-4 px-8">
            <Image
              source={{
                uri: 'http://192.168.0.109:3333/uploads/c06910e4-635e-4e81-992d-023343515def.jpg',
              }}
              className="aspect-video rounded-lg"
              alt=""
            />
            <Text className="font-body text-base leading-relaxed text-gray-100">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using `Content here,
              content here`, making it look like readable English.
            </Text>

            {/* asChild faz o TouchableOpacity ou o que tiver dentro, se comportar como o Link */}
            <Link href="/memories/id" asChild>
              <TouchableOpacity className="flex-row items-center gap-2">
                <Text className="font-body text-sm text-gray-200">
                  Ler mais
                </Text>
                <Icon name="arrow-right" size={16} color="#9e9ea0" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
