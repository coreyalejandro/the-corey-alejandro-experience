import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  title: string;
  description: string;
  details: string;
}

interface ProjectCardsProps {
  projects: Project[];
  selectedProject: Project | null;
  openProject: (proj: Project) => void;
}

export default function ProjectCards({
  projects = [],
  selectedProject,
  openProject,
}: ProjectCardsProps) {
  return (
    <AnimatePresence>
      {!selectedProject && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {projects.map((proj, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={() => openProject(proj)}
            >
              <div className="bg-white shadow p-4 rounded cursor-pointer">
                <h3 className="text-xl font-semibold">{proj.title}</h3>
                <p className="text-gray-500">{proj.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}