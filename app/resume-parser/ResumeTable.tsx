import { Fragment } from "react";
import { cx } from "../lib/cx";
import { deepClone } from "../lib/parse-resume-from-pdf/deep-clone";
import {
  initialEducation,
  initialWorkExperience,
} from "../lib/redux/resumeSlice";
import { Resume } from "../lib/redux/types";

const TableRowHeader = ({ children }: { children: React.ReactNode }) => (
  <tr className="divide-x bg-gray-50">
    <th className="px-3 py-2 font-semibold" scope="colgroup" colSpan={2}>
      {children}
    </th>
  </tr>
);

const TableRow = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string | string[];
  className?: string | false;
}) => (
  <tr className={cx("divide-x", className)}>
    <th className="px-3 py-2 font-medium" scope="row">
      {label}
    </th>
    <td className="w-full px-3 py-2">
      {typeof value === "string"
        ? value
        : value.map((x, idx) => <Fragment key={idx}>• {x}</Fragment>)}
    </td>
  </tr>
);

export const ResumeTable = ({ resume }: { resume: Resume }) => {
  const educations =
    resume.educations.length === 0
      ? [deepClone(initialEducation)]
      : resume.educations;
  const workExperiences =
    resume.workExperiences.length === 0
      ? [deepClone(initialWorkExperience)]
      : resume.workExperiences;
  const skills = [...resume.skills.descriptions];
  const featuredSkills = resume.skills.featuredSkills
    .filter((item) => item.skill.trim())
    .map((item) => item.skill)
    .join(", ")
    .trim();
  if (featuredSkills) {
    skills.unshift(featuredSkills);
  }

  return (
    <table className="mt-2 w-full border text-sm text-gray-900">
      <tbody className="divide-y text-left align-top">
        <TableRowHeader>Perfil</TableRowHeader>
        <TableRow label="Nome" value={resume.profile.name} />
        <TableRow label="Email" value={resume.profile.email} />
        <TableRow label="Telefone" value={resume.profile.phone} />
        <TableRow label="Endereço" value={resume.profile.location} />
        <TableRow label="Link" value={resume.profile.url} />
        <TableRow label="Sobre Você" value={resume.profile.summary} />
        <TableRowHeader>Educação</TableRowHeader>
        {educations.map((education, idx) => (
          <Fragment key={idx}>
            <TableRow label="Escola" value={education.school} />
            <TableRow label="Graduação" value={education.degree} />
            <TableRow label="Data" value={education.date} />
            <TableRow
              label="Descrição"
              value={education.descriptions}
              className={
                educations.length - 1 !== 0 &&
                idx !== educations.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        <TableRowHeader>Experiências</TableRowHeader>
        {workExperiences.map((workExperience, idx) => (
          <Fragment key={idx}>
            <TableRow label="Empresas" value={workExperience.company} />
            <TableRow label="Cargos" value={workExperience.jobTitle} />
            <TableRow label="Data" value={workExperience.date} />
            <TableRow
              label="Descrição"
              value={workExperience.descriptions}
              className={
                workExperiences.length - 1 !== 0 &&
                idx !== workExperiences.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        {resume.projects.length > 0 && (
          <TableRowHeader>Projetos</TableRowHeader>
        )}
        {resume.projects.map((project, idx) => (
          <Fragment key={idx}>
            <TableRow label="Projetos" value={project.project} />
            <TableRow label="Data" value={project.date} />
            <TableRow
              label="Descrição"
              value={project.descriptions}
              className={
                resume.projects.length - 1 !== 0 &&
                idx !== resume.projects.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        <TableRowHeader>Habilidades</TableRowHeader>
        <TableRow label="Descrição" value={skills} />
      </tbody>
    </table>
  );
};
