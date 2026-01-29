export function processRepeatingEvents(eventsData) {
    if (!eventsData) return [];

    const events = eventsData.events || eventsData;

    if (!Array.isArray(events)) return [];

    const processedEvents = [];
    const today = new Date();

    events.forEach((event) => {
        const convertedEvent = convertEventFormat(event);
        processedEvents.push(convertedEvent);

        if (event.repeatedly && event.repeatedly !== "none") {
            const repeatingInstances = generateRepeatingInstances(event, today);
            processedEvents.push(...repeatingInstances);
        }
    });

    return processedEvents;
}

function convertEventFormat(event) {
    if (event.start_date || event.startDate) {
        const startDate = event.start_date || event.startDate;
        const endDate = event.end_date || event.endDate;
        const startTime = event.start_hour || event.startTime;
        const endTime = event.end_hour || event.endTime;

        const isAllDay = Boolean(event.all_day);

        let start, end;

        if (isAllDay) {
            // For all-day events, use date-only format
            start = startDate;
            end = endDate || startDate;
        } else {
            // For timed events, ensure proper ISO format with timezone
            if (startTime && endTime) {
                start = `${startDate}T${startTime}:00`;
                end = `${endDate || startDate}T${endTime}:00`;
            } else if (startTime) {
                start = `${startDate}T${startTime}:00`;
                end = `${endDate || startDate}T${startTime}:00`;
            } else {
                // Default to 9 AM if no time specified
                start = `${startDate}T09:00:00`;
                end = `${endDate || startDate}T10:00:00`;
            }
        }

        const isMultiDay = !isAllDay && start && end &&
            new Date(start).toDateString() !== new Date(end).toDateString();

        const normalizedCategory = event.category
            ? event.category.charAt(0).toUpperCase() + event.category.slice(1).toLowerCase()
            : "Agency";

        const convertedEvent = {
            id: event.id?.toString() || Date.now().toString(),
            title: event.title || "",
            start,
            end,
            description: event.description || "",
            category: normalizedCategory,
            status: event.status || "pending",
            type: event.type || "offline",
            repeatedly: event.repeatedly || "none",
            color: event.color || "#3b82f6",
            allDay: isAllDay,
            guests: event.guests && Array.isArray(event.guests) ? event.guests : [],
            url: event.url || "",
            className: `fc-event-${(event.category || "default").toLowerCase()}${isAllDay ? " fc-event-all-day" : ""}${isMultiDay ? " fc-event-multi-day" : ""}`,
            "data-category": normalizedCategory,
            "style": { "--event-color": event.color || "#3b82f6" }
        };

        return convertedEvent;
    }

    const isMultiDay = event.start && event.end &&
        !event.allDay &&
        new Date(event.start).toDateString() !== new Date(event.end).toDateString();

    const normalizedCategory = event.category
        ? event.category.charAt(0).toUpperCase() + event.category.slice(1).toLowerCase()
        : "Agency";

    return {
        id: event.id?.toString() || Date.now().toString(),
        title: event.title || "",
        start: event.start,
        end: event.end,
        description: event.description || "",
        category: normalizedCategory,
        status: event.status || "pending",
        type: event.type || "offline",
        repeatedly: event.repeatedly || "none",
        color: event.color || "#3b82f6",
        allDay: event.allDay || false,
        guests: event.guests && Array.isArray(event.guests) ? event.guests : [],
        url: event.url || "",
        className: `fc-event-${(event.category || "default").toLowerCase()}${event.allDay ? " fc-event-all-day" : ""}${isMultiDay ? " fc-event-multi-day" : ""}`,
        "data-category": normalizedCategory,
        "style": { "--event-color": event.color || "#3b82f6" }
    };
}

function generateRepeatingInstances(event) {
    const instances = [];
    const maxEvents = 700;
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 5);

    const baseDate = new Date(event.startDate || event.start_date || event.start);
    const baseId = parseInt(event.id) || Date.now();

    let currentDateCopy = new Date(baseDate);

    for (let i = 1; i < maxEvents; i++) {
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

        if (currentDateCopy > maxDate) {
            break;
        }

        const instance = createEventInstance(event, currentDateCopy, baseId, i);
        instances.push(instance);
    }

    return instances;
}

function createEventInstance(baseEvent, instanceDate, baseId, instanceIndex) {
    const dateStr = instanceDate.toLocaleDateString("en-CA");

    const isAllDay = Boolean(baseEvent.all_day);

    let start, end;

    if (baseEvent.start_date || baseEvent.startDate) {
        const startTime = baseEvent.start_hour || baseEvent.startTime;
        const endTime = baseEvent.end_hour || baseEvent.endTime;

        if (isAllDay) {
            start = dateStr;
            end = dateStr;
        } else {
            // Ensure proper ISO format with seconds
            if (startTime && endTime) {
                start = `${dateStr}T${startTime}:00`;
                end = `${dateStr}T${endTime}:00`;
            } else if (startTime) {
                start = `${dateStr}T${startTime}:00`;
                end = `${dateStr}T${startTime}:00`;
            } else {
                // Default to 9 AM if no time specified
                start = `${dateStr}T09:00:00`;
                end = `${dateStr}T10:00:00`;
            }
        }
    } else {
        const originalStart = new Date(baseEvent.start);
        const originalEnd = new Date(baseEvent.end);

        if (isAllDay) {
            start = dateStr;
            end = dateStr;
        } else {
            const timeStart = originalStart.toTimeString().slice(0, 8);
            const timeEnd = originalEnd.toTimeString().slice(0, 8);
            start = `${dateStr}T${timeStart}`;
            end = `${dateStr}T${timeEnd}`;
        }
    }

    const isMultiDay = !isAllDay && start && end &&
        new Date(start).toDateString() !== new Date(end).toDateString();

    const normalizedCategory = baseEvent.category
        ? baseEvent.category.charAt(0).toUpperCase() + baseEvent.category.slice(1).toLowerCase()
        : "Agency";

    const uniqueId = `${baseId}-${baseEvent.repeatedly}-${instanceIndex}`;

    return {
        id: uniqueId,
        title: baseEvent.title,
        start,
        end,
        description: baseEvent.description || "",
        category: normalizedCategory,
        status: baseEvent.status || "pending",
        type: baseEvent.type || "offline",
        repeatedly: baseEvent.repeatedly,
        color: baseEvent.color || "#3b82f6",
        allDay: isAllDay,
        guests: baseEvent.guests && Array.isArray(baseEvent.guests) ? baseEvent.guests : [],
        url: baseEvent.url || "",
        className: `fc-event-${(baseEvent.category || "default").toLowerCase()}${isAllDay ? " fc-event-all-day" : ""}${isMultiDay ? " fc-event-multi-day" : ""}`,
        "data-category": normalizedCategory,
        "style": { "--event-color": baseEvent.color || "#3b82f6" }
    };
}