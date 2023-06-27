import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  ScrollView,
  Image,
} from 'react-native'
import Icon from '@expo/vector-icons/Feather' // O Expo ja disponibiliza esta lib de icones
import { Link } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { api } from '../src/lib/api'

export default function NewMemory() {
  // hook nativo que retorna os tamanhos de areas seguras da tela (fora da Status bar, por exemplo)
  const { bottom, top } = useSafeAreaInsets()

  const [preview, setPreview] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState(false)
  const [content, setContent] = useState('')

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })

      if (result.assets[0]) {
        setPreview(result.assets[0].uri)
      }
    } catch (err) {
      // Tratar erro
      console.error(err)
    }
  }

  async function handleCreateMemory() {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''

    if (preview) {
      const uploadFormData = new FormData() // Multipart Form para envio da imagem

      uploadFormData.append('file', {
        uri: preview,
        name: 'image.jpg', // Pode ser qualquer nome, pois nao sera utilizado
        type: 'image/jpeg',
      } as any)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      coverUrl = uploadResponse.data.fileUrl

      console.log(coverUrl)
    }
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      {/* Header */}
      <View className="mt-4 flex-row items-center justify-between">
        <NLWLogo />

        {/* asChild faz o TouchableOpacity ou o que tiver dentro, se comportar como o Link */}
        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#FFF" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Formulario */}
      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
            trackColor={{ false: '#767577', true: '#372560' }}
          />
          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>

        {/* Seleção de arquivos */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openImagePicker}
          className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
        >
          {preview ? (
            <Image
              source={{ uri: preview }}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color={'#FFF'} />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou video de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Descrição da memória / Área de textual */}
        <TextInput
          multiline
          value={content}
          textAlignVertical="top"
          onChangeText={setContent}
          className="p-0 font-body text-lg text-gray-50"
          placeholderTextColor={'#56565a'}
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        />

        <TouchableOpacity
          activeOpacity={0.7}
          className="mb-4 items-center self-end rounded-full bg-green-500 px-5 py-2"
        >
          <Text
            onPress={handleCreateMemory}
            className="font-alt text-sm uppercase text-black"
          >
            Salvar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
