import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  title: string;
  description: string;
  details: string;
}

interface Props {
  selectedProject: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ selectedProject, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    modalRef.current?.focus();
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!selectedProject) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          tabIndex={-1}
          className="bg-white rounded-lg p-6 shadow-lg max-w-xl w-full"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <h2 id="modal-title" className="text-2xl font-bold mb-2">
            {selectedProject.title}
          </h2>
          <p className="text-gray-700 mb-4">{selectedProject.details}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded"
            aria-label="Close project modal"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}