import useLessonStore, { ILesson } from "@/stores/lesson-store";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";
import useAuthStore from "@/stores/auth-store";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface IProps {
  lesson: ILesson;
}

export default function LessonItem({ lesson }: IProps) {
  const { user } = useAuthStore();
  const { makeDone } = useLessonStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckChange = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${SERVER_URL}/lessons/makeCompleted/${lesson.id}`,
        {
          method: "PUT",
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
        return;
      }

      makeDone(lesson.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={cn(
        "flex h-full cursor-pointer flex-col transition-shadow hover:shadow-md",
        lesson.completed ? "opacity-70" : ""
      )}
    >
      <CardContent className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-start space-x-3">
            {/* {user?.role === "student" && <Checkbox />} */}

            <h3 className="text-md flex-1 leading-none font-medium"></h3>
          </div>

          <h3
            className={cn(
              "text-md flex-1 leading-none font-medium",
              lesson.completed ? "text-muted-foreground line-through" : ""
            )}
          >
            {lesson.title}
          </h3>

          {user?.role === "student" && (
            <div className=" flex flex-wrap items-center gap-1 text-sm">
              Instructor: <b>{lesson.instructorName}</b>
            </div>
          )}

          <div className=" flex flex-wrap items-center gap-1 text-sm">
            Description: {lesson.description}
          </div>

          {user?.role === "instructor" && (
            <div className="text-muted-foreground flex flex-wrap items-center gap-1 text-sm">
              <span>Assigned to:</span>
              {lesson.students.map((student) => (
                <Badge
                  key={student.id}
                  variant="outline"
                  className="font-normal"
                >
                  {student.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      {user?.role === "student" && !lesson.completed && (
        <CardFooter>
          <Button variant="outline" onClick={handleCheckChange}>
            {isLoading ? (
              <Spinner size="small" className="text-foreground" />
            ) : (
              "Complete"
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
