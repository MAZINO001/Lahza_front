import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";

const items = [
  {
    id: 10,
    date: "Jun 21, 2024",
    title: "Post-Launch Review",
    description:
      "Analyzed user feedback, system performance, and KPIs. Identified improvement areas for next iteration.",
  },
  {
    id: 9,
    date: "Jun 7, 2024",
    title: "Public Launch",
    description:
      "Project officially released to end users. Monitoring traffic, errors, and initial adoption metrics.",
  },
  {
    id: 8,
    date: "May 31, 2024",
    title: "Final Bug Fixes",
    description:
      "Resolved critical bugs discovered during staging. Polished UI interactions and edge cases.",
  },
  {
    id: 7,
    date: "May 17, 2024",
    title: "Staging Deployment",
    description:
      "Deployed application to staging environment for final validation and stakeholder approval.",
  },
  {
    id: 6,
    date: "May 3, 2024",
    title: "Feature Freeze",
    description:
      "Locked new features to focus fully on stability, testing, and documentation.",
  },
  {
    id: 5,
    date: "Apr 26, 2024",
    title: "Integration Testing",
    description:
      "Verified communication between frontend, backend, and third-party services.",
  },
  {
    id: 4,
    date: "Apr 19, 2024",
    title: "Testing & Deployment",
    description:
      "Quality assurance testing, performance optimization, and production deployment preparation.",
  },
  {
    id: 3,
    date: "Apr 5, 2024",
    title: "Development Sprint",
    description:
      "Backend API implementation and frontend component development in progress.",
  },
  {
    id: 2,
    date: "Mar 22, 2024",
    title: "Design Phase",
    description:
      "Completed wireframes and user interface mockups. Stakeholder review and feedback incorporated.",
  },
  {
    id: 1,
    date: "Mar 15, 2024",
    title: "Project Kickoff",
    description:
      "Initial team meeting and project scope definition. Established key milestones and resource allocation.",
  },
];

export default function Component() {
  return (
    <Timeline>
      {items.map((item) => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className="sm:group-data-[orientation=vertical]/timeline:ms-32 "
        >
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineDate className="sm:group-data-[orientation=vertical]/timeline:absolute sm:group-data-[orientation=vertical]/timeline:-left-32 sm:group-data-[orientation=vertical]/timeline:w-20 sm:group-data-[orientation=vertical]/timeline:text-right">
              {item.date}
            </TimelineDate>
            <TimelineTitle className="sm:-mt-0.5">{item.title}</TimelineTitle>
            <TimelineIndicator />
          </TimelineHeader>
          <TimelineContent>{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
