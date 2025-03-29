import { motion } from 'framer-motion';

interface Project {
  title: string;
  description: string;
  details: string;
}

interface ProjectDeepDiveProps {
  selectedProject: Project | null;
  onClose: () => void;
}

export default function ProjectDeepDive({
  selectedProject,
  onClose,
}: ProjectDeepDiveProps) {
  if (!selectedProject) return null;

  return (
    <motion.div
      className="max-w-2xl mx-auto p-8 bg-gray-100 rounded shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <h2 className="text-2xl font-bold mb-2">{selectedProject.title}</h2>
      <p className="text-gray-700 mb-4">{selectedProject.details}</p>
      <button onClick={onClose} className="px-4 py-2 bg-black text-white rounded">
        Back
      </button>
    </motion.div>
  );
}