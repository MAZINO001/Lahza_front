import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarDebug() {
    const [currentView, setCurrentView] = useState("dayGridMonth");
    const [debugInfo, setDebugInfo] = useState([]);

    const addDebugInfo = (info) => {
        setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
    };

    // Test events
    const testEvents = [
        {
            id: '1',
            title: 'Test Event Today',
            start: new Date().toISOString().split('T')[0] + 'T10:00:00',
            end: new Date().toISOString().split('T')[0] + 'T11:00:00',
            color: '#3b82f6'
        },
        {
            id: '2',
            title: 'Test Event Tomorrow',
            start: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T14:00:00',
            end: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T15:00:00',
            color: '#ef4444'
        }
    ];

    useEffect(() => {
        addDebugInfo("Calendar component mounted");
    }, []);

    const handleViewDidMount = (viewInfo) => {
        addDebugInfo(`View mounted: ${viewInfo.view.type}`);
        setCurrentView(viewInfo.view.type);
    };

    const handleDateClick = (info) => {
        addDebugInfo(`Date clicked: ${info.dateStr}`);
    };

    const handleEventClick = (info) => {
        addDebugInfo(`Event clicked: ${info.event.title}`);
    };

    const handleLoading = (bool) => {
        addDebugInfo(`Loading: ${bool}`);
    };

    const testViewSwitch = () => {
        const views = ['dayGridMonth', 'timeGridWeek', 'timeGridDay', 'listWeek'];
        let viewIndex = views.indexOf(currentView);
        viewIndex = (viewIndex + 1) % views.length;
        const nextView = views[viewIndex];
        addDebugInfo(`Manually switching to: ${nextView}`);
        // This will be handled by FullCalendar's toolbar
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Calendar Debug Component</h2>
                <div className="bg-gray-100 p-3 rounded mb-4 max-h-40 overflow-y-auto">
                    <h3 className="font-semibold mb-1">Debug Log:</h3>
                    {debugInfo.map((info, index) => (
                        <div key={index} className="text-sm text-gray-700">
                            {info}
                        </div>
                    ))}
                </div>
                <button
                    onClick={testViewSwitch}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                    Test View Switch
                </button>
                <span className="text-sm">Current View: <strong>{currentView}</strong></span>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <FullCalendar
                    plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        listPlugin,
                        interactionPlugin,
                    ]}
                    initialView="dayGridMonth"
                    firstDay={1}
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                    }}
                    events={testEvents}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    loading={handleLoading}
                    viewDidMount={handleViewDidMount}
                    height="auto"
                    slotMinTime="06:00:00"
                    slotMaxTime="24:00:00"
                    allDaySlot={true}
                    scrollTime="08:00:00"
                    eventTimeFormat={{
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    }}
                    displayEventEnd={true}
                />
            </div>
        </div>
    );
}
