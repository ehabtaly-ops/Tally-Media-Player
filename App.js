import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// استدعاء صورتك من مجلد assets
const SPLASH_IMAGE = require('./assets/splash.png');

const SAMPLE_AUDIO_FILES = [
  { id: '1', title: 'Midnight Chill Beat', artist: 'Lofi Beats', duration: '3:20', folder: 'Downloads' },
  { id: '2', title: 'Electro Synthwave Anthem', artist: 'Cyberwave', duration: '4:12', folder: 'Music' },
  { id: '3', title: 'Deep Acoustic Melody', artist: 'Solo Guitarist', duration: '2:45', folder: 'Recordings' },
  { id: '4', title: 'Urban Bassline Groove', artist: 'Subzero', duration: '3:50', folder: 'Downloads' },
];

const SAMPLE_VIDEO_FILES = [
  { id: 'v1', title: 'Cinematic City Timelapse.mp4', duration: '1:15', size: '24 MB' },
  { id: 'v2', title: 'Product Promo Reel 4K.mp4', duration: '0:45', size: '18 MB' },
  { id: 'v3', title: 'Design Motion Graphic Demo.mp4', duration: '2:10', size: '42 MB' },
];

const EQ_PRESETS = {
  Flat: [0, 0, 0, 0, 0],
  'Bass Boost': [8, 6, 2, 0, -1],
  Rock: [5, 3, -1, 4, 6],
  Pop: [-1, 2, 5, 3, -2],
  Vocal: [-2, 0, 6, 4, 1],
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('audio');
  const [currentTrack, setCurrentTrack] = useState(SAMPLE_AUDIO_FILES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('All');

  const [eqBands, setEqBands] = useState([0, 0, 0, 0, 0]);
  const [activePreset, setActivePreset] = useState('Flat');

  // تشغيل شاشة الانترو لمدة 3 ثوانٍ
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const applyPreset = (name) => {
    setActivePreset(name);
    setEqBands([...EQ_PRESETS[name]]);
  };

  const updateBand = (index, val) => {
    const updated = [...eqBands];
    updated[index] = Math.round(val);
    setEqBands(updated);
    setActivePreset('Custom');
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * SAMPLE_AUDIO_FILES.length);
      setCurrentTrack(SAMPLE_AUDIO_FILES[randomIndex]);
    } else {
      const currentIndex = SAMPLE_AUDIO_FILES.findIndex((t) => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % SAMPLE_AUDIO_FILES.length;
      setCurrentTrack(SAMPLE_AUDIO_FILES[nextIndex]);
    }
  };

  const prevTrack = () => {
    const currentIndex = SAMPLE_AUDIO_FILES.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + SAMPLE_AUDIO_FILES.length) % SAMPLE_AUDIO_FILES.length;
    setCurrentTrack(SAMPLE_AUDIO_FILES[prevIndex]);
  };

  const foldersList = ['All', ...new Set(SAMPLE_AUDIO_FILES.map((f) => f.folder))];
  const displayedAudio = selectedFolder === 'All' 
    ? SAMPLE_AUDIO_FILES 
    : SAMPLE_AUDIO_FILES.filter((f) => f.folder === selectedFolder);

  // واجهة الانترو
  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar hidden />
        <ImageBackground 
          source={SPLASH_IMAGE} 
          style={styles.splashImage}
          resizeMode="cover"
        >
          <View style={styles.splashLoadingBox}>
            <ActivityIndicator size="large" color="#ff9f0a" />
            <Text style={styles.splashLoadingText}>LOADING...</Text>
          </View>
        </ImageBackground>
      </View>
    );
  }

  // واجهة التطبيق بعد الانترو
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1015" />

      {/* الشريط العلوي */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleIcon}>🎧</Text>
          <Text style={styles.appTitle}>TALLY MEDIA PLAYER</Text>
        </View>

        <View style={styles.navBar}>
          {['audio', 'video', 'folders', 'eq'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.navBtn, activeTab === tab && styles.navBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.navBtnText, activeTab === tab && styles.navBtnTextActive]}>
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* محتوى الشاشات */}
      <View style={styles.content}>
        {activeTab === 'audio' && (
          <FlatList
            data={displayedAudio}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.listItem, currentTrack.id === item.id && styles.activeItem]}
                onPress={() => { setCurrentTrack(item); setIsPlaying(true); }}
              >
                <View style={styles.itemIconBox}>
                  <Text style={styles.itemIconText}>🎵</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.trackTitle}>{item.title}</Text>
                  <Text style={styles.trackSub}>{item.artist} • {item.folder}</Text>
                </View>
                <Text style={styles.trackDuration}>{item.duration}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {activeTab === 'video' && (
          <View style={{ flex: 1 }}>
            <View style={styles.videoPlayerBox}>
              <Text style={styles.videoPlaceholderText}>▶ Video Preview Screen</Text>
              <Text style={styles.videoSubText}>Tap any video below to load</Text>
            </View>
            <FlatList
              data={SAMPLE_VIDEO_FILES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.listItem}>
                  <View style={[styles.itemIconBox, { backgroundColor: '#341528' }]}>
                    <Text style={styles.itemIconText}>🎬</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.trackTitle}>{item.title}</Text>
                    <Text style={styles.trackSub}>Duration: {item.duration} • {item.size}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {activeTab === 'folders' && (
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionHeader}>Select Storage Directory:</Text>
            <FlatList
              data={foldersList}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.folderItem, selectedFolder === item && styles.folderItemActive]}
                  onPress={() => { setSelectedFolder(item); setActiveTab('audio'); }}
                >
                  <Text style={styles.folderIcon}>📁</Text>
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={styles.folderName}>{item}</Text>
                    <Text style={styles.trackSub}>
                      {item === 'All' ? 'All available tracks' : `Directory: /storage/emulated/0/${item}`}
                    </Text>
                  </View>
                  <Text style={styles.arrowIcon}>➔</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {activeTab === 'eq' && (
          <View style={styles.eqContainer}>
            <Text style={styles.sectionHeader}>Sound Presets</Text>
            <View style={styles.presetsRow}>
              {Object.keys(EQ_PRESETS).map((name) => (
                <TouchableOpacity
                  key={name}
                  style={[styles.presetChip, activePreset === name && styles.presetChipActive]}
                  onPress={() => applyPreset(name)}
                >
                  <Text style={[styles.presetText, activePreset === name && styles.presetTextActive]}>
                    {name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionHeader, { marginTop: 25 }]}>Manual Graphic Bands (dB)</Text>
            <View style={styles.slidersRow}>
              {['60Hz', '230Hz', '910Hz', '3.6kHz', '14kHz'].map((freq, idx) => (
                <View key={freq} style={styles.bandCol}>
                  <Text style={styles.bandValue}>{eqBands[idx] > 0 ? `+${eqBands[idx]}` : eqBands[idx]}</Text>
                  <TouchableOpacity 
                    style={styles.stepBtn} 
                    onPress={() => updateBand(idx, Math.min(eqBands[idx] + 1, 10))}
                  >
                    <Text style={styles.stepBtnText}>+</Text>
                  </TouchableOpacity>

                  <View style={styles.meterContainer}>
                    <View style={[styles.meterFill, { height: `${((eqBands[idx] + 10) / 20) * 100}%` }]} />
                  </View>

                  <TouchableOpacity 
                    style={styles.stepBtn} 
                    onPress={() => updateBand(idx, Math.max(eqBands[idx] - 1, -10))}
                  >
                    <Text style={styles.stepBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.bandLabel}>{freq}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* مشغل الصوت بالأسفل */}
      <View style={styles.playerDeck}>
        <View style={styles.trackDetails}>
          <Text style={styles.nowPlayingTitle} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.nowPlayingArtist}>{currentTrack.artist}</Text>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity 
            style={[styles.optionBtn, isShuffle && styles.optionBtnActive]} 
            onPress={() => setIsShuffle(!isShuffle)}
          >
            <Ionicons name="shuffle" size={24} color="#ff9f0a" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.ctrlBtn} onPress={prevTrack}>
            <Ionicons name="play-skip-back" size={26} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playBtn} onPress={togglePlay}>
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={26} 
              color="#ffffff" 
              style={{ marginLeft: isPlaying ? 0 : 3 }} 
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.ctrlBtn} onPress={nextTrack}>
            <Ionicons name="play-skip-forward" size={26} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.optionBtn, isRepeat && styles.optionBtnActive]} 
            onPress={() => setIsRepeat(!isRepeat)}
          >
            <Ionicons name="repeat" size={24} color="#ff9f0a" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // تنسيق شاشة الانترو
  splashContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  splashImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  splashLoadingBox: {
    alignItems: 'center',
    marginBottom: 50,
  },
  splashLoadingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 4,
    marginTop: 12,
  },

  // تنسيق واجهة التطبيق
  container: {
    flex: 1,
    backgroundColor: '#0c0d12',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1d1e26',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  titleIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  appTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#161822',
    borderRadius: 12,
    padding: 4,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  navBtnActive: {
    backgroundColor: '#ff9f0a',
  },
  navBtnText: {
    color: '#7e8299',
    fontSize: 11,
    fontWeight: '700',
  },
  navBtnTextActive: {
    color: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#15161e',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  activeItem: {
    borderColor: '#ff9f0a',
    borderWidth: 1,
  },
  itemIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#232533',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIconText: {
    fontSize: 18,
  },
  trackTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  trackSub: {
    color: '#6c7087',
    fontSize: 12,
    marginTop: 2,
  },
  trackDuration: {
    color: '#8b8e9e',
    fontSize: 12,
  },
  videoPlayerBox: {
    height: 180,
    backgroundColor: '#000',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#232533',
    marginBottom: 14,
  },
  videoPlaceholderText: {
    color: '#ff9f0a',
    fontSize: 18,
    fontWeight: '700',
  },
  videoSubText: {
    color: '#555',
    fontSize: 12,
    marginTop: 4,
  },
  sectionHeader: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#15161e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  folderItemActive: {
    borderColor: '#ff9f0a',
    borderWidth: 1,
  },
  folderIcon: {
    fontSize: 24,
  },
  folderName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  arrowIcon: {
    color: '#ff9f0a',
    fontSize: 16,
  },
  eqContainer: {
    flex: 1,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    backgroundColor: '#1c1e2a',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2b2e3e',
  },
  presetChipActive: {
    backgroundColor: '#ff9f0a',
    borderColor: '#ff9f0a',
  },
  presetText: {
    color: '#8e92a8',
    fontSize: 12,
    fontWeight: '600',
  },
  presetTextActive: {
    color: '#000',
  },
  slidersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#15161e',
    padding: 16,
    borderRadius: 14,
  },
  bandCol: {
    alignItems: 'center',
  },
  bandValue: {
    color: '#ff9f0a',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  stepBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#222533',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  stepBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  meterContainer: {
    width: 8,
    height: 100,
    backgroundColor: '#0c0d12',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginVertical: 4,
  },
  meterFill: {
    backgroundColor: '#ff9f0a',
    width: '100%',
  },
  bandLabel: {
    color: '#6c7087',
    fontSize: 11,
  },
  playerDeck: {
    backgroundColor: '#12131b',
    borderTopWidth: 1,
    borderTopColor: '#1d1e26',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  trackDetails: {
    alignItems: 'center',
    marginBottom: 12,
  },
  nowPlayingTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  nowPlayingArtist: {
    color: '#7e8299',
    fontSize: 12,
    marginTop: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  ctrlBtn: {
    padding: 8,
  },
  optionBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionBtnActive: {
    backgroundColor: '#2a2015',
    borderWidth: 1,
    borderColor: '#ff9f0a',
  },
  playBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#ff9f0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});