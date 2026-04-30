import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Download, Share2, RefreshCw, MapPin, ChevronRight, Stethoscope } from 'lucide-react';
import { useStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ConfidenceGauge } from '../components/charts/ConfidenceGauge';
import { BiomarkerRadar } from '../components/charts/RadarChart';
import { searchNearbyDoctors, CONDITION_SPECIALTY_MAP, getCityName, getUserLocation } from '../services/doctorService';

export default function Results() {
  const navigate = useNavigate();
  const analysisResult = useStore((state) => state.analysisResult);

  const [nearbyDoctors, setNearbyDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [cityName, setCityName] = useState('your area');

  useEffect(() => {
    if (!analysisResult) {
      navigate('/analyze');
      return;
    }

    const fetchRealDoctors = async () => {
      setLoadingDoctors(true);
      try {
        let detectedSpecialty = 'pediatrician';
        if (analysisResult?.primary?.condition) {
          const rawCondName = analysisResult.primary.condition.toLowerCase();
          for (const [key, specArr] of Object.entries(CONDITION_SPECIALTY_MAP)) {
            if (rawCondName.includes(key.replace(/_/g, ' '))) {
              detectedSpecialty = specArr[0];
              break;
            }
          }
        }
        
        const { lat, lng } = await getUserLocation();
        const city = await getCityName(lat, lng);
        setCityName(city);

        const docs = await searchNearbyDoctors([detectedSpecialty]);
        setNearbyDoctors(docs.slice(0, 3)); // Show top 3 max on results page
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchRealDoctors();
  }, [analysisResult, navigate]);

  if (!analysisResult) return <div className="min-h-screen"></div>;

  const { childInfo, primary, biomarkers, timestamp } = analysisResult;
  const dateStr = new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-surface-elevated flex items-center justify-center text-xl font-medium border border-white/5">
            {childInfo?.name ? childInfo.name[0].toUpperCase() : <User className="w-6 h-6 text-text-muted" />}
          </div>
          <div>
            <h1 className="text-2xl font-display text-white">{childInfo?.name || 'Anonymous Patient'}</h1>
            <div className="text-text-muted flex items-center mt-1">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">Age: {childInfo?.age} • Analyzed on {dateStr}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/analyze')}><RefreshCw className="w-4 h-4 mr-2" /> Re-analyze</Button>
          <Button variant="secondary"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
          <Button variant="primary"><Download className="w-4 h-4 mr-2" /> PDF Report</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Primary Findings & Radar */}
        <div className="lg:col-span-2 space-y-8">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-warning/30 bg-warning/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-warning/10 blur-3xl pointer-events-none rounded-full"></div>
              
              <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <Badge variant="warning" className="text-sm">Moderate Severity</Badge>
                  </div>
                  <h2 className="text-3xl font-display text-white mb-4 line-clamp-2">
                    {primary.condition}
                  </h2>
                  <p className="text-text-muted leading-relaxed mb-6 font-body">
                    The acoustic analysis detected variations in speech patterns, primarily an increase in breathiness and specific formant deviations that correlate moderately with localized respiratory constriction.
                  </p>
                  <div className="text-sm text-white/50 bg-black/20 p-4 rounded-xl border border-white/5">
                    <strong>Disclaimer:</strong> This is an AI screening tool, not a clinical diagnosis. Please consult a qualified pediatrician for a complete evaluation.
                  </div>
                </div>
                
                <div className="flex-shrink-0 flex items-center justify-center">
                  <ConfidenceGauge value={primary.confidence} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Radar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Biomarker Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full mt-4">
                  <BiomarkerRadar data={biomarkers} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {biomarkers.map((bm, i) => (
                    <div key={i} className="bg-surface-elevated p-3 rounded-xl border border-white/5">
                      <div className="text-xs text-text-muted mb-1">{bm.name}</div>
                      <div className="flex items-end justify-between">
                        <span className="text-lg font-medium text-white">{bm.value}</span>
                        <span className={`text-xs ${bm.value > bm.normal + 20 ? 'text-warning' : (bm.value < bm.normal - 20 ? 'text-primary' : 'text-success')}`}>
                          vs {bm.normal}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>

        {/* Right Column: Next Steps & Doctors */}
        <div className="space-y-8">
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex p-4 rounded-xl bg-primary/10 border border-primary/20 items-start space-x-4 cursor-pointer hover:bg-primary/20 transition-colors group">
                  <div className="p-3 rounded-full bg-primary/20 text-primary mt-1">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">Consult Pulmonologist</h4>
                    <p className="text-sm text-text-muted">Schedule an appointment within 1-2 weeks for standard evaluation.</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted mt-2 group-hover:text-primary transition-colors" />
                </div>

                <div className="flex p-4 rounded-xl bg-surface-elevated border border-white/5 items-start space-x-4">
                  <div className="p-3 rounded-full bg-surface text-text-muted mt-1">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">Monitor Weekly</h4>
                    <p className="text-sm text-text-muted">Take another recording in 7 days to track biomarker progression.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Nearby Specialists</CardTitle>
                <MapPin className="text-text-muted w-4 h-4 cursor-pointer hover:text-white" />
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="text-xs text-text-muted mb-2 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  Showing doctors in {cityName} (15km radius)
                </div>
                
                {loadingDoctors && (
                  <div className="text-sm text-primary animate-pulse py-4 text-center">
                    Locating nearby specialists using GPS...
                  </div>
                )}

                {!loadingDoctors && nearbyDoctors.length === 0 && (
                  <div className="text-sm text-warning py-4 text-center border border-warning/20 bg-warning/5 rounded-xl">
                    Live doctor networking currently waiting on API link or locational access.
                  </div>
                )}

                {!loadingDoctors && nearbyDoctors.map((doc, i) => (
                  <div key={i} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-surface-elevated transition-colors border border-transparent hover:border-white/5 group">
                    <div className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center text-primary font-medium overflow-hidden">
                      {doc.photoUrl ? (
                         <img src={doc.photoUrl} alt={doc.name} className="w-full h-full object-cover" />
                      ) : (
                         doc.name.charAt(4)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">{doc.name}</h4>
                      <p className="text-xs text-text-muted truncate capitalize">{doc.specialty} • {doc.distance} km</p>
                    </div>
                    <a href={doc.directionsUrl} target="_blank" rel="noreferrer">
                      <Button variant="ghost" size="icon" className="h-8 w-8 group-hover:bg-primary/10 group-hover:text-primary">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                ))}

                <Link to="/doctors" className="block mt-4">
                  <Button variant="secondary" className="w-full text-sm">View All Specialists</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
