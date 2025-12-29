/**
 * Process repeating events and generate recurring instances
 * @param {Array} events - Array of events with potentially repeating patterns
 * @returns {Array} - Array of events with all recurring instances expanded
 */
export function processRepeatingEvents(events) {
    if (!events || !Array.isArray(events)) return [];

    const processedEvents = [];
    const today = new Date();

    events.forEach((event) => {
        // Add the original event
        const convertedEvent = convertEventFormat(event);
        processedEvents.push(convertedEvent);

        // Generate repeating events if repeatedly is not "none"
        if (event.repeatedly && event.repeatedly !== "none") {
            const repeatingInstances = generateRepeatingInstances(event, today);
            processedEvents.push(...repeatingInstances);
        }
    });

    return processedEvents;
}

/**
 * Convert event from new format to FullCalendar format
 * @param {Object} event - Event in either old or new format
 * @returns {Object} - Event in FullCalendar format
 */
function convertEventFormat(event) {
    // Handle new format with snake_case fields (start_date, end_date, start_hour, end_hour)
    if (event.start_date || event.startDate) {
        const startDate = event.start_date || event.startDate;
        const endDate = event.end_date || event.endDate;
        const startTime = event.start_hour || event.startTime;
        const endTime = event.end_hour || event.endTime;

        // Build start and end datetime strings
        let start, end;

        if (event.allDay) {
            start = startDate;
            end = endDate || startDate;
        } else {
            start = startTime ? `${startDate}T${startTime}` : startDate;
            end = endTime ? `${endDate || startDate}T${endTime}` : startDate;
        }

        return {
            id: event.id?.toString() || Date.now().toString(),
            title: event.title || "",
            start,
            end,
            description: event.description || "",
            category: event.category || "Agency",
            status: event.status || "pending",
            type: event.type || "offline",
            repeatedly: event.repeatedly || "none",
            color: event.color || "#3b82f6",
            allDay: event.allDay || false,
            guests: event.guests || [],
            url: event.url || "",
            className: `fc-event-${(event.category || "default").toLowerCase()}`,
            "data-category": event.category || "default",
        };
    }

    // Handle old format with start/end
    return {
        id: event.id?.toString() || Date.now().toString(),
        title: event.title || "",
        start: event.start,
        end: event.end,
        description: event.description || "",
        category: event.category || "Agency",
        status: event.status || "pending",
        type: event.type || "offline",
        repeatedly: event.repeatedly || "none",
        color: event.color || "#3b82f6",
        allDay: event.allDay || false,
        guests: event.guests || [],
        url: event.url || "",
        className: `fc-event-${(event.category || "default").toLowerCase()}`,
        "data-category": event.category || "default",
    };
}

/**
 * Generate repeating instances of an event
 * @param {Object} event - Base event to repeat
 * @param {Date} currentDate - Current date for limit calculation
 * @returns {Array} - Array of repeating event instances
 */
function generateRepeatingInstances(event, currentDate) {
    const instances = [];
    const maxEvents = 50; // Limit to prevent infinite loops
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2); // Generate events up to 2 years from now

    // Get base date from event
    const baseDate = new Date(event.startDate || event.start_date || event.start);
    const baseId = parseInt(event.id) || Date.now();

    let currentDateCopy = new Date(baseDate);

    for (let i = 1; i < maxEvents; i++) {
        // Advance date based on repeat pattern
        switch (event.repeatedly) {
            case "daily":
                currentDateCopy.setDate(currentDateCopy.getDate() + 1);
                break;

            case "weekly":
                currentDateCopy.setDate(currentDateCopy.getDate() + 7);
                break;

            case "monthly":
                currentDateCopy.setMonth(currentDateCopy.getMonth() + 1);
                break;

            case "yearly":
                currentDateCopy.setFullYear(currentDateCopy.getFullYear() + 1);
                break;

            default:
                break;
        }

        // Stop if we've gone beyond the max date
        if (currentDateCopy > maxDate) {
            break;
        }

        // Create instance
        const instance = createEventInstance(event, currentDateCopy, baseId + i);
        instances.push(instance);
    }

    return instances;
}

/**
 * Create a single instance of a repeating event
 * @param {Object} baseEvent - Base event template
 * @param {Date} instanceDate - Date for this instance
 * @param {Number} instanceId - Unique ID for this instance
 * @returns {Object} - Event instance
 */
function createEventInstance(baseEvent, instanceDate, instanceId) {
    const dateStr = instanceDate.toLocaleDateString("en-CA"); // YYYY-MM-DD format

    // Handle time based on event format
    let start, end;

    if (baseEvent.start_date || baseEvent.startDate) {
        // New format - prioritize snake_case fields
        const startTime = baseEvent.start_hour || baseEvent.startTime;
        const endTime = baseEvent.end_hour || baseEvent.endTime;

        if (baseEvent.allDay) {
            start = dateStr;
            end = dateStr;
        } else {
            start = startTime ? `${dateStr}T${startTime}` : dateStr;
            end = endTime ? `${dateStr}T${endTime}` : dateStr;
        }
    } else {
        // Old format - extract time from start/end if available
        const originalStart = new Date(baseEvent.start);
        const originalEnd = new Date(baseEvent.end);

        if (baseEvent.allDay) {
            start = dateStr;
            end = dateStr;
        } else {
            // Preserve original times
            const timeStart = originalStart.toTimeString().slice(0, 5);
            const timeEnd = originalEnd.toTimeString().slice(0, 5);
            start = `${dateStr}T${timeStart}`;
            end = `${dateStr}T${timeEnd}`;
        }
    }

    return {
        id: instanceId.toString(),
        title: baseEvent.title,
        start,
        end,
        description: baseEvent.description || "",
        category: baseEvent.category || "Agency",
        status: baseEvent.status || "pending",
        type: baseEvent.type || "offline",
        repeatedly: baseEvent.repeatedly,
        color: baseEvent.color || "#3b82f6",
        allDay: baseEvent.allDay || false,
        guests: baseEvent.guests || [],
        url: baseEvent.url || "",
        className: `fc-event-${(baseEvent.category || "default").toLowerCase()}`,
        "data-category": baseEvent.category || "default",
    };
}
