"use client";

import { FileText, Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const title = "No Files";

const Example = ({ onUploadClick }) => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <FileText />
      </EmptyMedia>
      <EmptyTitle>No files uploaded</EmptyTitle>
      <EmptyDescription>
        This folder is empty. Upload files or create new documents to get
        started.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <div className="flex gap-2">
        <Button onClick={onUploadClick}>
          <Upload />
          Upload Files
        </Button>
      </div>
    </EmptyContent>
  </Empty>
);

export default Example;
