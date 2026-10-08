"""Synthesize a TEMP music bed for the produced cut (replace with a licensed
track before publishing). Warm, steady, slightly electronic: 96 BPM, pad on
Am–F–C–G, soft kick, offbeat hats, a quiet pluck arpeggio. Cold open is pad
only; the beat drops at 1.5 s when the light bar wakes; fades out at the end.

    python3 scripts/make-temp-music.py public/music/temp-bed.wav
"""

import sys
import wave

import numpy as np

SR = 44100
DUR = 88.0
BPM = 96.0
BEAT = 60.0 / BPM
DROP = 1.5  # seconds: beat starts with the light bar

t = np.arange(int(SR * DUR)) / SR
out = np.zeros_like(t)
rng = np.random.default_rng(7)


def note(n):  # MIDI → Hz
    return 440.0 * 2 ** ((n - 69) / 12)


def env(length, a, r):
    n = int(length * SR)
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] *= np.linspace(1, 0, nr)
    return e


def add(sig, start):
    i = int(start * SR)
    j = min(len(out), i + len(sig))
    if i < len(out):
        out[i:j] += sig[: j - i]


# Chords, 2 bars each (8 beats): Am, F, C, G (voiced around middle C).
CHORDS = [[57, 60, 64, 69], [53, 57, 60, 65], [48, 55, 60, 64], [55, 59, 62, 67]]
BAR = 4 * BEAT
for k, start in enumerate(np.arange(0, DUR, 2 * BAR)):
    chord = CHORDS[k % 4]
    length = 2 * BAR + 0.4
    tt = np.arange(int(length * SR)) / SR
    pad = sum(
        np.sin(2 * np.pi * note(n) * tt) * 0.6
        + np.sin(2 * np.pi * note(n) * 1.003 * tt) * 0.4  # slight detune
        for n in chord
    )
    pad *= 0.5 + 0.5 * np.sin(2 * np.pi * 0.25 * tt)  # slow swell
    add(pad * env(length, 0.8, 0.8) * 0.030, start)
    # sub bass on the root, each beat after the drop
    root = note(chord[0] - 12)
    for b in range(8):
        bt = start + b * BEAT
        if bt < DROP:
            continue
        lt = np.arange(int(BEAT * 0.9 * SR)) / SR
        add(np.sin(2 * np.pi * root * lt) * np.exp(-lt * 3) * 0.10, bt)
    # pluck arpeggio, 8th notes, very quiet
    for s in range(16):
        bt = start + s * BEAT / 2
        if bt < DROP + 2 * BAR:
            continue
        n = chord[[0, 2, 1, 3, 2, 1, 3, 2][s % 8]] + 12
        lt = np.arange(int(0.35 * SR)) / SR
        add(np.sin(2 * np.pi * note(n) * lt) * np.exp(-lt * 9) * 0.035, bt)

# Kick on every beat, hats on the off-beats.
for bt in np.arange(DROP, DUR, BEAT):
    lt = np.arange(int(0.3 * SR)) / SR
    f = 50 + 70 * np.exp(-lt * 30)
    add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-lt * 12) * 0.22, bt)
    hl = int(0.05 * SR)
    hat = rng.standard_normal(hl)
    hat = np.diff(hat, prepend=0)  # crude high-pass
    add(hat * np.exp(-np.arange(hl) / SR * 80) * 0.025, bt + BEAT / 2)

# Fades, soft limiter, normalise.
fade_in = np.clip(t / 0.6, 0, 1)
fade_out = np.clip((DUR - t) / 3.0, 0, 1)
out *= fade_in * fade_out
out = np.tanh(out * 1.6)
out /= np.max(np.abs(out)) / 0.7

stereo = np.stack([out, np.roll(out, 220)], axis=1)  # tiny width
data = (stereo * 32767).astype("<i2").tobytes()
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(data)
print("wrote", sys.argv[1], f"{DUR:.0f}s")
