import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTask, getProject, getTeamMembers, getComments } from "@/lib/data";
import { TaskEditForm } from "@/components/task-edit-form";
import { TaskComments } from "@/components/task-comments";

type Props = { params: Promise<{ id: string; taskId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { taskId } = await params;
  const task = await getTask(taskId);
  return { title: task ? task.title : "Task not found" };
}

export const dynamic = "force-dynamic";

export default async function TaskDetailPage({ params }: Props) {
  const { id, taskId } = await params;

  const [task, project, teamMembers, comments] = await Promise.all([
    getTask(taskId),
    getProject(id),
    getTeamMembers(),
    getComments(taskId),
  ]);

  if (!task || !project || task.projectId !== id) notFound();

  return (
    <div className="space-y-8">
      <TaskEditForm task={task} project={project} teamMembers={teamMembers} />
      <TaskComments
        comments={comments}
        taskId={task.id}
        projectId={project.id}
        teamMembers={teamMembers}
      />
    </div>
  );
}
