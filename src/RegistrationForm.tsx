import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Registration {
  name: string;
  nik: string;
  category: 'pelajar' | 'umum';
  bibNumber: string;
}

const formControls = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.5 }
  })
};

const capitalizeEachWord = (str: string): string => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function RegistrationForm() {
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [category, setCategory] = useState<'pelajar' | 'umum'>('pelajar');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [assignedBibNumber, setAssignedBibNumber] = useState<string>('');

  const generateBibNumber = (category: 'pelajar' | 'umum'): string => {
    const existingRegistrations: Registration[] = JSON.parse(localStorage.getItem('funRunRegistrations') || '[]');
    const usedNumbers = new Set(existingRegistrations.map(reg => parseInt(reg.bibNumber)));
    
    let start: number, end: number;
    if (category === 'pelajar') {
      start = 1;
      end = 5000;
    } else {
      start = 5001;
      end = 10000;
    }

    for (let i = start; i <= end; i++) {
      if (!usedNumbers.has(i)) {
        return i.toString().padStart(4, '0');
      }
    }

    throw new Error('No more BIB numbers available for this category');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const capitalizedValue = capitalizeEachWord(e.target.value);
    setName(capitalizedValue);
  };

  const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
    setNik(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const bibNumber = generateBibNumber(category);
      
      const registration: Registration = {
        name,
        nik,
        category,
        bibNumber
      };

      const existingRegistrations = JSON.parse(localStorage.getItem('funRunRegistrations') || '[]');
      
      localStorage.setItem('funRunRegistrations', JSON.stringify([...existingRegistrations, registration]));
      
      setAssignedBibNumber(bibNumber);
      setIsSubmitted(true);
      setName('');
      setNik('');
      setCategory('pelajar');

      setTimeout(() => {
        setIsSubmitted(false);
        setAssignedBibNumber('');
      }, 5000);
    } catch (error) {
      alert('Maaf, nomor BIB untuk kategori ini sudah habis.');
    }
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <AnimatePresence>
        {isSubmitted && (
          <motion.div 
            className="bg-purple-100 p-4 rounded-lg flex items-center gap-2 text-purple-700 mb-4 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Check className="w-5 h-5" />
            <span>
              Pendaftaran berhasil! Nomor BIB Anda: <strong>{assignedBibNumber}</strong>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          variants={formControls}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <label htmlFor="nik" className="block text-sm font-medium text-purple-100 mb-2">
            NIK
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            type="text"
            id="nik"
            required
            value={nik}
            onChange={handleNikChange}
            maxLength={16}
            className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white/80 backdrop-blur-sm"
            placeholder="Masukkan NIK (16 digit)"
          />
        </motion.div>

        <motion.div
          variants={formControls}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <label htmlFor="name" className="block text-sm font-medium text-purple-100 mb-2">
            Nama Lengkap
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            type="text"
            id="name"
            required
            value={name}
            onChange={handleNameChange}
            className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white/80 backdrop-blur-sm"
            placeholder="Masukkan nama lengkap"
          />
        </motion.div>

        <motion.div 
          className="relative"
          variants={formControls}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <label htmlFor="category" className="block text-sm font-medium text-purple-100 mb-2">
            Kategori
          </label>
          <div className="relative">
            <motion.select
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as 'pelajar' | 'umum')}
              className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition appearance-none bg-white/80 backdrop-blur-sm pr-10"
            >
              <option value="pelajar">Pelajar</option>
              <option value="umum">Umum</option>
            </motion.select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>
        </motion.div>

        <motion.button
          variants={formControls}
          initial="hidden"
          animate="visible"
          custom={3}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition duration-200 font-medium shadow-lg hover:shadow-purple-500/25"
        >
          Dapatkan Nomor BIB
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
