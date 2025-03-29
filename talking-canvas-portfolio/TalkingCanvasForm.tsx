import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';

export default function TalkingCanvasForm(props) {
  const { transcript = '', setTranscript = () => {}, handleCommand = () => {}, source = 'text' } = props;
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(persistent => {
        console.log(`Storage will be persistent: ${persistent}`);
      });
    }
  }, []);

  useEffect(() => {
    if (source === 'voice' && transcript.trim()) {
      handleCommand(transcript.toLowerCase());
      setConfirmation('Got it!');
      setTimeout(() => setConfirmation(''), 2000);
    }
  }, [transcript, source, handleCommand]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCommand(transcript.toLowerCase());
      }}
      className="text-center mb-4"
    >
      <label htmlFor="voice-command-input" className="block text-gray-700 text-sm font-bold mb-2">
        Type or say a command (e.g., "Show me your latest work")
      </label>
      <input
        type="text"
        id="voice-command-input"
        name="voiceCommand"
        autoComplete="off"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Try: Show me your latest work"
        className="border border-gray-300 px-4 py-2 w-2/3 max-w-md rounded"
      />
      <button
        type="submit"
        id="voice-submit-button"
        name="submitButton"
        className="ml-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Ask
      </button>
      <p className="text-sm text-gray-500 mt-2">
        This canvas responds automatically to voice. Type and press Ask to interact manually.
      </p>
      {confirmation && (
        <p className="text-green-600 text-sm mt-1">{confirmation}</p>
      )}
    </form>
  );
}
