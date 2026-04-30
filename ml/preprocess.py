import os
import librosa
import numpy as np
import pandas as pd

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DIR = os.path.join(SCRIPT_DIR, "..", "data", "raw")
PROCESSED_DIR = os.path.join(SCRIPT_DIR, "..", "data", "processed")

SAMPLE_RATE = 16000
TARGET_SECONDS = 3
TARGET_SAMPLES = SAMPLE_RATE * TARGET_SECONDS
N_MELS = 128
N_MFCC = 20
N_FFT = 1024
HOP_LENGTH = 512

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

EPS = 1e-9

def audio_stats(feature):
    if feature.ndim == 1:
        feature = feature[np.newaxis, :]
    means = np.mean(feature, axis=1)
    stds = np.std(feature, axis=1)
    mins = np.min(feature, axis=1)
    maxs = np.max(feature, axis=1)
    medians = np.median(feature, axis=1)
    skew = np.mean(((feature - means[:, None]) / (stds[:, None] + EPS))**3, axis=1)
    return np.concatenate([means, stds, mins, maxs, medians, skew])


def spectral_entropy(spectrogram):
    power = np.abs(spectrogram) + EPS
    p = power / np.sum(power, axis=0, keepdims=True)
    entropy = -np.sum(p * np.log2(p + EPS), axis=0)
    return entropy


def load_audio(path):
    y, _ = librosa.load(path, sr=SAMPLE_RATE, mono=True)
    if len(y) == 0:
        return None

    y_trim, _ = librosa.effects.trim(y, top_db=25)
    if len(y_trim) == 0:
        y_trim = y

    y = librosa.util.fix_length(y_trim, size=TARGET_SAMPLES)
    return librosa.util.normalize(y)

def extract_features(y):
    EPS = 1e-9
    
    # Narrow frequency bands for respiratory analysis
    mel_low = librosa.feature.melspectrogram(y=y, sr=SAMPLE_RATE, n_fft=N_FFT, hop_length=HOP_LENGTH, n_mels=40, fmin=0, fmax=500)
    mel_mid = librosa.feature.melspectrogram(y=y, sr=SAMPLE_RATE, n_fft=N_FFT, hop_length=HOP_LENGTH, n_mels=40, fmin=500, fmax=2500)
    mel_high = librosa.feature.melspectrogram(y=y, sr=SAMPLE_RATE, n_fft=N_FFT, hop_length=HOP_LENGTH, n_mels=40, fmin=2500, fmax=8000)
    
    log_mel_low = librosa.power_to_db(mel_low, ref=np.max)
    log_mel_mid = librosa.power_to_db(mel_mid, ref=np.max)
    log_mel_high = librosa.power_to_db(mel_high, ref=np.max)
    
    # Harmonics and Percussive Source Separation (HPSS)
    y_harmonic, y_percussive = librosa.effects.hpss(y)
    
    # Voicing and breathiness
    harmonic_rms = librosa.feature.rms(y=y_harmonic, frame_length=N_FFT, hop_length=HOP_LENGTH)
    percussive_rms = librosa.feature.rms(y=y_percussive, frame_length=N_FFT, hop_length=HOP_LENGTH)
    total_rms = librosa.feature.rms(y=y, frame_length=N_FFT, hop_length=HOP_LENGTH)
    
    breathiness = percussive_rms / (total_rms + EPS)
    voicing_ratio = harmonic_rms / (total_rms + EPS)
    
    # Jitter and Shimmer using autocorrelation
    S = librosa.stft(y, n_fft=N_FFT, hop_length=HOP_LENGTH)
    magnitude = np.abs(S)
    
    # Spectral slope (how energy decays)
    freqs = librosa.fft_frequencies(sr=SAMPLE_RATE, n_fft=N_FFT)
    spectral_slope = np.polyfit(freqs[1:], np.mean(magnitude[1:], axis=1), 1)[0]
    
    # Spectral flux (rate of change)
    flux = np.sqrt(np.sum(np.diff(magnitude, axis=1)**2, axis=0))
    
    # Cepstral coefficients
    mfcc = librosa.feature.mfcc(y=y, sr=SAMPLE_RATE, n_mfcc=13, n_fft=N_FFT, hop_length=HOP_LENGTH)
    mfcc_delta = librosa.feature.delta(mfcc)
    
    # Chromagram (pitch-related)
    chroma = librosa.feature.chroma_stft(y=y, sr=SAMPLE_RATE, n_fft=N_FFT, hop_length=HOP_LENGTH)
    
    # Spectral centroid and bandwidth
    centroid = librosa.feature.spectral_centroid(y=y, sr=SAMPLE_RATE, n_fft=N_FFT, hop_length=HOP_LENGTH)
    bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=SAMPLE_RATE, n_fft=N_FFT, hop_length=HOP_LENGTH)
    
    # Zero crossing rate (noisiness)
    zcr = librosa.feature.zero_crossing_rate(y, frame_length=N_FFT, hop_length=HOP_LENGTH)
    
    # Tempogram (breathing rhythm)
    onset_env = librosa.onset.onset_strength(y=y, sr=SAMPLE_RATE, hop_length=HOP_LENGTH, n_fft=N_FFT)
    tempogram = librosa.feature.tempogram(onset_envelope=onset_env, sr=SAMPLE_RATE, hop_length=HOP_LENGTH)
    
    # Concatenate all features with statistics
    feature_vector = np.concatenate([
        audio_stats(log_mel_low),
        audio_stats(log_mel_mid),
        audio_stats(log_mel_high),
        audio_stats(mfcc),
        audio_stats(mfcc_delta),
        audio_stats(chroma),
        audio_stats(centroid),
        audio_stats(bandwidth),
        audio_stats(zcr),
        audio_stats(breathiness),
        audio_stats(voicing_ratio),
        audio_stats(harmonic_rms),
        audio_stats(percussive_rms),
        audio_stats(flux),
        audio_stats(tempogram),
        np.array([spectral_slope, np.mean(onset_env), np.std(onset_env), np.max(onset_env), 0.0, 0.0], dtype=np.float32)
    ])
    
    feature_vector = (feature_vector - np.mean(feature_vector)) / (np.std(feature_vector) + EPS)
    return feature_vector.astype(np.float32)

# def extract_features(y):
#     y_harmonic, y_percussive = librosa.effects.hpss(y)

#     mel = librosa.feature.melspectrogram(
#         y=y,
#         sr=SAMPLE_RATE,
#         n_fft=N_FFT,
#         hop_length=HOP_LENGTH,
#         n_mels=N_MELS,
#         power=2.0
#     )
#     log_mel = librosa.power_to_db(mel, ref=np.max)

#     mfcc = librosa.feature.mfcc(
#         y=y,
#         sr=SAMPLE_RATE,
#         n_mfcc=N_MFCC,
#         n_fft=N_FFT,
#         hop_length=HOP_LENGTH
#     )
#     mfcc_delta = librosa.feature.delta(mfcc)
#     mfcc_delta2 = librosa.feature.delta(mfcc, order=2)

#     centroid = librosa.feature.spectral_centroid(
#         y=y,
#         sr=SAMPLE_RATE,
#         n_fft=N_FFT,
#         hop_length=HOP_LENGTH
#     )
#     bandwidth = librosa.feature.spectral_bandwidth(
#         y=y,
#         sr=SAMPLE_RATE,
#         n_fft=N_FFT,
#         hop_length=HOP_LENGTH,
#         p=2
#     )
#     rolloff_85 = librosa.feature.spectral_rolloff(
#         y=y,
#         sr=SAMPLE_RATE,
#         n_fft=N_FFT,
#         hop_length=HOP_LENGTH,
#         roll_percent=0.85
#     )
#     rolloff_50 = librosa.feature.spectral_rolloff(
#         y=y,
#         sr=SAMPLE_RATE,
#         n_fft=N_FFT,
#         hop_length=HOP_LENGTH,
#         roll_percent=0.50
#     )
#     contrast = librosa.feature.spectral_contrast(
#         y=y,
#         sr=SAMPLE_RATE,
#         n_fft=N_FFT,
#         hop_length=HOP_LENGTH,
#         n_bands=6
#     )
#     flatness = librosa.feature.spectral_flatness(
#         y=y,
#         n_fft=N_FFT,
#         hop_length=HOP_LENGTH
#     )
#     zcr = librosa.feature.zero_crossing_rate(
#         y,
#         frame_length=N_FFT,
#         hop_length=HOP_LENGTH
#     )
#     rms = librosa.feature.rms(
#         y=y,
#         frame_length=N_FFT,
#         hop_length=HOP_LENGTH
#     )
#     chroma = librosa.feature.chroma_stft(
#         y=y,
#         sr=SAMPLE_RATE,
#         n_fft=N_FFT,
#         hop_length=HOP_LENGTH
#     )
#     onset_env = librosa.onset.onset_strength(
#         y=y,
#         sr=SAMPLE_RATE,
#         hop_length=HOP_LENGTH,
#         n_fft=N_FFT
#     )
#     tempo = librosa.beat.tempo(onset_envelope=onset_env, sr=SAMPLE_RATE, aggregate=None)
#     if tempo.size == 0:
#         tempo = np.array([0.0], dtype=np.float32)

#     harmonic_rms = librosa.feature.rms(
#         y=y_harmonic,
#         frame_length=N_FFT,
#         hop_length=HOP_LENGTH
#     )
#     percussive_rms = librosa.feature.rms(
#         y=y_percussive,
#         frame_length=N_FFT,
#         hop_length=HOP_LENGTH
#     )
#     hnr = harmonic_rms / (rms + EPS)
#     spectral_ent = spectral_entropy(mel)

#     feature_vector = np.concatenate([
#         audio_stats(log_mel),
#         audio_stats(mfcc),
#         audio_stats(mfcc_delta),
#         audio_stats(mfcc_delta2),
#         audio_stats(centroid),
#         audio_stats(bandwidth),
#         audio_stats(rolloff_85),
#         audio_stats(rolloff_50),
#         audio_stats(contrast),
#         audio_stats(flatness),
#         audio_stats(zcr),
#         audio_stats(rms),
#         audio_stats(chroma),
#         audio_stats(onset_env),
#         audio_stats(harmonic_rms),
#         audio_stats(percussive_rms),
#         audio_stats(hnr),
#         audio_stats(spectral_ent),
#         np.array([np.mean(tempo), np.std(tempo), np.min(tempo), np.max(tempo), np.median(tempo), 0.0], dtype=np.float32)
#     ])

#     feature_vector = (feature_vector - np.mean(feature_vector)) / (np.std(feature_vector) + EPS)
#     return feature_vector.astype(np.float32)

def main():
    print("STARTING PREPROCESS", RAW_DIR)
    ensure_dir(PROCESSED_DIR)
    rows = []

    for label in sorted(os.listdir(RAW_DIR)):
        label_path = os.path.join(RAW_DIR, label)
        if not os.path.isdir(label_path):
            continue

        out_dir = os.path.join(PROCESSED_DIR, label)
        ensure_dir(out_dir)

        for filename in sorted(os.listdir(label_path)):
            if not filename.lower().endswith((".wav", ".mp3", ".flac")):
                continue

            src_path = os.path.join(label_path, filename)
            y = load_audio(src_path)
            if y is None:
                print("Skipped empty:", filename)
                continue

            print("Processing:", filename, "len=", len(y))
            features = extract_features(y)

            out_name = os.path.splitext(filename)[0] + ".npy"
            out_path = os.path.join(out_dir, out_name)
            np.save(out_path, features)

            rows.append({
                "filename": filename,
                "label": label,
                "feature_path": os.path.relpath(out_path, start=os.path.join(SCRIPT_DIR, ".."))
            })

    df = pd.DataFrame(rows)
    df.to_csv(os.path.join(PROCESSED_DIR, "metadata.csv"), index=False)
    print("Saved", len(rows), "examples.")

if __name__ == "__main__":
    main()