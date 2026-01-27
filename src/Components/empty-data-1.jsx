"use client";

import { Plus, Table } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const getTableConfig = (tableType) => {
  const configs = {
    invoices: {
      title: "No invoices to display",
      description: "There are no invoices in this table yet. Add your first invoice to get started.",
      buttonText: "Add New Invoice",
      route: (role) => `/${role}/invoice/new`
    },
    quotes: {
      title: "No quotes to display",
      description: "There are no quotes in this table yet. Add your first quote to get started.",
      buttonText: "Add New Quote",
      route: (role) => `/${role}/quote/new`
    },
    services: {
      title: "No services to display",
      description: "There are no services in this table yet. Add your first service to get started.",
      buttonText: "Add New Service",
      route: (role) => `/${role}/service/new`
    },
    projects: {
      title: "No projects to display",
      description: "There are no projects in this table yet. Add your first project to get started.",
      buttonText: "Add New Project",
      route: (role) => `../project/new`
    },
    offers: {
      title: "No offers to display",
      description: "There are no offers in this table yet. Add your first offer to get started.",
      buttonText: "Add New Offer",
      route: (role) => `/${role}/offer/new`
    },
    receipts: {
      title: "No receipts to display",
      description: "There are no receipts in this table yet.",
      buttonText: null,
      route: null
    },
    payments: {
      title: "No payments to display",
      description: "There are no payments in this table yet.",
      buttonText: null,
      route: null
    },
    system_logs: {
      title: "No system logs to display",
      description: "There are no system logs in this table yet.",
      buttonText: null,
      route: null
    },
    clients: {
      title: "No clients to display",
      description: "There are no clients in this table yet. Add your first client to get started.",
      buttonText: "Add New Client",
      route: (role) => `/${role}/client/new`
    },
    expenses: {
      title: "No expenses to display",
      description: "There are no expenses in this table yet. Add your first expense to get started.",
      buttonText: "Add New Expense",
      route: (role) => `/${role}/expense/new`
    }
  };

  return configs[tableType] || {
    title: "No data to display",
    description: "There are no records in this table yet.",
    buttonText: null,
    route: null
  };
};

export const EmptyData = ({ tableType, role, customComponent }) => {
  const config = getTableConfig(tableType);

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Table />
        </EmptyMedia>
        <EmptyTitle>{config.title}</EmptyTitle>
        <EmptyDescription>
          {config.description}
        </EmptyDescription>
      </EmptyHeader>
      {customComponent ? (
        <EmptyContent>
          {customComponent}
        </EmptyContent>
      ) : config.buttonText && role && role !== "client" ? (
        <EmptyContent>
          <Link to={config.route(role)}>
            <Button>
              <Plus />
              {config.buttonText}
            </Button>
          </Link>
        </EmptyContent>
      ) : null}
    </Empty>
  );
};

export default EmptyData;
