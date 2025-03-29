import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import TalkingCanvasForm from "./TalkingCanvasForm";

const mockProjects = [
  { title: "AI Moodboard Generator", description: "Real-time AI-driven inspiration board with voice commands." },
  { title: "3D Dot-to-Project Navigator", description: "Interactive 3D dots reveal project previews with click." },
  { title: "Voice Controlled Code Editor", description: "AI-enhanced editor with natural language coding features." },
];

export default function TalkingCanvas() {
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [projects, setProjects] = useState([]);
  const [source, setSource] = useState('text');
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const msg = event.results[event.results.length - 1][0].transcript;
      setTranscript(msg);
      setSource('voice');
    };
    recognition.start();

    return () => recognition.stop();
  }, []);

  const speak = (text) => {
    setResponse(text);
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = synth.getVoices()[0];
    synth.speak(utter);
  };

  const handleCommand = (msg) => {
    if (msg.includes("latest work")) {
      setProjects(mockProjects);
      speak("Here is my latest work. Let me walk you through it.");
    } else {
      speak("Sorry, I didn't catch that. Try asking about my work.");
    }
  };

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('Microphone access is not supported in this environment.');
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.fftSize = 64;
        const dataArray = new Uint8Array(analyser.fftSize);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;

        const ctx = canvasRef.current.getContext('2d');

        const drawWave = () => {
          requestAnimationFrame(drawWave);
          analyser.getByteTimeDomainData(dataArray);
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.beginPath();
          ctx.moveTo(0, 100);
          dataArray.forEach((val, i) => {
            const x = (canvasRef.current.width / dataArray.length) * i;
            const y = 100 + (val - 128);
            ctx.lineTo(x, y);
          });
          ctx.stroke();
        };

        drawWave();
      })
      .catch((err) => {
        console.warn('Microphone access denied or unavailable:', err);
      });
  }, []);

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      <canvas ref={canvasRef} width={600} height={200} className="mx-auto my-10" />
      <div className="text-center text-xl text-black mt-2">{transcript}</div>
      <div className="text-center text-md text-gray-600 mt-1">{response}</div>

      <TalkingCanvasForm
        transcript={transcript}
        setTranscript={(text) => {
          setTranscript(text);
          setSource('text');
        }}
        handleCommand={handleCommand}
        source={source}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
        {projects.map((proj, i) => (
          <Card key={i}>
            <CardContent>
              <h3 className="text-xl font-semibold">{proj.title}</h3>
              <p className="text-gray-500">{proj.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
