import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Search, Download, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Registration {
  name: string;
  nik: string;
  category: 'pelajar' | 'umum';
  bibNumber: string;
}

interface AdminDashboardProps {
  setIsAuthenticated: (value: boolean) => void;
}

export default function AdminDashboard({ setIsAuthenticated }: AdminDashboardProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('funRunRegistrations') || '[]');
    setRegistrations(data);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
  };

  const handleClearDatabase = () => {
    localStorage.setItem('funRunRegistrations', '[]');
    setRegistrations([]);
    setShowConfirmDialog(false);
  };

  const handleExportExcel = () => {
    const data = registrations.map(registration => ({
      'No. BIB': registration.bibNumber,
      'NIK': registration.nik,
      'Nama': registration.name,
      'Kategori': registration.category.charAt(0).toUpperCase() + registration.category.slice(1)
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');

    const colWidths = [
      { wch: 10 }, // No. BIB
      { wch: 20 }, // NIK
      { wch: 30 }, // Nama
      { wch: 15 }  // Kategori
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, 'fun_run_registrations.xlsx');
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.bibNumber.includes(searchTerm) ||
    reg.nik.includes(searchTerm) ||
    reg.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold mb-4">Konfirmasi Hapus Data</h3>
            <p className="text-gray-600 mb-6">
              Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={handleClearDatabase}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Ya, Hapus Semua
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Data Pendaftaran Fun Run</h2>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowConfirmDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              <Trash2 className="w-4 h-4" />
              Clear Database
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NIK, nomor BIB, atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-900/50 text-purple-100">
                <th className="px-6 py-3 text-left text-sm font-semibold">No. BIB</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">NIK</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Nama</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Kategori</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-200/20">
              {filteredRegistrations.map((registration) => (
                <tr 
                  key={registration.bibNumber}
                  className="text-white hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium">{registration.bibNumber}</td>
                  <td className="px-6 py-4 text-sm">{registration.nik}</td>
                  <td className="px-6 py-4 text-sm">{registration.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      registration.category === 'pelajar' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {registration.category.charAt(0).toUpperCase() + registration.category.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredRegistrations.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-white">
                    Tidak ada data pendaftaran yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
