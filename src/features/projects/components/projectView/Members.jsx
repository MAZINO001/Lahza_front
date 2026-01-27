import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users } from "lucide-react";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { useNavigate } from "react-router-dom";

export default function Members({ projectTeam, role, projectId }) {
    const navigate = useNavigate();

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-foreground mb-4">
                Team Members ({projectTeam?.length || 0})
            </h3>
            <div className="space-y-3">
                {Array.isArray(projectTeam) && projectTeam.length > 0 ? (
                    projectTeam.map((teamMember) => (
                        <div
                            key={teamMember?.id}
                            className="flex items-center justify-between p-3 bg-secondary rounded-lg border  transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="w-9 h-9">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {teamMember?.team_user?.name
                                            ?.split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()
                                            .slice(0, 2) || "TM"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        {teamMember?.team_user?.user?.name}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        {teamMember?.team_user?.poste}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">
                                    {teamMember?.team_user?.department || "Development"}
                                </p>
                            </div>
                        </div>
                    ))
                ) : Array.isArray(projectTeam) ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Users />
                            </EmptyMedia>
                            <EmptyTitle>No team members</EmptyTitle>
                            <EmptyDescription>
                                This project has no assigned members yet.
                            </EmptyDescription>
                        </EmptyHeader>
                        {role === "admin" && (
                            <EmptyContent>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        navigate(`/${role}/project/${projectId}/settings`)
                                    }
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Project Settings
                                </Button>
                            </EmptyContent>
                        )}
                    </Empty>
                ) : null}
            </div>
        </div>
    );
}
