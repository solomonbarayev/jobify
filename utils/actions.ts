"use server";

import prisma from "./db";
import { JobType, CreateAndEditJobType, createAndEditJobSchema, GetAllJobsActionTypes } from "./types";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { auth } from "@clerk/nextjs/server";

function authenticateAndRedirect(): string {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return userId;
}

export async function createJobAction(values: CreateAndEditJobType): Promise<JobType | null> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const { userId } = auth() as { userId: string };
  // const userId = authenticateAndRedirect();

  try {
    createAndEditJobSchema.parse(values);
    const job: JobType = await prisma.job.create({
      data: { ...values, clerkId: userId },
    });
    return job;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getAllJobsAction({ search, jobStatus, page = 1, limit = 10 }: GetAllJobsActionTypes): Promise<{
  jobs: JobType[];
  count: number;
  page: number;
  totalPages: number;
}> {
  const { userId } = auth() as { userId: string };

  try {
    let whereClause: Prisma.JobWhereInput = {
      clerkId: userId,
    };
    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          {
            position: {
              contains: search,
            },
          },
          {
            company: {
              contains: search,
            },
          },
        ],
      };
    }
    if (jobStatus && jobStatus !== "all") {
      whereClause = {
        ...whereClause,
        status: jobStatus,
      };
    }

    const jobs: JobType[] = await prisma.job.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { jobs, count: 0, page: 1, totalPages: 0 };
  } catch (error) {
    console.error(error);
    return { jobs: [], count: 0, page: 1, totalPages: 0 };
  }
}

export async function deleteJobAction(id: string): Promise<JobType | null> {
  const { userId } = auth() as { userId: string };

  try {
    const job = await prisma.job.delete({
      where: {
        id: id,
        clerkId: userId,
      },
    });
    return job;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getSingleJobAction(id: string): Promise<JobType | null> {
  const { userId } = auth() as { userId: string };
  let job: JobType | null = null;

  try {
    job = await prisma.job.findUnique({
      where: {
        id,
        clerkId: userId,
      },
    });
    return job;
  } catch (error) {
    console.error(error);
    job = null;
  }

  if (!job) {
    redirect("/jobs");
  }

  return job;
}

export async function updateJobAction(id: string, values: CreateAndEditJobType): Promise<JobType | null> {
  const { userId } = auth() as { userId: string };

  try {
    const job: JobType = await prisma.job.update({
      where: {
        id,
        clerkId: userId,
      },
      data: {
        ...values,
      },
    });
    return job;
  } catch (error) {
    console.error(error);
    return null;
  }
}
