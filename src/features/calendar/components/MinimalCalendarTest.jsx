import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

export default function MinimalCalendarTest() {
    // Simple test events with proper FullCalendar format
    const testEvents = [
        {
            id: '1',
            title: 'Test Event 1 - Today',
            start: new Date().toISOString().split('T')[0] + 'T10:00:00',
            end: new Date().toISOString().split('T')[0] + 'T11:00:00',
            backgroundColor: '#3b82f6',
            borderColor: '#2563eb'
        },
        {
            id: '2',
            title: 'Test Event 2 - Tomorrow',
            start: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T14:00:00',
            end: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T15:00:00',
            backgroundColor: '#ef4444',
            borderColor: '#dc2626'
        },
        {
            id: '3',
            title: 'All Day Event',
            start: new Date(Date.now() + 172800000).toISOString().split('T')[0],
            allDay: true,
            backgroundColor: '#10b981',
            borderColor: '#059669'
        }
    ];

    console.log("🧪 Minimal Calendar Test - Events:", testEvents);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Minimal Calendar Test</h2>
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mb-4">
                <p className="text-sm">This is a minimal test to verify if FullCalendar views work properly.</p>
                <p className="text-sm">Try switching between Month, Week, Day, and List views.</p>
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
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                    }}
                    events={testEvents}
                    height="auto"
                    viewDidMount={(viewInfo) => {
                        console.log("🧪 Test View mounted:", viewInfo.view.type);
                    }}
                    loading={(bool) => {
                        console.log("🧪 Test Loading:", bool);
                    }}
                />
            </div>
        </div>
    );
}
