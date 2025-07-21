"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import AddLessonDialog from "./dialogs/add-lesson-dialog";
import LessonItem from "./lesson-item";
import useLessonStore from "@/stores/lesson-store";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import useAuthStore from "@/stores/auth-store";

export default function LessonList() {
  const { lessons, loadLessons } = useLessonStore();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    (async () => {
      await loadLessons(); // Load all lessons
      setIsLoading(false);
    })();
  }, [loadLessons]);

  return (
    <>
      <div className="flex items-center justify-between py-4 space-x-5">
        <div className="text-xl font-bold">{lessons.length} Lessons</div>
        {user?.role === "instructor" && (
          <AddLessonDialog>
            <Button>
              <Plus />
              Add lesson
            </Button>
          </AddLessonDialog>
        )}
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <LessonItem key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </>
  );
}
