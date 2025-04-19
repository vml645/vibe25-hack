'use client';

import { useState, useEffect } from 'react';

interface Position {
    left: string;
    top: string;
}

interface CourtPositions {
    GSW: Position[];
    Rockets: Position[];
}

interface Player {
    id: string;
    name: string;
    position: string;
}

interface Team {
    name: string;
    colors: string;
    borderColors: string;
    players: Player[];
    active: string[];
}

interface Teams {
    GSW: Team;
    Rockets: Team;
}

export default function Page() {
    const [gameState, setGameState] = useState<'selection' | 'simulation'>('selection');
    const [possession, setPossession] = useState<'GSW' | 'Rockets'>('GSW');
    const [ballHolder, setBallHolder] = useState<string | null>(null);
    const [showScore, setShowScore] = useState<boolean>(false);
    const [scoreValue, setScoreValue] = useState<number>(0);
    const [scoringTeam, setScoringTeam] = useState<string>('');
    const [scoringPlayer, setScoringPlayer] = useState<string | null>(null);

    const teams: Teams = {
        GSW: {
            name: 'GSW',
            colors: 'bg-blue-600 text-yellow-400',
            borderColors: 'border-yellow-400',
            players: [
                { id: 'gsw1', name: 'CURRY', position: 'PG' },
                { id: 'gsw2', name: 'PODZIEMSKI', position: 'SG' },
                { id: 'gsw3', name: 'BUTLER', position: 'SF' },
                { id: 'gsw4', name: 'KUMINGA', position: 'PF' },
                { id: 'gsw5', name: 'GREEN', position: 'C' },
            ],

            active: ['gsw1', 'gsw2', 'gsw3', 'gsw4', 'gsw5'],
        },
        Rockets: {
            name: 'Rockets',
            colors: 'bg-red-600 text-white',
            borderColors: 'border-white',
            players: [
                { id: 'rkt1', name: 'VANVLEET', position: 'PG' },
                { id: 'rkt2', name: 'JALEN GREEN', position: 'SG' },
                { id: 'rkt3', name: 'THOMPSON', position: 'SF' },
                { id: 'rkt4', name: 'BROOKS', position: 'PF' },
                { id: 'rkt5', name: 'SENGUN', position: 'C' },
            ],

            active: ['rkt1', 'rkt2', 'rkt3', 'rkt4', 'rkt5'],
        },
    };

    // Avatar mapping for Warriors players
    const warriorsAvatars: { [key: string]: string } = {
        CURRY: '/images/curry.png',
        PODZIEMSKI: '/images/podz.png',
        BUTLER: '/images/butler.png',
        KUMINGA: '/images/kumbucket.png',
        GREEN: '/images/green.png',
    };

    // Avatar mapping for Rockets players
    const rocketsAvatars: { [key: string]: string } = {
        VANVLEET: '/images/Vanvleet.png',
        'JALEN GREEN': '/images/jalengreen.png',
        THOMPSON: '/images/thompson.png',
        BROOKS: '/images/brooks.png',
        SENGUN: '/images/sengun.png',
    };

    // Assign avatars to players (by last name, then fill remaining)
    const warriorsPlayerOrder = ['CURRY', 'PODZIEMSKI', 'BUTLER', 'KUMINGA', 'GREEN'];
    const avatarKeys = Object.keys(warriorsAvatars);
    const playerAvatars: { [key: string]: string } = {};
    let usedAvatars = new Set<string>();
    // First pass: assign by last name
    warriorsPlayerOrder.forEach((lname: string) => {
        if (warriorsAvatars[lname]) {
            playerAvatars[lname] = warriorsAvatars[lname];
            usedAvatars.add(lname);
        }
    });
    // Second pass: assign unused avatars to remaining players
    let unusedAvatars = avatarKeys.filter((k) => !usedAvatars.has(k));
    warriorsPlayerOrder.forEach((lname: string) => {
        if (!playerAvatars[lname] && unusedAvatars.length > 0) {
            const nextAvatar = unusedAvatars.shift();
            if (nextAvatar) {
                playerAvatars[lname] = warriorsAvatars[nextAvatar];
            }
        }
    });

    const rocketsPlayerOrder = ['VANVLEET', 'JALEN GREEN', 'THOMPSON', 'BROOKS', 'SENGUN'];
    const rocketsAvatarKeys = Object.keys(rocketsAvatars);
    const rocketsPlayerAvatars: { [key: string]: string } = {};
    let rocketsUsedAvatars = new Set<string>();
    rocketsPlayerOrder.forEach((lname: string) => {
        if (rocketsAvatars[lname]) {
            rocketsPlayerAvatars[lname] = rocketsAvatars[lname];
            rocketsUsedAvatars.add(lname);
        }
    });
    let rocketsUnusedAvatars = rocketsAvatarKeys.filter((k) => !rocketsUsedAvatars.has(k));
    rocketsPlayerOrder.forEach((lname: string) => {
        if (!rocketsPlayerAvatars[lname] && rocketsUnusedAvatars.length > 0) {
            const nextAvatar = rocketsUnusedAvatars.shift();
            if (nextAvatar) {
                rocketsPlayerAvatars[lname] = rocketsAvatars[nextAvatar];
            }
        }
    });

    const [courtPositions, setCourtPositions] = useState<CourtPositions>({
        GSW: [
            { left: '10%', top: '60%' },
            { left: '18%', top: '65%' },
            { left: '26%', top: '70%' },
            { left: '34%', top: '65%' },
            { left: '42%', top: '60%' },
        ],

        Rockets: [
            { left: '58%', top: '60%' },
            { left: '66%', top: '65%' },
            { left: '74%', top: '70%' },
            { left: '82%', top: '65%' },
            { left: '90%', top: '60%' },
        ],
    });
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    useEffect(() => {
        if (gameState === 'simulation') {
            setIsAnimating(true);

            // More dynamic randomized positions for both teams
            const warriorsBasePositions: Position[] = [
                { left: '10%', top: '60%' },
                { left: '18%', top: '65%' },
                { left: '26%', top: '70%' },
                { left: '34%', top: '65%' },
                { left: '42%', top: '60%' },
            ];

            const rocketsBasePositions: Position[] = [
                { left: '58%', top: '60%' },
                { left: '66%', top: '65%' },
                { left: '74%', top: '70%' },
                { left: '82%', top: '65%' },
                { left: '90%', top: '60%' },
            ];

            // Create animation frames
            let frameCount = 0;
            const maxFrames = 10;
            const animationInterval = setInterval(() => {
                if (frameCount >= maxFrames) {
                    clearInterval(animationInterval);
                    return;
                }

                // Generate random movements for each player
                const randomizePositions = (basePositions: Position[]): Position[] => {
                    return basePositions.map((pos) => {
                        const leftBase = parseInt(pos.left);
                        const topBase = parseInt(pos.top);

                        // More movement during middle frames, less at start/end
                        const moveFactor = Math.sin((frameCount / maxFrames) * Math.PI) * 15;

                        return {
                            left: `${leftBase + (Math.random() * moveFactor - moveFactor / 2)}%`,
                            top: `${topBase + (Math.random() * moveFactor - moveFactor / 2)}%`,
                        };
                    });
                };

                setCourtPositions({
                    GSW: randomizePositions(warriorsBasePositions),
                    Rockets: randomizePositions(rocketsBasePositions),
                });

                frameCount++;
            }, 200); // Update positions every 200ms

            // Reset after play ends
            const timeout = setTimeout(() => {
                clearInterval(animationInterval);
                setCourtPositions({
                    GSW: warriorsBasePositions,
                    Rockets: rocketsBasePositions,
                });
                setIsAnimating(false);
            }, 3000);

            return () => {
                clearInterval(animationInterval);
                clearTimeout(timeout);
            };
        } else {
            // Initial positions when not simulating
            setCourtPositions({
                GSW: [
                    { left: '10%', top: '60%' },
                    { left: '18%', top: '65%' },
                    { left: '26%', top: '70%' },
                    { left: '34%', top: '65%' },
                    { left: '42%', top: '60%' },
                ],

                Rockets: [
                    { left: '58%', top: '60%' },
                    { left: '66%', top: '65%' },
                    { left: '74%', top: '70%' },
                    { left: '82%', top: '65%' },
                    { left: '90%', top: '60%' },
                ],
            });
            setIsAnimating(false);
        }
    }, [gameState]);

    const getPlayerIdx = (teamKey: string, playerId: string): number => {
        if (teamKey in teams) {
            return teams[teamKey as keyof Teams].active.indexOf(playerId);
        }
        return -1;
    };

    const handlePlay = () => {
        if (!ballHolder) return;

        setGameState('simulation');

        // Simulate play after a short delay
        setTimeout(() => {
            const isThreePointer = Math.random() > 0.7;
            setScoreValue(isThreePointer ? 3 : 2);
            setScoringTeam(possession);
            setScoringPlayer(ballHolder);
            setShowScore(true);

            // Reset after animation
            setTimeout(() => {
                setShowScore(false);
                setGameState('selection');
            }, 3000);
        }, 1500);
    };

    const handleBallAssignment = (playerId: string) => {
        // Determine the team of the clicked player
        const playerTeam = playerId.startsWith('gsw') ? 'GSW' : 'Rockets';
        // Switch possession if necessary
        if (playerTeam !== possession) {
            setPossession(playerTeam as 'GSW' | 'Rockets');
        }
        // Assign ball to the clicked player
        setBallHolder(playerId);
    };

    const getPlayerById = (playerId: string): Player | undefined => {
        const team = playerId.startsWith('gsw') ? teams.GSW : teams.Rockets;
        return team.players.find((player) => player.id === playerId);
    };

    return (
        <div
            className="min-h-screen w-full relative overflow-hidden font-['Press_Start_2P',monospace] text-xs"
            data-oid="iorpyk:"
        >
            {/* NBA court background image */}
            <div className="absolute inset-0 z-0" data-oid="e9-xv00">
                <img
                    src="/images/bg.png"
                    alt="NBA Court"
                    className="absolute inset-0 w-full h-full object-cover"
                    data-oid="79v.4vz"
                />
            </div>

            {/* Warriors animated avatars on bottom left */}
            {teams.GSW.active.map((pid, i) => {
                const player = teams.GSW.players.find((p) => p.id === pid);
                if (!player) return null;
                const pos = courtPositions.GSW[i] || { left: '10%', top: '60%' };
                const isScorer = scoringPlayer === pid && showScore;
                const isHolder = ballHolder === pid;

                return (
                    <div
                        key={pid}
                        style={{
                            position: 'absolute',
                            left: pos.left,
                            top: pos.top,
                            transition: isAnimating ? 'all 0.2s ease-out' : 'all 0.5s',
                            zIndex: isScorer ? 30 : 10,
                            transform: isScorer ? 'scale(1.5)' : 'scale(1)',
                        }}
                        className={`flex flex-col items-center ${isScorer ? 'shadow-2xl' : ''} ${isHolder ? 'ring-4 ring-yellow-400' : ''}`}
                        data-oid="nm4.ed4"
                    >
                        {playerAvatars[player.name] && (
                            <img
                                src={playerAvatars[player.name]}
                                alt={player.name + ' avatar'}
                                className="w-14 h-14 rounded-full border-4 border-blue-600 bg-white"
                                data-oid="ujlq:.z"
                            />
                        )}
                        <div
                            className="bg-blue-600 text-yellow-400 px-2 py-1 mt-1 rounded text-xs font-bold shadow"
                            data-oid="u0b-yzm"
                        >
                            {player.position}
                            <br data-oid="l7apzsa" />
                            {player.name}
                        </div>
                        {/* Point indicator */}
                        {isScorer && (
                            <div
                                className="absolute -top-6 left-0 right-0 text-center text-2xl text-yellow-400 font-bold animate-bounce"
                                data-oid="06ulo3v"
                            >
                                +{scoreValue}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Center point marker */}
            <div
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-4 border-black z-20"
                style={{ opacity: isAnimating ? 1 : 0 }}
                data-oid="0r7vc1g"
            >
                <div
                    className="w-full h-full flex items-center justify-center text-black font-bold"
                    data-oid="yhxd_hb"
                >
                    C
                </div>
            </div>

            {/* Rockets animated avatars on bottom right */}
            {teams.Rockets.active.map((pid, i) => {
                const player = teams.Rockets.players.find((p) => p.id === pid);
                if (!player) return null;
                const pos = courtPositions.Rockets[i] || { left: '90%', top: '60%' };
                const isScorer = scoringPlayer === pid && showScore;
                const isHolder = ballHolder === pid;

                return (
                    <div
                        key={pid}
                        style={{
                            position: 'absolute',
                            left: pos.left,
                            top: pos.top,
                            transition: isAnimating ? 'all 0.2s ease-out' : 'all 0.5s',
                            zIndex: isScorer ? 30 : 10,
                            transform: isScorer ? 'scale(1.5)' : 'scale(1)',
                        }}
                        className={`flex flex-col items-center ${isScorer ? 'shadow-2xl' : ''} ${isHolder ? 'ring-4 ring-yellow-400' : ''}`}
                        data-oid="cbwy-si"
                    >
                        {rocketsPlayerAvatars[player.name] && (
                            <img
                                src={rocketsPlayerAvatars[player.name]}
                                alt={player.name + ' avatar'}
                                className="w-14 h-14 rounded-full border-4 border-red-600 bg-white"
                                data-oid="lbfexe3"
                            />
                        )}
                        <div
                            className="bg-red-600 text-white px-2 py-1 mt-1 rounded text-xs font-bold shadow"
                            data-oid="de6cx3n"
                        >
                            {player.position}
                            <br data-oid="m9:sqzn" />
                            {player.name}
                        </div>
                        {/* Point indicator */}
                        {isScorer && (
                            <div
                                className="absolute -top-6 left-0 right-0 text-center text-2xl text-white font-bold animate-bounce"
                                data-oid="xmd5rz6"
                            >
                                +{scoreValue}
                            </div>
                        )}
                    </div>
                );
            })}

            {gameState === 'selection' && (
                <div className="relative z-10 p-4" data-oid="86w35-e">
                    {/* Team & Roster Overlay */}
                    <div
                        className="mx-auto max-w-4xl bg-gray-900 bg-opacity-80 border-4 border-white p-4 mt-8"
                        data-oid="qi1zslv"
                    >
                        <div className="grid grid-cols-2 gap-4" data-oid="5selc.8">
                            {/* GSW Team */}
                            <div
                                className={`${teams.GSW.colors} p-2 border-4 ${teams.GSW.borderColors}`}
                                data-oid="4hs0blf"
                            >
                                <h2 className="text-center mb-4 text-lg" data-oid="hf7xg00">
                                    GSW
                                </h2>
                                <div className="space-y-2" data-oid="r6nld7-">
                                    {teams.GSW.players.map((player) => (
                                        <div
                                            key={player.id}
                                            onClick={() => handleBallAssignment(player.id)}
                                            className={`flex justify-between items-center p-2 border-2 ${teams.GSW.borderColors} cursor-pointer ${ballHolder === player.id ? 'bg-yellow-400 text-blue-600' : ''}`}
                                            data-oid="g75uxsf"
                                        >
                                            <span data-oid="l5dy0me">{player.position}</span>
                                            <span data-oid="5q:kpsp">{player.name}</span>
                                            {/* Avatar image for this player */}
                                            {playerAvatars[player.name] && (
                                                <img
                                                    src={playerAvatars[player.name]}
                                                    alt={player.name + ' avatar'}
                                                    className="w-8 h-8 rounded-full border-2 border-blue-600 bg-white"
                                                    data-oid="6uj90-m"
                                                />
                                            )}
                                            {ballHolder === player.id && (
                                                <span className="ml-2 text-lg" data-oid="5v9mnyq">
                                                    🏀
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Rockets Team */}
                            <div
                                className={`${teams.Rockets.colors} p-2 border-4 ${teams.Rockets.borderColors}`}
                                data-oid="18j89c6"
                            >
                                <h2 className="text-center mb-4 text-lg" data-oid="kltdkrf">
                                    ROCKETS
                                </h2>
                                <div className="space-y-2" data-oid="p4_dg63">
                                    {teams.Rockets.players.map((player) => (
                                        <div
                                            key={player.id}
                                            onClick={() => handleBallAssignment(player.id)}
                                            className={`flex justify-between items-center p-2 border-2 ${teams.Rockets.borderColors} cursor-pointer ${ballHolder === player.id ? 'bg-white text-red-600' : ''}`}
                                            data-oid="9.5kem7"
                                        >
                                            <span data-oid="y0b1pl0">{player.position}</span>
                                            <span data-oid="t:v:-6n">{player.name}</span>
                                            {/* Avatar image for this player */}
                                            {rocketsPlayerAvatars[player.name] && (
                                                <img
                                                    src={rocketsPlayerAvatars[player.name]}
                                                    alt={player.name + ' avatar'}
                                                    className="w-8 h-8 rounded-full border-2 border-red-600 bg-white"
                                                    data-oid="89x0f1h"
                                                />
                                            )}
                                            {ballHolder === player.id && (
                                                <span className="ml-2 text-lg" data-oid="r8w0od_">
                                                    🏀
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Possession Selection */}
                        <div
                            className="mt-6 p-4 border-4 border-white bg-gray-800"
                            data-oid="t-3kv_a"
                        >
                            <h3 className="text-white mb-4 text-center" data-oid="d-g1pm9">
                                POSSESSION
                            </h3>
                            <div className="flex justify-center space-x-8" data-oid="tigzh.d">
                                <button
                                    onClick={() => setPossession('GSW')}
                                    className={`px-4 py-2 border-4 ${possession === 'GSW' ? 'bg-blue-600 text-yellow-400 border-yellow-400' : 'bg-gray-700 text-gray-300 border-gray-500'}`}
                                    data-oid="e00phhu"
                                >
                                    GSW
                                </button>
                                <button
                                    onClick={() => setPossession('Rockets')}
                                    className={`px-4 py-2 border-4 ${possession === 'Rockets' ? 'bg-red-600 text-white border-white' : 'bg-gray-700 text-gray-300 border-gray-500'}`}
                                    data-oid="n5j5lmt"
                                >
                                    ROCKETS
                                </button>
                            </div>
                        </div>

                        {/* Play Button */}
                        <div className="mt-8 flex justify-center" data-oid="8pevik3">
                            <button
                                onClick={handlePlay}
                                disabled={!ballHolder}
                                className={`px-12 py-4 text-2xl border-4 border-white bg-green-600 text-white hover:bg-green-500 transition-colors ${!ballHolder ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'}`}
                                data-oid="pas-ad:"
                            >
                                PLAY
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {gameState === 'simulation' && (
                <div
                    className="relative z-10 h-screen flex items-center justify-center"
                    data-oid="8kkg:wb"
                >
                    {/* Confetti effect for scoring team */}
                    {showScore && (
                        <div className="absolute inset-0 pointer-events-none" data-oid="rz.46rh">
                            {[...Array(50)].map((_, i) => {
                                const size = Math.floor(Math.random() * 8) + 4;
                                const left = Math.floor(Math.random() * 100);
                                const animationDuration = Math.random() * 2 + 1;
                                const delay = Math.random();

                                const colors =
                                    scoringTeam === 'GSW'
                                        ? ['bg-blue-600', 'bg-yellow-400']
                                        : ['bg-red-600', 'bg-white'];

                                const color = colors[Math.floor(Math.random() * colors.length)];

                                return (
                                    <div
                                        key={i}
                                        className={`absolute ${color} opacity-80`}
                                        style={{
                                            width: `${size}px`,
                                            height: `${size}px`,
                                            left: `${left}%`,
                                            top: '-20px',
                                            animation: `fall ${animationDuration}s linear ${delay}s`,
                                        }}
                                        data-oid="x65:t6f"
                                    ></div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Global styles for animations */}
            <style jsx global data-oid="e0utp60">{`
                @keyframes fall {
                    0% {
                        transform: translateY(-20px);
                    }
                    100% {
                        transform: translateY(100vh);
                    }
                }
            `}</style>
        </div>
    );
}
