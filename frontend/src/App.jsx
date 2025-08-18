import React, { useState } from 'react';

// --- ICONS (inline SVGs for simplicity) ---
const ShieldCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-emerald-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>;
const AlertTriangle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-amber-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>;
const Zap = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const Search = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-indigo-500"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const UniversalAccess = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-fuchsia-500"><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/><path d="M12 22c-2.209 0-4-1.791-4-4"/><path d="M12 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m19.071 4.929-.707.707"/><path d="m5.636 18.364-.707.707"/><path d="M22 12h-2"/><path d="M4 12H2"/><path d="m19.071 19.071-.707-.707"/><path d="m5.636 5.636-.707-.707"/></svg>;
const Bug = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-red-500"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M20.97 9c-.1-2.1-1.7-3.8-3.6-4"/><path d="M6 13H2"/><path d="M18 13h4"/><path d="m2.71 18.29 1.42-1.42"/><path d="m18.29 2.71 1.42 1.42"/></svg>;
const BrainCircuit = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 2a2.5 2.5 0 0 1 3 4.25"/><path d="M12 2a2.5 2.5 0 0 0-3 4.25"/><path d="M15 6.25A2.5 2.5 0 0 1 18 9"/><path d="M9 6.25A2.5 2.5 0 0 0 6 9"/><path d="M18 9a2.5 2.5 0 0 1 3 4.25"/><path d="M6 9a2.5 2.5 0 0 0-3 4.25"/><path d="M21 13.25A2.5 2.5 0 0 1 18 16"/><path d="M3 13.25A2.5 2.5 0 0 0 6 16"/><path d="M18 16a2.5 2.5 0 0 1-3 4.25"/><path d="M6 16a2.5 2.5 0 0 0 3 4.25"/><path d="M15 20.25a2.5 2.5 0 0 1-3 1.5"/><path d="M9 20.25a2.5 2.5 0 0 0-3 1.5"/><path d="M12 21.75v-1.5"/><path d="M12 13.25a2.5 2.5 0 0 1-3-4.25"/><path d="M12 13.25a2.5 2.5 0 0 0 3-4.25"/><circle cx="12" cy="12" r="3"/></svg>;
const Wrench = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>;
const Loader = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin h-5 w-5"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>;

// --- API CONFIG ---
const API_URL = "http://127.0.0.1:8000"; 

// --- HELPER FUNCTIONS ---
const getSeverityClass = (severity) => {
    switch (severity?.toLowerCase()) {
        case 'high': return 'bg-red-100 text-red-800 border-red-400';
        case 'medium': return 'bg-amber-100 text-amber-800 border-amber-400';
        case 'low': return 'bg-blue-100 text-blue-800 border-blue-400';
        default: return 'bg-gray-100 text-gray-800 border-gray-400';
    }
};

const getRiskLevelClass = (level) => {
    switch (level?.toLowerCase()) {
        case 'critical': return 'text-red-600';
        case 'high': return 'text-orange-500';
        case 'medium': return 'text-amber-500';
        case 'low': return 'text-emerald-500';
        default: return 'text-gray-500';
    }
};

// --- UI COMPONENTS ---

const Header = () => (
    <header className="bg-slate-900 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <ShieldCheck />
                <h1 className="text-2xl font-bold tracking-tight">GuardianWeb</h1>
            </div>
            <p className="hidden md:block text-slate-400">AI-Powered Website Health Analyzer</p>
        </div>
    </header>
);

const RiskGauge = ({ score }) => {
    const getRotation = (s) => {
        const clampedScore = Math.max(0, Math.min(100, s));
        return (clampedScore / 100) * 180 - 90;
    };
    const rotation = getRotation(score);
    const riskLevel = score <= 50 ? "critical" : score <= 70 ? "high" : score <= 90 ? "medium" : "low";
    const colorClass = getRiskLevelClass(riskLevel);

    return (
        <div className="relative w-64 h-32 mx-auto">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[200%] rounded-[50%] border-[20px] border-solid border-gray-200 dark:border-gray-700 border-b-transparent border-l-transparent transform -rotate-45"></div>
                <div 
                    className="absolute top-0 left-0 w-full h-[200%] rounded-[50%] border-[20px] border-solid border-b-transparent border-l-transparent transform -rotate-45 transition-all duration-500"
                    style={{ borderColor: 'currentColor', transform: `rotate(${rotation}deg)` }}
                ></div>
            </div>
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 text-center ${colorClass}`}>
                <span className="text-5xl font-bold">{score}</span>
                <span className="block text-lg capitalize">{riskLevel} Risk</span>
            </div>
        </div>
    );
};

const AnomalyCard = ({ anomaly }) => (
    <div className={`p-4 rounded-lg border-l-4 ${getSeverityClass(anomaly.severity)}`}>
        <p className="font-semibold text-lg">{anomaly.message}</p>
        {anomaly.recommendation && <p className="mt-2 text-sm">{anomaly.recommendation}</p>}
        {anomaly.context_note && <p className="mt-2 text-xs italic text-slate-500">Note: {anomaly.context_note}</p>}
    </div>
);

const RecommendationCard = ({ recommendation }) => {
    const codeSnippetRegex = /`([^`]+)`/;
    const match = recommendation.match(codeSnippetRegex);

    if (match) {
        const textBefore = recommendation.substring(0, match.index);
        const snippet = match[1];
        return (
            <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                <p className="text-slate-300">{textBefore}</p>
                <code className="block bg-slate-900 text-cyan-300 p-3 rounded-md mt-3 font-mono text-sm whitespace-pre-wrap">
                    {snippet}
                </code>
            </div>
        );
    }

    return (
        <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
            <p className="text-slate-300">{recommendation}</p>
        </div>
    );
};

const TabButton = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            isActive 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-500 hover:bg-slate-700 hover:text-white'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const ResultsDashboard = ({ data, onReset }) => {
    const [activeTab, setActiveTab] = useState('security');

    if (!data) return null;

    const {
        url, risk_score, anomalies, screenshot,
        recommendations, ai_summary
    } = data;

    const filteredAnomalies = anomalies.filter(a => a.type === activeTab);

    const tabs = [
        { id: 'security', label: 'Security', icon: <ShieldCheck /> },
        { id: 'performance', label: 'Performance', icon: <Zap /> },
        { id: 'seo', label: 'SEO', icon: <Search /> },
        { id: 'accessibility', label: 'Accessibility', icon: <UniversalAccess /> },
        { id: 'malware', label: 'Malware', icon: <Bug /> },
    ];

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
            {/* Top Row: Score & Screenshot */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col justify-center items-center">
                    <h2 className="text-xl font-bold text-white mb-4 text-center">Overall Risk Score</h2>
                    <RiskGauge score={risk_score} />
                </div>
                <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4">Website Snapshot</h2>
                    <p className="text-sm text-slate-400 mb-2 break-all">URL: <a href={url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{url}</a></p>
                    {screenshot ? (
                        <img src={screenshot} alt={`Screenshot of ${url}`} className="rounded-lg border-2 border-slate-700 w-full h-auto object-contain max-h-96" />
                    ) : (
                        <div className="flex items-center justify-center h-64 bg-slate-700 rounded-lg">
                            <p className="text-slate-400">Screenshot not available.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Summary Card */}
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border-l-4 border-cyan-500">
                <div className="flex items-center space-x-3 mb-3">
                    <BrainCircuit />
                    <h2 className="text-xl font-bold text-white">AI-Powered Summary</h2>
                </div>
                <p className="text-slate-300">{ai_summary}</p>
            </div>
            
            {/* Main Content: Tabs and Details */}
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold text-white">Vulnerability Details</h2>
                    <div className="flex flex-wrap gap-2 p-1 bg-slate-900 rounded-lg">
                        {tabs.map(tab => (
                            <TabButton 
                                key={tab.id}
                                {...tab}
                                isActive={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                            />
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    {filteredAnomalies.length > 0 ? (
                        filteredAnomalies.map((anomaly, index) => <AnomalyCard key={index} anomaly={anomaly} />)
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            <ShieldCheck />
                            <p className="mt-2 font-semibold">No {activeTab} issues found.</p>
                            <p className="text-sm">This category looks clean!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recommendations Section */}
            {recommendations && recommendations.length > 0 && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-3 mb-4">
                        <Wrench />
                        <h2 className="text-xl font-bold text-white">Actionable Recommendations</h2>
                    </div>
                    <div className="space-y-4">
                        {recommendations.map((rec, index) => (
                            <RecommendationCard key={index} recommendation={rec} />
                        ))}
                    </div>
                </div>
            )}
            
            <div className="text-center mt-8">
                <button 
                    onClick={onReset}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105"
                >
                    Scan Another Site
                </button>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
export default function App() {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!url) {
            setError("Please enter a valid URL.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const response = await fetch(`${API_URL}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `An error occurred: ${response.statusText}`);
            }

            const data = await response.json();
            setAnalysisResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setUrl('');
        setAnalysisResult(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
            <Header />
            <main>
                {!analysisResult ? (
                    <div className="container mx-auto flex flex-col items-center justify-center py-12 px-4 text-center">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-3">Uncover Website Vulnerabilities</h2>
                        <p className="text-lg text-slate-400 max-w-2xl mb-8">
                            Enter a URL to perform a comprehensive security, performance, and SEO analysis powered by AI.
                        </p>
                        <form onSubmit={handleAnalyze} className="w-full max-w-2xl">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="e.g., example.com"
                                    className="flex-grow px-4 py-3 rounded-md bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-md flex items-center justify-center gap-2 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <><Loader /> Analyzing...</> : 'Analyze Now'}
                                </button>
                            </div>
                        </form>
                        {error && (
                            <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded-md flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5"/>
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <ResultsDashboard data={analysisResult} onReset={handleReset} />
                )}
            </main>
            <footer className="text-center p-4 text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} GuardianWeb. All rights reserved.</p>
            </footer>
        </div>
    );
}
