import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import useStudentStore from "@/stores/student-store";
import { useState } from "react";
import { toast } from "sonner";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface IProps {
  isDeleteOpen: boolean;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteStudentDialog({
  isDeleteOpen,
  setIsDeleteOpen,
}: IProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedStudent, deleteStudent } = useStudentStore();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${SERVER_URL}/students/${selectedStudent?.phoneNumber}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const { error } = await response.json();
        if (error.type === "system") {
          toast.error(error.message);
        }
        setIsLoading(false);
      }

      const data = await response.json();
      deleteStudent(data.deletedStudent);
      setIsLoading(false);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Confirm</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to delete <b>{selectedStudent?.name}</b>? This action
            cannot be undone!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner size="small" className="text-background" />
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
