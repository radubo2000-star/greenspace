import { useState, useEffect, useCallback } from 'react'
import { Image as ImageIcon, Link as LinkIcon, X, Video, Play } from 'lucide-react'
import { getBackendUrl } from '@/lib/backend-config'
import { getAuthHeaders } from '@/lib/auth-headers'

interface MediaFile {
  filename: string
  url: string
  path: string
  size: number
  type: 'image' | 'video'
  mimetype: string
  createdAt: string
}

interface MediaSelectorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  acceptedTypes?: ('image' | 'video')[]
  showPreview?: boolean
  isAvatar?: boolean
  required?: boolean
}

const MediaSelector = ({ 
  value, 
  onChange, 
  label, 
  placeholder,
  acceptedTypes = ['image', 'video'],
  showPreview = true,
  isAvatar = false,
  required: _required = false
}: MediaSelectorProps)=> {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'local' | 'url'>('local')
  const [files, setFiles] = useState<MediaFile[]>([])
  const [urlInput, setUrlInput] = useState('')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all')

  const loadFiles = useCallback(async (signal: AbortSignal) => {
    setLoading(true)
    try {
      const backendUrl = getBackendUrl()
      const headers = await getAuthHeaders()

      const response = await fetch(`${backendUrl}/files/list?path=uploads`, { headers, signal })
      if (!response.ok) {
        throw new Error('Failed to fetch files')
      }
      const data = await response.json()

      // Flatten all files from subdirectories
      const allFiles: MediaFile[] = []
      const folders: Array<any> = Array.isArray(data?.files) ? data.files : []

      // Get files from images and videos subdirectories
      for (const folder of folders) {
        if (signal.aborted) return

        if (folder.type === 'directory' && (folder.name === 'images' || folder.name === 'videos')) {
          const subResponse = await fetch(`${backendUrl}/files/list?path=uploads/${folder.name}`, { headers, signal })
          if (!subResponse.ok) continue

          const subData = await subResponse.json()
          if (subData?.success && Array.isArray(subData.files)) {
            const subFiles: MediaFile[] = subData.files
              .filter((f: { type?: string }) => f.type === 'file')
              .map((file: { name: string; path: string; size?: number; modified?: string; mimetype?: string }) => {
                const mediaType: 'image' | 'video' = folder.name === 'videos' ? 'video' : 'image'
                return {
                  filename: file.name,
                  path: file.path,
                  url: `${backendUrl}/data/${file.path}`,
                  type: mediaType,
                  size: file.size ?? 0,
                  mimetype: file.mimetype ?? (mediaType === 'video' ? 'video/*' : 'image/*'),
                  createdAt: file.modified ?? ''
                }
              })

            allFiles.push(...subFiles)
          }
        }
      }

      // Filter by accepted types
      const filteredByAccepted = allFiles.filter((file) => acceptedTypes.includes(file.type))
      setFiles(filteredByAccepted)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }
      console.error('Error loading files:', error)
    } finally {
      setLoading(false)
    }
  }, [acceptedTypes])

  // Load files from backend
  useEffect(() => {
    if (!isOpen) return

    const controller = new AbortController()
    void loadFiles(controller.signal)

    return () => controller.abort()
  }, [isOpen, loadFiles])

  const handleSelectLocal = (url: string) => {
    setSelectedFile(url)
    onChange(url)
    setIsOpen(false)
  }

  const handleSelectUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setIsOpen(false)
      setUrlInput('')
    }
  }

  const getPreviewUrl = (url: string) => {
    if (url.startsWith('http')) return url

    const backendUrl = getBackendUrl()
    if (url.startsWith('/')) return `${backendUrl}${url}`

    return `${backendUrl}/${url.replace(/^\//, '')}`
  }

  const isVideoUrl = (url: string) => {
    return url.includes('/videos/') || 
           url.match(/\.(mp4|webm|ogg|mov)$/i) !== null
  }

  const filteredFiles = files.filter(file => {
    if (filterType === 'all') return true
    return file.type === filterType
  })

  const imageCount = files.filter(f => f.type === 'image').length
  const videoCount = files.filter(f => f.type === 'video').length

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Selectează fișier sau introdu URL'}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            setIsOpen(true)
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
        >
          Selectează
        </button>
      </div>

      {showPreview && value && (
        <div className="mt-2">
          {isVideoUrl(value) ? (
            <div className="relative w-64 h-36 bg-black rounded-lg overflow-hidden">
              <video
                src={getPreviewUrl(value)}
                className="w-full h-full object-contain"
                controls
              />
            </div>
          ) : (
            <img
              src={getPreviewUrl(value)}
              alt="Preview"
              className={isAvatar 
                ? "w-16 h-16 rounded-full object-cover border-2 border-gray-200" 
                : "w-32 h-20 object-cover rounded-lg border border-gray-200"
              }
              onError={(e) => {
                if (isAvatar) {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Ccircle fill="%23ddd" cx="32" cy="32" r="32"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Avatar%3C/text%3E%3C/svg%3E'
                } else {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                }
              }}
            />
          )}
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Selectează Media
              </h2>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab('local')
                }}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'local'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Fișiere Locale ({files.length})
                </div>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab('url')
                }}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'url'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  URL Extern
                </div>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {activeTab === 'local' ? (
                <div>
                  {/* Filter Buttons */}
                  {acceptedTypes.length > 1 && (
                    <div className="flex gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => setFilterType('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filterType === 'all'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Toate ({files.length})
                      </button>
                      {acceptedTypes.includes('image') && (
                        <button
                          type="button"
                          onClick={() => setFilterType('image')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filterType === 'image'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Imagini ({imageCount})
                          </div>
                        </button>
                      )}
                      {acceptedTypes.includes('video') && (
                        <button
                          type="button"
                          onClick={() => setFilterType('video')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filterType === 'video'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            Video-uri ({videoCount})
                          </div>
                        </button>
                      )}
                    </div>
                  )}

                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                      <p className="text-gray-500">Se încarcă fișierele...</p>
                    </div>
                  ) : filteredFiles.length === 0 ? (
                    <div className="text-center py-12">
                      <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">
                        Nu există fișiere încărcate încă
                      </p>
                      <a
                        href="/admin/images"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Încarcă Fișiere
                      </a>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredFiles.map((file) => (
                        <button
                          key={file.filename}
                          type="button"
                          onClick={() => handleSelectLocal(file.url)}
                          className={`group relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            selectedFile === file.url
                              ? 'border-green-600 ring-2 ring-green-200'
                              : 'border-gray-200 hover:border-green-400'
                          }`}
                        >
                          {file.type === 'video' ? (
                            <div className="relative w-full h-full bg-black">
                              <video
                                src={file.url}
                                className="w-full h-full object-cover"
                                muted
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                <Play className="w-12 h-12 text-white" />
                              </div>
                            </div>
                          ) : (
                            <img
                              src={file.url}
                              alt={file.filename}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                              Selectează
                            </span>
                          </div>
                          <div className="absolute top-2 right-2">
                            {file.type === 'video' ? (
                              <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                                VIDEO
                              </div>
                            ) : (
                              <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                                IMG
                              </div>
                            )}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                            <p className="text-white text-xs truncate">
                              {file.filename}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Media
                    </label>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/media.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSelectUrl()
                        }
                      }}
                    />
                  </div>

                  {urlInput && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                      {isVideoUrl(urlInput) ? (
                        <video
                          src={urlInput}
                          className="w-full max-w-md h-48 object-contain rounded-lg border border-gray-200 bg-black"
                          controls
                        />
                      ) : (
                        <img
                          src={urlInput}
                          alt="Preview"
                          className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EInvalid URL%3C/text%3E%3C/svg%3E'
                          }}
                        />
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSelectUrl}
                    disabled={!urlInput.trim()}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Folosește acest URL
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MediaSelector
