'use client'

import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'

interface MediaPickerProps {
  setHasPreview?: Dispatch<SetStateAction<Boolean>>
}

export function MediaPicker({ setHasPreview }: MediaPickerProps) {
  const [preview, setPreview] = useState<string | null>(null)

  /* Hack para descobrir o tipo de Event é so passar o mouse por cima do elemento e do onChange dele */
  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return
    }

    const previewURL = URL.createObjectURL(files[0])

    setPreview(previewURL)
    setHasPreview && setHasPreview(!!previewURL)
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        name="coverUrl" // Form utiliza
        type="file"
        accept="image/*"
        id="media"
        className="invisible h-0 w-0"
      />

      {preview && (
        // eslint-disable-next-line
        <img
          src={preview}
          alt=""
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
    </>
  )
}
