import { useState, useEffect, useRef, useCallback } from 'react'
import { Upload, Image as ImageIcon, Trash2, Copy, Check, ArrowLeft, Info, FileVideo } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getBackendUrl } from '@/lib/backend-config'
import { generateVideoThumbnail } from '@/lib/video-thumbnail-generator'
import { getAuthHeaders } from '@/lib/auth-headers'

interface UploadedFile {
  name: string
  path: string
  size: number
  uploadedAt: string
  type: 'image' | 'video'
  mimeType: string
}

const ImageUploadAdminPage = () => {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [copiedPath, setCopiedPath] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const backendUrl = getBackendUrl()

  // Load files from backend
  const loadFiles = useCallback(async (signal?: AbortSignal) => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${backendUrl}/files/list?path=uploads`, { headers, signal })
      const data = await response.json()
      
      if (data.success && data.files) {
        // Flatten all files from subdirectories
        const allFiles: UploadedFile[] = []
        
        // Get files from images and videos subdirectories
        for (const folder of data.files) {
          if (folder.type === 'directory' && (folder.name === 'images' || folder.name === 'videos')) {
            const subResponse = await fetch(`${backendUrl}/files/list?path=uploads/${folder.name}`, { headers, signal })
            const subData = await subResponse.json()
            
            if (subData.success && subData.files) {
              const subFiles = subData.files
                .filter((f: any) => f.type === 'file')
                .map((file: any) => ({
                  name: file.name,
                  path: `${backendUrl}/data/${file.path}`,
                  size: file.size,
                  uploadedAt: file.mtime || file.modified,
                  type: folder.name === 'videos' ? 'video' : 'image',
                  mimeType: file.name.endsWith('.mp4') ? 'video/mp4' : 
                           file.name.endsWith('.webm') ? 'video/webm' :
                           file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') ? 'image/jpeg' :
                           file.name.endsWith('.png') ? 'image/png' :
                           file.name.endsWith('.gif') ? 'image/gif' :
                           file.name.endsWith('.webp') ? 'image/webp' : 'application/octet-stream'
                }))
              allFiles.push(...subFiles)
            }
          }
        }
        
        // Sort files by modification time (newest first)
        allFiles.sort((a, b) => {
          if (!a.uploadedAt || !b.uploadedAt) return 0;
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        });
        
        setFiles(allFiles)
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return; // Request was cancelled by cleanup — not an error
      }
      console.error('Error loading files:', error)
    }
  }, [backendUrl])

  useEffect(() => {
    const controller = new AbortController()
    loadFiles(controller.signal)
    return () => {
      controller.abort()
    }
  }, [loadFiles])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setSelectedFiles(selectedFiles)
  }

  // Compress video using canvas and MediaRecorder API
  const compressVideo = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      
      video.onloadedmetadata = async () => {
        URL.revokeObjectURL(video.src)
        
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // Set max dimensions (720p)
        const maxWidth = 1280
        const maxHeight = 720
        let width = video.videoWidth
        let height = video.videoHeight
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = width * ratio
          height = height * ratio
        }
        
        canvas.width = width
        canvas.height = height
        
        const stream = canvas.captureStream(30)
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 2500000 // 2.5 Mbps
        })
        
        const chunks: Blob[] = []
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data)
          }
        }
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' })
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webm'), {
            type: 'video/webm'
          })
          resolve(compressedFile)
        }
        
        mediaRecorder.onerror = () => {
          reject(new Error('Video compression failed'))
        }
        
        mediaRecorder.start()
        
        video.currentTime = 0
        video.play()
        
        const drawFrame = () => {
          if (video.ended) {
            mediaRecorder.stop()
            return
          }
          
          ctx?.drawImage(video, 0, 0, width, height)
          requestAnimationFrame(drawFrame)
        }
        
        drawFrame()
      }
      
      video.onerror = () => {
        reject(new Error('Failed to load video'))
      }
      
      video.src = URL.createObjectURL(file)
    })
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setUploading(true)

    try {
      const authHeaders = await getAuthHeaders()

      // Process files one by one: compress first, then upload
      for (const file of selectedFiles) {
        // Check if file already exists
        try {
          const isVideo = file.type.startsWith('video/')
          const checkResponse = await fetch(`${backendUrl}/check-file`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...authHeaders,
            },
            body: JSON.stringify({
              filename: file.name,
              type: isVideo ? 'video' : 'image'
            }),
          })

          const checkData = await checkResponse.json()

          if (checkData.exists) {
            const confirmOverwrite = window.confirm(
              `Fișierul "${file.name}" există deja. Dorești să-l suprascrii?`
            )

            if (!confirmOverwrite) {
              console.log(`⏭️ Skipping file: ${file.name}`)
              continue // Skip this file
            }
          }
        } catch (error) {
          console.error('Error checking file existence:', error)
          // Continue with upload even if check fails
        }

        let fileToUpload = file
        let thumbnailFile: File | null = null
        
        // Step 1: Compress video files FIRST (before upload)
        if (file.type.startsWith('video/')) {
          try {
            console.log(`🎬 Compressing video: ${file.name}...`)
            fileToUpload = await compressVideo(file)
            console.log(`✅ Compression complete: ${fileToUpload.name}`)
            
            // Step 1.5: Generate thumbnail from compressed video (using the compressed file's name)
            console.log(`📸 Generating thumbnail for: ${fileToUpload.name}...`)
            try {
              // Generate thumbnail from original video but use compressed video's name
              const thumbnailBlob = await generateVideoThumbnail(file)
              // Create new File with name matching the compressed video
              const baseNameWithoutExt = fileToUpload.name.replace(/\.[^/.]+$/, '')
              thumbnailFile = new File([thumbnailBlob], `${baseNameWithoutExt}-thumbnail.jpg`, {
                type: 'image/jpeg'
              })
              console.log(`✅ Thumbnail generated: ${thumbnailFile.name}`)
            } catch (thumbError) {
              console.warn(`⚠️ Thumbnail generation failed for ${file.name}:`, thumbError)
            }
          } catch (error) {
            console.warn(`⚠️ Compression failed for ${file.name}, uploading original`)
            fileToUpload = file
            
            // Try to generate thumbnail from original file
            if (file.type.startsWith('video/')) {
              try {
                thumbnailFile = await generateVideoThumbnail(file)
              } catch (thumbError) {
                console.warn(`⚠️ Thumbnail generation failed:`, thumbError)
              }
            }
          }
        }
        
        // Step 2: Upload the (possibly compressed) video file
        console.log(`📤 Starting upload: ${fileToUpload.name}`)
        
        let uploadedVideoName = ''
        
        await new Promise<void>((resolve, reject) => {
          const formData = new FormData()
          formData.append('file', fileToUpload)

          const xhr = new XMLHttpRequest()
          
          // Set 1 minute timeout for large files
          xhr.timeout = 60000

          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const percentComplete = (e.loaded / e.total) * 100
              console.log(`📊 Upload progress: ${percentComplete.toFixed(1)}%`)
            }
          })

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              console.log(`✅ Upload complete: ${fileToUpload.name}`)
              
              // Extract the uploaded filename from response
              try {
                const response = JSON.parse(xhr.responseText)
                if (response.success && response.file && response.file.filename) {
                  uploadedVideoName = response.file.filename
                  console.log(`📝 Uploaded video name: ${uploadedVideoName}`)
                }
              } catch (e) {
                console.warn('Could not parse upload response:', e)
              }
              
              resolve()
            } else {
              reject(new Error(`Upload failed for ${file.name}: ${xhr.statusText}`))
            }
          })

          xhr.addEventListener('error', () => {
            reject(new Error(`Network error uploading ${file.name}`))
          })

          xhr.addEventListener('abort', () => {
            reject(new Error(`Upload aborted for ${file.name}`))
          })
          
          xhr.addEventListener('timeout', () => {
            reject(new Error(`Upload timeout for ${file.name} (exceeded 10 minutes)`))
          })

          xhr.open('POST', `${backendUrl}/upload`)
          // Set auth headers for upload
          Object.entries(authHeaders).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value)
          })
          xhr.send(formData)
        })
        
        // Step 3: Upload thumbnail if it was generated
        if (thumbnailFile && uploadedVideoName) {
          // Create thumbnail with matching name (same timestamp as video)
          const videoNameWithoutExt = uploadedVideoName.replace(/\.[^/.]+$/, '')
          const thumbnailBlob = thumbnailFile.slice(0, thumbnailFile.size, 'image/jpeg')
          const matchingThumbnailFile = new File([thumbnailBlob], `${videoNameWithoutExt}-thumbnail.jpg`, {
            type: 'image/jpeg'
          })
          
          console.log(`📤 Uploading thumbnail: ${matchingThumbnailFile.name}`)
          
          await new Promise<void>((resolve, _reject) => {
            const formData = new FormData()
            formData.append('file', matchingThumbnailFile)

            const xhr = new XMLHttpRequest()
            xhr.timeout = 30000 // 30 seconds for thumbnail

            xhr.addEventListener('load', () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                console.log(`✅ Thumbnail uploaded: ${matchingThumbnailFile.name}`)
                resolve()
              } else {
                console.warn(`⚠️ Thumbnail upload failed: ${xhr.statusText}`)
                resolve() // Don't fail the whole process if thumbnail fails
              }
            })

            xhr.addEventListener('error', () => {
              console.warn(`⚠️ Network error uploading thumbnail`)
              resolve() // Don't fail the whole process
            })

            xhr.addEventListener('timeout', () => {
              console.warn(`⚠️ Thumbnail upload timeout`)
              resolve() // Don't fail the whole process
            })

            xhr.open('POST', `${backendUrl}/upload`)
            // Set auth headers for thumbnail upload
            Object.entries(authHeaders).forEach(([key, value]) => {
              xhr.setRequestHeader(key, value)
            })
            xhr.send(formData)
          })
        }
      }
      
      // Reload files from backend
      await loadFiles()
      
      setSelectedFiles([])
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      alert(`${selectedFiles.length} fișier(e) încărcat(e) cu succes!`)
    } catch (error) {
      console.error('Upload error:', error)
      alert('A apărut o eroare la încărcarea fișierelor')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (file: UploadedFile) => {
    if (!confirm(`Sigur vrei să ștergi ${file.name}?`)) return

    try {
      // Extract the path after /data/ from the full URL
      // Example: http://localhost:5000/data/uploads/images/photo.jpg -> uploads/images/photo.jpg
      const urlParts = file.path.split('/data/')
      if (urlParts.length < 2) {
        throw new Error('Invalid file path')
      }
      
      const relativePath = urlParts[1]
      const endpoint = `/data/${relativePath}`

      const headers = await getAuthHeaders()
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'DELETE',
        headers,
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      // Reload files from backend
      await loadFiles()
      
      alert('Fișier șters cu succes!')
    } catch (error) {
      console.error('Delete error:', error)
      alert('A apărut o eroare la ștergerea fișierului')
    }
  }

  const copyToClipboard = (path: string) => {
    navigator.clipboard.writeText(path)
    setCopiedPath(path)
    setTimeout(() => setCopiedPath(null), 2000)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredFiles = files.filter(file => {
    if (filterType === 'all') return true
    return file.type === filterType
  })

  const imageCount = files.filter(f => f.type === 'image').length
  const videoCount = files.filter(f => f.type === 'video').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/galerie/admin"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Upload className="w-8 h-8 text-green-600" />
                  Administrare Media
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Încarcă și gestionează imagini și video-uri pentru galerie
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Upload className="w-6 h-6 text-green-600" />
            Încarcă Fișiere
          </h2>

          <div className="space-y-6">
            {/* File Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selectează Imagini sau Video-uri
              </label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  hover:file:bg-green-100
                  cursor-pointer"
              />
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Fișiere selectate ({selectedFiles.length})
                </h3>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {file.type.startsWith('video/') ? (
                          <FileVideo className="w-5 h-5 text-red-600" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-blue-600" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        file.type.startsWith('video/')
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold
                hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                transition-colors flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Se încarcă...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Încarcă Fișiere
                </>
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Informații importante:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Fișierele sunt stocate pe server</li>
                  <li>Imagini acceptate: JPEG, PNG, GIF, WebP</li>
                  <li>Video-uri acceptate: MP4, WebM, MOV, AVI</li>
                  <li>Dimensiune maximă: 100MB per fișier</li>
                  <li>Copiază path-ul pentru a-l folosi în Stories</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Files List */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-green-600" />
              Fișiere Încărcate ({filteredFiles.length})
            </h2>
            
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filterType === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toate ({files.length})
              </button>
              <button
                onClick={() => setFilterType('image')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filterType === 'image'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Imagini ({imageCount})
              </button>
              <button
                onClick={() => setFilterType('video')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filterType === 'video'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Video-uri ({videoCount})
              </button>
            </div>
          </div>

          {filteredFiles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Nu există fișiere încărcate</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFiles.map((file, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-green-400 transition-colors"
                >
                  {/* Preview */}
                  <div className="aspect-video bg-gray-200 relative">
                    {file.type === 'video' ? (
                      <video
                        src={file.path}
                        className="w-full h-full object-cover"
                        controls
                      />
                    ) : (
                      <img
                        src={file.path}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      file.type === 'video'
                        ? 'bg-red-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}>
                      {file.type === 'video' ? 'VIDEO' : 'IMAGE'}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 truncate">
                      {file.name}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1 mb-3">
                      <p>Dimensiune: {formatFileSize(file.size)}</p>
                      <p>Încărcat: {formatDate(file.uploadedAt)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(file.path)}
                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg font-semibold
                          hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        {copiedPath === file.path ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copiat!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copiază
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(file)}
                        className="bg-red-600 text-white py-2 px-3 rounded-lg font-semibold
                          hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageUploadAdminPage
