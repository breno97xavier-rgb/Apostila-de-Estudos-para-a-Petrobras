/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Lock, 
  Unlock, 
  ChevronRight, 
  Download, 
  Eye, 
  MessageCircle, 
  LogOut,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type Page = 'login' | 'study-area' | 'subject-detail';

interface Subject {
  id: string;
  title: string;
  bgImage: string;
  teoriaUrl: string;
  mapasUrl: string;
}

interface ComplementaryMaterial {
  id: string;
  title: string;
  bgImage: string;
  code: string;
  checkoutUrl: string;
  pdfUrl: string;
}

// --- Constants ---

const SUBJECTS: Subject[] = [
  {
    id: 'portugues',
    title: 'PORTUGUÊS',
    bgImage: 'https://i.ibb.co/qFjPbFP2/Design-sem-nome-8.png',
    teoriaUrl: 'https://drive.google.com/file/d/1dhTw-fo7iUtxpLPptXLOmvIQbxU29Nhi/view?usp=drive_link',
    mapasUrl: 'https://drive.google.com/file/d/1pGtNs4cCePMExcM29-oiLN0akS1ghHLM/view?usp=drive_link'
  },
  {
    id: 'matematica',
    title: 'MATEMÁTICA',
    bgImage: 'https://i.ibb.co/Lh80qVny/Design-sem-nome-10.png',
    teoriaUrl: 'https://drive.google.com/file/d/139xanfZXSfnyGdQud2y37FEo4yLPlWhA/view?usp=drive_link',
    mapasUrl: 'https://drive.google.com/file/d/1gIPehLbceaSoMYbfI4JpuCjoym77GkgM/view?usp=drive_link'
  },
  {
    id: 'quimica-fisica',
    title: 'FUNDAMENTOS DE QUÍMICA E FÍSICA',
    bgImage: 'https://i.ibb.co/wryfhd17/Design-sem-nome-11.png',
    teoriaUrl: 'https://drive.google.com/file/d/108QAzVKTtRlU6T82yyQy8HEKof-8OP-w/view?usp=drive_link',
    mapasUrl: 'https://drive.google.com/file/d/1BMlzUUHoVhaH3LeXgvmPo-ymHCxwhGoH/view?usp=drive_link'
  },
  {
    id: 'tecnico-operacao',
    title: 'TÉCNICO EM OPERAÇÃO E SEGURANÇA',
    bgImage: 'https://i.ibb.co/Z1TQdjkN/Design-sem-nome-12.png',
    teoriaUrl: 'https://drive.google.com/file/d/1ektPdz73FV7nMamMombpB4KaH6NmfUcj/view?usp=drive_link',
    mapasUrl: 'https://drive.google.com/file/d/1vcTsC1_A9qwDuF1XOoxId4LOb-aqCVGg/view?usp=drive_link'
  }
];

const COMPLEMENTARY: ComplementaryMaterial[] = [
  {
    id: 'redacao',
    title: 'Redação Discursiva para Concursos',
    bgImage: 'https://i.ibb.co/sdQLnnS3/Design-sem-nome-16.png',
    code: 'REDCON',
    checkoutUrl: 'https://pay.wiapy.com/lRFSmwYQYg',
    pdfUrl: 'https://drive.google.com/file/d/1NXhBdWnb7jkfDOxta4XUkIwaagxKxTtl/view?usp=drive_link'
  },
  {
    id: 'disciplina-ferro',
    title: 'Disciplina de Ferro - Controle Emocional',
    bgImage: 'https://i.ibb.co/Z1TQdjkN/Design-sem-nome-12.png',
    code: 'DIFECOE',
    checkoutUrl: 'https://pay.wiapy.com/Hn-9DRvIDW',
    pdfUrl: 'https://drive.google.com/file/d/1BIQVlJMNV58C-9EbxdA9prE0PpygEZlo/view?usp=drive_link'
  },
  {
    id: 'estudar-pdfs',
    title: 'Como Estudar com PDFs',
    bgImage: 'https://i.ibb.co/PsqSMM2m/Design-sem-nome-15.png',
    code: 'COESPS',
    checkoutUrl: 'https://pay.wiapy.com/7cALG9VMpK',
    pdfUrl: 'https://drive.google.com/file/d/1gJ0d-5JIdXitUp0IDZo_IbOLBL8V9_Lw/view?usp=drive_link'
  }
];

// --- Helper Functions ---

const convertDriveLink = (url: string) => {
  if (!url) return '';
  // Convert /view or /edit to /preview
  return url.replace(/\/view(\?.*)?$/, '/preview').replace(/\/edit(\?.*)?$/, '/preview');
};

const downloadDriveLink = (url: string) => {
  if (!url) return '';
  // Convert to direct download link
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
};

// --- Components ---

const Header = ({ onLogout, bgImage }: { onLogout?: () => void; bgImage?: string }) => (
  <header className="fixed top-0 left-0 w-full z-50 overflow-hidden">
    {bgImage && (
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt="Header BG" 
          className="w-full h-full object-cover opacity-20"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-[#002a1d]/80 backdrop-blur-sm" />
      </div>
    )}
    {!bgImage && <div className="absolute inset-0 bg-[#002a1d]/90 backdrop-blur-md border-b border-white/10 shadow-lg z-0" />}
    
    <div className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <a 
        href="https://editoraeditalconcursos.vercel.app/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-4 group"
      >
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400 shadow-inner bg-white flex items-center justify-center">
          <img 
            src="https://i.ibb.co/mFbSYv6j/1000112350.webp" 
            alt="Logo" 
            className="w-full h-full object-cover scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="text-white font-black text-xl tracking-tighter group-hover:text-yellow-400 transition-colors uppercase">
          Edital Concursos
        </span>
      </a>
      {onLogout && (
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
        >
          <LogOut size={16} />
          Sair
        </button>
      )}
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-[#001a12] text-white py-12 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center">
            <img 
              src="https://i.ibb.co/mFbSYv6j/1000112350.webp" 
              alt="Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-bold text-lg">Edital Concursos</span>
        </div>
        <p className="text-white/60 text-sm">
          © 2026 – Todos os direitos reservados. Sua melhor preparação para concursos públicos.
        </p>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-bold text-yellow-400 uppercase tracking-wider text-sm">Suporte</h4>
        <div className="space-y-2 text-sm text-white/80">
          <p className="flex items-center gap-2">
            <span className="font-semibold">E-mail:</span> editoraeditalconcursos@gmail.com
          </p>
          <div className="pt-2">
            <a 
              href="https://wa.me/5541988420201" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg font-medium"
            >
              <MessageCircle size={18} />
              WhatsApp: (41) 98842-0201
            </a>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-yellow-400 uppercase tracking-wider text-sm">Links Úteis</h4>
        <ul className="space-y-2 text-sm text-white/80">
          <li>
            <a href="https://editoraeditalconcursos.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">
              Página Oficial
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-yellow-400 transition-colors">Termos de Uso</a>
          </li>
          <li>
            <a href="#" className="hover:text-yellow-400 transition-colors">Privacidade</a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
);

const PDFViewer = ({ url, title }: { url: string; title: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const previewUrl = convertDriveLink(url);
  const downloadUrl = downloadDriveLink(url);

  return (
    <div className="bg-[#003827] rounded-xl overflow-hidden border border-white/10 shadow-xl mt-4">
      <div className="p-4 bg-white/5 flex items-center justify-between border-b border-white/10">
        <span className="text-white font-medium text-sm flex items-center gap-2">
          <BookOpen size={16} className="text-yellow-400" />
          {title}
        </span>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsVisible(!isVisible)}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#002a1d] px-3 py-1.5 rounded-md text-xs font-bold transition-all"
          >
            <Eye size={14} />
            {isVisible ? 'Ocultar' : 'Visualizar'}
          </button>
          <a 
            href={downloadUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all border border-white/10"
          >
            <Download size={14} />
            Baixar PDF
          </a>
        </div>
      </div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 500, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full"
          >
            <iframe 
              src={previewUrl} 
              className="w-full h-full border-none"
              title={title}
              allow="autoplay"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [userName, setUserName] = useState('');
  const [inputName, setInputName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<ComplementaryMaterial | null>(null);
  const [unlockedMaterials, setUnlockedMaterials] = useState<string[]>([]);
  const [accessCode, setAccessCode] = useState('');
  const [errorCode, setErrorCode] = useState<string | null>(null);

  // Initialize
  useEffect(() => {
    const savedName = localStorage.getItem('aluno_nome');
    const savedUnlocked = localStorage.getItem('unlocked_materials');
    
    if (savedUnlocked) {
      setUnlockedMaterials(JSON.parse(savedUnlocked));
    }

    // Check for URL parameters (for "new tab" support)
    const params = new URLSearchParams(window.location.search);
    const subjectId = params.get('subject');
    const materialId = params.get('material');

    if (subjectId) {
      const subject = SUBJECTS.find(s => s.id === subjectId);
      if (subject) {
        setSelectedSubject(subject);
        setCurrentPage('subject-detail');
      }
    } else if (materialId) {
      const material = COMPLEMENTARY.find(m => m.id === materialId);
      if (material) {
        setSelectedMaterial(material);
        setCurrentPage('subject-detail');
      }
    } else if (savedName) {
      setUserName(savedName);
      setCurrentPage('study-area');
    } else {
      // If no name and trying to access detail, redirect to login
      if (subjectId || materialId) {
        setCurrentPage('login');
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) {
      alert('Digite seu nome.');
      return;
    }
    localStorage.setItem('aluno_nome', inputName.trim());
    setUserName(inputName.trim());
    setCurrentPage('study-area');
  };

  const handleLogout = () => {
    localStorage.removeItem('aluno_nome');
    setUserName('');
    setCurrentPage('login');
  };

  const handleUnlock = (material: ComplementaryMaterial) => {
    if (accessCode.toUpperCase() === material.code) {
      const newUnlocked = [...unlockedMaterials, material.id];
      setUnlockedMaterials(newUnlocked);
      localStorage.setItem('unlocked_materials', JSON.stringify(newUnlocked));
      setAccessCode('');
      setErrorCode(null);
    } else {
      setErrorCode('Código incorreto. Tente novamente.');
    }
  };

  const openSubjectDetail = (subject: Subject) => {
    // Open in new tab as requested
    window.open(`${window.location.origin}${window.location.pathname}?subject=${subject.id}`, '_blank');
  };

  const openMaterialDetail = (material: ComplementaryMaterial) => {
    // Open in new tab as requested
    window.open(`${window.location.origin}${window.location.pathname}?material=${material.id}`, '_blank');
  };

  // --- Render Login Page ---
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-[#001a12] flex flex-col font-sans text-white">
        <Header />
        
        <main className="flex-grow flex items-center justify-center px-6 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-[#002a1d] p-10 rounded-3xl shadow-2xl border border-white/10 text-center space-y-8"
          >
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl bg-white flex items-center justify-center">
              <img 
                src="https://i.ibb.co/mFbSYv6j/1000112350.webp" 
                alt="Logo" 
                className="w-full h-full object-cover scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight">
                Área de Membros <br />
                <span className="text-yellow-400">Petrobras 2026</span>
              </h1>
              <p className="text-white/60 text-sm">
                Digite seu nome para acessar sua área de estudos.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="text" 
                placeholder="Ex: Eduarda"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full bg-[#001a12] border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
              />
              <button 
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#002a1d] font-black py-4 rounded-xl shadow-lg shadow-yellow-400/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider"
              >
                Entrar na área de estudos
              </button>
            </form>
          </motion.div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // --- Render Study Area ---
  if (currentPage === 'study-area') {
    return (
      <div className="min-h-screen bg-[#001a12] flex flex-col font-sans text-white">
        <Header onLogout={handleLogout} bgImage="https://i.ibb.co/Rp5N0LWN/concurso-nivel-tecnico.jpg" />
        
        <div className="pt-20">
          {/* Hero Welcome Section */}
          <div className="relative py-24 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://i.ibb.co/Rp5N0LWN/concurso-nivel-tecnico.jpg" 
                alt="Header BG" 
                className="w-full h-full object-cover opacity-20 scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#001a12]/80 via-transparent to-[#001a12]" />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 text-center px-6 max-w-4xl"
            >
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-2xl">
                Bem-vindo, <span className="text-yellow-400">{userName}</span>, <br />
                à sua área de estudos.
              </h2>
              <div className="mt-8 h-1.5 w-32 bg-yellow-400 mx-auto rounded-full shadow-lg shadow-yellow-400/20" />
            </motion.div>
          </div>

          <main className="max-w-7xl mx-auto px-6 py-16 space-y-20">
            
            {/* Section 1: Subjects */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-8 w-1.5 bg-yellow-400 rounded-full" />
                <h3 className="text-2xl font-bold uppercase tracking-widest text-white/90">Matérias do Curso</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {SUBJECTS.map((subject) => (
                  <motion.div 
                    key={subject.id}
                    whileHover={{ y: -8 }}
                    onClick={() => openSubjectDetail(subject)}
                    className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-xl border border-white/10"
                  >
                    <img 
                      src={subject.bgImage} 
                      alt={subject.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h4 className="text-lg font-black text-white uppercase leading-tight group-hover:text-yellow-400 transition-colors">
                        {subject.title}
                      </h4>
                      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-white/60 uppercase tracking-widest">
                        <span>Acessar Módulos</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Section 2: Complementary Materials */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-8 w-1.5 bg-emerald-500 rounded-full" />
                <h3 className="text-2xl font-bold uppercase tracking-widest text-white/90">Materiais Complementares</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {COMPLEMENTARY.map((material) => {
                  const isUnlocked = unlockedMaterials.includes(material.id);
                  
                  return (
                    <motion.div 
                      key={material.id}
                      whileHover={{ y: -8 }}
                      className="bg-[#002a1d] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
                    >
                      <div className="relative h-48">
                        <img 
                          src={material.bgImage} 
                          alt={material.title} 
                          className="w-full h-full object-cover opacity-60"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#002a1d] to-transparent" />
                        <div className="absolute top-4 right-4">
                          {isUnlocked ? (
                            <div className="bg-emerald-500 p-2 rounded-full shadow-lg">
                              <Unlock size={20} className="text-white" />
                            </div>
                          ) : (
                            <div className="bg-red-500 p-2 rounded-full shadow-lg">
                              <Lock size={20} className="text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-8 flex-grow flex flex-col space-y-6">
                        <h4 className="text-xl font-bold leading-tight text-white">
                          {material.title}
                        </h4>
                        
                        {isUnlocked ? (
                          <button 
                            onClick={() => openMaterialDetail(material)}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 uppercase text-sm tracking-widest"
                          >
                            <BookOpen size={18} />
                            Acessar Material
                          </button>
                        ) : (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase font-black text-white/40 tracking-widest">Código de Acesso</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  placeholder="Digite o código"
                                  className="flex-grow bg-[#001a12] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400"
                                  onChange={(e) => {
                                    setAccessCode(e.target.value);
                                    setErrorCode(null);
                                  }}
                                />
                                <button 
                                  onClick={() => handleUnlock(material)}
                                  className="bg-yellow-400 hover:bg-yellow-300 text-[#002a1d] font-black px-4 py-3 rounded-lg text-xs uppercase tracking-wider transition-all"
                                >
                                  Validar
                                </button>
                              </div>
                              {errorCode && <p className="text-red-400 text-[10px] font-bold uppercase">{errorCode}</p>}
                            </div>
                            
                            <div className="pt-2 flex flex-col gap-3">
                              <button 
                                onClick={() => handleUnlock(material)}
                                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl border border-white/10 transition-all text-xs uppercase tracking-widest"
                              >
                                Desbloquear Agora
                              </button>
                              <a 
                                href={material.checkoutUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2"
                              >
                                <ExternalLink size={14} />
                                Adquirir Agora
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          </main>
        </div>
        
        <Footer />
      </div>
    );
  }

  // --- Render Detail Page (Subject or Material) ---
  if (currentPage === 'subject-detail') {
    const item = selectedSubject || selectedMaterial;
    if (!item) return null;

    return (
      <div className="min-h-screen bg-[#001a12] flex flex-col font-sans text-white">
        <Header onLogout={handleLogout} />
        
        <div className="pt-20">
          {/* Detail Hero */}
          <div className="relative h-64 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img 
                src={item.bgImage} 
                alt={item.title} 
                className="w-full h-full object-cover opacity-40 blur-sm scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#001a12]/80 via-transparent to-[#001a12]" />
            </div>
            
            <div className="relative z-10 text-center px-6">
              <button 
                onClick={() => setCurrentPage('study-area')}
                className="mb-4 text-yellow-400 hover:text-yellow-300 flex items-center gap-2 mx-auto text-sm font-bold uppercase tracking-widest transition-all"
              >
                <ChevronRight size={16} className="rotate-180" />
                Voltar para Área de Estudos
              </button>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">
                {item.title}
              </h2>
            </div>
          </div>

          <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
            {selectedSubject ? (
              <>
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-400/20 rounded-lg">
                      <BookOpen size={24} className="text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-widest">Conteúdo Teórico</h3>
                  </div>
                  <PDFViewer url={selectedSubject.teoriaUrl} title="Apostila de Teoria Completa" />
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <BookOpen size={24} className="text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-widest">Mapas Mentais</h3>
                  </div>
                  <PDFViewer url={selectedSubject.mapasUrl} title="Mapas Mentais Estratégicos" />
                </section>
              </>
            ) : (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-400/20 rounded-lg">
                    <BookOpen size={24} className="text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-widest">Material Completo</h3>
                </div>
                <PDFViewer url={selectedMaterial!.pdfUrl} title={selectedMaterial!.title} />
              </section>
            )}
          </main>
        </div>
        
        <Footer />
      </div>
    );
  }

  return null;
}
