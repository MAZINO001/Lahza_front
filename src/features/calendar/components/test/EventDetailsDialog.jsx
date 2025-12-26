import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import "./calendar.css";

function EventDetailsDialog({
    open,
    onOpenChange,
    event,
    onEdit,
    onDelete,
    onPreview,
}) {
    if (!event) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getCategoryColor = (category) => {
        const colors = {
            Holiday: "#8b5cf6",
            Agency: "#ef4444",
            Other: "#f59e0b",
            Meeting: "#3b82f6",
            Work: "#10b981",
        };
        return colors[category] || "#6b7280";
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-background text-foreground max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getCategoryColor(event.category) }}
                        />
                        {event.title}
                    </DialogTitle>
                    <DialogDescription>
                        {event.category} • {event.status}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-foreground">Start:</span>
                            <p className="text-muted-foreground font-medium">
                                {formatDate(event.start)}
                            </p>
                        </div>
                        <div>
                            <span className="text-foreground">End:</span>
                            <p className="text-muted-foreground font-medium">
                                {formatDate(event.end)}
                            </p>
                        </div>
                    </div>

                    {event.description && (
                        <div>
                            <span className="text-muted-foreground text-sm">
                                Description:
                            </span>
                            <p className="text-muted-foregroundmt-1">{event.description}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Type:</span>
                            <p className="text-muted-foregroundfont-medium capitalize">
                                {event.type}
                            </p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Repeat:</span>
                            <p className="text-muted-foregroundfont-medium capitalize">
                                {event.repeatedly}
                            </p>
                        </div>
                    </div>

                    {event.url && (
                        <div>
                            <span className="text-muted-foreground text-sm">URL:</span>
                            <p className="text-blue-400 mt-1">{event.url}</p>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onPreview(event)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                        Preview
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onEdit(event)}
                        className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                    >
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => onDelete(event)}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default EventDetailsDialog;
