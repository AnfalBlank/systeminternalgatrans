import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ChatMessage,
  ChatChannel,
  UserProfile,
  Consignment,
} from '../../types/cargo';
import {
  MessageSquare,
  Users,
  User,
  Send,
  Paperclip,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Zap,
  Tag,
  Radio,
  ShieldCheck,
  Truck,
  Scale,
  CreditCard,
  Lock,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Smile,
  Hash,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { Language } from '../../i18n/translations';
import { motion, AnimatePresence } from 'motion/react';

interface ChatViewProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  consignments: Consignment[];
  currentLang: Language;
  onNavigateToTab?: (tab: any) => void;
  onSelectConsignment?: (c: Consignment) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentUser,
  allUsers,
  consignments,
  currentLang,
  onNavigateToTab,
  onSelectConsignment,
}) => {
  // Chat State
  const [activeChatType, setActiveChatType] = useState<'CHANNEL' | 'DIRECT'>('CHANNEL');
  const [activeChannelId, setActiveChannelId] = useState<string>('GENERAL_OPS');
  const [activeRecipientId, setActiveRecipientId] = useState<string>(
    allUsers.find((u) => u.id !== currentUser.id)?.id || allUsers[0]?.id || ''
  );
  const [showMobileConversation, setShowMobileConversation] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [selectedAwbTag, setSelectedAwbTag] = useState<string>('');
  const [isUrgentAlert, setIsUrgentAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Initial Channels
  const [channels] = useState<ChatChannel[]>([
    {
      id: 'GENERAL_OPS',
      name: 'Koordinasi Operasional Umum',
      description: 'Saluran siaga seluruh stasiun kargo, estafet shift, dan pengumuman bandara.',
      iconType: 'GENERAL',
      unreadCount: 0,
    },
    {
      id: 'SECURITY_XRAY',
      name: 'Screening X-Ray & Triage Keamanan',
      description: 'Koordinasi Checker, Operator Tunnel, analisis Z-eff, dan konfirmasi AVSEC.',
      iconType: 'SECURITY',
      unreadCount: 1,
    },
    {
      id: 'LINE1_DISPATCH',
      name: 'Dispatch Lini 1 & Armada Truk',
      description: 'Pergerakan armada truk box airside, nomor segel keamanan, dan serah terima BTB maskapai.',
      iconType: 'DISPATCH',
      unreadCount: 0,
    },
    {
      id: 'FINANCE_BILLING',
      name: 'Billing & Keuangan Kargo',
      description: 'Pencatatan kasir cash, penerbitan invoice kredit periodic, dan approval diskon agen.',
      iconType: 'FINANCE',
      unreadCount: 0,
    },
  ]);

  // Initial Messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'MSG-001',
      senderId: 'USR-01',
      senderName: 'Sarah Miller',
      senderRole: 'CHECKER',
      senderAvatarColor: 'bg-emerald-600',
      senderInitials: 'SM',
      channelId: 'GENERAL_OPS',
      content: 'Selamat pagi tim operasional. Screening kargo AWB 126-89412045 (PT Astra) telah selesai di Tunnel 01. Status PASS tanpa anomali. Mohon bagian timbangan merapat.',
      timestamp: '08:15',
      awbReference: '126-89412045',
    },
    {
      id: 'MSG-002',
      senderId: 'USR-CSD',
      senderName: 'Agus Prasetyo, S.Tr.',
      senderRole: 'ADMIN_CSD',
      senderAvatarColor: 'bg-cyan-700',
      senderInitials: 'AP',
      channelId: 'GENERAL_OPS',
      content: 'Diterima Sarah. Penimbangan selesai: Gross 284.5 kg, Tare 14.5 kg. Dokumen CSD (CSD-ID-2026-88124) dan Surat Tugas STK sudah dicetak.',
      timestamp: '08:22',
      awbReference: '126-89412045',
    },
    {
      id: 'MSG-003',
      senderId: 'USR-03',
      senderName: 'Doni Kurniawan',
      senderRole: 'HANDLER',
      senderAvatarColor: 'bg-amber-600',
      senderInitials: 'DK',
      channelId: 'GENERAL_OPS',
      content: 'Koli 4/4 sudah dimuat ke Truk Box Lini 1 (B 9841 UXR). Segel BC-SEAL-88201 terpasang utuh & terkunci sempurna. Driver Bambang siap berangkat.',
      timestamp: '08:31',
      awbReference: '126-89412045',
    },
    {
      id: 'MSG-004',
      senderId: 'USR-04',
      senderName: 'Bambang Wijaya',
      senderRole: 'DRIVER',
      senderAvatarColor: 'bg-indigo-600',
      senderInitials: 'BW',
      channelId: 'GENERAL_OPS',
      content: 'Truk meluncur ke Gudang Lini 1 Garuda Indonesia. Estimasi tiba 10 menit.',
      timestamp: '08:35',
    },
    {
      id: 'MSG-005',
      senderId: 'USR-02',
      senderName: 'Budi Santoso',
      senderRole: 'ADMIN',
      senderAvatarColor: 'bg-blue-600',
      senderInitials: 'BS',
      channelId: 'GENERAL_OPS',
      content: 'Delivery Order DO-2026-GA-0419 sudah saya otorisasi. Petugas gudang maskapai atas nama Yusuf Maulana sudah dikonfirmasi via radio.',
      timestamp: '08:38',
      awbReference: '126-89412045',
    },
    {
      id: 'MSG-006',
      senderId: 'USR-01',
      senderName: 'Sarah Miller',
      senderRole: 'CHECKER',
      senderAvatarColor: 'bg-emerald-600',
      senderInitials: 'SM',
      channelId: 'SECURITY_XRAY',
      content: 'Perhatian: Ada anomali koli #4 pada AWB 157-77291044 (kandungan organik padat). Sedang dilakukan uji swab EVD partikel residu.',
      timestamp: '08:45',
      awbReference: '157-77291044',
      isPriorityAlert: true,
    },
    {
      id: 'MSG-007',
      senderId: 'USR-00',
      senderName: 'Alexander Wijaya, M.M.',
      senderRole: 'SUPERADMIN',
      senderAvatarColor: 'bg-purple-700',
      senderInitials: 'AW',
      channelId: 'SECURITY_XRAY',
      content: 'Tahan kargo tersebut hingga hasil EVD Clear dan verifikasi stempel AVSEC keluar. Pastikan jejak audit tercatat di sistem.',
      timestamp: '08:48',
    },
    {
      id: 'MSG-008',
      senderId: 'USR-04',
      senderName: 'Bambang Wijaya',
      senderRole: 'DRIVER',
      senderAvatarColor: 'bg-indigo-600',
      senderInitials: 'BW',
      recipientId: 'USR-02',
      content: 'Pak Budi, dokumen BTB dari maskapai Garuda untuk AWB 126-89412045 sudah ditandatangani. Saya upload bukti ke sistem sekarang.',
      timestamp: '08:52',
      awbReference: '126-89412045',
    },
    {
      id: 'MSG-009',
      senderId: 'USR-MGT',
      senderName: 'Dra. Rina Kartika (Executive Owner)',
      senderRole: 'MANAGERIAL',
      senderAvatarColor: 'bg-rose-700',
      senderInitials: 'RK',
      channelId: 'GENERAL_OPS',
      content: 'Terima kasih tim atas koordinasi cepatnya. Tingkat kepatuhan SLA hari ini sangat baik di 99.85%. Tetap utamakan keselamatan dan ketelitian segel.',
      timestamp: '09:00',
    },
  ]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChannelId, activeRecipientId, activeChatType]);

  // Current recipient profile for 1-on-1 chat
  const activeRecipient = allUsers.find((u) => u.id === activeRecipientId) || allUsers[0];
  const activeChannel = channels.find((ch) => ch.id === activeChannelId) || channels[0];

  // Filtered messages for current active view
  const currentMessages = useMemo(() => {
    if (activeChatType === 'CHANNEL') {
      return messages.filter((m) => m.channelId === activeChannelId);
    } else {
      // 1-on-1 direct messages between currentUser and activeRecipient
      return messages.filter(
        (m) =>
          (m.senderId === currentUser.id && m.recipientId === activeRecipientId) ||
          (m.senderId === activeRecipientId && m.recipientId === currentUser.id)
      );
    }
  }, [messages, activeChatType, activeChannelId, activeRecipientId, currentUser.id]);

  // Handle Send Message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `MSG-${Date.now().toString().slice(-5)}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatarColor: currentUser.avatarColor,
      senderInitials: currentUser.initials,
      content: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      awbReference: selectedAwbTag ? selectedAwbTag : undefined,
      isPriorityAlert: isUrgentAlert,
      channelId: activeChatType === 'CHANNEL' ? activeChannelId : undefined,
      recipientId: activeChatType === 'DIRECT' ? activeRecipientId : undefined,
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessageInput('');
    setSelectedAwbTag('');
    setIsUrgentAlert(false);

    // Simulated responsive reply for interactive experience
    if (activeChatType === 'DIRECT') {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: `MSG-${Date.now().toString().slice(-5)}`,
          senderId: activeRecipient.id,
          senderName: activeRecipient.name,
          senderRole: activeRecipient.role,
          senderAvatarColor: activeRecipient.avatarColor,
          senderInitials: activeRecipient.initials,
          content: `Siap, pesan diterima. Saya proses sekarang dari stasiun ${activeRecipient.station}. Terima kasih.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          recipientId: currentUser.id,
        };
        setMessages((prev) => [...prev, reply]);
      }, 1400);
    }
  };

  // Canned Quick Responses
  const quickResponses = [
    '✅ Koli telah diverifikasi dan siap muat',
    '⚠️ Perhatian: Ada koli ditahan di X-Ray Tunnel 01',
    '🚚 Truk Lini 1 telah berangkat ke Gudang Maskapai',
    '📄 Dokumen CSD & STK resmi telah terbit',
    '🔒 Segel keamanan terpasang utuh & terkunci',
    '📦 Bukti serah terima BTB telah ditandatangani',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/80 shadow-2xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Saluran Chat & Koordinasi Operasional
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Active</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Komunikasi instan antar-personel kargo: Checker, Handler, Driver, Admin CSD, AVSEC, hingga General Manager & Owner.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-medium">
            Login sebagai: <strong className="text-slate-900">{currentUser.name}</strong> ({currentUser.roleLabel})
          </span>
        </div>
      </div>

      {/* Main Chat Grid (Split-pane layout) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-210px)] min-h-[620px] max-h-[820px]">
        {/* Left Sidebar: Channels & Users (Col span 4) */}
        <div className={`md:col-span-4 border-r border-slate-200/80 flex flex-col h-full bg-slate-50/50 overflow-hidden ${
          showMobileConversation ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Tabs: Channels vs Direct Messages */}
          <div className="p-3 border-b border-slate-200/80 bg-white">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs">
              <button
                onClick={() => setActiveChatType('CHANNEL')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeChatType === 'CHANNEL' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Hash className="w-3.5 h-3.5" />
                <span>Saluran Tim</span>
              </button>
              <button
                onClick={() => setActiveChatType('DIRECT')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeChatType === 'DIRECT' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Pesan Pribadi</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="mt-2.5 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={activeChatType === 'CHANNEL' ? 'Cari saluran...' : 'Cari nama personel...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {activeChatType === 'CHANNEL' ? (
              // Channels List
              channels
                .filter((ch) => ch.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((channel) => {
                  const isActive = activeChannelId === channel.id;
                  return (
                    <button
                      key={channel.id}
                      onClick={() => {
                        setActiveChannelId(channel.id);
                        setShowMobileConversation(true);
                      }}
                      className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'hover:bg-slate-100/80 text-slate-700'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {channel.iconType === 'GENERAL' && <Users className="w-4 h-4" />}
                        {channel.iconType === 'SECURITY' && <ShieldCheck className="w-4 h-4" />}
                        {channel.iconType === 'DISPATCH' && <Truck className="w-4 h-4" />}
                        {channel.iconType === 'FINANCE' && <CreditCard className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                            #{channel.name}
                          </span>
                          {channel.unreadCount ? (
                            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                              {channel.unreadCount}
                            </span>
                          ) : null}
                        </div>
                        <p
                          className={`text-[11px] truncate mt-0.5 ${
                            isActive ? 'text-blue-100' : 'text-slate-500'
                          }`}
                        >
                          {channel.description}
                        </p>
                      </div>
                    </button>
                  );
                })
            ) : (
              // Direct Users List
              allUsers
                .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.roleLabel.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((user) => {
                  const isCurrent = user.id === currentUser.id;
                  const isSelected = activeRecipientId === user.id;

                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        setActiveRecipientId(user.id);
                        setShowMobileConversation(true);
                      }}
                      className={`w-full text-left p-2.5 rounded-2xl transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'hover:bg-slate-100/80 text-slate-700'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold ${user.avatarColor}`}
                        >
                          {user.initials}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {user.name} {isCurrent && '(Anda)'}
                          </span>
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                        <p
                          className={`text-[10px] truncate mt-0.5 ${
                            isSelected ? 'text-blue-100' : 'text-slate-500'
                          }`}
                        >
                          {user.roleLabel} · {user.station}
                        </p>
                      </div>
                    </button>
                  );
                })
            )}
          </div>
        </div>

        {/* Right Active Chat Window (Col span 8) */}
        <div className={`md:col-span-8 flex flex-col h-full bg-white overflow-hidden ${
          !showMobileConversation ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Chat Window Header */}
          <div className="p-4 px-6 border-b border-slate-200/80 bg-white flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Mobile Back Button */}
              <button
                onClick={() => setShowMobileConversation(false)}
                className="md:hidden p-1.5 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                aria-label="Kembali ke daftar saluran"
                title="Kembali"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              {activeChatType === 'CHANNEL' ? (
                <>
                  <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
                    <Hash className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{activeChannel.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600">
                        Public Station Channel
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5 truncate max-w-md">
                      {activeChannel.description}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white text-xs font-bold shrink-0 ${activeRecipient.avatarColor}`}
                  >
                    {activeRecipient.initials}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{activeRecipient.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700 font-bold border border-blue-200">
                        {activeRecipient.roleLabel}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Stasiun Tugas: {activeRecipient.station} · ID: {activeRecipient.badgeId}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Terhubung</span>
              </span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
            {currentMessages.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-600">Belum ada riwayat pesan di percakapan ini.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Kirimkan instruksi atau konfirmasi kargo pertama Anda di bawah.</p>
              </div>
            ) : (
              currentMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-bold shrink-0 ${msg.senderAvatarColor}`}
                    >
                      {msg.senderInitials}
                    </div>

                    {/* Bubble Content */}
                    <div className={`max-w-[78%] sm:max-w-[70%] space-y-1 ${isMe ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1 justify-inherit">
                        <span className="font-bold text-slate-700">{msg.senderName}</span>
                        <span className="font-mono text-[9px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded">
                          {msg.senderRole}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs text-left ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-tr-xs'
                            : msg.isPriorityAlert
                            ? 'bg-rose-50 border border-rose-300 text-rose-950 rounded-tl-xs'
                            : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-xs'
                        }`}
                      >
                        {msg.isPriorityAlert && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-600 mb-1 uppercase tracking-wider">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Peringatan Prioritas Keamanan Operasional</span>
                          </div>
                        )}

                        <p className="whitespace-pre-wrap">{msg.content}</p>

                        {/* AWB Tag Pill */}
                        {msg.awbReference && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100/20 flex items-center justify-between gap-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                                isMe ? 'bg-blue-700 text-blue-100' : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              <Tag className="w-3 h-3" />
                              <span>AWB {msg.awbReference}</span>
                            </span>

                            {onNavigateToTab && (
                              <button
                                onClick={() => {
                                  const c = consignments.find((x) => x.awbNumber === msg.awbReference);
                                  if (c && onSelectConsignment) onSelectConsignment(c);
                                  onNavigateToTab('consignments');
                                }}
                                className={`text-[10px] font-bold underline flex items-center gap-0.5 cursor-pointer ${
                                  isMe ? 'text-blue-100 hover:text-white' : 'text-blue-600 hover:text-blue-800'
                                }`}
                              >
                                <span>Periksa Kargo ↗</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Operational Canned Response Pills */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 font-mono">
              Respon Cepat:
            </span>
            {quickResponses.map((qr) => (
              <button
                key={qr}
                onClick={() => setMessageInput(qr)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {qr}
              </button>
            ))}
          </div>

          {/* Input & Form Bar */}
          <form onSubmit={handleSendMessage} className="p-3.5 sm:p-4 border-t border-slate-200 bg-white space-y-2">
            {/* Tag AWB & Urgent Checkbox Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Kaitkan AWB:</span>
                <select
                  value={selectedAwbTag}
                  onChange={(e) => setSelectedAwbTag(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-mono text-slate-700"
                >
                  <option value="">-- Tanpa Tag AWB --</option>
                  {consignments.map((c) => (
                    <option key={c.id} value={c.awbNumber}>
                      AWB {c.awbNumber} ({c.destination})
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-1.5 text-xs text-rose-700 font-bold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isUrgentAlert}
                  onChange={(e) => setIsUrgentAlert(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="text-[11px]">Tandai Urgent (Alert)</span>
              </label>
            </div>

            {/* Main Text Input & Submit */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  activeChatType === 'CHANNEL'
                    ? `Kirim pesan ke #${activeChannel.name}...`
                    : `Kirim pesan ke ${activeRecipient.name}...`
                }
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Kirim</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};
