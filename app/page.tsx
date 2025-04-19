'use client';

import { useState, useEffect } from 'react';

export default function Page() {
    const [gameState, setGameState] = useState('selection'); // 'selection' or 'simulation'
    const [possession, setPossession] = useState('GSW'); // 'GSW' or 'Rockets'
    const [ballHolder, setBallHolder] = useState(null); // Player ID who has the ball
    const [showScore, setShowScore] = useState(false);
    const [scoreValue, setScoreValue] = useState(0);
    const [scoringTeam, setScoringTeam] = useState('');
    const [scoringPlayer, setScoringPlayer] = useState(null);

    const teams = {
        GSW: {
            name: 'GSW',
            colors: 'bg-blue-600 text-yellow-400',
            borderColors: 'border-yellow-400',
            players: [
                { id: 'gsw1', name: 'CURRY', position: 'PG' },
                { id: 'gsw2', name: 'THOMPSON', position: 'SG' },
                { id: 'gsw3', name: 'GREEN', position: 'PF' },
                { id: 'gsw4', name: 'WIGGINS', position: 'SF' },
                { id: 'gsw5', name: 'LOONEY', position: 'C' },
            ],

            active: ['gsw1', 'gsw2', 'gsw3', 'gsw4', 'gsw5'],
        },
        Rockets: {
            name: 'Rockets',
            colors: 'bg-red-600 text-white',
            borderColors: 'border-white',
            players: [
                { id: 'rkt1', name: 'SENGUN', position: 'C' },
                { id: 'rkt2', name: 'GREEN', position: 'SG' },
                { id: 'rkt3', name: 'SMITH', position: 'PF' },
                { id: 'rkt4', name: 'VANVLEET', position: 'PG' },
                { id: 'rkt5', name: 'BROOKS', position: 'SF' },
            ],

            active: ['rkt1', 'rkt2', 'rkt3', 'rkt4', 'rkt5'],
        },
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

    const handleBallAssignment = (playerId) => {
        // Only assign ball to active players of the team with possession
        const playerTeam = playerId.startsWith('gsw') ? 'GSW' : 'Rockets';
        if (playerTeam === possession && teams[playerTeam].active.includes(playerId)) {
            setBallHolder(playerId);
        }
    };

    const getPlayerById = (playerId) => {
        const team = playerId.startsWith('gsw') ? teams.GSW : teams.Rockets;
        return team.players.find((player) => player.id === playerId);
    };

    return (
        <div
            className="min-h-screen w-full bg-blue-800 relative overflow-hidden font-['Press_Start_2P',monospace] text-xs"
            data-oid="iorpyk:"
        >
            {/* 8-bit court background with pixel art style */}
            <div className="absolute inset-0 z-0" data-oid="e9-xv00">
                {/* Court floor */}
                <div
                    className="absolute inset-0 bg-blue-700 border-4 border-yellow-400"
                    data-oid="v2rxgz-"
                ></div>

                {/* Center circle */}
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-yellow-400 rounded-full"
                    data-oid="z:dii7n"
                ></div>

                {/* Center line */}
                <div
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-4 bg-yellow-400"
                    data-oid="dq.j8mf"
                ></div>

                {/* Three point arcs */}
                <div
                    className="absolute bottom-8 left-8 w-64 h-32 border-4 border-yellow-400 rounded-tl-full"
                    data-oid="swulg_1"
                ></div>
                <div
                    className="absolute bottom-8 right-8 w-64 h-32 border-4 border-yellow-400 rounded-tr-full"
                    data-oid="opwzohl"
                ></div>

                {/* Baskets */}
                <div
                    className="absolute bottom-4 left-1/2 transform -translate-x-32 w-8 h-8 bg-yellow-400"
                    data-oid="t:fije-"
                ></div>
                <div
                    className="absolute bottom-4 right-1/2 transform translate-x-32 w-8 h-8 bg-yellow-400"
                    data-oid="u3bjl.3"
                ></div>

                {/* Pixel art details */}
                <div
                    className="absolute inset-0 bg-black opacity-10 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVQImWNgYGD4z0AEGBiQAFAAazB6YzD6PQAAAABJRU5ErkJggg==')] left-0 top-0"
                    data-oid="1gsciqb"
                ></div>
            </div>

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
                    {/* Court with player sprites */}
                    <div
                        className="grid grid-cols-5 gap-4 w-full max-w-4xl mx-auto"
                        data-oid=":rbqp4u"
                    >
                        {/* GSW Players */}
                        {teams.GSW.active.map((playerId, index) => {
                            const player = getPlayerById(playerId);
                            const isScorer = showScore && scoringPlayer === playerId;

                            return (
                                <div
                                    key={playerId}
                                    className={`relative flex flex-col items-center ${isScorer ? 'animate-bounce' : ''}`}
                                    data-oid="z:uc445"
                                >
                                    <div
                                        className={`w-16 h-16 border-4 ${teams.GSW.borderColors} ${teams.GSW.colors} flex items-center justify-center`}
                                        data-oid="uos8d5b"
                                    >
                                        {player.position}
                                    </div>
                                    <div className="mt-2 text-white text-center" data-oid="uz-tyce">
                                        {player.name}
                                    </div>

                                    {/* Ball indicator */}
                                    {ballHolder === playerId && (
                                        <div
                                            className="absolute -top-4 -right-2 text-2xl"
                                            data-oid="cf:co1n"
                                        >
                                            🏀
                                        </div>
                                    )}

                                    {/* Score animation */}
                                    {isScorer && (
                                        <div
                                            className="absolute -top-8 left-0 right-0 text-center text-2xl text-yellow-400 font-bold animate-ping"
                                            data-oid="fw9atyc"
                                        >
                                            +{scoreValue}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Rockets Players */}
                        {teams.Rockets.active.map((playerId, index) => {
                            const player = getPlayerById(playerId);
                            const isScorer = showScore && scoringPlayer === playerId;

                            return (
                                <div
                                    key={playerId}
                                    className={`relative flex flex-col items-center ${isScorer ? 'animate-bounce' : ''}`}
                                    data-oid="87kxi::"
                                >
                                    <div
                                        className={`w-16 h-16 border-4 ${teams.Rockets.borderColors} ${teams.Rockets.colors} flex items-center justify-center`}
                                        data-oid="gw27sqz"
                                    >
                                        {player.position}
                                    </div>
                                    <div className="mt-2 text-white text-center" data-oid="bwfqxv2">
                                        {player.name}
                                    </div>

                                    {/* Ball indicator */}
                                    {ballHolder === playerId && (
                                        <div
                                            className="absolute -top-4 -right-2 text-2xl"
                                            data-oid="06nuetf"
                                        >
                                            🏀
                                        </div>
                                    )}

                                    {/* Score animation */}
                                    {isScorer && (
                                        <div
                                            className="absolute -top-8 left-0 right-0 text-center text-2xl text-white font-bold animate-ping"
                                            data-oid="bskwnbh"
                                        >
                                            +{scoreValue}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

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
