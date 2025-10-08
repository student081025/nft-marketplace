
import { useContract, useContractEvents } from "@thirdweb-dev/react";
import { STATUS_CONTRACT_ADDRESS } from "../../const/addresses";
import EventCard from "./eventCard";
import styles from "../../styles/Home.module.css";
import { useEffect, useState } from "react";

export default function StatusEvents() {
    const [isLoading, setIsLoading] = useState(true);
    const [visibleEvents, setVisibleEvents] = useState(3); 

    const {
        contract
    } = useContract(STATUS_CONTRACT_ADDRESS);

    const {
        data: statusEvents,
        isLoading: isStatusEventsLoading,
    } = useContractEvents(
        contract,
        "StatusUpdated",
        {
            subscribe: true,
        }
    );

    const loadMoreEvents = () => {
        setVisibleEvents(prev => prev + 3);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className={styles.sectionLoading}>
                {/* <Lottie
                    animationData={loadingLottie}
                    loop={true}
                /> */}
            </div>
        );
    };

    return (
        <div style={{ marginLeft: '2rem', paddingBottom: '30px' }}>
            {!isStatusEventsLoading && statusEvents && (
                <>
                    {statusEvents.slice(0, visibleEvents).map((event, index) => (
                        <div key={index} style={{ marginBottom: '1rem' }}>
                            <EventCard
                                walletAddress={event.data.user}
                                newstatus={event.data.newstatus}
                                timeStamp={event.data.timestamp}
                            />
                        </div>
                    ))}
                    {statusEvents.length > visibleEvents && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '2rem',
                            marginBottom: '0.1rem'
                        }}>
                            <button
                                onClick={loadMoreEvents}
                                style={{
                                    backgroundColor: '#ededed',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '12px 24px',
                                    fontSize: '1rem',
                                    fontWeight: '400',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s ease',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#BDBDBD'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ededed'}
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}