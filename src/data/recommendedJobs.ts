
import { JobListing } from "@/types/job";

export const recommendedJobs: JobListing[] = [
  {
    id: "rec-job-1",
    title: "Python Developer Trainee",
    company: "Pixelfactor solutions",
    location: "Remote",
    description: "We are looking for a passionate and self-driven Python Developer Trainee to join our team. This position is ideal for individuals who want to kickstart or grow their career in software development, with a focus on Python programming.",
    date: new Date().toISOString(),
    url: "https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4172742565",
    tags: ["HTML", "CSS", "JavaScript", "SQL", "MySQL", "Python"],
    salary: "Not specified",
    platform: "arbeitnow"
  },
  {
    id: "rec-job-2",
    title: "Software Engineering Intern",
    company: "Coherent corp.",
    location: "Hyderabad",
    description: "Understand requirement and work independently by exploring features related technologies. Able to explore opensource tools and AI based tools and able to integrate in existing or new application.",
    date: new Date().toISOString(),
    url: "https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4166960299",
    tags: ["Angular", "JavaScript", "MongoDB", "HTML", "CSS"],
    salary: "Not specified",
    platform: "arbeitnow"
  },
  {
    id: "rec-job-3",
    title: "Developer",
    company: "Wipro",
    location: "Hyderabad",
    description: "The purpose of this role is to design, test and maintain software programs for operating systems or applications which needs to be deployed at a client end and ensure its meet 100% quality assurance parameters",
    date: new Date().toISOString(),
    url: "https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4174283845",
    tags: ["C/C++", "Java", "SQL", "CS fundamentals"],
    salary: "Not specified",
    platform: "arbeitnow"
  }
];
