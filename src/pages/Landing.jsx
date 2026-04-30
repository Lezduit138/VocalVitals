import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  HeartPulse, Activity, ShieldCheck, 
  Mic2, BrainCircuit, FileSignature,
  ArrowRight
} from 'lucide-react';
import WaveformVisualizer from '../components/audio/WaveformVisualizer';
import { cn } from '../utils/cn';

export default function Landing() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const conditions = [
    { name: 'Autism Spectrum Disorder', icon: BrainCircuit, desc: 'Detects unusual prosody, pitch variability, and rhythm patterns.', level: 'high' },
    { name: 'Asthma', icon: HeartPulse, desc: 'Identifies wheezing, breathlessness, and respiratory anomalies.', level: 'medium' },
    { name: 'Speech Delay', icon: Mic2, desc: 'Analyzes vocabulary milestones and phonemic accuracy.', level: 'high' },
    { name: 'Hearing Loss', icon: Activity, desc: 'Monitors atypical vocal volume and articulation errors.', level: 'medium' },
    { name: 'Respiratory Infections', icon: HeartPulse, desc: 'Detects congestion and characteristic coughing acoustic profiles.', level: 'low' },
    { name: 'ADHD Markers', icon: BrainCircuit, desc: 'Measures speech rate, impulsivity markers, and pause frequency.', level: 'medium' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden w-full">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute -top-40 right-20 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="show" variants={containerVars}>
            <motion.div variants={itemVars} className="flex justify-center mb-6">
              <Badge variant="primary" className="px-4 py-1.5 text-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2"></span>
                LIVE & Offline Modes Available
              </Badge>
            </motion.div>
            
            <motion.h1 variants={itemVars} className="text-5xl md:text-7xl font-display font-medium text-white max-w-4xl mx-auto leading-tight mb-8">
              Your Child's Voice Tells <br className="hidden md:block" /> More Than Words
            </motion.h1>

            <motion.p variants={itemVars} className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed font-body">
              AI-powered acoustic analysis to detect early signs of pediatric disorders — instantly, safely, offline-ready.
            </motion.p>

            <motion.div variants={itemVars} className="w-full max-w-2xl mx-auto h-32 mb-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none"></div>
              <WaveformVisualizer isRecording={true} height={80} />
            </motion.div>

            <motion.div variants={itemVars} className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/analyze" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto group">
                  Start Analysis
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
              >
                How It Works
              </Button>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/5 bg-surface-elevated/30 py-10 w-full backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/5">
            <div>
              <div className="text-4xl font-display text-primary mb-2">12+</div>
              <div className="text-sm text-text-muted font-medium uppercase tracking-wider">Detectable Conditions</div>
            </div>
            <div>
              <div className="text-4xl font-display text-white mb-2">0-17</div>
              <div className="text-sm text-text-muted font-medium uppercase tracking-wider">Age Range</div>
            </div>
            <div>
              <div className="text-4xl font-display text-accent mb-2">&lt;30s</div>
              <div className="text-sm text-text-muted font-medium uppercase tracking-wider">Analysis Time</div>
            </div>
            <div>
              <div className="text-4xl flex justify-center text-success mb-2"><ShieldCheck className="w-10 h-10" /></div>
              <div className="text-sm text-text-muted font-medium uppercase tracking-wider">Rural / Offline Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display text-white mb-4">How It Works</h2>
            <p className="text-text-muted max-w-2xl mx-auto font-body">Three simple steps to gain insights into your child's vocal health patterns from the comfort of your home.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[60px] left-10 right-10 h-px bg-white/10 -z-10"></div>
            
            {[
              { icon: Mic2, title: "Record Voice", desc: "Speak directly into your device or upload an existing recording." },
              { icon: BrainCircuit, title: "AI Analysis", desc: "Our offline-ready models securely analyze hidden acoustic biomarkers." },
              { icon: FileSignature, title: "Get Report", desc: "Receive immediate actionable insights and local doctor recommendations." }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-surface-elevated border border-white/5 flex items-center justify-center mb-6 relative group card-hover">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <step.icon className="w-10 h-10 text-primary relative z-10" />
                </div>
                <h3 className="text-xl font-medium text-white mb-3">{step.title}</h3>
                <p className="text-text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detectable Conditions */}
      <section className="py-24 bg-surface w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-display text-white mb-4">What We Screen For</h2>
              <p className="text-text-muted font-body">Our acoustic models are trained on diverse clinical datasets to identify subtle variations associated with these conditions.</p>
            </div>
            <Link to="/conditions">
              <Button variant="ghost">View Full Library <ArrowRight className="ml-2 w-4 h-4" /></Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conditions.map((cond, i) => (
              <Card key={i} className="card-hover">
                <CardContent className="p-0">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center">
                      <cond.icon className="w-6 h-6 text-text" />
                    </div>
                    {cond.level === 'high' && <Badge variant="primary">High Accuracy</Badge>}
                    {cond.level === 'medium' && <Badge variant="warning">Moderate Accuracy</Badge>}
                    {cond.level === 'low' && <Badge variant="success">Screening Only</Badge>}
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">{cond.name}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{cond.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Trust */}
      <section className="py-24 w-full">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-8">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display text-white mb-8 leading-tight">
            "Finally, a secure, offline-capable tool that gives rural clinics the power of advanced acoustic analysis."
          </h2>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-surface-elevated"></div>
            <div className="text-left">
              <div className="text-white font-medium">Dr. Sarah Jenkins</div>
              <div className="text-sm text-text-muted">Pediatric Specialist, Global Health Initiative</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
