import { motion } from 'framer-motion';

interface MicStatusProps {
  isListening: boolean;
  onToggle: () => void;
}

export default function MicStatus({ isListening, onToggle }: MicStatusProps) {
  return (
    <div className="text-center mb-2 flex justify-center items-center gap-4">
      <button
        onClick={onToggle}
        className={`px-4 py-2 rounded ${isListening ? 'bg-red-500' : 'bg-green-600'} text-white`}
      >
        {isListening ? 'Stop Listening' : 'Push to Talk'}
      </button>
      <motion.div
        className="w-4 h-4 rounded-full bg-green-500"
        animate={
          isListening
            ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }
            : { scale: 1, opacity: 0.3 }
        }
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  );
}