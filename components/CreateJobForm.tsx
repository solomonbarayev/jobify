"use client";

import { createAndEditJobSchema, JobMode, JobStatus, CreateAndEditJobType } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Form } from "./ui/form";
import { CustomFormField, CustomFormSelect } from "./FormComponent";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJobAction } from "@/utils/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const CreateJobForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateAndEditJobType) => createJobAction(values),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: "There was an error creating the job",
        });
        return;
      }
      toast({ description: "job created" });
      ["jobs", "stats", "charts"].forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));

      router.push("/jobs");
    },
  });

  const onSubmit = (values: CreateAndEditJobType) => {
    mutate(values);
  };

  const form = useForm<CreateAndEditJobType>({
    resolver: zodResolver(createAndEditJobSchema),
    defaultValues: {
      position: "",
      company: "",
      location: "",
      status: JobStatus.Pending,
      mode: JobMode.FullTime,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-muted p-8 rounded">
        <h2 className="capitalize font-semibold text-4xl mb-6">add job</h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
          <CustomFormField name="position" control={form.control} />
          <CustomFormField name="company" control={form.control} />
          <CustomFormField name="location" control={form.control} />
          <CustomFormSelect name="status" control={form.control} items={Object.values(JobStatus)} labelText="job status" />
          <CustomFormSelect name="mode" control={form.control} items={Object.values(JobMode)} labelText="job mode" />
          <Button type="submit" className="self-end capitalize" disabled={isPending}>
            {isPending ? "Creating..." : "Create Job"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateJobForm;
