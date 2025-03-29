import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// ----- Types and Interfaces -----
type SystemStatus = 'active' | 'inactive' | 'warning' | 'error';
type SystemName = 'Propulsion' | 'Navigation' | 'Life Support' | 'Defense' | 'Communications' | 'Power';
type AlertLevel = 'info' | 'warning' | 'danger';
type DriveStatus = 'inactive' | 'active' | 'charging' | 'cooldown';
type ViewMode = 'SPACE' | 'TACTICAL' | 'SYSTEM' | 'DIAGNOSTIC';
type PowerSource = 'TOTAL' | 'QUANTUM' | 'FUSION' | 'BACKUP';

interface SystemStatusData {
  name: SystemName;
  percentage: number;
  status: SystemStatus;
}

interface AlertMessage {
  message: string;
  level: AlertLevel;
  timestamp: Date;
}

interface Target {
  id: string;
  distance: number;
  status: 'LOCKED' | 'TRACKING';
}

interface NavigationData {
  heading: number;
  speed: number;
  destination: string;
  eta: string;
}

interface PowerDetails {
  health: number;
  efficiency: number;
  powerDraw: number;
  outputHistory: number[];
}

interface PowerDistribution {
  sources: Record<PowerSource, number>;
  grid: boolean[][];
}

// Add these interfaces at the top with other interfaces
interface StatusBarProps {
  percentage: number;
  status: SystemStatus;
}

interface PanelHeaderProps {
  title: string;
}

interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertBannerProps {
  alert: {
    message: string;
    level: AlertLevel;
  };
}

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface SimpleDataDisplayProps {
  label: string;
  value: string | number;
}

interface PowerOutputGraphProps {
  data: number[];
}

interface SystemMenuItemProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
}

// Add these additional interfaces
interface GridProps {
  grid: boolean[][];
}

interface GridCellProps {
  active: boolean;
  index: number;
}

interface SectionHeaderProps {
  heading: string;
}

interface TargetProps {
  target: string;
}

interface LogEntryProps {
  message: string;
  timestamp: string;
}

interface SystemStatusProps {
  status: SystemStatus;
  integrity: number;
}

interface ModeSelectorProps {
  mode: string;
}

// Add these additional interfaces
interface CompassHeadingProps {
  heading: string;
}

interface TargetDisplayProps {
  target: Target;
}

interface PowerSourceProps {
  source: string;
  percentage: number;
}

interface SystemListProps {
  systems: System[];
}

interface LogListProps {
  logs: Array<{
    message: string;
    timestamp: Date;
  }>;
}

interface System {
  id: string;
  name: string;
  status: SystemStatus;
  integrity: number;
}

interface Navigation {
  heading: number;
  speed: number;
  target: string;
}

interface PowerSystem {
  id: string;
  name: string;
  status: SystemStatus;
  powerLevel: number;
}

interface SystemStatusPanelProps {
  systems: SystemStatusData[];
}

interface SystemMenuPanelProps {
  systems: SystemName[];
  activeSystem: SystemName;
  onSelectSystem: (system: SystemName) => void;
}

interface SystemDetailRowProps {
  label: string;
  value: string | number;
  status: 'nominal' | 'warning' | 'critical' | 'offline';
}

interface PowerDetailsPanelProps {
  details: PowerDetails;
}

interface KnowledgeBaseRAGPanelProps {
  onSearch: (query: string) => void;
  onVoiceCommand: (command: string) => void;
}

interface ActionButtonsPanelProps {
  onEngageWarp: () => void;
  onScanObject: () => void;
  onActivateShields: () => void;
  canEngageWarp: boolean;
}

interface Alert {
  message: string;
  level: 'critical' | 'warning' | 'info';
  timestamp: Date;
}

interface MainViewPanelProps {
  alerts: Alert[];
  planetPosition: {
    x: number;
    y: number;
  };
}

interface TacticalDisplayPanelProps {
  navigation: NavigationData;
  targets: Target[];
}

interface RadarObject {
  distance: number;
  angle: number;
  type: 'neutral' | 'hostile' | 'friendly' | 'anomaly';
  size?: number;
}

interface RadarDisplayProps {
  objects: RadarObject[];
}

interface CrewStatusProps {
  crewCount: number;
  crewHealth: number;
  awakePercentage: number;
}

interface Resource {
  amount: number;
  capacity: number;
}

interface ResourceDisplayProps {
  resources: Record<string, Resource>;
}

interface MaintenanceTask {
  name: string;
  eta: string;
  urgent: boolean;
}

interface MaintenanceStatusProps {
  tasks: MaintenanceTask[];
}

interface LifeSupportDetailsProps {
  oxygen: number;
  temperature: number;
  pressure: number;
}

interface Notification {
  title: string;
  message: string;
  level: 'critical' | 'warning';
}

interface NotificationOverlayProps {
  notifications: Notification[];
  onDismiss: () => void;
}

interface VoiceCommandPrompt {
  command: string;
  description: string;
}

// ----- Theme and Styling -----
const theme = {
  colors: {
    background: '#0a0a0a',
    panelBackground: 'rgba(20, 20, 20, 0.8)',
    border: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    accent: '#00f5ff',
    accentSecondary: '#ff00f5',
    success: '#00ff9d',
    warning: '#ffb800',
    error: '#ff3d3d',
    glass: 'rgba(255, 255, 255, 0.05)',
    glassHover: 'rgba(255, 255, 255, 0.1)',
  },
  borders: {
    panel: '1px solid rgba(255, 255, 255, 0.1)',
    highlight: '1px solid rgba(255, 255, 255, 0.2)',
  },
  shadows: {
    glow: '0 0 20px rgba(0, 245, 255, 0.2)',
    panel: '0 4px 30px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  glassmorphism: {
    backdrop: 'backdrop-filter: blur(10px)',
    background: 'background: rgba(20, 20, 20, 0.8)',
  }
};

interface ExpertiseArea {
  id: string;
  name: string;
  description: string;
  skills: string[];
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    demo?: string;
    github?: string;
  }>;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
  }>;
}

const EXPERTISE_AREAS: ExpertiseArea[] = [
  {
    id: 'isd',
    name: 'Instructional Systems Design',
    description: 'Designing effective learning experiences and educational systems',
    skills: ['Learning Design', 'Curriculum Development', 'Educational Technology', 'Assessment Design'],
    projects: [
      {
        title: 'Adaptive Learning Platform',
        description: 'AI-powered learning management system with personalized content delivery',
        technologies: ['React', 'Node.js', 'MongoDB', 'TensorFlow'],
        demo: 'https://demo.adaptive-learning.com',
        github: 'https://github.com/username/adaptive-learning'
      }
    ]
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    description: 'Developing intelligent systems and AI solutions',
    skills: ['Neural Networks', 'Natural Language Processing', 'Computer Vision', 'Reinforcement Learning'],
    projects: [
      {
        title: 'AI-Powered Content Generator',
        description: 'Advanced content generation system using GPT and custom models',
        technologies: ['Python', 'TensorFlow', 'OpenAI API', 'FastAPI'],
        demo: 'https://demo.ai-content.com',
        github: 'https://github.com/username/ai-content'
      }
    ]
  },
  {
    id: 'data-science',
    name: 'Data Science',
    description: 'Analyzing complex data and deriving actionable insights',
    skills: ['Data Analysis', 'Statistical Modeling', 'Data Visualization', 'Big Data'],
    projects: [
      {
        title: 'Predictive Analytics Dashboard',
        description: 'Real-time data visualization and prediction platform',
        technologies: ['Python', 'Pandas', 'Scikit-learn', 'D3.js'],
        demo: 'https://demo.analytics.com',
        github: 'https://github.com/username/analytics'
      }
    ]
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    description: 'Building and deploying machine learning models',
    skills: ['Model Development', 'Feature Engineering', 'Model Deployment', 'MLOps'],
    projects: [
      {
        title: 'ML Model Deployment Platform',
        description: 'End-to-end platform for ML model deployment and monitoring',
        technologies: ['Python', 'Docker', 'Kubernetes', 'Prometheus'],
        demo: 'https://demo.ml-platform.com',
        github: 'https://github.com/username/ml-platform'
      }
    ]
  },
  {
    id: 'fullstack',
    name: 'Full Stack Web Development',
    description: 'Building scalable web applications and systems',
    skills: ['Frontend Development', 'Backend Development', 'DevOps', 'Cloud Architecture'],
    projects: [
      {
        title: 'Cloud-Native Web Platform',
        description: 'Scalable web platform with microservices architecture',
        technologies: ['React', 'Node.js', 'AWS', 'Docker'],
        demo: 'https://demo.web-platform.com',
        github: 'https://github.com/username/web-platform'
      }
    ]
  }
];

const EDUCATION: Education = {
  degree: 'Master of Science in Computer Science',
  institution: 'University of Technology',
  year: '2022',
  certifications: [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023',
      credentialId: 'AWS-123456'
    },
    {
      name: 'Google Cloud Professional Data Engineer',
      issuer: 'Google',
      date: '2023',
      credentialId: 'GCP-789012'
    }
  ]
};

const VOICE_COMMANDS: VoiceCommandPrompt[] = [
  // Navigation Commands
  { command: "show expertise", description: "Display all expertise areas" },
  { command: "show education", description: "Display education and certifications" },
  { command: "show projects", description: "Display all projects" },
  { command: "show skills", description: "Display all skills" },
  
  // Expertise Area Commands
  { command: "show instructional design", description: "Display Instructional Systems Design expertise" },
  { command: "show artificial intelligence", description: "Display AI expertise" },
  { command: "show data science", description: "Display Data Science expertise" },
  { command: "show machine learning", description: "Display Machine Learning expertise" },
  { command: "show full stack", description: "Display Full Stack Development expertise" },
  
  // Project Commands
  { command: "show projects in", description: "Show projects for a specific expertise area" },
  { command: "show skills in", description: "Show skills for a specific expertise area" },
  
  // Search Commands
  { command: "search for", description: "Search across all content" },
  { command: "search in", description: "Search within a specific expertise area" },
  
  // Help Commands
  { command: "help", description: "Show available voice commands" },
  { command: "stop listening", description: "Disable voice control" }
];

// ----- Utility Components -----

// Component 1: StatusBar - Shows a colored progress bar
const StatusBar = ({ percentage, status }: StatusBarProps) => {
  const getColor = () => {
    switch (status) {
      case 'error': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'inactive': return theme.colors.textSecondary;
      default: return theme.colors.success;
    }
  };

  return (
    <div className="flex items-center w-full">
      <div className="w-full bg-gray-800 rounded-sm h-2">
        <div 
          className="h-full rounded-sm" 
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: getColor() 
          }} 
        />
      </div>
      <span className="ml-2 text-xs" style={{ color: theme.colors.textPrimary }}>
        {percentage}%
      </span>
    </div>
  );
};

// Component 2: PanelHeader - Consistent header for all panels
const PanelHeader = ({ title }: PanelHeaderProps) => (
  <div 
    className="w-full px-3 py-2 font-bold tracking-wide"
    style={{ color: theme.colors.textPrimary }}
  >
    {title}
  </div>
);

// Component 3: Panel - Base container for all panels
const Panel = ({ children, className = "" }: PanelProps) => (
  <div 
    className={`rounded overflow-hidden flex flex-col ${className}`}
    style={{ 
      border: theme.borders.panel,
      backgroundColor: theme.colors.panelBackground,
    }}
  >
    {children}
  </div>
);

// Component 4: AlertBanner - Shows alert messages
const AlertBanner = ({ alert }: AlertBannerProps) => {
  const getColor = () => {
    switch (alert.level) {
      case 'danger': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      default: return theme.colors.accent;
    }
  };
  
  return (
    <div 
      className="w-full py-2 px-4 text-center my-1 rounded"
      style={{ 
        backgroundColor: getColor(),
        color: '#000000',
      }}
    >
      {alert.message}
    </div>
  );
};

// Component 5: ActionButton - Interactive button for ship controls
const ActionButton = ({ label, onClick, disabled = false }: ActionButtonProps) => (
  <button
    className="w-full py-3 px-4 my-1 text-center rounded transition-all duration-200"
    style={{
      backgroundColor: disabled ? theme.colors.glass : theme.colors.accent,
      color: disabled ? theme.colors.textSecondary : theme.colors.textPrimary,
      border: theme.borders.panel,
    }}
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
);

// Component 6: SimpleDataDisplay - For displaying key-value pair data
const SimpleDataDisplay = ({ label, value }: SimpleDataDisplayProps) => (
  <div className="flex justify-between items-center mb-2">
    <span style={{ color: theme.colors.textSecondary }}>{label}:</span>
    <span style={{ color: theme.colors.textPrimary }}>{value}</span>
  </div>
);

// Component 7: PowerOutputGraph - Line graph for power output
const PowerOutputGraph = ({ data }: PowerOutputGraphProps) => {
  // Simple SVG line graph
  const height = 100;
  const width = 300;
  const maxValue = Math.max(...data, 100);
  
  const points = data.map((value, index) => 
    `${(index / (data.length - 1)) * width},${height - (value / maxValue) * height}`
  ).join(' ');
  
  return (
    <div className="bg-black bg-opacity-30 rounded p-1">
      <div className="text-xs mb-1" style={{ color: theme.colors.textSecondary }}>
        Power Output Levels
      </div>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={theme.colors.accent}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

// Component 8: SystemMenuItem - Menu item for system selection
const SystemMenuItem = ({ name, isActive, onClick }: SystemMenuItemProps) => (
  <div 
    className="py-2 px-4 cursor-pointer transition-all duration-200"
    style={{ 
      backgroundColor: isActive ? theme.colors.accent : 'transparent',
      color: isActive ? theme.colors.textPrimary : theme.colors.textSecondary,
      borderLeft: isActive ? `3px solid ${theme.colors.accent}` : '3px solid transparent',
    }}
    onClick={onClick}
  >
    {name}
  </div>
);

// Component 9: PowerGrid - Visual representation of power allocation
const PowerGrid = ({ grid }: GridProps) => (
  <div className="grid grid-cols-5 gap-1">
    {grid.flat().map((active, index) => (
      <GridCell 
        key={index}
        active={active}
        index={index}
      />
    ))}
  </div>
);

const GridCell = ({ active, index }: GridCellProps) => (
  <div
    className={`aspect-square rounded ${active ? 'bg-success' : 'bg-gray-800'} border ${active ? 'border-success' : 'border-gray-800'}`}
  />
);

// Component 10: CompassHeading - Shows direction on tactical display
const CompassHeading = ({ heading }: CompassHeadingProps) => {
  const directions = ['N', 'E', 'S', 'W'];
  const rotation = heading;
  
  return (
    <div className="relative">
      <div className="w-40 h-40 rounded-full border-2 border-gray-600 flex items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div style={{ transform: `rotate(${-rotation}deg)` }}>
            {directions.map((dir, idx) => (
              <div
                key={dir}
                className="absolute text-sm font-bold"
                style={{ 
                  transform: `rotate(${idx * 90}deg) translateY(-42px)`,
                  color: theme.colors.textPrimary,
                }}
              >
                {dir}
              </div>
            ))}
          </div>
        </div>
        
        {/* Heading indicator */}
        <div 
          className="w-1 h-16 bg-blue-400 absolute top-0 left-1/2 transform -translate-x-1/2 origin-bottom"
          style={{ transform: `translateY(4px) rotate(${heading}deg)` }}
        />
      </div>
    </div>
  );
};

// Component 11: Target - Visual indicator of tracked object
const TargetIndicator = ({ target }: TargetDisplayProps) => (
  <div className="mb-2">
    <div className="flex items-center">
      <div 
        className="w-6 h-6 mr-2 flex items-center justify-center"
        style={{ 
          border: `1px solid ${target.status === 'LOCKED' ? theme.colors.error : theme.colors.warning}`,
          color: target.status === 'LOCKED' ? theme.colors.error : theme.colors.warning,
        }}
      >
        <span>+</span>
      </div>
      <div>
        <div style={{ color: target.status === 'LOCKED' ? theme.colors.error : theme.colors.warning }}>
          {target.id}: {target.distance}m
        </div>
        <div className="text-xs" style={{ color: target.status === 'LOCKED' ? theme.colors.error : theme.colors.warning }}>
          {target.status}
        </div>
      </div>
    </div>
  </div>
);

// Component 12: ShipLogEntry - For displaying ship log entries
const ShipLogEntry = ({ message, timestamp }: LogEntryProps) => (
  <div className="py-1 border-b border-gray-800">
    <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
      {timestamp}
    </div>
    <div style={{ color: theme.colors.textPrimary }}>{message}</div>
  </div>
);

// Component 13: DriveStatus - Shows the current drive status
const DriveStatus = ({ status, integrity }: SystemStatusProps) => (
  <div className="text-center py-3">
    <div className="text-xl uppercase tracking-widest mb-1" style={{ color: theme.colors.accent }}>
      {status === 'active' ? 'Drive Active' : 'Drive Inactive'}
    </div>
    <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
      Integrity: {integrity}%
    </div>
  </div>
);

// Component 14: ViewModeIndicator - Shows current view mode
const ViewModeIndicator = ({ mode }: ModeSelectorProps) => (
  <div className="text-center py-2">
    <div className="text-sm tracking-widest" style={{ color: theme.colors.accent }}>
      VIEW MODE: {mode}
    </div>
  </div>
);

// Component 15: PowerSourceBar - Bar showing power allocation for a source
const PowerSourceBar = ({ source, percentage }: PowerSourceProps) => (
  <div className="mb-2">
    <div className="flex justify-between mb-1">
      <span style={{ color: theme.colors.textSecondary }}>{source}</span>
      <span style={{ color: theme.colors.textPrimary }}>{percentage}%</span>
    </div>
    <div className="w-full bg-gray-800 rounded-sm h-2">
      <div 
        className="h-full rounded-sm" 
        style={{ 
          width: `${percentage}%`, 
          backgroundColor: source === 'TOTAL' ? theme.colors.warning : theme.colors.success 
        }} 
      />
    </div>
  </div>
);

// Component 16: SystemStatusPanel - Left top panel showing system statuses
const SystemStatusPanel = ({ systems }) => (
  <Panel>
    <PanelHeader title="SYSTEM STATUS" />
    <div className="p-4 flex-1">
      {systems.map(system => (
        <div key={system.name} className="mb-3">
          <div className="flex justify-between mb-1">
            <span style={{ color: theme.colors.textSecondary }}>{system.name}</span>
          </div>
          <StatusBar percentage={system.percentage} status={system.status} />
        </div>
      ))}
    </div>
  </Panel>
);

// Component 17: ShipLogPanel - Shows log of ship events
const ShipLogPanel = ({ logs }: LogListProps) => (
  <Panel>
    <PanelHeader title="SHIP LOG" />
    <div className="p-4 flex-1 overflow-y-auto max-h-40">
      {logs.map((log, index) => (
        <ShipLogEntry key={index} message={log.message} timestamp={log.timestamp.toLocaleTimeString()} />
      ))}
    </div>
  </Panel>
);

// Component 18: SystemMenuPanel - Left menu for selecting systems
const SystemMenuPanel = ({ systems, activeSystem, onSelectSystem }: SystemMenuPanelProps) => (
  <Panel>
    {systems.map(system => (
      <SystemMenuItem 
        key={system}
        name={system}
        isActive={activeSystem === system}
        onClick={() => onSelectSystem(system)}
      />
    ))}
  </Panel>
);

// Component 19: PowerDetailsPanel - Shows detailed power information
const PowerDetailsPanel = ({ details }: PowerDetailsPanelProps) => (
  <Panel>
    <PanelHeader title="POWER DETAILS" />
    <div className="p-4 flex-1">
      <SimpleDataDisplay label="Health" value={`${details.health}%`} />
      <SimpleDataDisplay label="Efficiency" value={`${details.efficiency}%`} />
      <SimpleDataDisplay label="Power Draw" value={`${details.powerDraw}%`} />
      
      <div className="mt-4">
        <PowerOutputGraph data={details.outputHistory} />
      </div>
    </div>
  </Panel>
);

// Component 20: KnowledgeBaseRAGPanel - Intelligent information retrieval system
const KnowledgeBaseRAGPanel = ({ onSearch, onVoiceCommand }: KnowledgeBaseRAGPanelProps) => {
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    title: string;
    content: string;
    relevance: number;
  }>>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[event.results.length - 1][0].transcript;
          onVoiceCommand(transcript);
        };
      }
    }
  }, [onVoiceCommand]);

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <Panel>
      <PanelHeader title="KNOWLEDGE BASE RAG" />
      <div className="p-4 flex-1">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search knowledge base..."
            className="flex-1 bg-[#1a1a1a] text-white px-3 py-2 rounded border border-[#333] focus:outline-none focus:border-[#00ff00]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#00ff00] text-black rounded hover:bg-[#00cc00] transition-colors"
          >
            Search
          </button>
        </form>

        <button
          onClick={toggleVoiceRecognition}
          className={`w-full px-4 py-2 rounded mb-4 transition-colors ${
            isListening
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-[#00ff00] hover:bg-[#00cc00]'
          } text-black`}
        >
          {isListening ? 'Stop Voice Recognition' : 'Start Voice Recognition'}
        </button>

        <div className="space-y-4">
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="bg-[#1a1a1a] p-4 rounded border border-[#333]"
            >
              <h3 className="text-[#00ff00] font-bold mb-2">{result.title}</h3>
              <p className="text-white mb-2">{result.content}</p>
              <div className="text-sm text-gray-400">
                Relevance: {Math.round(result.relevance * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
};

// Component 21: ActionButtonsPanel - Right side action buttons
const ActionButtonsPanel = ({
  onEngageWarp,
  onScanObject,
  onActivateShields,
  canEngageWarp,
}: ActionButtonsPanelProps) => (
  <Panel>
    <PanelHeader title="ACTION BUTTONS" />
    <div className="p-4 flex-1 flex flex-col gap-4">
      <button
        onClick={onEngageWarp}
        disabled={!canEngageWarp}
        className={`px-4 py-2 rounded ${
          canEngageWarp
            ? 'bg-[#00ff00] hover:bg-[#00cc00]'
            : 'bg-gray-500 cursor-not-allowed'
        } text-black transition-colors`}
      >
        Engage Warp Drive
      </button>
      <button
        onClick={onScanObject}
        className="px-4 py-2 bg-[#00ff00] hover:bg-[#00cc00] text-black rounded transition-colors"
      >
        Scan Object
      </button>
      <button
        onClick={onActivateShields}
        className="px-4 py-2 bg-[#00ff00] hover:bg-[#00cc00] text-black rounded transition-colors"
      >
        Activate Shields
      </button>
    </div>
  </Panel>
);

// Component 22: MainViewPanel - Central view screen
const MainViewPanel = ({ alerts, planetPosition }: MainViewPanelProps) => (
  <Panel>
    <PanelHeader title="MAIN VIEW" />
    <div className="p-4 flex-1">
      <div className="relative w-full h-full">
        <div
          className="absolute w-4 h-4 bg-[#00ff00] rounded-full"
          style={{
            left: `${planetPosition.x}%`,
            top: `${planetPosition.y}%`,
          }}
        />
      </div>
      <div className="mt-4 space-y-2">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`p-2 rounded ${
              alert.level === 'critical'
                ? 'bg-red-500'
                : alert.level === 'warning'
                ? 'bg-yellow-500'
                : 'bg-blue-500'
            } text-white`}
          >
            {alert.message}
          </div>
        ))}
      </div>
    </div>
  </Panel>
);

// Component 23: TacticalDisplayPanel - Bottom central tactical info
const TacticalDisplayPanel = ({ navigation, targets }: TacticalDisplayPanelProps) => (
  <Panel>
    <PanelHeader title="TACTICAL DISPLAY" />
    <div className="p-4 flex-1">
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-[#00ff00]">Heading:</span>
          <span className="text-white">{navigation.heading}°</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#00ff00]">Speed:</span>
          <span className="text-white">{navigation.speed} km/s</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#00ff00]">Destination:</span>
          <span className="text-white">{navigation.destination}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#00ff00]">ETA:</span>
          <span className="text-white">{navigation.eta}</span>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-[#00ff00] mb-2">Active Targets:</h3>
        <div className="space-y-2">
          {targets.map((target, index) => (
            <TargetIndicator key={index} target={target} />
          ))}
        </div>
      </div>
    </div>
  </Panel>
);

// Component 24: DriveStatusPanel - Bottom status bar
const DriveStatusPanel = ({ status, integrity }: SystemStatusProps) => (
  <Panel>
    <DriveStatus status={status} integrity={integrity} />
  </Panel>
);

// Component 25: PlanetaryBody - Visualizes a planet in space view
const PlanetaryBody = ({ size, color, hasRings = false, position }) => (
  <div 
    className="absolute rounded-full"
    style={{ 
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      boxShadow: `0 0 ${size/2}px rgba(139, 233, 253, 0.3)`,
      transform: `translate(${position.x}px, ${position.y}px)`,
      top: '50%',
      left: '50%',
      marginLeft: `-${size/2}px`,
      marginTop: `-${size/2}px`,
    }}
  >
    {hasRings && (
      <div 
        className="absolute rounded-full border-2"
        style={{
          width: `${size * 1.4}px`,
          height: `${size * 0.3}px`,
          borderColor: 'rgba(255,255,255,0.4)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotateX(70deg)',
        }}
      />
    )}
  </div>
);

// Component 26: AlertIndicator - Small indicator for system alerts
const AlertIndicator = ({ system, isActive }) => (
  <div 
    className="w-2 h-2 rounded-full ml-2"
    style={{ 
      backgroundColor: isActive ? theme.colors.error : 'transparent',
      display: isActive ? 'block' : 'none',
    }}
  />
);

// Component 27: SystemDetailRow - Row for detailed system info
const SystemDetailRow = ({ label, value, status = 'nominal' }: SystemDetailRowProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'critical': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'offline': return theme.colors.textSecondary;
      default: return theme.colors.success;
    }
  };

  return (
    <div className="flex justify-between items-center mb-2 py-1 border-b border-gray-800">
      <span style={{ color: theme.colors.textSecondary }}>{label}</span>
      <span style={{ color: getStatusColor() }}>{value}</span>
    </div>
  );
};

// Component 28: PowerControlSlider - Slider for adjusting power
const PowerControlSlider = ({ system, value, onChange }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span style={{ color: theme.colors.textSecondary }}>{system}</span>
      <span style={{ color: theme.colors.textPrimary }}>{value}%</span>
    </div>
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full"
      style={{
        // Custom slider styling
        accentColor: theme.colors.success,
      }}
    />
  </div>
);

// Component 29: SystemDetailsPanel - Shows detailed info for selected system
const SystemDetailsPanel = ({ system, details, powerAllocation, onPowerChange }) => (
  <Panel>
    <PanelHeader title={`${system} DETAILS`} />
    <div className="p-4">
      {Object.entries(details).map(([key, value]) => (
        <SystemDetailRow key={key} label={key} value={value} />
      ))}
      
      <div className="mt-4">
        <PowerControlSlider 
          system={system} 
          value={powerAllocation} 
          onChange={onPowerChange} 
        />
      </div>
    </div>
  </Panel>
);

// Component 30: ImpulsePowerIndicator - Shows impulse power levels
const ImpulsePowerIndicator = ({ powerLevels }) => {
  const max = Math.max(...powerLevels);
  
  return (
    <Panel>
      <PanelHeader title="IMPULSE POWER" />
      <div className="p-2 h-40">
        <div className="h-full flex items-end">
          {powerLevels.map((level, index) => (
            <div 
              key={index}
              className="w-2 mx-1 rounded-t"
              style={{ 
                height: `${(level / max) * 100}%`,
                backgroundColor: level > 0.05 ? theme.colors.accent : theme.colors.textSecondary,
              }}
            />
          ))}
        </div>
      </div>
    </Panel>
  );
};

// Component 31: useMockData - Custom hook for generating mock data
const useMockData = () => {
  const [systemStatuses, setSystemStatuses] = useState([
    { name: 'Propulsion', percentage: 92, status: 'nominal' },
    { name: 'Navigation', percentage: 93, status: 'nominal' },
    { name: 'Life Support', percentage: 94, status: 'nominal' },
    { name: 'Defense', percentage: 78, status: 'warning' },
    { name: 'Communications', percentage: 86, status: 'warning' },
    { name: 'Power', percentage: 92, status: 'nominal' },
  ]);
  
  const [alerts, setAlerts] = useState([
    { 
      message: 'Defense fluctuation detected', 
      level: 'warning',
      timestamp: new Date() 
    },
    { 
      message: 'Minor Communications calibration needed', 
      level: 'warning',
      timestamp: new Date() 
    },
    { 
      message: 'DROPPING TO IMPULSE', 
      level: 'info',
      timestamp: new Date() 
    },
  ]);
  
  const [logs, setLogs] = useState([
    { message: 'Systems initialized', timestamp: new Date(Date.now() - 60000 * 10) },
    { message: 'Warp drive online', timestamp: new Date(Date.now() - 60000 * 8) },
    { message: 'Encryption key updated', timestamp: new Date(Date.now() - 60000 * 6) },
    { message: 'Course set to Alpha Centauri', timestamp: new Date(Date.now() - 60000 * 4) },
    { message: 'Data received from starbase', timestamp: new Date(Date.now() - 60000 * 2) },
  ]);
  
  const [navigation, setNavigation] = useState({
    heading: 128,
    pitch: -7,
    roll: 7,
    altitude: 9671,
    velocity: 14008,
  });
  
  const [targets, setTargets] = useState([
    { id: 'TGT-1', distance: 185, status: 'LOCKED' },
    { id: 'TGT-2', distance: 892, status: 'TRACKING' },
    { id: 'TGT-3', distance: 113, status: 'TRACKING' },
  ]);
  
  const [powerDetails, setPowerDetails] = useState({
    health: 92,
    efficiency: 77,
    powerDraw: 62,
    outputHistory: Array(30).fill(0).map(() => Math.random() * 30 + 70),
  });
  
  const [powerDistribution, setPowerDistribution] = useState({
    sources: {
      'TOTAL': 75,
      'QUANTUM': 82,
      'FUSION': 80,
      'BACKUP': 10,
    },
    grid: [
      [true, true, true, true, true],
      [true, true, true, true, true],
      [true, true, true, false, false],
      [true, true, false, false, false],
    ],
  });
  
  const [driveStatus, setDriveStatus] = useState({
    status: 'active',
    integrity: 100,
  });
  
  const [impulsePowerLevels, setImpulsePowerLevels] = useState(
    Array(15).fill(0).map((_, i) => 0.1 - (i * 0.01))
  );
  
  const [planetPosition, setPlanetPosition] = useState({ x: 0, y: 0 });
  const [activeSystem, setActiveSystem] = useState('Propulsion');
  
  // Update planet position periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setPlanetPosition({
        x: Math.sin(Date.now() / 10000) * 20,
        y: Math.cos(Date.now() / 10000) * 10,
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  // Add periodic log entries
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => [
        { message: `System scan complete - ${new Date().toLocaleTimeString()}`, timestamp: new Date() },
        ...prev.slice(0, 9) // Keep only last 10 entries
      ]);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Update power levels
  useEffect(() => {
    const interval = setInterval(() => {
      setPowerDetails(prev => ({
        ...prev,
        outputHistory: [
          ...prev.outputHistory.slice(1),
          Math.random() * 30 + 70
        ]
      }));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Simulate random system fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatuses(prev => 
        prev.map(system => ({
          ...system,
          percentage: Math.min(100, Math.max(50, 
            system.percentage + (Math.random() < 0.7 ? 0 : Math.random() < 0.5 ? -1 : 1)
          ))
        }))
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Return all the state and update functions
  return {
    systemStatuses,
    alerts,
    logs,
    navigation,
    targets,
    powerDetails,
    powerDistribution,
    driveStatus,
    impulsePowerLevels,
    planetPosition,
    activeSystem,
    setActiveSystem,
    
    // Additional action functions
    engageWarpDrive: () => {
      setAlerts(prev => [
        { message: 'INITIATING WARP SEQUENCE', level: 'info', timestamp: new Date() },
        ...prev
      ]);
      setLogs(prev => [
        { message: 'Warp drive engaged', timestamp: new Date() },
        ...prev
      ]);
    },
    
    scanObject: () => {
      setAlerts(prev => [
        { message: 'SCANNING NEAREST OBJECT', level: 'info', timestamp: new Date() },
        ...prev
      ]);
      setLogs(prev => [
        { message: 'Scan initiated', timestamp: new Date() },
        ...prev
      ]);
      
      // Add a new target after scan
      setTimeout(() => {
        const newTarget = { 
          id: `TGT-${Math.floor(Math.random() * 900) + 100}`, 
          distance: Math.floor(Math.random() * 1000) + 100,
          status: 'TRACKING'
        };
        
        setTargets(prev => [newTarget, ...prev]);
        
        setLogs(prev => [
          { message: `New object detected: ${newTarget.id}`, timestamp: new Date() },
          ...prev
        ]);
      }, 2000);
    },
    
    activateShields: () => {
      setAlerts(prev => [
        { message: 'SHIELDS ACTIVATED', level: 'info', timestamp: new Date() },
        ...prev
      ]);
      setLogs(prev => [
        { message: 'Shield generators online', timestamp: new Date() },
        ...prev
      ]);
      
      // Update defense status
      setSystemStatuses(prev => prev.map(system => 
        system.name === 'Defense' 
          ? { ...system, percentage: Math.min(100, system.percentage + 10), status: 'nominal' } 
          : system
      ));
    },
  };
};

// Component 32: SystemIcon - Displays an icon for each system type
const SystemIcon = ({ systemName }) => {
  const getIcon = () => {
    switch (systemName) {
      case 'Propulsion': return '🚀';
      case 'Navigation': return '🧭';
      case 'Life Support': return '🫁';
      case 'Defense': return '🛡️';
      case 'Communications': return '📡';
      case 'Power': return '⚡';
      default: return '🔧';
    }
  };
  
  return (
    <div className="w-6 h-6 flex items-center justify-center mr-2" style={{ color: theme.colors.textPrimary }}>
      {getIcon()}
    </div>
  );
};

// Component 33: SystemStatsLabel - Displays a key stat for a system
const SystemStatsLabel = ({ systemName, value, unit = '%' }) => {
  const getKey = () => {
    switch (systemName) {
      case 'Propulsion': return 'Thrust';
      case 'Navigation': return 'Accuracy';
      case 'Life Support': return 'Oxygen';
      case 'Defense': return 'Strength';
      case 'Communications': return 'Signal';
      case 'Power': return 'Output';
      default: return 'Status';
    }
  };
  
  return (
    <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
      {getKey()}: {value}{unit}
    </div>
  );
};

// Component 34: SystemIconWithStatus - Combined icon and status indicator
const SystemIconWithStatus = ({ system }) => (
  <div className="flex items-center">
    <SystemIcon systemName={system.name} />
    <div>
      <div style={{ color: theme.colors.textPrimary }}>{system.name}</div>
      <SystemStatsLabel systemName={system.name} value={system.percentage} />
    </div>
    <AlertIndicator system={system.name} isActive={system.status === 'warning' || system.status === 'critical'} />
  </div>
);

// Component 35: TimeDisplay - Shows current stardate/time
const TimeDisplay = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Create a fictional stardate
  const stardate = `${time.getFullYear() - 1900}.${(time.getMonth() + 1) * 100 + time.getDate()}`;
  
  return (
    <div className="text-right pr-3 py-1" style={{ color: theme.colors.textSecondary }}>
      <div>STARDATE {stardate}</div>
      <div>{time.toLocaleTimeString()}</div>
    </div>
  );
};

// Component 36: NavCoordinates - Shows ship coordinates
const NavCoordinates = () => {
  // Generate random "space coordinates"
  const coordinates = {
    x: (Math.random() * 200 - 100).toFixed(3),
    y: (Math.random() * 200 - 100).toFixed(3),
    z: (Math.random() * 200 - 100).toFixed(3),
    sector: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 100)}`
  };
  
  return (
    <div className="p-3" style={{ color: theme.colors.textSecondary }}>
      <div className="text-xs mb-1">COORDINATES</div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
        <div>X: {coordinates.x}</div>
        <div>Y: {coordinates.y}</div>
        <div>Z: {coordinates.z}</div>
        <div>SECTOR: {coordinates.sector}</div>
      </div>
    </div>
  );
};

// Component 37: NotificationBadge - Shows number of notifications
const NotificationBadge = ({ count }) => (
  count > 0 ? (
    <div 
      className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
      style={{ 
        backgroundColor: theme.colors.error,
        color: 'white',
      }}
    >
      {count}
    </div>
  ) : null
);

// Component 38: PowerFlowDiagram - Visualizes power flow between systems
const PowerFlowDiagram = () => {
  return (
    <div className="p-3">
      <div className="text-xs mb-2" style={{ color: theme.colors.textSecondary }}>
        POWER FLOW DIAGRAM
      </div>
      <svg width="100%" height="150" viewBox="0 0 300 150">
        {/* Core power node */}
        <circle cx="150" cy="75" r="20" fill="#2a4a6a" stroke={theme.colors.success} strokeWidth="2" />
        <text x="150" y="80" textAnchor="middle" fill={theme.colors.textPrimary} fontSize="12">CORE</text>
        
        {/* System nodes */}
        <circle cx="50" cy="40" r="15" fill="#1a3a5a" stroke={theme.colors.success} strokeWidth="1" />
        <text x="50" y="45" textAnchor="middle" fill={theme.colors.textPrimary} fontSize="10">NAV</text>
        
        <circle cx="50" cy="110" r="15" fill="#1a3a5a" stroke={theme.colors.success} strokeWidth="1" />
        <text x="50" y="115" textAnchor="middle" fill={theme.colors.textPrimary} fontSize="10">LIFE</text>
        
        <circle cx="250" cy="40" r="15" fill="#1a3a5a" stroke={theme.colors.success} strokeWidth="1" />
        <text x="250" y="45" textAnchor="middle" fill={theme.colors.textPrimary} fontSize="10">DEF</text>
        
        <circle cx="250" cy="110" r="15" fill="#1a3a5a" stroke={theme.colors.success} strokeWidth="1" />
        <text x="250" y="115" textAnchor="middle" fill={theme.colors.textPrimary} fontSize="10">COM</text>
        
        <circle cx="150" cy="25" r="15" fill="#1a3a5a" stroke={theme.colors.warning} strokeWidth="1" />
        <text x="150" y="30" textAnchor="middle" fill={theme.colors.textPrimary} fontSize="10">PROP</text>
        
        {/* Connection lines */}
        <line x1="132" y1="65" x2="60" y2="48" stroke={theme.colors.success} strokeWidth="2" />
        <line x1="132" y1="85" x2="60" y2="102" stroke={theme.colors.success} strokeWidth="2" />
        <line x1="168" y1="65" x2="240" y2="48" stroke={theme.colors.success} strokeWidth="2" />
        <line x1="168" y1="85" x2="240" y2="102" stroke={theme.colors.success} strokeWidth="2" />
        <line x1="150" y1="55" x2="150" y2="40" stroke={theme.colors.warning} strokeWidth="3" />
        
        {/* Power flow indicators */}
        <circle cx="90" cy="55" r="3" fill={theme.colors.success}>
          <animate attributeName="cx" from="132" to="60" dur="3s" repeatCount="indefinite" />
          <animate attributeName="cy" from="65" to="48" dur="3s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="90" cy="95" r="3" fill={theme.colors.success}>
          <animate attributeName="cx" from="132" to="60" dur="4s" repeatCount="indefinite" />
          <animate attributeName="cy" from="85" to="102" dur="4s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="210" cy="55" r="3" fill={theme.colors.success}>
          <animate attributeName="cx" from="168" to="240" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="cy" from="65" to="48" dur="3.5s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="210" cy="95" r="3" fill={theme.colors.success}>
          <animate attributeName="cx" from="168" to="240" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="cy" from="85" to="102" dur="4.5s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="150" cy="45" r="3" fill={theme.colors.warning}>
          <animate attributeName="cy" from="55" to="40" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};

// Component 39: ShipStatusSummary - Quick overview of ship status
const ShipStatusSummary = ({ 
  integrity, 
  fuelLevel, 
  alertCount, 
  warpStatus 
}) => (
  <div className="p-3 border-t border-gray-800">
    <div className="flex justify-between items-center mb-2">
      <span style={{ color: theme.colors.textSecondary }}>INTEGRITY:</span>
      <span style={{ color: theme.colors.success }}>{integrity}%</span>
    </div>
    <div className="flex justify-between items-center mb-2">
      <span style={{ color: theme.colors.textSecondary }}>FUEL:</span>
      <span style={{ color: theme.colors.warning }}>{fuelLevel}%</span>
    </div>
    <div className="flex justify-between items-center mb-2">
      <span style={{ color: theme.colors.textSecondary }}>ALERTS:</span>
      <div className="flex items-center">
        <span style={{ color: alertCount > 0 ? theme.colors.error : theme.colors.success }}>
          {alertCount}
        </span>
        <NotificationBadge count={alertCount} />
      </div>
    </div>
    <div className="flex justify-between items-center">
      <span style={{ color: theme.colors.textSecondary }}>WARP:</span>
      <span style={{ color: warpStatus === 'READY' ? theme.colors.success : theme.colors.textSecondary }}>
        {warpStatus}
      </span>
    </div>
  </div>
);

// Component 40: NavigationTarget - Shows current destination
const NavigationTarget = ({ destination, eta }) => (
  <div className="p-3 border-t border-gray-800">
    <div className="text-xs mb-1" style={{ color: theme.colors.textSecondary }}>
      CURRENT DESTINATION
    </div>
    <div style={{ color: theme.colors.textPrimary }}>
      {destination}
    </div>
    <div className="text-xs" style={{ color: theme.colors.warning }}>
      ETA: {eta}
    </div>
  </div>
);

// Component: 41 RadarBlip - Individual blip on radar
const RadarBlip = ({ distance, angle, size = 4, type = 'neutral' }) => {
  const getColor = () => {
    switch (type) {
      case 'hostile': return theme.colors.error;
      case 'friendly': return theme.colors.success;
      case 'anomaly': return theme.colors.warning;
      default: return theme.colors.accent;
    }
  };
  
  // Convert polar to cartesian coordinates
  const radius = 100; // radar radius
  const x = 100 + (distance / 100) * radius * Math.cos(angle * Math.PI / 180);
  const y = 100 + (distance / 100) * radius * Math.sin(angle * Math.PI / 180);
  
  return (
    <circle 
      cx={x} 
      cy={y} 
      r={size} 
      fill={getColor()} 
    >
      {/* Pulsating animation for blips */}
      <animate 
        attributeName="opacity" 
        values="1;0.3;1" 
        dur="2s" 
        repeatCount="indefinite" 
      />
    </circle>
  );
};

// Component 42: RadarDisplay - Shows nearby objects
const RadarDisplay = ({ objects }: RadarDisplayProps) => (
  <Panel>
    <PanelHeader title="RADAR DISPLAY" />
    <div className="p-4 flex-1">
      <div className="relative w-full h-full">
        {objects.map((object, index) => (
          <RadarBlip
            key={index}
            distance={object.distance}
            angle={object.angle}
            type={object.type}
            size={object.size}
          />
        ))}
      </div>
    </div>
  </Panel>
);

// Component 43: SensorReadings - Shows environmental readings
const SensorReadings = () => {
  // Generate random sensor data
  const sensorData = {
    temperature: (Math.random() * 100 - 50).toFixed(1),
    radiation: (Math.random() * 10).toFixed(2),
    gravity: (Math.random() * 2).toFixed(2),
    pressure: (Math.random() * 3 + 0.1).toFixed(2),
  };
  
  return (
    <div className="p-3 border-t border-gray-800">
      <div className="text-xs mb-1" style={{ color: theme.colors.textSecondary }}>
        EXTERNAL SENSORS
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex justify-between">
          <span style={{ color: theme.colors.textSecondary }}>TEMP:</span>
          <span style={{ color: theme.colors.textPrimary }}>{sensorData.temperature}°C</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: theme.colors.textSecondary }}>RAD:</span>
          <span style={{ color: theme.colors.textPrimary }}>{sensorData.radiation} mSv</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: theme.colors.textSecondary }}>GRAV:</span>
          <span style={{ color: theme.colors.textPrimary }}>{sensorData.gravity} G</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: theme.colors.textSecondary }}>PRES:</span>
          <span style={{ color: theme.colors.textPrimary }}>{sensorData.pressure} atm</span>
        </div>
      </div>
    </div>
  );
};

// Component 44: CrewStatus - Shows crew status
const CrewStatus = ({ crewCount, crewHealth, awakePercentage }: CrewStatusProps) => (
  <Panel>
    <PanelHeader title="CREW STATUS" />
    <div className="p-4 flex-1">
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-[#00ff00]">Crew Count:</span>
          <span className="text-white">{crewCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#00ff00]">Crew Health:</span>
          <span className="text-white">{crewHealth}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#00ff00]">Awake Percentage:</span>
          <span className="text-white">{awakePercentage}%</span>
        </div>
      </div>
    </div>
  </Panel>
);

// Component 45: ResourceDisplay - Shows ship resources
const ResourceDisplay = ({ resources }: ResourceDisplayProps) => (
  <Panel>
    <PanelHeader title="RESOURCE DISPLAY" />
    <div className="p-4 flex-1">
      <div className="space-y-4">
        {Object.entries(resources).map(([name, resource]) => (
          <div key={name} className="flex justify-between">
            <span className="text-[#00ff00]">{name}:</span>
            <span className="text-white">
              {resource.amount}/{resource.capacity}
            </span>
          </div>
        ))}
      </div>
    </div>
  </Panel>
);

// Component 46: MaintenanceStatus - Shows maintenance tasks
const MaintenanceStatus = ({ tasks }: MaintenanceStatusProps) => (
  <Panel>
    <PanelHeader title="MAINTENANCE STATUS" />
    <div className="p-4 flex-1">
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div
            key={index}
            className={`p-2 rounded ${
              task.urgent ? 'bg-red-500' : 'bg-[#1a1a1a]'
            } text-white`}
          >
            <div className="flex justify-between">
              <span>{task.name}</span>
              <span>{task.eta}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Panel>
);

// Component 47: LifeSupportDetails - Shows life support status
const LifeSupportDetails = ({ oxygen, temperature, pressure }: LifeSupportDetailsProps) => (
  <Panel>
    <PanelHeader title="LIFE SUPPORT DETAILS" />
    <div className="p-4 flex-1">
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-[#00ff00]">Oxygen Level:</span>
          <span className="text-white">{oxygen}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#00ff00]">Temperature:</span>
          <span className="text-white">{temperature}°C</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#00ff00]">Pressure:</span>
          <span className="text-white">{pressure} kPa</span>
        </div>
      </div>
    </div>
  </Panel>
);

// Component 48: StarfieldBackground - Animated starfield background
const StarfieldBackground = ({ starCount = 100 }) => {
  // Generate random stars
  const stars = Array(starCount).fill(0).map((_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.5,
    speed: Math.random() * 3 + 1,
  }));
  
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: -1 }}>
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: 'white',
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size}px white`,
            animation: `twinkle ${star.speed}s infinite alternate`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: ${stars[0].opacity}; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

// Component 49: NotificationOverlay - Shows important notifications
const NotificationOverlay = ({ notifications, onDismiss }: NotificationOverlayProps) => (
  <div className="fixed top-4 right-4 space-y-4 z-50">
    {notifications.map((notification, index) => (
      <div
        key={index}
        className={`p-4 rounded shadow-lg ${
          notification.level === 'critical'
            ? 'bg-red-500'
            : 'bg-yellow-500'
        } text-white`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold">{notification.title}</h3>
            <p>{notification.message}</p>
          </div>
          <button
            onClick={onDismiss}
            className="ml-4 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      </div>
    ))}
  </div>
);

// Component 50: ThreeJSBackground - 3D animated background using Three.js
const ThreeJSBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: theme.colors.accent,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Animation
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0001;
        particlesRef.current.rotation.x += 0.0001;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      scene.remove(particles);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: -1 }}
    />
  );
};

// Component 51: InteractivePortfolioView - Main 3D portfolio interface
const InteractivePortfolioView = () => {
  const [activeSection, setActiveSection] = useState('expertise');
  const [activeExpertise, setActiveExpertise] = useState<string | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'processing'>('idle');
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Mock portfolio data
  const portfolioData = {
    projects: [
      {
        id: 'project-1',
        title: 'Neural Interface Design',
        description: 'Advanced brain-computer interface with real-time feedback',
        technologies: ['React', 'Three.js', 'TensorFlow'],
        image: '/projects/neural-interface.jpg',
        demo: 'https://demo.neural-interface.com',
        github: 'https://github.com/username/neural-interface'
      },
      {
        id: 'project-2',
        title: 'Quantum Visualization',
        description: 'Interactive 3D visualization of quantum computing concepts',
        technologies: ['React', 'Three.js', 'WebGL'],
        image: '/projects/quantum-viz.jpg',
        demo: 'https://demo.quantum-viz.com',
        github: 'https://github.com/username/quantum-viz'
      }
    ],
    skills: [
      { name: 'UI/UX Design', level: 95 },
      { name: '3D Modeling', level: 90 },
      { name: 'Frontend Development', level: 85 },
      { name: 'AI/ML', level: 80 }
    ],
    experience: [
      {
        company: 'Tech Innovations Inc.',
        role: 'Senior Design Engineer',
        period: '2020-2023',
        description: 'Led design team in creating next-gen interfaces'
      }
    ]
  };

  // Voice control setup
  useEffect(() => {
    if (isVoiceEnabled) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onstart = () => {
          setVoiceStatus('listening');
          showVoicePrompt();
        };
        
        recognitionRef.current.onresult = (event) => {
          const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
          setLastCommand(command);
          setVoiceStatus('processing');
          handleVoiceCommand(command);
        };
        
        recognitionRef.current.onend = () => {
          setVoiceStatus('idle');
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setVoiceStatus('idle');
        };
        
        recognitionRef.current.start();
        return () => {
          recognitionRef.current?.stop();
        };
      }
    }
  }, [isVoiceEnabled]);

  const showVoicePrompt = () => {
    const prompt = document.createElement('div');
    prompt.className = 'fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50';
    prompt.style.backgroundColor = theme.colors.panelBackground;
    prompt.style.border = theme.borders.panel;
    prompt.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
        <span style="color: ${theme.colors.textPrimary}">Listening...</span>
      </div>
      <div class="mt-2 text-sm" style="color: ${theme.colors.textSecondary}">
        Try saying "help" for available commands
      </div>
    `;
    document.body.appendChild(prompt);
    setTimeout(() => prompt.remove(), 3000);
  };

  const handleVoiceCommand = (command: string) => {
    if (command.includes('help')) {
      setShowVoiceHelp(true);
      return;
    }
    
    if (command.includes('stop listening')) {
      setIsVoiceEnabled(false);
      return;
    }
    
    // Navigation commands
    if (command.includes('show expertise')) {
      setActiveSection('expertise');
      setActiveExpertise(null); // Reset active expertise when showing main expertise page
    }
    if (command.includes('show education')) {
      setActiveSection('education');
      setActiveExpertise(null);
    }
    if (command.includes('show projects')) {
      setActiveSection('projects');
      setActiveExpertise(null);
    }
    if (command.includes('show skills')) {
      setActiveSection('skills');
      setActiveExpertise(null);
    }
    
    // Expertise area commands
    if (command.includes('show instructional design')) {
      setActiveSection('expertise');
      setActiveExpertise('isd');
    }
    if (command.includes('show artificial intelligence')) {
      setActiveSection('expertise');
      setActiveExpertise('ai');
    }
    if (command.includes('show data science')) {
      setActiveSection('expertise');
      setActiveExpertise('data-science');
    }
    if (command.includes('show machine learning')) {
      setActiveSection('expertise');
      setActiveExpertise('ml');
    }
    if (command.includes('show full stack')) {
      setActiveSection('expertise');
      setActiveExpertise('fullstack');
    }
    
    // Project and skill commands
    if (command.includes('show projects in')) {
      const area = command.split('show projects in')[1].trim();
      const expertise = EXPERTISE_AREAS.find(e => 
        e.name.toLowerCase().includes(area.toLowerCase())
      );
      if (expertise) {
        setActiveSection('projects');
        setActiveExpertise(expertise.id);
      }
    }
    
    if (command.includes('show skills in')) {
      const area = command.split('show skills in')[1].trim();
      const expertise = EXPERTISE_AREAS.find(e => 
        e.name.toLowerCase().includes(area.toLowerCase())
      );
      if (expertise) {
        setActiveSection('skills');
        setActiveExpertise(expertise.id);
      }
    }
    
    // Search commands
    if (command.includes('search for')) {
      const query = command.split('search for')[1].trim();
      setSearchQuery(query);
      performSearch(query);
    }
    
    if (command.includes('search in')) {
      const [_, area, query] = command.split('search in');
      const expertise = EXPERTISE_AREAS.find(e => 
        e.name.toLowerCase().includes(area.toLowerCase())
      );
      if (expertise) {
        setActiveExpertise(expertise.id);
        performSearch(query.trim(), expertise.id);
      }
    }
  };

  const performSearch = async (query, expertiseId?) => {
    setIsSearching(true);
    // Simulate AI-powered search
    const results = await new Promise(resolve => 
      setTimeout(() => {
        resolve(EXPERTISE_AREAS.find(e => e.id === expertiseId)?.projects.filter(project => 
          project.title.toLowerCase().includes(query.toLowerCase()) ||
          project.description.toLowerCase().includes(query.toLowerCase())
        ) || portfolioData.projects.filter(project => 
          project.title.toLowerCase().includes(query.toLowerCase()) ||
          project.description.toLowerCase().includes(query.toLowerCase())
        ));
      }, 500)
    );
    setSearchResults(results);
    setIsSearching(false);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 3D Background */}
      <ThreeJSBackground />

      {/* Main Content */}
      <div className="relative z-10 h-full flex">
        {/* Sidebar Navigation */}
        <div className="w-64 p-4" style={{ 
          backgroundColor: theme.colors.panelBackground,
          backdropFilter: 'blur(10px)',
          borderRight: theme.borders.panel
        }}>
          <div className="mb-8">
            <h1 className="text-2xl font-bold" style={{ color: theme.colors.textPrimary }}>
              Design Engineer
            </h1>
            <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
              Creating the future of human-computer interaction
            </p>
          </div>

          <nav className="space-y-2">
            {['expertise', 'education', 'projects', 'skills'].map(section => (
              <button
                key={section}
                className={`w-full text-left px-4 py-2 rounded transition-all ${
                  activeSection === section 
                    ? 'shadow-inner bg-opacity-20' 
                    : 'hover:bg-white hover:bg-opacity-5'
                }`}
                style={{ 
                  color: theme.colors.textPrimary,
                  backgroundColor: activeSection === section 
                    ? theme.colors.glass
                    : 'transparent',
                  border: activeSection === section 
                    ? `1px solid ${theme.colors.accent}`
                    : 'none',
                  transform: activeSection === section ? 'translateY(1px)' : 'none'
                }}
                onClick={() => {
                  setActiveSection(section);
                  setActiveExpertise(null); // Reset active expertise when switching tabs
                }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </nav>

          <div className="mt-8">
            <button
              className={`w-full px-4 py-2 rounded flex items-center justify-center space-x-2 ${
                isVoiceEnabled ? 'bg-white bg-opacity-10' : ''
              }`}
              style={{ color: theme.colors.textPrimary }}
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            >
              <span>🎤</span>
              <span>{isVoiceEnabled ? 'Voice Control Active' : 'Enable Voice Control'}</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          {/* Voice Status Indicator */}
          {isVoiceEnabled && (
            <div className="fixed top-4 right-4 px-3 py-1.5 rounded-full shadow-lg z-50 flex items-center space-x-2"
              style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
              <div className={`w-2 h-2 rounded-full ${
                voiceStatus === 'listening' ? 'bg-red-500 animate-pulse' :
                voiceStatus === 'processing' ? 'bg-yellow-500' :
                'bg-green-500'
              }`} />
              <span className="text-xs" style={{ color: theme.colors.textPrimary }}>
                {voiceStatus === 'listening' ? 'Listening' :
                 voiceStatus === 'processing' ? 'Processing' :
                 'Voice Active'}
              </span>
            </div>
          )}

          {/* Breadcrumbs */}
          <Breadcrumbs 
            activeSection={activeSection} 
            activeExpertise={activeExpertise}
            setActiveExpertise={setActiveExpertise}
          />

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-wide" style={{ color: theme.colors.textPrimary }}>
              {activeSection === 'expertise' ? '' :
               activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
            <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
              {activeSection === 'expertise' ? '' :
               activeSection === 'education' ? 'Academic background and certifications' :
               activeSection === 'projects' ? 'Featured projects and work' :
               'Technical skills and proficiencies'}
            </p>
          </div>

          {/* Content Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSection === 'expertise' && (
              activeExpertise ? (
                // Show specific expertise area
                EXPERTISE_AREAS.find(e => e.id === activeExpertise) && (
                  <div className="col-span-full">
                    {/* Page Title */}
                    <div className="mb-8">
                      <h1 className="text-2xl font-bold tracking-wide" style={{ color: theme.colors.textPrimary }}>
                        {EXPERTISE_AREAS.find(e => e.id === activeExpertise)?.name}
                      </h1>
                      <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                        {EXPERTISE_AREAS.find(e => e.id === activeExpertise)?.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-8">
                      <button
                        onClick={() => setActiveExpertise(null)}
                        className="px-3 py-1 rounded flex items-center"
                        style={{ 
                          backgroundColor: theme.colors.glass,
                          border: theme.borders.panel,
                          color: theme.colors.textPrimary
                        }}
                      >
                        <span className="mr-2">←</span>
                        Back
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const currentIndex = EXPERTISE_AREAS.findIndex(e => e.id === activeExpertise);
                            const prevIndex = currentIndex === 0 ? EXPERTISE_AREAS.length - 1 : currentIndex - 1;
                            setActiveExpertise(EXPERTISE_AREAS[prevIndex].id);
                          }}
                          className="px-3 py-1 rounded flex items-center"
                          style={{ 
                            backgroundColor: theme.colors.glass,
                            border: theme.borders.panel,
                            color: theme.colors.textPrimary
                          }}
                        >
                          <span className="mr-2">←</span>
                          Previous
                        </button>
                        <button
                          onClick={() => {
                            const currentIndex = EXPERTISE_AREAS.findIndex(e => e.id === activeExpertise);
                            const nextIndex = currentIndex === EXPERTISE_AREAS.length - 1 ? 0 : currentIndex + 1;
                            setActiveExpertise(EXPERTISE_AREAS[nextIndex].id);
                          }}
                          className="px-3 py-1 rounded flex items-center"
                          style={{ 
                            backgroundColor: theme.colors.glass,
                            border: theme.borders.panel,
                            color: theme.colors.textPrimary
                          }}
                        >
                          Next
                          <span className="ml-2">→</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Skills */}
                      <div>
                        <h3 className="text-xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                          Skills
                        </h3>
                        <div className="space-y-2">
                          {EXPERTISE_AREAS.find(e => e.id === activeExpertise)?.skills.map(skill => (
                            <div
                              key={skill}
                              className="p-3 rounded-lg"
                              style={{ 
                                backgroundColor: theme.colors.panelBackground,
                                border: theme.borders.panel
                              }}
                            >
                              <span style={{ color: theme.colors.textPrimary }}>{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Projects */}
                      <div>
                        <h3 className="text-xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                          Projects
                        </h3>
                        <div className="space-y-4">
                          {EXPERTISE_AREAS.find(e => e.id === activeExpertise)?.projects.map(project => (
                            <div
                              key={project.title}
                              className="p-4 rounded-lg"
                              style={{ 
                                backgroundColor: theme.colors.panelBackground,
                                border: theme.borders.panel
                              }}
                            >
                              <h4 className="text-lg font-bold mb-2" style={{ color: theme.colors.textPrimary }}>
                                {project.title}
                              </h4>
                              <p className="text-sm mb-4" style={{ color: theme.colors.textSecondary }}>
                                {project.description}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {project.technologies.map(tech => (
                                  <span
                                    key={tech}
                                    className="px-2 py-1 rounded text-xs"
                                    style={{ 
                                      backgroundColor: theme.colors.glass,
                                      color: theme.colors.textPrimary
                                    }}
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                // Show all expertise areas
                EXPERTISE_AREAS.map(area => (
                  <div
                    key={area.id}
                    className="p-6 rounded-lg cursor-pointer transition-all hover:scale-105"
                    style={{ 
                      backgroundColor: theme.colors.panelBackground,
                      border: theme.borders.panel
                    }}
                    onClick={() => setActiveExpertise(area.id)}
                  >
                    <h3 className="text-xl font-bold mb-2" style={{ color: theme.colors.textPrimary }}>
                      {area.name}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: theme.colors.textSecondary }}>
                      {area.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {area.skills.slice(0, 3).map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-1 rounded text-xs"
                          style={{ 
                            backgroundColor: theme.colors.glass,
                            color: theme.colors.textPrimary
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )
            )}

            {activeSection === 'education' && (
              <div className="col-span-full">
                <h2 className="text-2xl font-bold tracking-wide mb-8" style={{ color: theme.colors.textPrimary }}>
                  Education & Certifications
                </h2>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2" style={{ color: theme.colors.textPrimary }}>
                    {EDUCATION.degree}
                  </h3>
                  <p className="text-lg mb-1" style={{ color: theme.colors.accent }}>
                    {EDUCATION.institution}
                  </p>
                  <p style={{ color: theme.colors.textSecondary }}>
                    {EDUCATION.year}
                  </p>
                </div>
                
                <h3 className="text-xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  Certifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {EDUCATION.certifications.map(cert => (
                    <div
                      key={cert.name}
                      className="p-4 rounded-lg"
                      style={{ 
                        backgroundColor: theme.colors.panelBackground,
                        border: theme.borders.panel
                      }}
                    >
                      <h4 className="text-lg font-bold mb-1" style={{ color: theme.colors.textPrimary }}>
                        {cert.name}
                      </h4>
                      <p className="text-sm mb-1" style={{ color: theme.colors.accent }}>
                        {cert.issuer}
                      </p>
                      <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                        {cert.date}
                        {cert.credentialId && ` • ID: ${cert.credentialId}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'projects' && (
              <>
                <div className="col-span-full mb-8">
                  <h2 className="text-2xl font-bold tracking-wide" style={{ color: theme.colors.textPrimary }}>
                    Projects
                  </h2>
                </div>
                {portfolioData.projects.map(project => (
                  <div
                    key={project.id}
                    className="group relative overflow-hidden rounded-lg"
                    style={{ 
                      backgroundColor: theme.colors.panelBackground,
                      backdropFilter: 'blur(10px)',
                      border: theme.borders.panel
                    }}
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2" style={{ color: theme.colors.textPrimary }}>
                        {project.title}
                      </h3>
                      <p className="text-sm mb-4" style={{ color: theme.colors.textSecondary }}>
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map(tech => (
                          <span
                            key={tech}
                            className="px-2 py-1 rounded text-xs"
                            style={{ 
                              backgroundColor: theme.colors.glass,
                              color: theme.colors.textPrimary
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-4">
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                          style={{ color: theme.colors.accent }}
                        >
                          Live Demo
                        </a>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                          style={{ color: theme.colors.accent }}
                        >
                          GitHub
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeSection === 'skills' && (
              <>
                <div className="col-span-full mb-8">
                  <h2 className="text-2xl font-bold tracking-wide" style={{ color: theme.colors.textPrimary }}>
                    Skills
                  </h2>
                </div>
                {portfolioData.skills.map(skill => (
                  <div
                    key={skill.name}
                    className="p-4 rounded-lg"
                    style={{ 
                      backgroundColor: theme.colors.panelBackground,
                      backdropFilter: 'blur(10px)',
                      border: theme.borders.panel
                    }}
                  >
                    <div className="flex justify-between mb-2">
                      <span style={{ color: theme.colors.textPrimary }}>{skill.name}</span>
                      <span style={{ color: theme.colors.textSecondary }}>{skill.level}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white bg-opacity-5">
                      <div
                        className="h-full rounded-full"
                        style={{ 
                          width: `${skill.level}%`,
                          backgroundColor: theme.colors.accent
                        }}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Update Breadcrumbs component
const Breadcrumbs = ({ activeSection, activeExpertise, setActiveExpertise }) => {
  const getBreadcrumbs = () => {
    const crumbs = [
      { label: 'Home', onClick: () => setActiveExpertise(null) }
    ];

    if (activeSection) {
      crumbs.push({
        label: activeSection.charAt(0).toUpperCase() + activeSection.slice(1),
        onClick: activeExpertise ? () => setActiveExpertise(null) : null
      });
    }

    if (activeExpertise) {
      const expertise = EXPERTISE_AREAS.find(e => e.id === activeExpertise);
      if (expertise) {
        crumbs.push({
          label: expertise.name,
          onClick: null
        });
      }
    }

    return crumbs;
  };

  return (
    <div className="flex items-center space-x-2 mb-6">
      {getBreadcrumbs().map((crumb, index) => (
        <div key={crumb.label} className="flex items-center">
          {index > 0 && (
            <span 
              className="mx-2"
              style={{ color: theme.colors.textSecondary }}
            >
              /
            </span>
          )}
          <span
            className={`${crumb.onClick ? 'cursor-pointer hover:opacity-80' : ''} transition-opacity duration-200`}
            style={{ 
              color: index === getBreadcrumbs().length - 1 
                ? theme.colors.textPrimary 
                : theme.colors.accent
            }}
            onClick={crumb.onClick}
          >
            {crumb.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// Component 52: StarshipControlPanel - Main application component that integrates everything
const StarshipControlPanel = () => {
  return <InteractivePortfolioView />;
};

export default StarshipControlPanel;