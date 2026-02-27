import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  usePacks,
  useDeletePack,
  useUpdatePack,
} from "@/features/plans/hooks/usePacks";
import { useAuthContext } from "@/hooks/AuthContext";
import { PackForm } from "@/features/plans/components/PackForm";

export default function PacksList() {
  const navigate = useNavigate();
  const { role } = useAuthContext();

  const { data: packsData, isLoading } = usePacks();
  const packs = packsData?.data ?? [];

  const deletePack = useDeletePack();
  const updatePack = useUpdatePack();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState(null);

  const handleDelete = (id, name) => {
    deletePack.mutate(id);
  };

  const handleEdit = (pack) => {
    setEditingPack(pack);
    setEditModalOpen(true);
  };

  const toggleActive = (id, current) => {
    updatePack.mutate({ id, is_active: !current });
  };

  const createModal = (
    <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Create Subscription Pack</DialogTitle>
        </DialogHeader>
        <PackForm
          onSuccess={() => setCreateModalOpen(false)}
          onCancel={() => setCreateModalOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );

  const editModal = (
    <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Edit Subscription Pack</DialogTitle>
        </DialogHeader>
        <PackForm
          pack={editingPack}
          onSuccess={() => {
            setEditModalOpen(false);
            setEditingPack(null);
          }}
          onCancel={() => {
            setEditModalOpen(false);
            setEditingPack(null);
          }}
        />
      </DialogContent>
    </Dialog>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-muted-foreground animate-pulse text-sm">
          Loading subscription packs...
        </div>
      </div>
    );
  }

  if (packs.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="space-y-3 max-w-md">
          <h2 className="text-2xl font-semibold tracking-tight">
            No subscription packs yet
          </h2>
          <p className="text-muted-foreground">
            Create your first pack to start offering subscription plans.
          </p>
        </div>

        <Button size="lg" onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-5 w-5" />
          Create First Pack
        </Button>

        {createModal}
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">
            Subscription Packs
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your available subscription offerings
          </p>
        </div>

        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Pack
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
        {packs.map((pack) => (
          <Card
            key={pack.id}
            className={cn(
              "group relative overflow-hidden transition-all",
              !pack.is_active && "opacity-70",
              "cursor-pointer",
            )}
            onClick={() =>
              navigate(`/${role}/settings/plans_management/${pack.id}`)
            }
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4 ">
                <div className="min-w-0 flex-1 space-y-1">
                  <CardTitle className="truncate text-base font-semibold max-w-[calc(100%-60px)]">
                    {pack.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {pack.plans.length || 0} plan
                    {pack.plans.length !== 1 ? "s" : ""}
                  </CardDescription>
                </div>

                <Badge
                  variant={pack.is_active ? "default" : "outline"}
                  className={cn(
                    "mt-0.5 shrink-0 absolute right-4",
                    !pack.is_active && "text-muted-foreground",
                  )}
                >
                  {pack.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pb-16 relative ">
              <p className="text-sm text-muted-foreground line-clamp-3 min-h-18">
                {pack.description || "No description provided."}
              </p>

              {/* Bottom actions bar */}
              <div
                className={cn(
                  "absolute bottom-0 inset-x-0 h-14 ",
                  "border-t bg-linear-to-t from-background via-background/95 to-transparent ",
                  "px-4 flex items-center justify-between",
                )}
              >
                {/* Toggle */}
                <div
                  className="flex items-center gap-2.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Switch
                    checked={pack.is_active}
                    onCheckedChange={() =>
                      toggleActive(pack.id, pack.is_active)
                    }
                  />
                  <span className="text-xs font-medium text-muted-foreground hidden sm:block">
                    {pack.is_active ? "Active" : "Disabled"}
                  </span>
                </div>

                {/* Actions */}
                <div
                  className="flex items-center gap-1 "
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-accent/60"
                    onClick={() => handleEdit(pack)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Pack?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{pack.name}" and all
                          associated plans. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleDelete(pack.id, pack.name)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {createModal}
      {editModal}
    </div>
  );
}
