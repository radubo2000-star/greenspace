import MediaSelector from './MediaSelector'

interface ImageSelectorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  isAvatar?: boolean
  required?: boolean
}

/**
 * ImageSelector - Wrapper around MediaSelector for backward compatibility
 * Use MediaSelector directly for new implementations with video support
 */
const ImageSelector = ({ value, onChange, label, placeholder, isAvatar = false, required = false }: ImageSelectorProps) => {
  return (
    <MediaSelector
      value={value}
      onChange={onChange}
      label={label}
      placeholder={placeholder}
      acceptedTypes={['image']}
      showPreview={true}
      isAvatar={isAvatar}
      required={required}
    />
  )
}

export default ImageSelector
