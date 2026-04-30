import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, BrainCircuit, HeartPulse, Activity, Stethoscope, AlertTriangle, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

// Detailed encyclopedia data for conditions
const CONDITION_DETAILS = {
  'autism-spectrum-disorder': {
    name: 'Autism Spectrum Disorder',
    category: 'Developmental',
    icon: BrainCircuit,
    overview: 'Autism Spectrum Disorder (ASD) is a developmental disability caused by differences in the brain. Acoustic biomarker analysis focuses on identifying atypical speech patterns, known as atypical prosody, which is one of the earliest signs of ASD.',
    biomarkers: [
      { name: 'Pitch Variability', desc: 'Decreased fluctuation in pitch, often described as a "flat" or monotonous voice.' },
      { name: 'Rhythm & Timing', desc: 'Atypical pausing, prolonged syllables, or unusual speech pacing.' },
      { name: 'Voice Quality', desc: 'Instances of atypical phonation, including creaky voice or breathiness.' }
    ],
    symptoms: [
      'Delayed onset of babbling or speaking',
      'Difficulty with back-and-forth conversation',
      'Echolalia (repeating words or phrases)',
      'Atypical use of intonation to express emotion'
    ],
    protocol: 'If acoustic screening indicates a high probability of ASD markers, immediate referral to a developmental pediatrician and child psychologist is recommended for a comprehensive behavioral and clinical evaluation.',
    colorTag: 'primary'
  },
  'asthma': {
    name: 'Asthma',
    category: 'Respiratory',
    icon: HeartPulse,
    overview: 'Asthma is a chronic respiratory condition that inflames and narrows the airways. AI vocal screening detects micro-patterns in breath support and vocal cord vibration that correlate directly with airway restriction.',
    biomarkers: [
      { name: 'Inspiratory Wheeze', desc: 'High-frequency acoustic turbulence detected during inhalation phases.' },
      { name: 'Phonation Disruption', desc: 'Frequent micro-interruptions in vowel sustained sounds due to breathlessness.' },
      { name: 'Expiratory Prolongation', desc: 'Extended duration of exhalation compared to normal respiratory baseline.' }
    ],
    symptoms: [
      'Shortness of breath during normal activity',
      'Chest tightness or pain',
      'Wheezing when exhaling (especially in children)',
      'Trouble sleeping caused by shortness of breath'
    ],
    protocol: 'Seek medical evaluation from a pediatrician or pulmonologist. An inhaler or nebulizer treatment plan may be prescribed to manage airway inflammation.',
    colorTag: 'warning'
  },
  'speech-delay': {
    name: 'Speech Delay',
    category: 'Developmental',
    icon: Activity,
    overview: 'Speech delay occurs when a child’s speech development is slower than typical milestones. Our acoustic models analyze the phonetic complexity and spectral energy of early vocalizations.',
    biomarkers: [
      { name: 'Phonetic Diversity', desc: 'Reduced range of unique consonant-vowel combinations.' },
      { name: 'Formant Transitions', desc: 'Slower frequency shifts between vowels indicating motor planning issues.' },
      { name: 'Syllabic Rate', desc: 'Slower overall pace of syllable production.' }
    ],
    symptoms: [
      'Not babbling by 15 months',
      'Not talking by 2 years',
      'Difficulty putting words together into sentences by 3 years',
      'Leaving sounds off words (e.g., "tar" for "star")'
    ],
    protocol: 'A formal speech and language assessment by a licensed Speech-Language Pathologist (SLP) is highly recommended. Early intervention programs lead to significantly improved developmental trajectores.',
    colorTag: 'primary'
  },
  'laryngitis': {
    name: 'Laryngitis',
    category: 'ENT',
    icon: Stethoscope,
    overview: 'Laryngitis is the inflammation of the voice box (larynx) from overuse, irritation, or infection. Acoustic analysis is highly accurate at mapping the physical swelling of the vocal folds.',
    biomarkers: [
      { name: 'Jitter & Shimmer', desc: 'Elevated cycle-to-cycle variations in fundamental frequency and amplitude.' },
      { name: 'Harmonic-to-Noise Ratio (HNR)', desc: 'Decreased HNR indicating more "noise" (hoarseness) in the speech signal.' },
      { name: 'Fundamental Frequency (F0)', desc: 'Noticeable drop in baseline pitch due to increased mass of swollen vocal folds.' }
    ],
    symptoms: [
      'Hoarseness or loss of voice',
      'Tickling sensation or rawness in the throat',
      'Dry throat and dry cough',
      'Constant urge to clear the throat'
    ],
    protocol: 'Rest the voice completely, maintain hydration, and use a humidifier. If symptoms persist for more than 2 weeks, consult an ENT specialist to rule out serious vocal cord damage.',
    colorTag: 'warning'
  },
  'hearing-loss': {
    name: 'Hearing Loss',
    category: 'Developmental',
    icon: Activity,
    overview: 'In early childhood, undiagnosed hearing loss directly impacts speech production. Acoustic mapping can detect the indirect effects of hearing impairment on a child\'s outbound vocal structure.',
    biomarkers: [
      { name: 'High-Frequency Deletions', desc: 'Consistent absence or distortion of high-frequency fricatives (e.g., s, sh, f).' },
      { name: 'Resonance Atypicality', desc: 'Hypernasal or hyponasal speech qualities.' },
      { name: 'Volume Regulation', desc: 'Atypically loud or unusually soft baseline speaking volume.' }
    ],
    symptoms: [
      'Not startling at loud noises',
      'Not turning toward sound sources by 6 months',
      'Delayed or vague speech',
      'Frequently asking for repetition (in older children)'
    ],
    protocol: 'An immediate Comprehensive Audiological Evaluation by a certified Audiologist is required. Intervention may include hearing aids, cochlear implants, or specialized speech therapy.',
    colorTag: 'warning'
  },
  'respiratory-infections': {
    name: 'Respiratory Infections',
    category: 'Respiratory',
    icon: HeartPulse,
    overview: 'Viral or bacterial respiratory infections alter the acoustic properties of the vocal tract and induce characteristic coughing profiles.',
    biomarkers: [
      { name: 'Cough Acoustic Profile', desc: 'Spectral analysis differentiates between dry (irritation) and wet (mucus/congestion) cough impulses.' },
      { name: 'Nasalance', desc: 'Shifted acoustic energy ratios indicating upper respiratory tract blockage (stuffy nose).' }
    ],
    symptoms: [
      'Coughing and sneezing',
      'Nasal congestion or runny nose',
      'Fever or lethargy',
      'Sore throat'
    ],
    protocol: 'Ensure rest and hydration. Monitor for breathing difficulties or high fever. Consult a pediatrician if symptoms are severe or prolonged, especially to rule out pneumonia or RSV.',
    colorTag: 'success'
  },
  'adhd-markers': {
    name: 'ADHD Markers',
    category: 'Developmental',
    icon: BrainCircuit,
    overview: 'Attention-Deficit/Hyperactivity Disorder (ADHD) can manifest in distinct speech-language behaviors. Acoustic analysis tracks the timing and control aspects of conversational speech.',
    biomarkers: [
      { name: 'Pacing Instability', desc: 'Highly variable speech rate, often accelerating inappropriately.' },
      { name: 'Pause Anomalies', desc: 'Shorter inter-turn pauses (interrupting) or unusually long mid-sentence hesitation.' },
      { name: 'Phonatory Bursts', desc: 'Sudden, inappropriate spikes in vocal volume or intensity.' }
    ],
    symptoms: [
      'Frequent interruptions in conversation',
      'Talking excessively',
      'Inability to modulate voice volume contextually',
      'Struggling to wait for their turn to speak'
    ],
    protocol: 'While acoustic markers support a screening thesis, ADHD must be diagnosed clinically. Referral to a child psychiatrist or specialized pediatrician is necessary for formal assessment and management strategies.',
    colorTag: 'primary'
  }
};

export default function ConditionDetails() {
  const { id } = useParams();
  const condition = CONDITION_DETAILS[id];

  if (!condition) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-white">
        <h2 className="text-2xl font-display mb-4">Condition not found</h2>
        <Link to="/conditions">
          <Button variant="secondary">Return to Library</Button>
        </Link>
      </div>
    );
  }

  const Icon = condition.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full text-white">
      {/* Back navigation */}
      <Link to="/conditions" className="inline-flex items-center text-text-muted hover:text-white transition-colors mb-8">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Conditions
      </Link>

      {/* Header */}
      <div className="bg-surface-elevated rounded-2xl p-8 border border-white/5 mb-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-64 h-64 bg-${condition.colorTag}/10 blur-3xl pointer-events-none rounded-full blur-[100px]`}></div>
        
        <div className={`w-20 h-20 rounded-2xl bg-${condition.colorTag}/10 flex items-center justify-center shrink-0 border border-${condition.colorTag}/20`}>
          <Icon className={`w-10 h-10 text-${condition.colorTag}`} />
        </div>
        
        <div>
          <Badge variant="default" className="mb-4">{condition.category}</Badge>
          <h1 className="text-4xl font-display text-white mb-4">{condition.name}</h1>
          <p className="text-text-muted leading-relaxed text-lg">
            {condition.overview}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-3 text-primary" />
                Acoustic AI Biomarkers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <p className="text-sm text-text-muted mb-6">
                VocalVitals utilizes advanced machine learning to isolate and measure specific acoustic signatures tied to {condition.name}.
              </p>
              
              <div className="space-y-4">
                {condition.biomarkers.map((marker, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-surface border border-white/5">
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/20" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">{marker.name}</h4>
                      <p className="text-sm text-text-muted">{marker.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-3 text-warning" />
                Physical Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                {condition.symptoms.map((sym, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-text-muted mr-3 shrink-0" />
                    <span className="text-text-muted">{sym}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-warning/30 bg-warning/5">
            <CardHeader>
              <CardTitle className="flex items-center text-warning">
                <Stethoscope className="w-5 h-5 mr-2" />
                Clinical Protocol
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-muted leading-relaxed">
                {condition.protocol}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h4 className="font-medium text-white mb-2 text-sm flex items-center">
                <FileText className="w-4 h-4 mr-2 text-primary" />
                Ready to screen?
              </h4>
              <p className="text-xs text-text-muted mb-4">
                Run a live audio analysis to detect acoustic deviations tied to this condition.
              </p>
              <Link to="/analyze">
                <Button className="w-full text-sm">
                  Start Analysis <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
