"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDisclosure } from "@/hooks/use-disclosure";
import useLessonStore from "@/stores/lesson-store";
import { IStudent } from "@/stores/student-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import z from "zod";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface IProps {
  children: React.ReactNode;
}

const studentSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  studentIds: z.array(z.string()).min(1, {
    message: "At least one student must be selected",
  }),
});

export default function AddLessonDialog({ children }: IProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const [students, setStudents] = useState<IStudent[]>([]);
  const { addLesson } = useLessonStore();

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      title: "",
      description: "",
      studentIds: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      (async () => {
        try {
          const response = await fetch(`${SERVER_URL}/students`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          const data = await response.json();
          setStudents(data.students);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [isOpen]);

  async function onSubmit(values: z.infer<typeof studentSchema>) {
    try {
      const response = await fetch(`${SERVER_URL}/lessons/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (!response.ok) {
        const { error } = await response.json();
        form.setError(error.type, { message: error.message });
      }

      const data = await response.json();
      addLesson(data.lesson);

      form.reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new lesson</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Form {...form}>
            <form
              id="add-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson title</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studentIds"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Assign to</FormLabel>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">Select</TableHead>
                            <TableHead>Name</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {students.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>
                                <Checkbox
                                  className="ml-3"
                                  checked={field.value.includes(student.id)}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...field.value, student.id]
                                      : field.value.filter(
                                          (id) => id !== student.id
                                        );
                                    field.onChange(newValue);
                                  }}
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                {student.name}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            form="add-form"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Spinner size="small" className="text-background" />
            ) : (
              "Add"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
