import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import useStudentStore from "@/stores/student-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

const studentSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.email(),
  phoneNumber: z.string().trim().regex(new RegExp("^\\+[1-9]\\d{1,14}$"), {
    message: "Invalid phone number",
  }),
});

export default function EditStudentDialog({
  isOpen,
  onClose,
  onToggle,
}: IProps) {
  const { selectedStudent, updateStudent } = useStudentStore();
  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

  // Populate selected student to the form
  useEffect(() => {
    if (isOpen && selectedStudent) {
      form.reset({
        name: selectedStudent.name || "",
        email: selectedStudent.email || "",
        phoneNumber: selectedStudent.phoneNumber || "",
      });
    }
  }, [isOpen, selectedStudent, form]);

  async function onSubmit(values: z.infer<typeof studentSchema>) {
    try {
      const response = await fetch(
        `${SERVER_URL}/students/${selectedStudent?.phoneNumber}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
          credentials: "include",
        }
      );
      if (!response.ok) {
        const { error } = await response.json();
        form.setError(error.type, { message: error.message });
      }
      const data = await response.json();
      updateStudent(data.updatedStudent);
      onClose();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update student details</DialogTitle>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter a phone number with the country code (i.e.
                      +84 for VN)
                    </FormDescription>
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
              "Update"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
