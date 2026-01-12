export function requestNotificationPermission() {
    if (!("Notification" in window)) {
        console.log("Browser doesn't support notifications");
        return;
    }

    if (Notification.permission === "granted") {
        console.log("Notification permission already granted");
        return;
    }

    if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted");
            }
        });
    }
}
export function showBrowserNotification(title, options = {}) {
    if (Notification.permission === "granted") {
        new Notification(title, {
            icon: "/images/logo.png",
            tag: "app-notification",
            requireInteraction: false,
            ...options
        });
    }
}