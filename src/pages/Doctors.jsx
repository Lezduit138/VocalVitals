import { useState, useEffect } from 'react';
import { MapPin, Search, Filter, Star, Phone, Calendar, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { AlertCircle } from 'lucide-react';
import { searchNearbyDoctors, getUserLocation, CONDITION_SPECIALTY_MAP, getCityName } from '../services/doctorService';
export default function Doctors() {
  const isOffline = useStore((state) => state.isOffline);
  const analysisResult = useStore((state) => state.analysisResult);
  
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

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(detectedSpecialty);
  
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [googleStatus, setGoogleStatus] = useState(null);

  const [cityName, setCityName] = useState('');

  // Automatically lock GPS and hunt for doctors the second the page opens
  useEffect(() => {
    handleLocateMe();
  }, []);

  const specialties = ['All', 'pulmonologist', 'pediatrician', 'child psychiatrist', 'neurologist', 'speech language pathologist', 'ENT specialist', 'audiologist', 'child psychologist'];

  // This replaces the mock array entirely with direct Google Maps data
  const [doctorsList, setDoctorsList] = useState([]);

  // Fetches GPS coordinates via unified service layer, then calls Cloud Function backend
  const fetchDoctorsFromBackend = async (lat, lng, condition) => {
    setGoogleStatus('fetching');
    try {
      const docs = await searchNearbyDoctors([condition]);
      if (docs && docs.length > 0) {
        setDoctorsList(docs);
        setGoogleStatus('success');
      } else {
        setDoctorsList([]);
        setGoogleStatus('no_results');
      }
    } catch (err) {
      console.error(err);
      setGoogleStatus('missing_key');
    }
  };

  const handleLocateMe = async () => {
    setIsLocating(true);
    try {
      const location = await getUserLocation();
      setUserLocation(location);
      
      const city = await getCityName(location.lat, location.lng);
      setCityName(city);

      setIsLocating(false);
      // Immediately pass to the Serverless proxy
      fetchDoctorsFromBackend(location.lat, location.lng, selectedSpecialty);
    } catch (err) {
      setIsLocating(false);
      alert("Please allow location access in your browser to accurately find nearby doctors.");
    }
  };

  // Re-trigger Google search if they click a new condition filter while GPS is locked
  const handleFilterChange = (spec) => {
    setSelectedSpecialty(spec);
    if (userLocation) {
      fetchDoctorsFromBackend(userLocation.lat, userLocation.lng, spec);
    }
  };

  const filteredDoctors = doctorsList.filter(doc => 
    (selectedSpecialty === 'All' || doc.specialty.includes(selectedSpecialty)) &&
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display text-white mb-2">Find a Specialist</h1>
          <p className="text-text-muted">Locate pediatric specialists in your area based on analysis results.</p>
        </div>
        {isOffline && (
          <Badge variant="warning" className="animate-pulse">
            Showing cached doctors near last location
          </Badge>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 text-white">
        
        {/* Sidebar / Filters */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="relative mb-6">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input 
                  type="text"
                  placeholder="Search doctors, clinics..."
                  className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium uppercase tracking-wider text-text-muted mb-4 flex items-center">
                  <Filter className="w-4 h-4 mr-2" /> Specialties
                </h3>
                <div className="flex flex-col space-y-2">
                  {specialties.map(spec => (
                    <button
                      key={spec}
                      onClick={() => handleFilterChange(spec)}
                      className={`text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                        selectedSpecialty === spec 
                        ? 'bg-primary/20 text-primary font-medium border border-primary/30' 
                        : 'text-text hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-surface-elevated rounded-xl border border-white/5">
                <div className="flex items-center space-x-3 mb-2">
                  <MapPin className="text-primary w-5 h-5" />
                  <span className="font-medium">Current Location</span>
                </div>
                <p className="text-sm text-text-muted">
                  {userLocation 
                    ? `City: ${cityName} (${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)})`
                    : "Location Unknown"}
                </p>
                <button 
                  onClick={handleLocateMe}
                  disabled={isLocating}
                  className="text-primary text-sm mt-3 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLocating ? 'Acquiring Satellites...' : 'Update using GPS Device Location'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Doctor List */}
        <div className="lg:col-span-2 space-y-4">

          {googleStatus === 'missing_key' && (
             <div className="p-6 bg-warning/10 border border-warning/20 rounded-xl flex items-start space-x-4">
               <AlertCircle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
               <div>
                 <h3 className="text-warning font-medium text-lg">Google Places API key required</h3>
                 <p className="text-text-muted mt-1 text-sm">To stream live clinics and real doctors using the Google location engine, you need to embed your API key into your app. For now, the integration hook is waiting safely.</p>
               </div>
             </div>
          )}

          {googleStatus === 'fetching' && (
             <div className="text-center py-12 text-primary animate-pulse">
               Connecting to Google Maps Network...
             </div>
          )}

          {(!googleStatus || googleStatus === 'success') && filteredDoctors.map((doc, i) => (
            <motion.div 
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:border-white/20 transition-colors card-hover">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {doc.photoUrl ? (
                      <img src={doc.photoUrl} alt={doc.name} className="w-20 h-20 rounded-2xl object-cover bg-surface-elevated border border-white/10" />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-surface-elevated border border-white/10 flex items-center justify-center text-3xl text-primary font-display">
                        {doc.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h2 className="text-xl font-medium text-white">{doc.name}</h2>
                      <div className="flex items-center bg-surface-elevated px-2 py-1 rounded-md">
                        <Star className="w-4 h-4 text-warning fill-warning mr-1" />
                        <span className="text-sm font-medium">{doc.rating || 'N/A'}</span>
                        <span className="text-xs text-text-muted ml-1">({doc.totalReviews || doc.reviews} reviews)</span>
                      </div>
                    </div>
                    
                    <p className="text-text-muted text-sm mb-4 capitalize">{doc.specialty}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5" /> {doc.address}
                      </div>
                      <div className="flex items-center text-primary">
                        {doc.distance} km away
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className={doc.isOpenNow ? 'text-success font-medium' : 'text-danger font-medium'}>
                        {doc.isOpenNow ? '🟢 Open Now' : '🔴 Closed'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-center space-y-3 md:border-l border-white/5 md:pl-6">
                    <a href={doc.directionsUrl} target="_blank" rel="noreferrer" className="w-full">
                      <Button className="w-full whitespace-nowrap flex items-center justify-center">
                        <MapPin className="w-4 h-4 mr-2" /> Get Directions
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12 text-text-muted">
              No doctors found matching your criteria.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
