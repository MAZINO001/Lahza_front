import React, { useState } from "react";
import {
  ChevronLeft,
  Mail,
  Phone,
  Github,
  Linkedin,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";

const teamMemberData = {
  id: 1,
  name: "Sarah Johnson",
  jobTitle: "Senior Frontend Developer",
  email: "sarah.johnson@company.com",
  phone: "+1 (555) 123-4567",
  contractType: "CDI",
  contractStartDate: "2021-03-15",
  contractEndDate: null,
  salary: 85000,
  bankName: "Chase Bank",
  bankAccountNumber: "****4532",
  iban: "US64CHAS0001234567890",
  emergencyContactName: "John Johnson",
  emergencyContactPhone: "+1 (555) 123-7890",
  certifications: "AWS Certified Solutions Architect",
  portfolio: "https://sarahjohnson.dev",
  github: "https://github.com/sarahjohnson",
  linkedin: "https://linkedin.com/in/sarahjohnson",
  department: "Engineering",
};
import { useAuthContext } from "@/hooks/AuthContext";
export default function TeamUserViewPage() {
  const [isEditing, setIsEditing] = useState(false);
  const { role } = useAuthContext();
  const getContractBadge = (type) => {
    const styles = {
      CDI: "bg-slate-100 text-slate-700",
      CDD: "bg-slate-100 text-slate-700",
      Freelance: "bg-slate-100 text-slate-700",
      Intern: "bg-slate-100 text-slate-700",
    };
    return styles[type] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="h-screen bg-background">
      <div className="">
        <div className="mx-auto px-4 py-4">
          <div className="flex items-start justify-between mb-4">
            <Link
              to={`/${role}/settings/team_management`}
              className="p-2 -ml-2 flex items-center gap-4  hover:bg-slate-100 rounded transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
              <span>return</span>
            </Link>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 text-sm font-medium bg-slate-900 text-white rounded hover:bg-slate-400 transition-colors"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-end gap-4">
              <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-semibold text-slate-700">
                  {teamMemberData.name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  {teamMemberData.name}
                </h1>
                <p className="text-slate-500 text-sm">
                  {teamMemberData.jobTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${getContractBadge(
                  teamMemberData.contractType
                )}`}
              >
                {teamMemberData.contractType}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 py-4">
        <div className="flex items-start justify-between w-full gap-4 ">
          <div className="md:col-span-2 space-y-4 w-[50%]">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                Contact
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a
                    href={`mailto:${teamMemberData.email}`}
                    className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {teamMemberData.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <a
                    href={`tel:${teamMemberData.phone}`}
                    className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {teamMemberData.phone}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                Links
              </h2>
              <div className="flex gap-3">
                {teamMemberData.github && (
                  <a
                    href={teamMemberData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-slate-100 rounded transition-colors"
                  >
                    <Github className="w-4 h-4 text-slate-600" />
                  </a>
                )}
                {teamMemberData.linkedin && (
                  <a
                    href={teamMemberData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-slate-100 rounded transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-slate-600" />
                  </a>
                )}
                {teamMemberData.portfolio && (
                  <a
                    href={teamMemberData.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Portfolio
                  </a>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                Certifications
              </h2>
              <p className="text-sm text-slate-600">
                {teamMemberData.certifications}
              </p>
            </div>
          </div>
          <div className="space-y-4 w-[50%]">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                Employment
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Department</p>
                  <p className="text-sm font-medium text-slate-900">
                    {teamMemberData.department}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Start Date
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(
                      teamMemberData.contractStartDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                Compensation
              </h2>
              <div>
                <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Annual Salary
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  ${teamMemberData.salary.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                Banking
              </h2>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Bank</p>
                  <p className="text-sm text-slate-900">
                    {teamMemberData.bankName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Account</p>
                  <p className="text-sm font-mono text-slate-900">
                    {teamMemberData.bankAccountNumber}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                Emergency
              </h2>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Contact</p>
                  <p className="text-sm text-slate-900">
                    {teamMemberData.emergencyContactName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Phone</p>
                  <a
                    href={`tel:${teamMemberData.emergencyContactPhone}`}
                    className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {teamMemberData.emergencyContactPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
