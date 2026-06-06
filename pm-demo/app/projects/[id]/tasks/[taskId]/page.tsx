import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTask, getProject, getTeamMembers } from "@/lib/data";
import { TaskEditForm } from "@/components/task-edit-form";

type Props = { params: Promise<{ id: string; taskId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { taskId } = await params;
  const task = await getTask(taskId);
  return { title: task ? task.title : "Task not found" };
}

export const dynamic = "force-dynamic";

export default async function TaskDetailPage({ params }: Props) {
  const { id, taskId } = await params;

  const [task, project, teamMembers] = await Promise.all([
    getTask(taskId),
    getProject(id),
    getTeamMembers(),
  ]);

  if (!task || !project || task.projectId !== id) notFound();

  return (
    <TaskEditForm task={task} project={project} teamMembers={teamMembers} />
  );
}
