import { useState, useEffect, useCallback } from 'react';
import { 
  FolderOpen, 
  File, 
  Download, 
  Trash2, 
  RefreshCw,
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  FileJson,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFiles, downloadFile, deleteFile } from '@/services/file-service';
import { toast } from '@/components/ui/toast';

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: string;
}

const FileManagerPage = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState('uploads');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const BASE_PATH = 'uploads';

  const loadFiles = useCallback(async (path: string, signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFiles(path, signal);
      setFiles(data.files || []);
      setLoading(false);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Request was cancelled by StrictMode cleanup — keep loading state
        return;
      }
      const message = err instanceof Error ? err.message : 'Eroare la încărcarea fișierelor';
      setError(message);
      toast.error('Eroare', message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadFiles(currentPath, controller.signal);
    return () => {
      controller.abort();
    };
  }, [currentPath, loadFiles]);

  const handleDownload = async (file: FileItem) => {
    try {
      await downloadFile(file.path);
      toast.success('Descărcare', `Fișierul ${file.name} a fost descărcat`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nu s-a putut descărca fișierul';
      toast.error('Eroare', message);
    }
  };

  const handleDelete = async (file: FileItem) => {
    if (!confirm(`Sigur vrei să ștergi ${file.name}?`)) return;

    try {
      await deleteFile(file.path);
      toast.success('Șters', `Fișierul ${file.name} a fost șters`);
      loadFiles(currentPath);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nu s-a putut șterge fișierul';
      toast.error('Eroare', message);
    }
  };

  const handleFolderClick = (folder: FileItem) => {
    // Ensure we stay within data/uploads
    if (folder.path.startsWith(BASE_PATH)) {
      setCurrentPath(folder.path);
    }
  };

  const handleBack = () => {
    // Don't allow going above data/uploads
    if (currentPath === BASE_PATH) return;
    
    const parts = currentPath.split('\\').filter(Boolean);
    parts.pop();
    const newPath = parts.join('\\');
    // Ensure we don't go above BASE_PATH
    if (newPath.startsWith(BASE_PATH.split('/')[0])) {
      setCurrentPath(newPath || BASE_PATH);
    }
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'directory') {
      return <FolderOpen className="w-5 h-5 text-yellow-500" />;
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    }
    
    if (ext === 'json') {
      return <FileJson className="w-5 h-5 text-green-500" />;
    }
    
    if (['txt', 'md', 'log'].includes(ext || '')) {
      return <FileText className="w-5 h-5 text-gray-500" />;
    }

    return <File className="w-5 h-5 text-gray-400" />;
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('ro-RO');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FolderOpen className="w-8 h-8 text-orange-600" />
                  Manager Fișiere Uploadate
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Gestionează imaginile și video-urile uploadate (uploads)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <FolderOpen className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                {currentPath}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBack}
                disabled={currentPath === BASE_PATH}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Înapoi
              </button>
              <button
                onClick={() => loadFiles(currentPath)}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Reîmprospătează
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="text-sm font-medium text-red-900">Eroare</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Files Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">Niciun fișier găsit</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dimensiune
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modificat
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {files.map((file, index) => (
                    <tr 
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file)}
                          {file.type === 'directory' ? (
                            <button
                              onClick={() => handleFolderClick(file)}
                              className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              {file.name}
                            </button>
                          ) : (
                            <span className="text-sm text-gray-900">
                              {file.name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {file.type === 'directory' ? '-' : formatSize(file.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(file.modified)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {file.type === 'file' && (
                            <>
                              <button
                                onClick={() => handleDownload(file)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Descarcă"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(file)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Șterge"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">Informații</h3>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Click pe folder pentru a naviga</li>
                <li>• Poți descărca și șterge fișiere individuale</li>
                <li>• Folderele disponibile: contacts, volunteers, members, partnerships, donations, uploads</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManagerPage;
