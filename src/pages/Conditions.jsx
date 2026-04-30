import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Stethoscope, BrainCircuit, HeartPulse, Activity } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function Conditions() {
  const [searchTerm, setSearchTerm] = useState('');

  const conditionData = [
    { 
      id: 'autism-spectrum-disorder',
      name: 'Autism Spectrum Disorder', 
      icon: BrainCircuit,
      category: 'Developmental',
      description: 'AI model detects unusual prosody, restricted intonation (flat affect), atypical pitch variability, and specific hesitation patterns that correlate with ASD indicators.',
      accuracy: 'High Reliability' 
    },
    { 
      id: 'asthma',
      name: 'Asthma', 
      icon: HeartPulse,
      category: 'Respiratory',
      description: 'Identifies wheezing, breathlessness, prolonged expiration phases, and chest congestion markers through vocal cord vibration analysis.',
      accuracy: 'Moderate' 
    },
    { 
      id: 'speech-delay',
      name: 'Speech Delay', 
      icon: Activity,
      category: 'Developmental',
      description: 'Analyzes vocabulary milestones, phonemic accuracy, and articulation errors typical for the child\'s chronological age.',
      accuracy: 'High Reliability' 
    },
    { 
      id: 'laryngitis',
      name: 'Laryngitis', 
      icon: Stethoscope,
      category: 'ENT',
      description: 'Measures increased vocal jitter and shimmer, breathiness, and overall hoarseness caused by vocal cord inflammation.',
      accuracy: 'High Reliability' 
    },
    { 
      id: 'hearing-loss',
      name: 'Hearing Loss', 
      icon: Activity,
      category: 'Developmental',
      description: 'Monitors atypical vocal volume, missing high-frequency consonant sounds (s, sh, f), and resonance issues.',
      accuracy: 'Moderate' 
    },
    { 
      id: 'respiratory-infections',
      name: 'Respiratory Infections', 
      icon: HeartPulse,
      category: 'Respiratory',
      description: 'Detects congestion and characteristic coughing acoustic profiles, distinguishing between dry and wet cough structures.',
      accuracy: 'Screening Only' 
    },
    { 
      id: 'adhd-markers',
      name: 'ADHD Markers', 
      icon: BrainCircuit,
      category: 'Developmental',
      description: 'Measures speech rate, impulsivity markers (interruptions), and pause frequency/duration irregularities.',
      accuracy: 'Moderate' 
    },
  ];

  const filtered = conditionData.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-display text-white mb-4">Condition Library</h1>
        <p className="text-text-muted mb-8">
          Learn about the acoustic biomarkers VocalVitals analyzes to detect early signs of various pediatric medical conditions.
        </p>

        <div className="relative max-w-md mx-auto">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text"
            placeholder="Search conditions..."
            className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((cond, i) => (
          <Link to={`/conditions/${cond.id}`} key={i} className="block group">
            <Card className="card-hover h-full flex flex-col cursor-pointer transition-transform group-hover:scale-[1.01] hover:border-primary/50">
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <cond.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <Badge variant="default" className="text-xs">{cond.category}</Badge>
                </div>
                
                <h3 className="text-xl font-medium text-white mb-2 group-hover:text-primary transition-colors">{cond.name}</h3>
                <p className="text-sm text-text-muted leading-relaxed flex-1 mb-6">
                  {cond.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className={`text-xs font-medium ${cond.accuracy.includes('High') ? 'text-primary' : (cond.accuracy.includes('Moderate') ? 'text-warning' : 'text-success')}`}>
                    {cond.accuracy}
                  </span>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
