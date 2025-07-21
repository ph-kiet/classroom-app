"use client";

import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import AddStudentDialog from "./dialogs/add-student-dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import useStudentStore, { IStudent } from "@/stores/student-store";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDisclosure } from "@/hooks/use-disclosure";
import EditStudentDialog from "./dialogs/edit-student-dialog";
import DeleteStudentDialog from "./dialogs/delete-student-dialog";

export default function StudentsTable() {
  const { students, loadStudents, setSelectedStudent } = useStudentStore();
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onClose, onToggle, onOpen } = useDisclosure();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    (async () => {
      await loadStudents(); // Load all students to table
      setIsLoading(false);
    })();
  }, [loadStudents]);

  const handleEdit = (student: IStudent) => {
    setSelectedStudent(student);
    onOpen(); // Open edit dialog
  };

  const handleDelete = (student: IStudent) => {
    setSelectedStudent(student);
    setIsDeleteOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between py-4 space-x-5">
        <div className="text-xl font-bold">{students.length} Students</div>
        <AddStudentDialog>
          <Button>
            <Plus />
            Add student
          </Button>
        </AddStudentDialog>
      </div>
      <div className="rounded-md border">
        <Table>
          {isLoading && (
            <TableCaption className="mb-4">
              <Spinner />
            </TableCaption>
          )}
          {students.length === 0 && !isLoading && (
            <TableCaption className="mb-4">No students.</TableCaption>
          )}
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  {student.status === "active" ? (
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Pending Verification
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                      >
                        <MoreHorizontal />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem onSelect={() => handleEdit(student)}>
                        <Pencil />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => handleDelete(student)}>
                        <Trash2 className="text-red-600" />
                        <span className="text-red-600">Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditStudentDialog
        isOpen={isOpen}
        onClose={onClose}
        onToggle={onToggle}
      />
      <DeleteStudentDialog
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
      />
    </>
  );
}
