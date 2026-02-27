'use client';

import { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';

interface ProductTourProps {
    run: boolean;
    setRun: (run: boolean) => void;
}

export default function ProductTour({ run, setRun }: ProductTourProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Automatically start tour if first visit
        const hasSeenTour = localStorage.getItem('cfip_tour_seen');
        if (!hasSeenTour) {
            // setTimeout ensures the UI is painted before joyride calculates positions
            setTimeout(() => setRun(true), 1500);
        }
    }, [setRun]);

    const steps: Step[] = [
        {
            target: '.main-content',
            content: (
                <div>
                    <h3>Welcome to CFIP! 👋</h3>
                    <p>This is your Command Center. CFIP is the premier AI-driven Code Forensics Intelligence Platform built for regulated industries.</p>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: '#tour-repo-search',
            content: 'Initiate dynamic live scans right here. By default, it runs against the aero-copilot demo repo.',
            placement: 'bottom',
        },
        {
            target: '#tour-nav-copilot',
            content: 'Our newest feature: The AI Copilot. Talk securely to your private codebase using a local gemma3 instance hooked to a ChromaDB Vector Store!',
            placement: 'right',
        },
        {
            target: '#tour-nav-engineering',
            content: 'View automated Engineering Insights. We flag DevOps, Architecture, and Database schema drift accurately.',
            placement: 'right',
        },
        {
            target: '#tour-nav-remediation',
            content: 'Generate actionable AI remediation patches for any of the technical debt that we discover.',
            placement: 'right',
        },
        {
            target: '#tour-nav-governance',
            content: 'All actions and Live Repository Scans are permanently recorded in the Enterprise Audit Trail to maintain strict BFSI compliance.',
            placement: 'right',
        },
        {
            target: '#tour-doc-btn',
            content: 'You can restart this tour anytime by clicking the Book icon up here. Enjoy exploring CFIP!',
            placement: 'bottom-end',
        }
    ];

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem('cfip_tour_seen', 'true');
        }
    };

    if (!mounted) return null;

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showSkipButton
            showProgress
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    primaryColor: '#6366f1',
                    backgroundColor: '#1e293b',
                    textColor: '#f8fafc',
                    overlayColor: 'rgba(15, 23, 42, 0.75)',
                    arrowColor: '#1e293b',
                    zIndex: 10000,
                },
                tooltipContainer: {
                    textAlign: 'left',
                },
                buttonNext: {
                    backgroundColor: '#6366f1',
                    borderRadius: '4px',
                },
                buttonBack: {
                    color: '#94a3b8',
                },
                buttonSkip: {
                    color: '#94a3b8',
                }
            }}
        />
    );
}
