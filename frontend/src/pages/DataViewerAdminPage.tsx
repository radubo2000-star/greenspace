import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Users, 
  UserPlus, 
  Handshake, 
  Heart,
  Download,
  RefreshCw,
  Calendar,
  Phone,
  MapPin,
  Building,
  DollarSign,
  Clock,
  ArrowLeft,
  Database
} from 'lucide-react';
import { getBackendUrl } from '@/lib/backend-config';
import { getAuthHeaders } from '@/lib/auth-headers';
import { toast } from '@/components/ui/toast';

interface Contact {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  position?: string;
  contactType?: string;
  source?: string;
  subject?: string;
  message?: string;
  dateAdded?: string;
  lastContact?: string;
  status?: string;
  interests?: string[];
  notes?: string;
  timestamp?: string;
}

interface Volunteer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  skills?: string[];
  interests?: string[];
  availability?: string;
  hoursVolunteered?: number;
  status?: string;
  joinDate?: string;
  message?: string;
  notes?: string;
  timestamp?: string;
}

interface Member {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  membershipType: string;
  membershipFee?: number;
  amount?: number;
  joinDate?: string;
  renewalDate?: string;
  status?: string;
  benefits?: string[];
  notes?: string;
  timestamp?: string;
}

interface Partnership {
  id?: string;
  organizationType?: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  partnershipType?: string;
  contributionAmount?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  benefits?: string[];
  proposal?: string;
  notes?: string;
  timestamp?: string;
}

interface Donation {
  id?: string;
  amount: number;
  paymentMethod: string;
  isRecurring: boolean;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status: string;
  timestamp: string;
}

type TabType = 'contacts' | 'volunteers' | 'members' | 'partnerships' | 'donations';

const DataViewerAdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('contacts');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);

  const backendUrl = getBackendUrl();

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const authHeaders = await getAuthHeaders();
      const response = await fetch(`${backendUrl}/admin/data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        signal,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      
      setContacts(data.contacts || []);
      setVolunteers(data.volunteers || []);
      setMembers(data.members || []);
      setPartnerships(data.partnerships || []);
      setDonations(data.donations || []);
      
      toast.success('Date actualizate!', 'Datele au fost încărcate cu succes.');
      setLoading(false);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        // Request was cancelled by StrictMode cleanup — keep loading state
        return;
      }
      console.error('Error fetching data:', error);
      toast.error('Eroare!', 'Nu s-au putut încărca datele. Verifică dacă backend-ul rulează.');
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => {
      controller.abort();
    };
  }, [fetchData]);

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error('Eroare!', 'Nu există date de exportat.');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (Array.isArray(value)) return `"${value.join(', ')}"`;
          if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Export reușit!', `Fișierul ${filename}.csv a fost descărcat.`);
  };

  const tabs = [
    { id: 'contacts' as TabType, label: 'Contacte', icon: Mail, count: contacts.length, color: 'blue' },
    { id: 'volunteers' as TabType, label: 'Voluntari', icon: Users, count: volunteers.length, color: 'green' },
    { id: 'members' as TabType, label: 'Membri', icon: UserPlus, count: members.length, color: 'purple' },
    { id: 'partnerships' as TabType, label: 'Parteneriate', icon: Handshake, count: partnerships.length, color: 'orange' },
    { id: 'donations' as TabType, label: 'Donații', icon: Heart, count: donations.length, color: 'red' },
  ];

  const renderContacts= () => {
    // Debug logging removed during refactoring
    // Sortare descrescătoare după dată
    const sortedContacts = [...contacts].sort((a, b) => {
      const dateA = new Date(a.timestamp || a.dateAdded || 0).getTime();
      const dateB = new Date(b.timestamp || b.dateAdded || 0).getTime();
      return dateB - dateA;
    });
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedContacts.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500">
          <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Nu există contacte înregistrate.</p>
        </div>
      ) : (
        sortedContacts.map((contact, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-800 truncate">{contact.name}</h3>
                <p className="text-sm text-blue-600 truncate">{contact.email}</p>
                {contact.phone && (
                  <p className="text-xs text-gray-600 flex items-center mt-1">
                    <Phone className="w-3 h-3 mr-1" />
                    {contact.phone}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1 ml-2">
                <div className="flex items-center text-gray-500 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(contact.timestamp || contact.dateAdded || new Date()).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </div>
                {contact.contactType && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                    {contact.contactType}
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              {contact.organization && (
                <div className="flex items-start gap-1">
                  <Building className="w-3 h-3 mt-0.5 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-600 text-xs truncate">{contact.organization}</span>
                </div>
              )}
              {contact.position && (
                <div className="text-xs text-gray-600 truncate">{contact.position}</div>
              )}
              {contact.subject && (
                <div className="text-xs text-gray-700 font-medium truncate">{contact.subject}</div>
              )}
            </div>
            
            {contact.status && (
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs ${
                contact.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {contact.status}
              </span>
            )}
            
            {(contact.interests && contact.interests.length > 0) && (
              <div className="mt-2 flex flex-wrap gap-1">
                {contact.interests.slice(0, 3).map((interest, i) => (
                  <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                    {interest}
                  </span>
                ))}
                {contact.interests.length > 3 && (
                  <span className="text-xs text-gray-500">+{contact.interests.length - 3}</span>
                )}
              </div>
            )}
            
            {(contact.message || contact.notes) && (
              <div className="bg-gray-50 rounded p-2 mt-2">
                <p className="text-xs text-gray-700 line-clamp-2">{contact.message || contact.notes}</p>
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
    );
  };

  const renderVolunteers = () => {
    // Sortare descrescătoare după dată
    const sortedVolunteers = [...volunteers].sort((a, b) => {
      const dateA = new Date(a.timestamp || a.joinDate || 0).getTime();
      const dateB = new Date(b.timestamp || b.joinDate || 0).getTime();
      return dateB - dateA;
    });
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedVolunteers.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Nu există aplicații de voluntariat.</p>
        </div>
      ) : (
        sortedVolunteers.map((volunteer, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-800 truncate">{volunteer.name}</h3>
                <p className="text-sm text-green-600 truncate">{volunteer.email}</p>
                <p className="text-xs text-gray-600 flex items-center mt-1">
                  <Phone className="w-3 h-3 mr-1" />
                  {volunteer.phone}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 ml-2">
                <div className="flex items-center text-gray-500 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(volunteer.timestamp || volunteer.joinDate || new Date()).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </div>
                {volunteer.hoursVolunteered && (
                  <div className="text-green-600 font-semibold text-xs">
                    {volunteer.hoursVolunteered}h
                  </div>
                )}
              </div>
            </div>
            
            {volunteer.status && (
              <span className={`inline-block mb-2 px-2 py-0.5 rounded-full text-xs ${
                volunteer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {volunteer.status}
              </span>
            )}
            
            {(volunteer.skills && volunteer.skills.length > 0) && (
              <div className="mb-2">
                <div className="flex flex-wrap gap-1">
                  {volunteer.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                  {volunteer.skills.length > 3 && (
                    <span className="text-xs text-gray-500">+{volunteer.skills.length - 3}</span>
                  )}
                </div>
              </div>
            )}
            
            {(volunteer.interests && volunteer.interests.length > 0) && (
              <div className="mb-2">
                <div className="flex flex-wrap gap-1">
                  {volunteer.interests.slice(0, 2).map((interest, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                      {interest}
                    </span>
                  ))}
                  {volunteer.interests.length > 2 && (
                    <span className="text-xs text-gray-500">+{volunteer.interests.length - 2}</span>
                  )}
                </div>
              </div>
            )}
            
            {volunteer.availability && (
              <div className="text-xs text-gray-600 mb-2 truncate">
                📅 {volunteer.availability}
              </div>
            )}
            
            {(volunteer.message || volunteer.notes) && (
              <div className="bg-gray-50 rounded p-2 mt-2">
                <p className="text-xs text-gray-700 line-clamp-2">{volunteer.message || volunteer.notes}</p>
              </div>
            )}
          </motion.div>
        ))
      )}
      </div>
    );
  };

  const renderMembers = () => {
    // Sortare descrescătoare după dată
    const sortedMembers = [...members].sort((a, b) => {
      const dateA = new Date(a.timestamp || a.joinDate || 0).getTime();
      const dateB = new Date(b.timestamp || b.joinDate || 0).getTime();
      return dateB - dateA;
    });
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedMembers.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500">
          <UserPlus className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Nu există cereri de membru.</p>
        </div>
      ) : (
        sortedMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-800 truncate">{member.name}</h3>
                <p className="text-sm text-purple-600 truncate">{member.email}</p>
                <p className="text-xs text-gray-600 flex items-center mt-1">
                  <Phone className="w-3 h-3 mr-1" />
                  {member.phone}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 ml-2">
                <div className="flex items-center text-gray-500 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(member.timestamp || member.joinDate || new Date()).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </div>
                <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {member.membershipType}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 mb-2">
              {member.address && (
                <div className="flex items-start gap-1">
                  <MapPin className="w-3 h-3 mt-0.5 text-gray-500 flex-shrink-0" />
                  <span className="text-xs text-gray-600 line-clamp-1">{member.address}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600">{member.membershipFee || member.amount} RON</span>
              </div>
              {member.renewalDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600">
                    {new Date(member.renewalDate).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </span>
                </div>
              )}
            </div>
            
            {member.status && (
              <span className={`inline-block mb-2 px-2 py-0.5 rounded-full text-xs ${
                member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {member.status}
              </span>
            )}
            
            {(member.benefits && member.benefits.length > 0) && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {member.benefits.slice(0, 2).map((benefit, i) => (
                    <span key={i} className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                      {benefit}
                    </span>
                  ))}
                  {member.benefits.length > 2 && (
                    <span className="text-xs text-gray-500">+{member.benefits.length - 2}</span>
                  )}
                </div>
              </div>
            )}
            
            {member.notes && (
              <div className="bg-gray-50 rounded p-2 mt-2">
                <p className="text-xs text-gray-700 line-clamp-2">{member.notes}</p>
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
  };

  const renderPartnerships = () => {
    // Sortare descrescătoare după dată
    const sortedPartnerships = [...partnerships].sort((a, b) => {
      const dateA = new Date(a.timestamp || a.startDate || 0).getTime();
      const dateB = new Date(b.timestamp || b.startDate || 0).getTime();
      return dateB - dateA;
    });
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedPartnerships.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500">
          <Handshake className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Nu există propuneri de parteneriat.</p>
        </div>
      ) : (
        sortedPartnerships.map((partnership, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-2">
                  <Building className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <h3 className="text-lg font-bold text-gray-800 truncate">{partnership.organizationName}</h3>
                </div>
                <p className="text-sm text-gray-600 truncate">{partnership.contactPerson}</p>
                <p className="text-xs text-orange-600 truncate">{partnership.email}</p>
              </div>
              <div className="flex flex-col items-end gap-1 ml-2">
                <div className="flex items-center text-gray-500 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(partnership.timestamp || partnership.startDate || new Date()).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </div>
                {partnership.contributionAmount && (
                  <div className="text-orange-600 font-semibold text-xs">
                    ${partnership.contributionAmount.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-1 flex-wrap mb-2">
              {partnership.partnershipType && (
                <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs">
                  {partnership.partnershipType}
                </span>
              )}
              {partnership.organizationType && (
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                  {partnership.organizationType}
                </span>
              )}
              {partnership.status && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  partnership.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {partnership.status}
                </span>
              )}
            </div>
            
            <div className="text-xs text-gray-600 mb-2">
              <p className="flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                {partnership.phone}
              </p>
            </div>
            
            {partnership.endDate && partnership.startDate && (
              <div className="text-xs text-gray-600 mb-2">
                📅 {new Date(partnership.startDate).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit' })} - {new Date(partnership.endDate).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit' })}
              </div>
            )}
            
            {(partnership.benefits && partnership.benefits.length > 0) && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {partnership.benefits.slice(0, 2).map((benefit, i) => (
                    <span key={i} className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full text-xs">
                      {benefit}
                    </span>
                  ))}
                  {partnership.benefits.length > 2 && (
                    <span className="text-xs text-gray-500">+{partnership.benefits.length - 2}</span>
                  )}
                </div>
              </div>
            )}
            
            {(partnership.proposal || partnership.notes) && (
              <div className="bg-gray-50 rounded p-2 mt-2">
                <p className="text-xs text-gray-700 line-clamp-2">{partnership.proposal || partnership.notes}</p>
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
  };

  const renderDonations = () => {
    // Sortare descrescătoare după dată
    const sortedDonations = [...donations].sort((a, b) => {
      const dateA = new Date(a.timestamp || 0).getTime();
      const dateB = new Date(b.timestamp || 0).getTime();
      return dateB - dateA;
    });
    
    const totalAmount = sortedDonations.reduce((sum, d) => sum + d.amount, 0);
    const recurringCount = sortedDonations.filter(d => d.isRecurring).length;

    return (
      <div className="space-y-4">
        {sortedDonations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Total Donații</p>
                  <p className="text-3xl font-bold mt-1">{totalAmount} RON</p>
                </div>
                <Heart className="w-12 h-12 opacity-50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Număr Donații</p>
                  <p className="text-3xl font-bold mt-1">{sortedDonations.length}</p>
                </div>
                <Users className="w-12 h-12 opacity-50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Donații Recurente</p>
                  <p className="text-3xl font-bold mt-1">{recurringCount}</p>
                </div>
                <RefreshCw className="w-12 h-12 opacity-50" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedDonations.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Nu există donații înregistrate.</p>
          </div>
        ) : (
          sortedDonations.map((donation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-800 truncate">{donation.name}</h3>
                  <p className="text-sm text-red-600 truncate">{donation.email}</p>
                  {donation.phone && (
                    <p className="text-xs text-gray-600 flex items-center mt-1">
                      <Phone className="w-3 h-3 mr-1" />
                      {donation.phone}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 ml-2">
                  <div className="flex items-center text-gray-500 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(donation.timestamp).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </div>
                  <div className="text-xl font-bold text-red-600">
                    {donation.amount} RON
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  donation.paymentMethod === 'card' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {donation.paymentMethod === 'card' ? '💳 Card' : '🏦 Transfer'}
                </span>
                {donation.isRecurring && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                    🔄 Recurentă
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  donation.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {donation.status === 'pending' ? '⏳ Procesare' : '⏰ Așteaptă'}
                </span>
              </div>
              {donation.message && (
                <div className="bg-gray-50 rounded p-2 mt-2">
                  <p className="text-xs text-gray-700 line-clamp-2">{donation.message}</p>
                </div>
              )}
            </motion.div>
          ))
        )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'contacts':
        return renderContacts();
      case 'volunteers':
        return renderVolunteers();
      case 'members':
        return renderMembers();
      case 'partnerships':
        return renderPartnerships();
      case 'donations':
        return renderDonations();
      default:
        return null;
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'contacts':
        return contacts;
      case 'volunteers':
        return volunteers;
      case 'members':
        return members;
      case 'partnerships':
        return partnerships;
      case 'donations':
        return donations;
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Database className="w-8 h-8 text-purple-600" />
                  Vizualizare Date
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Administrează toate datele colectate din formulare
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                  isActive
                    ? `bg-${tab.color}-600 text-white shadow-lg scale-105`
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => fetchData()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Se încarcă...' : 'Reîmprospătează'}
          </button>
          <button
            onClick={() => exportToCSV(getCurrentData(), activeTab)}
            disabled={getCurrentData().length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Exportă CSV
          </button>
        </div>

        {/* Content */}
        <div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DataViewerAdminPage;
